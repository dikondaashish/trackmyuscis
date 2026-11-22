import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAccount } from "@/lib/account";
import { CASE_COLUMNS, caseStatus, caseTitle, formFor, receiptFacts, shortDate, type CaseRow } from "@/lib/cases";
import { USCIS_PROCESSING_TIMES, officialFormUrl, statusId } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CheckOnUscisButton, CopyButton, EditRemoveButtons } from "@/components/app/CaseActions";
import { appPage, card, focusRing } from "@/lib/ui";

export const metadata = pageMetadata({
  title: "Case",
  description: "One of the USCIS cases you saved on TrackMyUSCIS.",
  path: "/dashboard",
  noindex: true,
});

const panel = `${card} p-5 sm:p-6`;
const link = `inline-flex min-h-11 items-center gap-1.5 rounded text-small font-semibold text-blue ${focusRing}`;

export default function CasePage({ params }: PageProps<"/dashboard/cases/[id]">) {
  return (
    <div className={appPage}>
      <Link href="/dashboard" className={`-ml-1 inline-flex min-h-11 items-center gap-1.5 rounded px-1 text-small font-semibold text-slate hover:text-midnight ${focusRing}`}>
        <ArrowLeft aria-hidden className="size-4" />
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

  return (
    <>
      <header className="enter mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-h3 break-words text-midnight">{caseTitle(c)}</h1>
            {form && <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-caption font-semibold text-slate">{form.form}</span>}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-body font-medium text-midnight tabular-nums tracking-wide">{c.receipt_number}</span>
            <CopyButton value={c.receipt_number} />
          </div>
        </div>
        <EditRemoveButtons existing={{ id: c.id, receipt_number: c.receipt_number, label: c.label, form_type: c.form_type }} />
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
        <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
          <section aria-labelledby="status-title" className={panel}>
            <h2 id="status-title" className="text-small font-semibold text-slate">
              Status
            </h2>
            {status ? (
              <>
                <div className="mt-3">
                  <StatusBadge tone={status.tone}>{status.name}</StatusBadge>
                </div>
                {status.meaning && <p className="mt-3 max-w-prose text-body text-midnight">{status.meaning}</p>}
                {c.status_changed_at && (
                  <p className="mt-2 text-small text-slate">Changed {shortDate.format(new Date(c.status_changed_at))}</p>
                )}
                <Link href={`/status-explained#${statusId(status.name)}`} className={`${link} mt-2`}>
                  What this status means
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <p className="mt-2 text-title text-midnight">Not checked yet</p>
                <p className="mt-1 max-w-prose text-body text-slate">
                  Automatic updates are on the way. For now, the official status is one click away.
                </p>
              </>
            )}
            <div className="mt-5 border-t border-border pt-5">
              <CheckOnUscisButton receipt={c.receipt_number} />
            </div>
          </section>

          <section aria-labelledby="steps-title" className={panel}>
            <h2 id="steps-title" className="text-small font-semibold text-slate">
              {form ? `Typical steps for Form ${form.form}` : "Typical steps"}
            </h2>
            {form ? (
              <>
                <ol className="mt-4">
                  {form.milestones.map((m, i) => (
                    <li key={m} className="relative flex gap-4 pb-5 last:pb-0">
                      {i < form.milestones.length - 1 && <span aria-hidden className="absolute top-7 bottom-0 left-[13px] w-px bg-border" />}
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-white text-caption font-semibold text-slate tabular-nums">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-body text-midnight">{m}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-small text-slate">Most {form.form} cases follow these steps. Yours may skip one or add one, like a request for evidence.</p>
              </>
            ) : (
              <p className="mt-2 max-w-prose text-body text-slate">
                Choose this case&apos;s form with <span className="font-semibold text-midnight">Edit</span> to see the steps it usually goes through.
              </p>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:gap-6">
          <section aria-labelledby="receipt-title" className={panel}>
            <h2 id="receipt-title" className="text-small font-semibold text-slate">
              About this receipt number
            </h2>
            <dl className="mt-4 flex flex-col gap-4 text-small">
              <div>
                <dt className="text-slate">Office</dt>
                <dd className="mt-0.5 font-medium text-midnight">{facts.office ?? `Office code ${facts.prefix}`}</dd>
              </div>
              {facts.online && (
                <div>
                  <dt className="text-slate">Filed</dt>
                  <dd className="mt-0.5 font-medium text-midnight">Online, in a USCIS account</dd>
                </div>
              )}
              <div>
                <dt className="text-slate">Fiscal year in the number</dt>
                <dd className="mt-0.5 font-medium text-midnight">
                  FY{facts.fiscalYear} <span className="font-normal text-slate">({facts.fiscalRange})</span>
                </dd>
              </div>
              <div>
                <dt className="text-slate">Saved here</dt>
                <dd className="mt-0.5 font-medium text-midnight">{shortDate.format(new Date(c.created_at))}</dd>
              </div>
            </dl>
            <Link href="/answers/uscis-receipt-number-letters" className={`${link} mt-3`}>
              What the letters mean
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </section>

          <section aria-labelledby="links-title" className={panel}>
            <h2 id="links-title" className="text-small font-semibold text-slate">
              Helpful links
            </h2>
            <ul className="mt-2 flex flex-col">
              {form && (
                <li>
                  <Link href={`/forms/${form.slug}`} className={link}>
                    Form {form.form} in plain English
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </li>
              )}
              <li>
                <a href={USCIS_PROCESSING_TIMES} target="_blank" rel="noopener noreferrer" className={link}>
                  Official processing times
                  <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              {form && (
                <li>
                  <a href={officialFormUrl(form)} target="_blank" rel="noopener noreferrer" className={link}>
                    Form {form.form} on uscis.gov
                    <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              )}
              <li>
                <Link href="/lawyers" className={link}>
                  Find an immigration lawyer
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}

function CaseSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading case">
      <div className="mt-4 h-8 w-64 animate-pulse rounded bg-border/70" />
      <div className="mt-2 h-5 w-40 animate-pulse rounded bg-border/70" />
      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
        <div className={`${card} h-64 animate-pulse`} />
        <div className={`${card} h-56 animate-pulse`} />
      </div>
    </div>
  );
}
