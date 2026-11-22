"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { checkReceipt } from "@/lib/receipt";
import { MAX_CASES } from "@/lib/cases";
import { FormMessage } from "@/components/auth/FormMessage";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel } from "@/lib/ui";
import { Spinner } from "@/components/ui/Spinner";
import { syncMyCases } from "@/app/(app)/dashboard/actions";
import { asksFilingCategory, suggestCategory, type FilingCategory } from "@/lib/filing-category";

/** How long "Add a case" waits for the first USCIS check before closing anyway. */
const CHECK_WAIT_MS = 12_000;

export type NewPurpose = { caseId: string; formType: string; suggested: FilingCategory | null };

/** What the add dialog shows after saving, when it has more to say than "done". */
export type AfterAdd =
  | ({ kind: "purpose" } & NewPurpose)
  | { kind: "not-found"; caseId: string; receipt: string; label: string | null };

type Existing = { id: string; receipt_number: string; label: string | null; form_type: string | null };

/**
 * Add a case (receipt number, optional name) or rename one (the receipt number can't change).
 * The form comes from USCIS with the first status check, so nobody has to pick it.
 * Saves straight to Supabase; row-level security limits it to the owner.
 */
export function CaseForm({
  existing,
  onDone,
  onCancel,
  onNext,
  initial,
}: {
  existing?: Existing;
  onDone: () => void;
  onCancel: () => void;
  /**
   * Called instead of onDone when there's a second step: USCIS doesn't recognize the
   * number, or says it's a work permit (to ask what it's for).
   */
  onNext?: (next: AfterAdd) => void;
  /** Starting values when someone goes back to fix a number. */
  initial?: { receipt: string; label: string | null };
}) {
  const router = useRouter();
  const ids = { receipt: useId(), label: useId(), msg: useId() };
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const label = String(data.get("label") ?? "").trim() || null;
    const supabase = createClient();

    if (existing) {
      setBusy(true);
      const { error } = await supabase.from("cases").update({ label }).eq("id", existing.id);
      setBusy(false);
      if (error) return setError("We couldn't save your changes. Please try again.");
    } else {
      const check = checkReceipt(String(data.get("receipt") ?? ""));
      if (!check.ok) return setError(check.error);
      setBusy(true);
      const { data: added, error } = await supabase
        .from("cases")
        .insert({ receipt_number: check.receipt, label })
        .select("id")
        .single<{ id: string }>();
      setBusy(false);
      if (error || !added) {
        if (error?.code === "23505") return setError("You already saved this receipt number.");
        if (error?.message.includes("daily_add_limit"))
          return setError("You've added a lot of receipt numbers today. Please try again tomorrow.");
        if (error?.message.includes("case_limit_reached"))
          return setError(`You can save up to ${MAX_CASES} cases. Remove one to add another.`);
        return setError("We couldn't save that case. Please try again.");
      }
      // Start automatic checks and fetch the first status (which says the form). The case is
      // already saved, so a slow or failed check just closes the dialog; the case page asks later.
      setBusy(true);
      setChecking(true);
      await Promise.race([syncMyCases().catch(() => {}), new Promise((r) => setTimeout(r, CHECK_WAIT_MS))]);
      const next = onNext ? await afterAdd(added.id, check.receipt, label) : null;
      setChecking(false);
      setBusy(false);
      // Don't refresh before a second step; the parent refreshes when it closes.
      if (next) return onNext?.(next);
      router.refresh();
      return onDone();
    }
    router.refresh();
    onDone();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3.5">
      {!existing && (
        <div>
          <label htmlFor={ids.receipt} className={appFieldLabel}>
            Receipt number
          </label>
          <input
            id={ids.receipt}
            name="receipt"
            placeholder="e.g. IOE0912345678"
            defaultValue={initial?.receipt}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={20}
            data-autofocus
            required
            disabled={busy}
            aria-invalid={!!error || undefined}
            aria-describedby={`${ids.receipt}-hint${error ? ` ${ids.msg}` : ""}`}
            className={`${appField} mt-1.5 uppercase tabular-nums tracking-wide placeholder:normal-case placeholder:tracking-normal`}
          />
          <p id={`${ids.receipt}-hint`} className="mt-1.5 text-caption text-slate">
            3 letters and 10 digits, from the receipt notice (Form I-797C) USCIS mailed you.
          </p>
        </div>
      )}
      <div>
        <label htmlFor={ids.label} className={appFieldLabel}>
          Name <span className="font-normal text-slate">(optional)</span>
        </label>
        <input
          id={ids.label}
          name="label"
          defaultValue={existing?.label ?? initial?.label ?? ""}
          placeholder="e.g. My work permit"
          maxLength={60}
          data-autofocus={existing ? true : undefined}
          disabled={busy}
          className={`${appField} mt-1.5`}
        />
      </div>
      {error && (
        <FormMessage tone="error" id={ids.msg}>
          {error}
        </FormMessage>
      )}
      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={busy} className={appBtnSecondary}>
          Cancel
        </button>
        <button type="submit" disabled={busy} className={appBtnPrimary}>
          {busy ? (
            <>
              <Spinner />
              {checking ? "Checking with USCIS…" : "Saving…"}
            </>
          ) : existing ? "Save changes" : "Save case"}
        </button>
      </div>
    </form>
  );
}

/** What to ask after saving: USCIS doesn't know the number, or it's a work permit. */
async function afterAdd(caseId: string, receipt: string, label: string | null): Promise<AfterAdd | null> {
  const { data } = await createClient().from("cases").select("id, form_type, filing_category, uscis_not_found").returns<
    { id: string; form_type: string | null; filing_category: string | null; uscis_not_found: boolean }[]
  >();
  const mine = data?.find((c) => c.id === caseId);
  if (!mine) return null;
  if (mine.uscis_not_found) return { kind: "not-found", caseId, receipt, label };
  if (!asksFilingCategory(mine.form_type) || mine.filing_category) return null;
  const others = (data ?? []).filter((c) => c.id !== caseId).map((c) => c.form_type);
  return { kind: "purpose", caseId, formType: mine.form_type!, suggested: suggestCategory(mine.form_type, others) };
}
