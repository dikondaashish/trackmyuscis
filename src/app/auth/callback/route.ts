import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";
import { recordGoogleSignupConsent } from "@/lib/supabase/consent";
import { fillNameFromGoogle } from "@/lib/supabase/google-name";

/**
 * Where Google sign-in, the sign-up confirmation link and the password-reset link land.
 * Swaps the one-time code for a session, then sends the person on to `next` (our pages only).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  const fail = (reason: string) => NextResponse.redirect(new URL(`/sign-in?error=${reason}`, origin));

  if (searchParams.get("error")) return fail("link_expired");
  if (!code) return fail("callback_failed");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // The code verifier lives in the browser that asked for the link.
    return fail(/verifier/i.test(error.message) ? "other_browser" : "link_expired");
  }

  await recordGoogleSignupConsent(supabase, data.user);
  await fillNameFromGoogle(supabase, data.user);

  const response = NextResponse.redirect(new URL(next, origin));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
