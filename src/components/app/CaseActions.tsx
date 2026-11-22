"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { USCIS_CASE_STATUS } from "@/lib/content";
import { appBtnDanger, appBtnPrimary, appBtnSecondary, appIconBtn } from "@/lib/ui";
import { Dialog } from "./Dialog";

import { CaseForm, type NewWorkPermit } from "./CaseForm";
import { WORK_PERMIT_WHY, WorkPermitForm } from "./WorkPermitCategory";
import { Spinner } from "@/components/ui/Spinner";
import { syncMyCases } from "@/app/(app)/dashboard/actions";

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * "Add case" button that opens the add dialog. When USCIS says the new case is a work
 * permit, the same dialog then asks what it's for (skippable; the case page asks later).
 */
export function AddCaseButton({ disabled, label = "Add case" }: { disabled?: boolean; label?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [permit, setPermit] = useState<NewWorkPermit | null>(null);
  const close = () => setOpen(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPermit(null);
          setOpen(true);
        }}
        disabled={disabled}
        title={disabled ? "You've saved the most cases an account can hold" : undefined}
        className={appBtnPrimary}
      >
        <Plus aria-hidden className="size-3.5" />
        {label}
      </button>
      <Dialog
        open={open}
        onClose={close}
        wide={Boolean(permit)}
        title={permit ? "What is this work permit for?" : "Add a case"}
        description={permit ? `Case saved. ${WORK_PERMIT_WHY}` : "Save a receipt number to keep it in your list."}
      >
        {permit ? (
          <WorkPermitForm
            key={permit.caseId}
            caseId={permit.caseId}
            saved={null}
            premium={null}
            suggested={permit.suggested}
            compact
            onSaved={() => {
              router.refresh();
              close();
            }}
            secondary={{ label: "Skip for now", onClick: close }}
          />
        ) : (
          <CaseForm onDone={close} onCancel={close} onWorkPermit={setPermit} />
        )}
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
      className={`${appIconBtn} relative z-10 size-7`}
    >
      {done ? <Check aria-hidden className="pop size-3.5 text-teal" /> : <Copy aria-hidden className="size-3.5" />}
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
        className={appBtnPrimary}
      >
        Check status on USCIS
        <ArrowUpRight aria-hidden className="size-3.5" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <p aria-live="polite" className="flex min-h-4 items-center gap-1.5 text-caption text-slate">
        {copied ? (
          <span key="copied" className="swap inline-flex items-center gap-1.5 text-teal">
            <Check aria-hidden className="size-3.5" />
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
    // Stop automatic checks for it. The dashboard retries if this fails.
    void syncMyCases().catch(() => {});
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <>
      <div className="flex gap-2">
        <button type="button" onClick={() => setEditing(true)} className={`${appBtnSecondary} flex-1 sm:flex-none`}>
          <Pencil aria-hidden className="size-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => setRemoving(true)}
          className={`${appBtnSecondary} flex-1 hover:border-red/40 hover:text-red sm:flex-none`}
        >
          <Trash2 aria-hidden className="size-3.5" />
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
        {error && <p role="alert" className="mb-3 text-small text-red">{error}</p>}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => setRemoving(false)} disabled={busy} className={appBtnSecondary}>
            Keep
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={appBtnDanger}
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
