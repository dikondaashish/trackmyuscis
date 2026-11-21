"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { normalizeReceipt } from "@/lib/receipt";
import type { SearchEntry } from "@/lib/search";
import { btnPrimary, field, fieldLabel, focusRing, panel, rowArrow, rowLink, rows } from "@/lib/ui";

/** Lowercase, no punctuation, and form codes joined so "I-485", "i 485" and "i485" all match. */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b([a-z]) (\d{2,3}[a-z]?)\b/g, "$1$2")
    .trim();

/** Words that say nothing about the topic; dropped unless they are the whole query. */
const FILLER = new Set(["a", "an", "the", "is", "are", "was", "my", "me", "i", "do", "does", "did", "to", "of", "for", "in", "on", "it", "what", "how", "why", "when", "can", "mean", "means", "uscis"]);

const BROWSE = [
  { href: "/status-explained", label: "Case statuses" },
  { href: "/answers", label: "USCIS answers" },
  { href: "/forms", label: "USCIS forms" },
  { href: "/guides", label: "Immigration guides" },
];

const row = `${rowLink} items-start`;
const arrow = `${rowArrow} mt-1`;

/**
 * One field over everything on the site. The index is small, so matching runs in the
 * browser as you type and nothing typed here is sent anywhere or put in the address bar.
 */
export function SiteSearch({ index }: { index: SearchEntry[] }) {
  const inputId = useId();
  const countId = useId();
  const [query, setQuery] = useState("");

  const prepared = useMemo(
    () => index.map((e) => ({ entry: e, title: normalize(e.title), all: normalize(`${e.title} ${e.text} ${e.more}`) })),
    [index],
  );

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
  const exact = best === words.length;
  const results = scored.filter((s) => s.hits === best).slice(0, 12);

  /** People paste their receipt number into any search box; point them to the check instead. */
  const looksLikeReceipt = /^[A-Z]{3}\d{6,10}$/.test(normalizeReceipt(query));

  return (
    <>
      <label htmlFor={inputId} className={fieldLabel}>
        Search TrackMyUSCIS
      </label>
      <div className="relative mt-2">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate" />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. biometrics, I-485, case transferred"
          autoComplete="off"
          spellCheck={false}
          autoFocus
          aria-describedby={countId}
          className={`${field} h-14 pr-14 pl-12 [&::-webkit-search-cancel-button]:hidden`}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className={`absolute top-1/2 right-1.5 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate transition-colors duration-200 hover:bg-ice hover:text-midnight ${focusRing}`}
          >
            <X aria-hidden className="size-5" />
          </button>
        )}
      </div>
      <p id={countId} aria-live="polite" className="mt-2 text-small text-slate">
        {words.length === 0
          ? "Type a word or two from your USCIS account. Covers case statuses, answers, forms and guides on this site."
          : looksLikeReceipt
            ? "That looks like a receipt number."
            : results.length === 0
              ? "Nothing matches. Try one or two plain words, like “interview” or “green card”."
              : exact
                ? `${results.length} ${results.length === 1 ? "result" : "results"}.`
                : "No page has all of those words. These are the closest."}
      </p>

      {looksLikeReceipt ? (
        <div className={`mt-8 ${panel}`}>
          <h2 className="text-title font-semibold text-midnight">Search covers this site&apos;s pages, not cases</h2>
          <p className="mt-2 text-body text-slate">
            To check a receipt number and see which office issued it, use the receipt check on the homepage.
          </p>
          <Link href="/#track" className={`mt-5 ${btnPrimary}`}>
            Check a receipt number
          </Link>
        </div>
      ) : words.length === 0 ? (
        <>
          <h2 className="mt-12 text-title font-semibold text-midnight">Or browse</h2>
          <ul className={`mt-4 ${rows}`}>
            {BROWSE.map((b) => (
              <li key={b.href}>
                <Link href={b.href} className={`${row} items-center`}>
                  <span className="text-body font-semibold text-midnight transition-colors duration-200 group-hover:text-blue">{b.label}</span>
                  <ArrowRight aria-hidden className={`${arrow} mt-0`} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        results.length > 0 && (
          <ul className={`mt-8 ${rows}`}>
            {results.map(({ entry }) => (
              <li key={`${entry.kind}:${entry.href}:${entry.title}`}>
                <Link href={entry.href} className={row}>
                  <span className="min-w-0">
                    <span className="inline-block rounded-full border border-border px-2.5 py-1 text-caption font-medium text-slate">
                      {entry.kind}
                    </span>
                    <span className="mt-2 block text-title font-semibold text-midnight transition-colors duration-200 group-hover:text-blue">
                      {entry.title}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-body text-slate">{entry.text}</span>
                  </span>
                  <ArrowRight aria-hidden className={arrow} />
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </>
  );
}
