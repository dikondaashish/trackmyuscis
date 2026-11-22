import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { GUIDE_PHOTOS, PHOTOS } from "@/lib/photos";
import { GUIDES } from "@/lib/content";
import { readContainer, rowArrow, rowLink, rows, section } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "USCIS Case Guides: Statuses, Biometrics, Timelines",
  description: "Short, plain-English guides to the questions people ask while a USCIS case is pending: what statuses mean, what happens after biometrics and how long it takes.",
  path: "/guides",
});

const ALL = [
  ...GUIDES.map((g) => ({
    href: `/guides/${g.slug}`,
    title: g.title,
    summary: g.summary,
    photo: GUIDE_PHOTOS[g.slug],
  })),
  {
    href: "/status-explained",
    title: "What each case status means",
    summary: "Plain-language meanings for the statuses USCIS shows.",
    photo: PHOTOS.statusExplained,
  },
];

export default function GuidesPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Immigration guides", description: "Plain-English answers while a USCIS case is pending.", path: "/guides", type: "CollectionPage" }), breadcrumbSchema([{ name: "Guides", path: "/guides" }]), itemListSchema("Immigration guides", GUIDES.map((g) => ({ name: g.title, path: `/guides/${g.slug}` })))]} />
      <PageIntro
        title="Guides for a pending USCIS case"
        description="What a status means, what happens after an appointment and how long the wait can be."
        width={readContainer}
      />
      <section className={section}>
        <div className={readContainer}>
          <ul className={rows}>
            {ALL.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className={`${rowLink} justify-start gap-5 sm:gap-6`}>
                  <Photo
                    photo={g.photo}
                    zoomOnHover
                    sizes="(min-width: 640px) 176px, 112px"
                    className="aspect-[4/3] w-28 shrink-0 rounded-xl sm:w-44"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-title font-semibold text-midnight transition-colors duration-200 group-hover:text-blue">
                      {g.title}
                    </span>
                    <span className="mt-1 block text-body text-slate">{g.summary}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className={rowArrow}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
