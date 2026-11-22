"use client";

import { useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth";
import { FormMessage } from "@/components/auth/FormMessage";
import { btnPrimary, field, fieldLabel } from "@/lib/ui";
import { Spinner } from "@/components/ui/Spinner";

export function ForgotPasswordForm() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", "/auth/reset-password");
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: callback.toString() });
    setBusy(false);
    // Rate limits are worth showing; everything else gets the same answer so nobody can test which emails have accounts.
    if (error && /rate|too many/i.test(error.message)) return setError(authErrorMessage(error));
    setSent(true);
  }

  if (sent) {
    return (
      <FormMessage tone="success">
        If an account uses {email.trim()}, we sent it a link to choose a new password. Open it in this browser.
      </FormMessage>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div>
        <label htmlFor={emailId} className={fieldLabel}>
          Email
        </label>
        <input id={emailId} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required disabled={busy} className={`${field} mt-1.5 disabled:opacity-60`} />
      </div>
      <button type="submit" disabled={busy} className={`${btnPrimary} w-full disabled:opacity-60`}>
        {busy ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : "Send reset link"}
      </button>
    </form>
  );
}
