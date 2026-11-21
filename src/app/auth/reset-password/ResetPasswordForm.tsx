"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AFTER_SIGN_IN, authErrorMessage, PASSWORD_RULES, passwordOk } from "@/lib/auth";
import { FormMessage } from "@/components/auth/FormMessage";
import { PasswordField } from "@/components/auth/PasswordField";
import { btnPrimary, textLink } from "@/lib/ui";

/** Shown after the emailed link: /auth/callback has already signed the person in with a recovery session. */
export function ResetPasswordForm() {
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data }) => setStatus(data.session ? "ready" : "invalid"));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!passwordOk(password)) return setError("Your password needs at least 8 characters, a letter and a number.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setBusy(false);
      return setError(authErrorMessage(error));
    }
    window.location.assign(AFTER_SIGN_IN);
  }

  if (status === "checking") return <p className="text-body text-slate">Checking your link…</p>;
  if (status === "invalid") {
    return (
      <div className="flex flex-col gap-4">
        <FormMessage tone="error">This link is invalid or has expired. Ask for a new one and open it in this browser.</FormMessage>
        <Link href="/forgot-password" className={textLink}>
          Send a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <PasswordField label="New password" value={password} onChange={setPassword} autoComplete="new-password" disabled={busy} />
      <p className="-mt-2 text-small text-slate">{PASSWORD_RULES.map((r) => r.label.toLowerCase()).join(", ").replace(/^a/, "A")}.</p>
      <PasswordField label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" disabled={busy} />
      <button type="submit" disabled={busy} className={`${btnPrimary} w-full disabled:opacity-60`}>
        {busy ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
