import type { MetadataRoute } from "next";
import { COMPANY, LEGAL_UPDATED } from "@/lib/company";
import { FORMS, GUIDES, TEXT_PAGES } from "@/lib/content";
import { ANSWERS, ANSWERS_UPDATED } from "@/lib/answers";
import { BLOG_POSTS, BLOG_UPDATED } from "@/lib/blog";
import { LEGAL_DOCS } from "@/lib/legal";
import { CONTENT_UPDATED } from "@/lib/seo";

type Entry = { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"]; updated?: string };

/** Every public page with a fixed last-modified date (never "now", so dates only move when content does). */
export default function sitemap(): MetadataRoute.Sitemap {
  const legalDate = new Date(LEGAL_UPDATED).toISOString().slice(0, 10);
  const entries: Entry[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/processing-times", priority: 0.9, freq: "weekly" },
    { path: "/status-explained", priority: 0.9, freq: "monthly" },
    { path: "/forms", priority: 0.8, freq: "monthly" },
    { path: "/guides", priority: 0.8, freq: "weekly" },
    { path: "/lawyers", priority: 0.8, freq: "monthly" },
    ...FORMS.map((f) => ({ path: `/forms/${f.slug}`, priority: 0.8, freq: "monthly" as const })),
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
