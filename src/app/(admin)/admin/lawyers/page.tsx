import { Suspense } from "react";
import Link from "next/link";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { LAWYER_STATUS_LABEL, LAWYER_STATUSES, RECHECK_AFTER_DAYS, recheckCutoff, type LawyerStatus } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { appCard, appLink, appTitle, focusRing, rowPad } from "@/lib/ui";

export const metadata = { title: "Lawyers" };

const TABS: (LawyerStatus | "all")[] = ["new", "verified", "listed", "rejected", "withdrawn", "all"];
const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

async function LawyerList({ searchParams }: { searchParams: PageProps<"/admin/lawyers">["searchParams"] }) {
  const sp = await searchParams;
  const raw = sp.status;
  const status = (typeof raw === "string" && (LAWYER_STATUSES as readonly string[]).includes(raw) ? raw : raw === "all" ? "all" : "new") as LawyerStatus | "all";
  const db = createAdminClient()!;
  let q = db
    .from("lawyer_applications")
    .select("id, full_name, firm_name, role, office_city, office_state, status, created_at, photo_path, license_checked_on")
    .order("created_at", { ascending: status === "new" || status === "verified" })
    .limit(500);
  if (status !== "all") q = q.eq("status", status);
  const listedTab = status === "listed";
  const due = listedTab && sp.due === "1";
  const cutoff = recheckCutoff();
  if (due) q = q.or(`license_checked_on.is.null,license_checked_on.lt.${cutoff}`);
  const { data, error } = await q;
  const rows = data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <h1 className={appTitle}>Lawyers</h1>
      <nav aria-label="Filter by status" className="flex flex-wrap gap-1">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/admin/lawyers?status=${t}`}
            aria-current={t === status ? "page" : undefined}
            className={`inline-flex h-9 items-center rounded-md border px-3 text-small font-medium ${t === status ? "border-blue bg-ice text-blue" : "border-border bg-white text-slate hover:text-midnight"} ${focusRing}`}
          >
            {t === "all" ? "All" : LAWYER_STATUS_LABEL[t]}
          </Link>
        ))}
      </nav>
      {listedTab && (
        <p className="text-small text-slate">
          {due ? `Listed lawyers whose license was last checked over ${RECHECK_AFTER_DAYS / 365 === 1 ? "a year" : `${RECHECK_AFTER_DAYS} days`} ago. Look each one up again, then use “Record a license recheck today”. ` : ""}
          <Link href={due ? "/admin/lawyers?status=listed" : "/admin/lawyers?status=listed&due=1"} className={appLink}>
            {due ? "Show all listed" : "Show only rechecks due"}
          </Link>
        </p>
      )}
      {error && <p className="text-small text-red">Couldn&apos;t load applications: {error.message}</p>}
      <div className={`${appCard} overflow-x-auto`}>
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-border text-slate">
              <th scope="col" className={`${rowPad} py-2.5 font-medium`}>Name</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Office</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Type</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
              <th scope="col" className={`${rowPad} py-2.5 text-right font-medium`}>{listedTab ? "License checked" : "Applied"}</th>
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
                <td className="px-3 py-3 text-midnight">{LAWYER_STATUS_LABEL[r.status as LawyerStatus] ?? r.status}</td>
                <td className={`${rowPad} py-3 text-right tabular-nums ${listedTab && (!r.license_checked_on || r.license_checked_on < cutoff) ? "font-semibold text-amber" : "text-slate"}`}>
                  {listedTab ? (r.license_checked_on ? day(r.license_checked_on) : "Never") : day(r.created_at)}
                </td>
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
      </div>
    </div>
  );
}

export default function AdminLawyers({ searchParams }: PageProps<"/admin/lawyers">) {
  return (
    <Suspense fallback={<div className="skeleton h-64 rounded-xl" />}>
      <AdminOnly next="/admin/lawyers">
        <LawyerList searchParams={searchParams} />
      </AdminOnly>
    </Suspense>
  );
}
