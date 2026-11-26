import { Suspense } from "react";
import Link from "next/link";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { LAWYER_STATUS_LABEL, recheckCutoff, type LawyerStatus } from "@/lib/admin";
import { caseHealth } from "@/lib/admin-health";
import { emailEnabled } from "@/lib/email/send";
import { createAdminClient } from "@/lib/supabase/admin";
import { appCard, appLink, appPanel, appSectionTitle, appTitle, rowPad } from "@/lib/ui";

export const metadata = { title: "Overview" };

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

type LogRow = { created_at: string; action: string; target_type: string; target_id: string | null; details: Record<string, unknown> | null };

/** One admin change as a plain sentence, with where it links to (if anywhere). */
function describe(r: LogRow, lawyerName: Map<string, string>, reviewLawyer: Map<string, string>, accountEmail: Map<string, string>) {
  const d = r.details ?? {};
  if (r.target_type === "account") {
    const who = (r.target_id && accountEmail.get(r.target_id)) || "an account";
    const text = r.action === "account.cases_synced" ? `Checked cases now for ${who}` : `${r.action} · ${who}`;
    return { text, href: r.target_id ? `/admin/accounts/${r.target_id}` : null };
  }
  if (r.target_type === "review") {
    const lawyerId = (typeof d.lawyer_id === "string" && d.lawyer_id) || (r.target_id && reviewLawyer.get(r.target_id)) || null;
    const of = `a review of ${(lawyerId && lawyerName.get(lawyerId)) || "a lawyer"}`;
    const text =
      { "review.published": `Published ${of}`, "review.rejected": `Rejected ${of}`, "review.pending": `Moved ${of} back to waiting`, "review.deleted": `Deleted ${of}` }[r.action] ??
      `${r.action} · ${of}`;
    return { text, href: lawyerId && lawyerName.has(lawyerId) ? `/admin/reviews?status=${r.action === "review.deleted" ? "pending" : r.action.slice(7)}&lawyer=${lawyerId}` : null };
  }
  const name = (r.target_id && lawyerName.get(r.target_id)) || (typeof d.name === "string" && d.name) || "a lawyer";
  const text =
    {
      "lawyer.new": `Moved ${name} back to new`,
      "lawyer.verified": `Checked ${name}'s license`,
      "lawyer.listed": `Listed ${name}`,
      "lawyer.rejected": `Rejected ${name}`,
      "lawyer.withdrawn": `Unlisted ${name}`,
      "lawyer.license_checked": `Recorded a license recheck for ${name}`,
      "lawyer.notes_saved": `Saved notes on ${name}`,
      "lawyer.edited": `Edited ${name}'s profile`,
      "lawyer.photo_replaced": `Changed ${name}'s photo`,
      "lawyer.photo_removed": `Removed ${name}'s photo`,
      "lawyer.deleted": `Deleted ${name}`,
    }[r.action] ?? `${r.action} · ${name}`;
  return { text, href: r.target_id && r.action !== "lawyer.deleted" && lawyerName.has(r.target_id) ? `/admin/lawyers/${r.target_id}` : null };
}

/** What needs doing first, then the totals and the latest changes. */
async function Overview() {
  const db = createAdminClient()!;
  const count = (table: string, filter?: [string, string]) => {
    let q = db.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return q.then((r) => r.count ?? 0);
  };
  const [newApps, checked, listed, pending, published, accounts, health, recheckDue, recentApps, recentLog] = await Promise.all([
    count("lawyer_applications", ["status", "new"]),
    count("lawyer_applications", ["status", "verified"]),
    count("lawyer_applications", ["status", "listed"]),
    count("lawyer_reviews", ["status", "pending"]),
    count("lawyer_reviews", ["status", "published"]),
    count("profiles"),
    caseHealth(db),
    db
      .from("lawyer_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "listed")
      .or(`license_checked_on.is.null,license_checked_on.lt.${recheckCutoff()}`)
      .then((r) => r.count ?? 0),
    db.from("lawyer_applications").select("id, full_name, office_city, office_state, status, created_at").order("created_at", { ascending: false }).limit(5),
    db.from("admin_audit").select("created_at, action, target_type, target_id, details").order("created_at", { ascending: false }).limit(15),
  ]);

  // Names for the latest changes: lawyers (directly or through a review) and account emails.
  const log = (recentLog.data ?? []) as LogRow[];
  const ids = (type: string) => [...new Set(log.filter((r) => r.target_type === type && r.target_id).map((r) => r.target_id!))];
  const { data: reviewRows } = ids("review").length ? await db.from("lawyer_reviews").select("id, lawyer_id").in("id", ids("review")) : { data: [] };
  const reviewLawyer = new Map((reviewRows ?? []).map((r) => [r.id as string, r.lawyer_id as string]));
  const lawyerIds = [
    ...new Set([...ids("lawyer"), ...reviewLawyer.values(), ...log.map((r) => r.details?.lawyer_id).filter((x): x is string => typeof x === "string")]),
  ];
  const [{ data: lawyerRows }, { data: accountRows }] = await Promise.all([
    lawyerIds.length ? db.from("lawyer_applications").select("id, full_name").in("id", lawyerIds) : Promise.resolve({ data: [] }),
    ids("account").length ? db.from("profiles").select("user_id, email").in("user_id", ids("account")) : Promise.resolve({ data: [] }),
  ]);
  const lawyerName = new Map((lawyerRows ?? []).map((r) => [r.id as string, r.full_name as string]));
  const accountEmail = new Map((accountRows ?? []).map((r) => [r.user_id as string, (r.email as string | null) ?? "an account"]));

  const todo = [
    { n: newApps, text: `new lawyer application${newApps === 1 ? "" : "s"} to check`, href: "/admin/lawyers?status=new" },
    { n: checked, text: `checked application${checked === 1 ? "" : "s"} waiting to be listed`, href: "/admin/lawyers?status=verified" },
    { n: pending, text: `review${pending === 1 ? "" : "s"} waiting to be published`, href: "/admin/reviews?status=pending" },
    { n: recheckDue, text: `listed lawyer${recheckDue === 1 ? "" : "s"} due for a license recheck`, href: "/admin/lawyers?status=listed&due=1" },
    { n: health.waiting, text: `saved case${health.waiting === 1 ? "" : "s"} the checker hasn't accepted`, href: "/admin/cases?show=waiting" },
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

      {health.engineOn && health.checkerDown && (
        <p className="rounded-lg bg-amber/10 px-4 py-3 text-small text-amber">
          {health.probe === "no-answer" ? "The case checker didn't answer." : "The case checker hasn't checked any case in over two days."}{" "}
          <Link href="/admin/cases" className="font-semibold underline underline-offset-2">
            See case checks
          </Link>
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
          ["Saved cases", health.total],
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
            {log.map((r, i) => {
              const { text, href } = describe(r, lawyerName, reviewLawyer, accountEmail);
              return (
                <li key={i} className={`flex items-center justify-between gap-3 ${rowPad} py-3 text-small`}>
                  {href ? (
                    <Link href={href} className={appLink}>
                      {text}
                    </Link>
                  ) : (
                    <span className="text-midnight">{text}</span>
                  )}
                  <span className="shrink-0 text-slate tabular-nums">{when(r.created_at)}</span>
                </li>
              );
            })}
            {log.length === 0 && <li className={`${rowPad} py-3 text-small text-slate`}>No changes yet.</li>}
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
