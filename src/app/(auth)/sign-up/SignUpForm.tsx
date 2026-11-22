"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage, AFTER_SIGN_IN, PASSWORD_RULES, passwordOk, POLICY_VERSION } from "@/lib/auth";
import { FormMessage } from "@/components/auth/FormMessage";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { btnPrimary, field, fieldLabel, focusRing } from "@/lib/ui";

const inlineLink = `rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`;
const RESEND_AFTER = 60;

/** Save which Terms and Privacy versions the person agreed to. Needs a session. */
async function recordConsent() {
  await createClient()
    .from("policy_consents")
    .insert([
      { policy: "terms", policy_version: POLICY_VERSION, method: "signup_checkbox" },
      { policy: "privacy", policy_version: POLICY_VERSION, method: "signup_checkbox" },
    ]);
}

export function SignUpForm({ googleClientId }: { googleClientId: string }) {
  const ids = { first: useId(), last: useId(), email: useId(), rules: useId(), terms: useId(), code: useId() };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // After sign-up, the same card asks for the emailed code.
  const [step, setStep] = useState<"details" | "code">("details");
  const [code, setCode] = useState("");
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!passwordOk(password)) return setError("Your password needs at least 8 characters, a letter and a number.");
    if (!agreed) return setError("Please agree to the Terms of Service and Privacy Policy to continue.");
    setBusy(true);
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", AFTER_SIGN_IN);
    const { data, error } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { first_name: firstName.trim(), last_name: lastName.trim() },
        emailRedirectTo: callback.toString(),
      },
    });
    setBusy(false);
    if (error) return setError(authErrorMessage(error));
    // Supabase returns a user with no identities when the email is already registered.
    if (data.user && data.user.identities?.length === 0) {
      return setError("An account with this email already exists. Sign in instead.");
    }
    if (data.session) {
      // Email confirmation is off: signed in already.
      await recordConsent();
      return window.location.assign(AFTER_SIGN_IN);
    }
    setStep("code");
    setWait(RESEND_AFTER);
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const { error } = await createClient().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    if (error) {
      setBusy(false);
      return setError(authErrorMessage(error));
    }
    await recordConsent();
    window.location.assign(AFTER_SIGN_IN);
  }

  async function resend() {
    setError(null);
    setNotice(null);
    const { error } = await createClient().auth.resend({ type: "signup", email: email.trim() });
    if (error) return setError(authErrorMessage(error));
    setNotice("We sent a new code. Check your inbox and spam folder.");
    setWait(RESEND_AFTER);
  }

  if (step === "code") {
    return (
      <form onSubmit={onVerify} className="flex flex-col gap-4">
        <p className="text-body text-slate">
          We sent a code to <strong className="font-semibold text-midnight">{email.trim()}</strong>. Enter it below,
          or open the link in that email.
        </p>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        {notice && <FormMessage tone="success">{notice}</FormMessage>}
        <div>
          <label htmlFor={ids.code} className={fieldLabel}>
            Confirmation code
          </label>
          <input
            id={ids.code}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={6}
            disabled={busy}
            className={`${field} mt-2 text-center tracking-[0.3em] tabular-nums disabled:opacity-60`}
          />
        </div>
        <button type="submit" disabled={busy || code.length < 6} className={`${btnPrimary} w-full disabled:opacity-60`}>
          {busy ? "Checking…" : "Confirm and continue"}
        </button>
        <div className="flex flex-wrap items-center justify-between gap-2 text-small">
          <button
            type="button"
            onClick={() => {
              setStep("details");
              setCode("");
              setError(null);
            }}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded font-semibold text-slate hover:text-midnight ${focusRing}`}
          >
            Change email
          </button>
          <button
            type="button"
            onClick={resend}
            disabled={wait > 0}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded font-semibold text-blue disabled:cursor-default disabled:text-slate ${focusRing}`}
          >
            {wait > 0 ? `Send a new code in ${wait}s` : "Send a new code"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      {error && <div className="mb-4"><FormMessage tone="error">{error}</FormMessage></div>}
      <GoogleButton clientId={googleClientId} next={AFTER_SIGN_IN} context="signup" onError={setError} />
      <p className="mt-2 text-center text-caption text-slate">
        By continuing with Google you agree to our <Link href="/terms" className={inlineLink}>Terms</Link> and{" "}
        <Link href="/privacy" className={inlineLink}>Privacy Policy</Link>.
      </p>
      <OrDivider />
      <form onSubmit={onSignUp} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={ids.first} className={fieldLabel}>
              First name
            </label>
            <input id={ids.first} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required maxLength={80} disabled={busy} className={`${field} mt-1.5 disabled:opacity-60`} />
          </div>
          <div>
            <label htmlFor={ids.last} className={fieldLabel}>
              Last name
            </label>
            <input id={ids.last} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required maxLength={80} disabled={busy} className={`${field} mt-1.5 disabled:opacity-60`} />
          </div>
        </div>
        <div>
          <label htmlFor={ids.email} className={fieldLabel}>
            Email
          </label>
          <input id={ids.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required disabled={busy} className={`${field} mt-1.5 disabled:opacity-60`} />
        </div>
        <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            describedBy={ids.rules}
            disabled={busy}
            hint={
              <ul id={ids.rules} aria-label="Password needs" className="flex flex-wrap justify-end gap-x-1.5 gap-y-0.5 text-caption sm:gap-x-2.5">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(password);
                  return (
                    <li key={rule.label} className={`flex items-center gap-1 ${met ? "text-teal" : "text-slate"}`}>
                      {met ? <Check aria-hidden className="size-3.5" /> : <Circle aria-hidden className="size-3" />}
                      <span aria-hidden className="whitespace-nowrap">{rule.short}</span>
                      <span className="sr-only">{`${rule.label} ${met ? "(done)" : "(not yet)"}`}</span>
                    </li>
                  );
                })}
              </ul>
            }
          />
        <label htmlFor={ids.terms} className="flex min-h-11 cursor-pointer items-start gap-3 text-small text-slate">
          <input
            id={ids.terms}
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={busy}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-blue"
          />
          <span>
            I agree to the <Link href="/terms" className={inlineLink}>Terms of Service</Link> and{" "}
            <Link href="/privacy" className={inlineLink}>Privacy Policy</Link>.
          </span>
        </label>
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full disabled:opacity-60`}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </>
  );
}
