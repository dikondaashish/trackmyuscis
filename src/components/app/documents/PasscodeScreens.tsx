"use client";

import { useId, useRef, useState } from "react";
import { KeyRound, Lock, TriangleAlert } from "lucide-react";
import { Dialog } from "@/components/app/Dialog";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { appBtnDanger, appBtnPrimary, appBtnSecondary, appCard, appFieldLabel, appLink } from "@/lib/ui";
import { api, DigitsField, lockedUntilText } from "./shared";

const valid = (v: string) => /^\d{6}$/.test(v);

function Frame({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby="lock-title" className={`${appCard} enter mx-auto mt-6 max-w-sm px-5 py-8 text-center sm:px-8`}>
      <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-ice text-blue">{icon}</span>
      <h2 id="lock-title" className="mt-4 text-body font-semibold text-midnight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Busy({ busy, idle, working }: { busy: boolean; idle: string; working: string }) {
  return busy ? (
    <>
      <Spinner />
      {working}
    </>
  ) : (
    <>{idle}</>
  );
}

/** First visit: choose a 6-digit passcode (typed twice). Setting it unlocks the page. */
export function SetupScreen({ onDone }: { onDone: () => void }) {
  const ids = { a: useId(), b: useId() };
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!valid(first)) return setError("Your passcode must be 6 digits.");
    if (first !== second) return setError("The two passcodes don't match.");
    setBusy(true);
    const res = await api("/api/documents/vault", { body: { action: "setup", passcode: first } });
    setBusy(false);
    if (!res.ok) return setError(res.data.error ?? "We couldn't save your passcode. Please try again.");
    onDone();
  }

  return (
    <Frame icon={<KeyRound aria-hidden className="size-5" />} title="Set a passcode for your documents">
      <p className="mt-1 text-small text-slate">
        You&apos;ll enter it each time you open Documents, so nobody else using your device can see them.
      </p>
      <form onSubmit={submit} noValidate className="mt-5 flex flex-col gap-3 text-left">
        <div>
          <label htmlFor={ids.a} className={appFieldLabel}>
            New passcode (6 digits)
          </label>
          <DigitsField id={ids.a} value={first} onChange={setFirst} autoFocus disabled={busy} className="mt-1.5" />
        </div>
        <div>
          <label htmlFor={ids.b} className={appFieldLabel}>
            Type it again
          </label>
          <DigitsField id={ids.b} value={second} onChange={setSecond} disabled={busy} className="mt-1.5" />
        </div>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <button type="submit" disabled={busy} className={`${appBtnPrimary} mt-1 w-full`}>
          <Busy busy={busy} idle="Set passcode" working="Saving…" />
        </button>
      </form>
      <p className="mt-4 text-caption text-slate">
        Forgot it later? You can reset it by email, but resetting deletes the documents you saved.
      </p>
    </Frame>
  );
}

/** Locked: enter the passcode. Three wrong tries lock it for a few minutes. */
export function UnlockScreen({ lockedUntil: initialLock, onDone }: { lockedUntil: string | null; onDone: () => void }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialLock ? `Too many wrong tries. ${lockedUntilText(initialLock)}` : null);
  const [forgot, setForgot] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!valid(passcode)) return setError("Enter your 6-digit passcode.");
    setBusy(true);
    const res = await api<{ lockedUntil?: string }>("/api/documents/vault", { body: { action: "unlock", passcode } });
    setBusy(false);
    if (res.ok) return onDone();
    setPasscode("");
    setError(res.data.code === "locked" ? `Too many wrong tries. ${lockedUntilText(res.data.lockedUntil)}` : (res.data.error ?? "Please try again."));
    inputRef.current?.focus();
  }

  return (
    <Frame icon={<Lock aria-hidden className="size-5" />} title="Your documents are locked">
      <p className="mt-1 text-small text-slate">Enter your passcode to open them.</p>
      <form onSubmit={submit} noValidate className="mt-5 flex flex-col gap-3 text-left">
        <div>
          <label htmlFor={id} className={appFieldLabel}>
            Passcode
          </label>
          <DigitsField
            ref={inputRef}
            id={id}
            value={passcode}
            onChange={setPasscode}
            autoFocus
            disabled={busy}
            aria-invalid={!!error || undefined}
            className="mt-1.5"
          />
        </div>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <button type="submit" disabled={busy} className={`${appBtnPrimary} mt-1 w-full`}>
          <Busy busy={busy} idle="Unlock" working="Checking…" />
        </button>
      </form>
      <button type="button" onClick={() => setForgot(true)} className={`${appLink} mx-auto mt-3`}>
        Forgot your passcode?
      </button>
      <ForgotPasscodeDialog open={forgot} onClose={() => setForgot(false)} onDone={onDone} />
    </Frame>
  );
}

/**
 * Reset a forgotten passcode with a code sent to the account email. By design this deletes
 * every saved document, which the first step says plainly.
 */
function ForgotPasscodeDialog({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState<"warn" | "code">("warn");
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onClose={busy ? () => {} : onClose} title="Reset your passcode" step={step}>
      {/* Fresh state on every open (the dialog remounts its content). */}
      <ForgotFlow onStep={setStep} onBusy={setBusy} onClose={onClose} onDone={onDone} />
    </Dialog>
  );
}

function ForgotFlow({
  onStep,
  onBusy,
  onClose,
  onDone,
}: {
  onStep: (s: "warn" | "code") => void;
  onBusy: (b: boolean) => void;
  onClose: () => void;
  onDone: () => void;
}) {
  const ids = { code: useId(), a: useId(), b: useId() };
  const [step, setStepState] = useState<"warn" | "code">("warn");
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [busy, setBusyState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setBusy = (b: boolean) => {
    setBusyState(b);
    onBusy(b);
  };

  async function send() {
    setError(null);
    setBusy(true);
    const res = await api<{ sentTo?: string }>("/api/documents/vault/code", { body: { action: "send", purpose: "forgot" } });
    setBusy(false);
    if (!res.ok) return setError(res.data.error ?? "We couldn't send a code. Please try again.");
    setSentTo(res.data.sentTo ?? "your email");
    setStepState("code");
    onStep("code");
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!valid(code)) return setError("Enter the 6-digit code from the email.");
    if (!valid(first)) return setError("Your new passcode must be 6 digits.");
    if (first !== second) return setError("The two passcodes don't match.");
    setBusy(true);
    const res = await api("/api/documents/vault/code", { body: { action: "confirm", purpose: "forgot", code, newPasscode: first } });
    setBusy(false);
    if (!res.ok) return setError(res.data.error ?? "We couldn't reset your passcode. Please try again.");
    onStep("warn");
    onClose();
    onDone();
  }

  if (step === "warn") {
    return (
      <div className="text-left">
        <div className="flex gap-2.5 rounded-lg bg-red/5 px-3.5 py-3 text-small text-midnight">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-red" />
          <p>
            <span className="font-semibold">Resetting deletes every document you&apos;ve saved.</span> Your passcode is what keeps them
            private, so a reset starts you with an empty folder. This can&apos;t be undone.
          </p>
        </div>
        {error && (
          <div className="mt-3">
            <FormMessage tone="error">{error}</FormMessage>
          </div>
        )}
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={busy} className={appBtnSecondary}>
            Cancel
          </button>
          <button type="button" onClick={send} disabled={busy} data-autofocus className={appBtnDanger}>
            <Busy busy={busy} idle="Email me a code" working="Sending…" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={confirm} noValidate className="flex flex-col gap-3 text-left">
      <p className="text-small text-slate">We sent a 6-digit code to {sentTo}. It works for 10 minutes.</p>
      <div>
        <label htmlFor={ids.code} className={appFieldLabel}>
          Code from the email
        </label>
        <DigitsField id={ids.code} type="text" value={code} onChange={setCode} data-autofocus disabled={busy} className="mt-1.5" />
      </div>
      <div>
        <label htmlFor={ids.a} className={appFieldLabel}>
          New passcode (6 digits)
        </label>
        <DigitsField id={ids.a} value={first} onChange={setFirst} disabled={busy} className="mt-1.5" />
      </div>
      <div>
        <label htmlFor={ids.b} className={appFieldLabel}>
          Type it again
        </label>
        <DigitsField id={ids.b} value={second} onChange={setSecond} disabled={busy} className="mt-1.5" />
      </div>
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} disabled={busy} className={appBtnSecondary}>
          Cancel
        </button>
        <button type="submit" disabled={busy} className={appBtnDanger}>
          <Busy busy={busy} idle="Delete documents and reset" working="Resetting…" />
        </button>
      </div>
    </form>
  );
}
