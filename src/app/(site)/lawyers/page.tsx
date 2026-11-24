import { Suspense } from "react";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { LawyerSearch, LawyerSearchWithResult } from "@/components/LawyerSearch";
import { PageIntro } from "@/components/ui/PageIntro";
import { RichText } from "@/components/ui/RichText";
import { DOJ_ROSTER, EOIR_PRO_BONO, USCIS_FIND_LEGAL } from "@/lib/content";
import { panel, readContainer, rowPad, rows, section, textLink } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const DESCRIPTION =
  "Where to find free or low-cost immigration legal help, and how to check that a lawyer or accredited representative is real before you pay anyone.";

export const metadata = pageMetadata({
  title: "How to Find an Immigration Lawyer You Can Trust",
  description: DESCRIPTION,
  path: "/lawyers",
});

/** Official places to find help today. Our own directory is not open yet, and the page says so. */
const WHERE = [
  {
    title: "Free or low-cost help",
    body: `The Department of Justice keeps a [list of pro bono legal service providers](${EOIR_PRO_BONO}).`,
  },
  {
    title: "Accredited representatives",
    body: `Non-lawyers can give immigration legal advice only if they are accredited by the Department of Justice and work for a recognized organization. Check the [DOJ roster](${DOJ_ROSTER}).`,
  },
  {
    title: "Private attorneys",
    body: "A lawyer licensed in any U.S. state can handle immigration cases anywhere in the country. Look them up on their state bar's website to confirm the license is active.",
  },
];

const CHECKS = [
  "Ask for the fee in writing before you pay.",
  "Never sign a blank form, or one with information that isn't true.",
  "Keep your original documents and get a copy of everything filed for you.",
  "A notario, notary or immigration consultant is not allowed to give immigration legal advice in the United States.",
];

export default function LawyersPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Find an immigration lawyer", description: DESCRIPTION, path: "/lawyers" }), breadcrumbSchema([{ name: "Find a lawyer", path: "/lawyers" }])]} />
      <PageIntro
        title="Find an immigration lawyer"
        description="Where to find real legal help today, and how to check someone before you pay them."
        width={readContainer}
      />
      <section className={section}>
        <div className={readContainer}>
          <h2 className="text-h3 font-semibold text-midnight">Where to look</h2>
          <ul className={`mt-6 ${rows}`}>
            {WHERE.map((w) => (
              <li key={w.title} className={`${rowPad} py-6`}>
                <h3 className="text-title font-semibold text-midnight">{w.title}</h3>
                <p className="mt-1 text-body text-slate">
                  <RichText text={w.body} />
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-body text-slate">
            <RichText text={`USCIS explains the options on its [find legal services page](${USCIS_FIND_LEGAL}).`} />
          </p>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">Before you pay anyone</h2>
          <ul className={`mt-6 ${rows}`}>
            {CHECKS.map((c) => (
              <li key={c} className={`flex items-start gap-3 ${rowPad} py-4 text-body text-midnight`}>
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.5} />
                {c}
              </li>
            ))}
          </ul>
          <Link href="/scams" className={`mt-4 ${textLink}`}>
            How to avoid immigration scams
          </Link>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">Our lawyer directory</h2>
          <p className="mt-4 text-body text-slate">
            <RichText text="The directory is not open yet, so a search returns no listings today. We are taking applications from lawyers now. When it opens, every attorney's state bar license is checked before they appear. Lawyers pay a flat yearly fee to be listed, and it never changes the order of results. See [how listings work](/advertising)." />
          </p>
          <div className={`mt-6 ${panel}`}>
            <Suspense fallback={<LawyerSearch />}>
              <LawyerSearchWithResult />
            </Suspense>
          </div>
          <div className={`mt-12 flex flex-col items-start gap-3 ${panel} sm:p-8`}>
            <h2 className="text-title text-midnight">Are you an immigration lawyer?</h2>
            <p className="text-body text-slate">
              Attorneys and DOJ-accredited representatives can apply to be listed. It&apos;s free while the directory is launching.
            </p>
            <Link href="/lawyers/join" className={`mt-1 ${textLink}`}>
              List your practice
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
