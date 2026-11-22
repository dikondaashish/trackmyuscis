import { FORMS, STATUSES, type Tone } from "@/lib/content";
import { SERVICE_CENTERS, isOnlineReceipt, receiptFiscalYear } from "@/lib/receipt";
import { asksFilingCategory, categoryFor } from "@/lib/filing-category";

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
  /** What the case is for (see filing-category.ts); null until the owner says. */
  filing_category: string | null;
  /** USCIS doesn't recognize the receipt number; checks_stopped once retries ended. */
  uscis_not_found: boolean;
  checks_stopped: boolean;
  /** YYYY-MM-DD the owner says they completed biometrics; their own record. */
  biometrics_attended_date: string | null;
  created_at: string;
};

export const CASE_COLUMNS =
  "id, receipt_number, label, form_type, current_status, status_changed_at, last_checked_at, status_description, status_history, engine_registered_at, filing_category, uscis_not_found, checks_stopped, biometrics_attended_date, created_at";

export const formFor = (code: string | null) => (code ? FORMS.find((f) => f.form === code) : undefined);

/** What we call a case in lists: its name, else what it's for, else its form, else "USCIS case". */
export function caseTitle(c: Pick<CaseRow, "label" | "form_type"> & { filing_category?: string | null }) {
  if (c.label) return c.label;
  const category = asksFilingCategory(c.form_type) ? categoryFor(c.filing_category ?? null, c.form_type) : undefined;
  if (category && category.value !== "other") return category.short;
  const form = formFor(c.form_type);
  return (form ? `${form.form} ${form.label.toLowerCase()}` : c.form_type) || "USCIS case";
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
  const fy = receiptFiscalYear(receipt);
  return {
    prefix,
    office: SERVICE_CENTERS[prefix] ?? null,
    online: isOnlineReceipt(receipt),
    // Only paper-filed numbers carry a year. USCIS fiscal year N runs October 1 of N-1 to
    // September 30 of N.
    fiscalYear: fy,
    fiscalRange: fy === null ? null : `${monthYear.format(Date.UTC(fy - 1, 9, 1))} – ${monthYear.format(Date.UTC(fy, 8, 30))}`,
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

export type TimelineEntry = {
  status: string;
  date: string | null;
  current: boolean;
  /** Added by the person (biometrics attendance), not from USCIS. */
  byYou?: boolean;
};

/**
 * A case's status history for the timeline, newest first. Adds the current status on top
 * when USCIS hasn't put it in the history yet (its date is then unknown).
 */
export function statusTimeline(
  c: Pick<CaseRow, "current_status" | "status_history"> & { biometrics_attended_date?: string | null },
): TimelineEntry[] {
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

  // The person's own biometrics date, in date order below the current status.
  const attended = c.biometrics_attended_date ? readUscisDate(c.biometrics_attended_date) : null;
  if (attended !== null) {
    const mine: TimelineEntry = { status: "You completed your biometrics appointment", date: utcDate.format(attended), current: false, byYou: true };
    const dated = items.map((h) => h.at);
    // entries[0] is the current status; later entries follow `items` (offset by one if the
    // current status was added on top).
    const offset = entries.length - items.length;
    let at = entries.length;
    for (let i = 0; i < items.length; i++) {
      const t = dated[i];
      if (t !== null && t <= attended) {
        at = i + offset;
        break;
      }
    }
    entries.splice(Math.max(at, 1), 0, mine);
  }
  return entries;
}

/**
 * When the current status started: the date USCIS gives for it in the history, else when
 * we saw it change. Null when neither is known (for example a case's first status).
 */
export function lastStatusChange(c: Pick<CaseRow, "current_status" | "status_history" | "status_changed_at">): string | null {
  if (!c.current_status) return null;
  const top = c.status_history?.length ? statusTimeline(c)[0] : undefined;
  if (top?.current && top.date) return top.date;
  return c.status_changed_at ? utcDate.format(new Date(c.status_changed_at)) : null;
}

/**
 * When USCIS started premium processing, from the case's history: "We started the
 * premium-processing clock…" or "Case Was Changed To A Premium Processing Case" (an
 * upgrade after filing). USCIS reports it for every premium case, so we never ask.
 * Returns the earliest such date, "" when the date is unreadable, or null if not premium.
 */
export function premiumSince(c: Pick<CaseRow, "status_history" | "current_status">): string | null {
  const isPremium = (text: string) => /premium[- ]processing/i.test(text);
  const entries = (Array.isArray(c.status_history) ? c.status_history : []).filter(
    (h) => h && typeof h.completedText === "string" && isPremium(h.completedText),
  );
  if (entries.length === 0) return c.current_status && isPremium(c.current_status) ? "" : null;
  const times = entries.map((h) => (typeof h.date === "string" ? readUscisDate(h.date) : null)).filter((t): t is number => t !== null);
  return times.length ? utcDate.format(Math.min(...times)) : "";
}
