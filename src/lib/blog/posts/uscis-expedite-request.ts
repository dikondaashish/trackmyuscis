/**
 * Facts checked 2026-11-28 against USCIS's Expedite Requests page (updated 09/08/2026), Contact Center
 * page (updated 10/13/2026) and premium processing page (updated 11/10/2026). The expedite page gives
 * no timeframe for a decision on the request and mentions no appeal, so the post says so.
 * Demand: "uscis expedite request" 1K–10K a month (Keyword Planner, US).
 */
import cover from "@/assets/blog/uscis-expedite-request.jpg";
import type { BlogPost } from "../types";

const SRC = {
  expedite: { label: "USCIS: Expedite requests", href: "https://www.uscis.gov/forms/filing-guidance/expedite-requests" },
  contactCenter: { label: "USCIS: Contact Center", href: "https://www.uscis.gov/contactcenter" },
  premium: {
    label: "USCIS: How do I request premium processing?",
    href: "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",
  },
  times: { label: "USCIS: Check case processing times", href: "https://egov.uscis.gov/processing-times/" },
};

export const uscisExpediteRequest: BlogPost = {
  slug: "uscis-expedite-request",
  title: "USCIS expedite request: who qualifies, how to ask and what to send",
  seoTitle: "USCIS Expedite Request: Criteria and How to Ask",
  description:
    "USCIS can move a case ahead for severe financial loss, emergencies, nonprofits, government interests or its own error. How to ask, what evidence to send and the limits.",
  topic: "Case status",
  published: "2026-11-28",
  author: "karthik",
  updated: "2026-11-28",
  cover: {
    src: cover,
    alt: "A woman places a letter and supporting papers into an amber folder at her desk, beside a clock and a laptop showing a row of blocks with one moving ahead",
  },
  answer:
    "An expedite request asks USCIS to take your case out of order because of severe financial loss, an emergency or urgent humanitarian situation, a nonprofit's work, a government interest or a clear USCIS error. You ask through the USCIS Contact Center, Emma or a secure message in your online account, and you back it up with evidence. USCIS decides case by case, and it won't consider expedites for forms that have premium processing.",
  takeaways: [
    "There are five grounds: severe financial loss, emergencies or urgent humanitarian situations, nonprofit organizations, government interests and clear USCIS error.",
    "Needing a work permit, on its own, is not enough. USCIS wants evidence of other compelling factors.",
    "Ask by calling 800-375-5283, asking Emma, or sending a secure message with \"expedite\" as the reason.",
    "If a form offers premium processing, USCIS won't consider an expedite request for it.",
    "An expedite decision isn't an approval of your case. It only decides whether your case is handled sooner.",
  ],
  sections: [
    {
      id: "criteria",
      heading: "The five grounds USCIS accepts",
      blocks: [
        {
          kind: "table",
          caption: "USCIS expedite criteria",
          head: ["Ground", "What USCIS looks for"],
          rows: [
            ["Severe financial loss to a company or person", "A company at risk of failing, losing a critical contract or laying off staff. For a person, job loss may be enough, depending on the circumstances."],
            ["Emergencies or urgent humanitarian situations", "A pressing situation tied to human welfare, such as illness, disability, a death in the family or extreme living conditions."],
            ["Nonprofit organization", "An IRS-designated nonprofit whose request furthers the cultural or social interests of the United States."],
            ["Government interests", "A case a federal, state, tribal, territorial or local government agency identifies as urgent. The request must come from someone authorized to speak for the agency."],
            ["Clear USCIS error", "A mistake USCIS made that urgently needs fixing, for example a work permit printed with wrong information that stops you working."],
          ],
          note: "Source: USCIS, [Expedite requests](https://www.uscis.gov/forms/filing-guidance/expedite-requests), checked November 28, 2026.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "A work permit alone doesn't qualify",
          text: "USCIS says the need to obtain employment authorization, standing alone, without evidence of other compelling factors, does not warrant expedited treatment. Show what happens if you can't work: the job you'd lose, the bills, the people who depend on you.",
        },
      ],
    },
    {
      id: "travel",
      heading: "Expedites for travel documents",
      blocks: [
        "For a travel document (Form I-131), USCIS treats some travel needs as emergencies:",
        [
          "**Unplanned events,** such as a funeral, can qualify.",
          "**Planned events** may qualify if processing times mean the document can't arrive before your departure date.",
          "**A vacation alone doesn't qualify.**",
        ],
        "USCIS gives an example of a request that fits: someone who filed five months ago and must travel within 45 days for a commitment.",
      ],
    },
    {
      id: "how-to-ask",
      heading: "How to ask for an expedite",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Wait for your receipt notice",
              text: "USCIS says you generally make the request after you have a receipt notice, and you'll need the receipt number.",
            },
            {
              title: "Clear anything pending on your case",
              text: "Check your status first. If USCIS is waiting on biometrics or evidence from you, do that before you ask.",
            },
            {
              title: "Make the request",
              text: "Call the Contact Center at 800-375-5283 or ask Emma on uscis.gov. If your online account has secure messaging, send a message and choose \"expedite\" as the reason. See [how to reach a live person at USCIS](/blog/uscis-phone-number-live-person).",
            },
            {
              title: "Send your evidence",
              text: "Upload it to your online account as well as calling. If USCIS gets a request without evidence, it says it will send instructions for submitting it.",
            },
            {
              title: "Ask once",
              text: "USCIS asks you to make only one expedite request.",
            },
          ],
        },
      ],
    },
    {
      id: "evidence",
      heading: "What evidence helps",
      blocks: [
        "USCIS says you generally need to justify the request with evidence. Match the papers to your ground:",
        [
          "**Financial loss:** a letter from your employer on letterhead about the job at risk, a job offer with a start date, layoff or contract documents, bills or notices that show the harm.",
          "**Medical or family emergency:** a letter from a doctor, or from a funeral home for a death in the family.",
          "**Travel:** proof of the event and its date, and when you filed.",
          "**USCIS error:** the document with the mistake and proof of the correct information.",
        ],
        "Keep it short and specific. Say what will happen, on what date, and why waiting for normal processing won't work.",
      ],
    },
    {
      id: "limits",
      heading: "The limits you should know",
      blocks: [
        [
          "**Premium processing comes first.** USCIS says it won't consider expedite requests for petitions and applications where premium processing is available. The only exception is for certain IRS-designated nonprofits. If your form has it, see [what premium processing is](/answers/what-is-uscis-premium-processing).",
          "**It's discretionary.** USCIS decides each request on its facts and says it generally doesn't explain its expedite decisions.",
          "**It isn't a decision on your case.** A granted expedite only moves your case up. It can still be approved, denied or get a request for evidence.",
          "**No timeline is promised.** USCIS doesn't publish how long it takes to answer an expedite request.",
        ],
        "Some cases follow different routes. Humanitarian parole requests from outside the U.S. go in with the Form I-131 filing, cases at the State Department follow its procedures, and asylum, T and U visa and appeal cases have their own steps listed on USCIS's page.",
      ],
    },
    {
      id: "if-not",
      heading: "If you don't qualify or the request is refused",
      blocks: [
        [
          "**Check the posted processing time.** Once your case is older than it, you can send a case inquiry. See [what to do about a delayed case](/answers/contact-uscis-about-delayed-case) and [processing times by form](/processing-times).",
          "**Use premium processing if your form has it.** It's the only route with a guaranteed timeframe.",
          "**Keep watching your status.** [Track your case](/#track) in a free TrackMyUSCIS account so you see a request for evidence or a decision as soon as your status changes, and know what it means.",
          "**Get advice for urgent situations.** A licensed immigration attorney can tell you whether other options fit. [Find an immigration lawyer](/lawyers).",
        ],
      ],
    },
  ],
  faq: [
    {
      q: "How do I request an expedite from USCIS?",
      a: "Call the USCIS Contact Center at 800-375-5283 or ask Emma on uscis.gov. If your online account has secure messaging, choose \"expedite\" as the reason. Have your receipt number and upload evidence that supports the request.",
    },
    {
      q: "What qualifies for a USCIS expedite?",
      a: "Severe financial loss to a company or person, emergencies or urgent humanitarian situations, a nonprofit organization's work, government interests, or a clear USCIS error.",
    },
    {
      q: "Can I expedite my work permit because I need to work?",
      a: "Not on that reason alone. USCIS says needing employment authorization, without evidence of other compelling factors, doesn't warrant an expedite. Job loss with evidence may count as severe financial loss.",
    },
    {
      q: "How long does USCIS take to answer an expedite request?",
      a: "USCIS doesn't publish a timeframe. It says it generally responds to requests made through the Contact Center but doesn't explain its decisions.",
    },
    {
      q: "Can I expedite a case that has premium processing?",
      a: "No. USCIS says it won't consider expedite requests where premium processing is available, except for certain IRS-designated nonprofits.",
    },
    {
      q: "Does an approved expedite mean my case is approved?",
      a: "No. It only means USCIS will handle your case sooner. The case itself can still be approved, denied or receive a request for evidence.",
    },
  ],
  sources: [SRC.expedite, SRC.contactCenter, SRC.premium, SRC.times],
  links: [
    { href: "/blog/uscis-phone-number-live-person", label: "USCIS phone number: how to reach a live person" },
    { href: "/answers/contact-uscis-about-delayed-case", label: "What to do about a delayed USCIS case" },
    { href: "/answers/what-is-uscis-premium-processing", label: "What is USCIS premium processing?" },
    { href: "/processing-times", label: "USCIS processing times by form and office" },
  ],
};
