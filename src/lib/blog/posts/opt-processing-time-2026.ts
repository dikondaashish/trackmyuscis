/**
 * Facts checked 2026-11-24 (see opt-sources.ts). The processing time is read from the USCIS tool:
 * Form I-765, category (c)(3), Service Center Operations. Recheck it monthly and bump `updated`.
 */
import cover from "@/assets/blog/opt-processing-time-2026.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const optProcessingTime2026: BlogPost = {
  slug: "opt-processing-time-2026",
  title: "OPT processing time in 2026: how long the EAD takes and how to plan for it",
  seoTitle: "OPT Processing Time 2026: How Long the EAD Takes",
  description:
    "USCIS says 80% of OPT work permit applications finish within 6 months. See when to file, the $1,780 premium option, card delivery and what to do while you wait.",
  topic: "Students & OPT",
  published: "2026-11-22",
  author: "karthik",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A graduate in a gown holds a blank work permit card beside an hourglass, a calendar of months and a laptop progress bar",
  },
  answer:
    "USCIS's official processing time for OPT work permits (Form I-765, category (c)(3)) is 6 months. That's how long it took USCIS to finish 80% of these cases over the past six months, as shown on November 24, 2026. If you can't wait, premium processing costs $1,780 and gets action (an approval, denial or request for evidence) within 30 business days. After approval, USCIS says the card is usually produced within two weeks and then mailed.",
  takeaways: [
    "USCIS's processing time for F-1 student work permits, category (c)(3), is 6 months for 80% of cases (checked November 24, 2026).",
    "For post-completion OPT you can file up to 90 days before your program end date, and no later than 60 days after it. You must also file within 30 days of your school's recommendation.",
    "You can't start working until USCIS approves your application, you have the card, and its start date has arrived.",
    "Premium processing costs $1,780 (up from $1,685 on March 1, 2026) and gets action (an approval, denial or request for evidence) within 30 business days. You can add it after filing.",
    "The filing fee is $470 online or $520 on paper.",
  ],
  sections: [
    {
      id: "official-time",
      heading: "How long OPT takes right now",
      blocks: [
        "USCIS publishes one processing time for every Form I-765 filed by an F-1 student, category (c)(3). It covers pre-completion OPT, post-completion OPT and the STEM OPT extension.",
        {
          kind: "table",
          caption: "Official processing time, Form I-765 for F-1 students",
          head: ["Category", "What it covers", "80% of cases finished within"],
          rows: [["(c)(3)", "Pre-completion OPT, post-completion OPT and STEM OPT", "6 months"]],
          note: "From USCIS's [processing times tool](https://egov.uscis.gov/processing-times/), Service Center Operations, checked November 24, 2026.",
        },
        "The number isn't a promise. USCIS works out how long it took to finish 80% of decided cases over the past six months, so 1 in 5 cases took longer. USCIS says it generally handles cases in the order it receives them.",
        {
          kind: "callout",
          tone: "info",
          title: "The number changes every month",
          text: "USCIS updates processing times regularly. We recheck this page and change the date at the top when the official number moves.",
        },
      ],
    },
    {
      id: "timeline",
      heading: "From school recommendation to card in hand",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Your school recommends OPT",
              text: "Your designated school official (DSO) enters the recommendation in SEVIS and gives you an updated Form I-20.",
            },
            {
              title: "You file Form I-765 within 30 days",
              text: "File online or on paper with the fee and documents the form instructions list. USCIS requires this 30-day deadline for post-completion OPT, so don't let it slip.",
            },
            {
              title: "USCIS sends a receipt notice",
              text: "Your I-797C receipt notice has your 13-character receipt number. Online filings start with IOE. See [what a receipt number is](/answers/what-is-a-uscis-receipt-number).",
            },
            {
              title: "USCIS decides",
              text: "Most cases fall within the official processing time. USCIS may send a request for evidence first, which adds time.",
            },
            {
              title: "Your card is made and mailed",
              text: "USCIS says the card is usually produced within two weeks of approval and sent by USPS. It asks you to allow 30 days from approval before contacting it about the card.",
            },
          ],
        },
      ],
    },
    {
      id: "when-to-file",
      heading: "When to file, so the wait hurts less",
      blocks: [
        "The filing windows are set by USCIS. The earlier you file within them, the sooner your card is likely to arrive.",
        {
          kind: "table",
          caption: "OPT filing windows",
          head: ["Type", "Earliest", "Latest"],
          rows: [
            ["Pre-completion OPT", "90 days before you complete a full academic year", "Ask your DSO; work can't start before that year is complete"],
            ["Post-completion OPT", "90 days before your program end date", "60 days after your program end date, and within 30 days of your DSO's recommendation"],
            ["STEM OPT extension", "90 days before your current OPT ends", "Before your OPT ends, and within 60 days of your DSO's recommendation"],
          ],
          note: "Source: USCIS, [Optional Practical Training for F-1 students](https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students).",
        },
        "Here's the math to plan around: if you file the full 90 days before your program ends and your case takes the official 6 months, you'd get a decision about 3 months after graduation. Choosing a start date that leaves room for that wait means fewer unemployment days later.",
      ],
    },
    {
      id: "speed-up",
      heading: "Ways to get it faster",
      blocks: [
        [
          "**Premium processing:** $1,780 on top of the filing fee. USCIS must take action within 30 business days or refund the premium fee. You can request it when you file or later, online or by mail. Our [OPT premium processing guide](/blog/opt-premium-processing-2026) covers how.",
          "**File online:** the fee is $470 online versus $520 on paper, and you can follow your case and message USCIS in your account.",
          "**Avoid rejections and requests for evidence:** use the current edition of Form I-765 (08/21/25; USCIS isn't accepting the 09/15/26 edition), include the correct fee, and send photos that aren't edited or retouched. USCIS warns retouched photos delay cases.",
        ],
      ],
    },
    {
      id: "while-waiting",
      heading: "While you wait: what you can and can't do",
      blocks: [
        [
          "**You can't start work early.** USCIS says you may not begin OPT until it approves your Form I-765 and you receive your card. The start date on the card has to have arrived too.",
          "**Your unemployment days are tied to your OPT start date.** SEVIS counts unemployment from your actual OPT start date. If your card arrives after your start date, talk to your DSO about how to report it. Our [90-day unemployment rule guide](/blog/opt-unemployment-90-days) explains the count.",
          "**Keep your address current.** If you move, update it with USCIS and USPS so the card reaches you. See [how to change your address with USCIS](/answers/how-to-change-address-with-uscis).",
          "**Ask your DSO before traveling.** Leaving the U.S. while your OPT is pending or before you've started work has its own rules, and your DSO can check your situation.",
        ],
      ],
    },
    {
      id: "check-status",
      heading: "How to check your OPT status",
      blocks: [
        "Enter your receipt number in USCIS Case Status Online, or sign in to your USCIS account if you filed online. Once the card is mailed, Case Status Online shows a USPS tracking number. See [how to check your USCIS case status](/answers/how-to-check-uscis-case-status).",
        "If your case is past the official processing time, USCIS lets you submit an online inquiry. See [what to do about a delayed case](/answers/contact-uscis-about-delayed-case).",
      ],
    },
    {
      id: "changes-2026",
      heading: "2026 changes OPT students should know",
      blocks: [
        [
          "**Premium processing went up** from $1,685 to $1,780 on March 1, 2026.",
          "**The fixed-admission-period rule is on hold.** A final rule from July 17, 2026 would have replaced “duration of status” for F-1 students with a fixed admission period and a new extension step for post-completion OPT. On September 14, 2026 a federal court in Massachusetts postponed it, and USCIS says it's following the previous rules until further notice.",
          "**A $70,000 OPT fee has been proposed, not adopted.** DHS proposed on October 8, 2026 that schools pay $70,000 for a student's first OPT and $30,000 for any later OPT. It isn't in effect. See [what the proposed OPT fee would mean](/blog/proposed-opt-fee-2026).",
          "**Automatic extensions for renewal work permits ended** with a final rule on October 14, 2026. That rule covers renewal applications in certain categories and doesn't mention OPT or STEM OPT.",
        ],
      ],
    },
  ],
  faq: [
    {
      q: "How long does OPT take in 2026?",
      a: "USCIS's processing time for F-1 student work permits, category (c)(3), is 6 months for 80% of cases, as shown on November 24, 2026. Premium processing gets action (an approval, denial or request for evidence) within 30 business days.",
    },
    {
      q: "Is the processing time the same for STEM OPT?",
      a: "Yes. USCIS publishes one number for category (c)(3), which covers pre-completion OPT, post-completion OPT and the STEM OPT extension.",
    },
    {
      q: "Can I work while my OPT application is pending?",
      a: "Not on initial OPT. You can start only after approval, once you have your card and its start date has arrived. A timely STEM OPT extension is different: it lets you keep working for up to 180 days after your OPT card expires.",
    },
    {
      q: "How much does it cost to apply for OPT?",
      a: "$470 if you file Form I-765 online or $520 on paper. Premium processing is an extra $1,780 if you want it.",
    },
    {
      q: "When will my EAD card arrive after approval?",
      a: "USCIS says the card is usually produced within two weeks of approval and mailed by USPS. It asks you to allow 30 days from approval before contacting it.",
    },
    {
      q: "My OPT is taking longer than 6 months. What can I do?",
      a: "Once your case is outside the official processing time, you can submit an online case inquiry. You can also add premium processing to a pending OPT application.",
    },
    {
      q: "Did OPT rules change in 2026?",
      a: "The premium fee rose to $1,780. A rule ending duration of status for students was postponed by a court on September 14, 2026, and a $70,000 OPT fee was proposed but not adopted.",
    },
  ],
  sources: [OPT_SRC.times, OPT_SRC.opt, OPT_SRC.i765, OPT_SRC.fees, OPT_SRC.premium, OPT_SRC.premiumFeeAlert, OPT_SRC.sevpOpt, OPT_SRC.fixedAdmissionRule, OPT_SRC.feeProposal],
  links: [
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
    { href: "/blog/stem-opt-extension-2026", label: "STEM OPT extension in 2026: eligibility and the 180-day rule" },
    { href: "/blog/opt-premium-processing-2026", label: "OPT premium processing: the $1,780 fee and timeline" },
    { href: "/answers/how-to-check-uscis-case-status", label: "How to check your USCIS case status" },
  ],
};
