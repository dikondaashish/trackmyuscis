"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WORK_PERMIT_CATEGORIES, categoryFor, type FilingCategory } from "@/lib/filing-category";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel, appPanel, focusRing } from "@/lib/ui";

const sectionLabel = "text-caption font-medium text-slate";

export const WORK_PERMIT_WHY =
  "Each kind of work permit has its own processing time, and USCIS doesn't say which one this is. It's on your receipt notice as the category, like (c)(3)(B).";

/** One line per choice, with the code from the receipt notice. */
const optionLabel = (c: (typeof WORK_PERMIT_CATEGORIES)[number]) => (c.code ? `${c.label} – ${c.code}` : c.label);

/**
 * What the work permit is for, as one dropdown, saved straight to Supabase (row-level
 * security limits it to the owner; the database stamps when it was confirmed). Premium
 * processing isn't asked: USCIS reports it in the case history (see premiumSince).
 * Used on the case page and as the second step of "Add a case".
 */
export function WorkPermitForm({
  caseId,
  saved,
  suggested,
  onSaved,
  secondary,
}: {
  caseId: string;
  saved: string | null;
  suggested: FilingCategory | null;
  onSaved: () => void;
  secondary?: { label: string; onClick: () => void };
}) {
  const ids = { select: useId(), hint: useId(), msg: useId() };
  const current = categoryFor(saved);
  const initial = current?.value ?? suggested;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const choice = String(new FormData(e.currentTarget).get("category") ?? "");
    if (!categoryFor(choice)) return setError("Choose what this work permit is for.");
    setBusy(true);
    const { error } = await createClient().from("cases").update({ filing_category: choice }).eq("id", caseId);
    setBusy(false);
    if (error) return setError("We couldn't save that. Please try again.");
    onSaved();
  }

  const suggestedNote = suggested && !current;
  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor={ids.select} className={appFieldLabel}>
        Work permit category
      </label>
      <div className="relative mt-1.5">
        <select
          id={ids.select}
          name="category"
          defaultValue={initial ?? ""}
          disabled={busy}
          data-autofocus
          aria-invalid={!!error || undefined}
          aria-describedby={[suggestedNote ? ids.hint : "", error ? ids.msg : ""].filter(Boolean).join(" ") || undefined}
          className={`${appField} cursor-pointer appearance-none pr-9`}
        >
          <option value="" disabled>
            Choose one
          </option>
          {WORK_PERMIT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {optionLabel(c)}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate" />
      </div>
      {suggestedNote && (
        <p id={ids.hint} className="mt-1.5 text-caption text-slate">
          We picked this from your other saved cases. Change it if it&apos;s wrong.
        </p>
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
  premiumSince,
  suggested,
}: {
  caseId: string;
  saved: string | null;
  /** From the USCIS history: a date, "" when undated, or null when not premium. */
  premiumSince: string | null;
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
            {premiumSince !== null && (
              <p className="mt-0.5 text-caption text-slate">
                {premiumSince ? `Premium processing since ${premiumSince}` : "Premium processing"}
              </p>
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
      <div className="mt-3 max-w-md">
        <WorkPermitForm
          caseId={caseId}
          saved={saved}
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
