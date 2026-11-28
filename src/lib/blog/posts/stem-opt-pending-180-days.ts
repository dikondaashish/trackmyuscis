/**
 * Facts checked 2026-11-28:
 * - USCIS STEM OPT page (last updated 01/30/2026): timely filing gives an automatic 180-day extension that
 *   "ceases once USCIS adjudicates" the application. It says nothing about a case pending past 180 days.
 * - 8 CFR 274a.12(b)(6)(iv): work authorized from the EAD's expiry until the decision, "not to exceed 180
 *   days"; the EAD counts as unexpired only together with an I-20 endorsed for the extension.
 * - 8 CFR 214.2(f)(10)(ii)(E): 90 / 150 unemployment days. Neither it nor the SEVIS unemployment counter
 *   article (updated July 27, 2026) says whether days after the 180 days count while the case is pending.
 *   Don't state that they do or don't.
 * - M-274 7.4.2 (updated 04/02/2025): expired EAD + endorsed I-20; employer enters Card Expires + 180 days
 *   and must reverify on that date.
 * - Premium processing page (updated 11/10/2026): I-907 can be added to a pending STEM OPT I-765, online
 *   or at the Chicago Lockbox, 30 business days. Fee $1,780 (fee calculator, checked 2026-11-24).
 * - Expedite page (updated 09/08/2026): no expedite requests where premium processing is available.
 * - Processing time for (c)(3) was last read on 2026-11-24 (6 months); the tool needs a human check.
 */
import cover from "@/assets/blog/stem-opt-pending-180-days.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const stemOptPending180Days: BlogPost = {
  slug: "stem-opt-pending-180-days",
  title: "STEM OPT still pending near 180 days: what happens next and what to do",
  seoTitle: "STEM OPT Pending After 180 Days: What to Do",
  description:
    "Your STEM OPT extension is still pending and the 180 days are almost over. When you must stop working, what's known about unemployment days, and what to do now.",
  topic: "Students & OPT",
  published: "2026-11-28",
  author: "surya",
  updated: "2026-11-28",
  cover: {
    src: cover,
    alt: "A woman at her laptop looks up at a wall calendar with most days crossed off and one day circled in amber, beside a work permit card and an hourglass, under a progress bar that is almost full",
  },
  answer:
    "If you filed your STEM OPT extension on time, you can keep working for up to 180 days after your OPT card expires. If USCIS still hasn't decided when those 180 days end, you must stop working until it approves the case. The pending application itself stays alive. The official rules don't say whether the days after that count as unemployment, so ask your DSO in writing, and add premium processing before you get close to the limit.",
  takeaways: [
    "The 180 days count from the **Card Expires** date on your OPT card, not from the day you filed.",
    "The extension ends at a USCIS decision or at 180 days, whichever comes first. After 180 days with no decision, you stop working.",
    "You can add premium processing ($1,780) to a case that's already pending. USCIS then has 30 business days to act.",
    "USCIS doesn't take expedite requests for forms that have premium processing, so premium is the real way to speed this up.",
    "Neither the regulation nor SEVP's guidance says how the days after 180 are counted for unemployment. Get your DSO's answer in writing.",
  ],
  sections: [
    {
      id: "which-180-days",
      heading: "Which 180 days are we talking about?",
      blocks: [
        "When you file Form I-765 for the STEM OPT extension before your post-completion OPT ends, USCIS says it will automatically extend your work authorization for 180 days if your OPT expires while the application is pending. The regulation behind it, 8 CFR 274a.12(b)(6)(iv), allows work from the day your card expires until USCIS decides, \"but not to exceed 180 days.\"",
        [
          "**The clock starts on your card's expiry date.** USCIS's handbook for employers tells them to record \"the date 180 days from the Card Expires date.\" The date you filed doesn't change it.",
          "**It ends early if USCIS decides.** USCIS says the extension \"ceases once USCIS adjudicates\" your application, whether that's an approval or a denial.",
          "**Your expired card only works with your I-20.** The card counts as unexpired during this time only together with the Form I-20 your DSO endorsed for the STEM extension.",
        ],
        {
          kind: "table",
          caption: "Example: OPT card expires June 1, 2026",
          head: ["Date", "What it means"],
          rows: [
            ["June 1, 2026", "OPT card expires. The 180 days begin."],
            ["June 2 to November 28, 2026", "You can keep working with your expired card and endorsed I-20, as long as the case is pending."],
            ["November 28, 2026", "180 days from the card's expiry date. Your employer must reverify your work authorization on this date."],
            ["After November 28, 2026", "No approval yet means no work until USCIS approves the extension."],
          ],
          note: "Count your own date from the Card Expires date printed on your OPT card. Sources: [8 CFR 274a.12(b)(6)(iv)](https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-274a/subpart-B/section-274a.12) and the [USCIS Handbook for Employers](https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/70-evidence-of-employment-authorization-for-certain-categories/74-exchange-visitors-and-students/742-f-1-and-m-1-nonimmigrant-students).",
        },
      ],
    },
    {
      id: "why-so-close",
      heading: "Why so many cases come close to the limit",
      blocks: [
        "USCIS's posted processing time for F-1 student work permits, category (c)(3), was **6 months for 80% of cases** when we last read it on November 24, 2026. Six months is about the same length as the 180-day extension, and one case in five takes longer than the posted time.",
        "How much room you have depends on when you filed. You can file up to 90 days before your OPT ends. If you filed that early, USCIS had about three months with your case before the 180 days even started. If you filed in the last week, the 180 days are nearly all the time USCIS gets.",
        {
          kind: "callout",
          tone: "info",
          title: "Check the current number yourself",
          text: "Processing times change. Look up Form I-765, category (c)(3), in USCIS's [processing times tool](https://egov.uscis.gov/processing-times/) on the day you plan, and see our [OPT processing time guide](/blog/opt-processing-time-2026).",
        },
      ],
    },
    {
      id: "after-180-days",
      heading: "What happens after 180 days with no decision",
      blocks: [
        {
          kind: "table",
          caption: "Day 180 with a pending case: what's settled and what isn't",
          head: ["Question", "What the official sources say"],
          rows: [
            ["Can I keep working?", "No. Work authorization under the automatic extension can't go past 180 days."],
            ["Is my application cancelled?", "No. Nothing in USCIS's guidance ends a pending application at 180 days. USCIS keeps processing it."],
            ["What does my employer do?", "Reverify your work authorization on the 180-day date. Without an approval, they can't keep you working."],
            ["Do I lose F-1 status?", "The regulation doesn't address this. School international offices commonly tell students they may stay in the U.S. while the timely filed case is pending. Confirm with your own DSO."],
            ["Do the days count as unemployment?", "Not addressed. See the next section."],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Stopping work means all work",
          text: "Don't keep working unpaid, as a volunteer or \"just to finish a project\" for the same employer after the 180 days. Work without authorization can put your F-1 status and later applications at risk. Ask your employer about unpaid leave instead, and ask your DSO before you agree to anything.",
        },
        "Tell your employer the date well ahead. Many employers will hold your job on unpaid leave until the approval comes, but that's the employer's decision, so ask HR early and get it in writing.",
      ],
    },
    {
      id: "unemployment-days",
      heading: "Do days 181, 182 and after count as unemployment?",
      blocks: [
        "This is the question most students ask, and the honest answer is that the official sources don't settle it.",
        [
          "**What the rule says:** students granted the 24-month STEM extension may not have more than **150 days** of unemployment in total across post-completion OPT and STEM OPT (8 CFR 214.2(f)(10)(ii)(E)). It doesn't mention pending applications or the time after the 180 days.",
          "**How SEVIS counts:** SEVP says SEVIS counts each day without employer information in your record, and that a student whose record lacks employer information is considered unemployed.",
          "**What isn't written down:** neither the regulation, USCIS's STEM OPT page nor SEVP's unemployment counter guidance says whether days you can't work because your case is pending past 180 days count toward the 150.",
        ],
        "Because nothing official answers it, don't rely on a forum post or on anyone's guess, including ours. Here's the safe way to handle it:",
        {
          kind: "steps",
          items: [
            {
              title: "Ask your DSO in writing",
              text: "Email your DSO before the 180-day date. Ask how the period after day 180 will be recorded in SEVIS for you and whether it counts toward your 150 days. Keep the reply.",
            },
            {
              title: "Check how many days you've already used",
              text: "Ask your DSO for your current unemployment count. Days from your first 12 months of OPT are included in the 150.",
            },
            {
              title: "Keep your employer in the picture",
              text: "If your employer is keeping your job open, ask your DSO whether your employer information should stay in your SEVIS record during the gap and what you need to report.",
            },
            {
              title: "Plan as if the days could count",
              text: "If you've already used a lot of unemployment days, treat the gap as a real risk and move faster on premium processing. See [the OPT unemployment rule](/blog/opt-unemployment-90-days).",
            },
          ],
        },
      ],
    },
    {
      id: "what-to-do",
      heading: "What to do before you reach day 180",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Find your exact date",
              text: "Take the Card Expires date on your OPT card and count 180 days. Put it in your calendar, along with a reminder two months before.",
            },
            {
              title: "Check your case for anything you missed",
              text: "Look at your status and your USCIS account for a request for evidence. An unanswered request is a common reason a case stalls. See [what a request for evidence is](/answers/what-is-a-request-for-evidence).",
            },
            {
              title: "Add premium processing while there's still time",
              text: "USCIS lets F-1 students who already filed Form I-765 for STEM OPT add Form I-907, online or by mail to the Chicago Lockbox. The fee is $1,780 and USCIS has 30 business days to act from the day it receives the request. Thirty business days is at least six calendar weeks, so don't leave it to the last month.",
            },
            {
              title: "Submit a case inquiry once you're past the posted time",
              text: "When your case is older than USCIS's posted processing time, you can send an online inquiry. That clock runs from the date USCIS received your application, not from your card's expiry date. See [what to do about a delayed case](/answers/contact-uscis-about-delayed-case).",
            },
            {
              title: "Talk to your DSO and your employer",
              text: "Tell both the date your 180 days end. Ask your DSO the unemployment question above, and ask your employer about leave if the approval doesn't come in time.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "info",
          title: "Why not an expedite request?",
          text: "USCIS says it won't consider expedite requests for applications where premium processing is available. STEM OPT has premium processing, so that's the route USCIS expects you to use. An approval isn't guaranteed: within 30 business days USCIS can approve, deny or send a request for evidence.",
        },
        "Be careful with travel while your card is expired and the extension is pending. Talk to your DSO before any trip. See [travel on OPT](/blog/travel-on-opt-2026).",
      ],
    },
    {
      id: "watch-your-case",
      heading: "Keep a close watch on your case",
      blocks: [
        "Near day 180, every status change matters. A request for evidence starts its own deadline, and an approval is what lets you work again.",
        [
          "**Track it in one place.** Add your receipt number to a free TrackMyUSCIS account to follow your STEM OPT case and see what each status means in plain words. [Track your case](/#track).",
          "**Know what your status means.** If the wording changes, read [how to check your case status](/answers/how-to-check-uscis-case-status) before you worry.",
          "**Keep your papers together.** Your I-797C receipt notice, the endorsed I-20, your expired OPT card and your DSO's emails are what your employer and DSO will ask for.",
        ],
      ],
    },
    {
      id: "decision",
      heading: "When USCIS finally decides",
      blocks: [
        [
          "**If it's approved:** you can go back to work once the extension is approved. Your employer has to reverify your work authorization, so send them the approval and your new card as soon as you have it, and ask your DSO to confirm your SEVIS record is up to date.",
          "**If you get a request for evidence:** answer by the deadline on the notice with exactly what it asks for, and tell your DSO. It usually concerns the I-20, the degree or the employer's E-Verify details.",
          "**If it's denied:** the automatic extension has already ended, and you can't work on STEM OPT. Contact your DSO the same day to learn how long you have to leave, transfer or change status, and consider speaking to a licensed immigration attorney about your options.",
        ],
        {
          kind: "callout",
          tone: "tip",
          title: "This is general information",
          text: "Every case is different and this post isn't legal advice. Your DSO can see your SEVIS record and a licensed immigration attorney can advise on your situation. Use this page to know what to ask them.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can I work after 180 days if my STEM OPT is still pending?",
      a: "No. The automatic extension can't go past 180 days from your OPT card's expiry date. If USCIS hasn't approved your extension by then, you must stop working until it does.",
    },
    {
      q: "Do the days after 180 count as unemployment days?",
      a: "The official sources don't say. The regulation sets a 150-day total for STEM OPT students and SEVIS counts days without employer information, but neither addresses a case pending past 180 days. Ask your DSO in writing how your record will be handled.",
    },
    {
      q: "Do I lose my F-1 status at day 180?",
      a: "The regulation doesn't address status for a case pending past 180 days. School international offices commonly advise that you may remain in the U.S. while a timely filed extension is pending, but you must stop working. Confirm with your DSO.",
    },
    {
      q: "Can I add premium processing to a pending STEM OPT case?",
      a: "Yes. USCIS lets F-1 students who already filed Form I-765 for STEM OPT file Form I-907 online or with the Chicago Lockbox. The fee is $1,780 and USCIS has 30 business days to approve, deny or request evidence.",
    },
    {
      q: "Can I ask USCIS to expedite my STEM OPT instead?",
      a: "USCIS says it won't consider expedite requests for applications where premium processing is available, which includes STEM OPT. You can still submit a case inquiry once your case is outside the posted processing time.",
    },
    {
      q: "When do the 180 days start?",
      a: "On the Card Expires date printed on your post-completion OPT card, as long as USCIS received your STEM OPT application before that date. The filing date doesn't move it.",
    },
    {
      q: "What does my employer need for Form I-9 during the 180 days?",
      a: "USCIS's employer handbook says your expired OPT card together with a Form I-20 endorsed by your DSO for the STEM extension. The employer records the card's expiry date plus 180 days and must reverify on that date.",
    },
  ],
  sources: [
    OPT_SRC.stem,
    OPT_SRC.stemPendingRegulation,
    OPT_SRC.regulation,
    OPT_SRC.m274Students,
    OPT_SRC.sevpStem,
    OPT_SRC.unemploymentCounter,
    OPT_SRC.premium,
    OPT_SRC.fees,
    OPT_SRC.expedite,
    OPT_SRC.times,
  ],
  links: [
    { href: "/blog/stem-opt-extension-2026", label: "STEM OPT extension in 2026" },
    { href: "/blog/opt-premium-processing-2026", label: "OPT premium processing in 2026" },
    { href: "/blog/opt-unemployment-90-days", label: "The OPT unemployment rule: 90 and 150 days" },
    { href: "/answers/contact-uscis-about-delayed-case", label: "What to do about a delayed USCIS case" },
  ],
};
