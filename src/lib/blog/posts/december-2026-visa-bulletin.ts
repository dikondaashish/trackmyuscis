/**
 * Published before the December 2026 bulletin so the page can rank while people wait for it.
 * Facts checked 2026-11-24:
 * - travel.state.gov Visa Bulletin index ("Coming soon") and the December 2026 page (not found yet).
 * - November 2026, November 2025 and December 2025 bulletins (charts read in Chrome).
 * - USCIS filing-charts page (updated 11/02/2026) and its December 2025 and October 2026 chart pages.
 * - Release timing: first Wayback Machine captures of the December 2023, 2024 and 2025 bulletins.
 *
 * Rechecked 2026-11-24 (evening): still not out. USCIS's filing-charts page named November 2026 and
 * the Internet Archive had no copy of a December 2026 bulletin page.
 *
 * On release day: save the December and November bulletin pages from a normal browser and run
 * `python3 scripts/visa-bulletin-charts.py <december.html> <november.html>` for the chart rows and
 * every date that moved. Then add the December charts and a "what moved since November" section, rewrite
 * `answer`, `takeaways`, the status section and FAQ 1–3, bump `updated`, and add the USCIS chart
 * choice once USCIS posts it. Keep the slug.
 */
import cover from "@/assets/blog/december-2026-visa-bulletin.jpg";
import type { BlogPost } from "../types";
import { BULLETIN_COLS, NOVEMBER_2026 } from "./november-2026-visa-bulletin";

const BASE = "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin";
const ARCHIVE = "https://web.archive.org/web/*/" + BASE;

const SRC = {
  index: { label: "U.S. Department of State: The Visa Bulletin", href: `${BASE}.html` },
  november: { label: "U.S. Department of State: Visa Bulletin for November 2026", href: `${BASE}/2027/visa-bulletin-for-november-2026.html` },
  dec2025: { label: "U.S. Department of State: Visa Bulletin for December 2025", href: `${BASE}/2026/visa-bulletin-for-december-2025.html` },
  nov2025: { label: "U.S. Department of State: Visa Bulletin for November 2025", href: `${BASE}/2026/visa-bulletin-for-november-2025.html` },
  charts: {
    label: "USCIS: Adjustment of status filing charts from the Visa Bulletin",
    href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin",
  },
  archive: {
    label: "Internet Archive: first saved copies of the December 2023, 2024 and 2025 bulletins",
    href: `${ARCHIVE}/2026/visa-bulletin-for-december-2025.html`,
  },
};

/** November 2026 dates (final action, dates for filing) for the categories people search for most. Shared with the January post. */
export const WATCHED_NOVEMBER_2026 = [
    ["EB-1 India", "01FEB23", "01JUL24"],
    ["EB-1 China", "01AUG23", "01JUL24"],
    ["EB-2 India", "01NOV13", "15JAN15"],
    ["EB-2 China", "01OCT21", "01JAN23"],
    ["EB-2 most countries", "01APR25", "15MAR26"],
    ["EB-3 India", "22JAN14", "15JAN15"],
    ["EB-3 China", "22JAN22", "01APR24"],
    ["EB-3 most countries", "15JUN24", "01AUG24"],
    ["EB-3 Philippines", "15AUG23", "01JAN24"],
    ["F2A most countries", "22OCT26", "C"],
    ["F4 most countries", "22OCT12", "01NOV12"],
    ["F4 India", "15DEC06", "01FEB07"],
    ["F4 Mexico", "22APR01", "30APR01"],
    ["F4 Philippines", "15MAY08", "22MAR09"],
  ];

export const decemberVisaBulletin2026: BlogPost = {
  slug: "december-2026-visa-bulletin",
  title: "December 2026 Visa Bulletin: release date, current dates and what to watch",
  seoTitle: "December 2026 Visa Bulletin: Release Date and Updates",
  description:
    "Is the December 2026 Visa Bulletin out? When it's expected, the dates in effect now, what moved last December and which chart USCIS uses. Updated on release.",
  topic: "Visa Bulletin",
  published: "2026-11-24",
  author: "karthik",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A woman at a kitchen table checks a chart of dates on her laptop while a wall calendar page turns and an update envelope arrives",
  },
  answer:
    "The December 2026 Visa Bulletin hasn't been published yet. On November 24, 2026 the State Department still listed it as “coming soon”. Until it appears, the latest official dates are November's. For November, USCIS accepts green card applications filed from inside the U.S. using the Dates for Filing chart for every family and employment category. The last three December bulletins were online by November 9 to 14, so this one is later than usual. We'll add every December date here the day it's out.",
  takeaways: [
    "Not out yet: on November 24, 2026, travel.state.gov listed December as “Coming soon” and the December page didn't exist.",
    "The December 2023, 2024 and 2025 bulletins were online by November 9, 12 and 14 of those years.",
    "USCIS says it names the chart to use within one week of the bulletin. It chose Dates for Filing in October and November 2026, and in December 2025.",
    "There are no official predictions. The November 2026 bulletin has no notes about coming months.",
    "Last December, family dates for most countries didn't move, and employment dates moved forward by one week to two months. That's history, not a forecast.",
  ],
  sections: [
    {
      id: "status",
      heading: "Is the December 2026 Visa Bulletin out?",
      blocks: [
        "Not yet. We checked the State Department's [Visa Bulletin page](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html) on November 24, 2026. It lists November 2026 as the current bulletin and shows “Visa Bulletin Coming Soon” for the next one. The page where December's bulletin will live returned “Page Not Found”.",
        {
          kind: "callout",
          tone: "info",
          title: "We update this page the day it's published",
          text: "When the December 2026 bulletin appears, this page will get every December date, what moved since November, and which chart USCIS accepts. The address stays the same, so you can bookmark it.",
        },
      ],
    },
    {
      id: "release-date",
      heading: "When will it be released?",
      blocks: [
        "The State Department doesn't announce a release date in advance. The best guide is when past December bulletins appeared. The Internet Archive saves copies of public pages, and its first saved copy of each recent December bulletin shows it was online by mid-November:",
        {
          kind: "table",
          caption: "When recent December bulletins were first saved online",
          head: ["Bulletin", "Online by", "Days before December 1"],
          rows: [
            ["December 2023", "Nov 9, 2023", "22"],
            ["December 2024", "Nov 12, 2024", "19"],
            ["December 2025", "Nov 14, 2025", "17"],
            ["December 2026", "Not out on Nov 24, 2026", "7 or fewer"],
          ],
          note: "From the earliest copy in the Internet Archive's Wayback Machine. A bulletin can go online a little before the first saved copy, so these dates are the latest it could have appeared.",
        },
        "So this year's bulletin is already about ten days later than the last three. The State Department's Visa Bulletin page gives no reason and no new date.",
        "After the bulletin is out, USCIS takes a little longer to say which chart people in the U.S. should use. Its filing-charts page says it expects to name the chart “within one week” of the bulletin's publication.",
        {
          kind: "callout",
          tone: "tip",
          title: "How to tell when it's out",
          text: "When it's published, the official [Visa Bulletin page](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html) replaces “Coming soon” with a link to December's bulletin. Bookmark that page, or this one.",
        },
      ],
    },
    {
      id: "dates-now",
      heading: "The dates in effect now (November 2026)",
      blocks: [
        "Until December's bulletin is posted, November's are the latest official dates. For November, USCIS accepts adjustment of status applications (Form I-485) using the **Dates for Filing** chart for all family and employment categories, so those are the dates most people in the U.S. are checking.",
        {
          kind: "table",
          caption: "Dates for Filing, employment-based, November 2026",
          head: BULLETIN_COLS,
          rows: NOVEMBER_2026.employmentFiling,
          note: "Dates are written as the bulletin writes them: 15MAR26 is March 15, 2026. Source: [Visa Bulletin for November 2026](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-november-2026.html).",
        },
        {
          kind: "table",
          caption: "Dates for Filing, family-sponsored, November 2026",
          head: BULLETIN_COLS,
          rows: NOVEMBER_2026.familyFiling,
        },
        "The Final Action Dates chart decides when a green card can actually be approved, and when the National Visa Center schedules interviews for people applying from abroad:",
        {
          kind: "table",
          caption: "Final Action Dates, employment-based, November 2026",
          head: BULLETIN_COLS,
          rows: NOVEMBER_2026.employmentFinal,
        },
        {
          kind: "table",
          caption: "Final Action Dates, family-sponsored, November 2026",
          head: BULLETIN_COLS,
          rows: NOVEMBER_2026.familyFinal,
          note: "F1: unmarried adult children of U.S. citizens. F2A: spouses and children of permanent residents. F2B: unmarried adult children of permanent residents. F3: married children of U.S. citizens. F4: brothers and sisters of adult U.S. citizens.",
        },
        "What changed from October to November, category by category, is in our [November 2026 Visa Bulletin breakdown](/blog/november-2026-visa-bulletin).",
      ],
    },
    {
      id: "your-category",
      heading: "What to compare for the most-watched categories",
      blocks: [
        "These are the categories people search for most. When December's bulletin is out, compare its dates with these November ones. If a date is later, that line moved forward.",
        {
          kind: "table",
          caption: "November 2026 dates for the most-watched categories",
          head: ["Category", "Final action", "Dates for filing"],
          rows: WATCHED_NOVEMBER_2026,
          note: "Most countries means every country except China (mainland born), India, Mexico and the Philippines, which have their own lines because demand from them is higher.",
        },
      ],
    },
    {
      id: "last-december",
      heading: "What happened last December",
      blocks: [
        "There's no official forecast, but last year's bulletins show what a December move has looked like. Here are the final action dates in the November 2025 and December 2025 bulletins:",
        {
          kind: "table",
          caption: "Final action dates, November 2025 to December 2025",
          head: ["Category", "November 2025", "December 2025", "Change"],
          rows: [
            ["Family, most countries", "No change", "No change", "Held"],
            ["EB-1 China", "Dec 22, 2022", "Jan 22, 2023", "+1 month"],
            ["EB-1 India", "Feb 15, 2022", "Mar 15, 2022", "+1 month"],
            ["EB-2 most countries", "Dec 1, 2023", "Feb 1, 2024", "+2 months"],
            ["EB-2 China", "Apr 1, 2021", "Jun 1, 2021", "+2 months"],
            ["EB-2 India", "Apr 1, 2013", "May 15, 2013", "+6 weeks"],
            ["EB-3 most countries", "Apr 1, 2023", "Apr 15, 2023", "+2 weeks"],
            ["EB-3 China", "Mar 1, 2021", "Apr 1, 2021", "+1 month"],
            ["EB-3 India", "Aug 22, 2013", "Sep 22, 2013", "+1 month"],
            ["EB-4", "Jul 1, 2020", "Sep 1, 2020", "+2 months"],
            ["F2B Mexico", "Dec 15, 2007", "May 15, 2008", "+5 months"],
            ["F4 Philippines", "Mar 22, 2006", "Jul 15, 2006", "+4 months"],
          ],
          note: "Sources: the [November 2025](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-november-2025.html) and [December 2025](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-december-2025.html) Visa Bulletins.",
        },
        [
          "**Family:** every final action date for most countries stayed where it was. Mexico and the Philippines moved in a few categories.",
          "**Employment:** most lines moved forward by one week to two months, including EB-2 India by six weeks.",
          "**Dates for Filing:** every employment date held. In family, only F2A moved, by one month.",
          "**USCIS** used the Dates for Filing chart for both family and employment cases in December 2025.",
        ],
        {
          kind: "callout",
          tone: "warning",
          title: "Last year isn't a forecast",
          text: "Each December depends on how many people are waiting in each line and how many visas are left. Those numbers change every year, so a category that moved last December can hold or even move back this time.",
        },
      ],
    },
    {
      id: "predictions",
      heading: "Are there official predictions?",
      blocks: [
        "No. The State Department doesn't publish forecasts for upcoming bulletins. When it expects big changes, it sometimes adds a note to the bulletin itself, but the November 2026 bulletin has no notes about the months ahead.",
        "Predictions you see online are guesses. We don't publish them, because a wrong guess can push someone to rush a filing that gets rejected, or to wait when they didn't need to.",
        "What does decide the dates is set out in law and in the bulletin:",
        [
          "**Yearly limits:** at least 226,000 family preference green cards and at least 140,000 employment preference green cards each fiscal year.",
          "**Per-country limit:** no single country can use more than 7% of those preference green cards, which is 25,620 a year. China (mainland born), India, Mexico and the Philippines hit that limit, which is why they have their own columns.",
          "**Demand:** each month the State Department counts the qualified applicants reported by consulates and USCIS. The November 2026 dates counted demand received by October 5, 2026.",
          "**The fiscal year:** fiscal year 2027 started on October 1, 2026, with a new year of visa numbers. October and November 2026 were its first two bulletins, and December will be its third.",
        ],
      ],
    },
    {
      id: "which-chart",
      heading: "Which chart will USCIS use in December?",
      blocks: [
        "USCIS hasn't said yet, and it won't until after the December bulletin is published. Each month it picks one chart for people filing Form I-485 from inside the U.S.: Dates for Filing when it expects more visas than applicants, or Final Action Dates when it doesn't.",
        {
          kind: "table",
          caption: "The chart USCIS chose in recent months",
          head: ["Month", "Family", "Employment"],
          rows: [
            ["December 2025", "Dates for Filing", "Dates for Filing"],
            ["October 2026", "Dates for Filing", "Dates for Filing"],
            ["November 2026", "Dates for Filing", "Dates for Filing"],
            ["December 2026", "Not announced yet", "Not announced yet"],
          ],
        },
        "One rule always applies: if your category is current on the Final Action chart, or its final action date is later than its filing date, you can use the Final Action chart that month instead.",
      ],
    },
    {
      id: "release-day",
      heading: "What to do the day it comes out",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Find your priority date",
              text: "It's on the I-797 receipt or approval notice for your I-130 or I-140. See [what Form I-797 is](/answers/what-is-form-i-797).",
            },
            {
              title: "Find your row and column",
              text: "Your category (for example EB-2 or F4) and your country of chargeability, which is usually your country of birth.",
            },
            {
              title: "Check the chart USCIS accepts",
              text: "If USCIS hasn't named December's chart yet, watch its [filing-charts page](https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin). It usually updates within a week.",
            },
            {
              title: "Compare the dates",
              text: "If your priority date is earlier than the date in your row, or the row says C (current), you can move ahead in December.",
            },
          ],
        },
      ],
    },
    {
      id: "if-current",
      heading: "If your date becomes current in December",
      blocks: [
        [
          "**In the U.S.:** you can file Form I-485 once your date is current on the chart USCIS accepts, as long as your petition allows it. See [Form I-485](/forms/i-485). If your I-140 isn't approved yet, you may be able to file both together, which our [I-140 status guide](/blog/i-140-status-check) explains.",
          "**Applying from abroad:** the National Visa Center uses the Dates for Filing chart to ask for your documents and the Final Action chart to schedule your interview. You'll hear from it directly.",
          "**Already filed:** if your final action date becomes current, your green card can be approved. Keep your address up to date with USCIS so notices reach you.",
        ],
      ],
    },
  ],
  faq: [
    {
      q: "Is the December 2026 Visa Bulletin out?",
      a: "Not yet. On November 24, 2026 the State Department's Visa Bulletin page still showed December as “Coming soon”. We'll update this page the day it's published.",
    },
    {
      q: "When is the December 2026 Visa Bulletin coming out?",
      a: "The State Department doesn't announce a date. The last three December bulletins were online by November 9 to 14, so this year's is already about ten days later than usual.",
    },
    {
      q: "Why is the December 2026 Visa Bulletin late?",
      a: "The State Department hasn't posted a reason. Its Visa Bulletin page only says the next bulletin is coming soon.",
    },
    {
      q: "Are there official predictions for the December 2026 Visa Bulletin?",
      a: "No. The State Department doesn't publish forecasts, and the November 2026 bulletin has no notes about coming months. Predictions online are guesses.",
    },
    {
      q: "Will EB-2 India move in December 2026?",
      a: "No one outside the government knows. EB-2 India's final action date is November 1, 2013 in the November 2026 bulletin, the same as October. Last December it moved six weeks, from April 1 to May 15, 2013, but that isn't a forecast.",
    },
    {
      q: "Will USCIS use the Dates for Filing chart in December 2026?",
      a: "USCIS will say within about a week of the bulletin. It used Dates for Filing for both family and employment cases in October and November 2026, and in December 2025.",
    },
    {
      q: "What do “C” and “U” mean in the Visa Bulletin?",
      a: "C means current: anyone who qualifies can move ahead, whatever their priority date. U means unauthorized: no visas can be issued in that category that month.",
    },
    {
      q: "Has fiscal year 2027 started for green cards?",
      a: "Yes. Fiscal year 2027 began on October 1, 2026, with a new year of visa numbers. The December 2026 bulletin will be the third of the year.",
    },
    {
      q: "What happens if my date moves back after I file?",
      a: "That's called retrogression. Your pending application usually waits until your date is current again. You don't lose your place in line.",
    },
  ],
  sources: [SRC.index, SRC.november, SRC.dec2025, SRC.nov2025, SRC.charts, SRC.archive],
  links: [
    { href: "/blog/november-2026-visa-bulletin", label: "November 2026 Visa Bulletin: what moved and which chart to use" },
    { href: "/blog/january-2027-visa-bulletin", label: "January 2027 Visa Bulletin: release date and what to watch" },
    { href: "/forms/i-485", label: "Form I-485: apply for a green card from inside the U.S." },
    { href: "/forms/i-140", label: "Form I-140: petition for a worker" },
    { href: "/forms/i-130", label: "Form I-130: petition for a relative" },
  ],
};
