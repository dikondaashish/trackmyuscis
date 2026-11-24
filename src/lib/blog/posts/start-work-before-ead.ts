/**
 * Facts checked 2026-11-24: USCIS OPT and STEM OPT pages, SEVP OPT guidance, and the December 18, 2024
 * H-1B modernization rule's cap-gap change as described in the October 8, 2026 proposed rule
 * (see opt-sources.ts).
 */
import cover from "@/assets/blog/start-work-before-ead.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const startWorkBeforeEad: BlogPost = {
  slug: "start-work-before-ead",
  title: "Can you start work before your OPT EAD arrives?",
  seoTitle: "Can You Work Before Your OPT EAD Card Arrives?",
  description:
    "For initial OPT, no: you need the approved card in hand and its start date reached. When the rule bends (STEM OPT, cap-gap) and how to time your start.",
  topic: "Students & OPT",
  published: "2026-11-10",
  author: "kiran",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A young man in office clothes waits on a bench outside an office door, checking his phone as an envelope with a card approaches",
  },
  answer:
    "Not for your first OPT. USCIS says you may not begin pre- or post-completion OPT until it approves your Form I-765 and you receive your work permit (EAD), and SEVP adds that you can't start before the start date printed on it. Approval alone isn't enough: you need the card. The exceptions are a timely STEM OPT extension, which lets you keep working up to 180 days after your OPT card expires, and the cap-gap extension for students with an H-1B petition.",
  takeaways: [
    "Initial OPT: no work until USCIS approves your I-765 and you have the EAD in hand.",
    "Even with the card, you can't start before the start date printed on it.",
    "A timely STEM OPT extension lets you keep working for up to 180 days after your OPT expires.",
    "Cap-gap can extend your F-1 status and work permission while an H-1B petition is pending, up to April 1 of the H-1B fiscal year.",
    "USCIS warns that working without authorization can lead to removal and bars on returning to the U.S., so wait for the card.",
  ],
  sections: [
    {
      id: "rule",
      heading: "The rule for initial OPT",
      blocks: [
        [
          "**USCIS:** “You may not begin your pre- or post-completion OPT until after we approve your Form I-765 and you receive your Employment Authorization Document (EAD).”",
          "**SEVP:** you must not begin working before the start date on the EAD.",
        ],
        "So there are three conditions, and you need all three: an approved application, the physical card, and the start date reached.",
        {
          kind: "callout",
          tone: "warning",
          title: "Approved isn't the same as authorized",
          text: "Seeing “Case Was Approved” online doesn't let you start. USCIS says the card is usually produced within two weeks of approval and then mailed, so allow for that in your start date.",
        },
      ],
    },
    {
      id: "exceptions",
      heading: "When you can keep working without a new card",
      blocks: [
        {
          kind: "table",
          caption: "Exceptions",
          head: ["Situation", "What it allows", "Conditions"],
          rows: [
            ["STEM OPT extension pending", "Keep working up to 180 days after your OPT card expires", "Filed on time, before your OPT expired. Ends when USCIS decides"],
            ["Cap-gap", "F-1 status and work permission continue past your OPT end date", "A timely filed H-1B petition with a change of status. Lasts until April 1 of the H-1B fiscal year or the H-1B start date, whichever comes first"],
          ],
          note: "Sources: USCIS [STEM OPT page](https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt); cap-gap changes in the [December 18, 2024 final rule](https://www.federalregister.gov/documents/2024/12/18/2024-29354/modernizing-h-1b-requirements-providing-flexibility-in-the-f-1-program-and-program-improvements).",
        },
        "Neither exception applies to a first OPT application. They only extend permission you already have.",
      ],
    },
    {
      id: "timing",
      heading: "How to time your start date",
      blocks: [
        [
          "**File early.** USCIS's processing time for OPT is 6 months for 80% of cases (checked November 24, 2026). See [OPT processing time in 2026](/blog/opt-processing-time-2026).",
          "**Choose a realistic start date.** For post-completion OPT it must be within 60 days after your program end date. If your card arrives after it, that's lost time, and SEVIS counts unemployment from the start date.",
          "**Consider premium processing** if a job offer has a fixed start date. It costs $1,780 and USCIS must act within 30 business days. See [OPT premium processing](/blog/opt-premium-processing-2026).",
          "**Tell your employer** the earliest realistic date, and that onboarding has to wait for the card.",
        ],
      ],
    },
    {
      id: "what-you-can-do",
      heading: "What you can do while you wait",
      blocks: [
        [
          "Sign your offer letter and plan your start date.",
          "Complete paperwork your employer sends that doesn't involve doing the job.",
          "Keep your address up to date with USCIS so the card reaches you.",
        ],
        "When in doubt about whether an activity counts as work, ask your DSO before you do it.",
      ],
    },
  ],
  faq: [
    {
      q: "Can I start working once my OPT is approved online?",
      a: "No. USCIS says you can't begin OPT until it approves your I-765 and you receive your EAD. You also can't start before the start date on the card.",
    },
    {
      q: "Can I work while my first OPT application is pending?",
      a: "No. Only extensions of existing permission, such as a timely STEM OPT extension or cap-gap, allow work while a case is pending.",
    },
    {
      q: "How long after approval does the EAD card arrive?",
      a: "USCIS says the card is usually produced within two weeks of approval and mailed by USPS. It asks you to allow 30 days from approval before contacting it.",
    },
    {
      q: "Can I keep working while my STEM OPT extension is pending?",
      a: "Yes, for up to 180 days after your OPT card expires, if you filed before it expired. The extension ends when USCIS decides your application.",
    },
    {
      q: "What is cap-gap?",
      a: "If an employer timely files an H-1B petition with a change of status for you, cap-gap can extend your F-1 status and work permission until April 1 of the H-1B fiscal year or the H-1B start date, whichever is earlier.",
    },
  ],
  sources: [OPT_SRC.opt, OPT_SRC.sevpOpt, OPT_SRC.stem, OPT_SRC.h1bModernization, OPT_SRC.premium, OPT_SRC.times],
  links: [
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/blog/stem-opt-extension-2026", label: "STEM OPT extension in 2026" },
    { href: "/blog/opt-premium-processing-2026", label: "OPT premium processing in 2026" },
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
  ],
};
