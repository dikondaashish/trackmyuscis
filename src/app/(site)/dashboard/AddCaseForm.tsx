"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { checkReceipt } from "@/lib/receipt";
import { FormMessage } from "@/components/auth/FormMessage";
import { btnPrimary, field, fieldLabel } from "@/lib/ui";

/** Save a receipt number (and an optional name for it) to the account. */
export function AddCaseForm({ full }: { full: boolean }) {
  const router = useRouter();
  const ids = { receipt: useId(), label: useId(), msg: useId() };
  const [receipt, setReceipt] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const check = checkReceipt(receipt);
    if (!check.ok) return setError(check.error);
    setBusy(true);
    const { error } = await createClient()
      .from("cases")
      .insert({ receipt_number: check.receipt, label: label.trim() || null });
    setBusy(false);
    if (error) {
      if (error.code === "23505") return setError("You already saved this receipt number.");
      if (error.message.includes("case_limit_reached")) return setError("You can save up to 10 cases. Remove one to add another.");
      return setError("We couldn't save that case. Please try again.");
    }
    setReceipt("");
    setLabel("");
    router.refresh();
  }

  if (full) {
    return <p className="text-body text-slate">You&apos;ve saved 10 cases, the most an account can hold. Remove one to add another.</p>;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <label htmlFor={ids.receipt} className={fieldLabel}>
            Receipt number
          </label>
          <input
            id={ids.receipt}
            value={receipt}
            onChange={(e) => setReceipt(e.target.value)}
            placeholder="e.g. IOE0912345678"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={20}
            disabled={busy}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? ids.msg : undefined}
            className={`${field} mt-2 uppercase tabular-nums tracking-wide placeholder:normal-case placeholder:tracking-normal disabled:opacity-60`}
          />
        </div>
        <div>
          <label htmlFor={ids.label} className={fieldLabel}>
            Name <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id={ids.label}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. My work permit"
            maxLength={60}
            disabled={busy}
            className={`${field} mt-2 disabled:opacity-60`}
          />
        </div>
      </div>
      {error && <FormMessage tone="error" id={ids.msg}>{error}</FormMessage>}
      <div>
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full sm:w-auto disabled:opacity-60`}>
          <Plus aria-hidden className="size-4" />
          {busy ? "Saving…" : "Save case"}
        </button>
      </div>
    </form>
  );
}
