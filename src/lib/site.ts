/** Central site map: navigation, footer and the required disclaimer. Page content lives in content.ts. */

export type NavLink = { href: string; label: string };

/** What people come for, in the order they need it. Four items, no more. */
export const PRIMARY_NAV: NavLink[] = [
  { href: "/status-explained", label: "Case Statuses" },
  { href: "/processing-times", label: "Processing Times" },
  { href: "/answers", label: "Answers" },
  { href: "/lawyers", label: "Find a Lawyer" },
];

/** Quieter links for the phone menu, where the footer is a long scroll away. */
export const SECONDARY_NAV: NavLink[] = [
  { href: "/forms", label: "USCIS Forms" },
  { href: "/guides", label: "Guides" },
  { href: "/help", label: "Help Center" },
];

export const TRACK_CASE_HREF = "/#track";

/** True when `pathname` is the nav item's page or a page under it (e.g. /answers/x under /answers). */
export const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export const FOOTER_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: TRACK_CASE_HREF, label: "Track Case" },
      { href: "/status-explained", label: "Case Statuses" },
      { href: "/processing-times", label: "Processing Times" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/answers", label: "USCIS Answers" },
      { href: "/forms", label: "USCIS Forms" },
      { href: "/guides", label: "Immigration Guides" },
      { href: "/lawyers", label: "Find a Lawyer" },
      { href: "/scams", label: "Avoid Scams" },
      { href: "/help", label: "Help Center" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/privacy-choices", label: "Your Privacy Choices" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/legal", label: "All Policies" },
    ],
  },
];

export const DISCLAIMER =
  "TrackMyUSCIS is an independent service and is not affiliated with, endorsed by, or operated by U.S. Citizenship and Immigration Services (USCIS) or the U.S. government.";
