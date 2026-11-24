/**
 * USCIS case statuses: the short meaning shown in lists and the dashboard, plus a full page
 * for each one at /status-explained/<slug>. Facts checked against uscis.gov on STATUSES_UPDATED;
 * every page lists its official sources. Nothing here estimates a time USCIS doesn't publish.
 *
 * Inline syntax: [link text](/path or https://…); a string[] in `body` is a bullet list.
 */

export type Tone = "info" | "success" | "warning" | "error";

export type StatusPage = {
  /** The status as USCIS shows it. The dashboard matches a case's status to this name. */
  name: string;
  tone: Tone;
  /** One or two sentences, shown in lists, search and the dashboard. */
  meaning: string;
  /** A page that already covers this status in full. When set, the status has no page of its own. */
  covered?: string;
  /** Other wording USCIS uses for the same step. */
  alsoShownAs?: string[];
  /** Search title, under ~60 characters. */
  seoTitle?: string;
  /** Search description, 140–160 characters. */
  description?: string;
  /** The direct answer, two or three sentences. Shown first; AI assistants quote it. */
  short?: string;
  sections?: { heading: string; body: (string | string[])[] }[];
  faq?: { q: string; a: string }[];
  sources?: { label: string; href: string }[];
  /** Pages on this site worth reading next. */
  related?: { href: string; title: string }[];
};

/** The badge shown beside each status. */
export const TONE_LABEL = { info: "Update", success: "Good news", warning: "Action needed", error: "Decision" } as const;

/** Date the status pages were last checked against uscis.gov. */
export const STATUSES_UPDATED = "2026-11-24";

/** Anchor id on /status-explained and the slug of the status page, e.g. "case-was-received". */
export const statusId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const SRC = {
  caseStatus: { label: "USCIS: Checking your case status online", href: "https://www.uscis.gov/tools/checking-your-case-status-online" },
  caseStatusTool: { label: "USCIS Case Status Online", href: "https://egov.uscis.gov/" },
  i797: { label: "USCIS: Form I-797 types and functions", href: "https://www.uscis.gov/forms/filing-guidance/form-i-797-types-and-functions" },
  biometrics: {
    label: "USCIS: Preparing for your biometric services appointment",
    href: "https://www.uscis.gov/forms/filing-guidance/preparing-for-your-biometric-services-appointment",
  },
  rfe: { label: "USCIS Policy Manual: Requests for Evidence", href: "https://www.uscis.gov/policy-manual/volume-1-part-e-chapter-6" },
  processingTimes: { label: "USCIS processing times", href: "https://egov.uscis.gov/processing-times/" },
  eRequest: { label: "USCIS e-Request (case inquiries)", href: "https://egov.uscis.gov/e-request/" },
  contactCenter: { label: "USCIS Contact Center", href: "https://www.uscis.gov/contactcenter" },
  address: { label: "USCIS: Change of address", href: "https://www.uscis.gov/addresschange" },
  delivery: {
    label: "USCIS: How to track delivery of your notice or secure identity document (or card)",
    href: "https://www.uscis.gov/forms/filing-guidance/how-to-track-delivery-of-your-notice-or-secure-identity-document-or-card",
  },
  i765: { label: "USCIS: Form I-765, Application for Employment Authorization", href: "https://www.uscis.gov/i-765" },
  adjustment: { label: "USCIS: Adjustment of status", href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/adjustment-of-status" },
  naturalization: { label: "USCIS: 10 steps to naturalization", href: "https://www.uscis.gov/citizenship/learn-about-citizenship/10-steps-to-naturalization" },
  appeals: { label: "USCIS: Questions and answers, appeals and motions", href: "https://www.uscis.gov/forms/all-forms/questions-and-answers-appeals-and-motions" },
  i290b: { label: "USCIS: Form I-290B, Notice of Appeal or Motion", href: "https://www.uscis.gov/i-290b" },
  fees: { label: "USCIS: Fee Schedule (Form G-1055)", href: "https://www.uscis.gov/g-1055" },
  mailTips: { label: "USCIS: Tips for filing forms by mail", href: "https://www.uscis.gov/forms/filing-guidance/tips-for-filing-forms-by-mail" },
};

const R = {
  receipt: { href: "/answers/what-is-a-uscis-receipt-number", title: "What is a USCIS receipt number?" },
  i797: { href: "/answers/what-is-form-i-797", title: "What is Form I-797, Notice of Action?" },
  notChanged: { href: "/answers/why-has-my-uscis-case-status-not-changed", title: "Why hasn't my USCIS case status changed?" },
  delayed: { href: "/answers/contact-uscis-about-delayed-case", title: "How do I contact USCIS about a delayed case?" },
  address: { href: "/answers/how-to-change-address-with-uscis", title: "How do I change my address with USCIS?" },
  biometrics: { href: "/answers/uscis-biometrics-appointment", title: "What happens at a USCIS biometrics appointment?" },
  afterBiometrics: { href: "/guides/what-happens-after-biometrics", title: "What happens after biometrics" },
  reviewed: { href: "/guides/case-is-being-actively-reviewed", title: "What “Case Is Being Actively Reviewed” means" },
  rfe: { href: "/answers/what-is-a-request-for-evidence", title: "What is a USCIS Request for Evidence (RFE)?" },
  approved: { href: "/answers/uscis-case-approved-what-next", title: "My USCIS case was approved. What happens next?" },
  howLong: { href: "/answers/how-long-does-uscis-take", title: "How long does USCIS take to process a case?" },
  times: { href: "/processing-times", title: "USCIS processing times by form and office" },
  lawyers: { href: "/lawyers", title: "Find an immigration lawyer" },
  eadDelays: { href: "/blog/ead-delays-2026", title: "EAD taking too long? What you can do" },
  n400: { href: "/forms/n-400", title: "Form N-400: Citizenship" },
  i485: { href: "/forms/i-485", title: "Form I-485: Green card" },
};

const ADDRESS_LINE =
  "USCIS mails notices and cards to the address it has on file, and you must report a new address within 10 days of moving. [How to change your address](/answers/how-to-change-address-with-uscis).";

const CARD_MISSING: (string | string[])[] = [
  "USCIS says to work through these steps in order:",
  [
    "Check the USPS tracking number shown in your USCIS online account.",
    "If tracking says the package was delivered but you don't have it, follow the steps on the USPS Find Missing Mail page straight away.",
    "If you have contacted USPS and still don't have the card, call the USCIS Contact Center at 800-375-5283 or submit a case inquiry through [USCIS e-Request](https://egov.uscis.gov/e-request/) in the “did not receive card by mail” or “did not receive document by mail” category.",
  ],
  "USCIS says it may be able to try a second delivery, and may reissue a document that was never delivered.",
];

export const STATUS_PAGES: StatusPage[] = [
  {
    name: "Case Was Received",
    tone: "info",
    meaning: "USCIS accepted your filing and mailed a receipt notice with your receipt number.",
    alsoShownAs: ["Case Was Received and a Receipt Notice Was Sent"],
    seoTitle: "Case Was Received: What This USCIS Status Means",
    description:
      "“Case Was Received” means USCIS accepted your application and mailed a receipt notice (Form I-797C). What the notice shows, what to do now and what comes next.",
    short:
      "“Case Was Received” means USCIS accepted your application or petition for processing and mailed you a receipt notice, Form I-797C. The notice shows your 13-character receipt number, which you use to follow the case.",
    sections: [
      {
        heading: "What it means",
        body: [
          "USCIS accepted your filing and opened a case. It has not been reviewed by an officer yet.",
          "The receipt notice is a Form I-797C. It lists your receipt number, the date USCIS received the case and the form type. [What the receipt number means](/answers/what-is-a-uscis-receipt-number).",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Keep the receipt notice with your immigration papers. You will need the receipt number for every question about this case.",
            "Check that your name, date of birth and address on the notice are right.",
            "Look up the official processing time for your form and office, so you know what is normal. [USCIS processing times](/processing-times).",
          ],
          ADDRESS_LINE,
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "For many forms the next step is a biometrics appointment notice. Other cases go straight into review. The status often stays the same for weeks or months, because it only changes when USCIS takes a new action.",
        ],
      },
    ],
    faq: [
      {
        q: "How long does “Case Was Received” last?",
        a: "It depends on your form and office. USCIS Case Status Online shows only the last action taken on a case, so the status stays the same until the next action, such as a biometrics notice, a request for evidence or a decision.",
      },
      {
        q: "I didn't get my receipt notice. What should I do?",
        a: "USCIS notices can't be tracked in the mail. If the status shows a notice was sent and it hasn't arrived, you can submit a case inquiry through USCIS e-Request in the “did not receive notice by mail” category, or call the USCIS Contact Center at 800-375-5283.",
      },
    ],
    sources: [SRC.caseStatus, SRC.i797, SRC.delivery],
    related: [R.receipt, R.i797, R.howLong, R.notChanged],
  },
  {
    name: "Biometrics Appointment Was Scheduled",
    tone: "info",
    meaning: "USCIS mailed a notice with the date, time and place for your fingerprints, photo and signature.",
    seoTitle: "Biometrics Appointment Was Scheduled: What to Do",
    description:
      "“Biometrics Appointment Was Scheduled” means USCIS mailed an appointment notice for your fingerprints, photo and signature. What to bring and how to reschedule.",
    short:
      "“Biometrics Appointment Was Scheduled” means USCIS mailed you an appointment notice, Form I-797C, with the date, time and Application Support Center where it will take your fingerprints, photo and signature.",
    sections: [
      {
        heading: "What it means",
        body: [
          "USCIS uses biometrics to confirm who you are, run background checks and print any card you are approved for. The appointment itself is short: staff take your fingerprints, a photo and your signature. No one asks about your case.",
        ],
      },
      {
        heading: "What to bring",
        body: [
          [
            "Your appointment notice, Form I-797C. If you received more than one, bring them all.",
            "Valid photo identification, such as a green card, passport or driver's license.",
          ],
          "Your notice may list other things to bring, so read it all.",
        ],
      },
      {
        heading: "If you can't go on that day",
        body: [
          "Ask to reschedule through your USCIS online account at least 12 hours before the appointment time, and give a good reason. If you miss the appointment without rescheduling, USCIS may treat your application as abandoned and deny it.",
        ],
      },
    ],
    faq: [
      {
        q: "What if the notice hasn't arrived?",
        a: "If you have a USCIS online account, the appointment notice is usually there too. If nothing arrives, submit a case inquiry through USCIS e-Request in the “did not receive notice by mail” category or call the USCIS Contact Center at 800-375-5283.",
      },
      {
        q: "What happens after the appointment?",
        a: "Your status may change to show that your fingerprints were taken. Background checks then run while the case waits for review.",
      },
    ],
    sources: [SRC.biometrics, SRC.i797, SRC.delivery],
    related: [R.biometrics, R.afterBiometrics, R.address],
  },
  {
    name: "Fingerprints Were Taken",
    tone: "info",
    meaning: "Your biometrics appointment is done. Background and identity checks run next.",
    alsoShownAs: ["Case Was Updated To Show Fingerprints Were Taken"],
    seoTitle: "Fingerprints Were Taken: What This USCIS Status Means",
    description:
      "“Case Was Updated To Show Fingerprints Were Taken” means your biometrics are on file and background checks can run. What comes next and what you need to do.",
    short:
      "“Case Was Updated To Show Fingerprints Were Taken” means USCIS has your fingerprints, photo and signature on file. Identity and background checks run next, and you don't need to do anything unless a notice arrives.",
    sections: [
      {
        heading: "What it means",
        body: [
          "Your biometrics appointment is recorded on your case. USCIS uses the fingerprints, photo and signature for identity and background checks, and to print any card you are approved for.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          "Nothing, unless USCIS sends you a notice. Keep your appointment notice with your records.",
          ADDRESS_LINE,
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "The case waits for review. Depending on the form, the next change is an interview notice, a request for evidence or a decision. Many cases next show [“Case Is Being Actively Reviewed”](/guides/case-is-being-actively-reviewed), which can last for months.",
        ],
      },
    ],
    faq: [
      {
        q: "How long after fingerprints is a decision made?",
        a: "USCIS doesn't publish a time from biometrics to decision. It publishes a processing time for the whole case, by form, category and office. Compare the received date on your receipt notice with that time.",
      },
      {
        q: "Does this status mean my background check is finished?",
        a: "No. It means the fingerprints were collected. The checks run after that and USCIS doesn't show a separate status when they finish.",
      },
    ],
    sources: [SRC.biometrics, SRC.caseStatus, SRC.processingTimes],
    related: [R.afterBiometrics, R.reviewed, R.howLong, R.notChanged],
  },
  {
    name: "Case Is Being Actively Reviewed",
    tone: "info",
    meaning: "Your case is in review. It can show for months and needs nothing from you unless a notice arrives.",
    covered: "/guides/case-is-being-actively-reviewed",
  },
  {
    name: "Request for Evidence Was Sent",
    tone: "warning",
    meaning: "USCIS needs more documents. Answer by the deadline printed on the notice.",
    alsoShownAs: ["Request for Additional Evidence Was Sent", "Request for Initial Evidence Was Sent"],
    seoTitle: "Request for Evidence Was Sent: Status and Deadline",
    description:
      "“Request for Additional Evidence Was Sent” means USCIS mailed a notice asking for more documents. Where the deadline is, how to respond and what happens after.",
    short:
      "“Request for Evidence Was Sent” means USCIS mailed you a notice listing documents it needs before it can decide your case. Respond by the deadline printed on the notice: USCIS allows up to 12 weeks and can't give you more time.",
    sections: [
      {
        heading: "What it means",
        body: [
          "USCIS needs something more before it can decide. “Initial evidence” is what the form and its instructions always require; USCIS asks for it when it was missing. “Additional evidence” is asked for when what you sent doesn't fully show that you qualify.",
          "A request for evidence is common and does not mean the case will be denied.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Wait for the notice in the mail, or open it in your USCIS online account if you have one. The status alone doesn't say what is needed.",
            "Find the deadline on the notice and list exactly what it asks for.",
            "Send everything in one response, the way the notice says to send it.",
            "Keep a full copy and proof of the date you sent it.",
          ],
          "A late or missing response can lead to a denial. If you aren't sure what the notice is asking for, a licensed immigration attorney or a DOJ-accredited representative can help. [Find an immigration lawyer](/lawyers).",
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "After USCIS logs your response, the status changes to show that the response was received, and review continues. [What that status means](/status-explained/response-to-request-for-evidence-was-received).",
        ],
      },
    ],
    faq: [
      {
        q: "How long do I have to answer a request for evidence?",
        a: "The deadline is printed on the notice. USCIS allows up to 12 weeks and can't give you more time.",
      },
      {
        q: "The status changed but I have no notice. What now?",
        a: "Notices can take some days to arrive and can't be tracked in the mail. If it doesn't come, submit a case inquiry through USCIS e-Request in the “did not receive notice by mail” category or call the USCIS Contact Center at 800-375-5283, so you don't lose time against the deadline.",
      },
    ],
    sources: [SRC.rfe, SRC.delivery, SRC.contactCenter],
    related: [R.rfe, R.i797, R.lawyers, R.address],
  },
  {
    name: "Response to Request for Evidence Was Received",
    tone: "info",
    meaning: "USCIS has your documents and the review continues.",
    alsoShownAs: ["Response To USCIS' Request For Evidence Was Received"],
    seoTitle: "Response to Request for Evidence Was Received: Next",
    description:
      "“Response To USCIS' Request For Evidence Was Received” means USCIS logged the documents you sent and review has resumed. What comes next and how long to wait.",
    short:
      "“Response To USCIS' Request For Evidence Was Received” means USCIS logged the documents you sent and your case is back in review. You don't need to do anything else unless another notice arrives.",
    sections: [
      {
        heading: "What it means",
        body: [
          "USCIS has matched your response to your case. It doesn't mean an officer has read the documents yet, or that they were enough: it confirms they arrived.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          "Keep your copy of what you sent and the proof of delivery. There is nothing to file.",
          ADDRESS_LINE,
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "An officer reviews the response and then approves the case, denies it, or asks for something else, for example an interview. USCIS doesn't publish a time for this step.",
          "To judge whether the whole case is taking too long, compare the received date on your receipt notice with the official time for your form and office. [USCIS processing times](/processing-times).",
        ],
      },
    ],
    faq: [
      {
        q: "How long after the RFE response does USCIS decide?",
        a: "USCIS doesn't publish a time for this step. Its posted processing times cover the whole case, and for some forms USCIS says they can include the days spent waiting for a response to a request for evidence.",
      },
      {
        q: "I sent my response but the status hasn't changed. Is that a problem?",
        a: "It can take time for USCIS to log mail. Check your delivery confirmation first. If the response was delivered and the deadline has passed with no change, call the USCIS Contact Center at 800-375-5283 with your receipt number.",
      },
    ],
    sources: [SRC.rfe, SRC.processingTimes, SRC.contactCenter],
    related: [R.rfe, R.notChanged, R.delayed, R.howLong],
  },
  {
    name: "Case Is Ready To Be Scheduled For An Interview",
    tone: "info",
    meaning: "Your case is waiting for an interview slot at a USCIS field office. A notice comes when a date is set.",
    seoTitle: "Case Is Ready To Be Scheduled For An Interview: Meaning",
    description:
      "“Case Is Ready To Be Scheduled For An Interview” means your case is in line for an interview at a USCIS field office. What it means, what to do and what's next.",
    short:
      "“Case Is Ready To Be Scheduled For An Interview” means your case is waiting for an interview slot at a USCIS field office. You don't have a date yet: USCIS mails an interview notice when it schedules one.",
    sections: [
      {
        heading: "What it means",
        body: [
          "Your case is in the line for an interview at a USCIS field office. The status doesn't show your place in line or a date.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Nothing needs to be filed while you wait.",
            "Check the official processing time for your form at your field office, so you know what is normal.",
          ],
          ADDRESS_LINE,
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "The status changes to [“Interview Was Scheduled”](/status-explained/interview-was-scheduled) and a notice arrives with the date, time and office. For a green card application, USCIS reviews each case to decide whether an interview is needed, so some cases are decided without one.",
        ],
      },
    ],
    faq: [
      {
        q: "How long does “ready to be scheduled for an interview” last?",
        a: "USCIS doesn't publish a time for this step. It depends on the field office. The official processing time for your form and office covers the whole case, so use that to judge whether yours is taking too long.",
      },
      {
        q: "Can USCIS decide my case without an interview?",
        a: "For Form I-485, yes: USCIS reviews each case to decide whether an interview is needed. Naturalization (Form N-400) includes an interview.",
      },
    ],
    sources: [SRC.adjustment, SRC.naturalization, SRC.processingTimes],
    related: [R.times, R.i485, R.n400, R.notChanged],
  },
  {
    name: "Interview Was Scheduled",
    tone: "info",
    meaning: "A notice with the date, time and office of your interview is in the mail.",
    seoTitle: "Interview Was Scheduled: What This USCIS Status Means",
    description:
      "“Interview Was Scheduled” means USCIS mailed a notice with the date, time and office of your interview. What to do when it arrives and what happens after.",
    short:
      "“Interview Was Scheduled” means USCIS set a date for your interview and mailed you a notice, Form I-797C, with the date, time and office. Follow the notice: it lists what to bring.",
    sections: [
      {
        heading: "What it means",
        body: [
          "Your case has an interview slot at a USCIS field office. The status itself doesn't show the date. The notice does, and if you have a USCIS online account the notice is usually there as well.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Read the whole notice when it arrives and note the date, time and address.",
            "Gather everything it asks you to bring.",
            "If you can't attend, follow the rescheduling instructions on the notice as early as you can.",
          ],
          "If you have a lawyer or accredited representative, tell them the date. [Find an immigration lawyer](/lawyers).",
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "After a green card interview, USCIS sends a written decision. After a naturalization interview, USCIS mails a decision: granted, continued (it needs more evidence or a retest) or denied. If you are approved for citizenship, the last step is the Oath of Allegiance at a ceremony.",
        ],
      },
    ],
    faq: [
      {
        q: "The status says my interview was scheduled, but I have no notice. What should I do?",
        a: "Check your USCIS online account first. Notices can't be tracked in the mail, so if nothing arrives, submit a case inquiry through USCIS e-Request in the “did not receive notice by mail” category or call the USCIS Contact Center at 800-375-5283 so you don't miss the date.",
      },
      {
        q: "Does every case get an interview?",
        a: "No. Naturalization (Form N-400) includes an interview. For a green card application (Form I-485), USCIS reviews each case to decide whether one is needed.",
      },
    ],
    sources: [SRC.i797, SRC.adjustment, SRC.naturalization, SRC.delivery],
    related: [R.i797, R.i485, R.n400, R.lawyers],
  },
  {
    name: "Interview Was Completed And My Case Must Be Reviewed",
    tone: "info",
    meaning: "Your interview is on record and the officer still has to finish reviewing the case before deciding.",
    seoTitle: "Interview Was Completed And My Case Must Be Reviewed",
    description:
      "“Interview Was Completed And My Case Must Be Reviewed” means your interview is done and USCIS hasn't decided yet. What it means and what comes next.",
    short:
      "“Interview Was Completed And My Case Must Be Reviewed” means USCIS recorded your interview and has not made a decision yet. The officer still needs to review the case, and USCIS will mail you a written decision.",
    sections: [
      {
        heading: "What it means",
        body: [
          "No decision was entered on the day of the interview. That is common and is not a sign of a problem by itself: the officer may need to finish reviewing the file or wait for a document.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          "If the officer gave you a paper asking for more documents, send them by the date on it. Otherwise there is nothing to file.",
          ADDRESS_LINE,
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "USCIS sends a written decision. It can also send a request for evidence first. For naturalization, the decision is granted, continued (USCIS needs more evidence or a retest) or denied, and an approval is followed by a notice for the oath ceremony.",
        ],
      },
    ],
    faq: [
      {
        q: "How long after the interview will USCIS decide?",
        a: "USCIS doesn't publish a time for this step. If the whole case is past the official processing time for your form and office, you can submit a case inquiry through USCIS e-Request.",
      },
      {
        q: "Does this status mean my case will be denied?",
        a: "No. It only means a decision has not been made yet.",
      },
    ],
    sources: [SRC.adjustment, SRC.naturalization, SRC.eRequest],
    related: [R.delayed, R.rfe, R.notChanged, R.times],
  },
  {
    name: "Case Was Transferred",
    tone: "info",
    meaning: "Another office is handling your case now, often to balance workload. Processing times follow the new office.",
    alsoShownAs: ["Case Was Transferred And A New Office Has Jurisdiction", "Case Transferred To Another Office"],
    seoTitle: "Case Was Transferred: What This USCIS Status Means",
    description:
      "“Case Was Transferred And A New Office Has Jurisdiction” means another USCIS office now handles your case. What the transfer notice says and what to do.",
    short:
      "“Case Was Transferred And A New Office Has Jurisdiction” means USCIS moved your case to a different office, which will now decide it. USCIS mails a transfer notice, and you don't need to file anything.",
    sections: [
      {
        heading: "What it means",
        body: [
          "USCIS moves cases between offices, often to balance workload or because another office handles the next step, such as an interview. Your receipt number stays the same, even though its first three letters name the office that first received the case.",
          "A transfer is not a decision and does not mean something is wrong with your case.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Keep the transfer notice (Form I-797C) with your records. It names the new office.",
            "Use the new office when you look up the official processing time for your form.",
            "Send anything USCIS asks for to the address on the newest notice.",
          ],
          ADDRESS_LINE,
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "The new office continues from where the case was. The next change is usually an interview notice, a request for evidence or a decision.",
        ],
      },
    ],
    faq: [
      {
        q: "Does a transfer make my case slower?",
        a: "Not necessarily. USCIS publishes a different processing time for each office, so compare your case with the time for the new office.",
      },
      {
        q: "Does my receipt number change after a transfer?",
        a: "No. You keep the same receipt number for the whole case.",
      },
    ],
    sources: [SRC.i797, SRC.processingTimes, SRC.caseStatus],
    related: [R.times, R.receipt, R.i797, R.notChanged],
  },
  {
    name: "Case Was Approved",
    tone: "success",
    meaning: "Your case was approved. An approval notice is on its way.",
    covered: "/answers/uscis-case-approved-what-next",
  },
  {
    name: "New Card Is Being Produced",
    tone: "success",
    meaning: "Your card or document is being printed.",
    alsoShownAs: ["Card Is Being Produced"],
    seoTitle: "New Card Is Being Produced: How Long Until It's Mailed",
    description:
      "“New Card Is Being Produced” means USCIS approved your case and ordered your card to be printed. What comes next and how to make sure the card reaches you.",
    short:
      "“New Card Is Being Produced” means USCIS approved your case and sent your green card, work permit or travel document to be printed. The next status shows that the card was mailed, with a USPS tracking number.",
    sections: [
      {
        heading: "What it means",
        body: [
          "The decision is made and the card is in production. Cards are printed and mailed separately from the approval notice (Form I-797), so the two usually arrive on different days.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Check that the mailing address USCIS has for you is right. USCIS mails the card to the address on your application, or to your representative if you asked for that on Form G-28.",
            "Put your name on your mailbox, especially in a building with several units. USCIS recommends it.",
            "Sign in to your USCIS online account: it shows the USPS tracking number when the card is mailed.",
          ],
          "If you have moved, update your address with both USCIS and USPS as soon as you can. [How to change your address with USCIS](/answers/how-to-change-address-with-uscis).",
        ],
      },
      {
        heading: "How long it takes",
        body: [
          "For a work permit, USCIS says the card should be produced within 2 weeks of approval, and asks you to allow a total of 30 days from approval before you contact it about a card that hasn't arrived. USCIS doesn't publish a production time for other cards.",
        ],
      },
    ],
    faq: [
      {
        q: "How long after “New Card Is Being Produced” is the card mailed?",
        a: "For a work permit (EAD), USCIS says the card should be produced within 2 weeks of approval. For other cards USCIS doesn't publish a time. The status changes to “Card Was Mailed To Me” when it ships.",
      },
      {
        q: "Can I change my address while the card is being produced?",
        a: "Update your address with USCIS and USPS as soon as possible. USCIS warns that if you don't update it promptly, documents can get lost and you may need to reapply and pay the fee again.",
      },
    ],
    sources: [SRC.delivery, SRC.i765, SRC.address],
    related: [R.approved, R.address, R.i797, R.eadDelays],
  },
  {
    name: "Card Was Mailed To Me",
    tone: "success",
    meaning: "Your card is in the mail, often with a tracking number.",
    seoTitle: "Card Was Mailed To Me: Tracking Your USCIS Card",
    description:
      "“Card Was Mailed To Me” means USCIS sent your card by USPS Priority Mail. Where to find the tracking number and what to do if the card doesn't arrive.",
    short:
      "“Card Was Mailed To Me” means USCIS gave your card to the U.S. Postal Service. USCIS sends green cards, work permits and travel documents by USPS Priority Mail with delivery confirmation, and your USCIS online account shows the tracking number.",
    sections: [
      {
        heading: "What it means",
        body: [
          "The card has left USCIS and is on its way to the address on your application, or to your representative if you asked for that on Form G-28.",
        ],
      },
      {
        heading: "How to track it",
        body: [
          [
            "Sign in to your USCIS online account for the USPS tracking number. Without an account, Case Status Online shows whether the card was mailed.",
            "USCIS also suggests signing up for USPS Informed Delivery, which shows mail on its way to you and lets you set email or text alerts.",
          ],
        ],
      },
      {
        heading: "If the card doesn't arrive",
        body: CARD_MISSING,
      },
    ],
    faq: [
      {
        q: "Where is the tracking number for my USCIS card?",
        a: "In your USCIS online account. USCIS says the account gives you automatic updates, including the USPS tracking number when it mails your card or travel document.",
      },
      {
        q: "Tracking says delivered but I don't have my card. What should I do?",
        a: "Follow the steps on the USPS Find Missing Mail page straight away. If you still don't have it after contacting USPS, call the USCIS Contact Center or submit a case inquiry in the “did not receive card by mail” category.",
      },
    ],
    sources: [SRC.delivery, SRC.eRequest, SRC.contactCenter],
    related: [R.approved, R.address, R.delayed, R.eadDelays],
  },
  {
    name: "Card Was Picked Up By The United States Postal Service",
    tone: "success",
    meaning: "USPS has your card and is delivering it. Your USCIS online account shows the tracking number.",
    seoTitle: "Card Was Picked Up By The United States Postal Service",
    description:
      "“Card Was Picked Up By The United States Postal Service” means USPS has your card and delivery has started. How to track it and what to do if it goes missing.",
    short:
      "“Card Was Picked Up By The United States Postal Service” means USPS has collected your card from USCIS and delivery has started. Track it with the USPS tracking number in your USCIS online account.",
    sections: [
      {
        heading: "What it means",
        body: [
          "USCIS sends green cards, work permits and travel documents by USPS Priority Mail with delivery confirmation. This status confirms the handover to USPS. From here, USPS tracking is more current than the USCIS status.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Find the tracking number in your USCIS online account and follow it on the USPS website.",
            "Make sure your name is on your mailbox.",
            "Consider USPS Informed Delivery, which USCIS suggests for tracking and alerts.",
          ],
        ],
      },
      {
        heading: "If the card doesn't arrive",
        body: CARD_MISSING,
      },
    ],
    faq: [
      {
        q: "How long does delivery take after USPS picks up the card?",
        a: "USCIS doesn't give a delivery time. It uses USPS Priority Mail, so the USPS tracking page shows the expected delivery day.",
      },
      {
        q: "Can I pick the card up myself or redirect it?",
        a: "USCIS mails the card to the address on your application. USPS Informed Delivery lets you enter delivery instructions for your mail carrier.",
      },
    ],
    sources: [SRC.delivery, SRC.eRequest],
    related: [R.approved, R.address, R.delayed],
  },
  {
    name: "Card Was Delivered To Me By The Post Office",
    tone: "success",
    meaning: "USPS recorded your card as delivered to the address USCIS has for you.",
    seoTitle: "Card Was Delivered To Me By The Post Office: Not There?",
    description:
      "“Card Was Delivered To Me By The Post Office” means USPS recorded delivery of your card. What to check when it arrives and what to do if you can't find it.",
    short:
      "“Card Was Delivered To Me By The Post Office” means USPS recorded your card as delivered to the address USCIS has on file. If you don't have it, start the USPS missing-mail steps straight away.",
    sections: [
      {
        heading: "What it means",
        body: [
          "USCIS uses USPS Priority Mail with delivery confirmation so it can confirm that cards reach people. This status is that confirmation, taken from USPS tracking.",
        ],
      },
      {
        heading: "When the card arrives",
        body: [
          [
            "Check that your name, date of birth and the dates on the card are right.",
            "Keep the card somewhere safe, along with your approval notice.",
          ],
          "If something on the card is wrong, the USCIS Contact Center can tell you how to get it corrected: 800-375-5283.",
        ],
      },
      {
        heading: "If you don't have the card",
        body: CARD_MISSING,
      },
    ],
    faq: [
      {
        q: "USCIS says my card was delivered, but it isn't in my mailbox. What do I do?",
        a: "USCIS says to follow the steps on the USPS Find Missing Mail page as soon as you believe your mail is missing. If you still don't have the card after contacting USPS, call the USCIS Contact Center or submit a case inquiry in the “did not receive card by mail” category.",
      },
      {
        q: "Will I have to pay for a replacement?",
        a: "USCIS says it may be able to try a second delivery, and may reissue a document that was not delivered. It also warns that if your address was out of date, you may need to reapply and pay the fee again.",
      },
    ],
    sources: [SRC.delivery, SRC.eRequest, SRC.contactCenter],
    related: [R.approved, R.address, R.delayed],
  },
  {
    name: "Card Was Returned To USCIS",
    tone: "warning",
    meaning: "The post office couldn't deliver your card and sent it back. Contact USCIS and check your address.",
    alsoShownAs: ["Card Was Returned To USCIS Because The Post Office Could Not Deliver It"],
    seoTitle: "Card Was Returned To USCIS: How to Get Your Card",
    description:
      "“Card Was Returned To USCIS” means the post office couldn't deliver your card and sent it back. How to fix your address and ask USCIS to send it again.",
    short:
      "“Card Was Returned To USCIS” means the post office could not deliver your card and sent it back. Check the address USCIS has for you, update it if needed, then contact USCIS to ask for the card to be sent again.",
    sections: [
      {
        heading: "What it means",
        body: [
          "Your case is still approved. Only the delivery failed, which often comes down to the address USCIS has on file.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Check your mailing address in your USCIS online account and correct it if it is wrong. USCIS recommends writing it the way the USPS ZIP Code lookup formats it.",
            "If you have moved, update your address with USCIS and with USPS.",
            "Call the USCIS Contact Center at 800-375-5283, or submit a case inquiry through [USCIS e-Request](https://egov.uscis.gov/e-request/) in the “did not receive card by mail” or “did not receive document by mail” category.",
          ],
          "[How to change your address with USCIS](/answers/how-to-change-address-with-uscis).",
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "USCIS says it may be able to try a second delivery, and may reissue a document that wasn't delivered. It also warns that if you don't update your address promptly, documents can get lost and you may need to reapply and pay the fee again, so act quickly.",
        ],
      },
    ],
    faq: [
      {
        q: "Is my approval cancelled if the card was returned?",
        a: "No. The status is about delivery. Your case stays approved; you need USCIS to send the card again to the right address.",
      },
      {
        q: "How do I ask USCIS to mail the card again?",
        a: "Update your address first, then call the USCIS Contact Center at 800-375-5283 or submit an e-Request case inquiry in the “did not receive card by mail” category.",
      },
    ],
    sources: [SRC.delivery, SRC.address, SRC.eRequest, SRC.contactCenter],
    related: [R.address, R.delayed, R.approved],
  },
  {
    name: "Notice Was Returned To USCIS Because The Post Office Could Not Deliver It",
    tone: "warning",
    meaning: "A notice USCIS mailed to you came back. Fix your address and ask USCIS about the notice straight away.",
    seoTitle: "Notice Was Returned To USCIS: What to Do Now",
    description:
      "“Notice Was Returned To USCIS Because The Post Office Could Not Deliver It” means a notice came back undelivered. Fix your address and ask for the notice.",
    short:
      "“Notice Was Returned To USCIS Because The Post Office Could Not Deliver It” means a notice USCIS mailed you came back. Update your address and contact USCIS straight away, because the notice may carry a deadline or an appointment date.",
    sections: [
      {
        heading: "Why it matters",
        body: [
          "USCIS sends appointment notices, requests for evidence and decisions by mail. A request for evidence has a deadline that USCIS can't extend, and a missed appointment can lead USCIS to treat an application as abandoned. You need to find out what the returned notice was.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Check your address in your USCIS online account and correct it. You must report a new address within 10 days of moving.",
            "If you have an online account, look there for a copy of the notice.",
            "Submit a case inquiry through [USCIS e-Request](https://egov.uscis.gov/e-request/) in the “did not receive notice by mail” category, or call the USCIS Contact Center at 800-375-5283, and ask what the notice was.",
          ],
          "[How to change your address with USCIS](/answers/how-to-change-address-with-uscis).",
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "Once USCIS has the right address, ask it to send the notice again. If the notice had a deadline that is close or has passed, get legal help quickly. [Find an immigration lawyer](/lawyers).",
        ],
      },
    ],
    faq: [
      {
        q: "Can I track a USCIS notice in the mail?",
        a: "No. USCIS says its notices cannot be tracked through UPS or USPS. If a notice doesn't arrive, submit a case inquiry in the “did not receive notice by mail” category.",
      },
      {
        q: "Will USCIS deny my case because a notice was returned?",
        a: "Not because of the returned mail itself. The risk is missing what the notice asked for, such as an appointment or a deadline, so find out what it was as soon as you can.",
      },
    ],
    sources: [SRC.delivery, SRC.address, SRC.eRequest, SRC.rfe, SRC.biometrics],
    related: [R.address, R.delayed, R.rfe, R.lawyers],
  },
  {
    name: "Oath Ceremony Notice Was Mailed",
    tone: "success",
    meaning: "Your citizenship application was approved and USCIS mailed the date and place of your oath ceremony.",
    seoTitle: "Oath Ceremony Notice Was Mailed: The Last N-400 Step",
    description:
      "“Oath Ceremony Notice Was Mailed” means USCIS approved your N-400 and scheduled your naturalization ceremony. You become a citizen when you take the oath.",
    short:
      "“Oath Ceremony Notice Was Mailed” means USCIS approved your Form N-400 and mailed a notice with the date, time and place of your naturalization ceremony. You become a U.S. citizen when you take the Oath of Allegiance there, not before.",
    sections: [
      {
        heading: "What it means",
        body: [
          "This is the last step of a citizenship case. The ceremony can sometimes take place on the same day as the interview; otherwise USCIS schedules it and mails the notice.",
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Read the notice when it arrives and follow what it says to bring.",
            "Bring your green card: USCIS collects it at the ceremony. You stay a permanent resident until you take the oath.",
            "If you can't attend, follow the instructions on the notice to ask for a new date.",
          ],
        ],
      },
      {
        heading: "What usually comes next",
        body: [
          "At the ceremony you turn in your green card, take the Oath of Allegiance and receive your Certificate of Naturalization. USCIS asks you to review the certificate and report any errors before you leave the ceremony site.",
        ],
      },
    ],
    faq: [
      {
        q: "Am I a citizen once the oath ceremony notice is mailed?",
        a: "No. USCIS says you are not a U.S. citizen until you take the Oath of Allegiance at a naturalization ceremony.",
      },
      {
        q: "The status changed but I have no notice. What should I do?",
        a: "Check your USCIS online account. If the notice doesn't arrive, submit a case inquiry through USCIS e-Request in the “did not receive notice by mail” category or call the USCIS Contact Center at 800-375-5283.",
      },
    ],
    sources: [SRC.naturalization, { label: "USCIS: Form N-400, Application for Naturalization", href: "https://www.uscis.gov/n-400" }, SRC.delivery],
    related: [R.n400, { href: "/processing-times/n-400", title: "Form N-400 processing time" }, R.address],
  },
  {
    name: "Case Was Rejected",
    tone: "warning",
    meaning: "USCIS did not accept the filing, usually for a missing signature, wrong fee or old form edition. You can fix it and file again.",
    alsoShownAs: ["Case Was Rejected Because It Was Improperly Filed"],
    seoTitle: "Case Was Rejected by USCIS: Why, and How to Refile",
    description:
      "“Case Was Rejected” means USCIS did not accept your filing, often for a missing signature, wrong fee or old form edition. It isn't a denial. How to refile.",
    short:
      "“Case Was Rejected” means USCIS did not accept your filing for processing, so no case was opened. It is not a denial of your eligibility. The rejection notice says what was wrong, and you can correct it and file again.",
    sections: [
      {
        heading: "Rejected is not denied",
        body: [
          "A denial comes after an officer reviews a case. A rejection happens at intake, before any review, because the filing didn't meet a basic requirement. USCIS sends the package back with a notice (Form I-797C) explaining why.",
        ],
      },
      {
        heading: "Common reasons",
        body: [
          "USCIS lists these in its filing tips:",
          [
            "The form isn't signed, or the signature isn't valid.",
            "The fee is wrong or incomplete.",
            "Pages are missing, or pages come from different editions of the form.",
            "Required parts of the form are blank.",
            "The form was mailed to the wrong filing location.",
            "One payment covered several forms and one of them had a problem, so the whole package came back.",
          ],
        ],
      },
      {
        heading: "What to do now",
        body: [
          [
            "Read the rejection notice and fix exactly what it names.",
            "Download the current edition of the form from uscis.gov and check the fee on the [USCIS Fee Schedule](https://www.uscis.gov/g-1055).",
            "File again. USCIS recommends paying each form's fee separately, so one problem doesn't send the whole package back.",
          ],
          "If you were filing close to a deadline, refile quickly and consider legal help. [Find an immigration lawyer](/lawyers).",
        ],
      },
    ],
    faq: [
      {
        q: "Is a rejected case the same as a denied case?",
        a: "No. A rejection means USCIS didn't accept the filing, so no decision was made on your eligibility. You can correct the problem and file again.",
      },
      {
        q: "Why does USCIS reject applications?",
        a: "The most common reasons in USCIS's filing tips are a missing or invalid signature, an incorrect or incomplete fee, missing pages or mixed form editions, blank required fields and mailing to the wrong location.",
      },
    ],
    sources: [SRC.mailTips, SRC.i797, SRC.fees],
    related: [R.i797, { href: "/forms", title: "USCIS forms: fees, documents and steps" }, R.lawyers],
  },
  {
    name: "Case Was Denied",
    tone: "error",
    meaning: "The decision notice explains why and your options. Talk to an immigration attorney about next steps.",
    seoTitle: "Case Was Denied by USCIS: What You Can Do Next",
    description:
      "“Case Was Denied” means USCIS decided against your application. The denial notice gives the reasons and your options, and deadlines are usually 30 days.",
    short:
      "“Case Was Denied” means USCIS decided not to approve your application or petition. The denial notice explains the reasons and whether you can appeal or file a motion, and the deadline is usually 30 days from the date of the decision.",
    sections: [
      {
        heading: "What it means",
        body: [
          "An officer reviewed the case and found that it did not meet the requirements. The status doesn't say why. The written notice does, so wait for it or open it in your USCIS online account.",
        ],
      },
      {
        heading: "Your options",
        body: [
          [
            "An appeal asks a different authority to review the decision. Not every decision can be appealed: your notice says whether yours can. USCIS says a denied adjustment of status application (Form I-485) generally can't be appealed.",
            "A motion to reopen or a motion to reconsider asks the same office to look again. You can file a motion even when the decision can't be appealed.",
            "Filing again with a stronger application is sometimes possible too.",
          ],
          "Appeals and motions are filed on Form I-290B. For a denied petition, generally only the petitioner (for example the employer or the sponsoring relative) can file.",
        ],
      },
      {
        heading: "Deadlines are short",
        body: [
          "USCIS says an appeal must generally be filed within 30 days of the date of the decision, not the date you received it. A motion has the same 30 days, with 3 extra days if the decision was mailed. Some decisions have shorter deadlines, and your notice states yours.",
          "Filing an appeal doesn't delay the decision from taking effect. Because a denial can affect your status in the United States, speak to a licensed immigration attorney or a DOJ-accredited representative right away. [Find an immigration lawyer](/lawyers).",
        ],
      },
    ],
    faq: [
      {
        q: "How long do I have to appeal a USCIS denial?",
        a: "Generally 30 days from the date of the decision, not the date you received it. USCIS adds 3 days for a motion when the decision was mailed. Some decisions have shorter deadlines, and your notice states yours.",
      },
      {
        q: "Can I apply again after a denial?",
        a: "Often yes, but it depends on why the case was denied. Read the reasons in the denial notice and get advice from a licensed immigration attorney or accredited representative before you file again.",
      },
    ],
    sources: [SRC.appeals, SRC.i290b, SRC.adjustment],
    related: [R.lawyers, R.i797, R.rfe],
  },
];

/** The statuses that have a page of their own. */
export const STATUS_DETAIL_PAGES = STATUS_PAGES.filter((s) => !s.covered && s.short);

/** Where a status is explained in full: its own page, or the guide or answer that covers it. */
export const statusHref = (s: Pick<StatusPage, "name" | "covered">) => s.covered ?? `/status-explained/${statusId(s.name)}`;

export const getStatusPage = (slug: string) => STATUS_DETAIL_PAGES.find((s) => statusId(s.name) === slug);
