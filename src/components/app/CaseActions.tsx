"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Copy, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { USCIS_CASE_STATUS } from "@/lib/content";
import { appBtnDanger, appBtnPrimary, appBtnSecondary, appIconBtn } from "@/lib/ui";
import { Dialog } from "./Dialog";

import { CaseForm, type AfterAdd } from "./CaseForm";
import { WORK_PERMIT_WHY, WorkPermitForm } from "./WorkPermitCategory";
import { Spinner } from "@/components/ui/Spinner";
import { recheckMyCase, syncMyCases, type RecheckResult } from "@/app/(app)/dashboard/actions";

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const AddCaseContext = createContext<(() => void) | null>(null);

/**
 * Owns the "Add a case" dialog for the dashboard. It sits above the empty state and the
 * list, so the dialog stays open when the first case is saved and the empty state (with
 * the button that opened it) is replaced. When USCIS says the new case is a work permit,
 * the same dialog then asks what it's for (skippable; the case page asks later).
 */
export function AddCaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState<AfterAdd | null>(null);
  // Set when someone goes back from "not found" to fix the number.
  const [retry, setRetry] = useState<{ receipt: string; label: string | null } | null>(null);
  const show = useCallback(() => {
    setNext(null);
    setRetry(null);
    setOpen(true);
  }, []);
  const close = () => {
    setOpen(false);
    // A second step holds the refresh back (see CaseForm); show the new case now.
    if (next || retry) router.refresh();
  };

  let title = "Add a case";
  let description = "Save a receipt number to keep it in your list.";
  if (next?.kind === "work-permit") {
    title = "What is this work permit for?";
    description = `Case saved. ${WORK_PERMIT_WHY}`;
  } else if (next?.kind === "not-found") {
    title = "USCIS doesn't recognize this number";
    description = `${next.receipt} is saved, but USCIS says it doesn't know it.`;
  }

  return (
    <AddCaseContext.Provider value={show}>
      {children}
      <Dialog
        open={open}
        onClose={close}
        step={next?.kind ?? (retry ? "fix" : "add")}
        title={title}
        description={description}
      >
        {next?.kind === "work-permit" ? (
          <WorkPermitForm
            key={next.caseId}
            caseId={next.caseId}
            saved={null}
            suggested={next.suggested}
            onSaved={close}
            secondary={{ label: "Skip for now", onClick: close }}
          />
        ) : next?.kind === "not-found" ? (
          <NotFoundStep
            key={next.caseId}
            found={next}
            onKeep={close}
            onFix={() => {
              setRetry({ receipt: next.receipt, label: next.label });
              setNext(null);
            }}
          />
        ) : (
          <CaseForm key={retry?.receipt ?? "new"} initial={retry ?? undefined} onDone={close} onCancel={close} onNext={setNext} />
        )}
      </Dialog>
    </AddCaseContext.Provider>
  );
}

/**
 * Second step when USCIS doesn't know a new receipt number: usually a typo, sometimes a
 * filing too new to be in its system. "Fix the number" removes it and goes back to the form.
 */
function NotFoundStep({
  found,
  onKeep,
  onFix,
}: {
  found: Extract<AfterAdd, { kind: "not-found" }>;
  onKeep: () => void;
  onFix: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <p className="text-small text-midnight">Check it against your receipt notice (Form I-797C). It&apos;s usually a typo.</p>
      <p className="mt-2 text-small text-slate">
        If you filed in the last few days, it may not be in USCIS&apos;s system yet. Keep it and we&apos;ll try again a few
        times over the next two weeks.
      </p>
      {error && (
        <p role="alert" className="mt-3 text-small text-red">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onKeep} disabled={busy} className={appBtnSecondary}>
          Keep it
        </button>
        <button
          type="button"
          data-autofocus
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            const { error } = await createClient().from("cases").delete().eq("id", found.caseId);
            if (error) {
              setBusy(false);
              return setError("We couldn't remove it. Please try again.");
            }
            // Stop the engine checking the wrong number. Never blocks fixing it.
            void syncMyCases().catch(() => {});
            setBusy(false);
            onFix();
          }}
          className={appBtnPrimary}
        >
          {busy ? (
            <>
              <Spinner />
              Removing…
            </>
          ) : (
            "Fix the number"
          )}
        </button>
      </div>
    </div>
  );
}

/** "Add case" button; opens the dialog of the AddCaseProvider around it. */
export function AddCaseButton({ disabled, label = "Add case" }: { disabled?: boolean; label?: string }) {
  const show = useContext(AddCaseContext);
  return (
    <button
      type="button"
      onClick={() => show?.()}
      disabled={disabled || !show}
      title={disabled ? "You've saved the most cases an account can hold" : undefined}
      className={appBtnPrimary}
    >
      <Plus aria-hidden className="size-3.5" />
      {label}
    </button>
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

const RECHECK_MESSAGES: Record<Exclude<RecheckResult, "found">, string> = {
  "not-found": "USCIS still doesn't recognize this number.",
  "too-soon": "We checked this number less than an hour ago. Try again later.",
  failed: "We couldn't check right now. Please try again later.",
};

/** "Check again" for a receipt number USCIS didn't recognize. One lookup, at most hourly. */
export function RecheckButton({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-start">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMessage(null);
          const result = await recheckMyCase(caseId).catch((): RecheckResult => "failed");
          setBusy(false);
          if (result === "found") return router.refresh();
          setMessage(RECHECK_MESSAGES[result]);
          router.refresh();
        }}
        className={appBtnSecondary}
      >
        {busy ? <Spinner /> : <RefreshCw aria-hidden className="size-3.5" />}
        {busy ? "Checking…" : "Check again"}
      </button>
      <p aria-live="polite" className="min-h-4 text-caption text-slate">
        {message}
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
