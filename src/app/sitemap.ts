import type { MetadataRoute } from "next";
import { COMPANY, LEGAL_UPDATED } from "@/lib/company";
import { FORMS, GUIDES, TEXT_PAGES } from "@/lib/content";
import { ANSWERS, ANSWERS_UPDATED } from "@/lib/answers";
import { BLOG_POSTS, BLOG_UPDATED } from "@/lib/blog";
import { LEGAL_DOCS } from "@/lib/legal";
import { CONTENT_UPDATED } from "@/lib/seo";
import { PT_CHECKED, PT_FORMS, PT_OFFICE_PAGES } from "@/lib/processing-times";
import { FORMS_UPDATED } from "@/lib/content";
import { FORM_FACTS_CHECKED } from "@/lib/form-facts";
import { listedLawyers } from "@/lib/directory-listings";
import { STATUS_DETAIL_PAGES, statusHref, STATUSES_UPDATED } from "@/lib/statuses";

type Entry = { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"]; updated?: string };

/** Every public page with a fixed last-modified date (never "now", so dates only move when content does). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const legalDate = new Date(LEGAL_UPDATED).toISOString().slice(0, 10);
  const formsDate = FORMS_UPDATED > FORM_FACTS_CHECKED ? FORMS_UPDATED : FORM_FACTS_CHECKED;
  const entries: Entry[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/processing-times", priority: 0.9, freq: "weekly", updated: PT_CHECKED },
    ...PT_FORMS.map((p) => ({ path: `/processing-times/${p.form.slug}`, priority: 0.9, freq: "monthly" as const, updated: PT_CHECKED })),
    ...PT_OFFICE_PAGES.map((o) => ({ path: `/processing-times/${o.p.form.slug}/${o.slug}`, priority: 0.6, freq: "monthly" as const, updated: PT_CHECKED })),
    { path: "/status-explained", priority: 0.9, freq: "monthly", updated: STATUSES_UPDATED },
    ...STATUS_DETAIL_PAGES.map((s) => ({ path: statusHref(s), priority: 0.8, freq: "monthly" as const, updated: STATUSES_UPDATED })),
    { path: "/forms", priority: 0.8, freq: "monthly" },
    { path: "/guides", priority: 0.8, freq: "weekly" },
    { path: "/lawyers", priority: 0.8, freq: "monthly" },
    { path: "/lawyers/join", priority: 0.6, freq: "monthly", updated: legalDate },
    ...(await listedLawyers()).map((l) => ({ path: `/lawyers/${l.slug}`, priority: 0.6, freq: "monthly" as const, updated: l.updated })),
    ...FORMS.map((f) => ({ path: `/forms/${f.slug}`, priority: 0.8, freq: "monthly" as const, updated: formsDate })),
    ...GUIDES.map((g) => ({ path: `/guides/${g.slug}`, priority: 0.7, freq: "monthly" as const })),
    { path: "/answers", priority: 0.8, freq: "weekly", updated: ANSWERS_UPDATED },
    ...ANSWERS.map((a) => ({ path: `/answers/${a.slug}`, priority: 0.7, freq: "monthly" as const, updated: ANSWERS_UPDATED })),
    { path: "/blog", priority: 0.8, freq: "weekly", updated: BLOG_UPDATED },
    ...BLOG_POSTS.map((p) => ({ path: `/blog/${p.slug}`, priority: 0.8, freq: "weekly" as const, updated: p.updated })),
    { path: "/help", priority: 0.6, freq: "monthly" },
    { path: "/pricing", priority: 0.5, freq: "monthly" },
    ...Object.keys(TEXT_PAGES)
      .filter((k) => !TEXT_PAGES[k].noindex)
      .map((k) => ({ path: `/${k}`, priority: 0.5, freq: "monthly" as const })),
    { path: "/legal", priority: 0.3, freq: "yearly", updated: legalDate },
    ...Object.entries(LEGAL_DOCS).map(([k, d]) => ({
      path: `/${k}`,
      priority: d.policy ? 0.3 : 0.6,
      freq: (d.policy ? "yearly" : "monthly") as Entry["freq"],
      updated: d.policy ? legalDate : undefined,
    })),
  ];
  return entries.map((e) => ({
    url: `${COMPANY.siteUrl}${e.path}`,
    lastModified: e.updated ?? CONTENT_UPDATED,
    changeFrequency: e.freq,
    priority: e.priority,
  }));
}
