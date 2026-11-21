"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Search } from "lucide-react";
import { SelectField } from "@/components/ui/SelectField";
import { EOIR_PRO_BONO, FORMS } from "@/lib/content";
import { btnPrimary, field, fieldLabel } from "@/lib/ui";

const CASE_OPTIONS = [
  { value: "", label: "Any case type" },
  ...FORMS.map((f) => ({ value: f.slug, label: `${f.form} · ${f.label}` })),
];

/** Location + case type search. Submits to /lawyers. */
export function LawyerSearch({ location = "", caseType = "" }: { location?: string; caseType?: string }) {
  return (
    <Form action="/lawyers" key={`${location}|${caseType}`}>
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
        <SelectField id="lw-case" name="case" label="Case type" options={CASE_OPTIONS} defaultValue={caseType} />
        <button type="submit" className={`${btnPrimary} @md:col-span-2 @md:justify-self-start @3xl:col-span-1`}>
          <Search aria-hidden className="size-4" />
          Find lawyers
        </button>
      </div>
      </div>
    </Form>
  );
}

/** The search plus its answer, reading the query from the URL. Wrap in <Suspense>. */
export function LawyerSearchWithResult() {
  const params = useSearchParams();
  const location = params.get("location") ?? "";
  const caseType = params.get("case") ?? "";
  const submitted = params.has("location") || params.has("case");

  return (
    <>
      <LawyerSearch location={location} caseType={caseType} />
      <div aria-live="polite">
        {submitted && (
          <div className="mt-6 rounded-2xl bg-ice p-6">
            <p className="text-title font-semibold text-midnight">
              No listings yet{location ? ` for ${location}` : ""}
            </p>
            <p className="mt-2 max-w-xl text-body text-slate">
              Our directory opens soon. If you need free or low-cost help now, the Department of Justice
              keeps a list of approved legal service providers.
            </p>
            <a href={EOIR_PRO_BONO} target="_blank" rel="noopener noreferrer" className={`mt-5 ${btnPrimary}`}>
              See free legal help
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(opens justice.gov in a new tab)</span>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
