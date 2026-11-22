import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { OfficialSources } from "@/components/OfficialSources";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { Prose } from "@/components/ui/Prose";
import { ANSWERS, ANSWERS_UPDATED, getAnswer } from "@/lib/answers";
import { breadcrumbSchema, faqSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { panel, readContainer, section } from "@/lib/ui";

/** Every known answer is prerendered; unknown ones return a real 404. */
export const instant = false;

export function generateStaticParams() {
  return ANSWERS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/answers/[slug]">): Promise<Metadata> {
  const a = getAnswer((await params).slug);
  return a ? pageMetadata({ title: a.seoTitle ?? a.question, description: a.description, path: `/answers/${a.slug}`, type: "article" }) : {};
}

const updated = new Date(`${ANSWERS_UPDATED}T12:00:00Z`).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * One question, answered first. GOV.UK-style: the short answer in a tinted panel,
 * then a few short sections, the official sources and related questions.
 */
export default async function AnswerPage({ params }: PageProps<"/answers/[slug]">) {
  const a = getAnswer((await params).slug);
  if (!a) notFound();
  const path = `/answers/${a.slug}`;
  const related = a.related.map(getAnswer).filter((r) => r !== undefined);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: a.question, description: a.description, path, speakable: ["#short-answer"], dateModified: ANSWERS_UPDATED }),
          faqSchema([{ q: a.question, a: a.short }]),
          breadcrumbSchema([
            { name: "Answers", path: "/answers" },
            { name: a.question, path },
          ]),
        ]}
      />
      <PageIntro title={a.question} back={{ href: "/answers", label: "All answers" }} width={readContainer}>
        <p className="text-small text-slate">Updated {updated} · Checked against uscis.gov</p>
      </PageIntro>

      <section className={section}>
        <div className={readContainer}>
          <article>
            <div id="short-answer" className="rounded-2xl border border-blue/15 bg-ice p-6 sm:p-8">
              <h2 className="text-small font-semibold text-blue">Short answer</h2>
              <p className="mt-2 text-lead text-midnight">{a.short}</p>
            </div>

            <div className={`mt-6 ${panel} sm:p-10`}>
              {a.sections.map((s, i) => (
                <section key={s.heading} className={i ? "mt-10" : ""}>
                  <h2 className="text-title font-semibold text-midnight">{s.heading}</h2>
                  <div className="mt-3">
                    <Prose blocks={s.body} />
                  </div>
                </section>
              ))}
              <OfficialSources sources={a.sources} className="mt-10 border-t border-border pt-8" />
            </div>

            <p className="mt-6 flex items-start gap-2 text-small text-slate">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              General information, not legal advice. Rules and times change, so confirm with USCIS or a licensed immigration
              attorney before you act.
            </p>

            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="text-h3 text-midnight">Related questions</h2>
                <LinkRows compact className="mt-5" items={related.map((r) => ({ href: `/answers/${r.slug}`, title: r.question }))} />
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
