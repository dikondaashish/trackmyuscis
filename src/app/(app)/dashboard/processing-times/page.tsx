import { ArrowUpRight } from "lucide-react";
import { GuidePage, guideSectionTitle } from "@/components/app/Guide";
import { PROCESSING_STEPS, PROCESSING_TIPS, USCIS_PROCESSING_TIMES } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { appBtnPrimary, appCard } from "@/lib/ui";

// The public /processing-times page is the indexed one.
export const metadata = pageMetadata({
  title: "Processing times",
  description: "How to check how long USCIS is taking for your form and office.",
  path: "/processing-times",
  noindex: true,
});

export default function DashboardProcessingTimesPage() {
  return (
    <GuidePage
      title="USCIS processing times"
      description="USCIS publishes how long each form is taking at each office. Here is how to find yours and what the number means."
    >
      <a href={USCIS_PROCESSING_TIMES} target="_blank" rel="noopener noreferrer" className={appBtnPrimary}>
        Open official processing times
        <ArrowUpRight aria-hidden className="size-3.5" />
        <span className="sr-only">(opens uscis.gov in a new tab)</span>
      </a>

      <h2 className={`mt-8 ${guideSectionTitle}`}>How to check</h2>
      <ol className={`mt-2.5 ${appCard} divide-y divide-border overflow-hidden`}>
        {PROCESSING_STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-3 px-4 py-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ice text-caption font-semibold text-blue tabular-nums">
              {i + 1}
            </span>
            <span className="text-small text-midnight">{step}</span>
          </li>
        ))}
      </ol>

      <h2 className={`mt-8 ${guideSectionTitle}`}>How to read the number</h2>
      <ul className={`mt-2.5 ${appCard} divide-y divide-border overflow-hidden`}>
        {PROCESSING_TIPS.map((t) => (
          <li key={t.title} className="px-4 py-3.5">
            <h3 className="text-small font-semibold text-midnight">{t.title}</h3>
            <p className="mt-0.5 text-small text-slate">{t.body}</p>
          </li>
        ))}
      </ul>
    </GuidePage>
  );
}
