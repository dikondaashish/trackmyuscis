/**
 * The facts people search for about each form: who files it, the current fee, what to send and
 * the edition USCIS accepts. Read on FORM_FACTS_CHECKED from the form's uscis.gov page, its
 * checklist of required initial evidence and the USCIS Fee Schedule (Form G-1055, edition FEE_SCHEDULE_EDITION).
 *
 * Fees change. When they do: update the rows here, FEE_SCHEDULE_EDITION and FORM_FACTS_CHECKED together.
 * Never estimate a fee; if one can't be read, leave the row out and the page links to the Fee Schedule.
 */

export const FORM_FACTS_CHECKED = "2026-11-24";
/** The edition date printed on the Fee Schedule the fees were read from. */
export const FEE_SCHEDULE_EDITION = "11/19/26";

export type FormFacts = {
  /** Who can file, one or two sentences. */
  who: string;
  /** Rows of the Fee Schedule most people need. */
  fees: { label: string; amount: string }[];
  /** Exceptions and extra fees, one or two sentences. */
  feeNote?: string;
  /** A short summary of USCIS's checklist of required initial evidence. */
  documents?: { intro: string; items: string[]; source?: { label: string; href: string } };
  /** Edition date of the form, as listed on its uscis.gov page (mm/dd/yy). */
  edition: string;
  editionNote?: string;
};

const checklist = (form: string) => ({
  label: `USCIS: Checklist of required initial evidence for Form ${form}`,
  href: `https://www.uscis.gov/forms/filing-guidance/checklist-of-required-initial-evidence-for-form-${form.toLowerCase()}-for-informational-purposes-only`,
});

const TRANSLATION = "Anything in another language needs a full English translation with the translator's certification.";

export const FORM_FACTS: Record<string, FormFacts> = {
  "i-130": {
    who: "A U.S. citizen, a lawful permanent resident or a U.S. national. A citizen can petition for a spouse, children, parents (if the citizen is 21 or older) and brothers or sisters. A permanent resident can petition for a spouse and unmarried children.",
    fees: [
      { label: "Filed on paper", amount: "$675" },
      { label: "Filed online", amount: "$625" },
    ],
    documents: {
      intro: `USCIS's checklist asks for copies of these. ${TRANSLATION}`,
      items: [
        "Proof that you are a U.S. citizen, permanent resident or U.S. national, such as a birth certificate, naturalization certificate, unexpired U.S. passport or both sides of your green card",
        "Proof of the family relationship: a marriage certificate for a spouse, or the birth certificates that show the relationship for a child, parent or sibling",
        "For a spouse: proof that earlier marriages ended, evidence that the marriage is real (for example a joint lease, joint finances or children's birth certificates) and Form I-130A",
        "Proof of any legal name change",
        "Two passport-style photographs, if they apply to your case",
      ],
    },
    edition: "04/01/24",
  },
  "i-485": {
    who: "Someone who is physically in the United States and qualifies for a green card in a category, for example through a family member, an employer, or as an asylee or refugee. In most categories a visa must be available first.",
    fees: [
      { label: "Filed on paper", amount: "$1,440" },
      { label: "Filed online", amount: "$1,390" },
      { label: "Child under 14 filing with a parent, on paper", amount: "$950" },
      { label: "Child under 14 filing with a parent, online", amount: "$900" },
    ],
    feeNote: "Some applicants pay no fee, including refugees. The Fee Schedule lists every exception.",
    documents: {
      intro: `For family-based applications, USCIS's checklist asks for these. Employment-based and other categories have their own lists. ${TRANSLATION}`,
      items: [
        "Two passport-style photographs",
        "A copy of a government-issued photo identity document",
        "A copy of your birth certificate",
        "Proof that you were inspected and admitted or paroled into the United States",
        "Proof of your immigrant category, such as the receipt or approval notice for the Form I-130 filed for you (unless you file both together)",
        "Form I-693, the medical examination report, if you are required to submit one. It must come with the I-485 or USCIS may reject the application",
        "Form I-864, the affidavit of support, if required",
        "Certified police and court records for any arrest, charge or conviction",
      ],
      source: checklist("I-485"),
    },
    edition: "09/18/26",
  },
  "i-765": {
    who: "People in a category that allows work in the United States but who need a card to show it, for example applicants with a pending green card application, F-1 students on OPT, asylees and asylum applicants, and certain spouses of H-1B and L-1 workers.",
    fees: [
      { label: "Filed on paper", amount: "$520" },
      { label: "Filed online", amount: "$470" },
      { label: "With a pending Form I-485 that you filed with a fee on or after April 1, 2024", amount: "$260" },
    ],
    feeNote: "Several categories pay a different fee, an added fee or no fee. Find your category on the Fee Schedule before you pay.",
    documents: {
      intro: `USCIS's checklist asks every applicant for these, plus the evidence for your eligibility category. ${TRANSLATION}`,
      items: [
        "A copy of your Form I-94 (front and back), a printout of your electronic I-94, your passport or another travel document",
        "A copy of your last Employment Authorization Document, if you had one",
        "Two identical passport-style photographs",
        "A copy of a government-issued identity document, if you have never had an EAD",
        "Form G-28, if an attorney or accredited representative represents you",
      ],
      source: checklist("I-765"),
    },
    edition: "08/21/25",
  },
  "i-131": {
    who: "Permanent residents who need a reentry permit, refugees and asylees who need a refugee travel document, and people in the United States who need advance parole to travel and return, such as applicants with a pending green card application.",
    fees: [
      { label: "Reentry permit, filed on paper", amount: "$630" },
      { label: "Advance parole with a pending Form I-485, on paper", amount: "$630" },
      { label: "Advance parole with a pending Form I-485, online", amount: "$580" },
      { label: "Refugee travel document for an asylee, age 16 or older", amount: "$165" },
      { label: "Refugee travel document for an asylee, under 16", amount: "$135" },
    ],
    feeNote: "Refugees pay no fee for a refugee travel document. The fee depends on which document you ask for in Part 1 of the form, and the Fee Schedule lists each one.",
    edition: "04/22/26",
    editionNote: "USCIS says that starting December 21, 2026, it accepts only this edition.",
  },
  "n-400": {
    who: "A green card holder who has been a permanent resident for at least 5 years, or at least 3 years if married to a U.S. citizen, and who meets the other naturalization requirements.",
    fees: [
      { label: "Filed on paper", amount: "$760" },
      { label: "Filed online", amount: "$710" },
      { label: "Reduced fee, paper only: household income at or below 400% of the Federal Poverty Guidelines", amount: "$380" },
    ],
    feeNote: "Applicants who qualify through military service under INA sections 328 or 329 pay no fee. A fee waiver may be possible with Form I-912. You can't file online if you ask for a reduced fee or a fee waiver.",
    documents: {
      intro: `USCIS's checklist asks for these where they apply to you. ${TRANSLATION}`,
      items: [
        "A copy of both sides of your green card",
        "Your current marriage certificate and proof that earlier marriages ended",
        "Arrest reports and court records if you have ever been arrested, detained, charged or convicted, anywhere in the world",
        "Proof that you kept your U.S. residence if any trip abroad lasted more than 6 months but less than 1 year",
        "Form N-648 if a disability keeps you from meeting the English or civics requirement",
      ],
    },
    edition: "01/20/25",
  },
  "i-129": {
    who: "The employer, called the petitioner, files it for the worker.",
    fees: [
      { label: "H-1B and H-1B1 petitions, on paper", amount: "$780" },
      { label: "H-1B and H-1B1 petitions, online", amount: "$730" },
      { label: "E-1, E-2, E-3 and TN petitions, on paper", amount: "$1,015" },
      { label: "E-1, E-2, E-3 and TN petitions, online", amount: "$965" },
    ],
    feeNote: "The fee depends on the classification, and most petitions carry added fees on top, such as the Asylum Program Fee ($600 for a regular petitioner). Small employers and nonprofits pay less. The Fee Schedule lists every classification.",
    documents: {
      intro: "What to send depends on the classification. USCIS publishes optional checklists on the form's page for H-1B, H-2A, H-2B and R-1 filings, and the form instructions list the evidence for every other classification.",
      items: [],
    },
    edition: "09/09/26",
  },
  "i-140": {
    who: "Usually the U.S. employer. In some categories the worker can file as a self-petitioner.",
    fees: [
      { label: "Filed on paper", amount: "$715" },
      { label: "Filed online", amount: "$665" },
      { label: "Asylum Program Fee, regular petitioner", amount: "+ $600" },
      { label: "Asylum Program Fee, small employer or self-petitioner", amount: "+ $300" },
      { label: "Asylum Program Fee, nonprofit", amount: "+ $0" },
    ],
    documents: {
      intro: `USCIS's checklist starts with these, then lists the evidence for each category. The evidence must show eligibility as of the priority date. ${TRANSLATION}`,
      items: [
        "The certified, signed labor certification (Form ETA-9089 final determination), in the categories that need one",
        "Proof that the employer can pay the offered wage from the priority date until the worker becomes a permanent resident, in the categories that need a job offer",
        "Evidence of the worker's education and experience for the category",
      ],
      source: checklist("I-140"),
    },
    edition: "06/07/24",
  },
  "i-751": {
    who: "A conditional permanent resident who got a 2-year green card through marriage, usually filing together with the spouse. Children who became conditional residents with the parent can be included or file their own.",
    fees: [
      { label: "Filed on paper", amount: "$750" },
      { label: "Filed online", amount: "$700" },
    ],
    feeNote: "There is no fee for certain waiver requests based on battery or extreme cruelty. The Fee Schedule has the details.",
    documents: {
      intro: `For a joint petition, USCIS's checklist asks for these. Waiver requests add documents such as a divorce decree or a death certificate. ${TRANSLATION}`,
      items: [
        "Copies of the front and back of your green card, and of the cards of any children included in the petition",
        "Copies of as many documents as you can that show the marriage was entered in good faith",
        "A written explanation if you are filing late",
        "Court dispositions for any criminal charge, arrest or conviction",
      ],
    },
    edition: "04/01/24",
  },
  "i-90": {
    who: "A permanent resident whose 10-year green card is expiring or has expired, or whose card was lost, stolen or damaged. Conditional residents with a 2-year card use a different form.",
    fees: [
      { label: "Filed on paper", amount: "$465" },
      { label: "Filed online", amount: "$415" },
    ],
    feeNote: "There is no fee if you have turned 14 and your current card expires after your 16th birthday. The Fee Schedule lists the other exceptions.",
    edition: "01/20/25",
  },
};

/** "$675 on paper or $625 online": the first two fee rows, for answers and descriptions. */
export function feeSentence(slug: string) {
  const f = FORM_FACTS[slug];
  if (!f) return undefined;
  const paper = f.fees.find((r) => /paper/i.test(r.label));
  const online = f.fees.find((r) => /online/i.test(r.label));
  if (paper && online && f.fees.indexOf(online) - f.fees.indexOf(paper) === 1) return `${paper.amount} on paper or ${online.amount} online`;
  return undefined;
}
