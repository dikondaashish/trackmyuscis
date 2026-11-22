import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, FileSearch, Info } from "lucide-react";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { caseEngineEnabled } from "@/lib/case-engine/client";
import { syncUserCases } from "@/lib/case-engine/sync";
import { getAccount } from "@/lib/account";
import { CASE_COLUMNS, MAX_CASES, type CaseRow } from "@/lib/cases";
import { pageMetadata } from "@/lib/seo";
import { AddCaseButton, AddCaseProvider } from "@/components/app/CaseActions";
import { CasesSkeleton } from "@/components/app/Skeletons";
import { CaseTable } from "@/components/app/CaseTable";
import { appCard, appLink, appPage, appTitle, focusRing } from "@/lib/ui";

export const metadata = pageMetadata({
  title: "Your cases",
  description: "The USCIS cases you saved on TrackMyUSCIS.",
  path: "/dashboard",
  noindex: true,
});

export default function CasesPage() {
  return (
    <div className={appPage}>
      <Suspense fallback={<CasesSkeleton />}>
        <Cases />
      </Suspense>
      <Guides />
    </div>
  );
}

async function Cases() {
  const account = await getAccount();
  const supabase = await createClient();
  const { data } = await supabase.from("cases").select(CASE_COLUMNS).order("created_at", { ascending: true }).returns<CaseRow[]>();
  const cases = data ?? [];
  const full = cases.length >= MAX_CASES;
  const unchecked = cases.some((c) => !c.current_status && !c.uscis_not_found);
  const autoChecks = caseEngineEnabled();
  // Register any case the status checker doesn't have yet (a failed sync, or saved before
  // automatic checks started), after the page is sent so it never slows the dashboard.
  // Also refresh not-found cases (no USCIS lookup), so "we stopped checking" shows when it happens.
  if (autoChecks && cases.some((c) => !c.engine_registered_at || (c.uscis_not_found && !c.checks_stopped))) {
    after(() => syncUserCases(account.id).catch(() => console.error("Background case sync failed")));
  }

  return (
    // The provider stays mounted when the first case replaces the empty state, so the add
    // dialog can go on to its second step.
    <AddCaseProvider>
      <div className="enter flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-small text-slate">{account.firstName ? `Hi ${account.firstName}` : "Welcome back"}</p>
          <h1 className={`mt-0.5 ${appTitle}`}>Your cases</h1>
        </div>
        {cases.length > 0 && (
          <div className="flex items-center gap-4">
            <UsageMeter used={cases.length} />
            <AddCaseButton disabled={full} />
          </div>
        )}
      </div>

      {cases.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {unchecked && (
            <div className="enter enter-delay mt-5 flex gap-2.5 rounded-xl bg-ice px-3.5 py-2.5 text-small text-midnight">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-blue" />
              {autoChecks ? (
                <p>We&apos;re checking your new cases with USCIS. Their status shows here as soon as it&apos;s ready.</p>
              ) : (
                <p>
                  Automatic status updates are on the way. Until then, open a case and choose{" "}
                  <span className="font-semibold">Check status on USCIS</span>. We copy the receipt number for you.
                </p>
              )}
            </div>
          )}
          <CaseTable cases={cases} />
        </>
      )}
    </AddCaseProvider>
  );
}

function EmptyState() {
  return (
    <div className={`${appCard} enter enter-delay mt-5 flex flex-col items-center px-6 py-10 text-center sm:py-12`}>
      <EmptyArt />
      <h2 className="mt-4 text-body font-semibold text-midnight">Save your first case</h2>
      <p className="mt-1 max-w-sm text-small text-slate">
        Add the receipt number from your USCIS notice. You can save up to {MAX_CASES} cases for you and your family.
      </p>
      <div className="mt-5">
        <AddCaseButton label="Add your first case" />
      </div>
      <Link
        href="/dashboard/answers/what-is-a-uscis-receipt-number"
        className={`${appLink} mt-2`}
      >
        Where do I find my receipt number?
      </Link>
    </div>
  );
}

const GUIDES = [
  { href: "/dashboard/statuses", icon: BookOpen, title: "What your status means", text: "Every USCIS case status in plain English." },
  { href: "/dashboard/processing-times", icon: Clock, title: "How long it takes", text: "Official processing times by form and office." },
  { href: "/dashboard/answers", icon: FileSearch, title: "Common questions", text: "Receipt notices, biometrics, delays and more." },
];

function Guides() {
  return (
    <section aria-labelledby="guides-title" className="mt-10">
      <h2 id="guides-title" className="text-small font-semibold text-midnight">
        Guides
      </h2>
      <ul className="stagger mt-2.5 grid gap-2.5 sm:grid-cols-3" style={{ "--stagger-base": "260ms" } as React.CSSProperties}>
        {GUIDES.map(({ href, icon: Icon, title, text }) => (
          <li key={href}>
            <Link
              href={href}
              className={`group flex h-full gap-2.5 rounded-xl border border-border bg-white p-3.5 transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-blue/40 motion-reduce:hover:translate-y-0 ${focusRing}`}
            >
              <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-blue" />
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-small font-semibold text-midnight">
                  {title}
                  <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
                <span className="mt-0.5 block text-caption text-slate">{text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** How many of the 10 case slots are used: a number and a short bar that fills on load. */
function UsageMeter({ used }: { used: number }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <p className="text-caption text-slate tabular-nums">
        <span className="font-semibold text-midnight">{used}</span> of {MAX_CASES} saved
      </p>
      <div aria-hidden className="h-1 w-20 overflow-hidden rounded-full bg-border">
        <div className="grow-x h-full rounded-full bg-teal" style={{ width: `${(used / MAX_CASES) * 100}%` }} />
      </div>
    </div>
  );
}

/** Empty-state picture: a receipt notice card with a magnifier that floats gently. */
function EmptyArt() {
  return (
    <div aria-hidden className="relative h-20 w-28 scale-90">
      <div className="absolute inset-x-3 top-2 bottom-0 rounded-xl border border-border bg-cloud" />
      <div className="absolute inset-x-0 top-5 bottom-2 rounded-xl border border-border bg-white p-3 shadow-[0_12px_24px_-16px_rgba(16,34,61,0.35)]">
        <div className="h-2 w-12 rounded-full bg-blue/80" />
        <div className="mt-2 h-1.5 w-20 rounded-full bg-border" />
        <div className="mt-1.5 h-1.5 w-16 rounded-full bg-border" />
        <div className="mt-3 flex gap-1">
          <span className="h-1.5 w-5 rounded-full bg-teal" />
          <span className="h-1.5 w-5 rounded-full bg-teal/50" />
          <span className="h-1.5 w-5 rounded-full bg-border" />
        </div>
      </div>
      <span className="drift absolute -right-3 -bottom-2 flex size-9 items-center justify-center rounded-full bg-blue text-white shadow-[0_8px_20px_-8px_rgba(40,90,199,0.6)]">
        <FileSearch className="size-4" />
      </span>
    </div>
  );
}
