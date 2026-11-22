import { NextResponse } from "next/server";
import { AUTO_LOCK_CHOICES, LOCKOUT_CHOICES } from "@/lib/documents/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  clearUnlockCookie,
  forbidden,
  passcodeError,
  requireUser,
  sameOrigin,
  setUnlockCookie,
  unlockToken,
  type CheckResult,
} from "@/lib/documents/vault";

type Status = { has_passcode: boolean; locked_until: string | null; auto_lock_minutes: number; lockout_minutes: number };

const PASSCODE = /^\d{6}$/;

/** The lock: is a passcode set, is this browser unlocked, any lockout, and the settings. */
export async function GET() {
  const signed = await requireUser();
  if (signed instanceof NextResponse) return signed;
  const { supabase } = signed;
  const token = await unlockToken();
  const [{ data: statusData, error }, { data: unlocked }] = await Promise.all([
    supabase.rpc("document_vault_status"),
    token ? supabase.rpc("document_vault_session_valid", { p_token: token }) : Promise.resolve({ data: false }),
  ]);
  const status = statusData as Status | null;
  if (error || !status) return NextResponse.json({ error: "We couldn't check your documents lock. Please try again." }, { status: 500 });
  return NextResponse.json(
    {
      hasPasscode: status.has_passcode,
      unlocked: !!unlocked,
      lockedUntil: status.locked_until,
      autoLockMinutes: status.auto_lock_minutes,
      lockoutMinutes: status.lockout_minutes,
    },
    { headers: { "cache-control": "no-store" } },
  );
}

/** setup · unlock · lock · settings */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const signed = await requireUser();
  if (signed instanceof NextResponse) return signed;
  const { supabase } = signed;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  switch (body.action) {
    case "setup": {
      const passcode = String(body.passcode ?? "");
      if (!PASSCODE.test(passcode)) return NextResponse.json({ error: "Your passcode must be 6 digits." }, { status: 400 });
      const { error } = await supabase.rpc("document_vault_setup", { p_passcode: passcode });
      if (error) {
        const exists = error.message.includes("passcode_exists");
        return NextResponse.json(
          { error: exists ? "You already have a passcode." : "We couldn't save your passcode. Please try again." },
          { status: exists ? 409 : 500 },
        );
      }
      // Setting it up unlocks this browser straight away.
      return unlock(supabase, passcode);
    }
    case "unlock": {
      const passcode = String(body.passcode ?? "");
      if (!PASSCODE.test(passcode)) return NextResponse.json({ error: "Enter your 6-digit passcode." }, { status: 400 });
      return unlock(supabase, passcode);
    }
    case "lock": {
      const token = await unlockToken();
      if (token) await supabase.rpc("document_vault_lock", { p_token: token });
      await clearUnlockCookie();
      return NextResponse.json({ ok: true });
    }
    case "settings": {
      const auto = body.autoLockMinutes === undefined ? null : Number(body.autoLockMinutes);
      const lockout = body.lockoutMinutes === undefined ? null : Number(body.lockoutMinutes);
      if (auto !== null && !(AUTO_LOCK_CHOICES as readonly number[]).includes(auto)) {
        return NextResponse.json({ error: "Choose one of the auto-lock times." }, { status: 400 });
      }
      if (lockout !== null && !(LOCKOUT_CHOICES as readonly number[]).includes(lockout)) {
        return NextResponse.json({ error: "Choose one of the lockout times." }, { status: 400 });
      }
      const { error } = await supabase.rpc("document_vault_settings", { p_auto_lock_minutes: auto, p_lockout_minutes: lockout });
      if (error) return NextResponse.json({ error: "We couldn't save that. Please try again." }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }
}

async function unlock(supabase: SupabaseClient, passcode: string) {
  const { data: raw, error } = await supabase.rpc("document_vault_unlock", { p_passcode: passcode });
  const data = raw as CheckResult | null;
  if (error || !data) return NextResponse.json({ error: "We couldn't check your passcode. Please try again." }, { status: 500 });
  if (data.ok && data.token) {
    await setUnlockCookie(data.token);
    return NextResponse.json({ ok: true });
  }
  return passcodeError(data);
}
