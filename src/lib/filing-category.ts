/**
 * What a case is for. USCIS's case status names the form ("I-140") but not the
 * classification (EB-2 NIW, H-1B transfer, OPT…), and each has its own processing time, so
 * the owner tells us once. Forms with one main purpose (I-90, N-400, I-751…) aren't asked.
 *
 * Codes are unique across forms: I-765 uses its short eligibility codes (saved before other
 * forms were added), the rest start with the form ("i140-eb1a"). Every code must also be in
 * the database check cases_filing_category_known.
 */

export type FilingCategory = string;

export type CategoryOption = {
  value: FilingCategory;
  label: string;
  /** The code printed on the notice or card, when there is one: "(c)(3)(B)". */
  code: string | null;
  /** Short name for titles: "OPT work permit", "EB-2 NIW petition". */
  short: string;
};

export type FormPurpose = {
  /** The question and dialog title. */
  question: string;
  /** The dropdown's label. */
  field: string;
  /** One line on why we ask and where to find it. */
  why: string;
  /** The dashboard link while it's unanswered. */
  prompt: string;
  options: CategoryOption[];
};

const other = (form: string, short: string): CategoryOption => ({
  value: form === "I-765" ? "other" : `${form.toLowerCase().replace("-", "")}-other`,
  label: "Something else",
  code: null,
  short,
});

export const FORM_PURPOSES: Record<string, FormPurpose> = {
  "I-765": {
    question: "What is this work permit for?",
    field: "Work permit category",
    why: "Each kind of work permit has its own processing time, and USCIS doesn't say which one this is. It's on your receipt notice as the category, like (c)(3)(B).",
    prompt: "Add work permit type",
    options: [
      { value: "c3b", label: "OPT after graduation", code: "(c)(3)(B)", short: "OPT work permit" },
      { value: "c3c", label: "STEM OPT extension", code: "(c)(3)(C)", short: "STEM OPT work permit" },
      { value: "c3a", label: "OPT before graduation", code: "(c)(3)(A)", short: "OPT work permit" },
      { value: "c9", label: "Pending green card", code: "(c)(9)", short: "Green card work permit" },
      { value: "c8", label: "Pending asylum", code: "(c)(8)", short: "Asylum work permit" },
      { value: "a5", label: "Asylum granted", code: "(a)(5)", short: "Asylee work permit" },
      { value: "c26", label: "H-4 spouse", code: "(c)(26)", short: "H-4 work permit" },
      { value: "tps", label: "Temporary Protected Status", code: "(a)(12) or (c)(19)", short: "TPS work permit" },
      { value: "c11", label: "Parole", code: "(c)(11)", short: "Parole work permit" },
      { value: "c33", label: "DACA", code: "(c)(33)", short: "DACA work permit" },
      other("I-765", "Work permit"),
    ],
  },
  "I-140": {
    question: "What is this petition for?",
    field: "Immigrant category",
    why: "Each green card category has its own processing time, and USCIS doesn't say which one this is. Your employer or lawyer can tell you if you're not sure.",
    prompt: "Add petition type",
    options: [
      { value: "i140-eb1a", label: "EB-1A, extraordinary ability", code: null, short: "EB-1A petition" },
      { value: "i140-eb1b", label: "EB-1B, outstanding researcher", code: null, short: "EB-1B petition" },
      { value: "i140-eb1c", label: "EB-1C, multinational manager", code: null, short: "EB-1C petition" },
      { value: "i140-eb2niw", label: "EB-2 NIW, national interest waiver", code: null, short: "EB-2 NIW petition" },
      { value: "i140-eb2perm", label: "EB-2 with a job offer (PERM)", code: null, short: "EB-2 petition" },
      { value: "i140-eb3", label: "EB-3, skilled worker or professional", code: null, short: "EB-3 petition" },
      other("I-140", "Immigrant petition"),
    ],
  },
  "I-129": {
    question: "What is this petition for?",
    field: "Petition type",
    why: "Each kind of work visa petition has its own processing time, and USCIS doesn't say which one this is. Your employer or lawyer can tell you if you're not sure.",
    prompt: "Add petition type",
    options: [
      { value: "i129-h1b-new", label: "H-1B, new employment (cap)", code: null, short: "H-1B petition" },
      { value: "i129-h1b-transfer", label: "H-1B transfer to a new employer", code: null, short: "H-1B transfer" },
      { value: "i129-h1b-extension", label: "H-1B extension", code: null, short: "H-1B extension" },
      { value: "i129-h1b-amendment", label: "H-1B amendment", code: null, short: "H-1B amendment" },
      { value: "i129-l1", label: "L-1, intracompany transfer", code: null, short: "L-1 petition" },
      { value: "i129-o1", label: "O-1, extraordinary ability", code: null, short: "O-1 petition" },
      other("I-129", "Work visa petition"),
    ],
  },
  "I-485": {
    question: "What is this green card application based on?",
    field: "Green card basis",
    why: "Family, job and humanitarian green cards move at different speeds, and USCIS doesn't say which one this is.",
    prompt: "Add green card type",
    options: [
      { value: "i485-family", label: "Family", code: null, short: "Family green card" },
      { value: "i485-employment", label: "Employment", code: null, short: "Employment green card" },
      { value: "i485-asylum", label: "Asylum or refugee status", code: null, short: "Asylee green card" },
      { value: "i485-diversity", label: "Diversity visa (lottery)", code: null, short: "Diversity green card" },
      other("I-485", "Green card application"),
    ],
  },
  "I-130": {
    question: "Who is this petition for?",
    field: "Relationship",
    why: "Wait times depend on the relationship and on whether the petitioner is a citizen or a green card holder, and USCIS doesn't say which one this is.",
    prompt: "Add relationship",
    options: [
      { value: "i130-spouse-citizen", label: "Spouse of a U.S. citizen", code: null, short: "Spouse petition" },
      { value: "i130-parent-citizen", label: "Parent of a U.S. citizen", code: null, short: "Parent petition" },
      { value: "i130-child-citizen", label: "Child under 21 of a U.S. citizen", code: null, short: "Child petition" },
      { value: "i130-adult-child-citizen", label: "Son or daughter 21 or older of a U.S. citizen", code: null, short: "Adult child petition" },
      { value: "i130-sibling-citizen", label: "Brother or sister of a U.S. citizen", code: null, short: "Sibling petition" },
      { value: "i130-family-lpr", label: "Spouse or child of a green card holder", code: null, short: "Family petition" },
      other("I-130", "Family petition"),
    ],
  },
  "I-539": {
    question: "What is this application for?",
    field: "Application type",
    why: "Each kind of extension or change of status has its own processing time, and USCIS doesn't say which one this is.",
    prompt: "Add application type",
    options: [
      { value: "i539-h4", label: "H-4 extension or change of status", code: null, short: "H-4 application" },
      { value: "i539-f1-j1", label: "Change to F-1 or J-1 status", code: null, short: "Change of status" },
      { value: "i539-visitor", label: "Visitor (B-1/B-2) extension", code: null, short: "Visitor extension" },
      other("I-539", "Stay application"),
    ],
  },
  "I-131": {
    question: "What travel document is this for?",
    field: "Travel document",
    why: "Each travel document has its own processing time, and USCIS doesn't say which one this is.",
    prompt: "Add document type",
    options: [
      { value: "i131-advance-parole", label: "Advance parole", code: null, short: "Advance parole" },
      { value: "i131-reentry", label: "Reentry permit", code: null, short: "Reentry permit" },
      { value: "i131-refugee", label: "Refugee travel document", code: null, short: "Refugee travel document" },
      other("I-131", "Travel document"),
    ],
  },
};

/** Forms where we ask what the case is for. */
export const asksFilingCategory = (formType: string | null) => !!formType && formType in FORM_PURPOSES;

export const purposesFor = (formType: string | null): FormPurpose | undefined =>
  formType ? FORM_PURPOSES[formType] : undefined;

/** The saved answer, if it belongs to this form (codes are unique, so the form is a check). */
export const categoryFor = (value: string | null, formType?: string | null) => {
  if (!value) return undefined;
  const lists = formType ? [purposesFor(formType)?.options ?? []] : Object.values(FORM_PURPOSES).map((p) => p.options);
  for (const list of lists) {
    const found = list.find((c) => c.value === value);
    if (found) return found;
  }
  return undefined;
};

/**
 * A likely answer from the person's other saved cases, shown pre-selected but never saved
 * until they confirm it. Only for work permits: an I-765 next to an I-485 is usually a
 * green card work permit.
 */
export function suggestCategory(formType: string | null, otherForms: (string | null)[]): FilingCategory | null {
  if (formType !== "I-765") return null;
  const has = (f: string) => otherForms.includes(f);
  if (has("I-485")) return "c9";
  if (has("I-589")) return "c8";
  if (has("I-821D")) return "c33";
  if (has("I-821")) return "tps";
  if (has("I-539")) return "c26";
  return null;
}

/** Every allowed code, for the database check. */
export const ALL_CATEGORY_CODES = Object.values(FORM_PURPOSES).flatMap((p) => p.options.map((o) => o.value));
