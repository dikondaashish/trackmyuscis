/**
 * What a work permit (Form I-765) is for. USCIS's case status only says "I-765", but each
 * eligibility category has its own processing time, so the owner tells us once.
 * Codes match the database check (cases_filing_category_known).
 */

export type FilingCategory = "c3a" | "c3b" | "c3c" | "c8" | "a5" | "c9" | "c26" | "tps" | "c11" | "c33" | "other";

export type CategoryOption = {
  value: FilingCategory;
  label: string;
  /** The category as printed on the receipt notice and the card. */
  code: string | null;
  /** Short name for titles: "OPT work permit". */
  short: string;
  /** USCIS offers premium processing for this category. */
  premium: boolean;
};

export const WORK_PERMIT_CATEGORIES: CategoryOption[] = [
  { value: "c3b", label: "OPT after graduation", code: "(c)(3)(B)", short: "OPT work permit", premium: true },
  { value: "c3c", label: "STEM OPT extension", code: "(c)(3)(C)", short: "STEM OPT work permit", premium: true },
  { value: "c3a", label: "OPT before graduation", code: "(c)(3)(A)", short: "OPT work permit", premium: true },
  { value: "c9", label: "Pending green card application", code: "(c)(9)", short: "Green card work permit", premium: false },
  { value: "c8", label: "Pending asylum application", code: "(c)(8)", short: "Asylum work permit", premium: false },
  { value: "a5", label: "Asylum granted", code: "(a)(5)", short: "Asylee work permit", premium: false },
  { value: "c26", label: "H-4 spouse of an H-1B worker", code: "(c)(26)", short: "H-4 work permit", premium: false },
  { value: "tps", label: "Temporary Protected Status (TPS)", code: "(a)(12) or (c)(19)", short: "TPS work permit", premium: false },
  { value: "c11", label: "Parole", code: "(c)(11)", short: "Parole work permit", premium: false },
  { value: "c33", label: "DACA", code: "(c)(33)", short: "DACA work permit", premium: false },
  { value: "other", label: "Something else", code: null, short: "Work permit", premium: false },
];

/** Forms where we ask. Other forms have one main purpose, or we don't ask yet. */
export const asksFilingCategory = (formType: string | null) => formType === "I-765";

export const categoryFor = (value: string | null) => WORK_PERMIT_CATEGORIES.find((c) => c.value === value);

/**
 * A likely answer from the person's other saved cases, shown pre-selected but never saved
 * until they confirm it. For example, an I-765 next to an I-485 is usually a green card
 * work permit.
 */
export function suggestCategory(otherForms: (string | null)[]): FilingCategory | null {
  const has = (f: string) => otherForms.includes(f);
  if (has("I-485")) return "c9";
  if (has("I-589")) return "c8";
  if (has("I-821D")) return "c33";
  if (has("I-821")) return "tps";
  if (has("I-539")) return "c26";
  return null;
}
