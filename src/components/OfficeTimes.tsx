"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { field, fieldLabel, focusRing } from "@/lib/ui";

type Row = {
  key: string;
  label: string;
  sub?: string;
  cells: string[];
  /** The row's own page, when it has one. */
  href?: string;
  /** 0 to 1: this row's time against the longest in the table, drawn as a bar beside the time. */
  share?: number;
};

/**
 * A table of official times, one row per office or category. With `filter`, a field above
 * hides rows that don't match; every row stays in the HTML for search engines and screen readers.
 */
export function OfficeTimes({
  caption,
  head,
  rows,
  filter = false,
}: {
  caption: string;
  head: string[];
  rows: Row[];
  filter?: boolean;
}) {
  const inputId = useId();
  const countId = useId();
  const [query, setQuery] = useState("");
  const words = query.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const matches = (r: Row) => words.every((w) => r.label.toLowerCase().includes(w));
  const shown = rows.filter(matches).length;

  return (
    <div>
      {filter && (
        <div className="no-print mb-4">
          <label htmlFor={inputId} className={fieldLabel}>
            Find your office
          </label>
          <div className="relative mt-2">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate" />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Houston or TX"
              autoComplete="off"
              spellCheck={false}
              aria-describedby={countId}
              className={`${field} h-12 pr-14 pl-12 [&::-webkit-search-cancel-button]:hidden`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className={`absolute top-1/2 right-1.5 inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate transition-colors duration-200 hover:bg-ice hover:text-midnight ${focusRing}`}
              >
                <X aria-hidden className="size-5" />
              </button>
            )}
          </div>
          <p id={countId} aria-live="polite" className="mt-2 text-small text-slate">
            {words.length === 0
              ? "Your office is named on your receipt notice (Form I-797C) or interview notice."
              : shown === 0
                ? "No office matches. Try the city or the two-letter state."
                : `Showing ${shown} of ${rows.length} offices.`}
          </p>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full border-collapse text-left text-small">
          <caption className="border-b border-border bg-cloud px-4 py-3 text-left text-small font-semibold text-midnight">
            {caption}
          </caption>
          <thead>
            <tr className="border-b border-border">
              {head.map((h, i) => (
                <th key={h} scope="col" className={`px-3 py-2.5 font-semibold text-midnight sm:px-4 ${i > 0 ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((r) => (
              <tr key={r.key} className={`border-b border-border last:border-0 even:bg-cloud/50 ${matches(r) ? "" : "hidden"}`}>
                <th scope="row" className="px-3 py-2.5 font-medium [overflow-wrap:anywhere] text-midnight sm:px-4">
                  {r.href ? (
                    <Link
                      href={r.href}
                      className={`link-draw -my-2.5 inline-flex min-h-11 items-center rounded text-blue ${focusRing}`}
                    >
                      {r.label}
                    </Link>
                  ) : (
                    r.label
                  )}
                  {r.sub && <span className="block font-normal text-slate">{r.sub}</span>}
                </th>
                {r.cells.map((c, i) => (
                  <td key={i} className={`px-3 py-2.5 text-right sm:px-4 ${i === 0 ? "font-medium whitespace-nowrap text-midnight" : "min-w-20 text-slate sm:whitespace-nowrap"}`}>
                    {i === 0 && r.share !== undefined ? (
                      <span className="inline-flex items-center justify-end gap-3">
                        <span aria-hidden className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-border sm:block">
                          <span className="block h-full rounded-full bg-blue/70" style={{ width: `${Math.max(3, r.share * 100)}%` }} />
                        </span>
                        <span className="min-w-20">{c}</span>
                      </span>
                    ) : (
                      c
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
