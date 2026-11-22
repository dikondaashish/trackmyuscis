"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { focusRing } from "@/lib/ui";

/**
 * A modal built on the native <dialog>: focus is trapped and Escape closes it for free.
 * A click on the dimmed backdrop closes it too. Mark the field to focus first with data-autofocus.
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
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-white p-0 text-midnight shadow-[0_24px_64px_-24px_rgba(16,34,61,0.35)] backdrop:bg-midnight/40"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="text-title">
              {title}
            </h2>
            {description && <p className="mt-1 text-small text-slate">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`-mt-2 -mr-2 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-slate hover:bg-cloud hover:text-midnight ${focusRing}`}
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="mt-6">{open && children}</div>
      </div>
    </dialog>
  );
}
