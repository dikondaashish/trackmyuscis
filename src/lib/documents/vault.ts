import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * The passcode lock, server side. Unlocking returns a random token that this browser keeps in an
 * httpOnly cookie; the database stores only its hash. Every documents route checks that this
 * browser's token is still valid, and the database itself hides documents unless the person has
 * an unlocked session (see the documents migration).
 */

const COOKIE = "tmu_documents_unlock";
const MAX_AGE_SECONDS = 12 * 60 * 60;

export async function setUnlockCookie(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearUnlockCookie() {
  (await cookies()).delete(COOKIE);
}

export async function unlockToken() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

type Signed = { supabase: SupabaseClient; user: User };

/** The signed-in person, or a 401 response. */
export async function requireUser(): Promise<Signed | NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  return { supabase, user };
}

/** The signed-in person with this browser unlocked, or a 401/423 response. */
export async function requireUnlocked(): Promise<Signed | NextResponse> {
  const signed = await requireUser();
  if (signed instanceof NextResponse) return signed;
  const token = await unlockToken();
  const { data: valid } = token
    ? await signed.supabase.rpc("document_vault_session_valid", { p_token: token })
    : { data: false };
  if (!valid) return NextResponse.json({ error: "Your documents are locked.", code: "locked" }, { status: 423 });
  return signed;
}

/** Same-origin requests only, for routes that change something. */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export const forbidden = () => NextResponse.json({ error: "Not allowed." }, { status: 403 });

export type CheckResult = { ok: boolean; error?: string; remaining?: number; locked_until?: string; token?: string };

/** A wrong passcode or a lockout, in words. Shared by the unlock and change-passcode routes. */
export function passcodeError(result: CheckResult) {
  if (result.error === "locked") {
    return NextResponse.json(
      { error: "Too many wrong tries. Your documents are locked for a while.", code: "locked", lockedUntil: result.locked_until },
      { status: 429 },
    );
  }
  if (result.error === "no_passcode") return NextResponse.json({ error: "Set up a passcode first.", code: "no_passcode" }, { status: 409 });
  const left = result.remaining ?? 0;
  return NextResponse.json(
    { error: `That passcode isn't right. ${left === 1 ? "1 try" : `${left} tries`} left before a lockout.`, code: "wrong", remaining: left },
    { status: 401 },
  );
}
