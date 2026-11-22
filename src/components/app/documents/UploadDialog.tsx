"use client";

import { useId, useRef, useState } from "react";
import { CircleCheck, FileUp, ScanLine } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Dialog } from "@/components/app/Dialog";
import { FormMessage } from "@/components/auth/FormMessage";
import {
  FILE_ACCEPT,
  FILE_TYPES,
  MAX_FILE_BYTES,
  documentTypeLabel,
  fileSizeLabel,
  showDate,
  type VaultDocument,
} from "@/lib/documents/types";
import { appBtnPrimary, appBtnSecondary, focusRing } from "@/lib/ui";
import { api } from "./shared";
import { DetailsForm } from "./DetailsForm";

type Stage = "pick" | "uploading" | "reading" | "done";
type Review = "unread" | "unsure" | "no_expiry" | null;

const REVIEW_COPY: Record<Exclude<Review, null>, { title: string; text: string }> = {
  unread: { title: "Add the details", text: "We couldn't read this file. Choose its type and add the expiry date so we can remind you." },
  unsure: { title: "Please check these details", text: "We couldn't read everything for sure. Check the type and dates." },
  no_expiry: {
    title: "No expiry date found",
    text: "Some documents, like receipt notices, don't expire. If this one does, add the date so we can remind you.",
  },
};

/** Add one document: pick or drop a file, upload, let AI read it, then check the details. */
export function UploadDialog({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded: (doc: VaultDocument) => void;
}) {
  const [stage, setStage] = useState<Stage>("pick");
  const working = stage === "uploading" || stage === "reading";
  return (
    <Dialog
      open={open}
      onClose={working ? () => {} : onClose}
      title="Upload a document"
      description={stage === "pick" ? "PDF, JPG, PNG or WebP, up to 10 MB." : undefined}
      step={stage}
    >
      <UploadFlow onStage={setStage} onClose={onClose} onUploaded={onUploaded} />
    </Dialog>
  );
}

function UploadFlow({
  onStage,
  onClose,
  onUploaded,
}: {
  onStage: (s: Stage) => void;
  onClose: () => void;
  onUploaded: (doc: VaultDocument) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStageState] = useState<Stage>("pick");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ doc: VaultDocument; review: Review } | null>(null);
  const setStage = (s: Stage) => {
    setStageState(s);
    onStage(s);
  };

  function choose(f: File | undefined) {
    setError(null);
    if (!f) return;
    if (!(FILE_TYPES as readonly string[]).includes(f.type)) return setError("Choose a PDF, JPG, PNG or WebP file.");
    if (f.size === 0) return setError("This file is empty.");
    if (f.size > MAX_FILE_BYTES) return setError("That file is over 10 MB.");
    setFile(f);
  }

  async function upload() {
    if (!file) return;
    setError(null);
    setStage("uploading");
    const fail = (message: string) => {
      setError(message);
      setStage("pick");
    };

    const start = await api<{ path?: string }>("/api/documents/upload", {
      body: { step: "start", filename: file.name, size: file.size, type: file.type },
    });
    if (!start.ok || !start.data.path) return fail(start.data.error ?? "We couldn't start the upload. Please try again.");

    const { error: storageError } = await createClient()
      .storage.from("documents")
      .upload(start.data.path, file, { contentType: file.type, upsert: false, cacheControl: "0" });
    if (storageError) return fail("We couldn't upload that file. Please try again.");

    setStage("reading");
    const finish = await api<{ document?: VaultDocument; review?: Review }>("/api/documents/upload", {
      body: { step: "finish", path: start.data.path, filename: file.name },
    });
    if (!finish.ok || !finish.data.document) return fail(finish.data.error ?? "We couldn't save that document. Please try again.");
    setResult({ doc: finish.data.document, review: finish.data.review ?? null });
    onUploaded(finish.data.document);
    setStage("done");
  }

  if (stage === "uploading" || stage === "reading") {
    return (
      <div role="status" className="flex flex-col items-center py-8 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-ice text-blue">
          {stage === "uploading" ? <FileUp aria-hidden className="size-5" /> : <ScanLine aria-hidden className="size-5 animate-pulse" />}
        </span>
        <p className="mt-3 text-small font-semibold text-midnight">{stage === "uploading" ? "Uploading…" : "Reading your document…"}</p>
        <p className="mt-0.5 max-w-xs text-small text-slate">
          {stage === "uploading" ? file?.name : "Finding the type, dates and key details. This can take a few seconds."}
        </p>
      </div>
    );
  }

  if (stage === "done" && result) {
    const { doc, review } = result;
    const copy = review ? REVIEW_COPY[review] : null;
    return (
      <div>
        <div className="flex items-start gap-3">
          <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-teal" />
          <div className="min-w-0">
            <p className="text-small font-semibold text-midnight">Saved to your documents</p>
            <p className="truncate text-small text-slate">{doc.filename}</p>
          </div>
        </div>
        {copy ? (
          <div className="mt-4 rounded-lg border border-border p-3.5">
            <p className="text-small font-medium text-midnight">{copy.title}</p>
            <p className="mt-0.5 text-caption text-slate">{copy.text}</p>
            <div className="mt-3">
              <DetailsForm
                doc={doc}
                submitLabel="Save details"
                onSaved={(updated) => {
                  onUploaded(updated);
                  onClose();
                }}
                onCancel={onClose}
                cancelLabel="Skip"
              />
            </div>
          </div>
        ) : (
          <>
            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-cloud p-3.5 text-small">
              <div>
                <dt className="text-caption text-slate">Type</dt>
                <dd className="mt-0.5 font-medium text-midnight">{documentTypeLabel(doc.category)}</dd>
              </div>
              <div>
                <dt className="text-caption text-slate">Expires</dt>
                <dd className="mt-0.5 font-medium text-midnight">{showDate(doc.expiryDate) ?? "No date"}</dd>
              </div>
            </dl>
            <p className="mt-2 text-caption text-slate">Read by AI. You can correct anything when you open the document.</p>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={onClose} data-autofocus className={appBtnPrimary}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length !== 1) return setError("Drop one file at a time.");
          choose(e.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer flex-col items-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors duration-200 ${
          dragging ? "border-blue bg-ice" : "border-border bg-cloud hover:border-blue/50 hover:bg-ice/50"
        } has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue`}
      >
        <FileUp aria-hidden className="size-6 text-blue" />
        <span className="mt-2 max-w-full truncate text-small font-semibold text-midnight">
          {file ? file.name : "Choose a file or drop it here"}
        </span>
        <span className="mt-0.5 text-caption text-slate">{file ? fileSizeLabel(file.size) : "Passport, green card, work permit, notices…"}</span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={FILE_ACCEPT}
          data-autofocus
          className={`sr-only ${focusRing}`}
          onChange={(e) => {
            choose(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <div className="mt-3">
          <FormMessage tone="error">{error}</FormMessage>
        </div>
      )}
      <p className="mt-3 text-caption text-slate">
        Read by Google&apos;s Gemini AI.{" "}
        <a href="/privacy#sharing" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-midnight">
          Privacy Policy
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className={appBtnSecondary}>
          Cancel
        </button>
        <button type="button" onClick={upload} disabled={!file} className={appBtnPrimary}>
          Upload
        </button>
      </div>
    </div>
  );
}
