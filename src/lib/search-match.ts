import { normalizeReceipt } from "@/lib/receipt";
import type { SearchEntry } from "@/lib/search";

/**
 * Matching for site search, shared by the /search page and the header's quick search.
 * Runs in the browser; nothing typed is sent anywhere or put in the address bar.
 */

/** Lowercase, no punctuation, and form codes joined so "I-485", "i 485" and "i485" all match. */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b([a-z]) (\d{2,3}[a-z]?)\b/g, "$1$2")
    .trim();

/** Words that say nothing about the topic; dropped unless they are the whole query. */
const FILLER = new Set(["a", "an", "the", "is", "are", "was", "my", "me", "i", "do", "does", "did", "to", "of", "for", "in", "on", "it", "what", "how", "why", "when", "can", "mean", "means", "uscis"]);

export type PreparedEntry = { entry: SearchEntry; title: string; all: string };

export const prepareIndex = (index: SearchEntry[]): PreparedEntry[] =>
  index.map((e) => ({ entry: e, title: normalize(e.title), all: normalize(`${e.title} ${e.text} ${e.more}`) }));

export function matchSearch(prepared: PreparedEntry[], query: string, limit = 12) {
  const q = normalize(query);
  const allWords = q.split(" ").filter(Boolean);
  const topicWords = allWords.filter((w) => !FILLER.has(w));
  const words = topicWords.length ? topicWords : allWords;

  const scored = prepared
    .map((p) => {
      const hits = words.filter((w) => p.all.includes(w)).length;
      const titleHits = words.filter((w) => p.title.includes(w)).length;
      return { entry: p.entry, hits, score: hits * 2 + titleHits * 3 + (q && p.title.includes(q) ? 5 : 0) };
    })
    .filter((s) => s.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.score - a.score);

  const best = scored[0]?.hits ?? 0;
  return {
    words,
    exact: best === words.length,
    results: scored.filter((s) => s.hits === best).slice(0, limit).map((s) => s.entry),
    /** People paste their receipt number into any search box; point them to the check instead. */
    looksLikeReceipt: /^[A-Z]{3}\d{6,10}$/.test(normalizeReceipt(query)),
  };
}
