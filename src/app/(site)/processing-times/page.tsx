import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { USCIS_PROCESSING_TIMES } from "@/lib/content";
import { btnPrimary, readContainer, rowPad, rows, section } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "USCIS Processing Times by Form and Office",
  description: "How to check how long USCIS is taking for your form and office, a direct link to the official processing-times tool and what the numbers mean.",
  path: "/processing-times",
});

const STEPS = [
  "Open the official USCIS processing times page.",
  "Choose your form, then the category on your receipt notice.",
  "Choose the office named on your receipt notice (Form I-797C).",
  "Read the time shown: most cases at that office finish within it.",
];

const TIPS = [
  {
    title: "It is a range, not a promise",
    body: "USCIS shows how long it took to finish most recent cases. Yours can be faster or slower.",
  },
  {
    title: "Your office matters",
    body: "The same form can take very different times at different offices. Your receipt notice names yours.",
  },
  {
    title: "Past the normal time?",
    body: "If your receipt date is earlier than the date USCIS lists for inquiries, you can submit a case inquiry.",
  },
];

export default function ProcessingTimesPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "USCIS processing times", description: "How long USCIS is taking for your form and office.", path: "/processing-times" }), breadcrumbSchema([{ name: "Processing times", path: "/processing-times" }])]} />
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
          <h2 className="text-h3 font-semibold text-midnight">How to check</h2>
          <ol className={`mt-6 ${rows}`}>
            {STEPS.map((step, i) => (
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
            {TIPS.map((t) => (
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
