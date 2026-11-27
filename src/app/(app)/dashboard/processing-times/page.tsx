import { GuideLinks, GuidePage, guideSectionTitle } from "@/components/app/Guide";
import { PROCESSING_TIPS } from "@/lib/content";
import { PT_FORMS, rangeSummary } from "@/lib/processing-times";
import { pageMetadata } from "@/lib/seo";
import { appCard } from "@/lib/ui";

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
      description="The official time for each form. Open one to find your office and check your own dates."
    >
      <GuideLinks
        items={PT_FORMS.map((p) => ({
          href: `/processing-times/${p.form.slug}`,
          title: `${p.form.form} · ${p.form.label}`,
          note: rangeSummary(p),
        }))}
      />

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
