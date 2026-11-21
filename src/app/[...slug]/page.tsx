import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/LegalDocument";
import { PageIntro } from "@/components/ui/PageIntro";
import { Prose } from "@/components/ui/Prose";
import { RichText } from "@/components/ui/RichText";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { TEXT_PAGE_PHOTOS } from "@/lib/photos";
import { TEXT_PAGES } from "@/lib/content";
import { LEGAL_DOCS } from "@/lib/legal";
import { btnPrimary, panel, readContainer, section } from "@/lib/ui";

/**
 * Short text pages (about, contact, sign-in...) and legal documents (terms, privacy...).
 * Every known page is prerendered; unknown ones return a real 404, so navigation may wait on the server.
 */
export const instant = false;

export function generateStaticParams() {
  return [...Object.keys(TEXT_PAGES), ...Object.keys(LEGAL_DOCS)].map((key) => ({ slug: key.split("/") }));
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const key = (await params).slug.join("/");
  const doc = LEGAL_DOCS[key];
  const page = TEXT_PAGES[key];
  if (!doc && !page) return {};
  const meta = pageMetadata({
    title: doc ? (doc.seoTitle ?? doc.title) : (page.seoTitle ?? page.title),
    description: doc ? doc.description : (page.description ?? page.lead),
    path: `/${key}`,
    noindex: page?.noindex,
  });
  const image = { url: `/og/${key}`, width: 1200, height: 630, alt: doc?.title ?? page.title };
  return { ...meta, openGraph: { ...meta.openGraph, images: [image] }, twitter: { ...meta.twitter, images: [image] } };
}

export default async function TextPage({ params }: PageProps<"/[...slug]">) {
  const key = (await params).slug.join("/");

  const doc = LEGAL_DOCS[key];
  if (doc)
    return (
      <>
        <JsonLd
          data={[
            webPageSchema({ name: doc.title, description: doc.description, path: `/${key}` }),
            breadcrumbSchema(doc.policy ? [{ name: "Legal", path: "/legal" }, { name: doc.title, path: `/${key}` }] : [{ name: doc.title, path: `/${key}` }]),
          ]}
        />
        <LegalDocument slug={key} doc={doc} />
      </>
    );

  const page = TEXT_PAGES[key];
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: page.title, description: page.description ?? page.lead, path: `/${key}`, type: key === "about" ? "AboutPage" : key === "contact" ? "ContactPage" : "WebPage" }),
          breadcrumbSchema([{ name: page.title, path: `/${key}` }]),
        ]}
      />
      <PageIntro title={page.title} description={page.lead} photo={TEXT_PAGE_PHOTOS[key]} width={readContainer} />
      {(page.body || page.sections || page.action) && (
        <section className={section}>
          <div className={readContainer}>
            <div className={`${panel} sm:p-10`}>
            <div className="space-y-5">
              {page.body?.map((p) => (
                <p key={p} className="text-lead text-slate">
                  <RichText text={p} />
                </p>
              ))}
            </div>
            {page.sections?.map((s) => (
              <section key={s.heading} className="mt-10">
                <h2 className="text-title font-semibold text-midnight">{s.heading}</h2>
                <div className="mt-3">
                  <Prose blocks={s.body} />
                </div>
              </section>
            ))}
            {page.action &&
              (page.action.external ? (
                <ExternalLink href={page.action.href} primary className="mt-10">
                  {page.action.label}
                </ExternalLink>
              ) : (
                <Link href={page.action.href} className={`mt-10 ${btnPrimary}`}>
                  {page.action.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
