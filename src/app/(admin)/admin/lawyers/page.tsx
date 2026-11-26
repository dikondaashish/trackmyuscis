import { Suspense } from "react";
import Link from "next/link";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { LAWYER_STATUS_LABEL, LAWYER_STATUSES, RECHECK_AFTER_DAYS, recheckCutoff, type LawyerStatus } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { LawyerSearch } from "@/components/admin/LawyerSearch";
import { appLink, appTitle, focusRing } from "@/lib/ui";
import { findLawyers, type LawyerRow } from "../actions";

export const metadata = { title: "Lawyers" };

const TABS: (LawyerStatus | "all")[] = ["new", "verified", "listed", "rejected", "withdrawn", "all"];
const LIMIT = 500;

async function LawyerList({ searchParams }: { searchParams: PageProps<"/admin/lawyers">["searchParams"] }) {
  const sp = await searchParams;
  const raw = sp.status;
  const status = (typeof raw === "string" && (LAWYER_STATUSES as readonly string[]).includes(raw) ? raw : raw === "all" ? "all" : "new") as LawyerStatus | "all";
  const db = createAdminClient()!;
  let q = db
    .from("lawyer_applications")
    .select("id, full_name, firm_name, role, office_city, office_state, status, created_at, license_checked_on", { count: "exact" })
    .order("created_at", { ascending: status === "new" || status === "verified" })
    .limit(LIMIT);
  if (status !== "all") q = q.eq("status", status);
  const listedTab = status === "listed";
  const due = listedTab && sp.due === "1";
  const cutoff = recheckCutoff();
  if (due) q = q.or(`license_checked_on.is.null,license_checked_on.lt.${cutoff}`);
  const { data, error, count } = await q;
  const rows = (data ?? []) as LawyerRow[];

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
      <LawyerSearch initial={rows} total={count ?? rows.length} listedTab={listedTab} cutoff={cutoff} labels={LAWYER_STATUS_LABEL} find={findLawyers} />
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
