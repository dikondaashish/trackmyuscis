"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage, safeNext } from "@/lib/auth";
import { FormMessage } from "@/components/auth/FormMessage";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { btnPrimary, field, fieldLabel, focusRing } from "@/lib/ui";
import { Spinner } from "@/components/ui/Spinner";

/** Messages /auth/callback can send back here. */
const CALLBACK_ERRORS: Record<string, string> = {
  link_expired: "That link has expired or was already used. Sign in, or ask for a new link.",
  other_browser: "Open the link in the same browser you used to request it, or sign in below.",
  callback_failed: "We couldn't finish signing you in. Please try again.",
};

export function SignInForm({ googleClientId }: { googleClientId: string }) {
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(CALLBACK_ERRORS[params.get("error") ?? ""] ?? null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(authErrorMessage(error));
      setBusy(false);
      return;
    }
    // Full navigation so the server renders the dashboard with the new session cookie.
    window.location.assign(next);
  }

  return (
    <>
      {error && <div className="mb-4"><FormMessage tone="error">{error}</FormMessage></div>}
      <GoogleButton clientId={googleClientId} next={next} onError={setError} />
      <OrDivider />
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor={emailId} className={fieldLabel}>
            Email
          </label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={busy}
            className={`${field} mt-1.5 disabled:opacity-60`}
          />
        </div>
        <PasswordField label="Password" value={password} onChange={setPassword} autoComplete="current-password" disabled={busy} />
        <div className="-mt-1 flex justify-end">
          <Link href="/forgot-password" className={`inline-flex min-h-11 items-center rounded text-small font-semibold text-blue ${focusRing}`}>
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full disabled:opacity-60`}>
          {busy ? (
            <>
              <Spinner />
              Signing in…
            </>
          ) : "Sign in"}
        </button>
      </form>
    </>
  );
}
