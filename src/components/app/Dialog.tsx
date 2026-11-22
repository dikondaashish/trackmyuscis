"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { appIconBtn } from "@/lib/ui";

/**
 * A modal built on the native <dialog>: focus is trapped and Escape closes it for free.
 * A click on the dimmed backdrop closes it too. Mark the field to focus first with data-autofocus.
 * It scales in on open and eases out on close (globals.css, dialog.modal); the content stays
 * mounted while it closes and starts fresh on every open.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // A new key on every open, so forms inside start empty again.
  const [round, setRound] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setRound((r) => r + 1);
  }

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // React doesn't put autoFocus in the DOM, so the dialog would focus its close button.
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
      className="modal m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-white p-0 text-midnight shadow-[0_24px_64px_-24px_rgba(16,34,61,0.35)]"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="text-body font-semibold">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-small text-slate">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`${appIconBtn} -mt-1 -mr-1.5`}
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        <div key={round} className="mt-4">
          {children}
        </div>
      </div>
    </dialog>
  );
}
