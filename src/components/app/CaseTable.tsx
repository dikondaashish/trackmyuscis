import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { caseStatus, caseTitle, lastStatusChange, premiumSince, receiptFacts, shortDate, statusTimeline, type CaseRow } from "@/lib/cases";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/app/CaseActions";
import { TimelineList } from "@/components/app/StatusTimeline";
import { appCard, focusRing } from "@/lib/ui";
import { asksFilingCategory, categoryFor, suggestCategory } from "@/lib/filing-category";
import { asksBiometrics, biometricsScheduledOn } from "@/lib/biometrics";
import { BiometricsQuestion, PurposeQuestion } from "@/components/app/CaseRowQuestions";

const biometricsDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const cols = "sm:grid sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_6rem_1rem] sm:items-center sm:gap-x-5 sm:gap-y-1";

/** The saved cases as a table (rows stack on phones); each row opens its case. */
export function CaseTable({ cases }: { cases: CaseRow[] }) {
  return (
    <div className={`${appCard} enter enter-delay mt-4 overflow-hidden`}>
      <div className={`hidden border-b border-border bg-cloud/60 px-4 py-2 text-caption font-medium text-slate ${cols}`} aria-hidden>
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
          const history = c.status_history?.length ? statusTimeline(c) : [];
          const changed = lastStatusChange(c);
          const asksCategory = asksFilingCategory(c.form_type);
          const category = asksCategory ? categoryFor(c.filing_category, c.form_type) : undefined;
          // Any form can be premium (I-765, I-129, I-140…); USCIS gives the date in the history.
          const premium = premiumSince(c);
          const confirmBiometrics = !c.biometrics_attended_date && asksBiometrics(c.current_status, c.status_history);
          return (
            <li key={c.id} className={`group relative py-3 pr-10 pl-4 sm:py-2.5 sm:pr-4 transition-colors duration-200 hover:bg-cloud/70 ${cols}`}>
              <div className="min-w-0">
                <Link
                  href={`/dashboard/cases/${c.id}`}
                  className={`block truncate rounded text-small font-semibold text-midnight after:absolute after:inset-0 after:content-[''] ${focusRing}`}
                >
                  {caseTitle(c)}
                </Link>
                {category && (
                  <div className="truncate text-caption text-midnight">
                    {category.label}
                    {category.code && <span className="text-slate tabular-nums"> · {category.code}</span>}
                  </div>
                )}
                <div className="truncate text-caption text-slate">{facts.office ?? "USCIS"}</div>
                {premium !== null && (
                  <div className="truncate text-caption font-medium text-teal tabular-nums">
                    {premium ? `Premium processing since ${premium}` : "Premium processing"}
                  </div>
                )}
                {c.biometrics_attended_date && (
                  <div className="truncate text-caption text-slate tabular-nums">
                    Biometrics completed {biometricsDate.format(Date.parse(`${c.biometrics_attended_date}T00:00:00Z`))}
                  </div>
                )}
                {confirmBiometrics && <BiometricsQuestion caseId={c.id} scheduledOn={biometricsScheduledOn(c.status_history)} />}
                {asksCategory && !category && (
                  <PurposeQuestion
                    caseId={c.id}
                    formType={c.form_type!}
                    suggested={suggestCategory(c.form_type, cases.filter((o) => o.id !== c.id).map((o) => o.form_type))}
                  />
                )}
              </div>
              <div className="mt-1 flex items-center gap-0.5 sm:mt-0">
                <span className="text-small font-medium text-midnight tabular-nums tracking-wide">{c.receipt_number}</span>
                {/* Phones copy from the case page. */}
                <span className="hidden sm:block">
                  <CopyButton value={c.receipt_number} />
                </span>
              </div>
              <div className="mt-1.5 sm:mt-0">
                {status ? (
                  <>
                    <StatusBadge tone={status.tone}>{status.name}</StatusBadge>
                    {changed && <p className="mt-0.5 text-caption text-slate tabular-nums">Changed {changed}</p>}
                  </>
                ) : c.uscis_not_found ? (
                  <StatusBadge tone="warning">Not found at USCIS</StatusBadge>
                ) : (
                  <span className="text-small text-slate">Not checked yet</span>
                )}
              </div>
              <p className="hidden text-small text-slate tabular-nums sm:block">{shortDate.format(new Date(c.created_at))}</p>
              <ChevronRight
                aria-hidden
                className="absolute top-5 right-4 size-3.5 text-slate transition-transform duration-200 group-hover:translate-x-0.5 sm:static motion-reduce:transition-none"
              />
              {history.length > 1 && (
                // Above the row's link, so opening it doesn't open the case.
                <details className="group/history relative z-10 mt-1.5 sm:col-span-5 sm:mt-0">
                  <summary
                    className={`-ml-1 inline-flex min-h-8 cursor-pointer list-none items-center gap-1 rounded px-1 text-caption font-medium text-blue hover:text-midnight [&::-webkit-details-marker]:hidden ${focusRing}`}
                  >
                    Status history · {history.length} updates
                    <ChevronDown
                      aria-hidden
                      className="size-3.5 transition-transform duration-200 group-open/history:rotate-180 motion-reduce:transition-none"
                    />
                  </summary>
                  <TimelineList entries={history} className="mt-2 mb-1 max-w-md" />
                </details>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

