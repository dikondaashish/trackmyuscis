import { PageIntro } from "@/components/ui/PageIntro";
import { StatusFinder } from "@/components/StatusFinder";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { USCIS_CASE_STATUS } from "@/lib/content";
import { STATUS_PAGES, statusHref, STATUSES_UPDATED } from "@/lib/statuses";
import { readContainer, section } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, definedTermSetSchema, itemListSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "USCIS Case Status Meanings in Plain English",
  description: "What each USCIS case status means in plain English, from Case Was Received to Card Was Mailed, with what to do and what usually comes next.",
  path: "/status-explained",
});

export default function StatusExplainedPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "USCIS case statuses explained", description: "Plain-English meanings for common USCIS case statuses.", path: "/status-explained", dateModified: STATUSES_UPDATED }),
          breadcrumbSchema([{ name: "Case statuses", path: "/status-explained" }]),
          definedTermSetSchema("USCIS case statuses", "/status-explained", STATUS_PAGES.map((s) => ({ name: s.name, description: s.meaning }))),
          itemListSchema("USCIS case statuses", STATUS_PAGES.map((s) => ({ name: s.name, path: statusHref(s) }))),
        ]}
      />
      <PageIntro
        title="What each USCIS case status means"
        description="The statuses USCIS shows most often, in plain language. Choose one for what to do and what usually comes next."
        width={readContainer}
      >
        <p className="text-small text-slate">Updated {longDate(STATUSES_UPDATED)} · The wording on your account can differ slightly</p>
      </PageIntro>
      <section className={section}>
        <div className={readContainer}>
          <StatusFinder statuses={STATUS_PAGES.map((s) => ({ name: s.name, tone: s.tone, meaning: s.meaning, href: statusHref(s) }))} />
          <ExternalLink href={USCIS_CASE_STATUS} className="mt-10">
            Check your status on uscis.gov
          </ExternalLink>
        </div>
      </section>
    </>
  );
}
