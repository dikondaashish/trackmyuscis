/**
 * What a case is for. USCIS's case status names the form ("I-140") but not the
 * classification (EB-2 NIW, H-1B transfer, OPT…), and each has its own processing time, so
 * the owner tells us once. Forms with one main purpose (N-565, I-829, I-526…) aren't asked.
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

/**
 * The choices follow USCIS's own processing-time categories for each form (its subtypes, such
 * as 136A-E11 for I-140 or 137-H1B1 for I-129), in plain words, so an answer maps to the
 * official timeline. Some choices are finer than USCIS's split (H-1B transfer and amendment,
 * or spouse vs parent of a citizen) because that's how people describe their case.
 */
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
      { value: "c9", label: "Pending green card application", code: "(c)(9)", short: "Green card work permit" },
      // USCIS times first asylum work permits and renewals separately.
      { value: "c8", label: "Pending asylum, first work permit", code: "(c)(8)", short: "Asylum work permit" },
      { value: "c8-renewal", label: "Pending asylum, renewal", code: "(c)(8)", short: "Asylum work permit renewal" },
      { value: "a5", label: "Asylum granted", code: "(a)(5)", short: "Asylee work permit" },
      { value: "a3", label: "Admitted as a refugee", code: "(a)(3)", short: "Refugee work permit" },
      { value: "c26", label: "H-4 spouse of an H-1B worker", code: "(c)(26)", short: "H-4 work permit" },
      { value: "a18", label: "L-2 spouse of an L-1 worker", code: "(a)(18)", short: "L-2 work permit" },
      { value: "a17", label: "E spouse of a treaty trader, investor or E-3 worker", code: "(a)(17)", short: "E spouse work permit" },
      { value: "tps", label: "Temporary Protected Status", code: "(a)(12) or (c)(19)", short: "TPS work permit" },
      { value: "c11", label: "Parole", code: "(c)(11)", short: "Parole work permit" },
      { value: "c33", label: "DACA", code: "(c)(33)", short: "DACA work permit" },
      { value: "c10", label: "Cancellation of removal, suspension of deportation or NACARA", code: "(c)(10)", short: "Work permit" },
      { value: "c18", label: "Final order with an order of supervision", code: "(c)(18)", short: "Work permit" },
      other("I-765", "Work permit"),
    ],
  },
  "I-140": {
    question: "What is this petition for?",
    field: "Immigrant category",
    why: "Each green card category has its own processing time, and USCIS doesn't say which one this is. Your employer or lawyer can tell you if you're not sure.",
    prompt: "Add petition type",
    options: [
      { value: "i140-eb1a", label: "EB-1A, extraordinary ability", code: "E11", short: "EB-1A petition" },
      { value: "i140-eb1b", label: "EB-1B, outstanding professor or researcher", code: "E12", short: "EB-1B petition" },
      { value: "i140-eb1c", label: "EB-1C, multinational executive or manager", code: "E13", short: "EB-1C petition" },
      { value: "i140-eb2perm", label: "EB-2, advanced degree or exceptional ability (PERM)", code: "E21", short: "EB-2 petition" },
      { value: "i140-eb2niw", label: "EB-2 NIW, national interest waiver", code: "NIW", short: "EB-2 NIW petition" },
      { value: "i140-eb3", label: "EB-3, skilled worker or professional", code: "E31, E32", short: "EB-3 petition" },
      { value: "i140-ew3", label: "EB-3, other (unskilled) worker", code: "EW3", short: "EB-3 petition" },
      { value: "i140-nurse", label: "Schedule A nurse", code: null, short: "Nurse petition" },
      other("I-140", "Immigrant petition"),
    ],
  },
  "I-129": {
    question: "What is this petition for?",
    field: "Petition type",
    why: "Each kind of work visa petition has its own processing time, and USCIS doesn't say which one this is. Your employer or lawyer can tell you if you're not sure.",
    prompt: "Add petition type",
    options: [
      // USCIS splits H-1B three ways: visa abroad (H1B1), change of status (H1B2), extension (H1B3).
      { value: "i129-h1b-new", label: "H-1B, new, visa to be issued abroad", code: null, short: "H-1B petition" },
      { value: "i129-h1b-cos", label: "H-1B, change of status in the U.S. (for example from F-1)", code: null, short: "H-1B change of status" },
      { value: "i129-h1b-extension", label: "H-1B extension with the same employer", code: null, short: "H-1B extension" },
      { value: "i129-h1b-transfer", label: "H-1B transfer to a new employer", code: null, short: "H-1B transfer" },
      { value: "i129-h1b-amendment", label: "H-1B amendment", code: null, short: "H-1B amendment" },
      { value: "i129-l1", label: "L-1, intracompany transferee (including blanket L)", code: null, short: "L-1 petition" },
      { value: "i129-o1", label: "O-1 or O-2, extraordinary ability", code: null, short: "O-1 petition" },
      { value: "i129-e", label: "E-1 or E-2, treaty trader or investor", code: null, short: "E visa petition" },
      { value: "i129-e3", label: "E-3, Australian specialty occupation", code: null, short: "E-3 petition" },
      { value: "i129-tn", label: "TN, USMCA professional", code: null, short: "TN petition" },
      { value: "i129-h2a", label: "H-2A, temporary agricultural worker", code: null, short: "H-2A petition" },
      { value: "i129-h2b", label: "H-2B, temporary non-agricultural worker", code: null, short: "H-2B petition" },
      { value: "i129-h3", label: "H-3, trainee", code: null, short: "H-3 petition" },
      { value: "i129-p", label: "P, athlete, artist or entertainer", code: null, short: "P visa petition" },
      { value: "i129-q", label: "Q, cultural exchange visitor", code: null, short: "Q visa petition" },
      { value: "i129-r", label: "R, religious worker", code: null, short: "R visa petition" },
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
      { value: "i485-asylum", label: "Asylum granted (asylee)", code: null, short: "Asylee green card" },
      { value: "i485-refugee", label: "Admitted as a refugee", code: null, short: "Refugee green card" },
      { value: "i485-t-visa", label: "T visa", code: null, short: "T visa green card" },
      { value: "i485-u-visa", label: "U visa", code: null, short: "U visa green card" },
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
      // USCIS times spouse, parent and child under 21 of a citizen as one group (immediate relatives).
      { value: "i130-spouse-citizen", label: "Spouse of a U.S. citizen", code: "IR", short: "Spouse petition" },
      { value: "i130-parent-citizen", label: "Parent of a U.S. citizen", code: "IR", short: "Parent petition" },
      { value: "i130-child-citizen", label: "Unmarried child under 21 of a U.S. citizen", code: "IR", short: "Child petition" },
      { value: "i130-adult-child-citizen", label: "Unmarried son or daughter 21 or older of a U.S. citizen", code: "F1", short: "Adult child petition" },
      { value: "i130-married-child-citizen", label: "Married son or daughter of a U.S. citizen", code: "F3", short: "Married child petition" },
      { value: "i130-sibling-citizen", label: "Brother or sister of a U.S. citizen", code: "F4", short: "Sibling petition" },
      { value: "i130-family-lpr", label: "Spouse or child under 21 of a green card holder", code: "F2A", short: "Family petition" },
      { value: "i130-adult-child-lpr", label: "Unmarried son or daughter 21 or older of a green card holder", code: "F2B", short: "Adult child petition" },
      other("I-130", "Family petition"),
    ],
  },
  "I-539": {
    question: "What is this application for?",
    field: "Application type",
    why: "USCIS times each status, and extensions and changes of status, separately, and doesn't say which one this is.",
    prompt: "Add application type",
    options: [
      { value: "i539-h4", label: "H-4, extension of stay", code: null, short: "H-4 extension" },
      { value: "i539-h4-cos", label: "H-4, change of status", code: null, short: "H-4 change of status" },
      { value: "i539-l2", label: "L-2, extension of stay", code: null, short: "L-2 extension" },
      { value: "i539-l2-cos", label: "L-2, change of status", code: null, short: "L-2 change of status" },
      { value: "i539-f1-j1", label: "F, M or J, change of status", code: null, short: "Student change of status" },
      { value: "i539-fmj-ext", label: "F, M or J, extension of stay", code: null, short: "Student extension" },
      { value: "i539-visitor", label: "B-1/B-2 visitor, extension of stay", code: null, short: "Visitor extension" },
      { value: "i539-b-cos", label: "B-1/B-2 visitor, change of status", code: null, short: "Visitor change of status" },
      { value: "i539-t", label: "T, extension of stay", code: null, short: "T extension" },
      { value: "i539-u", label: "U, extension of stay", code: null, short: "U extension" },
      { value: "i539-reinstatement", label: "Reinstatement to F-1 or M-1 student status", code: null, short: "Student reinstatement" },
      other("I-539", "Stay application"),
    ],
  },
  "I-131": {
    question: "What travel document is this for?",
    field: "Travel document",
    why: "Each travel document has its own processing time, and USCIS doesn't say which one this is.",
    prompt: "Add document type",
    options: [
      { value: "i131-advance-parole", label: "Advance parole (for example with a pending green card)", code: null, short: "Advance parole" },
      { value: "i131-reentry", label: "Reentry permit (green card holder)", code: null, short: "Reentry permit" },
      { value: "i131-refugee", label: "Refugee travel document", code: null, short: "Refugee travel document" },
      { value: "i131-humanitarian", label: "Humanitarian or other parole into the U.S.", code: null, short: "Parole request" },
      other("I-131", "Travel document"),
    ],
  },
  "I-360": {
    question: "What is this petition for?",
    field: "Petition type",
    why: "Form I-360 covers several special immigrant groups that USCIS handles separately, and the case status doesn't say which one this is.",
    prompt: "Add petition type",
    options: [
      { value: "i360-religious", label: "Religious worker", code: null, short: "Religious worker petition" },
      { value: "i360-sij", label: "Special immigrant juvenile (SIJ)", code: null, short: "SIJ petition" },
      { value: "i360-vawa", label: "Self-petition after abuse (VAWA)", code: null, short: "VAWA self-petition" },
      { value: "i360-widow", label: "Widow or widower of a U.S. citizen", code: null, short: "Widow(er) petition" },
      { value: "i360-afghan-iraqi", label: "Afghan or Iraqi special immigrant", code: null, short: "Special immigrant petition" },
      other("I-360", "Special immigrant petition"),
    ],
  },
  "I-129F": {
    question: "Who is this petition for?",
    field: "Petition type",
    why: "A fiancé(e) petition and a spouse petition follow different paths, and USCIS doesn't say which one this is.",
    prompt: "Add petition type",
    options: [
      { value: "i129f-k1", label: "Fiancé(e) (K-1)", code: null, short: "Fiancé(e) petition" },
      { value: "i129f-k3", label: "Spouse (K-3)", code: null, short: "K-3 spouse petition" },
    ],
  },
  "I-821D": {
    question: "Is this your first DACA request or a renewal?",
    field: "Request type",
    why: "USCIS handles first requests and renewals differently, and the case status doesn't say which one this is.",
    prompt: "Add request type",
    options: [
      { value: "i821d-initial", label: "First (initial) request", code: null, short: "DACA request" },
      { value: "i821d-renewal", label: "Renewal", code: null, short: "DACA renewal" },
    ],
  },
  // The forms below have one row in USCIS's processing times, but the form itself asks which
  // case it is (a checkbox near the start), and that changes how the case is handled.
  "I-751": {
    question: "How are you filing to remove conditions?",
    field: "Filing type",
    why: "USCIS reviews a joint filing and a waiver differently, and it doesn't say which one this is. It's the box you checked in Part 1 of the form.",
    prompt: "Add filing type",
    options: [
      { value: "i751-joint", label: "Together with my spouse (joint filing)", code: null, short: "Joint I-751" },
      { value: "i751-waiver-divorce", label: "Waiver: the marriage ended in divorce or annulment", code: null, short: "I-751 waiver" },
      { value: "i751-waiver-death", label: "Waiver: my spouse died", code: null, short: "I-751 waiver" },
      { value: "i751-waiver-abuse", label: "Waiver: abuse or extreme cruelty", code: null, short: "I-751 waiver" },
      { value: "i751-waiver-hardship", label: "Waiver: extreme hardship", code: null, short: "I-751 waiver" },
      { value: "i751-child", label: "A child filing alone", code: null, short: "I-751 for a child" },
    ],
  },
  "N-400": {
    question: "How are you applying for citizenship?",
    field: "Eligibility",
    why: "Some groups are processed on their own track, and USCIS doesn't say which one this is. It's the reason you checked in Part 1 of the form.",
    prompt: "Add eligibility",
    options: [
      { value: "n400-5year", label: "Green card holder for 5 years", code: null, short: "Citizenship application" },
      { value: "n400-3year", label: "Green card holder for 3 years, married to a U.S. citizen", code: null, short: "Citizenship application" },
      { value: "n400-military", label: "Military service", code: null, short: "Military citizenship application" },
      { value: "n400-spouse-abroad", label: "Spouse of a U.S. citizen working abroad", code: null, short: "Citizenship application" },
      other("N-400", "Citizenship application"),
    ],
  },
  "I-90": {
    question: "Why are you filing for a new green card?",
    field: "Reason",
    why: "USCIS doesn't say why this card was requested. It's the reason you checked in Part 2 of the form.",
    prompt: "Add reason",
    options: [
      { value: "i90-renewal", label: "Renew a card that has expired or expires soon", code: null, short: "Green card renewal" },
      { value: "i90-replacement", label: "Replace a lost, stolen or damaged card", code: null, short: "Green card replacement" },
      { value: "i90-never-received", label: "I never received my card", code: null, short: "Green card replacement" },
      { value: "i90-correction", label: "Fix a mistake or update my name or details", code: null, short: "Green card correction" },
      { value: "i90-age-14", label: "Turned 14 (new card required)", code: null, short: "Green card at 14" },
      other("I-90", "Green card replacement"),
    ],
  },
  "I-821": {
    question: "Is this your first TPS application or a re-registration?",
    field: "Application type",
    why: "USCIS handles first applications and re-registrations differently, and it doesn't say which one this is. It's the box you checked in Part 1 of the form.",
    prompt: "Add application type",
    options: [
      { value: "i821-initial", label: "First (initial) application", code: null, short: "TPS application" },
      { value: "i821-reregistration", label: "Re-registration", code: null, short: "TPS re-registration" },
      { value: "i821-late-initial", label: "Late initial application", code: null, short: "TPS application" },
    ],
  },
  "I-730": {
    question: "Who is this petition for?",
    field: "Petition type",
    why: "Relatives of asylees and refugees, in the U.S. or abroad, follow different paths, and USCIS doesn't say which one this is.",
    prompt: "Add petition type",
    options: [
      { value: "i730-asylee-spouse", label: "Spouse of an asylee", code: null, short: "Asylee relative petition" },
      { value: "i730-asylee-child", label: "Child of an asylee", code: null, short: "Asylee relative petition" },
      { value: "i730-refugee-spouse", label: "Spouse of a refugee", code: null, short: "Refugee relative petition" },
      { value: "i730-refugee-child", label: "Child of a refugee", code: null, short: "Refugee relative petition" },
    ],
  },
  "I-601": {
    question: "What is this waiver for?",
    field: "Waiver for",
    why: "USCIS handles waivers differently depending on what you're applying for, and the case status doesn't say which one this is.",
    prompt: "Add waiver type",
    options: [
      { value: "i601-immigrant-visa", label: "Green card through a U.S. consulate abroad", code: null, short: "Waiver application" },
      { value: "i601-adjustment", label: "Green card inside the U.S. (with Form I-485)", code: null, short: "Waiver application" },
      { value: "i601-k-v", label: "Fiancé(e) or spouse visa (K or V)", code: null, short: "Waiver application" },
      { value: "i601-tps", label: "Temporary Protected Status (TPS)", code: null, short: "TPS waiver" },
      { value: "i601-asylee-refugee", label: "Green card as an asylee or refugee", code: null, short: "Waiver application" },
      other("I-601", "Waiver application"),
    ],
  },
  "I-290B": {
    question: "Is this an appeal or a motion?",
    field: "Filing type",
    why: "An appeal goes to the Administrative Appeals Office, while a motion goes back to the office that decided, so the wait is different. It's the box you checked in Part 2 of the form.",
    prompt: "Add filing type",
    options: [
      { value: "i290b-appeal", label: "Appeal", code: null, short: "Appeal" },
      { value: "i290b-motion-reopen", label: "Motion to reopen", code: null, short: "Motion to reopen" },
      { value: "i290b-motion-reconsider", label: "Motion to reconsider", code: null, short: "Motion to reconsider" },
      { value: "i290b-motion-both", label: "Motion to reopen and reconsider", code: null, short: "Motion to reopen and reconsider" },
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
