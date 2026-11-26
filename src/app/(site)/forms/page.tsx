import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrackCard } from "@/components/TrackCard";
import { SourceNote } from "@/components/ui/SourceNote";
import { ToolHero } from "@/components/ui/ToolHero";
import { FORMS, USCIS_ALL_FORMS, USCIS_FEE_SCHEDULE } from "@/lib/content";
import { FEE_SCHEDULE_EDITION, FORM_FACTS } from "@/lib/form-facts";
import { getPtForm, PT_CHECKED, rangeText } from "@/lib/processing-times";
import { cardLink, container, rowArrow } from "@/lib/ui";

/** "From $625": the lowest plain fee on the form's rows. */
function fromFee(slug: string) {
  const rows = FORM_FACTS[slug]?.fees ?? [];
  // The adult paper and online rows when a form has them; children's and add-on rows are on its page.
  const main = rows.filter((r) => /^filed (on paper|online)$/i.test(r.label));
  const amounts = (main.length ? main : rows).map((r) => r.amount).filter((a) => /^\$[\d,]+$/.test(a));
  if (amounts.length === 0) return undefined;
  const low = amounts.reduce((a, b) => (Number(a.replace(/\D/g, "")) <= Number(b.replace(/\D/g, "")) ? a : b));
  return amounts.length > 1 ? `From ${low}` : low;
}
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "USCIS Forms Explained: I-485, I-130, N-400",
  description: "What each common USCIS form is for, who files it and the steps most cases go through after filing, explained in plain English.",
  path: "/forms",
});

export default function FormsPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "USCIS forms explained", description: "What each common USCIS form is for and the steps after filing.", path: "/forms", type: "CollectionPage" }), breadcrumbSchema([{ name: "Forms", path: "/forms" }]), itemListSchema("USCIS forms", FORMS.map((f) => ({ name: `Form ${f.form}: ${f.title}`, path: `/forms/${f.slug}` })))]} />
      <ToolHero
        title="USCIS forms"
        description="Pick your form for its fee, what to send, the steps after filing and how long it is taking."
        meta={<p>Fees from the USCIS Fee Schedule dated {FEE_SCHEDULE_EDITION} · Times read {longDate(PT_CHECKED)}</p>}
      />
      <section className="pb-16 sm:pb-20">
        <div className={container}>
          <ul className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {FORMS.map((f) => {
              const pt = getPtForm(f.slug);
              const fee = fromFee(f.slug);
              return (
                <li key={f.slug}>
                  <Link href={`/forms/${f.slug}`} className={`group flex h-full flex-col p-5 sm:p-6 ${cardLink}`}>
                    <span className="flex items-start justify-between gap-4">
                      <span className="rounded-lg bg-ice px-2.5 py-1 text-small font-semibold text-blue tabular-nums">{f.form}</span>
                      <ArrowRight aria-hidden className={`mt-1 ${rowArrow}`} />
                    </span>
                    <span className="mt-4 block text-title text-midnight transition-colors duration-200 group-hover:text-blue">{f.label}</span>
                    <span className="mt-1 mb-5 block text-body text-slate">{f.about}</span>
                    <span className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-4">
                      <span>
                        <span className="block text-small text-slate">Fee</span>
                        <span className="block text-body font-semibold text-midnight tabular-nums">{fee ?? "Varies"}</span>
                      </span>
                      <span>
                        <span className="block text-small text-slate">Processing time</span>
                        <span className="block text-body font-semibold text-midnight tabular-nums">{pt ? rangeText(pt) : "Varies"}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-h2 text-midnight">Already filed?</h2>
              <p className="mt-3 max-w-xl text-body text-slate">
                Enter the receipt number from your notice. Save it and we check the case with USCIS about once a day.
              </p>
            </div>
            <TrackCard stacked={false} />
          </div>

          <SourceNote className="mt-14" sources={[{ label: "Every USCIS form", href: USCIS_ALL_FORMS }, { label: "Fee Schedule (Form G-1055)", href: USCIS_FEE_SCHEDULE }]} />
        </div>
      </section>
    </>
  );
}
