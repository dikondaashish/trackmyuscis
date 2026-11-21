import Link from "next/link";
import { Check } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { btnPrimary, card, readContainer, section } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing: Free USCIS Case Tools",
  description: "TrackMyUSCIS is free: receipt number checks, case status meanings, help reading processing times and answers to common USCIS questions, with no account needed.",
  path: "/pricing",
});

const FREE = [
  "Check and decode receipt numbers",
  "Plain-language case status meanings",
  "How to read official processing times",
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
          <div className={`${card} p-8 sm:p-10`}>
            <h2 className="text-h3 font-semibold text-midnight">Free</h2>
            <p className="mt-2 text-h2 font-semibold text-midnight">
              $0
            </p>
            <ul className="mt-8 space-y-3">
              {FREE.map((f) => (
                <li key={f} className="flex items-start gap-3 text-body text-midnight">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/#track" className={`mt-10 w-full ${btnPrimary}`}>
              Track Case
            </Link>
          </div>
          <p className="mt-8 text-body text-slate">
            If we ever add a paid option, it will be optional and listed here before it starts.
          </p>
        </div>
      </section>
    </>
  );
}
