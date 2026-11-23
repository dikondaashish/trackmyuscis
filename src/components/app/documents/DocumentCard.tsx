import {
  BookUser,
  Briefcase,
  CircleAlert,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock,
  CreditCard,
  Download,
  FileBadge,
  FileCheck,
  FileText,
  Heart,
  IdCard,
  Landmark,
  Plane,
  Plus,
  Receipt,
  ScrollText,
  Stamp,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { daysUntil, documentTypeLabel, expiryState, showDate, type ExpiryState, type VaultDocument } from "@/lib/documents/types";
import { appBtnPrimary, appBtnSecondary, appCard, focusRing } from "@/lib/ui";

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

/** The header tint, the badge and the expiry date's colour follow how close the expiry is. */
const HEADER: Record<ExpiryState, string> = {
  valid: "bg-teal/5",
  upcoming: "bg-amber/5",
  soon: "bg-amber/10",
  today: "bg-red/5",
  expired: "bg-cloud",
  none: "bg-ice/60",
};
const BADGE: Record<ExpiryState, string> = {
  valid: "bg-teal/10 text-teal",
  upcoming: "bg-amber/10 text-amber",
  soon: "bg-amber/10 text-amber",
  today: "bg-red/10 text-red",
  expired: "bg-white text-slate",
  none: "bg-white text-slate",
};
const DATE_TONE: Record<ExpiryState, string> = {
  valid: "text-teal",
  upcoming: "text-amber",
  soon: "text-amber",
  today: "text-red",
  expired: "text-slate",
  none: "text-slate",
};
const BADGE_ICON: Record<ExpiryState, LucideIcon | null> = {
  valid: CircleCheck,
  upcoming: Clock,
  soon: CircleAlert,
  today: CircleAlert,
  expired: CircleX,
  none: null,
};

const uploadedDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/**
 * One document in the list: a header tinted by its expiry (type, upload date, days left), then
 * the file name, a line of summary, the expiry date (or "Add expiry"), and View, Download and
 * Delete.
 */
export function DocumentCard({
  doc,
  today,
  downloading,
  onOpen,
  onAddExpiry,
  onDownload,
  onDelete,
}: {
  doc: VaultDocument;
  today: string;
  downloading: boolean;
  onOpen: () => void;
  onAddExpiry: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const Icon = TYPE_ICONS[doc.category] ?? FileBadge;
  const days = daysUntil(doc.expiryDate, today);
  const state = expiryState(days);
  const BadgeIcon = BADGE_ICON[state];
  const uploaded = Number.isNaN(Date.parse(doc.uploadedAt)) ? null : uploadedDate.format(Date.parse(doc.uploadedAt));
  const badge = days === null ? "No expiry" : days < 0 ? "Expired" : days === 0 ? "Today" : `${days}d left`;

  return (
    <article
      aria-label={doc.filename}
      className={`${appCard} flex w-full min-w-0 flex-col overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-blue/40 hover:shadow-[0_8px_24px_-16px_rgba(16,34,61,0.35)]`}
    >
      <div className={`flex items-center justify-between gap-3 px-4 py-3.5 ${HEADER[state]}`}>
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue">
            <Icon aria-hidden className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-small font-semibold text-midnight">{documentTypeLabel(doc.category)}</h3>
            {uploaded && <p className="text-caption text-slate tabular-nums">Uploaded {uploaded}</p>}
          </div>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-caption font-medium tabular-nums ${BADGE[state]}`}>
          {BadgeIcon && <BadgeIcon aria-hidden className="size-3.5" />}
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="truncate text-small font-medium text-midnight" title={doc.filename}>
          {doc.filename}
        </p>
        {doc.summary && <p className="line-clamp-2 text-small text-slate">{doc.summary}</p>}

        {doc.expiryDate ? (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-cloud px-3 py-2.5">
            <span className="text-small text-slate">{state === "expired" ? "Expired on" : "Expires on"}</span>
            <span className={`text-small font-semibold tabular-nums ${DATE_TONE[state]}`}>{showDate(doc.expiryDate)}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAddExpiry}
            className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-lg border border-amber/25 bg-amber/5 px-3 py-2.5 text-small text-amber transition-colors duration-200 hover:bg-amber/10 ${focusRing}`}
          >
            <span>No expiry date</span>
            <span className="inline-flex items-center gap-1 font-semibold">
              <Plus aria-hidden className="size-4" />
              Add expiry
            </span>
          </button>
        )}

        <div className="mt-auto flex gap-2 pt-1">
          <button type="button" onClick={onOpen} className={`${appBtnPrimary} flex-1`}>
            View document
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            aria-label={`Download ${doc.filename}`}
            title="Download"
            className={`${appBtnSecondary} w-10 px-0! sm:w-9`}
          >
            {downloading ? <Spinner /> : <Download aria-hidden className="size-4 shrink-0" />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${doc.filename}`}
            title="Delete"
            className={`${appBtnSecondary} w-10 px-0! hover:border-red/40 hover:bg-red/5 hover:text-red sm:w-9`}
          >
            <Trash2 aria-hidden className="size-4 shrink-0" />
          </button>
        </div>
      </div>
    </article>
  );
}
