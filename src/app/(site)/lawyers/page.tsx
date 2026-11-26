import { Suspense } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LawyerDirectory, LawyerDirectoryWithSearch } from "@/components/LawyerSearch";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { DOJ_ROSTER, EOIR_PRO_BONO, USCIS_FIND_LEGAL } from "@/lib/content";
import { PHOTOS } from "@/lib/photos";
import { btnPrimary, container, h2, section, textLink } from "@/lib/ui";
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

/** Three promises the directory keeps, under the page title. */
const PROMISES = [
  { title: "Licenses checked", body: "With the state bar or the DOJ roster, before anyone is listed." },
  { title: "Reviews checked", body: "From signed-in members. Negative reviews are published too." },
  { title: "One order for all", body: "Paying never moves a lawyer up. Results follow your search." },
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

      <section className="border-b border-border bg-white">
        <div className={`${container} grid items-center gap-10 pt-10 pb-12 sm:pt-12 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
          <div className="enter">
            <h1 className="max-w-xl text-display text-midnight">Find an immigration lawyer</h1>
            <p className="mt-4 max-w-xl text-lead text-slate">Where to find real legal help today, and how to check someone before you pay them.</p>
            <a href="#directory" className={`mt-8 ${btnPrimary}`}>
              Search the directory
              <ArrowDown aria-hidden className="size-4" />
            </a>
            <dl className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-3 sm:gap-8">
              {PROMISES.map((p) => (
                <div key={p.title}>
                  <dt className="text-small font-semibold text-midnight">{p.title}</dt>
                  <dd className="mt-1 text-small text-slate">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Photo
            photo={PHOTOS.lawyersConsultation}
            preload
            sizes="(min-width: 1280px) 584px, (min-width: 1024px) 45vw, 100vw"
            className="enter enter-delay hidden aspect-[5/4] rounded-2xl lg:block"
          />
        </div>
      </section>

      <section className={section} aria-labelledby="directory">
        <div className={container}>
          <h2 id="directory" className={`jump-target scroll-mt-28 ${h2}`}>
            Our lawyer directory
          </h2>
          <p className="mt-3 max-w-3xl text-body text-slate">
            <RichText
              text={`Every attorney's state bar license is checked before they appear, and accredited representatives are checked on the [Department of Justice roster](${DOJ_ROSTER}). Lawyers ${DIRECTORY.freeAtLaunch ? `are listed free while the directory launches, then pay a flat ${directoryFee}` : `pay a flat ${directoryFee} to be listed`}, and paying never changes the order. See [how listings work](/advertising). Are you a lawyer? [Apply to be listed](/lawyers/join).`}
            />
          </p>
          <div className="mt-8">
            <Suspense fallback={<LawyerDirectory listings={listings} />}>
              <LawyerDirectoryWithSearch listings={listings} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`} aria-labelledby="before-you-pay">
        <div className={`${container} grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
          <Photo
            photo={PHOTOS.lawyersDocuments}
            sizes="(min-width: 1280px) 540px, (min-width: 1024px) 42vw, 100vw"
            className="reveal aspect-[4/3] rounded-2xl lg:aspect-[4/5]"
          />
          <div>
            <h2 id="before-you-pay" className={h2}>
              Before you pay anyone
            </h2>
            <p className="mt-3 max-w-xl text-lead text-slate">Four habits that protect your case, whoever you hire.</p>
            <ol className="mt-8 divide-y divide-border border-y border-border">
              {CHECKS.map((c, i) => (
                <li key={c} className="grid grid-cols-[2.5rem_1fr] gap-2 py-5">
                  <span className="text-title text-blue tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-body text-midnight">{c}</span>
                </li>
              ))}
            </ol>
            <Link href="/scams" className={`mt-4 ${textLink}`}>
              How to avoid immigration scams
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className={section} aria-labelledby="where-to-look">
        <div className={container}>
          <h2 id="where-to-look" className={h2}>
            Where to look
          </h2>
          <p className="mt-3 max-w-2xl text-lead text-slate">
            <RichText text={`Besides our directory, three official places to start. USCIS explains them on its [find legal services page](${USCIS_FIND_LEGAL}).`} />
          </p>
          <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {WHERE.map((w) => (
              <li key={w.title} className="border-t-2 border-midnight pt-5">
                <h3 className="text-title text-midnight">{w.title}</h3>
                <p className="mt-2 text-body text-slate">
                  <RichText text={w.body} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${section} bg-white`} aria-labelledby="for-lawyers">
        <div className={container}>
          <div className="reveal grid overflow-hidden rounded-2xl bg-midnight md:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
              <h2 id="for-lawyers" className="text-h2 text-white">
                Are you an immigration lawyer?
              </h2>
              <p className="mt-3 max-w-md text-lead text-ice/80">
                {DIRECTORY.freeAtLaunch
                  ? `Get a license-checked profile in front of people following a USCIS case. Free while the directory launches, then ${directoryFee}.`
                  : `Get a license-checked profile in front of people following a USCIS case, for a flat ${directoryFee}.`}
              </p>
              <Link
                href="/lawyers/join"
                className={`mt-8 ${btnPrimary} self-start hover:bg-white hover:text-midnight focus-visible:outline-white`}
              >
                List your practice
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <Photo photo={PHOTOS.lawyersOffice} sizes="(min-width: 1280px) 608px, (min-width: 768px) 50vw, 100vw" className="aspect-[16/10] md:aspect-auto md:min-h-80" />
          </div>
        </div>
      </section>
    </>
  );
}
