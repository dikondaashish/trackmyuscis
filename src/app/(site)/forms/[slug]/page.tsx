import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { OfficialSources } from "@/components/OfficialSources";
import { RichText } from "@/components/ui/RichText";
import { notFound } from "next/navigation";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getAnswer } from "@/lib/answers";
import { FORM_RELATED, FORMS, FORMS_UPDATED, getForm, getGuide, officialFormUrl, USCIS_FEE_SCHEDULE, type UscisForm } from "@/lib/content";
import { FEE_SCHEDULE_EDITION, FORM_FACTS, FORM_FACTS_CHECKED, feeSentence } from "@/lib/form-facts";
import { postsForForm } from "@/lib/related";
import { btnPrimary, container, focusRing, panel, rowPad, rows, section, textLink } from "@/lib/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPtForm, ptShortAnswer, rangeSummary } from "@/lib/processing-times";

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

/** Date shown on the page: the newer of the notes check and the fee and document check. */
const updated = FORMS_UPDATED > FORM_FACTS_CHECKED ? FORMS_UPDATED : FORM_FACTS_CHECKED;

/** What the page covers, named the way people search: "Fee, Documents and Steps". */
function covers(slug: string) {
  const facts = FORM_FACTS[slug];
  if (!facts) return "Steps After Filing";
  return facts.documents?.items.length ? "Fee, Documents and Steps" : "Fee, How to File and Steps";
}

/** The questions people search about a form, answered from the facts on the page. */
function faq(f: UscisForm) {
  const facts = FORM_FACTS[f.slug];
  const pt = getPtForm(f.slug);
  const fee = feeSentence(f.slug);
  return [
    ...(facts
      ? [
          {
            q: `How much does Form ${f.form} cost?`,
            a: fee
              ? `The general filing fee for Form ${f.form} is ${fee}, on the USCIS Fee Schedule dated ${FEE_SCHEDULE_EDITION}.${facts.feeNote ? ` ${facts.feeNote}` : ""}`
              : `The fee depends on what you are asking for. On the USCIS Fee Schedule dated ${FEE_SCHEDULE_EDITION}: ${facts.fees.map((r) => `${r.label.toLowerCase()}, ${r.amount}`).join("; ")}.${facts.feeNote ? ` ${facts.feeNote}` : ""}`,
          },
        ]
      : []),
    ...(pt ? [{ q: `How long does Form ${f.form} take?`, a: ptShortAnswer(pt) }] : []),
    ...(facts ? [{ q: `Who files Form ${f.form}?`, a: facts.who }] : []),
    ...(facts
      ? [
          {
            q: `Which edition of Form ${f.form} does USCIS accept?`,
            a: `The edition dated ${facts.edition} (month/day/year), as listed on uscis.gov on ${longDate(FORM_FACTS_CHECKED)}.${facts.editionNote ? ` ${facts.editionNote}` : ""} The edition date is printed at the bottom of every page of the form.`,
          },
        ]
      : []),
  ];
}

export async function generateMetadata({ params }: PageProps<"/forms/[slug]">): Promise<Metadata> {
  const f = getForm((await params).slug);
  if (!f) return {};
  const fee = feeSentence(f.slug);
  const options = [
    ...(fee ? [`${f.about} Fee: ${fee}. What to send, how to file and the steps after.`, `${f.about} Fee: ${fee}, plus how to file.`] : []),
    `${f.about} The current fee, how to file and the steps most cases go through.`,
    `${f.about} Fees, filing and the steps after.`,
    f.about,
  ];
  return pageMetadata({
    title: `Form ${f.form} (${titleCase(f.label)}): ${covers(f.slug)}`,
    description: options.find((d) => d.length <= 160) ?? f.about,
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

  const facts = FORM_FACTS[f.slug];
  const pt = getPtForm(f.slug);
  const questions = faq(f);
  const posts = postsForForm(f.slug);
  const toc = [
    { id: "know", label: `What to know about Form ${f.form}` },
    ...(facts ? [{ id: "fee", label: "Filing fee" }] : []),
    ...(facts?.documents ? [{ id: "documents", label: "What to send with it" }] : []),
    { id: "steps", label: "Steps most cases go through" },
    ...(pt ? [{ id: "time", label: "How long it takes" }] : []),
    ...(questions.length > 0 ? [{ id: "faq", label: "Common questions" }] : []),
    ...(related.length + posts.length > 0 ? [{ id: "questions", label: `More on ${f.form} cases` }] : []),
    { id: "sources", label: "Official sources" },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: `Form ${f.form}: ${f.title}`, description: f.about, path: `/forms/${f.slug}`, dateModified: updated }),
          ...(questions.length > 0 ? [faqSchema(questions)] : []),
          breadcrumbSchema([
            { name: "Forms", path: "/forms" },
            { name: `Form ${f.form}`, path: `/forms/${f.slug}` },
          ]),
        ]}
      />
      <PageIntro title={`Form ${f.form}: ${f.label}`} description={f.about} back={{ href: "/forms", label: "All forms" }}>
        <p className="text-small text-slate">Official name: {f.title}</p>
        <p className="mt-1 text-small text-slate">Updated {longDate(updated)} · Checked against uscis.gov</p>
      </PageIntro>
      <section className={section}>
        <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12`}>
          <div>
            <h2 id="know" className="scroll-mt-28 text-h3 font-semibold text-midnight">What to know about Form {f.form}</h2>
            <div className={`mt-6 ${rows}`}>
              {facts && (
                <div className={`${rowPad} py-6`}>
                  <h3 className="text-title font-semibold text-midnight">Who files it</h3>
                  <p className="mt-2 max-w-2xl text-body text-slate">{facts.who}</p>
                </div>
              )}
              {f.sections.map((s) => (
                <div key={s.heading} className={`${rowPad} py-6`}>
                  <h3 className="text-title font-semibold text-midnight">{s.heading}</h3>
                  <p className="mt-2 max-w-2xl text-body text-slate">
                    <RichText text={s.body} />
                  </p>
                </div>
              ))}
              {!facts && (
                <div className={`${rowPad} py-6`}>
                  <h3 className="text-title font-semibold text-midnight">Filing fee</h3>
                  <p className="mt-2 max-w-2xl text-body text-slate">
                    <RichText text={`USCIS lists the current fee for Form ${f.form} on its [Fee Schedule page](${USCIS_FEE_SCHEDULE}).`} />
                  </p>
                </div>
              )}
            </div>

            {facts && (
              <>
                <h2 id="fee" className="mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">Filing fee</h2>
                <dl className={`mt-6 ${rows}`}>
                  {facts.fees.map((r) => (
                    <div key={r.label} className={`flex items-center justify-between gap-5 ${rowPad} py-4`}>
                      <dt className="text-body text-midnight">{r.label}</dt>
                      <dd className="shrink-0 text-title font-semibold text-midnight tabular-nums">{r.amount}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 max-w-2xl text-small text-slate">
                  <RichText
                    text={`${facts.feeNote ? `${facts.feeNote} ` : ""}Read from the [USCIS Fee Schedule](${USCIS_FEE_SCHEDULE}) (edition ${FEE_SCHEDULE_EDITION}) on ${longDate(FORM_FACTS_CHECKED)}. USCIS rejects a filing with the wrong fee, so confirm it there on the day you file.`}
                  />
                </p>
              </>
            )}

            {facts?.documents && (
              <>
                <h2 id="documents" className="mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">What to send with it</h2>
                <div className={`mt-6 ${panel}`}>
                  <p className="max-w-2xl text-body text-slate">{facts.documents.intro}</p>
                  {facts.documents.items.length > 0 && (
                    <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-body text-midnight marker:text-border">
                      {facts.documents.items.map((item) => (
                        <li key={item} className="pl-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="mt-4 max-w-2xl text-small text-slate">
                  A summary, not the full list. The form instructions on uscis.gov say exactly what your case needs. The current
                  edition of Form {f.form} is dated {facts.edition}.{facts.editionNote ? ` ${facts.editionNote}` : ""}
                </p>
              </>
            )}

            <h2 id="steps" className="mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">Steps most cases go through</h2>
            <ol className={`mt-6 ${panel}`}>
              {f.milestones.map((m, i) => (
                <li key={m} className="relative flex gap-5 pb-7 last:pb-0">
                  {i < f.milestones.length - 1 && (
                    <span aria-hidden className="absolute top-9 bottom-0 left-[17px] w-0.5 bg-border" />
                  )}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue tabular-nums">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-title text-midnight">{m}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 max-w-xl text-small text-slate">
              Every case is different. Your official USCIS notices always come first.
            </p>

            {pt && (
              <>
                <h2 id="time" className="mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">How long it takes</h2>
                <div className={`mt-6 ${panel}`}>
                  <p className="max-w-2xl text-body text-slate">{ptShortAnswer(pt)}</p>
                  <Link href={`/processing-times/${f.slug}`} className={`mt-3 ${textLink}`}>
                    Form {f.form} processing time: {rangeSummary(pt)}
                    <ArrowRight aria-hidden className="size-4 shrink-0" />
                  </Link>
                </div>
              </>
            )}

            {questions.length > 0 && (
              <>
                <h2 id="faq" className="mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">Common questions</h2>
                <div className={`mt-6 ${rows}`}>
                  {questions.map((q) => (
                    <div key={q.q} className={`${rowPad} py-5`}>
                      <h3 className="text-title font-semibold text-midnight">{q.q}</h3>
                      <p className="mt-1 max-w-2xl text-body text-slate">{q.a}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {related.length + posts.length > 0 && (
              <div className="mt-12">
                <h2 id="questions" className="scroll-mt-28 text-h3 font-semibold text-midnight">More on {f.form} cases</h2>
                <LinkRows
                  compact
                  className="mt-6"
                  items={[...posts.map((b) => ({ href: `/blog/${b.slug}`, title: b.title })), ...related.map((r) => ({ href: r.path, title: r.title }))]}
                />
              </div>
            )}

            <OfficialSources
              id="sources"
              className="mt-12 scroll-mt-28"
              sources={[
                { label: `USCIS: Form ${f.form}, ${f.title}`, href: officialFormUrl(f) },
                ...(facts ? [{ label: "USCIS: Fee Schedule (Form G-1055)", href: USCIS_FEE_SCHEDULE }] : []),
                ...(facts?.documents?.source ? [facts.documents.source] : []),
                ...(f.sources ?? []),
              ]}
            />
          </div>

          <aside className="no-print lg:pt-1">
            <div className="lg:sticky lg:top-28">
              <nav aria-label="On this page" className="hidden lg:block">
                <p className="text-small font-semibold text-midnight">On this page</p>
                <ul className="mt-2 border-l border-border">
                  {toc.map((item) => (
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
              <div className={`flex flex-col items-stretch gap-3 lg:mt-8 ${panel} sm:p-6`}>
                <p className="text-title text-midnight">Have a receipt number?</p>
                <p className="-mt-2 mb-1 text-small text-slate">Confirm it and see which USCIS office has your case.</p>
                <Link href="/#track" className={btnPrimary}>
                  Track Case
                </Link>
                {getPtForm(f.slug) && (
                  <Link
                    href={`/processing-times/${f.slug}`}
                    className={`link-draw inline-flex min-h-11 items-center rounded text-small font-semibold text-blue ${focusRing}`}
                  >
                    Form {f.form} processing time
                  </Link>
                )}
                <ExternalLink href={officialFormUrl(f)}>{f.form} on uscis.gov</ExternalLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
