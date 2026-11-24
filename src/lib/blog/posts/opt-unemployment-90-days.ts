/**
 * Facts checked 2026-11-24 against 8 CFR 214.2(f)(10)(ii)(E) (eCFR, up to date as of 2026-11-20),
 * the SEVIS Help Hub OPT and unemployment counter articles, the ICE practical training page and
 * the USCIS OPT and STEM OPT pages (see opt-sources.ts).
 */
import cover from "@/assets/blog/opt-unemployment-90-days.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

const ICE = { label: "ICE: Practical training for F-1 students", href: "https://www.ice.gov/sevis/practical-training" };

export const optUnemployment90Days: BlogPost = {
  slug: "opt-unemployment-90-days",
  title: "The OPT 90-day unemployment rule: how days are counted and how to stay safe",
  seoTitle: "OPT 90-Day Unemployment Rule Explained (2026)",
  description:
    "On post-completion OPT you can be unemployed for 90 days in total, or 150 with STEM OPT. How SEVIS counts the days, what counts as a job and how to report it.",
  topic: "Students & OPT",
  published: "2026-11-24",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A graduate searches job listings on a laptop at a café table beside a desk calendar with some days filled in teal",
  },
  answer:
    "On post-completion OPT, you can be unemployed for no more than 90 days in total. If you get the 24-month STEM OPT extension, the limit becomes 150 days across both periods, including days you used on regular OPT. SEVIS counts every day from your OPT start date on which no employer is reported, so the fastest way to stop the count is to report your job to your school as soon as you start.",
  takeaways: [
    "The limit is 90 days in total on post-completion OPT, and 150 days in total with STEM OPT.",
    "The days add up across the whole period. They don't need to be in a row and don't reset when you change jobs.",
    "SEVIS starts counting on your actual OPT start date and counts each day with no employer on record.",
    "Post-completion OPT work must be at least 20 hours a week and directly related to your major.",
    "Report a new job, or the loss of one, to your DSO within 10 days. You can add employers yourself in the SEVP Portal.",
  ],
  sections: [
    {
      id: "the-rule",
      heading: "What the rule says",
      blocks: [
        "The rule is in the federal regulations at 8 CFR 214.2(f)(10)(ii)(E). In plain words:",
        [
          "During post-completion OPT, your F-1 status depends on being employed.",
          "You may not be unemployed for more than **90 days in total** during post-completion OPT.",
          "If you get the 24-month STEM OPT extension, you may not be unemployed for more than **150 days in total** across your whole OPT period, regular OPT and STEM OPT together.",
        ],
        {
          kind: "table",
          caption: "Unemployment days allowed",
          head: ["Your OPT", "Days allowed in total"],
          rows: [
            ["Post-completion OPT only", "90"],
            ["Post-completion OPT plus the STEM extension", "150 (the STEM extension adds 60)"],
          ],
          note: "Source: USCIS, [STEM OPT extension](https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt), and the [SEVIS unemployment counter](https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/unemployment-counter).",
        },
        "Pre-completion OPT, used while you're still studying, doesn't have an unemployment limit.",
      ],
    },
    {
      id: "how-counted",
      heading: "How SEVIS counts your days",
      blocks: [
        "The government's student database, SEVIS, keeps an unemployment counter. According to SEVP, it:",
        [
          "Starts from your **actual OPT start date**, the start date on your work permit (EAD).",
          "Counts **each day without employer information** in your record.",
          "Keeps a running total for the whole period. Days don't reset when you change jobs, and for STEM OPT the days you used on regular OPT carry over.",
        ],
        "Because SEVIS counts days without an employer on record, weekends and holidays between jobs count too. And if your employer's dates fall outside your OPT dates, SEVIS can show you as unemployed. Your DSO can see your counter and tell you how many days you have left.",
        {
          kind: "callout",
          tone: "warning",
          title: "If your card arrives late",
          text: "SEVIS counts from your OPT start date, even if your card arrives after it. If USCIS approves your OPT late, talk to your DSO right away about your start date and your counter.",
        },
      ],
    },
    {
      id: "what-counts",
      heading: "What counts as employment",
      blocks: [
        [
          "**At least 20 hours a week.** SEVP says post-completion OPT must be at least 20 hours a week or full time.",
          "**Directly related to your major.** USCIS says all OPT must be directly related to your major area of study. When you report a job, explain how it relates to your degree.",
          "**On STEM OPT, stricter rules.** The job must be with an E-Verify employer that signed your Form I-983 training plan, in a real employer-employee relationship. An unpaid volunteer role doesn't qualify for STEM OPT.",
        ],
        "Different kinds of work can count on regular post-completion OPT, but the rules are specific. Ask your DSO before you count a contract, volunteer or self-employed role toward your days.",
      ],
    },
    {
      id: "report",
      heading: "How to report a job and stop the count",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Start working",
              text: "Only once you have your work permit and its start date has arrived.",
            },
            {
              title: "Report the employer within 10 days",
              text: "ICE says you must report changes to your name, address and employer, and any loss of employment, to your DSO within 10 days.",
            },
            {
              title: "Use the SEVP Portal",
              text: "You can enter your employer's details yourself in the SEVP Portal, or ask your DSO to update SEVIS.",
            },
            {
              title: "Check your counter",
              text: "Ask your DSO to confirm your days used and days remaining, especially after a job change.",
            },
          ],
        },
      ],
    },
    {
      id: "over-limit",
      heading: "What happens if you go over",
      blocks: [
        "SEVP says its officials can terminate the SEVIS record of a student who goes past the allowed unemployment days. That would end your OPT, so it's worth acting well before the limit.",
        "If you're close to the limit, talk to your DSO before day 90 (or 150). Your options depend on your situation: for example, a new job, enrolling in a new program, changing to another status, or leaving the U.S.",
      ],
    },
    {
      id: "tips",
      heading: "Ways to protect your days",
      blocks: [
        [
          "**Pick your start date carefully.** For post-completion OPT, you choose a start date within 60 days after your program ends. A start date close to when you expect to begin working saves days.",
          "**File early.** USCIS's processing time is 6 months for 80% of cases. The [OPT processing time guide](/blog/opt-processing-time-2026) explains how to plan around it.",
          "**Report the same week you start.** Don't wait for the 10-day deadline if you don't have to.",
          "**Keep records** of your offer letter, hours and duties in case you need to show the job matched your degree.",
        ],
      ],
    },
  ],
  faq: [
    {
      q: "How many days can I be unemployed on OPT?",
      a: "90 days in total during post-completion OPT. With the STEM OPT extension, 150 days in total across regular and STEM OPT.",
    },
    {
      q: "Do the 90 days have to be in a row?",
      a: "No. The limit is a total. Every day without a reported employer adds to it, and the count doesn't reset when you change jobs.",
    },
    {
      q: "When does the OPT unemployment clock start?",
      a: "On your actual OPT start date, the start date on your work permit. SEVIS counts each day from then without an employer on record.",
    },
    {
      q: "Do weekends count as unemployment days?",
      a: "Yes, while you have no employer on record. SEVIS counts each day without employer information, not only working days.",
    },
    {
      q: "Does part-time work stop the clock?",
      a: "Work of at least 20 hours a week that's directly related to your major counts as employment on post-completion OPT. Less than 20 hours doesn't.",
    },
    {
      q: "Do unused OPT days carry over to STEM OPT?",
      a: "The days you used carry over. On STEM OPT you get 150 days in total, minus any you already used during regular OPT.",
    },
    {
      q: "How do I check how many unemployment days I've used?",
      a: "Ask your DSO. SEVIS shows days allowed, used and remaining for your current OPT period.",
    },
  ],
  sources: [OPT_SRC.regulation, OPT_SRC.unemploymentCounter, OPT_SRC.sevpOpt, ICE, OPT_SRC.opt, OPT_SRC.stem],
  links: [
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/blog/stem-opt-extension-2026", label: "STEM OPT extension in 2026" },
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
    { href: "/answers/how-to-change-address-with-uscis", label: "How to change your address with USCIS" },
  ],
};
