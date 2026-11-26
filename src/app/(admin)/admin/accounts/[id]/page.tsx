import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminButton } from "@/components/admin/AdminControls";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { caseEngineEnabled, engine } from "@/lib/case-engine/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { appCard, appPanel, appSectionTitle, appTitle, focusRing, rowPad } from "@/lib/ui";
import { syncAccountCases } from "../../actions";

export const metadata = { title: "Account" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const when = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) : "Never";

const PROVIDER: Record<string, string> = { email: "Email and password", google: "Google" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={`grid gap-1 ${rowPad} py-2.5 sm:grid-cols-[10rem_1fr] sm:gap-4`}>
      <dt className="text-small text-slate">{label}</dt>
      <dd className="text-small text-midnight [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

type CaseRow = {
  id: string;
  receipt_number: string;
  label: string | null;
  form_type: string | null;
  current_status: string | null;
  last_checked_at: string | null;
  engine_registered_at: string | null;
  uscis_not_found: boolean;
  checks_stopped: boolean;
  created_at: string;
};

/** What the checker knows about one case, in a few words. `live` is the checker's own last check, when it answered. */
function checkState(c: CaseRow, live: Map<string, string | null> | null) {
  if (c.checks_stopped) return "Checks stopped: USCIS never recognized it";
  if (c.uscis_not_found) return "USCIS doesn't know this number yet";
  if (live && !live.has(c.receipt_number)) return "Not on the checker's list: use Check cases now";
  if (!c.engine_registered_at) return "Not accepted by the checker yet";
  return `Checked ${when(live?.get(c.receipt_number) ?? c.last_checked_at)}`;
}

async function AccountDetail({ params }: { params: PageProps<"/admin/accounts/[id]">["params"] }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const db = createAdminClient()!;
  const { data: auth } = await db.auth.admin.getUserById(id);
  const user = auth?.user;
  if (!user) notFound();

  const [{ data: profile }, { data: cases }, docs, reviews, admin, { data: log }] = await Promise.all([
    db.from("profiles").select("first_name, last_name, username, email_notifications, document_reminders").eq("user_id", id).maybeSingle(),
    db
      .from("cases")
      .select("id, receipt_number, label, form_type, current_status, last_checked_at, engine_registered_at, uscis_not_found, checks_stopped, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: true })
      .returns<CaseRow[]>(),
    db.from("documents").select("id", { count: "exact", head: true }).eq("user_id", id),
    db.from("lawyer_reviews").select("id", { count: "exact", head: true }).eq("user_id", id),
    db.from("admins").select("user_id").eq("user_id", id).maybeSingle(),
    db.from("admin_audit").select("created_at, action").eq("target_type", "account").eq("target_id", id).order("created_at", { ascending: false }).limit(10),
  ]);

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
  const providers = ((user.app_metadata?.providers as string[] | undefined) ?? [user.app_metadata?.provider as string]).filter(Boolean);
  const twoStep = (user.factors ?? []).some((f) => f.status === "verified");
  const rows = cases ?? [];
  // Our copy of last_checked_at only moves when a status changes, so ask the checker directly.
  const remote = caseEngineEnabled() && rows.length > 0 ? await engine.list(id).catch(() => null) : null;
  const live = remote ? new Map(remote.map((c) => [c.receiptNumber, c.lastCheckedAt])) : null;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/accounts" className={`-ml-1 inline-flex min-h-8 w-fit items-center gap-1 rounded px-1 text-small font-medium text-slate hover:text-midnight ${focusRing}`}>
        <ArrowLeft aria-hidden className="size-3.5" />
        All accounts
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className={`${appTitle} [overflow-wrap:anywhere]`}>{user.email ?? "No email"}</h1>
          <p className="text-small text-slate">
            {name || "No name"} · joined {when(user.created_at)}
          </p>
        </div>
        <span className="rounded-full bg-ice px-3 py-1 text-small font-semibold text-blue">{user.app_metadata?.plan === "premium" ? "Premium" : "Free"}</span>
      </div>

      <section className={appCard}>
        <h2 className={`${appSectionTitle} border-b border-border ${rowPad} py-3`}>Sign-in</h2>
        <dl className="divide-y divide-border">
          <Row label="Signs in with">{providers.map((p) => PROVIDER[p] ?? p).join(", ") || "Unknown"}</Row>
          <Row label="Email confirmed">{user.email_confirmed_at ? when(user.email_confirmed_at) : "Not yet"}</Row>
          <Row label="Last sign-in">{when(user.last_sign_in_at)}</Row>
          <Row label="Two-step sign-in">{twoStep ? "On" : "Off"}</Row>
          {user.banned_until && <Row label="Blocked until">{when(user.banned_until)}</Row>}
          <Row label="Username">{profile?.username ?? "None"}</Row>
          <Row label="Case emails">{profile?.email_notifications === false ? "Off" : "On"}</Row>
          <Row label="Document reminders">{profile?.document_reminders === false ? "Off" : "On"}</Row>
          <Row label="Other">
            {docs.count ?? 0} document{docs.count === 1 ? "" : "s"} · {reviews.count ?? 0} lawyer review{reviews.count === 1 ? "" : "s"}
            {admin.data ? " · admin" : ""}
          </Row>
        </dl>
      </section>

      <section className={appCard}>
        <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-border ${rowPad} py-3`}>
          <div>
            <h2 className={appSectionTitle}>Saved cases ({rows.length})</h2>
            {caseEngineEnabled() && rows.length > 0 && !remote && <p className="text-small text-amber">The case checker didn&apos;t answer, so check dates may be old.</p>}
          </div>
          {caseEngineEnabled() && rows.length > 0 && <AdminButton action={syncAccountCases.bind(null, id)} label="Check cases now" />}
        </div>
        <ul className="divide-y divide-border">
          {rows.map((c) => (
            <li key={c.id} className={`flex flex-col gap-1 ${rowPad} py-3 text-small sm:flex-row sm:items-start sm:justify-between sm:gap-4`}>
              <div className="min-w-0">
                <p className="font-mono text-midnight">
                  {c.receipt_number}
                  <span className="ml-2 font-sans text-slate">{[c.form_type, c.label].filter(Boolean).join(" · ")}</span>
                </p>
                <p className="text-midnight">{c.current_status ?? "No status yet"}</p>
              </div>
              <p className={`shrink-0 sm:text-right ${c.checks_stopped || c.uscis_not_found || !c.engine_registered_at || (live && !live.has(c.receipt_number)) ? "text-amber" : "text-slate"}`}>{checkState(c, live)}</p>
            </li>
          ))}
          {rows.length === 0 && <li className={`${rowPad} py-4 text-small text-slate`}>No saved cases.</li>}
        </ul>
      </section>

      {(log ?? []).length > 0 && (
        <section className={appCard}>
          <h2 className={`${appSectionTitle} border-b border-border ${rowPad} py-3`}>Admin history</h2>
          <ul className="divide-y divide-border">
            {(log ?? []).map((l, i) => (
              <li key={i} className={`flex justify-between gap-3 ${rowPad} py-2.5 text-small`}>
                <span className="text-midnight">{l.action === "account.cases_synced" ? "Cases checked by an admin" : l.action}</span>
                <span className="shrink-0 text-slate tabular-nums">{when(l.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={appPanel}>
        <h2 className={appSectionTitle}>Deleting this account</h2>
        <p className="mt-1 text-small text-slate">
          Only when the person asks from this email address. In Supabase, first delete the folder <span className="font-mono">{id}</span> in the
          Storage bucket &ldquo;documents&rdquo; (deleting the user doesn&apos;t remove files). Then open Authentication, then Users, and delete this
          user: their profile, saved cases, document records and reviews go with it.
        </p>
      </section>
    </div>
  );
}

export default function AdminAccount({ params }: PageProps<"/admin/accounts/[id]">) {
  return (
    <Suspense fallback={<div className="skeleton h-96 rounded-xl" />}>
      <AdminOnly next="/admin/accounts">
        <AccountDetail params={params} />
      </AdminOnly>
    </Suspense>
  );
}
