import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { OfficialSources } from "@/components/OfficialSources";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { Prose } from "@/components/ui/Prose";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { breadcrumbSchema, faqSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { getStatusPage, STATUS_DETAIL_PAGES, STATUS_PAGES, statusHref, statusId, STATUSES_UPDATED, TONE_LABEL } from "@/lib/statuses";
import { btnPrimary, panel, readContainer, rowPad, rows, section } from "@/lib/ui";

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
  // The statuses just before and after this one in a typical case, then the rest of the list.
  const at = STATUS_PAGES.findIndex((x) => x.name === s.name);
  const nearby = [STATUS_PAGES[at - 1], STATUS_PAGES[at + 1], STATUS_PAGES[at + 2]].filter((x) => x !== undefined);

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
      <PageIntro title={`“${s.name}”: what it means`} back={{ href: "/status-explained", label: "All case statuses" }} width={readContainer}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusBadge tone={s.tone}>{TONE_LABEL[s.tone]}</StatusBadge>
          <p className="text-small text-slate">Updated {longDate(STATUSES_UPDATED)} · Checked against uscis.gov</p>
        </div>
      </PageIntro>

      <section className={section}>
        <div className={readContainer}>
          <article>
            <div id="short-answer" className="rounded-xl border border-blue/15 bg-ice p-5 sm:p-6">
              <h2 className="text-small font-semibold text-blue">Short answer</h2>
              <p className="mt-2 text-lead text-midnight">{s.short}</p>
            </div>

            <div className={`mt-6 ${panel} sm:p-8`}>
              {s.alsoShownAs && (
                <p className="mb-8 text-small text-slate">
                  USCIS also words this status as: {s.alsoShownAs.map((a) => `“${a}”`).join(", ")}. The wording on your account can
                  differ slightly.
                </p>
              )}
              {(s.sections ?? []).map((part, i) => (
                <section key={part.heading} className={i ? "mt-10" : ""}>
                  <h2 className="text-title font-semibold text-midnight">{part.heading}</h2>
                  <div className="mt-3">
                    <Prose blocks={part.body} />
                  </div>
                </section>
              ))}
            </div>

            {faq.length > 0 && (
              <div className="mt-12">
                <h2 className="text-h3 text-midnight">Common questions</h2>
                <div className={`mt-5 ${rows}`}>
                  {faq.map((q) => (
                    <div key={q.q} className={`${rowPad} py-5`}>
                      <h3 className="text-title font-semibold text-midnight">{q.q}</h3>
                      <p className="mt-1 text-body text-slate">{q.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`mt-12 ${panel} sm:p-8`}>
              <OfficialSources sources={s.sources ?? []} />
            </div>

            <p className="mt-6 flex items-start gap-2 text-small text-slate">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              General information, not legal advice. Your official USCIS notices always come first.
            </p>

            <div className={`mt-12 flex flex-col items-start gap-3 ${panel} sm:p-8`}>
              <h2 className="text-title text-midnight">See when this status changes</h2>
              <p className="text-body text-slate">
                Save your receipt number in a free account. We check it with USCIS about once a day and show the latest status and
                its history.
              </p>
              <Link href="/sign-up" className={`mt-1 ${btnPrimary}`}>
                Create free account
              </Link>
            </div>

            {(s.related ?? []).length > 0 && (
              <div className="mt-12">
                <h2 className="text-h3 text-midnight">Read next</h2>
                <LinkRows compact className="mt-5" items={(s.related ?? []).map((r) => ({ href: r.href, title: r.title }))} />
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-h3 text-midnight">Statuses around this one</h2>
              <LinkRows compact className="mt-5" items={nearby.map((x) => ({ href: statusHref(x), title: x.name, note: x.meaning }))} />
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
