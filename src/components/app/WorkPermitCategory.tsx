"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WORK_PERMIT_CATEGORIES, categoryFor, type FilingCategory } from "@/lib/filing-category";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { appBtnPrimary, appBtnSecondary, appPanel, focusRing } from "@/lib/ui";

const sectionLabel = "text-caption font-medium text-slate";
const option = `flex cursor-pointer items-start gap-2.5 rounded-lg border border-border px-3 transition-colors duration-200 hover:bg-cloud has-[:checked]:border-blue has-[:checked]:bg-ice has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue`;

export const WORK_PERMIT_WHY =
  "Each kind of work permit has its own processing time, and USCIS doesn't say which one this is. It's on your receipt notice as the category, like (c)(3)(B).";

/**
 * The choices and the premium question, saved straight to Supabase (row-level security
 * limits it to the owner; the database stamps when it was confirmed). Used on the case page
 * and as the second step of "Add a case". `compact` puts each code beside its label.
 */
export function WorkPermitForm({
  caseId,
  saved,
  premium,
  suggested,
  onSaved,
  secondary,
  compact = false,
}: {
  caseId: string;
  saved: string | null;
  premium: boolean | null;
  suggested: FilingCategory | null;
  onSaved: () => void;
  secondary?: { label: string; onClick: () => void };
  compact?: boolean;
}) {
  const ids = { msg: useId() };
  const current = categoryFor(saved);
  const [choice, setChoice] = useState<FilingCategory | null>(current?.value ?? suggested);
  const [paid, setPaid] = useState<boolean | null>(premium);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const asksPremium = Boolean(categoryFor(choice)?.premium);
  const formRef = useRef<HTMLFormElement>(null);

  // In the add dialog this replaces the first step, so move focus to the choices.
  useEffect(() => {
    if (!compact) return;
    const f = formRef.current;
    (f?.querySelector<HTMLInputElement>('input[name="category"]:checked') ?? f?.querySelector<HTMLInputElement>('input[name="category"]'))?.focus();
  }, [compact]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!choice) return setError("Choose what this work permit is for.");
    if (asksPremium && paid === null) return setError("Tell us whether you paid for premium processing.");
    setBusy(true);
    const { error } = await createClient()
      .from("cases")
      .update({ filing_category: choice, premium_processing: asksPremium ? paid : null })
      .eq("id", caseId);
    setBusy(false);
    if (error) return setError("We couldn't save that. Please try again.");
    onSaved();
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      <fieldset aria-describedby={error ? ids.msg : undefined}>
        <legend className="sr-only">What is this work permit for?</legend>
        <div className={`grid sm:grid-cols-2 ${compact ? "gap-1.5" : "gap-2"}`}>
          {WORK_PERMIT_CATEGORIES.map((c) => (
            <label key={c.value} className={`${option} ${compact ? "min-h-10 items-center py-1.5" : "py-2"}`}>
              <input
                type="radio"
                name="category"
                value={c.value}
                checked={choice === c.value}
                onChange={() => setChoice(c.value)}
                disabled={busy}
                className={`size-4 shrink-0 accent-blue ${compact ? "" : "mt-0.5"}`}
              />
              {compact ? (
                <span className="min-w-0 text-small font-medium text-midnight">
                  {c.label}
                  {c.code && <span className="ml-1.5 whitespace-nowrap text-caption font-normal text-slate tabular-nums">{c.code}</span>}
                </span>
              ) : (
                <span className="min-w-0">
                  <span className="block text-small font-medium text-midnight">{c.label}</span>
                  {c.code && <span className="block text-caption text-slate tabular-nums">{c.code}</span>}
                </span>
              )}
            </label>
          ))}
        </div>
        {suggested && choice === suggested && !current && (
          <p className="mt-2 text-caption text-slate">We picked this from your other saved cases. Change it if it&apos;s wrong.</p>
        )}
      </fieldset>

      {asksPremium && (
        <fieldset className="mt-4">
          <legend className="text-small font-medium text-midnight">Did you pay for premium processing?</legend>
          <div className="mt-2 flex gap-2">
            {[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ].map((o) => (
              <label key={o.label} className={`${option} min-h-9 items-center py-1.5`}>
                <input
                  type="radio"
                  name="premium"
                  checked={paid === o.value}
                  onChange={() => setPaid(o.value)}
                  disabled={busy}
                  className="size-4 shrink-0 accent-blue"
                />
                <span className="text-small font-medium text-midnight">{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {error && (
        <div className="mt-3">
          <FormMessage tone="error" id={ids.msg}>
            {error}
          </FormMessage>
        </div>
      )}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {secondary && (
          <button type="button" onClick={secondary.onClick} disabled={busy} className={appBtnSecondary}>
            {secondary.label}
          </button>
        )}
        <button type="submit" disabled={busy} className={appBtnPrimary}>
          {busy ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}

/**
 * The case page panel: asks "What is this work permit for?" until it's answered, then shows
 * the answer with a Change link. People who skipped it when adding the case answer it here.
 */
export function WorkPermitCategory({
  caseId,
  saved,
  premium,
  suggested,
}: {
  caseId: string;
  saved: string | null;
  premium: boolean | null;
  suggested: FilingCategory | null;
}) {
  const router = useRouter();
  const titleId = useId();
  const current = categoryFor(saved);
  const [editing, setEditing] = useState(!current);
  const [done, setDone] = useState(false);

  if (!editing && current) {
    return (
      <section id="work-permit" aria-labelledby={titleId} className={`${appPanel} jump-target`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={titleId} className={sectionLabel}>
              Work permit for
            </h2>
            <p className="mt-1 text-small font-medium text-midnight">
              {current.label}
              {current.code && <span className="font-normal text-slate"> · {current.code}</span>}
            </p>
            {current.premium && premium !== null && (
              <p className="mt-0.5 text-caption text-slate">{premium ? "Premium processing" : "Regular processing"}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setEditing(true);
            }}
            className={`-mr-1 min-h-8 shrink-0 cursor-pointer rounded px-1 text-small font-medium text-blue underline-offset-2 hover:underline ${focusRing}`}
          >
            Change
          </button>
        </div>
        {done && (
          <div className="mt-3">
            <FormMessage tone="success">Saved. Thanks, this helps us show timelines for cases like yours.</FormMessage>
          </div>
        )}
      </section>
    );
  }

  return (
    <section id="work-permit" aria-labelledby={titleId} className={`${appPanel} jump-target`}>
      <h2 id={titleId} className="text-small font-semibold text-midnight">
        What is this work permit for?
      </h2>
      <p className="mt-1 max-w-prose text-small text-slate">{WORK_PERMIT_WHY}</p>
      <div className="mt-3">
        <WorkPermitForm
          caseId={caseId}
          saved={saved}
          premium={premium}
          suggested={suggested}
          onSaved={() => {
            setEditing(false);
            setDone(true);
            router.refresh();
          }}
          secondary={current ? { label: "Cancel", onClick: () => setEditing(false) } : undefined}
        />
      </div>
    </section>
  );
}
