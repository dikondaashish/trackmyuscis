/**
 * Blog posts are typed data rendered by one template (src/app/(site)/blog/[slug]/page.tsx),
 * so adding a post means adding one file in src/lib/blog/posts and listing it in index.ts.
 *
 * Inline syntax in any text: [link text](/path or https://…).
 */
import type { StaticImageData } from "next/image";
import type { AuthorId } from "./authors";

export type BlogTopic = "Visa Bulletin" | "Students & OPT" | "Green card" | "Employment-based" | "Case status";

export type Block =
  /** A paragraph. */
  | string
  /** A bullet list. */
  | string[]
  /** Numbered steps with a short title each. */
  | { kind: "steps"; items: { title: string; text: string }[] }
  /** A data table. The first column is the row label. */
  | { kind: "table"; caption: string; head: string[]; rows: string[][]; note?: string }
  /** A highlighted note: info (blue), warning (amber) or tip (teal). */
  | { kind: "callout"; tone: "info" | "warning" | "tip"; title: string; text: string };

export type BlogSection = {
  /** Anchor id, used by the contents list. */
  id: string;
  heading: string;
  blocks: Block[];
};

export type BlogPost = {
  slug: string;
  /** The h1. */
  title: string;
  /** Search title when it should differ from the h1 (under ~60 characters). */
  seoTitle?: string;
  /** Search and social description, 140–160 characters. */
  description: string;
  topic: BlogTopic;
  /** ISO dates (YYYY-MM-DD). */
  published: string;
  /** Byline, from authors.ts. */
  author: AuthorId;
  updated: string;
  cover: { src: StaticImageData; alt: string };
  /** The direct answer, two or three sentences. Shown first; AI assistants quote it. */
  answer: string;
  takeaways: string[];
  sections: BlogSection[];
  faq: { q: string; a: string }[];
  sources: { label: string; href: string }[];
  /** Other pages on this site worth reading next (forms, answers, tools). */
  links: { href: string; label: string }[];
};
