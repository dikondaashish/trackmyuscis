/**
 * Blog posts worth reading from a form page or a processing-time page. A post is related to a
 * form when it links to that form's page; FIRST puts the most useful ones at the top.
 */
import { BLOG_POSTS, type BlogPost } from "@/lib/blog";

const FIRST: Record<string, string[]> = {
  "i-765": ["ead-delays-2026", "opt-processing-time-2026", "h4-ead-2026", "stem-opt-extension-2026", "start-work-before-ead", "opt-premium-processing-2026"],
  "i-140": ["i-140-status-check", "december-2026-visa-bulletin", "january-2027-visa-bulletin"],
  "i-485": ["december-2026-visa-bulletin", "january-2027-visa-bulletin", "i-140-status-check"],
  "i-130": ["december-2026-visa-bulletin", "january-2027-visa-bulletin"],
};

export function postsForForm(formSlug: string, max = 4): BlogPost[] {
  const paths = [`/forms/${formSlug}`, `/processing-times/${formSlug}`];
  const first = (FIRST[formSlug] ?? []).flatMap((slug) => BLOG_POSTS.filter((p) => p.slug === slug));
  const linked = BLOG_POSTS.filter((p) => p.links.some((l) => paths.includes(l.href)));
  return [...new Set([...first, ...linked])].slice(0, max);
}
