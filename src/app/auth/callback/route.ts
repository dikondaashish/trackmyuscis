import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { POLICY_VERSION, safeNext } from "@/lib/auth";

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

  // First Google sign-in creates the account: record that they agreed to Terms and Privacy
  // (the Google button says so on the sign-up page).
  const user = data.user;
  const isNew = user && Date.now() - new Date(user.created_at).getTime() < 60_000;
  if (isNew && user.app_metadata?.provider === "google") {
    await supabase.from("policy_consents").insert([
      { policy: "terms", policy_version: POLICY_VERSION, method: "google_signup" },
      { policy: "privacy", policy_version: POLICY_VERSION, method: "google_signup" },
    ]);
  }

  const response = NextResponse.redirect(new URL(next, origin));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
