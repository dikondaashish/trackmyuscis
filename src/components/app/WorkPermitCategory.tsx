"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WORK_PERMIT_CATEGORIES, categoryFor, type FilingCategory } from "@/lib/filing-category";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { appBtnPrimary, appBtnSecondary, appPanel, focusRing } from "@/lib/ui";

const sectionLabel = "text-caption font-medium text-slate";
const option = `flex cursor-pointer items-start gap-2.5 rounded-lg border border-border px-3 py-2 transition-colors duration-200 hover:bg-cloud has-[:checked]:border-blue has-[:checked]:bg-ice has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue`;

/**
 * "What is this work permit for?" USCIS's case status doesn't say, and each category has
 * its own processing time. Asked once per I-765 case; saved straight to Supabase (row-level
 * security limits it to the owner, and the database stamps when it was confirmed).
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
  const ids = { title: useId(), premium: useId(), msg: useId() };
  const current = categoryFor(saved);
  const [editing, setEditing] = useState(!current);
  const [choice, setChoice] = useState<FilingCategory | null>(current?.value ?? suggested);
  const [paid, setPaid] = useState<boolean | null>(premium);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const picked = categoryFor(choice);
  const asksPremium = Boolean(picked?.premium);

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
    setEditing(false);
    setDone(true);
    router.refresh();
  }

  if (!editing && current) {
    return (
      <section aria-labelledby={ids.title} className={appPanel}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={ids.title} className={sectionLabel}>
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
    <section aria-labelledby={ids.title} className={appPanel}>
      <h2 id={ids.title} className="text-small font-semibold text-midnight">
        What is this work permit for?
      </h2>
      <p className="mt-1 max-w-prose text-small text-slate">
        Each kind of work permit has its own processing time, and USCIS doesn&apos;t say which one this is. It&apos;s on your
        receipt notice as the category, like (c)(3)(B).
      </p>
      <form onSubmit={onSubmit} noValidate className="mt-3">
        <fieldset aria-describedby={error ? ids.msg : undefined}>
          <legend className="sr-only">What is this work permit for?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {WORK_PERMIT_CATEGORIES.map((c) => (
              <label key={c.value} className={option}>
                <input
                  type="radio"
                  name="category"
                  value={c.value}
                  checked={choice === c.value}
                  onChange={() => setChoice(c.value)}
                  disabled={busy}
                  className="mt-0.5 size-4 shrink-0 accent-blue"
                />
                <span className="min-w-0">
                  <span className="block text-small font-medium text-midnight">{c.label}</span>
                  {c.code && <span className="block text-caption text-slate tabular-nums">{c.code}</span>}
                </span>
              </label>
            ))}
          </div>
          {suggested && choice === suggested && !current && (
            <p className="mt-2 text-caption text-slate">We picked this from your other saved cases. Change it if it&apos;s wrong.</p>
          )}
        </fieldset>

        {asksPremium && (
          <fieldset className="mt-4">
            <legend id={ids.premium} className="text-small font-medium text-midnight">
              Did you pay for premium processing?
            </legend>
            <div className="mt-2 flex gap-2">
              {[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ].map((o) => (
                <label key={o.label} className={`${option} items-center py-1.5`}>
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
          {current && (
            <button
              type="button"
              onClick={() => {
                setChoice(current.value);
                setPaid(premium);
                setError(null);
                setEditing(false);
              }}
              disabled={busy}
              className={appBtnSecondary}
            >
              Cancel
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
    </section>
  );
}
