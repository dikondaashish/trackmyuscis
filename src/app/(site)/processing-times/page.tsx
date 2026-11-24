import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { PROCESSING_STEPS, PROCESSING_TIPS, USCIS_PROCESSING_TIMES } from "@/lib/content";
import { btnPrimary, readContainer, rowPad, rows, section } from "@/lib/ui";
import { LinkRows } from "@/components/ui/LinkRows";
import { PT_CHECKED, PT_FORMS, rangeSummary } from "@/lib/processing-times";
import { longDate } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "USCIS Processing Times by Form and Office",
  description: "Current official USCIS processing times for N-400, I-130, I-485, I-765, I-140 and more, by office and category, plus how to read the number.",
  path: "/processing-times",
});

export default function ProcessingTimesPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "USCIS processing times", description: "How long USCIS is taking for your form and office.", path: "/processing-times", dateModified: PT_CHECKED }), itemListSchema("USCIS processing times by form", PT_FORMS.map((p) => ({ name: `Form ${p.form.form} processing time`, path: `/processing-times/${p.form.slug}` }))), breadcrumbSchema([{ name: "Processing times", path: "/processing-times" }])]} />
      <PageIntro
        title="USCIS processing times"
        description="USCIS publishes how long each form is taking at each office. Here is how to find yours and what the number means."
        width={readContainer}
      >
        <a href={USCIS_PROCESSING_TIMES} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
          Open official processing times
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">(opens uscis.gov in a new tab)</span>
        </a>
      </PageIntro>
      <section className={section}>
        <div className={readContainer}>
          <h2 className="text-h3 font-semibold text-midnight">Processing times by form</h2>
          <p className="mt-3 text-body text-slate">
            Official times for every office and category, read from the USCIS tool on {longDate(PT_CHECKED)}.
          </p>
          <LinkRows
            className="mt-6"
            items={PT_FORMS.map((p) => ({
              href: `/processing-times/${p.form.slug}`,
              title: `Form ${p.form.form}: ${p.form.label}`,
              note: rangeSummary(p),
            }))}
          />

          <h2 className="mt-12 text-h3 font-semibold text-midnight">How to check</h2>
          <ol className={`mt-6 ${rows}`}>
            {PROCESSING_STEPS.map((step, i) => (
              <li key={step} className={`flex items-center gap-4 ${rowPad} py-4`}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue tabular-nums">
                  {i + 1}
                </span>
                <span className="text-body text-midnight">{step}</span>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">How to read the number</h2>
          <ul className={`mt-6 ${rows}`}>
            {PROCESSING_TIPS.map((t) => (
              <li key={t.title} className={`${rowPad} py-6`}>
                <h3 className="text-title font-semibold text-midnight">{t.title}</h3>
                <p className="mt-1 text-body text-slate">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
