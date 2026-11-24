/**
 * Facts checked 2026-11-24 against the proposed rule "Optional Practical Training Fees"
 * (Federal Register, October 8, 2026, Docket ICEB-2026-0100) and the USCIS fee calculator.
 * When DHS publishes a final rule (or withdraws the proposal), rewrite the status section,
 * `answer`, `takeaways` and FAQ, and bump `updated`.
 */
import cover from "@/assets/blog/proposed-opt-fee-2026.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const proposedOptFee2026: BlogPost = {
  slug: "proposed-opt-fee-2026",
  title: "The proposed $70,000 OPT fee: what it says and what it means for you now",
  seoTitle: "Proposed $70,000 OPT Fee Explained (Not in Effect)",
  description:
    "DHS proposed a $70,000 fee for a student's first OPT and $30,000 for later OPT, paid by schools. It isn't in effect. What the proposal says and what to do now.",
  topic: "Students & OPT",
  published: "2026-11-24",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A graduation cap and a large blank price tag sit on a balance scale in front of a university building, beside a pending document",
  },
  answer:
    "On October 8, 2026, the Department of Homeland Security proposed new OPT fees: $70,000 for a student's first OPT and $30,000 for any later OPT, such as the STEM extension. The proposal says schools, not students, would pay them. It's only a proposal. The comment period closed on November 9, 2026, and no OPT fee is in effect today, so OPT still costs the regular $470 or $520 to apply.",
  takeaways: [
    "Proposed, not final: there's no $70,000 or $30,000 OPT fee today.",
    "The fee would be paid by the SEVP-certified school that recommends the OPT, per student.",
    "$70,000 would apply to a student's first OPT of any kind. $30,000 would apply to each later OPT, including STEM OPT.",
    "If adopted, it would start 60 days after a final rule is published, for school recommendations dated on or after that day.",
    "Applying for OPT still costs $470 online or $520 on paper, plus $1,780 if you choose premium processing.",
  ],
  sections: [
    {
      id: "status",
      heading: "Where the proposal stands",
      blocks: [
        {
          kind: "table",
          caption: "Timeline of the OPT fee proposal",
          head: ["Date", "What happened"],
          rows: [
            ["October 8, 2026", "DHS published the proposed rule in the Federal Register (Docket ICEB-2026-0100)"],
            ["November 9, 2026", "Public comment period closed"],
            ["December 7, 2026", "Comment period on the related paperwork changes closes"],
            ["Not yet", "Final rule. DHS has to review comments before it can publish one"],
          ],
          note: "Source: [Federal Register, Optional Practical Training Fees](https://www.federalregister.gov/documents/2026/10/08/2026-20660/optional-practical-training-fees).",
        },
        {
          kind: "callout",
          tone: "info",
          title: "Nothing changes for you today",
          text: "A proposed rule has no legal effect. Until DHS publishes a final rule, OPT works the way it does now, and USCIS's fee calculator lists no OPT fee beyond the regular application fee (checked November 24, 2026).",
        },
      ],
    },
    {
      id: "what-it-says",
      heading: "What the proposal would do",
      blocks: [
        {
          kind: "table",
          caption: "Proposed OPT fees",
          head: ["Fee", "Amount", "When it would apply"],
          rows: [
            ["Initial OPT fee", "$70,000", "The first time a student is recommended for any OPT, pre-completion or post-completion"],
            ["Subsequent OPT fee", "$30,000", "Each later OPT recommendation for a student whose initial fee was paid, such as a STEM extension"],
          ],
        },
        [
          "**Who pays:** the proposal puts the fee on the SEVP-certified school that recommends the student for OPT, per student.",
          "**When it would start:** 60 days after a final rule is published. It would apply to DSO recommendations dated on or after that date.",
          "**Why, according to DHS:** to fight fraud, strengthen oversight of the program and protect U.S. workers.",
        ],
      ],
    },
    {
      id: "numbers",
      heading: "The numbers in the proposal",
      blocks: [
        "DHS's own analysis gives a sense of the scale:",
        [
          "**194,554** F-1 students were granted OPT work permits and reported working for an employer in 2024, up from **160,627** in 2023.",
          "About **56%** of OPT participants from 2021 to 2024 went on to a STEM OPT extension the next year.",
          "DHS estimates the yearly cost of the rule at between **$32 million and $8.2 billion**, with a primary estimate of **$4.1 billion**.",
        ],
        "The wide range reflects DHS's uncertainty about how schools would respond. Its analysis includes scenarios where schools pay for every student and scenarios where they pay only for some, for example only students who are eligible for STEM OPT.",
      ],
    },
    {
      id: "what-to-do",
      heading: "What students should do now",
      blocks: [
        [
          "**Don't delay your OPT plans because of the proposal.** If you're eligible now, the current rules and fees apply.",
          "**Ask your DSO** whether your school has shared any guidance on it, since schools would carry the cost.",
          "**Watch for a final rule.** If DHS publishes one, it would take effect 60 days later, and only for recommendations dated from then.",
          "**Check sources carefully.** Social posts often describe proposals as if they're already law. The Federal Register and uscis.gov are the places to confirm.",
        ],
      ],
    },
    {
      id: "other-2026",
      heading: "Other 2026 rules students are asking about",
      blocks: [
        [
          "**Fixed admission periods for students (on hold):** a final rule of July 17, 2026 would replace “duration of status” with fixed admission periods. A federal court in Massachusetts postponed it on September 14, 2026, and USCIS says it's following the previous rules.",
          "**Premium processing for OPT** rose to $1,780 on March 1, 2026. See [OPT premium processing in 2026](/blog/opt-premium-processing-2026).",
          "**Processing time:** USCIS shows 6 months for 80% of OPT applications. See [OPT processing time in 2026](/blog/opt-processing-time-2026).",
        ],
      ],
    },
  ],
  faq: [
    {
      q: "Is the $70,000 OPT fee in effect?",
      a: "No. It's a proposed rule from October 8, 2026. There's no OPT fee beyond the regular application fee until DHS publishes a final rule and it takes effect.",
    },
    {
      q: "Would students pay the $70,000 OPT fee?",
      a: "The proposal puts the fee on the SEVP-certified school that recommends the student for OPT, not on the student.",
    },
    {
      q: "Would the fee apply to STEM OPT?",
      a: "STEM OPT would count as a later OPT, so the proposal's $30,000 subsequent fee would apply, after the $70,000 initial fee.",
    },
    {
      q: "When would the OPT fee start?",
      a: "If DHS adopts it, 60 days after the final rule is published, for DSO recommendations dated on or after that date.",
    },
    {
      q: "Can I still comment on the OPT fee proposal?",
      a: "The main comment period closed on November 9, 2026. Comments on the related paperwork changes are open until December 7, 2026.",
    },
    {
      q: "How much does OPT cost right now?",
      a: "$470 to file Form I-765 online or $520 on paper. Premium processing is optional at $1,780.",
    },
  ],
  sources: [OPT_SRC.feeProposal, OPT_SRC.fees, OPT_SRC.i765, OPT_SRC.fixedAdmissionRule, OPT_SRC.premiumFeeAlert],
  links: [
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/blog/stem-opt-extension-2026", label: "STEM OPT extension in 2026" },
    { href: "/blog/opt-premium-processing-2026", label: "OPT premium processing in 2026" },
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
  ],
};
