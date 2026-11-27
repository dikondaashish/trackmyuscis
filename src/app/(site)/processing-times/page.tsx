import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TimeCheck } from "@/components/TimeCheck";
import { TrackCard } from "@/components/TrackCard";
import { SourceNote } from "@/components/ui/SourceNote";
import { ToolHero } from "@/components/ui/ToolHero";
import { PROCESSING_TIPS, USCIS_PROCESSING_TIMES } from "@/lib/content";
import { cardLink, container, panel, rowArrow, section } from "@/lib/ui";
import { dependsOnLabel, inMonths, PT_CHECKED, PT_FORMS, range, rangeText, timeCheckForm } from "@/lib/processing-times";
import { longDate } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "USCIS Processing Times by Form and Office",
  description: "Current official USCIS processing times for N-400, I-130, I-485, I-765, I-140 and more, by office and category, plus how to read the number.",
  path: "/processing-times",
});

export default function ProcessingTimesPage() {
  // The longest time of any form: every card's bar is drawn against it.
  const longest = Math.max(...PT_FORMS.map((p) => inMonths(range(p).slowest)));
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "USCIS processing times", description: "How long USCIS is taking for your form and office.", path: "/processing-times", dateModified: PT_CHECKED }), itemListSchema("USCIS processing times by form", PT_FORMS.map((p) => ({ name: `Form ${p.form.form} processing time`, path: `/processing-times/${p.form.slug}` }))), breadcrumbSchema([{ name: "Processing times", path: "/processing-times" }])]} />
      <ToolHero
        title="USCIS processing times"
        description="Find the official time for your form, category and office, and see whether your case is past it."
        meta={<p>Read from USCIS on {longDate(PT_CHECKED)} · Every office and category</p>}
      >
        <TimeCheck forms={PT_FORMS.map((p) => timeCheckForm(p))} checked={longDate(PT_CHECKED)} link="form" />
      </ToolHero>
      <section className={section}>
        <div className={container}>
          <h2 className="text-h2 text-midnight">Processing times by form</h2>
          <p className="mt-3 max-w-2xl text-body text-slate">
            The shortest and longest official time for each form. Open one for every office and category.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PT_FORMS.map((p) => {
              const r = range(p);
              return (
                <li key={p.form.slug}>
                  <Link href={`/processing-times/${p.form.slug}`} className={`group flex h-full flex-col p-5 sm:p-6 ${cardLink}`}>
                    <span className="flex items-start justify-between gap-4">
                      <span className="min-w-0">
                        <span className="block text-title text-midnight transition-colors duration-200 group-hover:text-blue">Form {p.form.form}</span>
                        <span className="block text-body text-slate">{p.form.label}</span>
                      </span>
                      <ArrowRight aria-hidden className={`mt-1 ${rowArrow}`} />
                    </span>
                    <span className="mt-5 block text-h3 text-midnight tabular-nums">{rangeText(p)}</span>
                    <span aria-hidden className="relative mt-3 block h-1.5 rounded-full bg-border">
                      <span
                        className="absolute inset-y-0 rounded-full bg-blue/70"
                        style={{ left: `${(inMonths(r.fastest) / longest) * 100}%`, right: `${100 - Math.max((inMonths(r.slowest) / longest) * 100, (inMonths(r.fastest) / longest) * 100 + 3)}%` }}
                      />
                    </span>
                    <span className="mt-3 block text-small text-slate">
                      {dependsOnLabel(p) === "nothing" ? "One time for every case" : `Depends on the ${dependsOnLabel(p)}`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <h2 className="mt-14 text-h2 text-midnight">How to read the number</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {PROCESSING_TIPS.map((t) => (
              <li key={t.title} className={panel}>
                <h3 className="text-title font-semibold text-midnight">{t.title}</h3>
                <p className="mt-2 text-body text-slate">{t.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <h2 className="text-h2 text-midnight">Waiting on a case?</h2>
              <p className="mt-3 max-w-xl text-body text-slate">
                Save your receipt number and we check it with USCIS about once a day, so you see the status and its history in one
                place.
              </p>
            </div>
            <TrackCard title="Track your case" stacked={false} />
          </div>

          <SourceNote className="mt-14" sources={[{ label: "USCIS: Check case processing times", href: USCIS_PROCESSING_TIMES }]} />
        </div>
      </section>
    </>
  );
}
