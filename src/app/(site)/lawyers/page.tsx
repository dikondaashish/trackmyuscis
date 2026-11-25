import { Suspense } from "react";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { LawyerDirectory, LawyerDirectoryWithSearch } from "@/components/LawyerSearch";
import { PageIntro } from "@/components/ui/PageIntro";
import { RichText } from "@/components/ui/RichText";
import { DOJ_ROSTER, EOIR_PRO_BONO, USCIS_FIND_LEGAL } from "@/lib/content";
import { panel, readContainer, rowPad, rows, section, textLink } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { abs, breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { DIRECTORY, directoryFee, PRACTICE_AREAS } from "@/lib/directory";
import { listedLawyers, type Listing } from "@/lib/directory-listings";

const DESCRIPTION =
  "Find a license-checked immigration lawyer or accredited representative by state and kind of case, free legal help, and how to check someone before you pay.";

export const metadata = pageMetadata({
  title: "How to Find an Immigration Lawyer You Can Trust",
  description: DESCRIPTION,
  path: "/lawyers",
});

/** Official places to find help, besides our own directory. */
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

/** The listed lawyers as schema.org LegalService entries: only what the page shows. */
function listingsSchema(listings: Listing[]) {
  return {
    "@type": "ItemList",
    name: "Immigration lawyers listed on TrackMyUSCIS",
    url: abs("/lawyers"),
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LegalService",
        "@id": `${abs(`/lawyers/${l.slug}`)}#practice`,
        url: abs(`/lawyers/${l.slug}`),
        name: l.firmName,
        description: l.bio,
        telephone: l.phone,
        address: { "@type": "PostalAddress", addressLocality: l.officeCity, addressRegion: l.officeState, addressCountry: "US" },
        knowsLanguage: l.languages.split(/\s*,\s*/).filter(Boolean),
        knowsAbout: l.practiceAreas.map((v) => PRACTICE_AREAS.find((p) => p.value === v)?.label).filter(Boolean),
        employee: { "@type": "Person", name: l.fullName, jobTitle: l.role === "attorney" ? "Immigration attorney" : "DOJ-accredited representative" },
      },
    })),
  };
}

export default async function LawyersPage() {
  const listings = await listedLawyers();
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "Find an immigration lawyer", description: DESCRIPTION, path: "/lawyers" }),
          breadcrumbSchema([{ name: "Find a lawyer", path: "/lawyers" }]),
          ...(listings.length > 0 ? [listingsSchema(listings)] : []),
        ]}
      />
      <PageIntro
        title="Find an immigration lawyer"
        description="Search license-checked immigration lawyers, find free help, and check anyone before you pay them."
        width={readContainer}
      />
      <section className={section}>
        <div className={readContainer}>
          <h2 id="directory" className="jump-target scroll-mt-28 text-h3 font-semibold text-midnight">
            Immigration lawyers on TrackMyUSCIS
          </h2>
          <p className="mt-3 text-body text-slate">
            <RichText
              text={`We check every listing before it appears: attorneys with their state bar, accredited representatives on the [Department of Justice roster](${DOJ_ROSTER}). Lawyers ${DIRECTORY.freeAtLaunch ? `will pay a flat ${directoryFee} to be listed once the directory's launch period ends` : `pay a flat ${directoryFee} to be listed`}, and paying never changes the order. See [how listings work](/advertising).`}
            />
          </p>
          <div className={`mt-6 ${panel}`}>
            <Suspense fallback={<LawyerDirectory listings={listings} />}>
              <LawyerDirectoryWithSearch listings={listings} />
            </Suspense>
          </div>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">Other places to find help</h2>
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
