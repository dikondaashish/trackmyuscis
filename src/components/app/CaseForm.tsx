"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { checkReceipt } from "@/lib/receipt";
import { FORM_OPTIONS, MAX_CASES } from "@/lib/cases";
import { FormMessage } from "@/components/auth/FormMessage";
import { SelectField } from "@/components/ui/SelectField";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel } from "@/lib/ui";
import { Spinner } from "@/components/ui/Spinner";
import { syncMyCases } from "@/app/(app)/dashboard/actions";

type Existing = { id: string; receipt_number: string; label: string | null; form_type: string | null };

/**
 * Add a case (receipt number, form, optional name) or edit one (form and name; the receipt
 * number can't change). Saves straight to Supabase; row-level security limits it to the owner.
 */
export function CaseForm({ existing, onDone, onCancel }: { existing?: Existing; onDone: () => void; onCancel: () => void }) {
  const router = useRouter();
  const ids = { receipt: useId(), form: useId(), label: useId(), msg: useId() };
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const label = String(data.get("label") ?? "").trim() || null;
    const form_type = String(data.get("form_type") ?? "") || null;
    const supabase = createClient();

    if (existing) {
      setBusy(true);
      const { error } = await supabase.from("cases").update({ label, form_type }).eq("id", existing.id);
      setBusy(false);
      if (error) return setError("We couldn't save your changes. Please try again.");
    } else {
      const check = checkReceipt(String(data.get("receipt") ?? ""));
      if (!check.ok) return setError(check.error);
      setBusy(true);
      const { error } = await supabase.from("cases").insert({ receipt_number: check.receipt, label, form_type });
      setBusy(false);
      if (error) {
        if (error.code === "23505") return setError("You already saved this receipt number.");
        if (error.message.includes("case_limit_reached"))
          return setError(`You can save up to ${MAX_CASES} cases. Remove one to add another.`);
        return setError("We couldn't save that case. Please try again.");
      }
      // Start automatic checks and fetch the first status. Never blocks saving.
      setBusy(true);
      await syncMyCases().catch(() => {});
      setBusy(false);
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
      <SelectField id={ids.form} name="form_type" label="Form" options={FORM_OPTIONS} defaultValue={existing?.form_type ?? ""} compact />
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
              Saving…
            </>
          ) : existing ? "Save changes" : "Save case"}
        </button>
      </div>
    </form>
  );
}
