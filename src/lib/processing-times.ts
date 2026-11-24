/**
 * Official USCIS processing times, one snapshot per month, read from
 * https://egov.uscis.gov/processing-times/ (form → category → office → "80% of cases are completed within").
 * Each month: read every office for the forms below, save the file as
 * src/lib/processing-times-data/<YYYY-MM-DD>.json and add it to SNAPSHOTS (newest first).
 * Older snapshots stay, so each page can show how the time has moved.
 */
import { FORMS, type UscisForm } from "@/lib/content";
import snapshot20261124 from "@/lib/processing-times-data/2026-11-24.json";

export type PtOffice = {
  code: string;
  name: string;
  value: number;
  unit: string;
  /** "Receipt date for a case inquiry": cases received before it can be asked about. ISO date. */
  inquiry?: string;
  /** Index into the snapshot's notes: USCIS's own note for this category and office. */
  note?: number;
};
export type PtCategory = { code: string; name: string; offices: PtOffice[] };
export type PtSnapshot = {
  /** Date we read the tool. */
  checked: string;
  /** USCIS's own "Last updated" date. */
  published?: string;
  /** "Processing Time Data from May 2026 to October 2026". */
  period?: string;
  notes?: string[];
  forms: Record<string, PtCategory[]>;
};

/** Newest first. */
const SNAPSHOTS: PtSnapshot[] = [snapshot20261124 as PtSnapshot];

export const PT_LATEST = SNAPSHOTS[0];
export const PT_CHECKED = PT_LATEST.checked;

/** USCIS's note text, without the asterisks it uses for emphasis. */
export const noteText = (i: number | undefined) =>
  i === undefined ? undefined : PT_LATEST.notes?.[i]?.replace(/\*+/g, " ").replace(/\s+/g, " ").trim();

/**
 * Times USCIS says cover only part of a category, found by the wording of its note:
 * the I-130 time at the National Benefits Center is adoption cases only, and the employment-based
 * I-485 time at Service Center Operations is EB-4 and EB-5 only.
 */
const PARTIAL: [RegExp, string][] = [
  [/specifically for adoption-based/i, "adoption cases only"],
  [/Service Center Operations are only for fourth preference \(EB-4\) and fifth preference \(EB-5\)/i, "EB-4 and EB-5 only"],
];

/** What part of the category a time covers, when USCIS says it is only part. */
export function partialScope(o: PtOffice) {
  const note = noteText(o.note) ?? "";
  return PARTIAL.find(([re]) => re.test(note) && (!/Service Center/.test(re.source) || /SCOPS|Service Center/.test(o.name)))?.[1];
}

export const isPartial = (o: PtOffice) => partialScope(o) !== undefined;

/** Office label, marking times that only cover part of a category. */
export const officeLabel = (o: PtOffice) => {
  const scope = partialScope(o);
  return `${officeName(o.name)}${scope ? ` (${scope})` : ""}`;
};

/** Forms with a processing-time page, in the order the hub lists them. */
export const PT_FORM_ORDER = ["n-400", "i-130", "i-485", "i-765", "i-140", "i-131", "i-751", "i-90", "i-129"];

export type PtForm = { form: UscisForm; categories: PtCategory[] };

export const PT_FORMS: PtForm[] = PT_FORM_ORDER.flatMap((slug) => {
  const form = FORMS.find((f) => f.slug === slug);
  const categories = form ? PT_LATEST.forms[form.form] : undefined;
  return form && categories?.length ? [{ form, categories }] : [];
});

export const getPtForm = (slug: string) => PT_FORMS.find((p) => p.form.slug === slug);

/** "Agana GU" → "Agana, GU"; "Service Center Operations (SCOPS)" unchanged. */
export const officeName = (name: string) => (name === "All Field Offices" ? "All field offices" : name.replace(/\s([A-Z]{2})$/, ", $1"));

/** 14 Months → "14 months"; 1 Months → "1 month". */
export function formatTime(o: { value: number; unit: string }) {
  const unit = o.unit.toLowerCase().replace(/s$/, "");
  return `${o.value} ${unit}${o.value === 1 ? "" : "s"}`;
}

/** The time in months, so offices can be compared across units. */
export function inMonths(o: { value: number; unit: string }) {
  const u = o.unit.toLowerCase();
  if (u.startsWith("week")) return o.value / 4.345;
  if (u.startsWith("day")) return o.value / 30.44;
  if (u.startsWith("year")) return o.value * 12;
  return o.value;
}

export type PtRow = PtOffice & { category: PtCategory };

/** Every office row of a form, fastest first. */
export function allRows(p: PtForm): PtRow[] {
  return p.categories
    .flatMap((category) => category.offices.map((o) => ({ ...o, category })))
    .sort((a, b) => inMonths(a) - inMonths(b));
}

/** Fastest and slowest of some rows (fastest first), leaving out times that cover only part of a category. */
export function rangeOf(list: PtRow[]) {
  const rows = list.filter((r) => !isPartial(r));
  return { fastest: rows[0], slowest: rows[rows.length - 1], count: rows.length };
}

/** Fastest and slowest row of a whole form. */
export const range = (p: PtForm) => rangeOf(allRows(p));

/** "14 months" or "8 to 14 months". */
export const rangeText = (p: PtForm) => rangeTextOf(allRows(p));

export function rangeTextOf(list: PtRow[]) {
  const { fastest, slowest } = rangeOf(list);
  if (formatTime(fastest) === formatTime(slowest)) return formatTime(fastest);
  const sameUnit = fastest.unit.toLowerCase() === slowest.unit.toLowerCase();
  return sameUnit ? `${fastest.value} to ${formatTime(slowest)}` : `${formatTime(fastest)} to ${formatTime(slowest)}`;
}

/**
 * The category most people filing the form are in, led with in the short answer when a form has
 * several categories with very different times. `who` finishes "For …".
 */
const HEADLINE: Record<string, { code: string; who: string }> = {
  "I-130": { code: "134A-IR", who: "a U.S. citizen's spouse, parent or child under 21" },
  "I-485": { code: "131A-FAM", who: "family-based applications" },
};

/** The lead category of a form and its rows (fastest first), if it has one. */
export function headline(p: PtForm) {
  const h = HEADLINE[p.form.form];
  if (!h || p.categories.length < 2) return undefined;
  const rows = allRows(p).filter((r) => r.category.code === h.code);
  return rows.length ? { who: h.who, rows } : undefined;
}

/** Categories handled at a single office (shown together in one table) and those handled at many offices. */
export function splitCategories(p: PtForm) {
  return {
    single: p.categories.filter((c) => c.offices.length === 1),
    multi: p.categories.filter((c) => c.offices.length > 1),
  };
}

/** What a form's times vary by: "office", "category", "category and office", or "nothing" (one time). */
export function dependsOnLabel(p: PtForm) {
  if (p.categories.length === 1) return p.categories[0].offices.length > 1 ? "office" : "nothing";
  const { single, multi } = splitCategories(p);
  if (multi.length === 0) return "category";
  return single.length === 0 && multi.length === 1 ? "office" : "category and office";
}

/** "11 to 20 months, depending on the office", or just "35 months" when there is one time. */
export function rangeSummary(p: PtForm) {
  const by = dependsOnLabel(p);
  return by === "nothing" ? rangeText(p) : `${rangeText(p)}, depending on the ${by}`;
}
