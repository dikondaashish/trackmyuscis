"use client";

import { useId, useState } from "react";
import { Search, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";
import { statusId, TONE_LABEL, type Tone } from "@/lib/statuses";
import { appCard, appField, cardLink, field, fieldLabel, focusRing } from "@/lib/ui";

/**
 * Every status stays in the page (for search engines and screen readers); typing only
 * hides the ones that don't match. Each status has its own anchor so it can be linked.
 */
export function StatusFinder({
  statuses,
  compact = false,
}: {
  /** With `href`, the status name links to its full page. */
  statuses: { name: string; tone: Tone; meaning: string; href?: string }[];
  /** The dashboard size: a 36px field and tighter rows. */
  compact?: boolean;
}) {
  const inputId = useId();
  const countId = useId();
  const [query, setQuery] = useState("");

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (s: { name: string; meaning: string }) => {
    const text = `${s.name} ${s.meaning}`.toLowerCase();
    return words.every((w) => text.includes(w));
  };
  const shown = statuses.filter(matches).length;

  return (
    <>
      <div className={`no-print ${compact ? "" : "max-w-xl"}`}>
        <label htmlFor={inputId} className={fieldLabel}>
          Find your status
        </label>
        <div className={`relative ${compact ? "mt-1.5" : "mt-2"}`}>
          <Search
            aria-hidden
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate ${compact ? "left-3 size-4" : "left-4 size-5"}`}
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Actively Reviewed"
            autoComplete="off"
            spellCheck={false}
            aria-describedby={countId}
            className={`${compact ? `${appField} pr-10 pl-9` : `${field} h-12 pr-14 pl-12`} [&::-webkit-search-cancel-button]:hidden`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className={`absolute top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate transition-colors duration-200 hover:bg-ice hover:text-midnight ${compact ? "right-1 size-8" : "right-1.5 size-10"} ${focusRing}`}
            >
              <X aria-hidden className={compact ? "size-4" : "size-5"} />
            </button>
          )}
        </div>
        <p id={countId} aria-live="polite" className={compact ? "mt-1.5 text-caption text-slate" : "mt-2 text-small text-slate"}>
          {words.length === 0
            ? "Type a few words from the status shown on your USCIS account."
            : shown === 0
              ? "No status matches. Try fewer words: the wording on your account can differ slightly."
              : `Showing ${shown} of ${statuses.length} statuses.`}
        </p>
      </div>

      {compact ? (
        <dl className={`mt-4 ${appCard} divide-y divide-border overflow-hidden ${shown === 0 ? "hidden" : ""}`}>
          {statuses.map((s) => (
            <div
              key={s.name}
              id={statusId(s.name)}
              hidden={!matches(s)}
              className="grid scroll-mt-28 gap-1.5 px-4 py-3.5 target:bg-ice sm:grid-cols-[1fr_1.3fr] sm:gap-6"
            >
              <dt>
                {s.href ? (
                  <Link href={s.href} className={`link-draw -my-2 inline-flex min-h-11 items-center rounded text-small font-semibold text-blue ${focusRing}`}>
                    {s.name}
                  </Link>
                ) : (
                  <span className="block text-small font-semibold text-midnight">{s.name}</span>
                )}
                <span className="mt-1 block">
                  <StatusBadge tone={s.tone}>{TONE_LABEL[s.tone]}</StatusBadge>
                </span>
              </dt>
              <dd className="text-small text-slate">{s.meaning}</dd>
            </div>
          ))}
        </dl>
      ) : (
        /* The public page: one card per status, in the order a case usually shows them. */
        <ol className={`mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${shown === 0 ? "hidden" : ""}`}>
          {statuses.map((s, i) => (
            <li key={s.name} id={statusId(s.name)} hidden={!matches(s)} className="scroll-mt-28">
              <Link href={s.href ?? `#${statusId(s.name)}`} className={`group flex h-full flex-col p-5 sm:p-6 ${cardLink}`}>
                <span className="flex items-center justify-between gap-3">
                  <StatusBadge tone={s.tone}>{TONE_LABEL[s.tone]}</StatusBadge>
                  <span aria-hidden className="text-small text-slate tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="mt-4 block text-title text-midnight transition-colors duration-200 group-hover:text-blue">{s.name}</span>
                <span className="mt-2 block text-body text-slate">{s.meaning}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
