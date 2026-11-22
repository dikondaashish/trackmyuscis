import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight, Clock, FileSearch, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAccount } from "@/lib/account";
import { CASE_COLUMNS, MAX_CASES, caseStatus, caseTitle, receiptFacts, shortDate, type CaseRow } from "@/lib/cases";
import { pageMetadata } from "@/lib/seo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AddCaseButton, CopyButton } from "@/components/app/CaseActions";
import { CasesSkeleton } from "@/components/app/Skeletons";
import { appPage, card, focusRing } from "@/lib/ui";

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
  const unchecked = cases.some((c) => !c.current_status);

  return (
    <>
      <div className="enter flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-small text-slate">{account.firstName ? `Hi ${account.firstName}` : "Welcome back"}</p>
          <h1 className="mt-1 text-h3 text-midnight">Your cases</h1>
        </div>
        {cases.length > 0 && (
          <div className="flex items-center gap-5">
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
            <div className="enter enter-delay mt-6 flex gap-3 rounded-2xl bg-ice px-4 py-3.5 text-small text-midnight sm:px-5">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-blue" />
              <p>
                Automatic status updates are on the way. Until then, open a case and choose{" "}
                <span className="font-semibold">Check status on USCIS</span>. We copy the receipt number for you.
              </p>
            </div>
          )}
          <CaseTable cases={cases} />
        </>
      )}
    </>
  );
}

const cols = "sm:grid sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_6.5rem_1.25rem] sm:items-center sm:gap-6";

function CaseTable({ cases }: { cases: CaseRow[] }) {
  return (
    <div className={`${card} enter enter-delay mt-6 overflow-hidden`}>
      <div className={`hidden border-b border-border bg-cloud/60 px-5 py-3 text-caption font-semibold text-slate ${cols}`} aria-hidden>
        <span>Case</span>
        <span>Receipt number</span>
        <span>Status</span>
        <span>Saved</span>
        <span />
      </div>
      <ul className="stagger divide-y divide-border" style={{ "--stagger-base": "180ms" } as React.CSSProperties}>
        {cases.map((c) => {
          const status = caseStatus(c);
          const facts = receiptFacts(c.receipt_number);
          return (
            <li key={c.id} className={`group relative py-4 pr-10 pl-5 sm:pr-5 transition-colors duration-200 hover:bg-cloud/70 ${cols}`}>
              <div className="min-w-0">
                <Link
                  href={`/dashboard/cases/${c.id}`}
                  className={`block truncate rounded text-body font-semibold text-midnight after:absolute after:inset-0 after:content-[''] ${focusRing}`}
                >
                  {caseTitle(c)}
                </Link>
                <div className="mt-0.5 truncate text-small text-slate">{facts.office ?? "USCIS"}</div>
              </div>
              <div className="mt-1 flex items-center gap-1 sm:mt-0">
                <span className="text-small font-medium text-midnight tabular-nums tracking-wide">{c.receipt_number}</span>
                {/* Phones copy from the case page; a 44px button here would double the row height. */}
                <span className="hidden sm:block">
                  <CopyButton value={c.receipt_number} />
                </span>
              </div>
              <div className="mt-2 sm:mt-0">
                {status ? (
                  <StatusBadge tone={status.tone}>{status.name}</StatusBadge>
                ) : (
                  <span className="text-small text-slate">Not checked yet</span>
                )}
              </div>
              <p className="hidden text-small text-slate tabular-nums sm:block">{shortDate.format(new Date(c.created_at))}</p>
              <ChevronRight
                aria-hidden
                className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate transition-transform duration-200 group-hover:translate-x-0.5 sm:static sm:translate-y-0 motion-reduce:transition-none"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={`${card} enter enter-delay mt-6 flex flex-col items-center px-6 py-14 text-center sm:py-16`}>
      <EmptyArt />
      <h2 className="mt-5 text-title text-midnight">Save your first case</h2>
      <p className="mt-2 max-w-sm text-body text-slate">
        Add the receipt number from your USCIS notice. You can save up to {MAX_CASES} cases for you and your family.
      </p>
      <div className="mt-6">
        <AddCaseButton label="Add your first case" />
      </div>
      <Link
        href="/answers/what-is-a-uscis-receipt-number"
        className={`mt-3 inline-flex min-h-11 items-center rounded text-small font-semibold text-blue ${focusRing}`}
      >
        Where do I find my receipt number?
      </Link>
    </div>
  );
}

const GUIDES = [
  { href: "/status-explained", icon: BookOpen, title: "What your status means", text: "Every USCIS case status in plain English." },
  { href: "/processing-times", icon: Clock, title: "How long it takes", text: "Official processing times by form and office." },
  { href: "/answers", icon: FileSearch, title: "Common questions", text: "Receipt notices, biometrics, delays and more." },
];

function Guides() {
  return (
    <section aria-labelledby="guides-title" className="mt-12">
      <h2 id="guides-title" className="text-small font-semibold text-midnight">
        Guides
      </h2>
      <ul className="stagger mt-3 grid gap-3 sm:grid-cols-3" style={{ "--stagger-base": "260ms" } as React.CSSProperties}>
        {GUIDES.map(({ href, icon: Icon, title, text }) => (
          <li key={href}>
            <Link
              href={href}
              className={`group flex h-full gap-3 rounded-2xl border border-border bg-white p-4 transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-blue/40 motion-reduce:hover:translate-y-0 ${focusRing}`}
            >
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-blue" />
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-small font-semibold text-midnight">
                  {title}
                  <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
                <span className="mt-0.5 block text-small text-slate">{text}</span>
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
    <div className="flex flex-col items-end gap-1.5">
      <p className="text-small text-slate tabular-nums">
        <span className="font-semibold text-midnight">{used}</span> of {MAX_CASES} saved
      </p>
      <div aria-hidden className="h-1 w-24 overflow-hidden rounded-full bg-border">
        <div className="grow-x h-full rounded-full bg-teal" style={{ width: `${(used / MAX_CASES) * 100}%` }} />
      </div>
    </div>
  );
}

/** Empty-state picture: a receipt notice card with a magnifier that floats gently. */
function EmptyArt() {
  return (
    <div aria-hidden className="relative h-24 w-32">
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
      <span className="drift absolute -right-3 -bottom-2 flex size-11 items-center justify-center rounded-full bg-blue text-white shadow-[0_8px_20px_-8px_rgba(40,90,199,0.6)]">
        <FileSearch className="size-5" />
      </span>
    </div>
  );
}
