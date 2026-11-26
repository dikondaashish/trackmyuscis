/** Central site map: navigation, footer and the required disclaimer. Page content lives in content.ts. */

export type NavLink = { href: string; label: string };

/** A link inside a header menu: label plus one short line saying what the page is for. */
export type MenuItem = NavLink & { note?: string };

/** One header entry: a plain link, or a menu that opens a dropdown. Built in nav.ts. */
export type NavEntry =
  | { kind: "link"; label: string; href: string }
  | { kind: "menu"; label: string; items: MenuItem[]; columns?: 1 | 2; footer?: NavLink };

export const TRACK_CASE_HREF = "/#track";

/** True when `pathname` is the nav item's page or a page under it (e.g. /answers/x under /answers). */
export const isCurrent = (pathname: string, href: string) =>
  !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

/** The one link in a list that matches the page best (the longest match), so /forms/i-485 marks I-485, not "All forms". */
export const bestMatch = (pathname: string, links: NavLink[]) =>
  links
    .filter((l) => isCurrent(pathname, l.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

/** True when the page is one of the menu's links (or its footer link). */
export const menuIsCurrent = (pathname: string, entry: NavEntry) =>
  entry.kind === "link"
    ? isCurrent(pathname, entry.href)
    : [...entry.items, ...(entry.footer ? [entry.footer] : [])].some((i) => isCurrent(pathname, i.href));

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
      { href: "/blog", label: "Blog" },
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
      { href: "/lawyers/join", label: "For Lawyers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/privacy-choices", label: "Your Privacy Choices" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/advertising", label: "Advertising" },
      { href: "/refunds", label: "Refund Policy" },
      { href: "/security", label: "Security" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/legal", label: "All Policies" },
    ],
  },
];

/** One-line version for small print (site footer, sign-in panel). Legal pages use DISCLAIMER. */
export const SHORT_DISCLAIMER = "Independent. Not affiliated with USCIS or the U.S. government.";

export const DISCLAIMER =
  "TrackMyUSCIS is an independent service and is not affiliated with, endorsed by, or operated by U.S. Citizenship and Immigration Services (USCIS) or the U.S. government.";
