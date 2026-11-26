import { BLOG_POSTS } from "@/lib/blog";
import { FORMS } from "@/lib/content";
import { PT_CHECKED } from "@/lib/processing-times";
import { longDate } from "@/lib/seo";
import type { NavEntry } from "@/lib/site";

/**
 * The header menus. The Track Case button sits beside them; About, Contact and the
 * policies live in the footer. Built on the server so the form list
 * comes from content.ts without shipping the whole file to the browser.
 */
export const HEADER_NAV: NavEntry[] = [
  {
    kind: "menu",
    label: "Track",
    items: [
      { href: "/status-explained", label: "Case Statuses", note: "What each USCIS status means", icon: "statuses" },
      { href: "/processing-times", label: "Processing Times", note: "How long your form usually takes", icon: "times" },
      { href: "/alerts", label: "Case Alerts", note: "Email when your status changes. Coming soon", icon: "alerts" },
    ],
    featured: {
      label: `Updated ${longDate(PT_CHECKED)}`,
      title: "See how long USCIS is taking for your form",
      href: "/processing-times",
      cta: "Check times",
    },
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
      { href: "/answers", label: "Answers", note: "Quick answers to USCIS questions", icon: "answers" },
      { href: "/guides", label: "Guides", note: "Step-by-step explainers in plain English", icon: "guides" },
      { href: "/blog", label: "Blog", note: "Visa Bulletin, fees and USCIS updates", icon: "blog" },
      { href: "/lawyers", label: "Find a Lawyer", note: "Licensed attorneys and accredited reps", icon: "lawyers" },
      { href: "/scams", label: "Avoid Scams", note: "Warning signs and where to report", icon: "scams" },
      { href: "/help", label: "Help Center", note: "How TrackMyUSCIS works", icon: "help" },
    ],
    featured: {
      label: "Latest from the blog",
      title: BLOG_POSTS[0].title,
      href: `/blog/${BLOG_POSTS[0].slug}`,
      cta: "Read post",
    },
  },
  { kind: "link", label: "Pricing", href: "/pricing" },
];
