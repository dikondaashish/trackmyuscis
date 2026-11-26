import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Award, Check, ChevronRight, Languages, MapPin, MessageSquareText, Phone, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import {
  ListingCard,
  ModeIcon,
  RatingLine,
  Stars,
  allLanguages,
  areaLabel,
  consultationAmount,
  consultationPrice,
  modeLabel,
  stateName,
  telHref,
} from "@/components/lawyers/LawyerBits";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { COMPANY } from "@/lib/company";
import { DIRECTORY } from "@/lib/directory";
import { initials } from "@/lib/lawyer-photo";
import { getListing, lawyerReviews, listedLawyers, type Listing, type Review } from "@/lib/directory-listings";
import { abs, breadcrumbSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { btnPrimary, btnSecondary, card, container, focusRing, panel, rowPad, rows, textLink } from "@/lib/ui";
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

/** "Licensed by the Texas bar since 2012. We checked it on November 24, 2026." */
function licenseSentence(l: Listing) {
  const since = l.licensedSince ? ` since ${l.licensedSince}` : "";
  const by = l.role === "attorney" ? `Licensed by the ${stateName(l.barState)} bar${since}.` : `Accredited by the Department of Justice${since}.`;
  return `${by} ${l.licenseCheckedOn ? `We checked it on ${longDate(l.licenseCheckedOn)}.` : "We checked it before listing."}`;
}

const sectionTitle = "text-h3 text-midnight";

/** One labelled fact in the Background panel: label on the left from 640px, text on the right. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={`grid gap-1.5 ${rowPad} py-5 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-8 sm:py-6`}>
      <dt className="text-small font-semibold text-slate">{label}</dt>
      <dd className="text-body text-midnight">{children}</dd>
    </div>
  );
}

/** The profile's headshot: a rounded square, like a firm's own bio page; initials when there is no photo. */
function LawyerHeadshot({ l }: { l: Listing }) {
  return (
    <span className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ice text-h2 font-semibold text-blue ring-1 ring-border sm:size-36">
      {l.photoUrl ? (
        <Image src={l.photoUrl} alt={`Photo of ${l.fullName}`} fill priority sizes="144px" className="object-cover" />
      ) : (
        <span aria-hidden>{initials(l.fullName)}</span>
      )}
    </span>
  );
}
const inlineLink = `inline-flex min-h-11 items-center gap-1.5 rounded text-small font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`;

/** The average, the stars and how the ratings spread from 5 to 1. */
function RatingSummary({ rating, reviews }: { rating: NonNullable<Listing["rating"]>; reviews: Review[] }) {
  const total = reviews.length || 1;
  return (
    <div className={`${panel} grid gap-6 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-10`}>
      <div>
        <p className="text-display text-midnight tabular-nums">{rating.average.toFixed(1)}</p>
        <div className="mt-1">
          <Stars value={Math.round(rating.average)} size="size-5" />
        </div>
        <p className="mt-1 text-small text-slate">
          {rating.count} {rating.count === 1 ? "review" : "reviews"}
        </p>
      </div>
      <ul className="grid gap-2" aria-label="How people rated">
        {[5, 4, 3, 2, 1].map((n) => {
          const count = reviews.filter((r) => r.rating === n).length;
          return (
            <li key={n} className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-3 text-small text-slate">
              <span>
                {n} {n === 1 ? "star" : "stars"}
              </span>
              <span aria-hidden className="h-2 overflow-hidden rounded-full bg-border">
                <span className="grow-x block h-full origin-left rounded-full bg-blue" style={{ width: `${(count / total) * 100}%` }} />
              </span>
              <span className="text-right tabular-nums">
                {count}
                <span className="sr-only"> {count === 1 ? "review" : "reviews"}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * One lawyer, laid out like a professional profile: a header with who they are, a contact
 * card that stays in view on desktop (and comes first on phones), then their practice,
 * background and reviews.
 */
export default async function LawyerProfilePage({ params }: PageProps<"/lawyers/[slug]">) {
  const { slug } = await params;
  const l = await getListing(slug);
  if (!l) notFound();
  const reviews = await lawyerReviews(slug);
  const path = `/lawyers/${l.slug}`;
  const amount = consultationAmount(l);
  const areas = l.practiceAreas.map(areaLabel).filter(Boolean) as string[];
  const langs = allLanguages(l.languages);
  const state = stateName(l.officeState);
  const stateSearch = `/lawyers?location=${encodeURIComponent(state)}#directory`;
  const what = l.role === "attorney" ? "Immigration attorney" : "DOJ-accredited representative";
  const nearby = (await listedLawyers()).filter((x) => x.slug !== l.slug && x.officeState === l.officeState).slice(0, 4);
  const shareTitle = `${l.fullName}, ${what.toLowerCase()} in ${l.officeCity}, ${l.officeState}`;

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
        <div className={`${container} enter pt-6 pb-10 sm:pt-8 sm:pb-12`}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-1 text-small text-slate">
              <li>
                <Link href="/lawyers" className={`inline-flex min-h-11 items-center rounded px-1 font-medium transition-colors duration-200 hover:text-midnight ${focusRing}`}>
                  Find a lawyer
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                <Link href={stateSearch} className={`inline-flex min-h-11 items-center rounded px-1 font-medium transition-colors duration-200 hover:text-midnight ${focusRing}`}>
                  {state}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="min-w-0 truncate px-1 font-medium text-midnight">
                {l.fullName}
              </li>
            </ol>
          </nav>

          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <LawyerHeadshot l={l} />
            <div className="min-w-0">
              <h1 className="text-h1 text-midnight">{l.fullName}</h1>
              <p className="mt-1 text-lead text-slate">
                {what} at <span className="font-semibold text-midnight">{l.firmName}</span>
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small text-midnight">
                <li className="flex items-center gap-1.5 font-semibold text-teal">
                  <ShieldCheck aria-hidden className="size-4" strokeWidth={2.25} />
                  {l.role === "attorney" ? "License checked" : "Accreditation checked"}
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin aria-hidden className="size-4 text-slate" />
                  {l.officeCity}, {l.officeState}
                </li>
                {l.licensedSince && (
                  <li className="flex items-center gap-1.5">
                    <Award aria-hidden className="size-4 text-slate" />
                    {l.role === "attorney" ? "Licensed" : "Accredited"} since {l.licensedSince}
                  </li>
                )}
                {langs.length > 0 && (
                  <li className="flex items-center gap-1.5">
                    <Languages aria-hidden className="size-4 text-slate" />
                    {langs.join(", ")}
                  </li>
                )}
              </ul>
              {l.rating && (
                <a href="#reviews" className={`mt-2 inline-flex min-h-11 items-center rounded ${focusRing}`}>
                  <RatingLine rating={l.rating} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={`${container} py-10 sm:py-14`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-12">
          {/* First in the HTML so phones see how to get in touch right after the name. */}
          <aside aria-label={`Contact ${l.fullName}`} className="lg:col-start-2 lg:row-start-1">
            <div className="flex flex-col gap-4 lg:sticky lg:top-28">
              <div className={`${card} overflow-hidden`}>
                <div className="p-5 sm:p-6">
                  <p className="text-small text-slate">First consultation</p>
                  <p className={`mt-1 ${amount ? "text-h2" : "text-title"} text-midnight tabular-nums`}>{amount ?? "Ask the office"}</p>
                  {l.consultationModes.length > 0 && (
                    <ul className="mt-4 grid gap-2" aria-label="Ways to meet">
                      {l.consultationModes.map((m) => (
                        <li key={m} className="flex items-center gap-2.5 text-small text-midnight">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-ice text-blue">
                            <ModeIcon mode={m} />
                          </span>
                          {modeLabel(m)}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 grid gap-2.5">
                    <a href={telHref(l.phone)} className={`${btnPrimary} w-full tabular-nums`}>
                      <Phone aria-hidden className="size-4" />
                      Call {l.phone}
                    </a>
                    {l.website && (
                      <a href={l.website} target="_blank" rel={WEBSITE_REL} className={`${btnSecondary} w-full`}>
                        Visit website
                        <ArrowUpRight aria-hidden className="size-4" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="border-t border-border p-5 sm:p-6">
                  <p className="flex items-center gap-2 text-small font-semibold text-midnight">
                    <MapPin aria-hidden className="size-4 text-slate" />
                    Office
                  </p>
                  <address className="mt-1 pl-6 text-small text-slate not-italic">
                    {l.officeStreet && (
                      <>
                        {l.officeStreet}
                        <br />
                      </>
                    )}
                    {l.officeCity}, {l.officeState}
                    {l.officeZip ? ` ${l.officeZip}` : ""}
                  </address>
                  <a href={mapsUrl(l)} target="_blank" rel="noopener noreferrer" className={`ml-6 ${inlineLink}`}>
                    Get directions
                    <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(opens Google Maps in a new tab)</span>
                  </a>
                </div>
                <div className="flex gap-3 border-t border-border bg-teal/5 p-5 sm:p-6">
                  <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-teal" />
                  <p className="text-small text-midnight">
                    <span className="font-semibold">{l.role === "attorney" ? "License checked." : "Accreditation checked."}</span> {licenseSentence(l)}
                  </p>
                </div>
              </div>

              <div className={`${card} p-5 sm:p-6`}>
                <p className="text-small font-semibold text-midnight">Share this profile</p>
                <div className="mt-3">
                  <ShareLinks url={abs(path)} title={shareTitle} text={`${shareTitle}, on TrackMyUSCIS`} />
                </div>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-12 lg:col-start-1 lg:row-start-1">
            <section aria-labelledby="about">
              <h2 id="about" className={sectionTitle}>
                About {l.fullName}
              </h2>
              <div className={`mt-5 space-y-4 ${panel} sm:p-8`}>
                {l.bio.split(/\n{2,}/).map((p) => (
                  <p key={p} className="text-body whitespace-pre-line text-midnight">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {areas.length > 0 && (
              <section aria-labelledby="cases">
                <h2 id="cases" className={sectionTitle}>
                  Cases {l.role === "attorney" ? "they take" : "they help with"}
                </h2>
                <ul className={`mt-5 grid gap-x-8 sm:grid-cols-2 ${card} reveal px-5 py-2 sm:px-8 sm:py-3`}>
                  {areas.map((a) => (
                    <li key={a} className="flex items-start gap-3 border-b border-border py-3 text-body text-midnight last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.5} />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="background">
              <h2 id="background" className={sectionTitle}>
                Background
              </h2>
              <dl className={`mt-5 ${rows}`}>
                <Fact label={l.role === "attorney" ? "License" : "Accreditation"}>{licenseSentence(l)}</Fact>
                {l.career.length > 0 && (
                  <Fact label="Experience">
                    <ol>
                      {l.career.map((c, i) => (
                        <li key={c} className="relative pb-4 pl-6 last:pb-0">
                          {i < l.career.length - 1 && <span aria-hidden className="absolute top-3 bottom-0 left-[5px] w-px bg-border" />}
                          <span aria-hidden className={`absolute top-[7px] left-0 size-[11px] rounded-full border-2 ${i === 0 ? "border-blue bg-blue" : "border-border bg-white"}`} />
                          {c}
                        </li>
                      ))}
                    </ol>
                  </Fact>
                )}
                {l.education.length > 0 && (
                  <Fact label="Education">
                    <ul className="space-y-1.5">
                      {l.education.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </Fact>
                )}
                {langs.length > 0 && <Fact label="Languages">{langs.join(", ")}</Fact>}
              </dl>
            </section>

            <section aria-labelledby="reviews">
              <h2 id="reviews" className={`jump-target scroll-mt-28 ${sectionTitle}`}>
                Reviews
              </h2>
              <div className="mt-5">
                {l.rating ? (
                  <RatingSummary rating={l.rating} reviews={reviews} />
                ) : (
                  <div className={`${panel} flex items-start gap-4`}>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ice text-blue">
                      <MessageSquareText aria-hidden className="size-5" />
                    </span>
                    <div>
                      <p className="text-title text-midnight">No reviews yet</p>
                      <p className="mt-1 text-body text-slate">Worked with {l.fullName}? Your review helps the next person decide.</p>
                    </div>
                  </div>
                )}
              </div>
              {reviews.length > 0 && (
                <ul className={`mt-4 ${rows}`}>
                  {reviews.map((r) => (
                    <li key={`${r.reviewerName}|${r.date}|${r.body.slice(0, 20)}`} className={`${rowPad} py-5 sm:px-8 sm:py-6`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Stars value={r.rating} />
                        <time dateTime={r.date} className="text-small text-slate">
                          {longDate(r.date)}
                        </time>
                      </div>
                      <p className="mt-3 text-body whitespace-pre-line text-midnight">{r.body}</p>
                      <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-small">
                        <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-ice text-caption font-semibold text-blue">
                          {initials(r.reviewerName)}
                        </span>
                        <span className="font-semibold text-midnight">{r.reviewerName}</span>
                        <span className="text-slate">· {r.relationship === "client" ? "Hired this lawyer" : "Had a consultation"}</span>
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
            </section>

            <p className="border-t border-border pt-6 text-small text-slate">
              This profile was written by {l.fullName} and may be attorney advertising. Being listed is not a recommendation by TrackMyUSCIS:
              ask about fees in writing and check the license yourself. To report this profile, email{" "}
              <a href={`mailto:${COMPANY.email.support}`} className={`rounded font-medium text-blue underline-offset-2 hover:underline ${focusRing}`}>
                {COMPANY.email.support}
              </a>
              .
            </p>
          </div>
        </div>

        {nearby.length > 0 && (
          <section aria-labelledby="nearby" className="mt-16 border-t border-border pt-12">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <h2 id="nearby" className="text-h2 text-midnight">
                More lawyers in {state}
              </h2>
              <Link href={stateSearch} className={`text-small ${textLink}`}>
                See all in {state}
              </Link>
            </div>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {nearby.map((x) => (
                <li key={x.slug}>
                  <ListingCard l={x} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
