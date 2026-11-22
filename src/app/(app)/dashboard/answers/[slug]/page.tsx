import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { OfficialSources } from "@/components/OfficialSources";
import { Prose } from "@/components/ui/Prose";
import { GuideLinks, GuidePage, guideSectionTitle } from "@/components/app/Guide";
import { ANSWERS, ANSWERS_UPDATED, getAnswer } from "@/lib/answers";
import { pageMetadata } from "@/lib/seo";
import { appPanel } from "@/lib/ui";

/** Every known answer is prerendered; unknown ones return a real 404. */
export const instant = false;

export function generateStaticParams() {
  return ANSWERS.map((a) => ({ slug: a.slug }));
}

// The public /answers/<slug> page is the indexed one.
export async function generateMetadata({ params }: PageProps<"/dashboard/answers/[slug]">): Promise<Metadata> {
  const a = getAnswer((await params).slug);
  return a ? pageMetadata({ title: a.question, description: a.description, path: `/answers/${a.slug}`, noindex: true }) : {};
}

const updated = new Date(`${ANSWERS_UPDATED}T12:00:00Z`).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export default async function DashboardAnswerPage({ params }: PageProps<"/dashboard/answers/[slug]">) {
  const a = getAnswer((await params).slug);
  if (!a) notFound();
  const related = a.related.map(getAnswer).filter((r) => r !== undefined);

  return (
    <GuidePage title={a.question} description={`Updated ${updated} · Checked against uscis.gov`} back={{ href: "/dashboard/answers", label: "All questions" }}>
      <article>
        <div className="rounded-xl border border-blue/15 bg-ice p-4 sm:p-5">
          <h2 className="text-caption font-semibold text-blue">Short answer</h2>
          <p className="mt-1 text-body text-midnight">{a.short}</p>
        </div>

        <div className={`mt-4 ${appPanel}`}>
          {a.sections.map((s, i) => (
            <section key={s.heading} className={i ? "mt-6" : ""}>
              <h2 className={guideSectionTitle}>{s.heading}</h2>
              <div className="mt-2">
                <Prose blocks={s.body} inApp />
              </div>
            </section>
          ))}
          <OfficialSources sources={a.sources} compact className="mt-6 border-t border-border pt-5" />
        </div>

        <p className="mt-4 flex items-start gap-2 text-caption text-slate">
          <Info aria-hidden className="mt-px size-3.5 shrink-0" />
          General information, not legal advice. Rules and times change, so confirm with USCIS or a licensed immigration attorney before
          you act.
        </p>

        {related.length > 0 && (
          <section aria-label="Related questions" className="mt-8">
            <h2 className={guideSectionTitle}>Related questions</h2>
            <GuideLinks className="mt-2.5" items={related.map((r) => ({ href: `/dashboard/answers/${r.slug}`, title: r.question }))} />
          </section>
        )}
      </article>
    </GuidePage>
  );
}
