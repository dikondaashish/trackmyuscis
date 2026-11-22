"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { DOCUMENT_TYPES, KNOWN_TYPES, documentTypeLabel, normalizeType, type VaultDocument } from "@/lib/documents/types";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel } from "@/lib/ui";
import { api } from "./shared";

const CUSTOM = "__custom";

/**
 * Type, expiry date and issue date for one document. Used after an upload that needs checking
 * and in the document popup. A new expiry date restarts its reminders.
 */
export function DetailsForm({
  doc,
  onSaved,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: {
  doc: VaultDocument;
  onSaved: (doc: VaultDocument) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}) {
  const ids = { type: useId(), custom: useId(), expiry: useId(), issue: useId() };
  const known = KNOWN_TYPES.has(doc.category);
  const [type, setType] = useState(known ? doc.category : CUSTOM);
  const [custom, setCustom] = useState(known ? "" : documentTypeLabel(doc.category));
  const [expiry, setExpiry] = useState(doc.expiryDate ?? "");
  const [issue, setIssue] = useState(doc.issueDate ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const category = type === CUSTOM ? normalizeType(custom) : type;
    if (!category) return setError("Enter what kind of document this is.");
    if (expiry && issue && expiry < issue) return setError("The expiry date is before the issue date.");
    setBusy(true);
    const res = await api<{ document?: VaultDocument }>(`/api/documents/${doc.id}`, {
      method: "PATCH",
      body: { category, expiryDate: expiry || null, issueDate: issue || null },
    });
    setBusy(false);
    if (!res.ok || !res.data.document) return setError(res.data.error ?? "We couldn't save that. Please try again.");
    onSaved(res.data.document);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <div>
        <label htmlFor={ids.type} className={appFieldLabel}>
          Document type
        </label>
        <div className="relative mt-1.5">
          <select
            id={ids.type}
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={busy}
            data-autofocus
            className={`${appField} cursor-pointer appearance-none pr-9`}
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
            <option value={CUSTOM}>Something else (type it)</option>
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate" />
        </div>
      </div>
      {type === CUSTOM && (
        <div>
          <label htmlFor={ids.custom} className={appFieldLabel}>
            What is it?
          </label>
          <input
            id={ids.custom}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            maxLength={40}
            placeholder="e.g. Lease agreement"
            disabled={busy}
            className={`${appField} mt-1.5`}
          />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.expiry} className={appFieldLabel}>
            Expiry date <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id={ids.expiry}
            type="date"
            value={expiry}
            min="1900-01-01"
            max="2200-12-31"
            onChange={(e) => setExpiry(e.target.value)}
            disabled={busy}
            className={`${appField} mt-1.5 tabular-nums`}
          />
        </div>
        <div>
          <label htmlFor={ids.issue} className={appFieldLabel}>
            Issue date <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id={ids.issue}
            type="date"
            value={issue}
            min="1900-01-01"
            max="2200-12-31"
            onChange={(e) => setIssue(e.target.value)}
            disabled={busy}
            className={`${appField} mt-1.5 tabular-nums`}
          />
        </div>
      </div>
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={busy} className={appBtnSecondary}>
          {cancelLabel}
        </button>
        <button type="submit" disabled={busy} className={appBtnPrimary}>
          {busy ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
