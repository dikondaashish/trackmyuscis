/**
 * Facts checked 2026-11-24 against the USCIS STEM OPT and OPT pages, the processing times tool,
 * the fee calculator, the SEVIS unemployment counter article and 8 CFR 214.2(f) (see opt-sources.ts).
 */
import cover from "@/assets/blog/stem-opt-extension-2026.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const stemOptExtension2026: BlogPost = {
  slug: "stem-opt-extension-2026",
  title: "STEM OPT extension in 2026: eligibility, how to apply and the 180-day rule",
  seoTitle: "STEM OPT Extension 2026: Processing Time and 180-Day Rule",
  description:
    "Who qualifies for the 24-month STEM OPT extension, when to file, the documents you need, how the 180-day rule works and USCIS's current processing time.",
  topic: "Students & OPT",
  published: "2026-11-24",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "An engineer in a lab coat works beside a robot arm and code on a monitor, under a timeline ribbon with an extended teal section",
  },
  answer:
    "The STEM OPT extension adds 24 months to post-completion OPT for graduates whose degree is on the government's STEM list and who work for an employer enrolled in E-Verify. File Form I-765 up to 90 days before your OPT ends, and within 60 days of your school's recommendation. If you file on time, you can keep working for up to 180 days after your OPT card expires while USCIS decides. USCIS's processing time for these applications is 6 months for 80% of cases (checked November 24, 2026).",
  takeaways: [
    "The extension is 24 months, on top of 12 months of post-completion OPT.",
    "You need a STEM degree on the official list, an E-Verify employer, and a signed training plan (Form I-983).",
    "File up to 90 days before your OPT expires and within 60 days of your DSO's recommendation.",
    "File on time and you can keep working for up to 180 days past your OPT end date while the case is pending.",
    "You get 150 unemployment days in total across OPT and STEM OPT.",
  ],
  sections: [
    {
      id: "eligibility",
      heading: "Who qualifies",
      blocks: [
        "USCIS lists these requirements:",
        [
          "You were granted OPT and are in a valid period of **post-completion OPT**.",
          "You earned a bachelor's, master's or doctoral degree in a field on the **STEM Designated Degree Program List**, from an accredited school certified by SEVP when you apply.",
          "Your employer is **enrolled in E-Verify** and in good standing, and meets the employer rules below.",
          "You file Form I-765 **on time** (see the next section).",
        ],
        {
          kind: "callout",
          tone: "tip",
          title: "Not sure if your degree counts?",
          text: "The STEM list is organized by Classification of Instructional Programs (CIP) codes. Your program's CIP code is printed on your Form I-20. Ask your DSO to confirm it's on the current list.",
        },
        "If you later earn another qualifying STEM degree at a higher level, you may get one more 24-month STEM OPT extension based on that degree.",
      ],
    },
    {
      id: "apply",
      heading: "How to apply",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Agree a training plan with your employer",
              text: "You complete Form I-983, the training plan, and get it signed by your employer. The regulation says your DSO can't recommend the extension until it's done.",
            },
            {
              title: "Get your DSO's recommendation",
              text: "Your DSO updates SEVIS and gives you a new Form I-20 endorsed for STEM OPT.",
            },
            {
              title: "File Form I-765",
              text: "Category (c)(3)(C). Include the fee ($470 online or $520 on paper), your employer's name exactly as listed in E-Verify and its E-Verify company ID number, your I-20 endorsed within the last 60 days, and a copy of your STEM degree.",
            },
            {
              title: "Keep working while you wait",
              text: "If you filed before your OPT expired, the 180-day rule covers you. Keep your receipt notice: it shows you filed on time.",
            },
          ],
        },
        {
          kind: "table",
          caption: "STEM OPT filing window",
          head: ["Rule", "What it means"],
          rows: [
            ["Earliest", "90 days before your current OPT ends"],
            ["Latest", "Before your current OPT ends"],
            ["DSO deadline", "Within 60 days of your DSO's recommendation in SEVIS"],
          ],
          note: "Source: USCIS, [STEM OPT extension](https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt).",
        },
      ],
    },
    {
      id: "180-day-rule",
      heading: "The 180-day rule, explained",
      blocks: [
        "If you file your STEM OPT extension on time and your OPT card expires while the application is pending, USCIS automatically extends your permission to work for **180 days**. The extension ends as soon as USCIS decides your application, whether that's an approval or a denial.",
        {
          kind: "callout",
          tone: "info",
          title: "Did the October 2026 rule change this?",
          text: "No. The final rule of October 14, 2026 ended automatic extensions for certain renewal work permits under a different regulation, and it doesn't mention STEM OPT. USCIS's STEM OPT page still describes the 180-day extension (checked November 24, 2026).",
        },
        "With USCIS's official processing time at 6 months, a case can come close to the 180-day limit. Filing early in the 90-day window, or adding premium processing, keeps more margin.",
      ],
    },
    {
      id: "processing-time",
      heading: "How long STEM OPT takes",
      blocks: [
        "USCIS publishes one processing time for all F-1 student work permits, category (c)(3), including STEM OPT: **80% of cases finished within 6 months**, checked November 24, 2026. Premium processing costs $1,780 and gets action (an approval, denial or request for evidence) within 30 business days. See our [OPT processing time guide](/blog/opt-processing-time-2026) for more.",
      ],
    },
    {
      id: "after",
      heading: "Your rules once you're on STEM OPT",
      blocks: [
        {
          kind: "table",
          caption: "Reporting during STEM OPT",
          head: ["Who", "What", "When"],
          rows: [
            ["You", "Changes to your name, address, email, employer or employer's address", "Within 10 days"],
            ["You", "Confirm your details with your DSO, even if nothing changed", "Every 6 months"],
            ["Employer", "Material changes to your training, with an updated Form I-983", "At the earliest opportunity"],
            ["Employer", "Your job ending or your departure", "Within 5 business days"],
          ],
          note: "Source: USCIS, [STEM OPT extension](https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt).",
        },
        [
          "**Unemployment:** you can be unemployed for 150 days in total across OPT and STEM OPT. Days used during regular OPT count toward the 150. See [the OPT unemployment rule](/blog/opt-unemployment-90-days).",
          "**A real employer:** the company that signs your I-983 must be the one training you, and it can't be an employer in name only or an unpaid volunteer role. Another student on OPT can't be your trainer.",
          "**Changing jobs:** the new employer must also use E-Verify. Within 10 days of starting, submit a new Form I-983 to your DSO and get a new recommendation.",
        ],
      ],
    },
    {
      id: "changes-2026",
      heading: "What's changing for STEM OPT",
      blocks: [
        [
          "**Proposed OPT fees:** DHS proposed on October 8, 2026 that schools pay $30,000 for any OPT after a student's first, which would include STEM OPT. It's a proposal only. See [the proposed OPT fee explained](/blog/proposed-opt-fee-2026).",
          "**Fixed admission periods for students:** postponed by a federal court on September 14, 2026. USCIS says it's following the previous rules for now.",
          "**Premium processing** rose to $1,780 on March 1, 2026.",
        ],
      ],
    },
  ],
  faq: [
    {
      q: "How long is the STEM OPT extension?",
      a: "24 months, on top of 12 months of post-completion OPT.",
    },
    {
      q: "When can I apply for STEM OPT?",
      a: "Up to 90 days before your current OPT expires, and within 60 days of your DSO entering the recommendation in SEVIS. File before your OPT ends to keep the 180-day work extension.",
    },
    {
      q: "Can I keep working after my OPT card expires?",
      a: "Yes, for up to 180 days, if you filed your STEM OPT extension on time. The extension ends when USCIS decides your application.",
    },
    {
      q: "How long does STEM OPT processing take?",
      a: "USCIS shows 6 months for 80% of F-1 student work permits (category (c)(3)), checked November 24, 2026. Premium processing gets action (an approval, denial or request for evidence) within 30 business days for $1,780.",
    },
    {
      q: "How many unemployment days do I get on STEM OPT?",
      a: "150 days in total, including any days you used during your regular post-completion OPT.",
    },
    {
      q: "Does my employer have to use E-Verify?",
      a: "Yes. Your employer must be enrolled in E-Verify and stay in good standing, and you list its E-Verify company ID number on your application.",
    },
    {
      q: "Can I get STEM OPT twice?",
      a: "Possibly. If you later earn another qualifying STEM degree at a higher level, you may get one more 24-month extension based on it.",
    },
  ],
  sources: [OPT_SRC.stem, OPT_SRC.opt, OPT_SRC.times, OPT_SRC.fees, OPT_SRC.unemploymentCounter, OPT_SRC.eadRule, OPT_SRC.feeProposal],
  links: [
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/blog/opt-unemployment-90-days", label: "The OPT 90-day unemployment rule" },
    { href: "/answers/how-to-check-uscis-case-status", label: "How to check your USCIS case status" },
  ],
};
