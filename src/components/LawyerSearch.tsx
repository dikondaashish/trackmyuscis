"use client";

import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, SearchX } from "lucide-react";
import { ListingCard } from "@/components/lawyers/LawyerBits";
import { SelectField } from "@/components/ui/SelectField";
import { COMPANY } from "@/lib/company";
import { EOIR_PRO_BONO } from "@/lib/content";
import { PRACTICE_AREAS, US_STATES } from "@/lib/directory";
import type { Listing } from "@/lib/directory-listings";
import { btnPrimary, field, fieldLabel, focusRing, textLink } from "@/lib/ui";

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

function FreeHelp() {
  return (
    <a href={EOIR_PRO_BONO} target="_blank" rel="noopener noreferrer" className={`mt-5 ${btnPrimary}`}>
      See free legal help
      <ArrowUpRight aria-hidden className="size-4" />
      <span className="sr-only">(opens justice.gov in a new tab)</span>
    </a>
  );
}

/** Nothing to show: a calm note with the official free-help list. */
function EmptyNote({ title, children, help = true }: { title: string; children?: React.ReactNode; help?: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-white p-6 sm:p-8">
      <span className="flex size-11 items-center justify-center rounded-xl bg-ice text-blue">
        <SearchX aria-hidden className="size-5" />
      </span>
      <p className="mt-4 text-title text-midnight">{title}</p>
      {children && <p className="mt-2 max-w-xl text-body text-slate">{children}</p>}
      {help && <FreeHelp />}
    </div>
  );
}

function Grid({ listings }: { listings: Listing[] }) {
  return (
    <ul className="mt-5 grid gap-4 md:grid-cols-2">
      {listings.map((l) => (
        <li key={l.slug}>
          <ListingCard l={l} />
        </li>
      ))}
    </ul>
  );
}

/** The search and its results. Without a search, every listing shows (this is also the prerendered HTML). */
export function LawyerDirectory({ listings, location = "", kind = "" }: { listings: Listing[]; location?: string; kind?: string }) {
  const search = (
    <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
      <LawyerSearch location={location} kind={kindLabel(kind) ? kind : ""} />
    </div>
  );

  if (listings.length === 0) {
    return (
      <>
        {search}
        <div aria-live="polite" className="mt-6">
          <EmptyNote title={`No listings yet${location.trim() ? ` for ${location.trim()}` : ""}`}>
            The directory is new and we&apos;re checking the first lawyers now. If you need free or low-cost help today, the Department
            of Justice keeps a list of approved legal service providers.
          </EmptyNote>
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
      {search}
      <div aria-live="polite" key={`${location}|${knownKind}`} className="swap mt-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
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
          <Grid listings={near} />
        ) : (
          <div className="mt-5">
            <EmptyNote
              help={elsewhere.length === 0}
              title={
                elsewhere.length > 0
                  ? `No listed lawyer has an office ${location.trim() ? `in ${location.trim()}` : "there"} yet`
                  : `No listed lawyer ${knownKind ? `takes ${kindLabel(knownKind)!.toLowerCase()} cases` : "matches"} yet`
              }
            />
          </div>
        )}

        {elsewhere.length > 0 && (
          <div className="mt-12">
            <h3 className="text-h3 text-midnight">Lawyers in other places</h3>
            <p className="mt-2 max-w-2xl text-body text-slate">
              Immigration law is federal, so a lawyer licensed in any U.S. state can take your case wherever you live.
            </p>
            <Grid listings={elsewhere} />
          </div>
        )}

        <p className="mt-8 max-w-3xl text-small text-slate">
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
