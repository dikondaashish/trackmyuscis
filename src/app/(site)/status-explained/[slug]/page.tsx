import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightCircle, BookOpen, FileText, Info, ListChecks, type LucideIcon } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { TrackCard } from "@/components/TrackCard";
import { LinkRows } from "@/components/ui/LinkRows";
import { Questions } from "@/components/ui/Questions";
import { SourceNote } from "@/components/ui/SourceNote";
import { ToolHero } from "@/components/ui/ToolHero";
import { Prose } from "@/components/ui/Prose";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { breadcrumbSchema, faqSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { getStatusPage, STATUS_DETAIL_PAGES, STATUS_PAGES, statusHref, statusId, STATUSES_UPDATED, TONE_LABEL } from "@/lib/statuses";
import { card, container, focusRing, panel, section } from "@/lib/ui";

/** The three parts most status pages share get their own icon; any other part gets a plain one. */
const SECTION_ICON: Record<string, LucideIcon> = {
  "What it means": BookOpen,
  "What to do now": ListChecks,
  "What usually comes next": ArrowRightCircle,
};

/** Every status page is prerendered; unknown ones return a real 404. */
export const instant = false;

export function generateStaticParams() {
  return STATUS_DETAIL_PAGES.map((s) => ({ slug: statusId(s.name) }));
}

export async function generateMetadata({ params }: PageProps<"/status-explained/[slug]">): Promise<Metadata> {
  const s = getStatusPage((await params).slug);
  if (!s) return {};
  return pageMetadata({
    title: s.seoTitle ?? `${s.name}: What It Means`,
    description: s.description ?? s.meaning,
    path: statusHref(s),
    type: "article",
  });
}

/**
 * One USCIS case status. Answer first, then what it means, what to do and what comes next,
 * the questions people ask about it, the official sources and the statuses around it.
 */
export default async function StatusPage({ params }: PageProps<"/status-explained/[slug]">) {
  const s = getStatusPage((await params).slug);
  if (!s || !s.short) notFound();
  const path = statusHref(s);
  const faq = s.faq ?? [];
  // Five statuses in their usual order, with this one among them.
  const at = STATUS_PAGES.findIndex((x) => x.name === s.name);
  const from = Math.max(0, Math.min(at - 2, STATUS_PAGES.length - 5));
  const around = STATUS_PAGES.slice(from, from + 5);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: `${s.name}: what it means`, description: s.short, path, speakable: ["#short-answer"], dateModified: STATUSES_UPDATED }),
          faqSchema([{ q: `What does “${s.name}” mean?`, a: s.short }, ...faq]),
          breadcrumbSchema([
            { name: "Case statuses", path: "/status-explained" },
            { name: s.name, path },
          ]),
        ]}
      />
      <ToolHero
        title={`“${s.name}”: what it means`}
        back={{ href: "/status-explained", label: "All case statuses" }}
        meta={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge tone={s.tone}>{TONE_LABEL[s.tone]}</StatusBadge>
            <p>Updated {longDate(STATUSES_UPDATED)} · Checked against uscis.gov</p>
          </div>
        }
        body={
          <div id="short-answer" className="max-w-3xl rounded-xl border border-blue/15 bg-ice p-5 sm:p-6">
            <h2 className="text-small font-semibold text-blue">Short answer</h2>
            <p className="mt-2 text-lead text-midnight">{s.short}</p>
          </div>
        }
        aside={
          <nav aria-label="Where this status comes in a typical case" className={`${card} p-5 sm:p-6`}>
            <h2 className="text-small font-semibold text-midnight">In a typical case</h2>
            <ol className="mt-4">
              {around.map((x, i) => {
                const here = x.name === s.name;
                return (
                  <li key={x.name} className="relative flex gap-3 pb-1 last:pb-0">
                    {i < around.length - 1 && <span aria-hidden className="absolute top-7 -bottom-3 left-[7px] w-0.5 bg-border" />}
                    <span
                      aria-hidden
                      className={`relative mt-3.5 size-4 shrink-0 rounded-full border-2 ${here ? "border-blue bg-blue ring-4 ring-blue/15" : "border-border bg-white"}`}
                    />
                    {here ? (
                      <p aria-current="step" className="flex min-h-11 items-center text-body font-semibold text-midnight">
                        {x.name}
                      </p>
                    ) : (
                      <Link href={statusHref(x)} className={`link-draw inline-flex min-h-11 items-center rounded text-small text-slate transition-colors duration-200 hover:text-blue ${focusRing}`}>
                        {x.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-small text-slate">The usual order. Not every case shows every status.</p>
          </nav>
        }
      />

      <section className={section}>
        <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12`}>
          <article className="min-w-0">
            {s.alsoShownAs && (
              <p className="mb-6 max-w-2xl text-small text-slate">
                USCIS also words this status as: {s.alsoShownAs.map((a) => `“${a}”`).join(", ")}. The wording on your account can
                differ slightly.
              </p>
            )}
            <div className="grid gap-4">
              {(s.sections ?? []).map((part) => {
                const Icon = SECTION_ICON[part.heading] ?? FileText;
                return (
                  <section key={part.heading} className={`grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-5 ${panel}`}>
                    <span aria-hidden className="flex size-11 items-center justify-center rounded-xl bg-ice text-blue">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-title font-semibold text-midnight sm:pt-2">{part.heading}</h2>
                      <div className="mt-3 max-w-2xl">
                        <Prose blocks={part.body} />
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {faq.length > 0 && (
              <>
                <h2 className="mt-14 text-h2 text-midnight">Common questions</h2>
                <Questions className="mt-6" items={faq} />
              </>
            )}

            {(s.related ?? []).length > 0 && (
              <>
                <h2 className="mt-14 text-h2 text-midnight">Read next</h2>
                <LinkRows compact className="mt-6" items={(s.related ?? []).map((r) => ({ href: r.href, title: r.title }))} />
              </>
            )}

            <SourceNote className="mt-14" sources={s.sources ?? []} />
            <p className="mt-4 flex items-start gap-2 text-small text-slate">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              General information, not legal advice. Your official USCIS notices always come first.
            </p>
          </article>

          <aside className="lg:pt-1">
            <div className="lg:sticky lg:top-28">
              <TrackCard
                title="See when this status changes"
                text="Enter your receipt number, then save it. We check it with USCIS about once a day and keep the history."
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
