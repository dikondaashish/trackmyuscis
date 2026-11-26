"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import type { AccountHit } from "@/app/(admin)/admin/actions";
import { appBtnPrimary, appCard, appField, appFieldLabel, appLink, rowPad } from "@/lib/ui";

const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });

/**
 * Search box over accounts. The query goes to a server action in the request body,
 * so emails and receipt numbers never land in the address bar or server logs.
 */
export function AccountSearch({
  initial,
  find,
}: {
  initial: AccountHit[];
  find: (q: string) => Promise<{ ok: true; hits: AccountHit[] } | { ok: false; message: string }>;
}) {
  const uid = useId();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ query: string; hits: AccountHit[] } | null>(null);
  const hits = result?.hits ?? initial;

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
          if (r.ok) setResult({ query, hits: r.hits });
          else setError(r.message);
          setBusy(false);
        }}
        className="flex flex-col gap-2"
      >
        <label htmlFor={`${uid}-q`} className={appFieldLabel}>
          Email, name, username or receipt number
        </label>
        <div className="flex gap-2">
          <input id={`${uid}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" spellCheck={false} placeholder="e.g. IOE0912345678" className={appField} />
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
        <p className="text-small text-slate">
          {result ? `${result.hits.length === 25 ? "First 25" : result.hits.length} result${result.hits.length === 1 ? "" : "s"} for “${result.query}”` : "Newest sign-ups"}
          {result && (
            <>
              {" · "}
              <button type="button" onClick={() => (setResult(null), setQ(""))} className={appLink}>
                Clear
              </button>
            </>
          )}
        </p>
        <div className={`${appCard} overflow-x-auto`}>
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border text-slate">
                <th scope="col" className={`${rowPad} py-2.5 font-medium`}>Account</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Cases</th>
                <th scope="col" className={`${rowPad} py-2.5 text-right font-medium`}>Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hits.map((a) => (
                <tr key={a.id}>
                  <td className={`${rowPad} py-3`}>
                    <Link href={`/admin/accounts/${a.id}`} className={`${appLink} font-semibold [overflow-wrap:anywhere]`}>
                      {a.email ?? "No email"}
                    </Link>
                    {a.name && <span className="block text-slate">{a.name}</span>}
                  </td>
                  <td className="px-3 py-3 text-right text-midnight tabular-nums">{a.cases}</td>
                  <td className={`${rowPad} py-3 text-right text-slate tabular-nums`}>{day(a.createdAt)}</td>
                </tr>
              ))}
              {hits.length === 0 && (
                <tr>
                  <td colSpan={3} className={`${rowPad} py-6 text-center text-slate`}>
                    No accounts found.
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
