"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import type { LawyerRow } from "@/app/(admin)/admin/actions";
import { appBtnPrimary, appCard, appField, appFieldLabel, appLink, rowPad } from "@/lib/ui";

const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/**
 * The lawyer table with a search over every application. The query goes to a server action,
 * so names and emails never land in the address bar or server logs.
 */
export function LawyerSearch({
  initial,
  total,
  listedTab,
  cutoff,
  labels,
  find,
}: {
  initial: LawyerRow[];
  /** How many rows the current tab has in all, to say when the list is cut short. */
  total: number;
  listedTab: boolean;
  cutoff: string;
  /** Status code → label (passed in because the admin helpers are server-only). */
  labels: Record<string, string>;
  find: (q: string) => Promise<{ ok: true; rows: LawyerRow[] } | { ok: false; message: string }>;
}) {
  const uid = useId();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ query: string; rows: LawyerRow[] } | null>(null);
  const rows = result?.rows ?? initial;
  const showCheck = listedTab && !result;

  return (
    <div className="flex flex-col gap-4">
      <form
        role="search"
        onSubmit={async (e) => {
          e.preventDefault();
          const query = q.trim();
          if (!query) return setResult(null);
          setBusy(true);
          setError("");
          const r = await find(query).catch(() => ({ ok: false as const, message: "Something went wrong. Try again." }));
          if (r.ok) setResult({ query, rows: r.rows });
          else setError(r.message);
          setBusy(false);
        }}
        className="flex flex-col gap-2"
      >
        <label htmlFor={`${uid}-q`} className={appFieldLabel}>
          Search all applications by name, firm, city, state or email
        </label>
        <div className="flex gap-2">
          <input id={`${uid}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" spellCheck={false} placeholder="e.g. Houston" className={appField} />
          <button type="submit" disabled={busy} className={`${appBtnPrimary} shrink-0 disabled:opacity-60`}>
            {busy && <Spinner className="size-3.5" />}
            Find
          </button>
        </div>
        {error && (
          <p role="alert" className="text-small text-red">
            {error}
          </p>
        )}
      </form>

      <div aria-live="polite" className="flex flex-col gap-2">
        {result ? (
          <p className="text-small text-slate">
            {result.rows.length === 100 ? "First 100" : result.rows.length} result{result.rows.length === 1 ? "" : "s"} for &ldquo;{result.query}&rdquo; in every status ·{" "}
            <button type="button" onClick={() => (setResult(null), setQ(""))} className={appLink}>
              Clear
            </button>
          </p>
        ) : (
          total > initial.length && (
            <p className="text-small text-amber">
              Showing {initial.length} of {total}. Search to find the others.
            </p>
          )
        )}
        <div className={`${appCard} overflow-x-auto`}>
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border text-slate">
                <th scope="col" className={`${rowPad} py-2.5 font-medium`}>Name</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Office</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Type</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                <th scope="col" className={`${rowPad} py-2.5 text-right font-medium`}>{showCheck ? "License checked" : "Applied"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={`${rowPad} py-3`}>
                    <Link href={`/admin/lawyers/${r.id}`} className={`${appLink} font-semibold`}>
                      {r.full_name}
                    </Link>
                    <span className="block text-slate">{r.firm_name}</span>
                  </td>
                  <td className="px-3 py-3 text-midnight">
                    {r.office_city}, {r.office_state}
                  </td>
                  <td className="px-3 py-3 text-slate">{r.role === "attorney" ? "Attorney" : "Accredited rep"}</td>
                  <td className="px-3 py-3 text-midnight">{labels[r.status] ?? r.status}</td>
                  <td className={`${rowPad} py-3 text-right tabular-nums ${showCheck && (!r.license_checked_on || r.license_checked_on < cutoff) ? "font-semibold text-amber" : "text-slate"}`}>
                    {showCheck ? (r.license_checked_on ? day(r.license_checked_on) : "Never") : day(r.created_at)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className={`${rowPad} py-6 text-center text-slate`}>
                    {result ? "No applications match." : "Nothing here."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
