"use client";

import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowUpRight, MapPin, Search } from "lucide-react";
import { LawyerPhoto, LawyerTags, RatingLine } from "@/components/lawyers/LawyerBits";
import { SelectField } from "@/components/ui/SelectField";
import { COMPANY } from "@/lib/company";
import { EOIR_PRO_BONO } from "@/lib/content";
import { PRACTICE_AREAS, US_STATES } from "@/lib/directory";
import type { Listing } from "@/lib/directory-listings";
import { btnPrimary, cardLink, field, fieldLabel, focusRing, rowArrow, textLink } from "@/lib/ui";

const KIND_OPTIONS = [{ value: "", label: "Any case type" }, ...PRACTICE_AREAS.map((p) => ({ value: p.value, label: p.label }))];
const kindLabel = (value: string) => PRACTICE_AREAS.find((p) => p.value === value)?.label;
const stateName = (code: string | null) => US_STATES.find(([c]) => c === code)?.[1] ?? code ?? "";

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/** "Houston, TX", "texas" or "new york": every word must start a word of the office's city or state. */
function inPlace(l: Listing, place: string) {
  const wanted = words(place);
  if (wanted.length === 0) return true;
  const have = words(`${l.officeCity} ${l.officeState} ${stateName(l.officeState)}`);
  return wanted.every((w) => have.some((h) => h.startsWith(w)));
}

/** Location + kind of case. Submits to /lawyers, so a search can be shared as a link. */
export function LawyerSearch({ location = "", kind = "" }: { location?: string; kind?: string }) {
  return (
    <Form action="/lawyers" key={`${location}|${kind}`}>
      <div className="@container">
        <div className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-[1.2fr_1fr_auto] @3xl:items-end">
          <div className="min-w-0">
            <label htmlFor="lw-location" className={fieldLabel}>
              State or city
            </label>
            <input
              id="lw-location"
              name="location"
              defaultValue={location}
              placeholder="e.g. Houston, TX"
              autoComplete="address-level2"
              className={`mt-2 ${field}`}
            />
          </div>
          <SelectField id="lw-case" name="case" label="Case type" options={KIND_OPTIONS} defaultValue={kind} />
          <button type="submit" className={`${btnPrimary} @md:col-span-2 @md:justify-self-start @3xl:col-span-1`}>
            <Search aria-hidden className="size-4" />
            Find lawyers
          </button>
        </div>
      </div>
    </Form>
  );
}

/** One lawyer in the list: the whole card opens their profile, where the contact details are. */
function ListingCard({ l }: { l: Listing }) {
  return (
    <li>
      <Link href={`/lawyers/${l.slug}`} className={`group flex gap-4 p-5 sm:p-6 ${cardLink}`}>
        <LawyerPhoto l={l} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block text-title text-midnight transition-colors duration-200 group-hover:text-blue">{l.fullName}</span>
              <span className="block text-small text-slate">{l.firmName}</span>
            </span>
            <ArrowRight aria-hidden className={`mt-1.5 ${rowArrow}`} />
          </span>
          {l.rating && (
            <span className="mt-2 block">
              <RatingLine rating={l.rating} />
            </span>
          )}
          <span className="mt-2 flex items-start gap-1.5 text-small text-midnight">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-slate" />
            {l.officeCity}, {l.officeState} · {l.role === "attorney" ? "Attorney" : "Accredited representative"}
          </span>
          <span className="mt-3 block">
            <LawyerTags l={l} max={4} />
          </span>
        </span>
      </Link>
    </li>
  );
}

function FreeHelp() {
  return (
    <a href={EOIR_PRO_BONO} target="_blank" rel="noopener noreferrer" className={`mt-5 ${btnPrimary}`}>
      See free legal help
      <ArrowUpRight aria-hidden className="size-4" />
      <span className="sr-only">(opens justice.gov in a new tab)</span>
    </a>
  );
}

/** The search and its results. Without a search, every listing shows (this is also the prerendered HTML). */
export function LawyerDirectory({ listings, location = "", kind = "" }: { listings: Listing[]; location?: string; kind?: string }) {
  if (listings.length === 0) {
    return (
      <>
        <LawyerSearch location={location} kind={kindLabel(kind) ? kind : ""} />
        <div aria-live="polite" className="mt-6 rounded-xl bg-ice p-6">
          <p className="text-title font-semibold text-midnight">No listings yet{location.trim() ? ` for ${location.trim()}` : ""}</p>
          <p className="mt-2 max-w-xl text-body text-slate">
            The directory is new and we&apos;re checking the first lawyers now. If you need free or low-cost help today, the Department
            of Justice keeps a list of approved legal service providers.
          </p>
          <FreeHelp />
        </div>
      </>
    );
  }

  const knownKind = kindLabel(kind) ? kind : "";
  const searched = location.trim() !== "" || knownKind !== "";
  const forKind = knownKind ? listings.filter((l) => l.practiceAreas.includes(knownKind)) : listings;
  const near = forKind.filter((l) => inPlace(l, location));
  const elsewhere = location.trim() ? forKind.filter((l) => !inPlace(l, location)) : [];
  const what = [location.trim() && `in ${location.trim()}`, knownKind && `for ${kindLabel(knownKind)!.toLowerCase()}`].filter(Boolean).join(" ");
  const count = (n: number) => `${n} ${n === 1 ? "lawyer" : "lawyers"}`;

  return (
    <>
      <LawyerSearch location={location} kind={knownKind} />
      <div aria-live="polite" key={`${location}|${knownKind}`} className="swap mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-body font-semibold text-midnight">
            {searched ? `${count(near.length)} ${what}` : `${count(listings.length)} listed`}
          </p>
          {searched && (
            <Link href="/lawyers#directory" className={`text-small ${textLink}`}>
              Show all lawyers
            </Link>
          )}
        </div>

        {near.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-3">
            {near.map((l) => (
              <ListingCard key={l.slug} l={l} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-xl bg-ice p-6">
            <p className="text-body text-midnight">
              {elsewhere.length > 0
                ? `No listed lawyer has an office ${location.trim() ? `in ${location.trim()}` : "there"} yet.`
                : `No listed lawyer ${knownKind ? `takes ${kindLabel(knownKind)!.toLowerCase()} cases` : "matches"} yet.`}
            </p>
            {elsewhere.length === 0 && <FreeHelp />}
          </div>
        )}

        {elsewhere.length > 0 && (
          <div className="mt-10">
            <h3 className="text-title text-midnight">Lawyers in other places</h3>
            <p className="mt-1 text-small text-slate">
              Immigration law is federal, so a lawyer licensed in any U.S. state can take your case wherever you live.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {elsewhere.map((l) => (
                <ListingCard key={l.slug} l={l} />
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-small text-slate">
          Profiles are written by the lawyers and may be attorney advertising. Being listed is not a recommendation: ask about fees in
          writing and check the license yourself. To report a profile, email{" "}
          <a href={`mailto:${COMPANY.email.support}`} className={`rounded font-medium text-blue underline-offset-2 hover:underline ${focusRing}`}>
            {COMPANY.email.support}
          </a>
          .
        </p>
      </div>
    </>
  );
}

/** The directory, reading the search from the URL. Wrap in <Suspense> with <LawyerDirectory listings={…} /> as the fallback. */
export function LawyerDirectoryWithSearch({ listings }: { listings: Listing[] }) {
  const params = useSearchParams();
  return <LawyerDirectory listings={listings} location={params.get("location") ?? ""} kind={params.get("case") ?? ""} />;
}
