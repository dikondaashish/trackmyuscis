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
  created_at: string;
};

export const CASE_COLUMNS =
  "id, receipt_number, label, form_type, current_status, status_changed_at, last_checked_at, created_at";

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
