import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { OfficialSources } from "@/components/OfficialSources";
import { RichText } from "@/components/ui/RichText";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowRight } from "lucide-react";
import { getAnswer } from "@/lib/answers";
import { FORM_RELATED, FORMS, FORMS_UPDATED, getForm, getGuide, officialFormUrl, USCIS_FEE_SCHEDULE, USCIS_PROCESSING_TIMES } from "@/lib/content";
import { btnPrimary, container, focusRing, section } from "@/lib/ui";
import Link from "next/link";

const titleCase = (s: string) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase());

/** Title of an answer or guide page from its path. */
function relatedTitle(path: string) {
  const slug = path.split("/").pop() ?? "";
  return path.startsWith("/answers/") ? getAnswer(slug)?.question : getGuide(slug)?.title;
}

/** Every known page is prerendered; unknown ones return a real 404, so navigation may wait on the server. */
export const instant = false;

export function generateStaticParams() {
  return FORMS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/forms/[slug]">): Promise<Metadata> {
  const f = getForm((await params).slug);
  if (!f) return {};
  const withSteps = `${f.about} The steps most ${f.form} cases go through after filing.`;
  return pageMetadata({
    title: `Form ${f.form} (${titleCase(f.label)}): Steps After Filing`,
    description: withSteps.length <= 160 ? withSteps : f.about,
    path: `/forms/${f.slug}`,
  });
}

export default async function FormPage({ params }: PageProps<"/forms/[slug]">) {
  const f = getForm((await params).slug);
  if (!f) notFound();
  const related = (FORM_RELATED[f.slug] ?? []).flatMap((path) => {
    const title = relatedTitle(path);
    return title ? [{ path, title }] : [];
  });

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: `Form ${f.form}: ${f.title}`, description: f.about, path: `/forms/${f.slug}`, dateModified: FORMS_UPDATED }),
          breadcrumbSchema([
            { name: "Forms", path: "/forms" },
            { name: `Form ${f.form}`, path: `/forms/${f.slug}` },
          ]),
        ]}
      />
      <PageIntro title={`Form ${f.form}: ${f.label}`} description={f.about} back={{ href: "/forms", label: "All forms" }}>
        <p className="text-small text-slate">Official name: {f.title}</p>
        <p className="mt-1 text-small text-slate">Updated {longDate(FORMS_UPDATED)} · Checked against uscis.gov</p>
      </PageIntro>
      <section className={section}>
        <div className={`${container} grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20`}>
          <div>
            <h2 id="know" className="text-h3 font-semibold text-midnight">What to know about Form {f.form}</h2>
            <div className="mt-8 max-w-2xl space-y-8">
              {f.sections.map((s) => (
                <div key={s.heading}>
                  <h3 className="text-title font-semibold text-midnight">{s.heading}</h3>
                  <p className="mt-2 text-body text-slate">
                    <RichText text={s.body} />
                  </p>
                </div>
              ))}
              <div>
                <h3 className="text-title font-semibold text-midnight">Filing fee</h3>
                <p className="mt-2 text-body text-slate">
                  <RichText text={`Fees change, so we don't print them here. USCIS lists the current fee for Form ${f.form} on its [Fee Schedule page](${USCIS_FEE_SCHEDULE}).`} />
                </p>
              </div>
            </div>

            <h2 id="steps" className="mt-20 text-h3 font-semibold text-midnight">Steps most cases go through</h2>
            <ol className="mt-8">
              {f.milestones.map((m, i) => (
                <li key={m} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < f.milestones.length - 1 && (
                    <span aria-hidden className="absolute top-9 bottom-1 left-[17px] w-0.5 bg-border" />
                  )}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue tabular-nums">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-lead text-midnight">{m}</span>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-xl text-small text-slate">
              Every case is different. Your official USCIS notices always come first.
            </p>

            {related.length > 0 && (
              <div className="mt-20">
                <h2 id="questions" className="text-h3 font-semibold text-midnight">Questions about {f.form} cases</h2>
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {related.map((r) => (
                    <li key={r.path}>
                      <Link href={r.path} className={`group flex min-h-11 items-center justify-between gap-4 rounded py-4 ${focusRing}`}>
                        <span className="font-semibold text-midnight transition-colors duration-200 group-hover:text-blue">{r.title}</span>
                        <ArrowRight
                          aria-hidden
                          className="size-4 shrink-0 text-slate transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-blue motion-reduce:transition-none"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <OfficialSources
              id="sources"
              className="mt-16"
              sources={[{ label: `USCIS: Form ${f.form}, ${f.title}`, href: officialFormUrl(f) }, ...(f.sources ?? [])]}
            />
          </div>

          <aside className="no-print lg:pt-1">
            <div className="lg:sticky lg:top-28">
              <nav aria-label="On this page" className="hidden lg:block">
                <p className="text-small font-semibold text-midnight">On this page</p>
                <ul className="mt-2 border-l border-border">
                  {[
                    { id: "know", label: `What to know about Form ${f.form}` },
                    { id: "steps", label: "Steps most cases go through" },
                    ...(related.length > 0 ? [{ id: "questions", label: `Questions about ${f.form} cases` }] : []),
                    { id: "sources", label: "Official sources" },
                  ].map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`-ml-px flex min-h-11 items-center border-l border-transparent py-1 pl-4 text-small text-slate transition-colors duration-200 hover:border-blue hover:text-midnight ${focusRing}`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex flex-col items-start gap-4 lg:mt-10">
                <Link href="/#track" className={btnPrimary}>
                  Track Case
                </Link>
                <ExternalLink href={USCIS_PROCESSING_TIMES}>Official processing times</ExternalLink>
                <ExternalLink href={officialFormUrl(f)}>{f.form} on uscis.gov</ExternalLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
