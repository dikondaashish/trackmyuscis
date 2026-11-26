/**
 * Official USCIS processing times, one snapshot per month, read from
 * https://egov.uscis.gov/processing-times/ (form → category → office → "80% of cases are completed within").
 * Each month: read every office for the forms below, save the file as
 * src/lib/processing-times-data/<YYYY-MM-DD>.json and add it to SNAPSHOTS (newest first).
 * Older snapshots stay, so each page can show how the time has moved.
 */
import { FORMS, type UscisForm } from "@/lib/content";
import { longDate } from "@/lib/seo";
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
 * The categories most people filing the form are in. The first leads the short answer when a form
 * has several categories with very different times; both lead the search description.
 * `who` finishes "For …"; `label` follows the time in a list ("6 months for F-1 OPT").
 */
type Lead = { code: string; who: string; label: string };
const HEADLINE: Record<string, Lead[]> = {
  "I-130": [{ code: "134A-IR", who: "a U.S. citizen's spouse, parent or child under 21", label: "for a U.S. citizen's spouse, parent or child under 21" }],
  "I-485": [
    { code: "131A-FAM", who: "family-based applications", label: "for family-based cases" },
    { code: "131A", who: "employment-based applications", label: "for employment-based cases" },
  ],
  "I-765": [
    { code: "147-C9", who: "a work permit based on a pending green card application, category (c)(9)", label: "with a pending I-485, (c)(9)" },
    { code: "147-C3", who: "F-1 students applying for OPT, category (c)(3)", label: "for F-1 OPT, (c)(3)" },
  ],
  "I-140": [
    { code: "136A-E21", who: "advanced degree or exceptional ability petitions (E21)", label: "for advanced degree petitions (E21)" },
    { code: "136A-NIW", who: "national interest waiver petitions", label: "for national interest waivers" },
  ],
  "I-129": [
    { code: "137-H1B3", who: "H-1B extensions of stay", label: "for H-1B extensions" },
    { code: "137-H1B2", who: "H-1B changes of status", label: "for H-1B changes of status" },
  ],
};

/** The lead categories of a form that have times in the latest snapshot, each with its rows (fastest first). */
export function leads(p: PtForm) {
  if (p.categories.length < 2) return [];
  return (HEADLINE[p.form.form] ?? []).flatMap((h) => {
    const rows = allRows(p).filter((r) => r.category.code === h.code && !isPartial(r));
    return rows.length ? [{ ...h, rows }] : [];
  });
}

/** "for family-based cases" for a lead category; undefined for any other. */
export const leadLabel = (form: string, code: string) => HEADLINE[form]?.find((h) => h.code === code)?.label;

/** The lead category of a form and its rows (fastest first), if it has one. */
export const headline = (p: PtForm) => leads(p)[0];

/** The direct answer for a form: its lead category first when it has one, then the full range. */
export function ptShortAnswer(p: PtForm) {
  const f = p.form;
  const { fastest, slowest, count } = range(p);
  const meaning = `That's how long it took USCIS to finish 80% of these cases over the past six months, as shown on ${longDate(PT_CHECKED)}.`;
  if (count === 1) return `USCIS's official processing time for Form ${f.form} is ${formatTime(fastest)}. ${meaning}`;
  const lead = headline(p);
  if (lead) {
    const r = rangeOf(lead.rows);
    const office = officeName(r.fastest.name);
    const where = r.count > 1 ? ", depending on the office" : office === "All field offices" ? " at USCIS field offices" : ` at ${office}`;
    return `For ${lead.who}, USCIS's official Form ${f.form} processing time is ${rangeTextOf(lead.rows)}${where}. ${meaning} Across all ${p.categories.length} categories it runs from ${rangeText(p)}.`;
  }
  const by = dependsOnLabel(p);
  const ends =
    by === "office" ? ` The fastest office is ${officeName(fastest.name)} and the slowest is ${officeName(slowest.name)}.` : "";
  return `USCIS's official processing time for Form ${f.form} is ${rangeText(p)}, depending on the ${by}. ${meaning}${ends}`;
}

/**
 * Search description, 160 characters at most. Forms with very different categories lead with the
 * ones most people file ("16 months with a pending I-485, 6 months for F-1 OPT") instead of the
 * full range, which says little ("1 week to 19 months").
 */
export function ptDescription(p: PtForm) {
  const f = p.form.form;
  const by = dependsOnLabel(p);
  const see = by === "nothing" ? "See" : `See every ${by},`;
  const tail = ["what the number means and what to do if you're past it.", "and what to do if you're past it.", "and what to do next."];
  const lead = leads(p);
  const starts = [
    ...(lead.length > 1 ? [`Official ${f} processing time: ${lead.map((l) => `${rangeTextOf(l.rows)} ${l.label}`).join(", ")}.`] : []),
    ...(lead.length > 0 ? [`Official ${f} processing time: ${rangeTextOf(lead[0].rows)} ${lead[0].label}.`] : []),
    `USCIS's official ${f} processing time is ${rangeSummary(p)}.`,
  ];
  for (const start of starts) for (const end of tail) if (`${start} ${see} ${end}`.length <= 160) return `${start} ${see} ${end}`;
  return starts[starts.length - 1];
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

/* ----------------------------------------------------------- office pages */

/** Service centers and "all offices" rows are not a place someone's case is assigned to by where they live. */
const isLocalOffice = (o: PtOffice) => !/^All Field Offices$|Service Center|National Benefits Center/i.test(o.name);

/** "Seattle WA" → "seattle-wa"; "Minneapolis-St. Paul MN" → "minneapolis-st-paul-mn". */
export const officeSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** "Seattle WA" → "WA"; undefined when the name doesn't end in a state or territory code. */
export const officeState = (name: string) => name.match(/\s([A-Z]{2})$/)?.[1];

export type PtOfficePage = {
  p: PtForm;
  slug: string;
  /** "Seattle, WA". */
  name: string;
  state?: string;
  /** The category decided office by office (family-based for I-485; the only one for N-400). */
  category: PtCategory;
  office: PtOffice;
  /** Every local office of that category, fastest first. */
  peers: PtOffice[];
};

/** The category of a form that USCIS reports office by office, if it has one. */
function localCategory(p: PtForm) {
  return p.categories.find((c) => c.offices.filter(isLocalOffice).length > 8);
}

/** Forms whose times differ by field office, so each office gets a page. */
export const PT_OFFICE_FORMS = PT_FORMS.filter((p) => localCategory(p) !== undefined);

export function officePages(p: PtForm): PtOfficePage[] {
  const category = localCategory(p);
  if (!category) return [];
  const peers = category.offices.filter(isLocalOffice).sort((a, b) => inMonths(a) - inMonths(b) || a.name.localeCompare(b.name));
  return [...peers]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((office) => ({ p, slug: officeSlug(office.name), name: officeName(office.name), state: officeState(office.name), category, office, peers }));
}

export const PT_OFFICE_PAGES: PtOfficePage[] = PT_OFFICE_FORMS.flatMap(officePages);

export const getOfficePage = (formSlug: string, slug: string) => PT_OFFICE_PAGES.find((o) => o.p.form.slug === formSlug && o.slug === slug);

/** Path of an office's page for a form, or undefined when that office has no page. */
export function officeHref(formSlug: string, officeNameRaw: string) {
  const page = getOfficePage(formSlug, officeSlug(officeNameRaw));
  return page ? `/processing-times/${formSlug}/${page.slug}` : undefined;
}

/** How an office compares with the others for the same form and category. */
export function officeStanding(o: PtOfficePage) {
  const mine = inMonths(o.office);
  const faster = o.peers.filter((x) => inMonths(x) < mine).length;
  const slower = o.peers.filter((x) => inMonths(x) > mine).length;
  const middle = o.peers[Math.floor((o.peers.length - 1) / 2)];
  return { faster, slower, same: o.peers.length - faster - slower - 1, total: o.peers.length, fastest: o.peers[0], slowest: o.peers[o.peers.length - 1], middle };
}

/** Times for the same form that USCIS reports for all field offices together (for example employment-based I-485). */
export function allFieldOfficeRows(p: PtForm, except: PtCategory) {
  return p.categories
    .filter((c) => c.code !== except.code)
    .flatMap((c) => c.offices.filter((x) => x.name === "All Field Offices").map((x) => ({ category: c, office: x })));
}

/* ------------------------------------------------------------ time check */

/** One form's times in the small shape the on-page time check needs (sent to the browser). */
export type TimeCheckForm = {
  slug: string;
  code: string;
  label: string;
  categories: {
    code: string;
    name: string;
    offices: { code: string; label: string; time: string; months: number; inquiry?: string; href?: string }[];
  }[];
};

export function timeCheckForm(p: PtForm, only?: { category: string; office: string }): TimeCheckForm {
  return {
    slug: p.form.slug,
    code: p.form.form,
    label: p.form.label,
    categories: p.categories
      .filter((c) => !only || c.code === only.category)
      .map((c) => ({
        code: c.code,
        name: c.name,
        offices: [...c.offices]
          .filter((o) => !only || o.code === only.office)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((o) => ({
            code: o.code,
            label: officeLabel(o),
            time: formatTime(o),
            months: inMonths(o),
            inquiry: o.inquiry,
            href: officeHref(p.form.slug, o.name),
          })),
      })),
  };
}
