"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Dialog } from "@/components/app/Dialog";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { api, DigitsField } from "@/components/app/documents/shared";
import { AUTO_LOCK_CHOICES, LOCKOUT_CHOICES } from "@/lib/documents/types";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel } from "@/lib/ui";

type Vault = { hasPasscode: boolean; autoLockMinutes: number; lockoutMinutes: number };

const minutes = (n: number) => (n === 0 ? "Never" : n === 60 ? "1 hour" : `${n} minute${n === 1 ? "" : "s"}`);

/** Lock settings for Documents: auto-lock, lockout after wrong tries, and changing the passcode. */
export function DocumentLockSettings() {
  const [vault, setVault] = useState<Vault | null>(null);
  const [failed, setFailed] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    let live = true;
    api<Vault>("/api/documents/vault").then((res) => {
      if (!live) return;
      if (res.ok) setVault(res.data);
      else setFailed(true);
    });
    return () => {
      live = false;
    };
  }, []);

  async function save(key: "autoLockMinutes" | "lockoutMinutes", value: number) {
    if (!vault) return;
    const before = vault;
    setVault({ ...vault, [key]: value });
    setSaved(null);
    const res = await api("/api/documents/vault", { body: { action: "settings", [key]: value } });
    if (!res.ok) {
      setVault(before);
      setSaved("We couldn't save that. Please try again.");
    } else setSaved("Saved.");
  }

  if (failed) return <p className="py-3 text-small text-slate">We couldn&apos;t load your lock settings.</p>;
  if (!vault) return <p className="py-3 text-small text-slate">Loading…</p>;
  if (!vault.hasPasscode) {
    return (
      <p className="py-3 text-small text-slate">
        You&apos;ll choose a passcode the first time you open Documents. Its lock settings appear here after that.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <Choice
          label="Lock after no activity"
          value={vault.autoLockMinutes}
          options={AUTO_LOCK_CHOICES}
          onChange={(v) => void save("autoLockMinutes", v)}
        />
        <Choice
          label="Lockout after 3 wrong tries"
          value={vault.lockoutMinutes}
          options={LOCKOUT_CHOICES}
          onChange={(v) => void save("lockoutMinutes", v)}
        />
      </div>
      {saved && <p className="text-caption text-slate" aria-live="polite">{saved}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="text-small font-medium text-midnight">Passcode</p>
          <p className="text-caption text-slate">Changing it needs your current passcode and a code we email you.</p>
        </div>
        <button type="button" onClick={() => setChanging(true)} className={appBtnSecondary}>
          Change passcode
        </button>
      </div>
      <Dialog open={changing} onClose={() => setChanging(false)} title="Change your passcode">
        <ChangePasscode onDone={() => setChanging(false)} onCancel={() => setChanging(false)} />
      </Dialog>
    </div>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: readonly number[];
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={appFieldLabel}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`${appField} cursor-pointer appearance-none pr-9`}
        >
          {options.map((n) => (
            <option key={n} value={n}>
              {minutes(n)}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate" />
      </div>
    </div>
  );
}

/** Current passcode + new passcode → emailed code → done. */
function ChangePasscode({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const ids = { current: useId(), a: useId(), b: useId(), code: useId() };
  const [step, setStep] = useState<"passcodes" | "code" | "done">("passcodes");
  const [current, setCurrent] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const six = (v: string) => /^\d{6}$/.test(v);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!six(current)) return setError("Enter your current 6-digit passcode.");
    if (!six(first)) return setError("Your new passcode must be 6 digits.");
    if (first !== second) return setError("The two new passcodes don't match.");
    setBusy(true);
    const res = await api<{ sentTo?: string }>("/api/documents/vault/code", {
      body: { action: "send", purpose: "change", currentPasscode: current, newPasscode: first },
    });
    setBusy(false);
    if (!res.ok) return setError(res.data.error ?? "We couldn't send a code. Please try again.");
    setSentTo(res.data.sentTo ?? "your email");
    setStep("code");
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!six(code)) return setError("Enter the 6-digit code from the email.");
    setBusy(true);
    const res = await api("/api/documents/vault/code", { body: { action: "confirm", purpose: "change", code } });
    setBusy(false);
    if (!res.ok) return setError(res.data.error ?? "We couldn't check that code. Please try again.");
    setStep("done");
  }

  const buttons = (label: string, working: string) => (
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

  if (step === "done") {
    return (
      <div>
        <FormMessage tone="success">Your passcode is changed. Use the new one next time you open Documents.</FormMessage>
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={onDone} className={appBtnPrimary} data-autofocus>
            Done
          </button>
        </div>
      </div>
    );
  }

  if (step === "code") {
    return (
      <form onSubmit={confirm} noValidate className="flex flex-col gap-3">
        <p className="text-small text-slate">We sent a 6-digit code to {sentTo}. It works for 10 minutes.</p>
        <div>
          <label htmlFor={ids.code} className={appFieldLabel}>
            Code from the email
          </label>
          <DigitsField id={ids.code} type="text" value={code} onChange={setCode} autoFocus disabled={busy} className="mt-1.5" />
        </div>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        {buttons("Change passcode", "Checking…")}
      </form>
    );
  }

  return (
    <form onSubmit={send} noValidate className="flex flex-col gap-3">
      <div>
        <label htmlFor={ids.current} className={appFieldLabel}>
          Current passcode
        </label>
        <DigitsField id={ids.current} value={current} onChange={setCurrent} data-autofocus disabled={busy} className="mt-1.5" />
      </div>
      <div>
        <label htmlFor={ids.a} className={appFieldLabel}>
          New passcode (6 digits)
        </label>
        <DigitsField id={ids.a} value={first} onChange={setFirst} disabled={busy} className="mt-1.5" />
      </div>
      <div>
        <label htmlFor={ids.b} className={appFieldLabel}>
          Type the new one again
        </label>
        <DigitsField id={ids.b} value={second} onChange={setSecond} disabled={busy} className="mt-1.5" />
      </div>
      {error && <FormMessage tone="error">{error}</FormMessage>}
      {buttons("Email me a code", "Sending…")}
    </form>
  );
}
