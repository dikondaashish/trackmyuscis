"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Dialog } from "@/components/app/Dialog";
import { FormMessage } from "@/components/auth/FormMessage";
import { PasswordField } from "@/components/auth/PasswordField";
import { Spinner } from "@/components/ui/Spinner";
import { authErrorMessage, PASSWORD_RULES, passwordOk } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { appBtnPrimary, appBtnSecondary, appLink } from "@/lib/ui";

const RULES = PASSWORD_RULES.map((r) => r.label.toLowerCase()).join(", ").replace(/^a/, "A") + ".";

/**
 * The password row in Account settings. Google-only accounts can add a password so they can
 * also sign in with their email; accounts with one can change it (current password first) or
 * get a reset link if they've forgotten it.
 */
export function PasswordSettings({ email, hasPassword }: { email: string; hasPassword: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-white p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-cloud text-blue">
        <KeyRound aria-hidden className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-small font-semibold text-midnight">Password</span>
          {hasPassword ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-caption font-medium text-teal">
              <span aria-hidden className="size-1.5 rounded-full bg-teal" />
              Set
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-cloud px-2 py-0.5 text-caption font-medium text-slate">
              <span aria-hidden className="size-1.5 rounded-full bg-slate/60" />
              Not set
            </span>
          )}
        </p>
        <p className="text-small text-slate">
          {hasPassword ? "You can also sign in with your email and password." : "Add one to sign in with your email too."}
        </p>
        {done && (
          <p className="mt-1 text-small font-medium text-teal" aria-live="polite">
            {done}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setDone(null);
          setOpen(true);
        }}
        className={appBtnSecondary}
      >
        {hasPassword ? "Change password" : "Set password"}
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={hasPassword ? "Change your password" : "Set a password"}
        description={
          hasPassword ? undefined : `You'll be able to sign in with ${email} and this password, as well as with Google.`
        }
      >
        {hasPassword ? (
          <ChangeForm
            email={email}
            onCancel={() => setOpen(false)}
            onDone={() => {
              setOpen(false);
              setDone("Your password is changed.");
            }}
          />
        ) : (
          <SetForm
            onCancel={() => setOpen(false)}
            onDone={() => {
              setOpen(false);
              setDone("Your password is set. You can now sign in with your email too.");
              router.refresh();
            }}
          />
        )}
      </Dialog>
    </div>
  );
}

/** Supabase asks for a fresh sign-in before some password changes. */
function reauthMessage(error: { code?: string; message?: string }) {
  return /reauthenticat/i.test(`${error.code ?? ""} ${error.message ?? ""}`)
    ? "For your security, please sign out, sign in again, and then try this right away."
    : authErrorMessage(error);
}

function NewPasswordFields({
  password,
  confirm,
  onPassword,
  onConfirm,
  busy,
  autoFocus,
}: {
  password: string;
  confirm: string;
  onPassword: (v: string) => void;
  onConfirm: (v: string) => void;
  busy: boolean;
  autoFocus?: boolean;
}) {
  return (
    <>
      <div>
        <PasswordField compact label="New password" value={password} onChange={onPassword} autoComplete="new-password" disabled={busy} autoFocus={autoFocus} />
        <p className="mt-1.5 text-caption text-slate">{RULES}</p>
      </div>
      <PasswordField compact label="Type it again" value={confirm} onChange={onConfirm} autoComplete="new-password" disabled={busy} />
    </>
  );
}

function check(password: string, confirm: string) {
  if (!passwordOk(password)) return "Your password needs at least 8 characters, a letter and a number.";
  if (password !== confirm) return "The two passwords don't match.";
  return null;
}

function Buttons({ busy, label, working, onCancel }: { busy: boolean; label: string; working: string; onCancel: () => void }) {
  return (
    <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} disabled={busy} className={appBtnSecondary}>
        Cancel
      </button>
      <button type="submit" disabled={busy} className={appBtnPrimary}>
        {busy ? (
          <>
            <Spinner />
            {working}
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

/** Google-only account: choose a first password. */
function SetForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const problem = check(password, confirm);
    if (problem) return setError(problem);
    setError(null);
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(reauthMessage(error));
    onDone();
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <NewPasswordFields password={password} confirm={confirm} onPassword={setPassword} onConfirm={setConfirm} busy={busy} autoFocus />
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <Buttons busy={busy} label="Set password" working="Saving…" onCancel={onCancel} />
    </form>
  );
}

/** Account with a password: current password, then the new one. Or a reset link if forgotten. */
function ChangeForm({ email, onDone, onCancel }: { email: string; onDone: () => void; onCancel: () => void }) {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!current) return setError("Enter your current password.");
    const problem = check(password, confirm);
    if (problem) return setError(problem);
    if (password === current) return setError("Choose a password that's different from your current one.");
    setError(null);
    setBusy(true);
    const supabase = createClient();
    // Signing in again proves it's really them, and gives a fresh session for the change.
    const { error: wrong } = await supabase.auth.signInWithPassword({ email, password: current });
    if (wrong) {
      setBusy(false);
      return setError(/invalid/i.test(wrong.message) ? "Your current password isn't right." : authErrorMessage(wrong));
    }
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(reauthMessage(error));
    onDone();
  }

  async function sendReset() {
    setError(null);
    setBusy(true);
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", "/auth/reset-password");
    const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: callback.toString() });
    setBusy(false);
    if (error) return setError(authErrorMessage(error));
    setResetSent(true);
  }

  if (resetSent) {
    return (
      <div>
        <FormMessage tone="success">
          We sent a link to {email}. Open it in this browser to choose a new password.
        </FormMessage>
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={onCancel} className={appBtnPrimary} data-autofocus>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <div>
        <PasswordField compact label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" disabled={busy} autoFocus />
        <button type="button" onClick={() => void sendReset()} disabled={busy} className={`${appLink} mt-1.5 text-small`}>
          Forgot your password?
        </button>
      </div>
      <NewPasswordFields password={password} confirm={confirm} onPassword={setPassword} onConfirm={setConfirm} busy={busy} />
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <Buttons busy={busy} label="Change password" working="Saving…" onCancel={onCancel} />
    </form>
  );
}
