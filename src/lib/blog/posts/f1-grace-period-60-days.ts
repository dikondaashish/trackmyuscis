/**
 * Facts checked 2026-11-24: ICE travel FAQ (the 60-day grace period is only to prepare to leave; no
 * re-entry), the USCIS OPT page, the July 17, 2026 fixed-admission rule (30 days) and the USCIS I-765
 * alert on the September 14, 2026 court order postponing it (see opt-sources.ts).
 */
import cover from "@/assets/blog/f1-grace-period-60-days.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const f1GracePeriod60Days: BlogPost = {
  slug: "f1-grace-period-60-days",
  title: "The F-1 60-day grace period: what you can do and what you can't",
  seoTitle: "F-1 60-Day Grace Period Explained (2026)",
  description:
    "F-1 students get 60 days after their program or OPT ends to prepare to leave or take a next step. What you can do then, what you can't, and what may change.",
  topic: "Students & OPT",
  published: "2026-11-09",
  author: "karthik",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A graduate carrying a box walks out through a campus gate toward a calendar with a short span marked and a suitcase",
  },
  answer:
    "When an F-1 student finishes their program or their OPT, they have a 60-day grace period to prepare to leave the U.S. or move to their next step, such as starting a new program, transferring, or changing status. You can't work during it, and ICE says you can't use it to leave and re-enter. A 2026 rule would shorten it to 30 days, but a federal court postponed that rule on September 14, 2026, so 60 days still applies.",
  takeaways: [
    "The grace period is 60 days after you complete your program, or after your OPT ends.",
    "ICE says it's only for preparing to leave. You can't leave the U.S. and come back in on it.",
    "You can't work during the grace period unless you have another work authorization.",
    "Common next steps are a transfer, a new program, a change of status, or departure. Plan them with your DSO before day 60.",
    "A final rule would cut it to 30 days, but it's postponed by a court order, and USCIS says the previous rules apply.",
  ],
  sections: [
    {
      id: "when",
      heading: "When the grace period starts",
      blocks: [
        {
          kind: "table",
          caption: "When your 60 days begin",
          head: ["Your situation", "The 60 days start after"],
          rows: [
            ["You finish your program and don't use OPT", "Your program end date"],
            ["You use post-completion OPT", "Your OPT end date"],
            ["You use STEM OPT", "Your STEM OPT end date"],
          ],
          note: "Source: ICE describes the grace period as the 60-day period after finishing your program or OPT, in its [travel FAQ](https://www.ice.gov/sevis/travel).",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Ending early can change things",
          text: "Grace periods work differently if you withdraw from school, your SEVIS record is terminated, or you go over your OPT unemployment limit. Talk to your DSO right away in any of those cases.",
        },
      ],
    },
    {
      id: "can-do",
      heading: "What you can do in the 60 days",
      blocks: [
        [
          "**Prepare to leave:** pack, close accounts and book your trip home.",
          "**Transfer to another school:** your DSO transfers your SEVIS record to the new school.",
          "**Start a new program** at a higher education level and get a new Form I-20.",
          "**Change status,** for example if an employer files an H-1B petition or you marry and qualify for another status. Ask your DSO and an attorney about timing.",
          "**Apply for post-completion OPT,** if you haven't already. USCIS lets you file up to 60 days after your program end date, within 30 days of your DSO's recommendation.",
        ],
      ],
    },
    {
      id: "cant-do",
      heading: "What you can't do",
      blocks: [
        [
          "**Work.** The grace period doesn't come with work authorization.",
          "**Leave and come back.** ICE says the grace period is only to prepare to leave, so you can't re-enter on it.",
          "**Extend it.** It's a fixed 60 days. Plan your next step before it ends.",
        ],
      ],
    },
    {
      id: "rule-change",
      heading: "Will the grace period become 30 days?",
      blocks: [
        "A final rule published on July 17, 2026 would replace “duration of status” for students with fixed admission periods. Under it, students would have 30 extra days after their program end date instead of 60.",
        "On September 14, 2026, a federal court in Massachusetts postponed that rule. USCIS says it's following the previous rules until further notice, so the 60-day grace period still applies. See [the F-1 rule on hold explained](/blog/f1-fixed-admission-rule-on-hold).",
      ],
    },
  ],
  faq: [
    {
      q: "How long is the F-1 grace period?",
      a: "60 days after you complete your program or your OPT. A rule that would cut it to 30 days was postponed by a court on September 14, 2026.",
    },
    {
      q: "Can I work during the 60-day grace period?",
      a: "No, not unless you have a separate work authorization.",
    },
    {
      q: "Can I travel and come back during the grace period?",
      a: "No. ICE says the grace period is only to prepare to leave, so you can't re-enter the U.S. on it.",
    },
    {
      q: "Can I apply for OPT during the grace period?",
      a: "Yes, if you're within 60 days of your program end date and within 30 days of your DSO's OPT recommendation.",
    },
    {
      q: "Does the grace period apply after STEM OPT?",
      a: "Yes. The 60 days start after your OPT ends, including STEM OPT.",
    },
  ],
  sources: [OPT_SRC.iceTravel, OPT_SRC.opt, OPT_SRC.fixedAdmissionRule, OPT_SRC.i765],
  links: [
    { href: "/blog/f1-fixed-admission-rule-on-hold", label: "The F-1 fixed admission rule is on hold" },
    { href: "/blog/travel-on-opt-2026", label: "Can you travel on OPT?" },
    { href: "/blog/opt-unemployment-90-days", label: "The OPT 90-day unemployment rule" },
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
  ],
};
