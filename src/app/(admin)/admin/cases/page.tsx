import { Suspense } from "react";
import Link from "next/link";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { caseHealth, problemCases, REGISTER_GRACE_HOURS, STALE_AFTER_HOURS, type ProblemCase } from "@/lib/admin-health";
import { emailEnabled } from "@/lib/email/send";
import { createAdminClient } from "@/lib/supabase/admin";
import { appCard, appLink, appSectionTitle, appTitle, focusRing, rowPad } from "@/lib/ui";

export const metadata = { title: "Case checks" };

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) : "Never";

const KINDS = {
  waiting: { label: "Not accepted", help: `Saved over ${REGISTER_GRACE_HOURS} hours ago, but the checker never accepted the number. Open the account and use Check cases now.` },
  notFound: { label: "USCIS doesn't know it", help: "USCIS has never returned a status. Often a typo or a very new receipt. The checker keeps trying for a while." },
  stopped: { label: "Checks stopped", help: "USCIS never recognized the number and the checker gave up. The person sees this on their case page." },
} as const;
type Kind = keyof typeof KINDS;

function Warning({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg bg-amber/10 px-4 py-3 text-small text-amber">{children}</p>;
}

async function CaseChecks({ searchParams }: { searchParams: PageProps<"/admin/cases">["searchParams"] }) {
  const raw = (await searchParams).show;
  const kind: Kind = typeof raw === "string" && raw in KINDS ? (raw as Kind) : "waiting";
  const db = createAdminClient()!;
  const [h, rows] = await Promise.all([caseHealth(db), problemCases(db, kind)]);
  const counts: Record<Kind, number> = { waiting: h.waiting, notFound: h.notFound, stopped: h.stopped };

  return (
    <div className="flex flex-col gap-6">
      <h1 className={appTitle}>Case checks</h1>

      {!h.engineOn && <Warning>The case checker isn&apos;t set up on this server, so no case is being checked. Add the case engine keys in the hosting settings.</Warning>}
      {h.probe === "behind" && (
        <Warning>
          The checker&apos;s newest check is from {when(h.lastCheck)}. Cases are checked about once a day, so after {STALE_AFTER_HOURS} hours the
          checker is behind or has stopped.
        </Warning>
      )}
      {h.probe === "no-answer" && <Warning>The case checker didn&apos;t answer. It may be down, or its keys on this server may be wrong.</Warning>}
      {h.unemailed > 0 && emailEnabled() && (
        <Warning>
          {h.unemailed} status change{h.unemailed === 1 ? "" : "s"} in the last 7 days {h.unemailed === 1 ? "wasn't" : "weren't"} emailed yet. The checker retries
          for two days; if this stays, check the email provider.
        </Warning>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Saved cases", String(h.total)],
          ["Checker's last check", h.probe === "no-answer" ? "No answer" : h.probe === "no-cases" || h.probe === "off" ? "Nothing to check" : when(h.lastCheck)],
          ["Status changes, 7 days", String(h.changes7d)],
          ["Emails", emailEnabled() ? `${h.changes7d - h.unemailed} of ${h.changes7d} sent` : "Email not set up"],
        ].map(([label, value]) => (
          <div key={label} className={`${appCard} p-4`}>
            <p className="text-small text-slate">{label}</p>
            <p className="mt-1 text-title text-midnight tabular-nums">{value}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={appSectionTitle}>Cases that need a look</h2>
        <nav aria-label="Problem" className="flex flex-wrap gap-1">
          {(Object.keys(KINDS) as Kind[]).map((k) => (
            <Link
              key={k}
              href={`/admin/cases?show=${k}`}
              aria-current={k === kind ? "page" : undefined}
              className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-small font-medium ${k === kind ? "border-blue bg-ice text-blue" : "border-border bg-white text-slate hover:text-midnight"} ${focusRing}`}
            >
              {KINDS[k].label}
              <span className="tabular-nums">{counts[k]}</span>
            </Link>
          ))}
        </nav>
        <p className="text-small text-slate">{KINDS[kind].help}</p>
        <ProblemTable rows={rows} total={counts[kind]} />
      </section>
    </div>
  );
}

function ProblemTable({ rows, total }: { rows: ProblemCase[]; total: number }) {
  return (
    <div className={`${appCard} overflow-x-auto`}>
      <table className="w-full text-left text-small">
        <thead>
          <tr className="border-b border-border text-slate">
            <th scope="col" className={`${rowPad} py-2.5 font-medium`}>Receipt number</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Form</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Account</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Saved</th>
            <th scope="col" className={`${rowPad} py-2.5 text-right font-medium`}>Last update here</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={`${rowPad} py-3 font-mono text-midnight`}>{r.receipt_number}</td>
              <td className="px-3 py-3 text-slate">{r.form_type ?? "Unknown"}</td>
              <td className="px-3 py-3">
                <Link href={`/admin/accounts/${r.user_id}`} className={appLink}>
                  {r.email ?? "Open account"}
                </Link>
              </td>
              <td className="px-3 py-3 text-slate tabular-nums">{when(r.created_at)}</td>
              <td className={`${rowPad} py-3 text-right text-slate tabular-nums`}>{when(r.last_checked_at)}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className={`${rowPad} py-6 text-center text-slate`}>
                Nothing here.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {total > rows.length && <p className={`${rowPad} border-t border-border py-2.5 text-small text-slate`}>Showing the oldest {rows.length} of {total}.</p>}
    </div>
  );
}

export default function AdminCases({ searchParams }: PageProps<"/admin/cases">) {
  return (
    <Suspense fallback={<div className="skeleton h-64 rounded-xl" />}>
      <AdminOnly next="/admin/cases">
        <CaseChecks searchParams={searchParams} />
      </AdminOnly>
    </Suspense>
  );
}
