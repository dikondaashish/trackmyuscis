import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { emailEnabled, sendEmail } from "@/lib/email/send";
import { passcodeCodeEmail } from "@/lib/email/document-emails";
import { forbidden, passcodeError, requireUser, sameOrigin, setUnlockCookie, type CheckResult } from "@/lib/documents/vault";

const PASSCODE = /^\d{6}$/;
const BUCKET = "documents";

type Purpose = "change" | "forgot";

/** "dikonda@example.com" → "d•••••a@example.com", to say where the code went. */
const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name[0]}${"•".repeat(Math.max(1, Math.min(5, name.length - 2)))}${name.length > 1 ? name.at(-1) : ""}@${domain}`;
};

/**
 * Emailed codes for the passcode.
 *   send:    change (needs the current and the new passcode) or forgot. Emails a 6-digit code.
 *   confirm: change sets the new passcode; forgot sets a new one and deletes every document.
 * Codes are made on the server with the secret key, so they only ever reach the person by email.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const signed = await requireUser();
  if (signed instanceof NextResponse) return signed;
  const { supabase, user } = signed;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const purpose = body.purpose as Purpose;
  if (purpose !== "change" && purpose !== "forgot") {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }

  if (body.action === "send") {
    const admin = createAdminClient();
    if (!admin || !emailEnabled() || !user.email) {
      return NextResponse.json({ error: "Email codes aren't available right now. Please try again later." }, { status: 503 });
    }
    let newPasscode: string | null = null;
    if (purpose === "change") {
      const current = String(body.currentPasscode ?? "");
      newPasscode = String(body.newPasscode ?? "");
      if (!PASSCODE.test(newPasscode)) return NextResponse.json({ error: "Your new passcode must be 6 digits." }, { status: 400 });
      if (newPasscode === current) return NextResponse.json({ error: "Choose a passcode different from your current one." }, { status: 400 });
      const { data } = await supabase.rpc("document_vault_check_passcode", { p_passcode: current });
      const check = data as CheckResult | null;
      if (!check) return NextResponse.json({ error: "We couldn't check your passcode. Please try again." }, { status: 500 });
      if (!check.ok) return passcodeError(check);
    }

    const { data: code, error } = await admin.rpc("document_passcode_issue_code", {
      p_user_id: user.id,
      p_purpose: purpose,
      p_new_passcode: newPasscode,
    });
    if (error || typeof code !== "string") {
      const msg = error?.message ?? "";
      if (msg.includes("code_too_soon")) return NextResponse.json({ error: "We just sent a code. Wait a minute before asking again." }, { status: 429 });
      if (msg.includes("code_locked")) return NextResponse.json({ error: "Too many wrong codes. Try again in 15 minutes." }, { status: 429 });
      return NextResponse.json({ error: "We couldn't send a code. Please try again." }, { status: 500 });
    }

    const { data: profile } = await supabase.from("profiles").select("first_name").eq("user_id", user.id).maybeSingle<{ first_name: string | null }>();
    try {
      await sendEmail({ to: user.email, ...passcodeCodeEmail({ firstName: profile?.first_name ?? null, code, purpose }) });
    } catch {
      console.error("Passcode code email failed");
      return NextResponse.json({ error: "We couldn't send the email. Please try again." }, { status: 503 });
    }
    return NextResponse.json({ ok: true, sentTo: maskEmail(user.email) });
  }

  if (body.action === "confirm") {
    const code = String(body.code ?? "");
    if (!PASSCODE.test(code)) return NextResponse.json({ error: "Enter the 6-digit code from the email." }, { status: 400 });
    const newPasscode = purpose === "forgot" ? String(body.newPasscode ?? "") : null;
    if (purpose === "forgot" && !PASSCODE.test(newPasscode ?? "")) {
      return NextResponse.json({ error: "Your new passcode must be 6 digits." }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("document_passcode_confirm_code", {
      p_purpose: purpose,
      p_code: code,
      p_new_passcode: newPasscode,
    });
    const result = data as { ok: boolean; error?: string; removed_paths?: string[] } | null;
    if (error || !result) return NextResponse.json({ error: "We couldn't check that code. Please try again." }, { status: 500 });
    if (!result.ok) {
      const messages: Record<string, [string, number]> = {
        wrong: ["That code isn't right.", 400],
        expired: ["That code has expired. Ask for a new one.", 400],
        no_code: ["Ask for a new code first.", 400],
        locked: ["Too many wrong codes. Try again in 15 minutes.", 429],
        passcode_format: ["Your new passcode must be 6 digits.", 400],
      };
      const [message, status] = messages[result.error ?? ""] ?? ["We couldn't check that code. Please try again.", 400];
      return NextResponse.json({ error: message, code: result.error }, { status });
    }

    if (purpose === "forgot") {
      // The rows are gone; remove their files too (best effort: they're unreachable either way).
      const paths = result.removed_paths ?? [];
      const admin = createAdminClient();
      for (let i = 0; admin && i < paths.length; i += 100) {
        await admin.storage.from(BUCKET).remove(paths.slice(i, i + 100));
      }
      // Unlock this browser with the new passcode.
      const { data: unlocked } = await supabase.rpc("document_vault_unlock", { p_passcode: newPasscode });
      const token = (unlocked as CheckResult | null)?.token;
      if (token) await setUnlockCookie(token);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
}
