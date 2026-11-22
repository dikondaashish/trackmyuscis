import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowUpRight, FileText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";
import { STATUSES, USCIS_CASE_STATUS, statusId } from "@/lib/content";
import { SERVICE_CENTERS } from "@/lib/receipt";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { btnSecondary, card, container, focusRing, panel, rowPad, rows, textLink } from "@/lib/ui";
import { AddCaseForm } from "./AddCaseForm";
import { RemoveCaseButton } from "./RemoveCaseButton";

export const metadata = pageMetadata({
  title: "Your cases",
  description: "The USCIS cases you saved on TrackMyUSCIS.",
  path: "/dashboard",
  noindex: true,
});

const MAX_CASES = 10;
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

type CaseRow = {
  id: string;
  receipt_number: string;
  label: string | null;
  form_type: string | null;
  current_status: string | null;
  status_changed_at: string | null;
  created_at: string;
};

export default function DashboardPage() {
  return (
    <div className="bg-cloud">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

/** Reads the session, so it streams in behind the Suspense boundary on every visit. */
async function Dashboard() {
  // Per-request only: the session check reads the clock (token expiry), so nothing here is prerendered.
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/dashboard");

  const [{ data: profile }, { data: cases }] = await Promise.all([
    supabase.from("profiles").select("first_name, last_name, email").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("cases")
      .select("id, receipt_number, label, form_type, current_status, status_changed_at, created_at")
      .order("created_at", { ascending: true })
      .returns<CaseRow[]>(),
  ]);

  const list = cases ?? [];
  const firstName = profile?.first_name || user.user_metadata?.given_name || null;
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || user.user_metadata?.full_name || null;

  return (
    <>
      <section className="border-b border-border bg-white">
        <div className={`${container} enter flex flex-col gap-6 pt-10 pb-12 sm:flex-row sm:items-end sm:justify-between sm:pt-14 sm:pb-14`}>
          <div>
            <p className="text-body text-slate">{firstName ? `Hi ${firstName}` : "Welcome"}</p>
            <h1 className="mt-2 text-h1 text-midnight">Your cases</h1>
          </div>
          <p className="text-small text-slate tabular-nums">
            {list.length} of {MAX_CASES} saved
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className={`${container} grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12`}>
          <div className="flex min-w-0 flex-col gap-8">
            {list.length > 0 ? <CaseList cases={list} /> : <EmptyState />}

            <div className={panel}>
              <h2 className="text-title text-midnight">{list.length > 0 ? "Add another case" : "Add your first case"}</h2>
              <p className="mt-1 mb-6 text-small text-slate">
                Your receipt number is on the receipt notice (Form I-797C) USCIS mailed you.
              </p>
              <AddCaseForm full={list.length >= MAX_CASES} />
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className={panel}>
              <h2 className="text-title text-midnight">Account</h2>
              <dl className="mt-4 flex flex-col gap-3 text-small">
                {name && (
                  <div>
                    <dt className="text-slate">Name</dt>
                    <dd className="font-medium text-midnight">{name}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-slate">Email</dt>
                  <dd className="font-medium break-all text-midnight">{profile?.email ?? user.email}</dd>
                </div>
              </dl>
              <form action="/auth/sign-out" method="post" className="mt-6">
                <button type="submit" className={`${btnSecondary} w-full`}>
                  <LogOut aria-hidden className="size-4" />
                  Sign out
                </button>
              </form>
            </div>

            <div className={panel}>
              <h2 className="text-title text-midnight">Need the official status?</h2>
              <p className="mt-2 text-small text-slate">USCIS Case Status Online always shows the latest official update.</p>
              <a href={USCIS_CASE_STATUS} target="_blank" rel="noopener noreferrer" className={`${textLink} mt-2 text-small`}>
                Open USCIS Case Status
                <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function CaseList({ cases }: { cases: CaseRow[] }) {
  return (
    <ul className={rows}>
      {cases.map((c) => {
        const known = c.current_status ? STATUSES.find((s) => s.name === c.current_status) : undefined;
        const office = SERVICE_CENTERS[c.receipt_number.slice(0, 3)];
        return (
          <li key={c.id} className={`${rowPad} flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between`}>
            <div className="min-w-0">
              <p className="text-title text-midnight">{c.label || c.form_type || "USCIS case"}</p>
              <p className="mt-1 text-small text-slate tabular-nums tracking-wide">
                {c.receipt_number}
                {office && <span className="tracking-normal"> · {office}</span>}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {c.current_status ? (
                  known ? (
                    <Link href={`/status-explained#${statusId(known.name)}`} className={`rounded-full ${focusRing}`}>
                      <StatusBadge tone={known.tone}>{c.current_status}</StatusBadge>
                    </Link>
                  ) : (
                    <StatusBadge tone="info">{c.current_status}</StatusBadge>
                  )
                ) : (
                  <StatusBadge tone="info">Waiting for first check</StatusBadge>
                )}
                <span className="text-caption text-slate">
                  {c.status_changed_at ? `Updated ${dateFmt.format(new Date(c.status_changed_at))}` : `Saved ${dateFmt.format(new Date(c.created_at))}`}
                </span>
              </div>
            </div>
            <div className="-ml-2 shrink-0 sm:ml-0">
              <RemoveCaseButton id={c.id} receipt={c.receipt_number} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className={`${card} flex flex-col items-center px-6 py-14 text-center`}>
      <span className="flex size-11 items-center justify-center rounded-xl bg-ice text-blue">
        <FileText aria-hidden className="size-5" />
      </span>
      <h2 className="mt-4 text-title text-midnight">No cases yet</h2>
      <p className="mt-1 max-w-sm text-small text-slate">Save a receipt number below and it will appear here.</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your cases">
      <section className="border-b border-border bg-white">
        <div className={`${container} pt-10 pb-12 sm:pt-14 sm:pb-14`}>
          <div className="h-5 w-24 animate-pulse rounded bg-border/70" />
          <div className="mt-3 h-12 w-64 animate-pulse rounded bg-border/70" />
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className={`${container} grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12`}>
          <div className={`${card} h-64 animate-pulse`} />
          <div className={`${card} h-48 animate-pulse`} />
        </div>
      </section>
    </div>
  );
}
