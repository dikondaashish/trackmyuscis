/**
 * Site content: forms, case statuses, guides, FAQ and the simple text pages.
 * Everything here is general information, written in plain language. Not legal advice.
 */

import { COMPANY } from "@/lib/company";
import { DISCLAIMER } from "@/lib/site";

export const USCIS_PROCESSING_TIMES = "https://egov.uscis.gov/processing-times/";
export const USCIS_CASE_STATUS = "https://egov.uscis.gov/";
export const USCIS_ALL_FORMS = "https://www.uscis.gov/forms/all-forms";
export const USCIS_CONTACT = "https://www.uscis.gov/about-us/contact-us";
export const EOIR_PRO_BONO = "https://www.justice.gov/eoir/list-pro-bono-legal-service-providers";
export const DOJ_ROSTER = "https://www.justice.gov/eoir/recognition-accreditation-roster-reports";
export const USCIS_FIND_LEGAL = "https://www.uscis.gov/avoid-scams/find-legal-services";

/* ------------------------------------------------------------------ forms */

export type UscisForm = {
  form: string;
  slug: string;
  /** Short everyday name. */
  label: string;
  /** Official title. */
  title: string;
  /** Who files it and why, one or two sentences. */
  about: string;
  /** Short headed notes, each checked against the form's uscis.gov page. Inline [text](href) links allowed. */
  sections: { heading: string; body: string }[];
  /** The milestones most cases of this type pass through. */
  milestones: string[];
  /** Extra official pages the notes rely on, besides the form's own uscis.gov page. */
  sources?: { label: string; href: string }[];
};

/** Date the form notes were last checked against uscis.gov. */
export const FORMS_UPDATED = "2026-11-20";
export const USCIS_FEE_SCHEDULE = "https://www.uscis.gov/g-1055";

const SRC_ADJUSTMENT = { label: "USCIS: Adjustment of status", href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/adjustment-of-status" };
const SRC_VISA_AVAILABILITY = {
  label: "USCIS: Visa availability and priority dates",
  href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-and-priority-dates",
};
const SRC_BIOMETRICS = {
  label: "USCIS: Preparing for your biometric services appointment",
  href: "https://www.uscis.gov/forms/filing-guidance/preparing-for-your-biometric-services-appointment",
};
const SRC_NATURALIZATION_STEPS = { label: "USCIS: 10 steps to naturalization", href: "https://www.uscis.gov/citizenship/learn-about-citizenship/10-steps-to-naturalization" };

export const FORMS: UscisForm[] = [
  {
    form: "I-130",
    slug: "i-130",
    label: "Family petition",
    title: "Petition for Alien Relative",
    about:
      "Filed by a U.S. citizen or green card holder to prove a family relationship with a relative who wants to immigrate.",
    sections: [
      {
        heading: "What it does, and what it doesn't",
        body: "The petition shows USCIS that a qualifying family relationship exists. Filing it, or having it approved, does not by itself give your relative any immigration status or benefit.",
      },
      {
        heading: "How to file",
        body: "You can file online or by mail, and you can file online even if your relative is in the United States. File a separate Form I-130 for each eligible relative. If you are petitioning for your spouse, you must also submit Form I-130A.",
      },
      {
        heading: "If your relative is already in the U.S.",
        body: "The I-130 and your relative's green card application ([Form I-485](/forms/i-485)) can sometimes be filed at the same time, which USCIS calls concurrent filing. Immediate relatives of U.S. citizens (spouses, unmarried children under 21 and parents of citizens who are at least 21) can always file both together, because visas for them are always available. If you file the I-130 first, give your relative a copy of the receipt notice to include with their I-485.",
      },
    ],
    milestones: [
      "Case received",
      "Under review, sometimes with a request for evidence",
      "Decision",
      "Sent to the National Visa Center if your relative is abroad",
    ],
    sources: [SRC_VISA_AVAILABILITY],
  },
  {
    form: "I-485",
    slug: "i-485",
    label: "Green card",
    title: "Application to Register Permanent Residence or Adjust Status",
    about: "Filed by someone already in the U.S. to apply for a green card without leaving the country.",
    sections: [
      {
        heading: "Before you can file",
        body: "In general, you can't file Form I-485 until an immigrant visa is immediately available in your category. Most categories also need an approved immigrant petition first, such as [Form I-130](/forms/i-130) or [Form I-140](/forms/i-140), although some allow both to be filed together.",
      },
      {
        heading: "What goes with it",
        body: "You must submit Form I-693, the medical examination report, when you file. You can also file for a work permit ([Form I-765](/forms/i-765)) and a travel document ([Form I-131](/forms/i-131)) at the same time. Online filing is open to certain applicants; the rest file by mail.",
      },
      {
        heading: "Interview and decision",
        body: "USCIS reviews each case to decide whether an interview is needed. When it decides, it sends a written decision notice. After an approval, the approval notice generally comes first and the green card a little later. A denial of an adjustment application generally can't be appealed.",
      },
      {
        heading: "If you move",
        body: "Tell USCIS within 10 days of moving to a new address. See [how to change your address](/answers/how-to-change-address-with-uscis).",
      },
    ],
    milestones: [
      "Case received",
      "Biometrics appointment",
      "Interview, if required",
      "Decision",
      "Green card produced and mailed",
    ],
    sources: [SRC_ADJUSTMENT, SRC_VISA_AVAILABILITY],
  },
  {
    form: "I-765",
    slug: "i-765",
    label: "Work permit",
    title: "Application for Employment Authorization",
    about: "Requests an Employment Authorization Document (EAD), the card that shows you can work in the U.S.",
    sections: [
      {
        heading: "How to file",
        body: "You can file online through a USCIS online account, or on paper if you need to. Which filing address and documents apply depends on your eligibility category, so check the category list on the USCIS page before you file.",
      },
      {
        heading: "With a green card application",
        body: "If your work permit is based on a pending green card application (category (c)(9)), file Form I-765 together with [Form I-485](/forms/i-485), or include a copy of your I-485 receipt notice if you file it later.",
      },
      {
        heading: "Renewing a work permit",
        body: "USCIS recommends filing a renewal up to 180 days before your current card expires.",
      },
      {
        heading: "After approval",
        body: "USCIS says the card should be produced within 2 weeks of approval, and asks you to allow a total of 30 days from approval before you contact it about a card that hasn't arrived.",
      },
    ],
    milestones: ["Case received", "Biometrics, if required", "Decision", "Card produced and mailed"],
  },
  {
    form: "I-131",
    slug: "i-131",
    label: "Travel document",
    title: "Application for Travel Documents, Parole Documents, and Arrival/Departure Records",
    about: "Requests advance parole, a reentry permit or a refugee travel document so you can travel and return.",
    sections: [
      {
        heading: "What it covers",
        body: "One form covers several documents: reentry permits, refugee travel documents, advance parole and other parole documents, and arrival/departure records. You choose the type in Part 1 of the form.",
      },
      {
        heading: "Online filing is limited",
        body: "Reentry permits and refugee travel documents can't be filed online. Advance parole based on a pending green card application can be filed online only if your Form I-485 receipt number begins with IOE. Once you file online, you can't change the application type you selected.",
      },
      {
        heading: "With a green card application",
        body: "You can file Form I-131 at the same time as [Form I-485](/forms/i-485). USCIS asks you to select only item 5.A. in Part 1 when you do.",
      },
    ],
    milestones: ["Case received", "Biometrics, if required", "Decision", "Document produced and mailed"],
  },
  {
    form: "N-400",
    slug: "n-400",
    label: "Citizenship",
    title: "Application for Naturalization",
    about: "Filed by a green card holder who meets the requirements to become a U.S. citizen.",
    sections: [
      {
        heading: "When you can file",
        body: "You may file up to 90 calendar days before you complete your continuous residence requirement.",
      },
      {
        heading: "How to file",
        body: "You can generally file online or by mail. If you are asking for a reduced fee or a fee waiver, you can't file online.",
      },
      {
        heading: "Your green card while you wait",
        body: "After you properly file, the Form N-400 receipt notice automatically extends your green card for 2 years from the “Card Expires” date printed on it. If you lose the card itself, you generally still need to file [Form I-90](/forms/i-90).",
      },
      {
        heading: "From interview to oath",
        body: "Applicants must generally give biometrics unless USCIS waives it. After the interview, USCIS mails a decision: granted, continued (it needs more evidence or a retest) or denied. You are not a U.S. citizen until you take the Oath of Allegiance at a naturalization ceremony, which can sometimes happen on the same day as the interview.",
      },
    ],
    milestones: [
      "Case received",
      "Biometrics appointment",
      "Interview with English and civics test",
      "Decision",
      "Oath ceremony",
    ],
    sources: [SRC_NATURALIZATION_STEPS],
  },
  {
    form: "I-129",
    slug: "i-129",
    label: "Work visa",
    title: "Petition for a Nonimmigrant Worker",
    about: "Filed by an employer for a temporary worker, for example in H-1B, L-1 or O-1 status.",
    sections: [
      {
        heading: "Who files it",
        body: "The employer, called the petitioner, files for the worker. The form covers H-1B, H-2A, H-2B, H-3, L-1, O-1, O-2, P, Q-1 and R-1 workers, and extensions or changes of status in some other categories such as E-1, E-2, E-3 and TN.",
      },
      {
        heading: "An approval is not a visa",
        body: "USCIS states that evidence of a petition approval is not a visa. The worker still needs any visa that is required to enter the United States.",
      },
      {
        heading: "How to file",
        body: "By mail, or online for certain classifications only. To speed up a decision, employers can ask for [premium processing](/answers/what-is-uscis-premium-processing) with Form I-907.",
      },
      {
        heading: "Family members",
        body: "For H-1B and L-1 workers, USCIS decides a dependent's Form I-539 (H-4 or L-2) together with the I-129 when both are filed at the same time and place.",
      },
    ],
    milestones: ["Case received", "Under review, premium processing available for many categories", "Decision"],
  },
  {
    form: "I-140",
    slug: "i-140",
    label: "Work green card",
    title: "Immigrant Petition for Alien Workers",
    about: "Filed by an employer, or by you in some categories, as the first step toward a work-based green card.",
    sections: [
      {
        heading: "What it is for",
        body: "The petition asks USCIS to classify a worker as eligible to become a lawful permanent resident. It can be filed at any time, online or by mail.",
      },
      {
        heading: "Labor certification",
        body: "Where a labor certification is required, it expires 180 days after the date it was certified. USCIS rejects a petition filed with an expired one.",
      },
      {
        heading: "Premium processing",
        body: "If you send Form I-907 together with Form I-140, you must file by mail. See [what premium processing is](/answers/what-is-uscis-premium-processing).",
      },
      {
        heading: "Filing with a green card application",
        body: "[Form I-485](/forms/i-485) can be filed together with the I-140 only when a visa is available in the worker's category. That happens when the priority date is earlier than the cut-off date in the Visa Bulletin.",
      },
    ],
    milestones: ["Case received", "Under review, premium processing available for many categories", "Decision"],
    sources: [SRC_VISA_AVAILABILITY],
  },
  {
    form: "I-751",
    slug: "i-751",
    label: "Remove conditions",
    title: "Petition to Remove Conditions on Residence",
    about:
      "Filed by a conditional resident through marriage, in the 90 days before the 2-year green card expires, to get a 10-year card.",
    sections: [
      {
        heading: "When to file",
        body: "If you file jointly with your spouse, you must file during the 90 days immediately before your conditional residence expires. A petition filed before that window opens may be rejected.",
      },
      {
        heading: "If you can't file with your spouse",
        body: "You can ask USCIS to waive the joint filing requirement, for example after a death, a divorce or annulment, battery or extreme cruelty, or extreme hardship. A waiver request can be filed at any time before your conditional resident status expires.",
      },
      {
        heading: "How to file",
        body: "Online or by mail. Don't send original documents unless the form instructions ask for them, and sign the form: USCIS rejects unsigned forms.",
      },
    ],
    milestones: [
      "Case received",
      "Biometrics appointment",
      "Interview, if required",
      "Decision",
      "New card produced and mailed",
    ],
  },
  {
    form: "I-90",
    slug: "i-90",
    label: "Replace green card",
    title: "Application to Replace Permanent Resident Card (Green Card)",
    about: "Filed to renew a green card that is expiring, or to replace one that was lost, stolen or damaged.",
    sections: [
      {
        heading: "Who should not use it",
        body: "Don't file Form I-90 if you are a conditional resident who wants to remove the conditions on your green card. Use [Form I-751](/forms/i-751) for marriage-based status, or Form I-829 for investment-based status.",
      },
      {
        heading: "How to file",
        body: "Online, which needs a USCIS online account, or by mail.",
      },
      {
        heading: "Before you file",
        body: "USCIS suggests checking whether you are already eligible to become a citizen with its naturalization eligibility tool. A permanent resident must carry a valid, unexpired green card at all times, and applying for naturalization doesn't change that.",
      },
      {
        heading: "Biometrics and your address",
        body: "USCIS uses the biometrics you give at your appointment to produce the replacement card. If you move, [update your address](/answers/how-to-change-address-with-uscis) so the card reaches you.",
      },
    ],
    milestones: ["Case received", "Biometrics appointment", "Decision", "Card produced and mailed"],
    sources: [SRC_BIOMETRICS],
  },
];

export const getForm = (slug: string) => FORMS.find((f) => f.slug === slug);

/** Answer and guide pages worth reading next for each form (paths; the form page looks up the titles). */
export const FORM_RELATED: Record<string, string[]> = {
  "i-130": ["/answers/what-is-a-uscis-receipt-number", "/answers/what-is-a-request-for-evidence", "/answers/how-long-does-uscis-take"],
  "i-485": ["/guides/how-long-does-i-485-take", "/guides/what-happens-after-biometrics", "/guides/case-is-being-actively-reviewed", "/answers/what-is-a-request-for-evidence"],
  "i-765": ["/answers/how-long-does-uscis-take", "/answers/what-is-uscis-premium-processing", "/answers/uscis-case-approved-what-next"],
  "i-131": ["/answers/uscis-biometrics-appointment", "/answers/how-long-does-uscis-take", "/answers/contact-uscis-about-delayed-case"],
  "n-400": ["/answers/uscis-biometrics-appointment", "/guides/what-happens-after-biometrics", "/answers/why-has-my-uscis-case-status-not-changed"],
  "i-129": ["/answers/what-is-uscis-premium-processing", "/answers/what-is-a-request-for-evidence", "/answers/what-is-form-i-797"],
  "i-140": ["/answers/what-is-uscis-premium-processing", "/answers/what-is-a-request-for-evidence", "/answers/how-long-does-uscis-take"],
  "i-751": ["/answers/uscis-biometrics-appointment", "/answers/why-has-my-uscis-case-status-not-changed", "/answers/how-to-change-address-with-uscis"],
  "i-90": ["/answers/uscis-biometrics-appointment", "/answers/uscis-case-approved-what-next", "/answers/how-to-change-address-with-uscis"],
};
export const officialFormUrl = (f: UscisForm) => `https://www.uscis.gov/${f.slug}`;


/* --------------------------------------------------------------- statuses */

export type Tone = "info" | "success" | "warning" | "error";

/** Anchor id of a status on /status-explained, e.g. "case-was-received". */
export const statusId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const STATUSES: { name: string; tone: Tone; meaning: string }[] = [
  { name: "Case Was Received", tone: "info", meaning: "USCIS accepted your filing and mailed a receipt notice with your receipt number." },
  { name: "Fingerprints Were Taken", tone: "info", meaning: "Your biometrics appointment is done. Background and identity checks run next." },
  { name: "Case Is Being Actively Reviewed", tone: "info", meaning: "Your case is in review. It can show for months and needs nothing from you unless a notice arrives." },
  { name: "Request for Evidence Was Sent", tone: "warning", meaning: "USCIS needs more documents. Answer by the deadline printed on the notice." },
  { name: "Response to Request for Evidence Was Received", tone: "info", meaning: "USCIS has your documents and the review continues." },
  { name: "Interview Was Scheduled", tone: "info", meaning: "A notice with the date, time and office of your interview is in the mail." },
  { name: "Case Was Transferred", tone: "info", meaning: "Another office is handling your case now, often to balance workload. Processing times follow the new office." },
  { name: "Case Was Approved", tone: "success", meaning: "Your case was approved. An approval notice is on its way." },
  { name: "New Card Is Being Produced", tone: "success", meaning: "Your card or document is being printed." },
  { name: "Card Was Mailed To Me", tone: "success", meaning: "Your card is in the mail, often with a tracking number." },
  { name: "Case Was Denied", tone: "error", meaning: "The decision notice explains why and your options. Talk to an immigration attorney about next steps." },
];

/* ------------------------------------------------------------------ guides */

export type Guide = {
  slug: string;
  title: string;
  /** Search title, phrased the way people ask (shown in Google, not on the page). */
  seoTitle?: string;
  summary: string;
  /** Search description, 120–160 characters. */
  description: string;
  sections: { heading: string; body: string }[];
  sources: { label: string; href: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "case-is-being-actively-reviewed",
    title: "What “Case Is Being Actively Reviewed” means",
    seoTitle: "Case Is Being Actively Reviewed: What It Means",
    summary: "Why the status appears, how long it can last and what usually comes next.",
    description:
      "“Case Is Being Actively Reviewed” means USCIS has your case in its review queue. How long the status can last, what to do while you wait and what comes next.",
    sections: [
      {
        heading: "What the status means",
        body: "USCIS has your case in its review queue or with an officer. It often appears after biometrics and can stay the same for weeks or months.",
      },
      {
        heading: "Is someone working on it today?",
        body: "Not always. USCIS shows this status for the long middle part of many cases, and its date can change after routine system updates without visible progress.",
      },
      {
        heading: "What to do while you wait",
        body: "Nothing, unless you get a notice. Keep your mailing address current with USCIS and watch for a request for evidence or an interview notice. If your case is past the normal processing time, you can submit a case inquiry on uscis.gov.",
      },
      {
        heading: "What usually comes next",
        body: "Depending on the form: an interview notice, a request for evidence, or a decision.",
      },
      {
        heading: "What the online status can and can't tell you",
        body: "USCIS says Case Status Online shows the last action taken on your case and the next steps, if there are any. Your USCIS online account shows more, up to the last five actions on your case.",
      },
      {
        heading: "If you move while you wait",
        body: "Notices go to the address USCIS has on file, and you must report a new address within 10 days of moving.",
      },
    ],
    sources: [{ label: "USCIS: Checking your case status online", href: "https://www.uscis.gov/tools/checking-your-case-status-online" }, SRC_ADJUSTMENT],
  },
  {
    slug: "what-happens-after-biometrics",
    title: "What happens after biometrics",
    seoTitle: "What Happens After Biometrics? USCIS Next Steps",
    summary: "Background checks, interview scheduling and the usual path to a decision.",
    description:
      "After biometrics, USCIS runs identity and background checks, then schedules an interview if your form needs one. Each step from fingerprints to decision.",
    sections: [
      {
        heading: "What biometrics are for",
        body: "Your fingerprints, photo and signature are used for identity and background checks, and to print any card you are approved for.",
      },
      {
        heading: "Right after the appointment",
        body: "Your status may update to show fingerprints were taken. Background checks then run while the case waits for review.",
      },
      {
        heading: "The interview",
        body: "Some cases need one. Naturalization (N-400) always includes an interview, and many green card cases (I-485) do too. USCIS mails a notice with the date and office.",
      },
      {
        heading: "The decision",
        body: "USCIS approves the case, asks for more evidence, or denies it. Approved card cases move on to card production and mailing.",
      },
      {
        heading: "If you can't make the appointment",
        body: "Ask to reschedule through your USCIS online account at least 12 hours before the appointment time, and give a good reason. If you miss it without rescheduling, USCIS may treat your application as abandoned and deny it.",
      },
      {
        heading: "Green card cases",
        body: "For Form I-485, USCIS reviews the case to decide whether an interview is needed. It may also send a request for more evidence; answer by the deadline, because a late answer can lead to a denial. The decision arrives as a written notice.",
      },
      {
        heading: "Citizenship cases",
        body: "For Form N-400, USCIS mails a decision after the interview: granted, continued (it needs more evidence or a retest) or denied. You become a citizen only when you take the Oath of Allegiance at a naturalization ceremony.",
      },
    ],
    sources: [SRC_BIOMETRICS, SRC_ADJUSTMENT, SRC_NATURALIZATION_STEPS],
  },
  {
    slug: "how-long-does-i-485-take",
    title: "How long I‑485 processing takes",
    seoTitle: "How Long Does I-485 Take? Processing Time Explained",
    summary: "How to read processing-time ranges and what affects your green card timeline.",
    description:
      "I-485 processing time depends on your office and category. How to read the official USCIS number, what adds time and what you can file while you wait.",
    sections: [
      {
        heading: "It depends on your office and category",
        body: "There is no single answer. Timing changes with the office handling your case and your category, for example family or employment based.",
      },
      {
        heading: "How to read the official number",
        body: "The USCIS processing-times tool shows how long it took to complete most recent cases for each form and office. Treat it as a guide, not a promise.",
      },
      {
        heading: "What can add time",
        body: "A request for evidence, interview scheduling, a transfer between offices, and visa availability. Many categories need a current priority date in the Visa Bulletin before a green card can be approved.",
      },
      {
        heading: "While you wait",
        body: "You can file for a work permit (I-765) and a travel document (I-131) with your I-485. If your case passes the normal processing time, you can submit a case inquiry.",
      },
      {
        heading: "The steps after you file",
        body: "USCIS mails a biometrics appointment notice, reviews the case to decide whether an interview is needed, asks for more evidence if something is missing, and then sends a written decision. After an approval, the approval notice generally arrives first and the green card a little later.",
      },
      {
        heading: "Why visa availability matters",
        body: "In family and employment preference categories, a visa is available when your priority date is earlier than the cut-off date in the Visa Bulletin. Your priority date is printed on your Form I-797 notice. Immediate relatives of U.S. citizens don't wait for a visa: USCIS says visas for them are always available.",
      },
      {
        heading: "Keep your address current",
        body: "You must tell USCIS within 10 days of moving. A missed notice can delay your case.",
      },
    ],
    sources: [SRC_ADJUSTMENT, SRC_VISA_AVAILABILITY, { label: "USCIS processing times", href: USCIS_PROCESSING_TIMES }],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);

/* --------------------------------------------------------------------- FAQ */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "What does the receipt number check do?",
    a: "It checks that your receipt number is written correctly, tells you which USCIS office issued it and links you to the official USCIS page for its current status. The check runs in your browser, so the number is not sent to us or stored. Live status is not shown here yet.",
  },
  {
    q: "What is a USCIS receipt number?",
    a: "The 13-character number on your receipt notice (Form I-797C): three letters for the office, then ten digits, for example IOE0912345678.",
  },
  {
    q: "Is TrackMyUSCIS part of USCIS or the government?",
    a: DISCLAIMER,
  },
  {
    q: "Is it free?",
    a: "Yes. Everything on the site is free. If we ever add a paid option, it will be optional and listed on the pricing page before it starts.",
  },
  {
    q: "Can you give legal advice?",
    a: "No. We explain statuses and timelines in plain language. For advice about your case, talk to a licensed immigration attorney or an accredited representative.",
  },
];

/* -------------------------------------------------------------- text pages */

export type TextPage = {
  title: string;
  /** Search title when it should differ from the on-page heading. */
  seoTitle?: string;
  lead: string;
  /** Search description, 120–160 characters, when the lead is too short for one. */
  description?: string;
  /** Keeps the page out of search and the sitemap (features that aren't live yet). */
  noindex?: boolean;
  body?: string[];
  /** Headed sections after the body, for pages with more to say (About). */
  sections?: { heading: string; body: string[] }[];
  action?: { label: string; href: string; external?: boolean };
};

/** Short pages rendered by the catch-all route. Key = path without leading slash. */
export const TEXT_PAGES: Record<string, TextPage> = {
  alerts: {
    title: "Case alerts",
    noindex: true,
    lead: "We'll email you when your case status changes, once our authorized data connection is in place.",
    body: ["Until then, the official USCIS Case Status Online page shows your latest status."],
    action: { label: "Open USCIS Case Status Online", href: USCIS_CASE_STATUS, external: true },
  },
  about: {
    title: "About TrackMyUSCIS",
    seoTitle: "About TrackMyUSCIS: Who We Are and How We Check Facts",
    description:
      "TrackMyUSCIS is a free, independent site that explains USCIS cases in plain English. What it does, where its information comes from and how it is paid for.",
    lead: "A free, independent site that explains USCIS cases in plain English.",
    body: [
      "USCIS tells you a lot in very few words. A status line or a notice can decide what you do next, and it is often hard to tell what it means. This site explains those words and sends you to the official page for anything that is specific to your case.",
    ],
    sections: [
      {
        heading: "What you can do here",
        body: [
          "[Check a receipt number](/#track) to confirm its format and see which USCIS office issued it. The check runs in your browser, so the number is not sent to us or stored.",
          "Read [what each case status means](/status-explained), the usual steps for [each form](/forms), and short [answers to common USCIS questions](/answers).",
          "Find the official [processing time](/processing-times) for your form and office, and learn how to read it.",
        ],
      },
      {
        heading: "Where the information comes from",
        body: [
          "Every answer is checked against uscis.gov and lists its official sources at the bottom of the page, with the date it was last checked. When USCIS changes a rule or a tool, we update the page and the date.",
          `If you spot something wrong or out of date, email ${COMPANY.email.support}.`,
        ],
      },
      {
        heading: "What we don't do",
        body: [
          "We can't see or change your case, and live case status is not shown here yet. For your current status, use [USCIS Case Status Online](https://egov.uscis.gov/).",
          "We are not a law firm and we don't give legal advice. For advice about your case, talk to a licensed immigration attorney or a DOJ-accredited representative.",
        ],
      },
      {
        heading: "How the site is paid for",
        body: [
          "Everything here is free. We plan to earn money from clearly labeled sponsored placements in the lawyer directory when it opens. Sponsors never pay for, review or change our explanations. We never sell your personal information. See [Advertising and Lawyer Directory](/advertising).",
        ],
      },
      {
        heading: "Not part of the government",
        body: [DISCLAIMER],
      },
    ],
  },
  contact: {
    title: "Contact",
    seoTitle: "Contact Us",
    description:
      "Email TrackMyUSCIS for questions, feedback, privacy requests or security reports. We usually reply within two business days. We can't see or change USCIS cases.",
    lead: "Email us and we'll usually reply within two business days.",
    body: [
      `General questions and feedback: ${COMPANY.email.support}`,
      `Privacy requests: ${COMPANY.email.privacy}`,
      `Security reports: ${COMPANY.email.security}`,
      `Legal notices: ${COMPANY.email.legal}`,
      "We can't see or change your USCIS case. For questions about your own case, contact USCIS directly.",
    ],
    action: { label: "Contact USCIS", href: USCIS_CONTACT, external: true },
  },
};
