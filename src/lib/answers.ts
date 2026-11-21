/**
 * Short answer pages: one real question per page, answered in the first two sentences,
 * then a little detail and the official source. This is the format people find through
 * Google and AI assistants. Facts checked against uscis.gov on 2026-11-20.
 *
 * Inline syntax: [link text](/path or https://…); a string[] in `body` is a bullet list.
 */
import { SERVICE_CENTERS } from "@/lib/receipt";

export type AnswerTopic = "Receipt numbers and status" | "Notices and appointments" | "Delays and contacting USCIS";

export type Answer = {
  slug: string;
  question: string;
  /** Search title when the question alone isn't how people search. */
  seoTitle?: string;
  topic: AnswerTopic;
  /** Search description, 120–160 characters. */
  description: string;
  /** The direct answer, one or two sentences. Shown first on the page; AI assistants and llms.txt quote it. */
  short: string;
  sections: { heading: string; body: (string | string[])[] }[];
  sources: { label: string; href: string }[];
  related: string[];
};

export const ANSWERS_UPDATED = "2026-11-20";
export const TOPICS: AnswerTopic[] = ["Receipt numbers and status", "Notices and appointments", "Delays and contacting USCIS"];

const SRC = {
  caseStatus: { label: "USCIS: Checking your case status online", href: "https://www.uscis.gov/tools/checking-your-case-status-online" },
  caseStatusTool: { label: "USCIS Case Status Online", href: "https://egov.uscis.gov/" },
  processingTimes: { label: "USCIS processing times", href: "https://egov.uscis.gov/processing-times/" },
  contactCenter: { label: "USCIS Contact Center", href: "https://www.uscis.gov/contactcenter" },
  eRequest: { label: "USCIS e-Request (case inquiries)", href: "https://egov.uscis.gov/e-request/" },
  i797: { label: "USCIS: Form I-797 types and functions", href: "https://www.uscis.gov/forms/filing-guidance/form-i-797-types-and-functions" },
  rfe: { label: "USCIS Policy Manual: Requests for Evidence", href: "https://www.uscis.gov/policy-manual/volume-1-part-e-chapter-6" },
  biometrics: {
    label: "USCIS: Preparing for your biometric services appointment",
    href: "https://www.uscis.gov/forms/filing-guidance/preparing-for-your-biometric-services-appointment",
  },
  premium: { label: "USCIS: How to request premium processing", href: "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing" },
  i907: { label: "Form I-907", href: "https://www.uscis.gov/i-907" },
  address: { label: "USCIS: Change of address", href: "https://www.uscis.gov/addresschange" },
  ar11: { label: "Form AR-11", href: "https://www.uscis.gov/ar-11" },
};

const PREFIXES = Object.entries(SERVICE_CENTERS).map(([code, office]) => `${code}: ${office}`);

export const ANSWERS: Answer[] = [
  /* ---------------------------------------------------- receipt numbers & status */
  {
    slug: "what-is-a-uscis-receipt-number",
    question: "What is a USCIS receipt number?",
    topic: "Receipt numbers and status",
    description:
      "A USCIS receipt number is the 13-character ID on your receipt notice (Form I-797C): three letters, then 10 digits. Where to find it and what the parts mean.",
    short:
      "A USCIS receipt number is the 13-character ID USCIS gives every application or petition: three letters for the office, then 10 digits, for example IOE0912345678. It's printed on your receipt notice, Form I-797C.",
    sections: [
      {
        heading: "Where to find it",
        body: [
          "Look for “Receipt Number” near the top left of the receipt notice USCIS mailed after you filed. If you filed online, it is also shown in your USCIS online account.",
          "Every notice for that case, including appointment notices and the approval notice, shows the same number.",
        ],
      },
      {
        heading: "What you use it for",
        body: [
          [
            "checking your case status on USCIS Case Status Online",
            "looking up processing times for your form and office",
            "asking USCIS about your case by phone or through e-Request",
          ],
          "If you filed more than one form, each one has its own receipt number.",
        ],
      },
      {
        heading: "What the parts mean",
        body: [
          "The three letters show which office or system received your case. The first two digits are usually the fiscal year USCIS received it. [What do the three letters mean?](/answers/uscis-receipt-number-letters)",
          "You can [check a receipt number here](/#track) to see its office and confirm the format.",
        ],
      },
    ],
    sources: [SRC.caseStatus, SRC.i797],
    related: ["uscis-receipt-number-letters", "how-to-check-uscis-case-status", "what-is-form-i-797"],
  },
  {
    slug: "uscis-receipt-number-letters",
    question: "What do the three letters in a USCIS receipt number mean?",
    seoTitle: "USCIS Receipt Number Prefixes Explained: IOE, MSC, EAC",
    topic: "Receipt numbers and status",
    description:
      "What the three letters in a USCIS receipt number mean: IOE is online filing, EAC, WAC, LIN and SRC are service centers, MSC is the National Benefits Center.",
    short:
      "The three letters show which USCIS office or system received your case. IOE means it was filed online, EAC, WAC, LIN and SRC are the four service centers, and MSC and NBC are the National Benefits Center.",
    sections: [
      { heading: "Every prefix", body: [PREFIXES] },
      {
        heading: "Does the office change how long it takes?",
        body: [
          "It can. Processing times differ by form, category and office, so look up the office that is handling your case on the [official processing times page](https://egov.uscis.gov/processing-times/). See [how to read processing times](/answers/how-long-does-uscis-take).",
        ],
      },
      {
        heading: "If your case is moved",
        body: ["USCIS sometimes transfers a case to another office to balance work. You get a transfer notice, and your receipt number stays the same."],
      },
    ],
    sources: [SRC.caseStatus, SRC.processingTimes],
    related: ["what-is-a-uscis-receipt-number", "how-long-does-uscis-take", "how-to-check-uscis-case-status"],
  },
  {
    slug: "how-to-check-uscis-case-status",
    question: "How do I check my USCIS case status?",
    topic: "Receipt numbers and status",
    description:
      "Check your USCIS case status with your receipt number on Case Status Online, in your USCIS online account, or by phone at 800-375-5283. Steps for each.",
    short:
      "Enter your 13-character receipt number on USCIS Case Status Online, or sign in to your USCIS online account. You can also call the USCIS Contact Center at 800-375-5283.",
    sections: [
      {
        heading: "Online",
        body: [
          [
            "[USCIS Case Status Online](https://egov.uscis.gov/): type your receipt number, with no dashes, and select Check Status.",
            "[USCIS online account](https://my.uscis.gov/): shows your cases and notices, and can send you automatic case alerts.",
          ],
        ],
      },
      {
        heading: "By phone",
        body: [
          "Call the USCIS Contact Center at 800-375-5283 (TTY 800-767-1833). An automated system answers 24 hours a day; live agents are available Monday to Friday, 8 a.m. to 8 p.m. Eastern. Have your receipt number ready.",
        ],
      },
      {
        heading: "Understanding what it says",
        body: ["Status names can be vague. Our [case status guide](/status-explained) explains each one in plain English and what usually comes next."],
      },
    ],
    sources: [SRC.caseStatus, SRC.contactCenter],
    related: ["why-has-my-uscis-case-status-not-changed", "what-is-a-uscis-receipt-number", "uscis-case-approved-what-next"],
  },
  {
    slug: "why-has-my-uscis-case-status-not-changed",
    question: "Why hasn't my USCIS case status changed?",
    seoTitle: "Why Hasn't My USCIS Case Status Changed? What's Normal",
    topic: "Receipt numbers and status",
    description:
      "A USCIS case status only changes at milestones, so months without an update is usually normal. How to tell if your case is taking too long and what to do.",
    short:
      "Usually because nothing new has happened yet. Your status only changes at milestones such as biometrics, a request for evidence, an interview or a decision, and a case can stay in one status for months.",
    sections: [
      {
        heading: "What's normal",
        body: [
          "“Case Is Being Actively Reviewed” and similar statuses can last for months. You don't need to do anything unless a notice arrives. Read [what that status means](/guides/case-is-being-actively-reviewed).",
        ],
      },
      {
        heading: "How to tell if it's taking too long",
        body: [
          "Compare how long it has been since the received date on your receipt notice with the time shown for your form and office on the [official processing times page](https://egov.uscis.gov/processing-times/). If yours is longer, you can [ask USCIS about it](/answers/contact-uscis-about-delayed-case).",
        ],
      },
      {
        heading: "Make sure USCIS can reach you",
        body: ["A missed notice is a common cause of delays. If you have moved, [update your address](/answers/how-to-change-address-with-uscis) straight away."],
      },
    ],
    sources: [SRC.processingTimes, SRC.contactCenter],
    related: ["how-long-does-uscis-take", "contact-uscis-about-delayed-case", "how-to-check-uscis-case-status"],
  },
  {
    slug: "uscis-case-approved-what-next",
    question: "My USCIS case was approved. What happens next?",
    seoTitle: "USCIS Case Approved: What Happens Next",
    topic: "Receipt numbers and status",
    description:
      "After USCIS approves your case, it mails an approval notice (Form I-797). If a card comes with it, the card is printed and mailed separately. What to expect.",
    short:
      "USCIS mails you an approval notice. If the approval comes with a card, such as a green card or work permit, the status usually moves to “New Card Is Being Produced” and then “Card Was Mailed To Me”.",
    sections: [
      {
        heading: "The approval notice",
        body: ["The approval notice is a Form I-797. Keep it with your other immigration papers. [What is Form I-797?](/answers/what-is-form-i-797)"],
      },
      {
        heading: "Your card",
        body: [
          "Cards are printed and mailed separately from the notice. When the status says the card was mailed, it often includes a USPS tracking number you can use to follow the delivery.",
          "Cards go to the address USCIS has on file, so make sure it is current. [How to change your address](/answers/how-to-change-address-with-uscis).",
        ],
      },
      {
        heading: "If something doesn't arrive",
        body: ["Contact the USCIS Contact Center at 800-375-5283 with your receipt number."],
      },
    ],
    sources: [SRC.i797, SRC.contactCenter],
    related: ["how-to-change-address-with-uscis", "what-is-form-i-797", "how-to-check-uscis-case-status"],
  },

  /* --------------------------------------------------- notices & appointments */
  {
    slug: "what-is-form-i-797",
    question: "What is Form I-797, Notice of Action?",
    seoTitle: "What Is Form I-797? Notice of Action Types Explained",
    topic: "Notices and appointments",
    description:
      "Form I-797, Notice of Action, is how USCIS tells you about your case. What the I-797, I-797A, I-797B, I-797C and I-797D versions mean and which to keep.",
    short:
      "Form I-797 is the notice USCIS uses to tell you about your case. The I-797C version confirms receipt and schedules appointments; an I-797 approval notice confirms that your case was approved.",
    sections: [
      {
        heading: "The types",
        body: [
          [
            "I-797: confirms receipt or approval of an application or petition.",
            "I-797A: an approval that includes a replacement Form I-94.",
            "I-797B: an approval of a petition for a foreign worker.",
            "I-797C: receipt or rejection notices, transfer notices, and biometrics, interview or rescheduled appointment notices.",
            "I-797D: comes with benefit cards.",
          ],
        ],
      },
      {
        heading: "Keep every notice",
        body: [
          "Each notice shows your [receipt number](/answers/what-is-a-uscis-receipt-number) and important dates. Keep the originals somewhere safe and take copies to appointments when the notice asks you to.",
        ],
      },
    ],
    sources: [SRC.i797],
    related: ["what-is-a-uscis-receipt-number", "uscis-biometrics-appointment", "what-is-a-request-for-evidence"],
  },
  {
    slug: "uscis-biometrics-appointment",
    question: "What happens at a USCIS biometrics appointment?",
    topic: "Notices and appointments",
    description:
      "At a USCIS biometrics appointment, your fingerprints, photo and signature are taken for background checks. What to bring and how to reschedule.",
    short:
      "At an Application Support Center, USCIS takes your fingerprints, photo and signature to confirm your identity and run background checks. Bring your appointment notice (Form I-797C) and a valid photo ID.",
    sections: [
      {
        heading: "What to bring",
        body: [
          [
            "Your appointment notice, Form I-797C. If you received more than one, bring them all.",
            "Valid photo identification, such as a green card, passport or driver's license.",
          ],
          "Your notice may list other things to bring, so read it carefully.",
        ],
      },
      {
        heading: "If you need to reschedule",
        body: [
          "Request it through your USCIS online account at least 12 hours before the appointment time, and explain the good reason for the change. Don't mail the request. Missing an appointment without rescheduling can lead to your case being treated as abandoned.",
        ],
      },
      {
        heading: "What happens next",
        body: ["USCIS runs its checks and your status may change to “Fingerprints Were Taken”. [What happens after biometrics](/guides/what-happens-after-biometrics)."],
      },
    ],
    sources: [SRC.biometrics],
    related: ["what-is-form-i-797", "why-has-my-uscis-case-status-not-changed", "how-to-check-uscis-case-status"],
  },
  {
    slug: "what-is-a-request-for-evidence",
    question: "What is a USCIS Request for Evidence (RFE)?",
    seoTitle: "USCIS Request for Evidence (RFE): Deadline and Next Steps",
    topic: "Notices and appointments",
    description:
      "A Request for Evidence (RFE) means USCIS needs more documents to decide your case. How to respond, the deadline (up to 12 weeks) and whether it means denial.",
    short:
      "A Request for Evidence is a notice asking for more documents before USCIS can decide your case. Answer by the deadline printed on it: USCIS allows up to 12 weeks and cannot give you more time.",
    sections: [
      {
        heading: "What to do",
        body: [
          [
            "Read the whole notice and list exactly what it asks for.",
            "Send everything requested in one response, following the notice's instructions on how and where to send it.",
            "Keep a full copy of what you send and proof of the date you sent it.",
            "Respond before the deadline. A late or missing response can lead to a denial.",
          ],
        ],
      },
      {
        heading: "Does an RFE mean my case will be denied?",
        body: [
          "No. RFEs are common, and many cases are approved after the response. It means the officer needs more information to decide.",
        ],
      },
      {
        heading: "Getting help",
        body: [
          "If you're unsure what the notice is asking for, a licensed immigration attorney or a DOJ-accredited representative can help. [Find an immigration lawyer](/lawyers).",
        ],
      },
    ],
    sources: [SRC.rfe],
    related: ["what-is-form-i-797", "why-has-my-uscis-case-status-not-changed", "contact-uscis-about-delayed-case"],
  },

  /* ----------------------------------------------- delays & contacting USCIS */
  {
    slug: "how-long-does-uscis-take",
    question: "How long does USCIS take to process a case?",
    seoTitle: "How Long Does USCIS Take? How to Read Processing Times",
    topic: "Delays and contacting USCIS",
    description:
      "USCIS processing time depends on your form, category and office. How to look up the official time for your case and tell if it is within the normal range.",
    short:
      "It depends on the form, the category and the office handling your case. USCIS publishes current processing times for each; compare the received date on your notice with the time shown to see if your case is within the normal range.",
    sections: [
      {
        heading: "How to look it up",
        body: [
          [
            "Open the [official USCIS processing times page](https://egov.uscis.gov/processing-times/).",
            "Choose your form and category.",
            "Choose the office handling your case. The [letters in your receipt number](/answers/uscis-receipt-number-letters) tell you which one.",
          ],
          "Our [processing times page](/processing-times) walks you through it.",
        ],
      },
      {
        heading: "Reading the result",
        body: [
          "The time shown is how long USCIS is currently taking to complete most cases of that type. Some cases finish sooner and some take longer, and times change as workloads change.",
        ],
      },
      {
        heading: "Can it go faster?",
        body: [
          "Some forms can use [premium processing](/answers/what-is-uscis-premium-processing) for a fee. If your case is already past the normal time, you can [ask USCIS about it](/answers/contact-uscis-about-delayed-case).",
        ],
      },
    ],
    sources: [SRC.processingTimes],
    related: ["contact-uscis-about-delayed-case", "what-is-uscis-premium-processing", "uscis-receipt-number-letters"],
  },
  {
    slug: "what-is-uscis-premium-processing",
    question: "What is USCIS premium processing?",
    topic: "Delays and contacting USCIS",
    description:
      "USCIS premium processing is a paid service that guarantees action on certain forms in a set time, 15 business days for most. Which forms and how to request it.",
    short:
      "Premium processing is an optional paid service for certain forms. USCIS guarantees it will take action on the case within a set time, 15 business days for most categories, or it refunds the premium fee. You request it with Form I-907.",
    sections: [
      {
        heading: "Which forms",
        body: [
          "Premium processing is available for certain categories of Form I-129 and Form I-140, and some categories of Form I-539 and Form I-765. Check the USCIS page for your exact category before you file.",
        ],
      },
      {
        heading: "How long it takes",
        body: [
          "15 business days for most categories, 30 business days for Form I-765 and some Form I-539 requests, and 45 business days for certain Form I-140 categories.",
        ],
      },
      {
        heading: "What “action” means",
        body: [
          "Action can be an approval, a denial, a request for evidence or a notice of intent to deny. Premium processing makes the decision faster; it doesn't make approval more likely.",
        ],
      },
    ],
    sources: [SRC.premium, SRC.i907],
    related: ["how-long-does-uscis-take", "what-is-a-request-for-evidence", "contact-uscis-about-delayed-case"],
  },
  {
    slug: "contact-uscis-about-delayed-case",
    question: "How do I contact USCIS about a delayed case?",
    seoTitle: "USCIS Case Taking Too Long? How to Submit a Case Inquiry",
    topic: "Delays and contacting USCIS",
    description:
      "If your USCIS case is past the normal processing time, submit a case inquiry through e-Request or call 800-375-5283. What to check first and how to ask.",
    short:
      "If your case is past the normal processing time for your form and office, submit a case inquiry online through USCIS e-Request, or call the USCIS Contact Center at 800-375-5283. Have your receipt number ready.",
    sections: [
      {
        heading: "Check first",
        body: [
          "Look up your form and office on the [official processing times page](https://egov.uscis.gov/processing-times/). USCIS usually accepts an inquiry only once a case is outside the normal processing time.",
        ],
      },
      {
        heading: "Ways to ask",
        body: [
          [
            "Online: [USCIS e-Request](https://egov.uscis.gov/e-request/). Choose the option for a case outside normal processing times.",
            "Phone: 800-375-5283 (TTY 800-767-1833), live agents Monday to Friday, 8 a.m. to 8 p.m. Eastern.",
            "Your member of Congress: their local office can contact USCIS for you.",
          ],
        ],
      },
      {
        heading: "Keep a record",
        body: ["Write down the date, the reference number you're given and what you were told, in case you need to follow up."],
      },
    ],
    sources: [SRC.eRequest, SRC.contactCenter, SRC.processingTimes],
    related: ["how-long-does-uscis-take", "why-has-my-uscis-case-status-not-changed", "how-to-change-address-with-uscis"],
  },
  {
    slug: "how-to-change-address-with-uscis",
    question: "How do I change my address with USCIS?",
    topic: "Delays and contacting USCIS",
    description:
      "Change your address with USCIS online within 10 days of moving and add the receipt number of each pending case. Online and Form AR-11 options explained.",
    short:
      "Change it online at uscis.gov/addresschange, preferably through your USCIS online account, and enter the receipt number of every pending case. Most noncitizens in the U.S. must report a new address within 10 days of moving.",
    sections: [
      {
        heading: "Who must report",
        body: ["All noncitizens in the United States must report a change of address within 10 days of moving. This doesn't apply to A and G visa holders or visa waiver visitors."],
      },
      {
        heading: "How to do it",
        body: [
          [
            "Online (best): use the change-of-address tool in your USCIS online account. Enter the receipt number of each pending case so your notices and cards go to the new address.",
            "By mail: file Form AR-11. It meets the legal requirement, but it doesn't automatically update your pending cases.",
          ],
        ],
      },
      {
        heading: "Why it matters",
        body: ["Notices, appointment letters and cards are mailed to the address on file. An old address is one of the most common reasons people miss a notice."],
      },
    ],
    sources: [SRC.address, SRC.ar11],
    related: ["why-has-my-uscis-case-status-not-changed", "uscis-case-approved-what-next", "uscis-biometrics-appointment"],
  },
];

export const getAnswer = (slug: string) => ANSWERS.find((a) => a.slug === slug);
