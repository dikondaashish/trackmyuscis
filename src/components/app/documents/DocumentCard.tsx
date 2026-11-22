import {
  BookUser,
  Briefcase,
  CalendarPlus,
  ClipboardList,
  CreditCard,
  FileBadge,
  FileCheck,
  FileText,
  Heart,
  IdCard,
  Landmark,
  Plane,
  Receipt,
  ScrollText,
  Stamp,
  type LucideIcon,
} from "lucide-react";
import { daysUntil, documentTypeLabel, expiryState, showDate, type VaultDocument } from "@/lib/documents/types";
import { appCard, focusRing } from "@/lib/ui";
import { ExpiryBadge } from "./ExpiryBadge";

/** One icon per known type; anything else (a type someone typed) gets FileBadge. */
export const TYPE_ICONS: Record<string, LucideIcon> = {
  passport: BookUser,
  visa: Stamp,
  green_card: IdCard,
  ead_card: CreditCard,
  receipt_notice: Receipt,
  approval_notice: FileCheck,
  i94: Plane,
  i20: ClipboardList,
  ds2019: ClipboardList,
  travel_document: Plane,
  birth_certificate: ScrollText,
  marriage_certificate: Heart,
  naturalization_certificate: Landmark,
  drivers_license: IdCard,
  employment_letter: Briefcase,
  other: FileText,
};

/**
 * One document in the list: type, file name, expiry and a line of summary. The whole card
 * opens the document; a missing expiry date gets its own "Add expiry date" button.
 */
export function DocumentCard({
  doc,
  today,
  onOpen,
  onAddExpiry,
}: {
  doc: VaultDocument;
  today: string;
  onOpen: () => void;
  onAddExpiry: () => void;
}) {
  const Icon = TYPE_ICONS[doc.category] ?? FileBadge;
  return (
    <article
      className={`${appCard} group relative flex w-full min-w-0 flex-col p-4 transition-[border-color,box-shadow] duration-200 hover:border-blue/40 hover:shadow-[0_8px_24px_-16px_rgba(16,34,61,0.35)] has-[:focus-visible]:border-blue/40`}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ice text-blue">
          <Icon aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-small font-semibold text-midnight">
            <button
              type="button"
              onClick={onOpen}
              className={`text-left after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none ${focusRing}`}
            >
              {documentTypeLabel(doc.category)}
            </button>
          </h3>
          <p className="truncate text-caption text-slate" title={doc.filename}>
            {doc.filename}
          </p>
        </div>
      </div>

      {doc.summary && <p className="mt-3 line-clamp-2 text-small text-slate">{doc.summary}</p>}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
        {doc.expiryDate ? (
          <>
            <ExpiryBadge expiry={doc.expiryDate} today={today} />
            {/* "Valid until…" already names the date. */}
            {expiryState(daysUntil(doc.expiryDate, today)) !== "valid" && (
              <span className="text-caption text-slate tabular-nums">{showDate(doc.expiryDate)}</span>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onAddExpiry}
            className={`relative z-10 inline-flex min-h-8 items-center gap-1.5 rounded-full bg-amber/10 px-2.5 text-caption font-medium text-amber transition-colors duration-200 hover:bg-amber/15 ${focusRing}`}
          >
            <CalendarPlus aria-hidden className="size-3.5" />
            Add expiry date
          </button>
        )}
      </div>
    </article>
  );
}
