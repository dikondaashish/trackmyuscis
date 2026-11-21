import { FORMS } from "@/lib/content";
import { TRACK_CASE_HREF, type NavEntry } from "@/lib/site";

/**
 * The header menus. Every public page is reachable from here (single answers and
 * single policies through their hub pages). Built on the server so the form list
 * comes from content.ts without shipping the whole file to the browser.
 */
export const HEADER_NAV: NavEntry[] = [
  {
    kind: "menu",
    label: "Your case",
    items: [
      { href: TRACK_CASE_HREF, label: "Track Case", note: "Check a receipt number" },
      { href: "/status-explained", label: "Case Statuses", note: "What each USCIS status means" },
      { href: "/processing-times", label: "Processing Times", note: "How long your form usually takes" },
      { href: "/alerts", label: "Case Alerts", note: "Email when your status changes. Coming soon" },
    ],
  },
  {
    kind: "menu",
    label: "Forms",
    columns: 2,
    items: FORMS.map((f) => ({ href: `/forms/${f.slug}`, label: f.form, note: f.label })),
    footer: { href: "/forms", label: "All USCIS forms" },
  },
  {
    kind: "menu",
    label: "Resources",
    items: [
      { href: "/answers", label: "Answers", note: "Quick answers to USCIS questions" },
      { href: "/guides", label: "Guides", note: "Step-by-step explainers in plain English" },
      { href: "/lawyers", label: "Find a Lawyer", note: "Licensed attorneys and accredited reps" },
      { href: "/scams", label: "Avoid Scams", note: "Warning signs and where to report" },
      { href: "/help", label: "Help Center", note: "How TrackMyUSCIS works" },
    ],
  },
  { kind: "link", label: "Pricing", href: "/pricing" },
  {
    kind: "menu",
    label: "Company",
    items: [
      { href: "/about", label: "About", note: "Who we are and how we check facts" },
      { href: "/contact", label: "Contact", note: "Questions, corrections and support" },
      { href: "/legal", label: "Policies", note: "Terms, privacy and every other policy" },
    ],
  },
];
