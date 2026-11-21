import { JsonLd } from "@/components/JsonLd";
import { SiteSearch } from "@/components/SiteSearch";
import { PageIntro } from "@/components/ui/PageIntro";
import { buildSearchIndex } from "@/lib/search";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { readContainer, section } from "@/lib/ui";

/** A tool page, not content: kept out of search engines (noindex) and out of the sitemap. */
export const metadata = pageMetadata({
  title: "Search USCIS Statuses, Forms and Answers",
  description: "Search every case status meaning, USCIS form, answer and guide on TrackMyUSCIS from one field. Results appear as you type and nothing you type is stored.",
  path: "/search",
  noindex: true,
});

export default function SearchPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "Search TrackMyUSCIS", description: "Search case statuses, forms, answers and guides.", path: "/search" }),
          breadcrumbSchema([{ name: "Search", path: "/search" }]),
        ]}
      />
      <PageIntro title="Search" width={readContainer} />
      <section className={section}>
        <div className={readContainer}>
          <SiteSearch index={buildSearchIndex()} />
        </div>
      </section>
    </>
  );
}
