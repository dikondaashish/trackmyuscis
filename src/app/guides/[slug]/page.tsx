import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema, CONTENT_UPDATED, longDate, pageMetadata } from "@/lib/seo";
import { OfficialSources } from "@/components/OfficialSources";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { GUIDE_PHOTOS } from "@/lib/photos";
import { GUIDES, getGuide } from "@/lib/content";
import { readContainer, section, textLink } from "@/lib/ui";

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
            {g.sections.map((s) => (
              <div key={s.heading} className="mb-12 last:mb-0">
                <h2 className="text-h3 font-semibold text-midnight">{s.heading}</h2>
                <p className="mt-3 text-lead text-slate">{s.body}</p>
              </div>
            ))}
            <OfficialSources sources={g.sources} className="mt-12" />
            <p className="mt-12 flex items-start gap-2 rounded-2xl bg-ice p-5 text-small text-midnight">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-blue" />
              General information, not legal advice. For advice about your case, talk to a licensed immigration
              attorney.
            </p>
          </article>

          <div className="mt-20 border-t border-border pt-10">
            <h2 className="text-title font-semibold text-midnight">Read next</h2>
            <ul className="mt-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/guides/${o.slug}`} className={textLink}>
                    {o.title}
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
