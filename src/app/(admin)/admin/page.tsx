import { Suspense } from "react";
import Link from "next/link";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { LAWYER_STATUS_LABEL, type LawyerStatus } from "@/lib/admin";
import { emailEnabled } from "@/lib/email/send";
import { createAdminClient } from "@/lib/supabase/admin";
import { appCard, appLink, appPanel, appSectionTitle, appTitle, rowPad } from "@/lib/ui";

export const metadata = { title: "Overview" };

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

/** What needs doing first, then the totals and the latest changes. */
async function Overview() {
  const db = createAdminClient()!;
  const count = (table: string, filter?: [string, string]) => {
    let q = db.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return q.then((r) => r.count ?? 0);
  };
  const [newApps, checked, listed, pending, published, accounts, cases, recentApps, recentLog] = await Promise.all([
    count("lawyer_applications", ["status", "new"]),
    count("lawyer_applications", ["status", "verified"]),
    count("lawyer_applications", ["status", "listed"]),
    count("lawyer_reviews", ["status", "pending"]),
    count("lawyer_reviews", ["status", "published"]),
    count("profiles"),
    count("cases"),
    db.from("lawyer_applications").select("id, full_name, office_city, office_state, status, created_at").order("created_at", { ascending: false }).limit(5),
    db.from("admin_audit").select("created_at, action, target_type, target_id, details").order("created_at", { ascending: false }).limit(15),
  ]);

  const todo = [
    { n: newApps, text: `new lawyer application${newApps === 1 ? "" : "s"} to check`, href: "/admin/lawyers?status=new" },
    { n: checked, text: `checked application${checked === 1 ? "" : "s"} waiting to be listed`, href: "/admin/lawyers?status=verified" },
    { n: pending, text: `review${pending === 1 ? "" : "s"} waiting to be published`, href: "/admin/reviews?status=pending" },
  ].filter((t) => t.n > 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className={appTitle}>Overview</h1>

      {!emailEnabled() && (
        <p className="rounded-lg bg-amber/10 px-4 py-3 text-small text-amber">
          Email isn&apos;t set up in production, so you aren&apos;t told about new applications or reviews and lawyers don&apos;t get a
          &ldquo;you&apos;re live&rdquo; email. Check this page instead.
        </p>
      )}

      <section className={appPanel}>
        <h2 className={appSectionTitle}>To do</h2>
        {todo.length === 0 ? (
          <p className="mt-2 text-small text-slate">Nothing waiting.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {todo.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className={appLink}>
                  <span className="font-semibold tabular-nums">{t.n}</span> {t.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          ["Listed lawyers", listed],
          ["Applications to check", newApps + checked],
          ["Published reviews", published],
          ["Accounts", accounts],
          ["Saved cases", cases],
        ].map(([label, n]) => (
          <div key={label} className={`${appCard} p-4`}>
            <p className="text-small text-slate">{label}</p>
            <p className="mt-1 text-h3 text-midnight tabular-nums">{n}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={appCard}>
          <h2 className={`${appSectionTitle} border-b border-border ${rowPad} py-3`}>Latest applications</h2>
          <ul className="divide-y divide-border">
            {(recentApps.data ?? []).map((r) => (
              <li key={r.id} className={`flex items-center justify-between gap-3 ${rowPad} py-3 text-small`}>
                <Link href={`/admin/lawyers/${r.id}`} className={appLink}>
                  {r.full_name}
                </Link>
                <span className="text-right text-slate">
                  {r.office_city}, {r.office_state} · {LAWYER_STATUS_LABEL[r.status as LawyerStatus] ?? r.status}
                </span>
              </li>
            ))}
            {(recentApps.data ?? []).length === 0 && <li className={`${rowPad} py-3 text-small text-slate`}>No applications yet.</li>}
          </ul>
        </section>

        <section className={appCard}>
          <h2 className={`${appSectionTitle} border-b border-border ${rowPad} py-3`}>Latest admin changes</h2>
          <ul className="divide-y divide-border">
            {(recentLog.data ?? []).map((r, i) => (
              <li key={i} className={`flex items-center justify-between gap-3 ${rowPad} py-3 text-small`}>
                {r.target_type === "lawyer" && r.target_id && r.action !== "lawyer.deleted" ? (
                  <Link href={`/admin/lawyers/${r.target_id}`} className={appLink}>
                    {r.action}
                  </Link>
                ) : (
                  <span className="text-midnight">{r.action}</span>
                )}
                <span className="text-slate tabular-nums">{when(r.created_at)}</span>
              </li>
            ))}
            {(recentLog.data ?? []).length === 0 && <li className={`${rowPad} py-3 text-small text-slate`}>No changes yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default function AdminHome() {
  return (
    <Suspense fallback={<div className="skeleton h-40 rounded-xl" />}>
      <AdminOnly next="/admin">
        <Overview />
      </AdminOnly>
    </Suspense>
  );
}
