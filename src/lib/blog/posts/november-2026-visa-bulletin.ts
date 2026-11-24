/**
 * Facts checked 2026-11-23 against the November and October 2026 Visa Bulletins on
 * travel.state.gov and the USCIS "Adjustment of Status Filing Charts" page (updated 11/02/2026).
 * When the December 2026 bulletin is published, update the tables, `updated` and the slug's sibling post.
 */
import cover from "@/assets/blog/november-2026-visa-bulletin.jpg";
import type { BlogPost } from "../types";

const COLS = ["Category", "Most countries", "China", "India", "Mexico", "Philippines"];

const SRC = {
  november: {
    label: "U.S. Department of State: Visa Bulletin for November 2026",
    href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-november-2026.html",
  },
  october: {
    label: "U.S. Department of State: Visa Bulletin for October 2026",
    href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-october-2026.html",
  },
  charts: {
    label: "USCIS: Adjustment of status filing charts from the Visa Bulletin",
    href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin",
  },
  bulletin: { label: "U.S. Department of State: The Visa Bulletin", href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" },
};

export const novemberVisaBulletin2026: BlogPost = {
  slug: "november-2026-visa-bulletin",
  title: "November 2026 Visa Bulletin: what moved and which chart to use",
  seoTitle: "November 2026 Visa Bulletin Explained (Charts + Changes)",
  description:
    "The November 2026 Visa Bulletin in plain English: every family and employment cut-off date, what moved since October, and which chart USCIS accepts.",
  topic: "Visa Bulletin",
  published: "2026-11-23",
  updated: "2026-11-23",
  cover: { src: cover, alt: "Soft blue calendar tiles in a row, one raised in teal, with a path moving forward between them" },
  answer:
    "In the November 2026 Visa Bulletin, most family categories moved forward a full year from October, and EB-2 for most countries moved forward three months. India and China moved little in employment categories. For November, USCIS accepts adjustment of status applications using the Dates for Filing chart for both family and employment cases.",
  takeaways: [
    "Family F1, F2B, F3 and F4 final action dates for most countries each moved forward 12 months.",
    "EB-2 for most countries moved from January 1, 2025 to April 1, 2025. EB-1 stays current for most countries.",
    "EB-2 India (November 1, 2013) and EB-2 China (October 1, 2021) did not move.",
    "USCIS says to use the Dates for Filing chart in November for both family and employment-based adjustment.",
    "The December 2026 bulletin isn't out yet. USCIS usually names its chart within about a week of the bulletin.",
  ],
  sections: [
    {
      id: "how-it-works",
      heading: "How the Visa Bulletin works",
      blocks: [
        "Green cards in the family and employment preference categories have yearly limits, and each country can use only a share of them. When more people qualify than there are visas, a line forms. The Visa Bulletin, published each month by the U.S. Department of State, shows where each line has reached.",
        "Your place in line is your **priority date**. For most employment cases it's the date your PERM labor certification was filed, or the date USCIS received your I-140 if no PERM was needed. For family cases it's the date USCIS received the I-130. It's printed on your I-797 receipt or approval notice.",
        {
          kind: "steps",
          items: [
            { title: "Final Action Dates", text: "The date a green card can actually be approved. If your priority date is earlier than the date shown, a visa is available to you." },
            { title: "Dates for Filing", text: "An earlier signal that lets you prepare and, when USCIS allows it, file your I-485 before the final action date is reached." },
            { title: "“C” means current", text: "Everyone in that category and country can move ahead, whatever their priority date." },
          ],
        },
      ],
    },
    {
      id: "employment",
      heading: "Employment-based dates for November 2026",
      blocks: [
        {
          kind: "table",
          caption: "Final Action Dates, employment-based, November 2026",
          head: COLS,
          rows: [
            ["EB-1", "C", "01AUG23", "01FEB23", "C", "C"],
            ["EB-2", "01APR25", "01OCT21", "01NOV13", "01APR25", "01APR25"],
            ["EB-3", "15JUN24", "22JAN22", "22JAN14", "15JUN24", "15AUG23"],
            ["Other workers", "01JUN22", "01OCT19", "22JAN14", "01JUN22", "01JAN22"],
            ["EB-4", "15DEC22", "15DEC22", "15DEC22", "15DEC22", "15DEC22"],
            ["EB-5 unreserved", "C", "01DEC16", "01DEC23", "C", "C"],
            ["EB-5 set-asides", "C", "C", "C", "C", "C"],
          ],
          note: "Dates are written as the bulletin writes them: 01APR25 is April 1, 2025. Source: [Visa Bulletin for November 2026](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-november-2026.html).",
        },
        {
          kind: "table",
          caption: "Dates for Filing, employment-based, November 2026",
          head: COLS,
          rows: [
            ["EB-1", "C", "01JUL24", "01JUL24", "C", "C"],
            ["EB-2", "15MAR26", "01JAN23", "15JAN15", "15MAR26", "15MAR26"],
            ["EB-3", "01AUG24", "01APR24", "15JAN15", "01AUG24", "01JAN24"],
            ["Other workers", "01JUL22", "01OCT20", "15JAN15", "01JUL22", "01JUN22"],
            ["EB-4", "01JAN25", "01JAN25", "01JAN25", "01JAN25", "01JAN25"],
            ["EB-5 unreserved", "C", "01MAR21", "01MAY24", "C", "C"],
            ["EB-5 set-asides", "C", "C", "C", "C", "C"],
          ],
        },
      ],
    },
    {
      id: "family",
      heading: "Family-based dates for November 2026",
      blocks: [
        {
          kind: "table",
          caption: "Final Action Dates, family-sponsored, November 2026",
          head: COLS,
          rows: [
            ["F1", "22JAN21", "22JAN21", "22JAN21", "22SEP08", "01NOV13"],
            ["F2A", "22OCT26", "22OCT26", "22OCT26", "22APR26", "22OCT26"],
            ["F2B", "22AUG20", "22AUG20", "22AUG20", "15MAY10", "01OCT13"],
            ["F3", "22OCT15", "22OCT15", "22OCT15", "15JUL01", "22JUL06"],
            ["F4", "22OCT12", "22OCT12", "15DEC06", "22APR01", "15MAY08"],
          ],
          note: "F1: unmarried adult children of U.S. citizens. F2A: spouses and children of permanent residents. F2B: unmarried adult children of permanent residents. F3: married children of U.S. citizens. F4: brothers and sisters of adult U.S. citizens.",
        },
        {
          kind: "table",
          caption: "Dates for Filing, family-sponsored, November 2026",
          head: COLS,
          rows: [
            ["F1", "01FEB21", "01FEB21", "01FEB21", "01DEC08", "22APR15"],
            ["F2A", "C", "C", "C", "C", "C"],
            ["F2B", "01SEP20", "01SEP20", "01SEP20", "22MAR11", "01OCT14"],
            ["F3", "01NOV15", "01NOV15", "01NOV15", "01DEC02", "22OCT06"],
            ["F4", "01NOV12", "01NOV12", "01FEB07", "30APR01", "22MAR09"],
          ],
        },
      ],
    },
    {
      id: "what-moved",
      heading: "What moved since October",
      blocks: [
        "Comparing the November final action dates with the [October 2026 bulletin](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-october-2026.html):",
        [
          "**Family, most countries:** F1, F2B, F3 and F4 each moved forward 12 months. F2A moved one month, to October 22, 2026.",
          "**Family, Mexico:** F1 moved from September 8 to September 22, 2008, and F3 from July 1 to July 15, 2001. F2B and F4 held.",
          "**Family, India and the Philippines:** F4 India held at December 15, 2006. The Philippines held in every family category.",
          "**EB-1:** current for most countries. China moved one month to August 1, 2023; India held at February 1, 2023.",
          "**EB-2:** most countries moved three months to April 1, 2025. China and India held.",
          "**EB-3:** most countries moved one month to June 15, 2024. China and India moved a few weeks, to January 22, 2022 and January 22, 2014.",
          "**Other workers:** most countries moved five months to June 1, 2022.",
          "**EB-4:** held at December 15, 2022.",
        ],
        {
          kind: "callout",
          tone: "info",
          title: "Why family dates jumped",
          text: "October starts the government's fiscal year, when a new year of visa numbers becomes available. Large early moves are common, and dates can slow or even move back later in the year if demand is high.",
        },
      ],
    },
    {
      id: "which-chart",
      heading: "Which chart USCIS accepts in November",
      blocks: [
        "The bulletin itself only publishes the dates. USCIS decides each month which chart people already in the U.S. use to file Form I-485. For November 2026, USCIS says to use the **Dates for Filing** chart for all family-sponsored and employment-based categories.",
        "USCIS also notes that if your category is current, or has a later date, on the Final Action chart, you may use that chart instead.",
        {
          kind: "callout",
          tone: "tip",
          title: "Applying from outside the U.S.?",
          text: "The National Visa Center uses the Dates for Filing chart to tell you when to send documents, and the Final Action chart to schedule your interview.",
        },
      ],
    },
    {
      id: "check-your-date",
      heading: "How to check if your date is current",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Find your priority date", text: "It's on your I-797 receipt or approval notice for the I-130 or I-140. See [what Form I-797 is](/answers/what-is-form-i-797)." },
            { title: "Find your category and country", text: "Your preference category (for example EB-2 or F2B) and your country of chargeability, which is usually your country of birth." },
            { title: "Check the chart USCIS accepts this month", text: "If your priority date is earlier than the date in your row, or the row says C, you can move ahead." },
            { title: "Look again each month", text: "Dates can move forward, hold or move back. A new bulletin is usually published around the middle of the month before." },
          ],
        },
      ],
    },
    {
      id: "december",
      heading: "What to expect for December",
      blocks: [
        "The December 2026 Visa Bulletin hadn't been published when we checked on November 23, 2026. When it is, the State Department posts it on [its Visa Bulletin page](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html), and USCIS updates its filing-charts page, usually within about a week, to say which chart applies.",
        "We don't publish predictions. Cut-off dates depend on demand the government doesn't make public in advance, and a wrong guess could lead to a rushed or rejected filing.",
      ],
    },
  ],
  faq: [
    {
      q: "What does “C” mean in the Visa Bulletin?",
      a: "C means current: there is no waiting line for that category and country, so anyone who qualifies can move ahead whatever their priority date.",
    },
    {
      q: "Can I file my I-485 in November 2026?",
      a: "If you're in the U.S. and your priority date is earlier than the date on the Dates for Filing chart for your category and country, USCIS accepts your I-485 in November 2026. Your underlying petition must also allow you to file.",
    },
    {
      q: "Where do I find my priority date?",
      a: "On the I-797 receipt or approval notice for your I-130 or I-140. For employment cases that needed PERM, it's the date the labor certification was filed.",
    },
    {
      q: "What happens if my date moves back?",
      a: "That's called retrogression. If it happens after you filed, your pending case usually waits until your date is current again. You don't lose your place in line.",
    },
    {
      q: "When is the next Visa Bulletin published?",
      a: "Usually around the middle of the month before it applies. The December 2026 bulletin wasn't out yet on November 23, 2026.",
    },
  ],
  sources: [SRC.november, SRC.october, SRC.charts, SRC.bulletin],
  links: [
    { href: "/forms/i-485", label: "Form I-485: apply for a green card from inside the U.S." },
    { href: "/forms/i-130", label: "Form I-130: petition for a relative" },
    { href: "/forms/i-140", label: "Form I-140: petition for a worker" },
    { href: "/answers/what-is-form-i-797", label: "What is Form I-797?" },
  ],
};
