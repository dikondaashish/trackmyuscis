import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";
import { recordGoogleSignupConsent } from "@/lib/supabase/consent";

/**
 * The Google button signs in in the browser, then posts here: record consent for a new
 * account and send the person on to `next` (our pages only) with a full page load.
 */
export async function POST(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  if (request.headers.get("origin") !== origin) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/sign-in?error=callback_failed", origin), 303);

  await recordGoogleSignupConsent(supabase, user);

  const response = NextResponse.redirect(new URL(safeNext(searchParams.get("next")), origin), 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
