import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Phone } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LawyerPhoto, LawyerTags, RatingLine, Stars, areaLabel, consultationPrice, roleLine, stateName } from "@/components/lawyers/LawyerBits";
import { LinkRows } from "@/components/ui/LinkRows";
import { COMPANY } from "@/lib/company";
import { CONSULTATION_MODES, DIRECTORY } from "@/lib/directory";
import { getListing, lawyerReviews, listedLawyers, type Listing, type Review } from "@/lib/directory-listings";
import { abs, breadcrumbSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { btnPrimary, btnSecondary, focusRing, panel, readContainer, rowPad, rows, section } from "@/lib/ui";
import { ReviewForm } from "./ReviewForm";

/** Every listed lawyer's page is prerendered; anything else is a real 404. */
export const instant = false;

/** With Cache Components a dynamic route needs at least one param; before anyone is listed, a placeholder that 404s. */
const NONE = "no-lawyers-listed-yet";

export async function generateStaticParams() {
  const listings = await listedLawyers();
  return listings.length > 0 ? listings.map((l) => ({ slug: l.slug })) : [{ slug: NONE }];
}

/** Paid listings are marked "sponsored" for search engines; while listings are free, "nofollow" is enough. */
const WEBSITE_REL = DIRECTORY.freeAtLaunch ? "nofollow noopener noreferrer" : "sponsored nofollow noopener noreferrer";

const title = (l: Listing) => {
  const what = l.role === "attorney" ? "Immigration Lawyer" : "Accredited Representative";
  const options = [`${l.fullName}, ${what} in ${l.officeCity}, ${l.officeState}`, `${l.fullName}, ${what} in ${l.officeCity}`, `${l.fullName}, ${what}`];
  return options.find((t) => t.length <= 60) ?? l.fullName;
};

/** Built from facts on the profile, longest version that fits in 160 characters. */
function description(l: Listing) {
  const who = `${l.fullName} is ${l.role === "attorney" ? "an immigration attorney" : "a DOJ-accredited representative"} at ${l.firmName} in ${l.officeCity}, ${l.officeState}.`;
  const areas = l.practiceAreas.map(areaLabel).filter(Boolean).slice(0, 2).join(" and ").toLowerCase();
  const price = consultationPrice(l);
  const parts = [who, areas && `Takes ${areas} cases.`, price && `${price}.`, `Speaks ${l.languages}.`].filter(Boolean) as string[];
  let out = parts[0];
  for (const p of parts.slice(1)) if (`${out} ${p}`.length <= 160) out = `${out} ${p}`;
  return out.length <= 160 ? out : `${out.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

export async function generateMetadata({ params }: PageProps<"/lawyers/[slug]">): Promise<Metadata> {
  const l = await getListing((await params).slug);
  if (!l) return {};
  return pageMetadata({ title: title(l), description: description(l), path: `/lawyers/${l.slug}` });
}

const address = (l: Listing) => [l.officeStreet, `${l.officeCity}, ${l.officeState}${l.officeZip ? ` ${l.officeZip}` : ""}`].filter(Boolean).join(", ");
const mapsUrl = (l: Listing) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.firmName}, ${address(l)}`)}`;

/** The profile as schema.org data: the practice, the person, and published reviews only. */
function profileSchema(l: Listing, reviews: Review[]) {
  const path = `/lawyers/${l.slug}`;
  return {
    "@type": "LegalService",
    "@id": `${abs(path)}#practice`,
    name: l.firmName,
    url: abs(path),
    description: l.bio,
    telephone: l.phone,
    ...(l.website ? { sameAs: [l.website] } : {}),
    ...(l.photoUrl ? { image: l.photoUrl } : {}),
    address: {
      "@type": "PostalAddress",
      ...(l.officeStreet ? { streetAddress: l.officeStreet } : {}),
      addressLocality: l.officeCity,
      addressRegion: l.officeState,
      ...(l.officeZip ? { postalCode: l.officeZip } : {}),
      addressCountry: "US",
    },
    knowsLanguage: l.languages.split(/\s*,\s*/).filter(Boolean),
    knowsAbout: l.practiceAreas.map(areaLabel).filter(Boolean),
    employee: {
      "@type": "Person",
      name: l.fullName,
      jobTitle: l.role === "attorney" ? "Immigration attorney" : "DOJ-accredited representative",
      ...(l.photoUrl ? { image: l.photoUrl } : {}),
    },
    ...(l.rating
      ? {
          aggregateRating: { "@type": "AggregateRating", ratingValue: l.rating.average, reviewCount: l.rating.count, bestRating: 5, worstRating: 1 },
          review: reviews.slice(0, 20).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.reviewerName },
            datePublished: r.date,
            reviewBody: r.body,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
          })),
        }
      : {}),
  };
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={`grid gap-1 ${rowPad} py-4 sm:grid-cols-[11rem_1fr] sm:gap-6`}>
      <dt className="text-small font-semibold text-midnight">{label}</dt>
      <dd className="text-body text-slate">{children}</dd>
    </div>
  );
}

/**
 * One lawyer: who they are, how to reach them, what a first consultation costs, their
 * background and what people who worked with them say. Contact first, details after.
 */
export default async function LawyerProfilePage({ params }: PageProps<"/lawyers/[slug]">) {
  const { slug } = await params;
  const l = await getListing(slug);
  if (!l) notFound();
  const reviews = await lawyerReviews(slug);
  const path = `/lawyers/${l.slug}`;
  const price = consultationPrice(l);
  const modes = l.consultationModes.map((m) => CONSULTATION_MODES.find((c) => c.value === m)?.label).filter(Boolean);
  const areas = l.practiceAreas.map(areaLabel).filter(Boolean);
  const nearby = (await listedLawyers()).filter((x) => x.slug !== l.slug && x.officeState === l.officeState).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: `${l.fullName}, ${l.firmName}`, description: description(l), path, type: "ProfilePage", dateModified: l.updated }),
          profileSchema(l, reviews),
          breadcrumbSchema([
            { name: "Find a lawyer", path: "/lawyers" },
            { name: l.fullName, path },
          ]),
        ]}
      />

      <section className="border-b border-border bg-white">
        <div className={`${readContainer} enter pt-8 pb-10 sm:pt-10 sm:pb-12`}>
          <Link
            href="/lawyers#directory"
            className={`-ml-1 mb-6 inline-flex min-h-11 items-center gap-1.5 rounded px-1 text-small font-medium text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}
          >
            <ArrowLeft aria-hidden className="size-4" />
            All lawyers
          </Link>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <LawyerPhoto l={l} size="lg" />
            <div className="min-w-0">
              <h1 className="text-h1 text-midnight">{l.fullName}</h1>
              <p className="mt-1 text-lead text-slate">{l.firmName}</p>
              <p className="mt-2 text-small text-slate">
                {roleLine(l)} · {l.officeCity}, {l.officeState}
              </p>
              {l.rating && (
                <a href="#reviews" className={`mt-3 inline-flex min-h-11 items-center rounded ${focusRing}`}>
                  <RatingLine rating={l.rating} />
                </a>
              )}
              <div className="mt-3">
                <LawyerTags l={l} />
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className={`${btnPrimary} tabular-nums`}>
              <Phone aria-hidden className="size-4" />
              Call {l.phone}
            </a>
            {l.website && (
              <a href={l.website} target="_blank" rel={WEBSITE_REL} className={btnSecondary}>
                Website
                <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={readContainer}>
          <h2 className="text-h3 font-semibold text-midnight">About</h2>
          <div className={`mt-5 space-y-4 ${panel} sm:p-8`}>
            {l.bio.split(/\n{2,}/).map((p) => (
              <p key={p} className="text-body whitespace-pre-line text-midnight">
                {p}
              </p>
            ))}
          </div>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">Details</h2>
          <dl className={`mt-5 ${rows}`}>
            <Detail label="Consultations">
              {[modes.length ? modes.join(", ") : null, price].filter(Boolean).join(" · ") || "Contact the office"}
            </Detail>
            <Detail label="Office">
              {address(l)}
              <a href={mapsUrl(l)} target="_blank" rel="noopener noreferrer" className={`ml-2 inline-flex items-center gap-1 rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`}>
                Directions
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
            </Detail>
            {areas.length > 0 && <Detail label="Cases">{areas.join(", ")}</Detail>}
            <Detail label="Languages">{l.languages}</Detail>
            <Detail label={l.role === "attorney" ? "License" : "Accreditation"}>
              {l.role === "attorney"
                ? `Licensed by the ${stateName(l.barState)} bar${l.licensedSince ? ` since ${l.licensedSince}` : ""}.`
                : `Accredited by the Department of Justice${l.licensedSince ? ` since ${l.licensedSince}` : ""}.`}{" "}
              {l.licenseCheckedOn ? `We checked it on ${longDate(l.licenseCheckedOn)}.` : "We checked it before listing."}
            </Detail>
            {l.education.length > 0 && (
              <Detail label="Education">
                <ul className="space-y-1">
                  {l.education.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </Detail>
            )}
            {l.career.length > 0 && (
              <Detail label="Career">
                <ul className="space-y-1">
                  {l.career.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </Detail>
            )}
          </dl>

          <h2 id="reviews" className="jump-target mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">
            Reviews
          </h2>
          {l.rating ? (
            <p className="mt-3">
              <RatingLine rating={l.rating} />
            </p>
          ) : (
            <p className="mt-3 text-body text-slate">No reviews yet.</p>
          )}
          {reviews.length > 0 && (
            <ul className={`mt-5 ${rows}`}>
              {reviews.map((r) => (
                <li key={`${r.reviewerName}|${r.date}|${r.body.slice(0, 20)}`} className={`${rowPad} py-5`}>
                  <Stars value={r.rating} />
                  <p className="mt-2 text-body whitespace-pre-line text-midnight">{r.body}</p>
                  <p className="mt-2 text-small text-slate">
                    {r.reviewerName} · {r.relationship === "client" ? "Hired this lawyer" : "Had a consultation"} · {longDate(r.date)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6">
            <ReviewForm slug={l.slug} lawyerName={l.fullName} />
          </div>
          <p className="mt-4 text-small text-slate">
            Reviews come from signed-in TrackMyUSCIS members. We check each one against our{" "}
            <Link href="/advertising#reviews" className={`rounded font-medium text-blue underline-offset-2 hover:underline ${focusRing}`}>
              review rules
            </Link>{" "}
            and publish negative reviews too. Lawyers can&apos;t pay to change or remove them.
          </p>

          <p className="mt-12 text-small text-slate">
            This profile was written by {l.fullName} and may be attorney advertising. Being listed is not a recommendation by TrackMyUSCIS:
            ask about fees in writing and check the license yourself. To report this profile, email{" "}
            <a href={`mailto:${COMPANY.email.support}`} className={`rounded font-medium text-blue underline-offset-2 hover:underline ${focusRing}`}>
              {COMPANY.email.support}
            </a>
            .
          </p>

          {nearby.length > 0 && (
            <div className="mt-12">
              <h2 className="text-h3 font-semibold text-midnight">More lawyers in {stateName(l.officeState)}</h2>
              <LinkRows
                compact
                className="mt-5"
                items={nearby.map((x) => ({ href: `/lawyers/${x.slug}`, title: x.fullName, note: `${x.firmName} · ${x.officeCity}` }))}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
