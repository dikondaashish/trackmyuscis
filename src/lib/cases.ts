import { FORMS, STATUSES, type Tone } from "@/lib/content";
import { SERVICE_CENTERS } from "@/lib/receipt";

export const MAX_CASES = 10;

export type CaseRow = {
  id: string;
  receipt_number: string;
  label: string | null;
  form_type: string | null;
  current_status: string | null;
  status_changed_at: string | null;
  last_checked_at: string | null;
  status_description: string | null;
  /** USCIS history, newest first: [{ date, completedText }]. */
  status_history: { date: string; completedText: string }[] | null;
  engine_registered_at: string | null;
  created_at: string;
};

export const CASE_COLUMNS =
  "id, receipt_number, label, form_type, current_status, status_changed_at, last_checked_at, status_description, status_history, engine_registered_at, created_at";

/** Choices for "Which form?": every form we cover, plus "Not sure". */
export const FORM_OPTIONS = [
  { value: "", label: "Not sure / other form" },
  ...FORMS.map((f) => ({ value: f.form, label: `${f.form} · ${f.label}` })),
];

export const formFor = (code: string | null) => (code ? FORMS.find((f) => f.form === code) : undefined);

/** What we call a case in lists: its name, else its form, else "USCIS case". */
export function caseTitle(c: Pick<CaseRow, "label" | "form_type">) {
  const form = formFor(c.form_type);
  return c.label || (form ? `${form.form} ${form.label.toLowerCase()}` : c.form_type) || "USCIS case";
}

export function caseStatus(c: Pick<CaseRow, "current_status">): { name: string; tone: Tone; meaning?: string } | null {
  if (!c.current_status) return null;
  const known = STATUSES.find((s) => s.name === c.current_status);
  return known ?? { name: c.current_status, tone: "info" };
}

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** Facts we can read straight off a receipt number, with no lookup. */
export function receiptFacts(receipt: string) {
  const prefix = receipt.slice(0, 3);
  const fy = 2000 + Number(receipt.slice(3, 5));
  return {
    prefix,
    office: SERVICE_CENTERS[prefix] ?? null,
    online: prefix === "IOE",
    fiscalYear: fy,
    // USCIS fiscal year N runs October 1 of N-1 to September 30 of N.
    fiscalRange: `${monthYear.format(Date.UTC(fy - 1, 9, 1))} – ${monthYear.format(Date.UTC(fy, 8, 30))}`,
  };
}

export const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const utcDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** USCIS history dates come as ISO timestamps or "MM-DD-YYYY HH:MM:SS"; read either, or give up. */
function readUscisDate(value: string): number | null {
  const us = /^(\d{2})-(\d{2})-(\d{4})/.exec(value.trim());
  if (us) return Date.UTC(Number(us[3]), Number(us[1]) - 1, Number(us[2]));
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

export type TimelineEntry = { status: string; date: string | null; current: boolean };

/**
 * A case's status history for the timeline, newest first. Adds the current status on top
 * when USCIS hasn't put it in the history yet (its date is then unknown).
 */
export function statusTimeline(c: Pick<CaseRow, "current_status" | "status_history">): TimelineEntry[] {
  const items = (Array.isArray(c.status_history) ? c.status_history : [])
    .filter((h) => h && typeof h.completedText === "string" && h.completedText.trim())
    .map((h, i) => ({ status: h.completedText.trim(), at: typeof h.date === "string" ? readUscisDate(h.date) : null, i }))
    // Newest first; entries without a readable date keep USCIS's own order.
    .sort((a, b) => (a.at !== null && b.at !== null && a.at !== b.at ? b.at - a.at : a.i - b.i));
  const entries: TimelineEntry[] = items.map((h) => ({
    status: h.status,
    date: h.at === null ? null : utcDate.format(h.at),
    current: false,
  }));
  const current = c.current_status?.trim();
  const same = (a: string, b: string) => a.toLowerCase().replace(/\s+/g, " ") === b.toLowerCase().replace(/\s+/g, " ");
  if (current && (!entries[0] || !same(entries[0].status, current))) entries.unshift({ status: current, date: null, current: true });
  else if (entries[0]) entries[0].current = true;
  return entries;
}
