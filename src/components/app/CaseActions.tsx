"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { USCIS_CASE_STATUS } from "@/lib/content";
import { btnPrimary, btnSecondary, focusRing } from "@/lib/ui";
import { Dialog } from "./Dialog";

import { CaseForm } from "./CaseForm";
import { Spinner } from "@/components/ui/Spinner";

const btnDanger = btnPrimary.replace("bg-blue", "bg-red").replace("hover:bg-midnight", "hover:bg-red/90");

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** "Add case" button that opens the add dialog. */
export function AddCaseButton({ disabled, label = "Add case" }: { disabled?: boolean; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={disabled ? "You've saved the most cases an account can hold" : undefined}
        className={`${btnPrimary} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Plus aria-hidden className="size-4" />
        {label}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Add a case" description="Save a receipt number to keep it in your list.">
        <CaseForm onDone={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </Dialog>
    </>
  );
}

/** A small icon button that copies a receipt number and shows a tick. */
export function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copy(value)) {
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        }
      }}
      aria-label={done ? "Copied" : `Copy ${value}`}
      title={done ? "Copied" : "Copy receipt number"}
      className={`relative z-10 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-slate transition-colors duration-200 hover:bg-cloud hover:text-midnight ${focusRing}`}
    >
      {done ? <Check aria-hidden className="pop size-4 text-teal" /> : <Copy aria-hidden className="size-4" />}
      <span aria-live="polite" className="sr-only">
        {done ? "Copied" : ""}
      </span>
    </button>
  );
}

/**
 * The main action on a case: copy the receipt number, then open USCIS Case Status in a new
 * tab so the person only has to paste it.
 */
export function CheckOnUscisButton({ receipt }: { receipt: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-start">
      <a
        href={USCIS_CASE_STATUS}
        target="_blank"
        rel="noopener noreferrer"
        onClick={async () => setCopied(await copy(receipt))}
        className={btnPrimary}
      >
        Check status on USCIS
        <ArrowUpRight aria-hidden className="size-4" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <p aria-live="polite" className="flex min-h-5 items-center gap-1.5 text-small text-slate">
        {copied ? (
          <span key="copied" className="swap inline-flex items-center gap-1.5 text-teal">
            <Check aria-hidden className="size-4" />
            Receipt number copied. Paste it on the USCIS page.
          </span>
        ) : (
          "We copy your receipt number so you can paste it there."
        )}
      </p>
    </div>
  );
}

/** Edit and remove buttons for one case. Remove asks once more before deleting. */
export function EditRemoveButtons({
  existing,
}: {
  existing: { id: string; receipt_number: string; label: string | null; form_type: string | null };
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setBusy(true);
    setError(null);
    const { error } = await createClient().from("cases").delete().eq("id", existing.id);
    if (error) {
      setBusy(false);
      return setError("We couldn't remove this case. Please try again.");
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <>
      <div className="flex gap-3">
        <button type="button" onClick={() => setEditing(true)} className={`${btnSecondary} flex-1 sm:flex-none`}>
          <Pencil aria-hidden className="size-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => setRemoving(true)}
          className={`${btnSecondary} flex-1 hover:border-red/40 hover:text-red sm:flex-none`}
        >
          <Trash2 aria-hidden className="size-4" />
          Remove
        </button>
      </div>

      <Dialog open={editing} onClose={() => setEditing(false)} title="Edit case" description={existing.receipt_number}>
        <CaseForm existing={existing} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
      </Dialog>

      <Dialog
        open={removing}
        onClose={() => setRemoving(false)}
        title="Remove this case?"
        description={`${existing.receipt_number} will be removed from your list. Your case with USCIS is not affected.`}
      >
        {error && <p role="alert" className="mb-4 text-small text-red">{error}</p>}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => setRemoving(false)} disabled={busy} className={btnSecondary}>
            Keep
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={`${btnDanger} disabled:opacity-60`}
          >
            {busy ? (
            <>
              <Spinner />
              Removing…
            </>
          ) : "Remove case"}
          </button>
        </div>
      </Dialog>
    </>
  );
}
