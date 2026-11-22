import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { OfficialSources } from "@/components/OfficialSources";
import { RichText } from "@/components/ui/RichText";
import { GuideLinks, GuidePage, guideSectionTitle } from "@/components/app/Guide";
import { getAnswer } from "@/lib/answers";
import { FORM_RELATED, FORMS, FORMS_UPDATED, getForm, getGuide, officialFormUrl, USCIS_FEE_SCHEDULE, USCIS_PROCESSING_TIMES } from "@/lib/content";
import { inAppHref } from "@/lib/in-app";
import { longDate, pageMetadata } from "@/lib/seo";
import { appBtnSecondary, appCard, appPanel } from "@/lib/ui";

/** Every known form is prerendered; unknown ones return a real 404. */
export const instant = false;

export function generateStaticParams() {
  return FORMS.map((f) => ({ slug: f.slug }));
}

// The public /forms/<slug> page is the indexed one.
export async function generateMetadata({ params }: PageProps<"/dashboard/forms/[slug]">): Promise<Metadata> {
  const f = getForm((await params).slug);
  return f ? pageMetadata({ title: `Form ${f.form}`, description: f.about, path: `/forms/${f.slug}`, noindex: true }) : {};
}

/** Title of a related answer or guide from its path. */
function relatedTitle(path: string) {
  const slug = path.split("/").pop() ?? "";
  return path.startsWith("/answers/") ? getAnswer(slug)?.question : getGuide(slug)?.title;
}

const external = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={appBtnSecondary}>
    {label}
    <ArrowUpRight aria-hidden className="size-3.5" />
    <span className="sr-only">(opens uscis.gov in a new tab)</span>
  </a>
);

export default async function DashboardFormPage({ params }: PageProps<"/dashboard/forms/[slug]">) {
  const f = getForm((await params).slug);
  if (!f) notFound();
  const related = (FORM_RELATED[f.slug] ?? []).flatMap((path) => {
    const title = relatedTitle(path);
    return title ? [{ href: inAppHref(path), title }] : [];
  });

  return (
    <GuidePage
      title={`Form ${f.form}: ${f.label}`}
      description={
        <>
          {f.about}
          <span className="mt-1 block text-caption">
            Official name: {f.title} · Updated {longDate(FORMS_UPDATED)} · Checked against uscis.gov
          </span>
        </>
      }
      back={{ href: "/dashboard/forms", label: "All forms" }}
    >
      <div className="flex flex-wrap gap-2">
        {external(officialFormUrl(f), `${f.form} on uscis.gov`)}
        {external(USCIS_PROCESSING_TIMES, "Official processing times")}
      </div>

      <h2 className={`mt-8 ${guideSectionTitle}`}>What to know about Form {f.form}</h2>
      <div className={`mt-2.5 ${appCard} divide-y divide-border overflow-hidden`}>
        {f.sections.map((s) => (
          <div key={s.heading} className="px-4 py-3.5">
            <h3 className="text-small font-semibold text-midnight">{s.heading}</h3>
            <p className="mt-1 text-small text-slate">
              <RichText text={s.body} inApp />
            </p>
          </div>
        ))}
        <div className="px-4 py-3.5">
          <h3 className="text-small font-semibold text-midnight">Filing fee</h3>
          <p className="mt-1 text-small text-slate">
            <RichText
              text={`Fees change, so we don't print them here. USCIS lists the current fee for Form ${f.form} on its [Fee Schedule page](${USCIS_FEE_SCHEDULE}).`}
            />
          </p>
        </div>
      </div>

      <h2 className={`mt-8 ${guideSectionTitle}`}>Steps most cases go through</h2>
      <ol className={`mt-2.5 ${appPanel}`}>
        {f.milestones.map((m, i) => (
          <li key={m} className="relative flex gap-3 pb-3.5 last:pb-0">
            {i < f.milestones.length - 1 && <span aria-hidden className="absolute top-6 bottom-0 left-[11px] w-px bg-border" />}
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-white text-caption font-medium text-slate tabular-nums">
              {i + 1}
            </span>
            <span className="pt-0.5 text-small text-midnight">{m}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-caption text-slate">Every case is different. Your official USCIS notices always come first.</p>

      {related.length > 0 && (
        <section aria-label={`Questions about ${f.form} cases`} className="mt-8">
          <h2 className={guideSectionTitle}>Questions about {f.form} cases</h2>
          <GuideLinks className="mt-2.5" items={related} />
        </section>
      )}

      <OfficialSources
        compact
        className="mt-8"
        sources={[{ label: `USCIS: Form ${f.form}, ${f.title}`, href: officialFormUrl(f) }, ...(f.sources ?? [])]}
      />
    </GuidePage>
  );
}
