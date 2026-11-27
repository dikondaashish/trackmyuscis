import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema, CONTENT_UPDATED, longDate, pageMetadata } from "@/lib/seo";
import { SourceNote } from "@/components/ui/SourceNote";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { GUIDE_PHOTOS } from "@/lib/photos";
import { GUIDES, getGuide } from "@/lib/content";
import { panel, readContainer, section } from "@/lib/ui";

/** Every known page is prerendered; unknown ones return a real 404, so navigation may wait on the server. */
export const instant = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return g ? pageMetadata({ title: g.seoTitle ?? g.title, description: g.description, path: `/guides/${g.slug}`, type: "article" }) : {};
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const others = GUIDES.filter((o) => o.slug !== g.slug);

  return (
    <>
      <JsonLd
        data={[
          articleSchema({ headline: g.title, description: g.description, path: `/guides/${g.slug}`, image: GUIDE_PHOTOS[g.slug]?.src.src }),
          breadcrumbSchema([
            { name: "Guides", path: "/guides" },
            { name: g.title, path: `/guides/${g.slug}` },
          ]),
        ]}
      />
      <PageIntro title={g.title} description={g.summary} back={{ href: "/guides", label: "All guides" }} photo={GUIDE_PHOTOS[g.slug]} width={readContainer}>
        <p className="text-small text-slate">Updated {longDate(CONTENT_UPDATED)} · Checked against uscis.gov</p>
      </PageIntro>
      <section className={section}>
        <div className={readContainer}>
          <article>
            <div className={`${panel} sm:p-8`}>
              {g.sections.map((s) => (
                <div key={s.heading} className="mb-10 last:mb-0">
                  <h2 className="text-h3 font-semibold text-midnight">{s.heading}</h2>
                  <p className="mt-3 text-lead text-slate">{s.body}</p>
                </div>
              ))}
              <SourceNote sources={g.sources} className="mt-10" />
            </div>
            <p className="mt-6 flex items-start gap-2 text-small text-slate">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              General information, not legal advice. For advice about your case, talk to a licensed immigration
              attorney.
            </p>
          </article>

          <div className="mt-12">
            <h2 className="text-h3 text-midnight">Read next</h2>
            <LinkRows compact className="mt-5" items={others.map((o) => ({ href: `/guides/${o.slug}`, title: o.title, note: o.summary }))} />
          </div>
        </div>
      </section>
    </>
  );
}
