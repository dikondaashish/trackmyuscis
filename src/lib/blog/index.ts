/**
 * The blog: every post, newest first, plus reading time and related posts. Facts in each
 * post are checked against the official sources listed on it; `updated` moves when they are.
 */
import type { Block, BlogPost, BlogTopic } from "./types";
import { decemberVisaBulletin2026 } from "./posts/december-2026-visa-bulletin";
import { januaryVisaBulletin2027 } from "./posts/january-2027-visa-bulletin";
import { optProcessingTime2026 } from "./posts/opt-processing-time-2026";
import { uscisPhoneNumberLivePerson } from "./posts/uscis-phone-number-live-person";
import { uscisExpediteRequest } from "./posts/uscis-expedite-request";
import { newCardIsBeingProduced } from "./posts/new-card-is-being-produced";
import { stemOptPending180Days } from "./posts/stem-opt-pending-180-days";
import { stemOptExtension2026 } from "./posts/stem-opt-extension-2026";
import { optPremiumProcessing2026 } from "./posts/opt-premium-processing-2026";
import { optUnemployment90Days } from "./posts/opt-unemployment-90-days";
import { proposedOptFee2026 } from "./posts/proposed-opt-fee-2026";
import { f1FixedAdmissionRuleOnHold } from "./posts/f1-fixed-admission-rule-on-hold";
import { h4Ead2026 } from "./posts/h4-ead-2026";
import { eadDelays2026 } from "./posts/ead-delays-2026";
import { travelOnOpt2026 } from "./posts/travel-on-opt-2026";
import { stemDegreeEligibleCipCode } from "./posts/stem-degree-eligible-cip-code";
import { startWorkBeforeEad } from "./posts/start-work-before-ead";
import { f1GracePeriod60Days } from "./posts/f1-grace-period-60-days";
import { novemberVisaBulletin2026 } from "./posts/november-2026-visa-bulletin";
import { greenCardRenewal } from "./posts/green-card-renewal-i-90";
import { i140Status } from "./posts/i-140-status-check";

export type { Block, BlogPost, BlogSection, BlogTopic } from "./types";
export { AUTHORS, type AuthorId } from "./authors";

/** Newest first; posts published the same day keep this list's order (the first is featured). */
export const BLOG_POSTS: BlogPost[] = [
  uscisPhoneNumberLivePerson,
  uscisExpediteRequest,
  newCardIsBeingProduced,
  stemOptPending180Days,
  decemberVisaBulletin2026,
  januaryVisaBulletin2027,
  optProcessingTime2026,
  stemOptExtension2026,
  optPremiumProcessing2026,
  optUnemployment90Days,
  proposedOptFee2026,
  novemberVisaBulletin2026,
  i140Status,
  greenCardRenewal,
  f1FixedAdmissionRuleOnHold,
  h4Ead2026,
  eadDelays2026,
  travelOnOpt2026,
  stemDegreeEligibleCipCode,
  startWorkBeforeEad,
  f1GracePeriod60Days,
].sort((a, b) =>
  b.published.localeCompare(a.published),
);

/** Topics in the order the blog's filter shows them. */
export const BLOG_TOPICS: BlogTopic[] = ["Visa Bulletin", "Students & OPT", "Green card", "Employment-based", "Case status"];

/** Newest `updated` date across posts, for the sitemap and the feed. */
export const BLOG_UPDATED = BLOG_POSTS.reduce((max, p) => (p.updated > max ? p.updated : max), "2026-11-23");

export const getPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);

const words = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "").split(/\s+/).filter(Boolean).length;

function blockWords(b: Block): number {
  if (typeof b === "string") return words(b);
  if (Array.isArray(b)) return b.reduce((n, s) => n + words(s), 0);
  if (b.kind === "steps") return b.items.reduce((n, s) => n + words(s.title) + words(s.text), 0);
  if (b.kind === "table") return b.rows.flat().reduce((n, s) => n + words(s), 0) / 2;
  return words(b.title) + words(b.text);
}

/** Minutes at 220 words a minute, never under 2. */
export function readingMinutes(p: BlogPost) {
  const total =
    words(p.answer) +
    p.takeaways.reduce((n, t) => n + words(t), 0) +
    p.sections.reduce((n, s) => n + s.blocks.reduce((m, b) => m + blockWords(b), 0), 0) +
    p.faq.reduce((n, f) => n + words(f.q) + words(f.a), 0);
  return Math.max(2, Math.round(total / 220));
}

/**
 * Same topic first, then the others. The list starts just after the post itself and wraps
 * round, so every post is linked from other posts instead of all of them linking to the same newest three.
 */
export function relatedPosts(p: BlogPost, count = 3) {
  const at = BLOG_POSTS.findIndex((x) => x.slug === p.slug);
  const after = [...BLOG_POSTS.slice(at + 1), ...BLOG_POSTS.slice(0, Math.max(at, 0))];
  return [...after.filter((x) => x.topic === p.topic), ...after.filter((x) => x.topic !== p.topic)].slice(0, count);
}
