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

export type NewWorkPermit = { caseId: string; suggested: FilingCategory | null };

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
  onWorkPermit,
}: {
  existing?: Existing;
  onDone: () => void;
  onCancel: () => void;
  /** Called instead of onDone when USCIS says the new case is a work permit, to ask what it's for. */
  onWorkPermit?: (permit: NewWorkPermit) => void;
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
        if (error?.message.includes("case_limit_reached"))
          return setError(`You can save up to ${MAX_CASES} cases. Remove one to add another.`);
        return setError("We couldn't save that case. Please try again.");
      }
      // Start automatic checks and fetch the first status (which says the form). The case is
      // already saved, so a slow or failed check just closes the dialog; the case page asks later.
      setBusy(true);
      setChecking(true);
      await Promise.race([syncMyCases().catch(() => {}), new Promise((r) => setTimeout(r, CHECK_WAIT_MS))]);
      const permit = onWorkPermit ? await workPermitFor(added.id) : null;
      setChecking(false);
      setBusy(false);
      // Don't refresh yet: on an empty dashboard the button that opened this dialog is
      // replaced by the list, which would close the dialog before step 2. The parent
      // refreshes when step 2 is saved, skipped or closed.
      if (permit) return onWorkPermit?.(permit);
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
          defaultValue={existing?.label ?? ""}
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

/** If USCIS says this saved case is a work permit, what to ask next (with a likely answer). */
async function workPermitFor(caseId: string): Promise<NewWorkPermit | null> {
  const { data } = await createClient().from("cases").select("id, form_type, filing_category").returns<
    { id: string; form_type: string | null; filing_category: string | null }[]
  >();
  const mine = data?.find((c) => c.id === caseId);
  if (!mine || !asksFilingCategory(mine.form_type) || mine.filing_category) return null;
  const others = (data ?? []).filter((c) => c.id !== caseId).map((c) => c.form_type);
  return { caseId, suggested: suggestCategory(others) };
}
