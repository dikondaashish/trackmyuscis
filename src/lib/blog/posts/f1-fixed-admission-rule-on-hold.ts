/**
 * Facts checked 2026-11-24: the July 17, 2026 final rule (91 FR 44976) and its text in the eCFR, and the
 * USCIS I-765 page alert on the September 14, 2026 order in Presidents' Alliance on Higher Education
 * and Immigration v. DHS, 26-cv-13799 (D. Mass.). When the court or DHS acts, rewrite `answer`, the
 * status section and FAQ, and bump `updated`.
 */
import cover from "@/assets/blog/f1-fixed-admission-rule-on-hold.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const f1FixedAdmissionRuleOnHold: BlogPost = {
  slug: "f1-fixed-admission-rule-on-hold",
  title: "The F-1 “fixed admission” rule is on hold: what would change and what applies now",
  seoTitle: "F-1 Duration of Status Rule On Hold (2026 Update)",
  description:
    "DHS's 2026 rule ending duration of status for F-1 students was postponed by a court. What it would change, and which rules apply to students today.",
  topic: "Students & OPT",
  published: "2026-11-15",
  author: "surya",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A courthouse and a university joined by a bridge with a large pause symbol above it, students walking below",
  },
  answer:
    "A final rule published on July 17, 2026 would end “duration of status” for F-1 students and give them a fixed admission period of up to four years, with a new extension process. It was due to take effect on September 15, 2026, but on September 14 a federal court in Massachusetts postponed it and blocked DHS from implementing it. USCIS says it's following the previous rules until further notice, so duration of status, the 60-day grace period and the current OPT process still apply.",
  takeaways: [
    "The rule is postponed: a court order of September 14, 2026 stops DHS from implementing it for now.",
    "USCIS says it's following the previous rules and only accepts the 08/21/25 edition of Form I-765 and the 08/28/24 edition of Form I-539.",
    "If it takes effect later, students would be admitted for their program length, up to four years, instead of duration of status.",
    "It would also cut the post-program grace period from 60 days to 30 and add an extension step for post-completion OPT.",
    "Nothing changes for you today. Watch for news from the court or DHS before your next filing or trip.",
  ],
  sections: [
    {
      id: "status",
      heading: "Where things stand",
      blocks: [
        {
          kind: "table",
          caption: "Timeline",
          head: ["Date", "What happened"],
          rows: [
            ["August 28, 2025", "DHS proposed the rule"],
            ["July 17, 2026", "DHS published the final rule (91 FR 44976)"],
            ["September 14, 2026", "A federal court in Massachusetts postponed the rule's effective date and preliminarily blocked DHS from implementing it"],
            ["September 15, 2026", "The original effective date, which didn't take effect"],
            ["Now", "USCIS follows the previous rules until the court or DHS acts"],
          ],
          note: "Sources: [Federal Register final rule](https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant) and the alert on the [USCIS Form I-765 page](https://www.uscis.gov/i-765). The case is Presidents' Alliance on Higher Education and Immigration v. DHS, 26-cv-13799 (D. Mass.).",
        },
        {
          kind: "callout",
          tone: "info",
          title: "Why the eCFR shows the new text",
          text: "The online Code of Federal Regulations already shows the new wording. That's because the rule was published, not because it's in force. USCIS says it's following the previous rules under the court order.",
        },
      ],
    },
    {
      id: "what-would-change",
      heading: "What the rule would change",
      blocks: [
        {
          kind: "table",
          caption: "Today versus the postponed rule",
          head: ["Topic", "Today (previous rules)", "Under the postponed rule"],
          rows: [
            ["How long you're admitted", "Duration of status: as long as you keep your status", "A fixed period: your program length, up to 4 years"],
            ["Arriving early", "Up to 30 days before your program starts", "Up to 30 days before your program starts"],
            ["After your program or OPT ends", "60-day grace period", "30 days"],
            ["Post-completion OPT", "Apply for the work permit", "Apply for the work permit and either an extension of stay with USCIS or a new admission after travel"],
            ["Needing more time", "Program extension through your DSO", "An extension of stay, with conditions"],
            ["Language programs", "Duration of status", "Up to 24 months"],
          ],
          note: "From the final rule's text in [8 CFR 214.2(f)](https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2). Details are simplified; the rule has exceptions.",
        },
        "The rule also limits changing programs: graduate students couldn't change their educational objective during a program, and undergraduates couldn't transfer or change majors in their first academic year except in special circumstances. Students who complete a program after September 15, 2026 couldn't get F-1 status for another program at the same or a lower level.",
      ],
    },
    {
      id: "what-to-do",
      heading: "What students should do now",
      blocks: [
        [
          "**Use the current forms.** USCIS accepts the 08/21/25 edition of Form I-765 and the 08/28/24 edition of Form I-539, not the 09/15/26 editions.",
          "**Plan with today's rules,** including the 60-day grace period and the usual OPT process. See [the 60-day grace period](/blog/f1-grace-period-60-days).",
          "**Check for updates before big decisions,** such as travel, a program change or an OPT start date. The court could rule or DHS could act at any time.",
          "**Talk to your DSO** about how your school is preparing if the rule takes effect later.",
        ],
      ],
    },
  ],
  faq: [
    {
      q: "Is duration of status ending for F-1 students?",
      a: "Not right now. A final rule would end it, but a federal court postponed the rule on September 14, 2026, and USCIS is following the previous rules.",
    },
    {
      q: "When would the fixed admission rule take effect?",
      a: "It was set for September 15, 2026 but is postponed until the court rules otherwise or the case is resolved. There's no new date.",
    },
    {
      q: "Does the rule change OPT?",
      a: "If it takes effect, students applying for post-completion OPT would also need an extension of stay from USCIS or a new admission after travel. For now, the current OPT process applies.",
    },
    {
      q: "Which Form I-765 edition should I use?",
      a: "The 08/21/25 edition. USCIS says it isn't accepting the 09/15/26 edition while the court order is in place.",
    },
    {
      q: "Would the grace period change?",
      a: "Yes. Under the rule, students would have 30 days after their program instead of 60. For now, 60 days still applies.",
    },
  ],
  sources: [OPT_SRC.fixedAdmissionRule, OPT_SRC.i765, OPT_SRC.regulation, OPT_SRC.iceTravel],
  links: [
    { href: "/blog/f1-grace-period-60-days", label: "The F-1 60-day grace period" },
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/blog/proposed-opt-fee-2026", label: "The proposed $70,000 OPT fee" },
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
  ],
};
