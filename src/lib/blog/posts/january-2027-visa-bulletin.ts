/**
 * Published before the January 2027 bulletin so the page can rank while people wait for it.
 * Facts checked 2026-11-24:
 * - Not out: USCIS's filing-charts page still named November 2026, and the Internet Archive had no
 *   copy of a December 2026 or January 2027 bulletin page. The State Department index said
 *   "Coming soon" for December the same day (see the December post).
 * - Release timing: first Wayback Machine captures of the January 2024, 2025 and 2026 bulletins.
 * - December 2025 and January 2026 bulletins: every chart read from the Internet Archive's saved
 *   copies of the travel.state.gov pages (travel.state.gov blocks automated reads).
 * - USCIS's chart choice for January 2026: the archived filing-charts page of January 10, 2026.
 *
 * On release day: run `python3 scripts/visa-bulletin-charts.py <saved January page> <saved December page>`
 * for the charts and what moved, add them here, rewrite `answer`, `takeaways`, the status section and
 * FAQ 1–3, bump `updated`, and add the USCIS chart choice once USCIS posts it. Keep the slug.
 */
import cover from "@/assets/blog/january-2027-visa-bulletin.jpg";
import type { BlogPost } from "../types";
import { WATCHED_NOVEMBER_2026 } from "./december-2026-visa-bulletin";

const BASE = "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin";

const SRC = {
  index: { label: "U.S. Department of State: The Visa Bulletin", href: `${BASE}.html` },
  november: { label: "U.S. Department of State: Visa Bulletin for November 2026", href: `${BASE}/2027/visa-bulletin-for-november-2026.html` },
  jan2026: { label: "U.S. Department of State: Visa Bulletin for January 2026", href: `${BASE}/2026/visa-bulletin-for-january-2026.html` },
  dec2025: { label: "U.S. Department of State: Visa Bulletin for December 2025", href: `${BASE}/2026/visa-bulletin-for-december-2025.html` },
  charts: {
    label: "USCIS: Adjustment of status filing charts from the Visa Bulletin",
    href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin",
  },
  archive: {
    label: "Internet Archive: first saved copies of the January 2024, 2025 and 2026 bulletins",
    href: `https://web.archive.org/web/*/${BASE}/2026/visa-bulletin-for-january-2026.html`,
  },
};

export const januaryVisaBulletin2027: BlogPost = {
  slug: "january-2027-visa-bulletin",
  title: "January 2027 Visa Bulletin: release date, current dates and what to watch",
  seoTitle: "January 2027 Visa Bulletin: Release Date and Updates",
  description:
    "Is the January 2027 Visa Bulletin out? When it's expected, the dates in effect now, what moved last January and which chart USCIS uses. Updated on release.",
  topic: "Visa Bulletin",
  published: "2026-11-24",
  author: "surya",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A couple by a snowy window study a chart of date blocks on a laptop as a wall calendar page turns",
  },
  answer:
    "The January 2027 Visa Bulletin hasn't been published yet, and on November 24, 2026 the December bulletin wasn't out either. The last three January bulletins were online by December 9 to 18, about two to three weeks before the month began. Until a new bulletin appears, November's are the latest official dates. We'll add every January date here the day it's out.",
  takeaways: [
    "Not out yet: on November 24, 2026, the newest bulletin was still November's. December's comes first.",
    "The January 2024, 2025 and 2026 bulletins were online by December 16, December 9 and December 18.",
    "Last January, employment dates moved forward in most lines, EB-2 India by two months, while family dates for most countries held. That's history, not a forecast.",
    "USCIS names the chart to use within about a week of each bulletin. It chose Dates for Filing in January 2026 and in October and November 2026.",
    "There are no official predictions for January 2027.",
  ],
  sections: [
    {
      id: "status",
      heading: "Is the January 2027 Visa Bulletin out?",
      blocks: [
        "Not yet. We checked on November 24, 2026. The newest bulletin was November 2026, and USCIS's filing-charts page still named the November bulletin. The December 2026 bulletin, which comes before January's, hadn't been published either. Our [December 2026 Visa Bulletin page](/blog/december-2026-visa-bulletin) follows that one.",
        {
          kind: "callout",
          tone: "info",
          title: "We update this page the day it's published",
          text: "When the January 2027 bulletin appears, this page will get every January date, what moved since December, and which chart USCIS accepts. The address stays the same, so you can bookmark it.",
        },
      ],
    },
    {
      id: "release-date",
      heading: "When will it be released?",
      blocks: [
        "The State Department doesn't announce a release date in advance. The best guide is when past January bulletins appeared. The Internet Archive saves copies of public pages, and its first saved copy of each recent January bulletin shows it was online by mid-December:",
        {
          kind: "table",
          caption: "When recent January bulletins were first saved online",
          head: ["Bulletin", "Online by", "Days before January 1"],
          rows: [
            ["January 2024", "Dec 16, 2023", "16"],
            ["January 2025", "Dec 9, 2024", "23"],
            ["January 2026", "Dec 18, 2025", "14"],
            ["January 2027", "Not out on Nov 24, 2026", "Not known yet"],
          ],
          note: "From the earliest copy in the Internet Archive's Wayback Machine. A bulletin can go online a little before the first saved copy, so these dates are the latest it could have appeared.",
        },
        "This year's December bulletin is running later than the last three, which were all online by mid-November. The State Department hasn't said why, or whether January's will be later too.",
        "After a bulletin is out, USCIS takes a little longer to say which chart people in the U.S. should use. Its filing-charts page says it expects to name the chart “within one week” of the bulletin's publication.",
        {
          kind: "callout",
          tone: "tip",
          title: "How to tell when it's out",
          text: "The official [Visa Bulletin page](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html) lists the current bulletin and the upcoming one. When January 2027 is published, it appears there as the upcoming bulletin. Bookmark that page, or this one.",
        },
      ],
    },
    {
      id: "dates-now",
      heading: "The dates to compare against",
      blocks: [
        "January's dates will be compared with December's once December is out. Until then, November 2026 is the latest official bulletin. These are its dates for the categories people search for most:",
        {
          kind: "table",
          caption: "November 2026 dates for the most-watched categories",
          head: ["Category", "Final action", "Dates for filing"],
          rows: WATCHED_NOVEMBER_2026,
          note: "Dates are written as the bulletin writes them: 15MAR26 is March 15, 2026, and C means current. Most countries means every country except China (mainland born), India, Mexico and the Philippines. Source: [Visa Bulletin for November 2026](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-november-2026.html).",
        },
        "Every November chart, and what changed from October, is in our [November 2026 Visa Bulletin breakdown](/blog/november-2026-visa-bulletin).",
      ],
    },
    {
      id: "last-january",
      heading: "What happened last January",
      blocks: [
        "There's no official forecast, but last year's bulletins show what a January move has looked like. Here are the final action dates in the December 2025 and January 2026 bulletins:",
        {
          kind: "table",
          caption: "Final action dates, December 2025 to January 2026",
          head: ["Category", "December 2025", "January 2026", "Change"],
          rows: [
            ["Family, most countries", "No change", "No change", "Held"],
            ["EB-1 China", "Jan 22, 2023", "Feb 1, 2023", "+10 days"],
            ["EB-1 India", "Mar 15, 2022", "Feb 1, 2023", "+10½ months"],
            ["EB-2 most countries", "Feb 1, 2024", "Apr 1, 2024", "+2 months"],
            ["EB-2 China", "Jun 1, 2021", "Sep 1, 2021", "+3 months"],
            ["EB-2 India", "May 15, 2013", "Jul 15, 2013", "+2 months"],
            ["EB-3 most countries", "Apr 15, 2023", "Apr 22, 2023", "+1 week"],
            ["EB-3 China", "Apr 1, 2021", "May 1, 2021", "+1 month"],
            ["EB-3 India", "Sep 22, 2013", "Nov 15, 2013", "+54 days"],
            ["EB-4", "Sep 1, 2020", "Jan 1, 2021", "+4 months"],
            ["EB-5 unreserved, India", "Jul 1, 2021", "May 1, 2022", "+10 months"],
            ["F2B Mexico", "May 15, 2008", "Nov 15, 2008", "+6 months"],
            ["F3 Philippines", "Nov 1, 2004", "Mar 1, 2005", "+4 months"],
          ],
          note: "Sources: the [December 2025](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-december-2025.html) and [January 2026](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-january-2026.html) Visa Bulletins.",
        },
        [
          "**Family:** every final action date for most countries, China and India stayed where it was. Only Mexico and the Philippines moved, in a few categories.",
          "**Employment:** every EB-1 to EB-4 line with a date moved forward, from one week (EB-3 for most countries) to more than ten months (EB-1 India).",
          "**Dates for Filing:** EB-2 for most countries moved three months, to October 15, 2024. EB-1 China and India both moved to August 1, 2023. EB-3 didn't move. In family, F2A moved one month for every country.",
          "**USCIS** used the Dates for Filing chart for both family and employment cases in January 2026.",
        ],
        {
          kind: "callout",
          tone: "warning",
          title: "Last year isn't a forecast",
          text: "Each month depends on how many people are waiting in each line and how many visas are left. Those numbers change every year, so a category that moved last January can hold or even move back this time.",
        },
      ],
    },
    {
      id: "predictions",
      heading: "Are there official predictions?",
      blocks: [
        "No. The State Department doesn't publish forecasts for upcoming bulletins. When it expects big changes it sometimes adds a note to a bulletin, and December's bulletin is the place such a note about January would appear. The November 2026 bulletin has no notes about the months ahead, and neither did the January 2026 bulletin a year ago.",
        "Predictions you see online are guesses. We don't publish them, because a wrong guess can push someone to rush a filing that gets rejected, or to wait when they didn't need to. What decides the dates, including the yearly and per-country limits, is explained on our [December 2026 page](/blog/december-2026-visa-bulletin#predictions).",
      ],
    },
    {
      id: "which-chart",
      heading: "Which chart will USCIS use in January?",
      blocks: [
        "USCIS won't say until after the January bulletin is published. Each month it picks one chart for people filing Form I-485 from inside the U.S.: Dates for Filing when it expects more visas than applicants, or Final Action Dates when it doesn't.",
        {
          kind: "table",
          caption: "The chart USCIS chose in recent months",
          head: ["Month", "Family", "Employment"],
          rows: [
            ["January 2026", "Dates for Filing", "Dates for Filing"],
            ["October 2026", "Dates for Filing", "Dates for Filing"],
            ["November 2026", "Dates for Filing", "Dates for Filing"],
            ["December 2026", "Not announced yet", "Not announced yet"],
            ["January 2027", "Not announced yet", "Not announced yet"],
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
              text: "If USCIS hasn't named January's chart yet, watch its [filing-charts page](https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin). It usually updates within a week.",
            },
            {
              title: "Compare the dates",
              text: "If your priority date is earlier than the date in your row, or the row says C (current), you can move ahead in January.",
            },
          ],
        },
        "If your date becomes current and you are in the U.S., you can file [Form I-485](/forms/i-485) once it is current on the chart USCIS accepts. If you already filed, a current final action date means your green card can be approved, so keep your address up to date with USCIS.",
      ],
    },
  ],
  faq: [
    {
      q: "Is the January 2027 Visa Bulletin out?",
      a: "Not yet. On November 24, 2026 the newest bulletin was November 2026, and the December bulletin hadn't been published either. We'll update this page the day January's is out.",
    },
    {
      q: "When is the January 2027 Visa Bulletin coming out?",
      a: "The State Department doesn't announce a date. The January 2024, 2025 and 2026 bulletins were online by December 16, December 9 and December 18, about two to three weeks before January began.",
    },
    {
      q: "Is the December 2026 Visa Bulletin out?",
      a: "It wasn't on November 24, 2026. The last three December bulletins were online by mid-November, so this one is later than usual. Our December 2026 Visa Bulletin page is updated the day it's published.",
    },
    {
      q: "Are there official predictions for the January 2027 Visa Bulletin?",
      a: "No. The State Department doesn't publish forecasts, and the November 2026 bulletin has no notes about coming months. Predictions online are guesses.",
    },
    {
      q: "Will EB-2 India move in January 2027?",
      a: "No one outside the government knows. EB-2 India's final action date is November 1, 2013 in the November 2026 bulletin. Last January it moved two months, from May 15 to July 15, 2013, but that isn't a forecast.",
    },
    {
      q: "Will USCIS use the Dates for Filing chart in January 2027?",
      a: "USCIS will say within about a week of the bulletin. It used Dates for Filing for both family and employment cases in January 2026, and in October and November 2026.",
    },
  ],
  sources: [SRC.index, SRC.november, SRC.jan2026, SRC.dec2025, SRC.charts, SRC.archive],
  links: [
    { href: "/blog/december-2026-visa-bulletin", label: "December 2026 Visa Bulletin: release date and current dates" },
    { href: "/blog/november-2026-visa-bulletin", label: "November 2026 Visa Bulletin: what moved and which chart to use" },
    { href: "/forms/i-485", label: "Form I-485: apply for a green card from inside the U.S." },
    { href: "/forms/i-140", label: "Form I-140: petition for a worker" },
    { href: "/forms/i-130", label: "Form I-130: petition for a relative" },
  ],
};
