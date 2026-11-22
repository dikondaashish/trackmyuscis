import { after, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { engine, verifyEngineSignature, type EngineStatusEvent } from "@/lib/case-engine/client";
import { applyEngineStatus, SYNC_COLUMNS, type SyncedCase } from "@/lib/case-engine/sync";
import { caseStatusEmail } from "@/lib/email/case-status-email";
import { emailEnabled, sendEmail } from "@/lib/email/send";
import { oneClickUnsubscribeUrl, unsubscribeUrl } from "@/lib/email/unsubscribe";
import { caseTitle } from "@/lib/cases";

/**
 * Status changes from the case engine, signed with CASE_ENGINE_WEBHOOK_SECRET.
 * Saves the new status, then emails the person once if case emails are on.
 * A non-2xx answer makes the engine retry (hourly, for two days), so we only return one
 * when a retry could help: the database or the email failed.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const ok = verifyEngineSignature(
    raw,
    request.headers.get("x-partner-timestamp"),
    request.headers.get("x-partner-signature"),
  );
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

  let event: EngineStatusEvent;
  try {
    event = JSON.parse(raw) as EngineStatusEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  const remote = event.case;
  if (event.event !== "case.status_changed" || !remote?.userRef || !remote.receiptNumber || !remote.status) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });

  const { data: row, error } = await admin
    .from("cases")
    .select(`${SYNC_COLUMNS}, label, filing_category`)
    .eq("user_id", remote.userRef)
    .eq("receipt_number", remote.receiptNumber)
    .maybeSingle<SyncedCase & { label: string | null; filing_category: string | null }>();
  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  if (!row) {
    // Removed here (or the account was deleted): stop the engine checking it.
    after(() => engine.remove(remote.userRef, remote.receiptNumber).catch(() => {}));
    return NextResponse.json({ ok: true, removed: true });
  }

  const before = row.current_status;
  const saved = await applyEngineStatus(admin, row, remote).catch(() => null);
  if (!saved) return NextResponse.json({ ok: false }, { status: 500 });
  if (saved.alerted_status === remote.status) return NextResponse.json({ ok: true, emailed: false });

  const markAlerted = () =>
    admin.from("cases").update({ alerted_status: remote.status }).eq("id", row.id).eq("current_status", remote.status);

  const { data: profile } = await admin
    .from("profiles")
    .select("email, first_name, email_notifications")
    .eq("user_id", row.user_id)
    .maybeSingle<{ email: string | null; first_name: string | null; email_notifications: boolean }>();

  // Emails off, no address, or no mail server: record it so a later retry doesn't send it late.
  if (!profile?.email_notifications || !profile.email || !emailEnabled()) {
    await markAlerted();
    return NextResponse.json({ ok: true, emailed: false });
  }

  const message = caseStatusEmail({
    firstName: profile.first_name,
    caseTitle: caseTitle(row),
    caseId: row.id,
    receiptNumber: row.receipt_number,
    previousStatus: event.previousStatus ?? before,
    status: remote.status,
    description: remote.description,
    unsubscribeUrl: unsubscribeUrl(row.user_id),
  });
  try {
    await sendEmail({ to: profile.email, ...message, unsubscribeUrl: oneClickUnsubscribeUrl(row.user_id) ?? undefined });
  } catch {
    console.error("Case status email failed");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  await markAlerted();
  return NextResponse.json({ ok: true, emailed: true });
}
