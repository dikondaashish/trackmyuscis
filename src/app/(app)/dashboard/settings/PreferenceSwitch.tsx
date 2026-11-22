"use client";

import { useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { focusRing } from "@/lib/ui";

type Column = "email_notifications" | "public_profile" | "show_activity_status";

/**
 * One on/off preference row: a label and a line of help on the left, a switch on the right.
 * Saves as soon as it's flipped and flips back if the save fails.
 */
export function PreferenceSwitch({
  userId,
  column,
  label,
  description,
  initial,
}: {
  userId: string;
  column: Column;
  label: string;
  description: string;
  initial: boolean;
}) {
  const ids = { label: useId(), help: useId() };
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function toggle() {
    const next = !on;
    setOn(next);
    setBusy(true);
    setFailed(false);
    const { error } = await createClient()
      .from("profiles")
      .update({ [column]: next })
      .eq("user_id", userId);
    setBusy(false);
    if (error) {
      setOn(!next);
      setFailed(true);
    }
  }

  return (
    <PreferenceRow
      labelId={ids.label}
      helpId={ids.help}
      label={label}
      description={failed ? "We couldn't save that. Please try again." : description}
      error={failed}
    >
      <Switch on={on} busy={busy} labelId={ids.label} helpId={ids.help} onClick={() => void toggle()} />
    </PreferenceRow>
  );
}

/** A switch that can't be used yet, for features that aren't live (shown off, with a pill). */
export function ComingSoonSwitch({ label, description }: { label: string; description: string }) {
  const ids = { label: useId(), help: useId() };
  return (
    <PreferenceRow
      labelId={ids.label}
      helpId={ids.help}
      label={label}
      description={description}
      pill="Coming soon"
    >
      <Switch on={false} disabled labelId={ids.label} helpId={ids.help} />
    </PreferenceRow>
  );
}

function PreferenceRow({
  labelId,
  helpId,
  label,
  description,
  pill,
  error,
  children,
}: {
  labelId: string;
  helpId: string;
  label: string;
  description: string;
  pill?: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p id={labelId} className="flex items-center gap-2 text-small font-medium text-midnight">
          {label}
          {pill && <span className="rounded-full bg-cloud px-2 py-0.5 text-caption font-medium text-slate">{pill}</span>}
        </p>
        <p id={helpId} className={`mt-0.5 text-caption ${error ? "text-red" : "text-slate"}`} aria-live="polite">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function Switch({
  on,
  busy,
  disabled,
  labelId,
  helpId,
  onClick,
}: {
  on: boolean;
  busy?: boolean;
  disabled?: boolean;
  labelId: string;
  helpId: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelId}
      aria-describedby={helpId}
      aria-busy={busy || undefined}
      disabled={disabled || busy}
      onClick={onClick}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed ${
        on ? "bg-blue" : "bg-border"
      } ${disabled ? "opacity-60" : ""} ${focusRing}`}
    >
      <span
        aria-hidden
        className={`size-5 rounded-full bg-white shadow-[0_1px_2px_rgba(16,34,61,0.25)] transition-transform duration-200 motion-reduce:transition-none ${
          on ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
