"use client";

import { useEffect, useState } from "react";
import { Download, Pencil, Trash2 } from "lucide-react";
import { Dialog } from "@/components/app/Dialog";
import { FormMessage } from "@/components/auth/FormMessage";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { documentTypeLabel, fieldLabel, fileSizeLabel, showDate, type VaultDocument } from "@/lib/documents/types";
import { appBtnDanger, appBtnSecondary, appLink } from "@/lib/ui";
import { DetailsForm } from "./DetailsForm";
import { ExpiryBadge } from "./ExpiryBadge";
import { api } from "./shared";

/** One document: the file, its details and what AI read, with edit, download and delete. */
export function DocumentDialog({
  doc,
  today,
  startEditing,
  onClose,
  onChanged,
  onDeleted,
}: {
  doc: VaultDocument | null;
  today: string;
  startEditing: boolean;
  onClose: () => void;
  onChanged: (doc: VaultDocument) => void;
  onDeleted: (id: string) => void;
}) {
  return (
    <Dialog
      open={!!doc}
      onClose={onClose}
      title={doc ? documentTypeLabel(doc.category) : "Document"}
      description={doc?.filename}
      size="lg"
    >
      {doc && (
        <DocumentView
          key={doc.id}
          doc={doc}
          today={today}
          startEditing={startEditing}
          onClose={onClose}
          onChanged={onChanged}
          onDeleted={onDeleted}
        />
      )}
    </Dialog>
  );
}

function DocumentView({
  doc,
  today,
  startEditing,
  onClose,
  onChanged,
  onDeleted,
}: {
  doc: VaultDocument;
  today: string;
  startEditing: boolean;
  onClose: () => void;
  onChanged: (doc: VaultDocument) => void;
  onDeleted: (id: string) => void;
}) {
  const [links, setLinks] = useState<{ view: string | null; download: string | null } | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(startEditing);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    api<{ viewUrl?: string | null; downloadUrl?: string | null }>(`/api/documents/${doc.id}`).then((res) => {
      if (!live) return;
      if (!res.ok) return setLinkError(res.data.error ?? "We couldn't open this file.");
      setLinks({ view: res.data.viewUrl ?? null, download: res.data.downloadUrl ?? null });
    });
    return () => {
      live = false;
    };
  }, [doc.id, attempt]);

  async function remove() {
    setError(null);
    setDeleting(true);
    const res = await api(`/api/documents/${doc.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) return setError(res.data.error ?? "We couldn't delete that document. Please try again.");
    onDeleted(doc.id);
    onClose();
  }

  const fields = Object.entries(doc.extractedFields);
  const isPdf = doc.fileType === "application/pdf";

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* The file */}
      <div className="min-w-0">
        <div className="overflow-hidden rounded-lg border border-border bg-cloud">
          {linkError ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 px-4 text-center text-small text-slate md:h-[28rem]">
              <p>{linkError}</p>
              <button
                type="button"
                onClick={() => {
                  setLinkError(null);
                  setLinks(null);
                  setAttempt((n) => n + 1);
                }}
                className={appLink}
              >
                Try again
              </button>
            </div>
          ) : !links ? (
            <Skeleton className="h-64 w-full rounded-none md:h-[28rem]" />
          ) : links.view && isPdf ? (
            <iframe src={links.view} title={`Preview of ${doc.filename}`} className="h-64 w-full bg-white md:h-[28rem]" />
          ) : links.view ? (
            // eslint-disable-next-line @next/next/no-img-element -- a short-lived private link; next/image can't optimize it
            <img src={links.view} alt={`${documentTypeLabel(doc.category)} document`} className="h-64 w-full object-contain md:h-[28rem]" />
          ) : null}
        </div>
        {links?.download && (
          <a href={links.download} className={`${appBtnSecondary} mt-3 w-full`}>
            <Download aria-hidden className="size-4" />
            Download
          </a>
        )}
      </div>

      {/* Details */}
      <div className="min-w-0">
        {editing ? (
          <DetailsForm
            doc={doc}
            onSaved={(updated) => {
              onChanged(updated);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <ExpiryBadge expiry={doc.expiryDate} today={today} />
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-small">
              <Fact label="Type" value={documentTypeLabel(doc.category)} />
              <Fact label="Expires" value={showDate(doc.expiryDate) ?? "Not added"} muted={!doc.expiryDate} />
              <Fact label="Issued" value={showDate(doc.issueDate) ?? "Not added"} muted={!doc.issueDate} />
              <Fact label="Uploaded" value={showDate(doc.uploadedAt.slice(0, 10)) ?? "—"} />
              <Fact label="File" value={`${isPdf ? "PDF" : doc.fileType.replace("image/", "").toUpperCase()} · ${fileSizeLabel(doc.fileSize)}`} />
            </dl>
            <button type="button" onClick={() => setEditing(true)} className={`${appLink} mt-3 -ml-0.5`}>
              <Pencil aria-hidden className="size-3.5" />
              Edit details
            </button>

            {(doc.summary || fields.length > 0) && (
              <div className="mt-4 border-t border-border pt-4">
                <h3 className="text-caption font-medium text-slate">Read from the document</h3>
                {doc.summary && <p className="mt-1 text-small text-midnight">{doc.summary}</p>}
                {fields.length > 0 && (
                  <dl className="mt-3 divide-y divide-border rounded-lg border border-border">
                    {fields.map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 px-3 py-2 text-small">
                        <dt className="shrink-0 text-slate">{fieldLabel(k)}</dt>
                        <dd className="min-w-0 text-right break-words text-midnight">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <p className="mt-2 text-caption text-slate">Read by AI, so check it against the document.</p>
              </div>
            )}

            <div className="mt-4 border-t border-border pt-4">
              {confirmDelete ? (
                <div className="rounded-lg bg-red/5 p-3">
                  <p className="text-small font-medium text-midnight">Delete this document?</p>
                  <p className="mt-0.5 text-caption text-slate">The file and its reminders are removed for good.</p>
                  {error && (
                    <div className="mt-2">
                      <FormMessage tone="error">{error}</FormMessage>
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setConfirmDelete(false)} disabled={deleting} className={appBtnSecondary}>
                      Cancel
                    </button>
                    <button type="button" onClick={remove} disabled={deleting} className={appBtnDanger}>
                      {deleting ? (
                        <>
                          <Spinner />
                          Deleting…
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={`${appLink} -ml-0.5 text-red hover:text-red`}
                >
                  <Trash2 aria-hidden className="size-3.5" />
                  Delete document
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Fact({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption text-slate">{label}</dt>
      <dd className={`mt-0.5 break-words ${muted ? "text-slate" : "font-medium text-midnight"}`}>{value}</dd>
    </div>
  );
}
