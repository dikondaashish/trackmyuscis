import Link from "next/link";
import { Check } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { btnPrimary, card, readContainer, section } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing: Free USCIS Case Tracker",
  description: "TrackMyUSCIS is free: track your case status in a free account, check receipt numbers and read case status meanings and processing times. No card needed.",
  path: "/pricing",
});

const FREE = [
  "Save your cases in a free account and see each one's USCIS status, checked about once a day",
  "Check and decode receipt numbers, no account needed",
  "Plain-language case status meanings",
  "Official processing times for every office",
  "Answers to common USCIS questions",
  "Where to find free and low-cost legal help",
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Pricing", description: "TrackMyUSCIS is free.", path: "/pricing" }), breadcrumbSchema([{ name: "Pricing", path: "/pricing" }])]} />
      <PageIntro title="Pricing" description="Everything on TrackMyUSCIS is free." width={readContainer} />
      <section className={section}>
        <div className={readContainer}>
          <div className={`${card} grid overflow-hidden sm:grid-cols-[1fr_1.4fr]`}>
            <div className="flex flex-col p-5 sm:p-6">
              <h2 className="text-title text-midnight">Free</h2>
              <p className="mt-3 text-h1 text-midnight tabular-nums">$0</p>
              <p className="mt-2 text-body text-slate">No card needed. An account is only for saving your cases.</p>
              <Link href="/#track" className={`mt-8 sm:mt-auto ${btnPrimary}`}>
                Track Case
              </Link>
            </div>
            <div className="border-t border-border bg-cloud p-6 sm:border-t-0 sm:border-l sm:p-6">
              <h3 className="text-small font-semibold text-midnight">What you get</h3>
              <ul className="mt-4 space-y-3">
                {FREE.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-body text-midnight">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-small text-slate">
            If we ever add a paid option, it will be optional and listed here before it starts.
          </p>
        </div>
      </section>
    </>
  );
}
