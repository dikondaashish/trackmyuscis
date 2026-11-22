import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAccount } from "@/lib/account";
import { caseEngineEnabled } from "@/lib/case-engine/client";
import { CASE_COLUMNS, caseStatus, caseTitle, formFor, receiptFacts, lastStatusChange, shortDate, statusTimeline, type CaseRow } from "@/lib/cases";
import { USCIS_PROCESSING_TIMES, officialFormUrl, statusId } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CheckOnUscisButton, CopyButton, EditRemoveButtons } from "@/components/app/CaseActions";
import { CaseSkeleton } from "@/components/app/Skeletons";
import { StatusTimeline } from "@/components/app/StatusTimeline";
import { WorkPermitCategory } from "@/components/app/WorkPermitCategory";
import { asksFilingCategory, suggestCategory } from "@/lib/filing-category";
import { appLink, appPage, appPanel, appTitle, focusRing } from "@/lib/ui";

export const metadata = pageMetadata({
  title: "Case",
  description: "One of the USCIS cases you saved on TrackMyUSCIS.",
  path: "/dashboard",
  noindex: true,
});

const panel = appPanel;
const link = appLink;
const sectionLabel = "text-caption font-medium text-slate";

export default function CasePage({ params }: PageProps<"/dashboard/cases/[id]">) {
  return (
    <div className={appPage}>
      <Link href="/dashboard" className={`-ml-1 inline-flex min-h-8 items-center gap-1 rounded px-1 text-small font-medium text-slate hover:text-midnight ${focusRing}`}>
        <ArrowLeft aria-hidden className="size-3.5" />
        Your cases
      </Link>
      <Suspense fallback={<CaseSkeleton />}>
        <CaseDetail params={params} />
      </Suspense>
    </div>
  );
}

async function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await getAccount(`/dashboard/cases/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: c } = await supabase.from("cases").select(CASE_COLUMNS).eq("id", id).maybeSingle<CaseRow>();
  if (!c) notFound();

  const facts = receiptFacts(c.receipt_number);
  const form = formFor(c.form_type);
  const status = caseStatus(c);
  const autoChecks = caseEngineEnabled();
  const timeline = c.status_history?.length ? statusTimeline(c) : [];
  const changed = lastStatusChange(c);
  const asksCategory = asksFilingCategory(c.form_type);
  let suggested: ReturnType<typeof suggestCategory> = null;
  if (asksCategory && !c.filing_category) {
    const { data: others } = await supabase.from("cases").select("form_type").neq("id", c.id).returns<{ form_type: string | null }[]>();
    suggested = suggestCategory((others ?? []).map((o) => o.form_type));
  }

  return (
    <>
      <header className="enter mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className={`${appTitle} break-words`}>{caseTitle(c)}</h1>
            {form && <span className="rounded-full border border-border bg-white px-2 text-caption leading-5 font-medium text-slate">{form.form}</span>}
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-small text-slate tabular-nums tracking-wide">{c.receipt_number}</span>
            <CopyButton value={c.receipt_number} />
          </div>
        </div>
        <EditRemoveButtons existing={{ id: c.id, receipt_number: c.receipt_number, label: c.label, form_type: c.form_type }} />
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="stagger flex min-w-0 flex-col gap-4" style={{ "--stagger-base": "120ms" } as React.CSSProperties}>
          <section aria-labelledby="status-title" className={panel}>
            <h2 id="status-title" className={sectionLabel}>
              Status
            </h2>
            {status ? (
              <>
                <div className="mt-2">
                  <StatusBadge tone={status.tone}>{status.name}</StatusBadge>
                </div>
                {status.meaning && <p className="mt-2.5 max-w-prose text-small text-midnight">{status.meaning}</p>}
                {c.status_description && (
                  <p className="mt-2.5 max-w-prose text-small text-slate">
                    <span className="font-medium text-midnight">USCIS says: </span>
                    {c.status_description}
                  </p>
                )}
                {(changed || c.last_checked_at) && (
                  <p className="mt-1.5 text-caption text-slate">
                    {[
                      changed && `Changed ${changed}`,
                      c.last_checked_at && `Last checked ${shortDate.format(new Date(c.last_checked_at))}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                <Link href={`/dashboard/statuses#${statusId(status.name)}`} className={`${link} mt-2`}>
                  What this status means
                  <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              </>
            ) : (
              <>
                <p className="mt-1.5 text-body font-semibold text-midnight">Not checked yet</p>
                <p className="mt-0.5 max-w-prose text-small text-slate">
                  {autoChecks
                    ? "We're checking this with USCIS. The status shows here as soon as it's ready."
                    : "Automatic updates are on the way. For now, the official status is one click away."}
                </p>
              </>
            )}
            <div className="mt-4 border-t border-border pt-4">
              <CheckOnUscisButton receipt={c.receipt_number} />
            </div>
          </section>

          {asksCategory && (
            <WorkPermitCategory caseId={c.id} saved={c.filing_category} premium={c.premium_processing} suggested={suggested} />
          )}

          {timeline.length > 0 && <StatusTimeline entries={timeline} className={panel} />}

          <section aria-labelledby="steps-title" className={panel}>
            <h2 id="steps-title" className={sectionLabel}>
              {form ? `Typical steps for Form ${form.form}` : "Typical steps"}
            </h2>
            {form ? (
              <>
                <ol className="mt-3">
                  {form.milestones.map((m, i) => (
                    <li key={m} className="relative flex gap-3 pb-3.5 last:pb-0">
                      {i < form.milestones.length - 1 && (
                        <span
                          aria-hidden
                          className="grow-y absolute top-6 bottom-0 left-[11px] w-px bg-border"
                          style={{ animationDelay: `${450 + i * 120}ms` }}
                        />
                      )}
                      <span
                        className="pop flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-white text-caption font-medium text-slate tabular-nums"
                        style={{ animationDelay: `${380 + i * 120}ms` }}
                      >
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-small text-midnight">{m}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-caption text-slate">Most {form.form} cases follow these steps. Yours may skip one or add one, like a request for evidence.</p>
              </>
            ) : (
              <p className="mt-2 max-w-prose text-small text-slate">
                {c.form_type
                  ? `We don't have a step guide for Form ${c.form_type} yet. Your USCIS notices list what comes next.`
                  : "The typical steps show here once USCIS tells us which form this case is for, usually with the first status check."}
              </p>
            )}
          </section>
        </div>

        <aside className="stagger flex flex-col gap-4" style={{ "--stagger-base": "220ms" } as React.CSSProperties}>
          <section aria-labelledby="receipt-title" className={panel}>
            <h2 id="receipt-title" className={sectionLabel}>
              About this receipt number
            </h2>
            <dl className="mt-3 flex flex-col gap-3 text-small">
              <div>
                <dt className="text-caption text-slate">Office</dt>
                <dd className="font-medium text-midnight">{facts.office ?? `Office code ${facts.prefix}`}</dd>
              </div>
              {facts.online && (
                <div>
                  <dt className="text-caption text-slate">Filed</dt>
                  <dd className="font-medium text-midnight">Online, in a USCIS account</dd>
                </div>
              )}
              <div>
                <dt className="text-caption text-slate">Fiscal year in the number</dt>
                <dd className="font-medium text-midnight">
                  FY{facts.fiscalYear} <span className="font-normal text-slate">({facts.fiscalRange})</span>
                </dd>
              </div>
              <div>
                <dt className="text-caption text-slate">Saved here</dt>
                <dd className="font-medium text-midnight">{shortDate.format(new Date(c.created_at))}</dd>
              </div>
            </dl>
            <Link href="/dashboard/answers/uscis-receipt-number-letters" className={`${link} mt-2`}>
              What the letters mean
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </section>

          <section aria-labelledby="links-title" className={panel}>
            <h2 id="links-title" className={sectionLabel}>
              Helpful links
            </h2>
            <ul className="mt-1.5 flex flex-col">
              {form && (
                <li>
                  <Link href={`/dashboard/forms/${form.slug}`} className={link}>
                    Form {form.form} in plain English
                    <ArrowRight aria-hidden className="size-3.5" />
                  </Link>
                </li>
              )}
              <li>
                <a href={USCIS_PROCESSING_TIMES} target="_blank" rel="noopener noreferrer" className={link}>
                  Official processing times
                  <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              {form && (
                <li>
                  <a href={officialFormUrl(form)} target="_blank" rel="noopener noreferrer" className={link}>
                    Form {form.form} on uscis.gov
                    <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              )}
              <li>
                <Link href="/lawyers" className={link}>
                  Find an immigration lawyer
                  <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
