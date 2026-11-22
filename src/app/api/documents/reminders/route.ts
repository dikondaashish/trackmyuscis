import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { emailEnabled, sendEmail } from "@/lib/email/send";
import { documentReminderEmail } from "@/lib/email/document-emails";
import { daysUntil, REMINDER_DAYS } from "@/lib/documents/types";

export const maxDuration = 60;

type Due = { id: string; user_id: string; category: string; filename: string; expiry_date: string; reminded_days: number | null };
type Profile = { user_id: string; email: string | null; first_name: string | null; document_reminders: boolean };

/** Vercel Cron calls this with "Authorization: Bearer <CRON_SECRET>". */
function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Today's date in U.S. Eastern time, when this runs (9 AM Eastern). */
function easternToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/**
 * Daily: email people about documents expiring in 60, 45, 30, 20, 10 or 5 days, or today. Each
 * document gets each reminder once (reminded_days records the last one; changing the expiry
 * date clears it). A document added late gets the nearest reminder, not every earlier one.
 */
export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false }, { status: 401 });
  const admin = createAdminClient();
  if (!admin || !emailEnabled()) return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });

  const today = easternToday();
  const last = new Date(Date.parse(`${today}T00:00:00Z`) + 60 * 86_400_000).toISOString().slice(0, 10);
  const { data: docs, error } = await admin
    .from("documents")
    .select("id, user_id, category, filename, expiry_date, reminded_days")
    .gte("expiry_date", today)
    .lte("expiry_date", last)
    .limit(2000)
    .returns<Due[]>();
  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  const due = docs.flatMap((d) => {
    const days = daysUntil(d.expiry_date, today);
    if (days === null || days < 0) return [];
    // The nearest reminder at or after today's distance: 58 days away → the 60-day reminder.
    const step = [...REMINDER_DAYS].reverse().find((n) => n >= days);
    if (step === undefined || (d.reminded_days !== null && d.reminded_days <= step)) return [];
    return [{ ...d, days, step }];
  });
  if (due.length === 0) return NextResponse.json({ ok: true, sent: 0 });

  const ids = [...new Set(due.map((d) => d.user_id))];
  const { data: profiles } = await admin
    .from("profiles")
    .select("user_id, email, first_name, document_reminders")
    .in("user_id", ids)
    .returns<Profile[]>();
  const byUser = new Map((profiles ?? []).map((p) => [p.user_id, p]));

  let sent = 0;
  let failed = 0;
  for (const d of due) {
    const profile = byUser.get(d.user_id);
    if (!profile?.document_reminders || !profile.email) continue;
    const message = documentReminderEmail({
      firstName: profile.first_name,
      category: d.category,
      filename: d.filename,
      expiryDate: d.expiry_date,
      days: d.days,
    });
    try {
      await sendEmail({ to: profile.email, ...message });
      await admin.from("documents").update({ reminded_days: d.step }).eq("id", d.id).eq("expiry_date", d.expiry_date);
      sent++;
    } catch {
      failed++;
    }
  }
  if (failed) console.error(`Document reminders: ${failed} failed`);
  return NextResponse.json({ ok: true, sent, failed });
}
