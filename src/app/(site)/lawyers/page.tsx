import { Suspense } from "react";
import { ArrowRight, Check, Scale, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { LawyerDirectory, LawyerDirectoryWithSearch } from "@/components/LawyerSearch";
import { PageIntro } from "@/components/ui/PageIntro";
import { RichText } from "@/components/ui/RichText";
import { DOJ_ROSTER, EOIR_PRO_BONO, USCIS_FIND_LEGAL } from "@/lib/content";
import { btnPrimary, container, h2, rowPad, rows, section, textLink } from "@/lib/ui";
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

/** Three promises the directory keeps, shown under its heading. */
const PROMISES = [
  { icon: ShieldCheck, title: "Licenses checked", body: "Every lawyer is checked with their state bar or the DOJ roster before listing." },
  { icon: Star, title: "Reviews checked", body: "Reviews come from signed-in members, and negative ones are published too." },
  { icon: Scale, title: "Same rules for all", body: "Paying never changes the order. Results follow your search." },
];

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
        description="Where to find real legal help today, and how to check someone before you pay them."
        width={container}
      />

      <section className={section} aria-labelledby="directory">
        <div className={container}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-16">
            <div>
              <h2 id="directory" className={`jump-target scroll-mt-28 ${h2}`}>
                Our lawyer directory
              </h2>
              <p className="mt-3 max-w-2xl text-body text-slate">
                <RichText
                  text={`Every attorney's state bar license is checked before they appear, and accredited representatives are checked on the [Department of Justice roster](${DOJ_ROSTER}). Lawyers ${DIRECTORY.freeAtLaunch ? `are listed free while the directory launches, then pay a flat ${directoryFee}` : `pay a flat ${directoryFee} to be listed`}, and paying never changes the order. See [how listings work](/advertising). Are you a lawyer? [Apply to be listed](/lawyers/join).`}
                />
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              {PROMISES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3 sm:flex-col sm:gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ice text-blue">
                    <Icon aria-hidden className="size-4" strokeWidth={2.25} />
                  </span>
                  <span>
                    <span className="block text-small font-semibold text-midnight">{title}</span>
                    <span className="mt-0.5 block text-small text-slate">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <Suspense fallback={<LawyerDirectory listings={listings} />}>
              <LawyerDirectoryWithSearch listings={listings} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`}>
        <div className={`${container} grid gap-14 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <h2 className={h2}>Before you pay anyone</h2>
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
          </div>

          <div>
            <h2 className={h2}>Where to look</h2>
            <ul className={`mt-6 ${rows}`}>
              {WHERE.map((w) => (
                <li key={w.title} className={`${rowPad} py-5`}>
                  <h3 className="text-title text-midnight">{w.title}</h3>
                  <p className="mt-1 text-body text-slate">
                    <RichText text={w.body} />
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-body text-slate">
              <RichText text={`USCIS explains the options on its [find legal services page](${USCIS_FIND_LEGAL}).`} />
            </p>
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={container}>
          <div className="reveal flex flex-col gap-6 rounded-2xl bg-midnight px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-14 lg:py-12">
          <div className="max-w-2xl">
            <h2 className="text-h2 text-white">Are you an immigration lawyer?</h2>
            <p className="mt-3 text-lead text-ice/80">
              {DIRECTORY.freeAtLaunch
                ? `Get a license-checked profile in front of people following a USCIS case. Free while the directory launches, then ${directoryFee}.`
                : `Get a license-checked profile in front of people following a USCIS case, for a flat ${directoryFee}.`}
            </p>
          </div>
          <Link href="/lawyers/join" className={`${btnPrimary} shrink-0 self-start hover:bg-white hover:text-midnight focus-visible:outline-white md:self-auto`}>
            List your practice
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          </div>
        </div>
      </section>
    </>
  );
}
