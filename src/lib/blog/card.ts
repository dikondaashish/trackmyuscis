import type { BlogCardData } from "@/components/blog/BlogCard";
import { longDate } from "@/lib/seo";
import { AUTHORS } from "./authors";
import { readingMinutes } from "./index";
import type { BlogPost } from "./types";

/** The card fields for a post: its byline, publish date and reading time. Server-side only, so post bodies stay out of client bundles. */
export const toBlogCard = (p: BlogPost): BlogCardData => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  topic: p.topic,
  author: AUTHORS[p.author].name,
  date: longDate(p.published),
  minutes: readingMinutes(p),
  cover: p.cover,
});

