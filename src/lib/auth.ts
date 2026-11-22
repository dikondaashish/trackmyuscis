import { COMPANY, LEGAL_UPDATED } from "@/lib/company";

/** Where people land after signing in. */
export const AFTER_SIGN_IN = "/dashboard";

/** Pages that need an account. The proxy sends signed-out visitors to sign in first. */
export const PROTECTED_PATHS = ["/dashboard"];

/** Sign-in pages that signed-in visitors skip. */
export const SIGNED_OUT_ONLY = ["/sign-in", "/sign-up", "/forgot-password"];

/** The Terms and Privacy version people agree to at sign-up. */
export const POLICY_VERSION = LEGAL_UPDATED;

/**
 * Only ever redirect to our own pages after sign-in (never another site).
 * Anything unexpected falls back to the dashboard.
 */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\") || next.includes("://")) {
    return AFTER_SIGN_IN;
  }
  const path = next.split(/[?#]/)[0];
  const allowed = [...PROTECTED_PATHS, "/auth/reset-password"];
  return allowed.some((p) => path === p || path.startsWith(`${p}/`)) ? next : AFTER_SIGN_IN;
}

/** Same rules as the sign-up form shows, checked before sending. */
export const PASSWORD_RULES = [
  { label: "At least 8 characters", short: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "A letter", short: "Letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { label: "A number", short: "Number", test: (p: string) => /\d/.test(p) },
];
export const passwordOk = (p: string) => PASSWORD_RULES.every((r) => r.test(p));

/** Turns Supabase error messages into plain words. */
export function authErrorMessage(error: { message?: string; code?: string } | null | undefined): string {
  const raw = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
  if (raw.includes("invalid login credentials") || raw.includes("invalid_credentials"))
    return "That email and password don't match. Check them and try again.";
  if (raw.includes("email not confirmed")) return "Confirm your email first. We sent you a code when you signed up.";
  if (raw.includes("already registered") || raw.includes("user_already_exists"))
    return "An account with this email already exists. Sign in instead.";
  if (raw.includes("rate limit") || raw.includes("over_email_send_rate_limit") || raw.includes("too many"))
    return "Too many attempts. Wait a few minutes and try again.";
  if (raw.includes("expired") || raw.includes("otp") || raw.includes("token"))
    return "That code is wrong or has expired. Check the latest email or send a new code.";
  if (raw.includes("provider is not enabled") || raw.includes("unsupported provider"))
    return "Google sign-in isn't available yet. Use your email and password.";
  if (raw.includes("weak") || raw.includes("password should"))
    return "Choose a stronger password: at least 8 characters with a letter and a number.";
  return `Something went wrong. Try again, or email ${COMPANY.email.support}.`;
}

/**
 * The Google OAuth client ID for the "Continue as …" button. Read on the server and passed
 * down, so either variable name works (it is public; Google shows it in the page anyway).
 */
export function googleClientId() {
  return (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "").trim();
}
