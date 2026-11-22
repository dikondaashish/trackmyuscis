import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUnsubscribe } from "@/lib/email/unsubscribe";

/**
 * Turns off case emails for the account in a signed link. Mail apps POST here directly
 * (List-Unsubscribe-Post: One-Click); the /email/unsubscribe page's button posts a form
 * and is sent back to that page to see the result. Only POST changes anything, so link
 * scanners that open the email's links can't unsubscribe someone by accident.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const userId = verifyUnsubscribe(url.searchParams.get("u"), url.searchParams.get("t"));
  const fromPage = (request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded") &&
    !(await request.clone().text()).includes("List-Unsubscribe=One-Click");
  const back = (state: string) =>
    NextResponse.redirect(new URL(`/email/unsubscribe?${state}`, url.origin), 303);

  if (!userId) return fromPage ? back("invalid=1") : NextResponse.json({ ok: false }, { status: 400 });
  const admin = createAdminClient();
  if (!admin) return fromPage ? back("error=1") : NextResponse.json({ ok: false }, { status: 503 });

  const { error } = await admin.from("profiles").update({ email_notifications: false }).eq("user_id", userId);
  if (error) return fromPage ? back("error=1") : NextResponse.json({ ok: false }, { status: 500 });
  return fromPage ? back("done=1") : NextResponse.json({ ok: true });
}
