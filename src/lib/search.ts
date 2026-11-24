/**
 * Site search index, built on the server from the same content the pages use, so a new
 * form, answer or guide is searchable as soon as it is added.
 */
import { ANSWERS } from "@/lib/answers";
import { BLOG_POSTS } from "@/lib/blog";
import { FAQ, FORMS, GUIDES } from "@/lib/content";
import { FORM_FACTS } from "@/lib/form-facts";
import { STATUS_PAGES, statusHref } from "@/lib/statuses";
import { formatTime, PT_FORMS, PT_OFFICE_PAGES, rangeSummary } from "@/lib/processing-times";

export type SearchKind = "Status" | "Form" | "Answer" | "Guide" | "Article" | "Help" | "Page";

export type SearchEntry = {
  kind: SearchKind;
  title: string;
  /** One or two sentences shown under the title. */
  text: string;
  href: string;
  /** Extra words that should find this entry but are not shown. */
  more: string;
};

/** Tool and help pages that have no entry of their own in the content lists. */
const PAGES: SearchEntry[] = [
  {
    kind: "Page",
    title: "USCIS processing times",
    text: "How to check how long USCIS is taking for your form and office, and what the numbers mean.",
    href: "/processing-times",
    more: "how long wait delay office service center field office case inquiry",
  },
  {
    kind: "Page",
    title: "Find a lawyer",
    text: "Where to find a licensed immigration attorney or an accredited representative, including free and low-cost help.",
    href: "/lawyers",
    more: "attorney legal help pro bono accredited representative nonprofit",
  },
  {
    kind: "Page",
    title: "List your immigration practice",
    text: "For attorneys and DOJ-accredited representatives: apply to be listed in the lawyer directory. Free during launch.",
    href: "/lawyers/join",
    more: "lawyer directory join apply listing fee advertise attorney accredited representative",
  },
  {
    kind: "Page",
    title: "Avoid immigration scams",
    text: "Rules to avoid immigration scams, the warning signs, and where to report a scam.",
    href: "/scams",
    more: "fraud notario fake phone call payment report ftc",
  },
  {
    kind: "Page",
    title: "Check a receipt number",
    text: "Check that a receipt number is written correctly and see which USCIS office issued it. To see its status, save it in a free account.",
    href: "/#track",
    more: "track case tracker decode prefix office",
  },
];

export function buildSearchIndex(): SearchEntry[] {
  return [
    ...STATUS_PAGES.map((s) => ({
      kind: "Status" as const,
      title: s.name,
      text: s.meaning,
      href: statusHref(s),
      more: ["case status meaning", ...(s.alsoShownAs ?? []), ...(s.faq ?? []).map((f) => f.q)].join(" "),
    })),
    ...ANSWERS.map((a) => ({
      kind: "Answer" as const,
      title: a.question,
      text: a.short,
      href: `/answers/${a.slug}`,
      more: [a.topic, a.seoTitle ?? "", ...a.sections.map((s) => s.heading)].join(" "),
    })),
    ...FORMS.map((f) => ({
      kind: "Form" as const,
      title: `Form ${f.form}: ${f.title}`,
      text: f.about,
      href: `/forms/${f.slug}`,
      more: [f.label, "fee cost documents checklist who files edition", FORM_FACTS[f.slug]?.who ?? "", ...f.sections.map((s) => s.heading), ...f.milestones].join(" "),
    })),
    ...PT_FORMS.map((p) => ({
      kind: "Page" as const,
      title: `Form ${p.form.form} processing time`,
      text: `Official USCIS time: ${rangeSummary(p)}.`,
      href: `/processing-times/${p.form.slug}`,
      more: `how long wait ${p.form.label} ${p.form.title} office field office service center ${p.categories.map((c) => c.name).join(" ")}`,
    })),
    ...PT_OFFICE_PAGES.map((o) => ({
      kind: "Page" as const,
      title: `Form ${o.p.form.form} processing time in ${o.name}`,
      text: `Official USCIS time at this field office: ${formatTime(o.office)}.`,
      href: `/processing-times/${o.p.form.slug}/${o.slug}`,
      more: `how long wait field office ${o.p.form.label} ${o.category.name}`,
    })),
    ...GUIDES.map((g) => ({
      kind: "Guide" as const,
      title: g.title,
      text: g.summary,
      href: `/guides/${g.slug}`,
      more: [g.seoTitle ?? "", ...g.sections.map((s) => s.heading)].join(" "),
    })),
    ...BLOG_POSTS.map((p) => ({
      kind: "Article" as const,
      title: p.title,
      text: p.description,
      href: `/blog/${p.slug}`,
      more: [p.topic, p.seoTitle ?? "", ...p.sections.map((s) => s.heading), ...p.faq.map((f) => f.q)].join(" "),
    })),
    ...FAQ.map((f) => ({ kind: "Help" as const, title: f.q, text: f.a, href: "/help", more: "help center" })),
    ...PAGES,
  ];
}
