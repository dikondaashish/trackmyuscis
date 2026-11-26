import { StatusFinder } from "@/components/StatusFinder";
import { TrackCard } from "@/components/TrackCard";
import { ToolHero } from "@/components/ui/ToolHero";
import { STATUS_PAGES, statusHref, STATUSES_UPDATED } from "@/lib/statuses";
import { container } from "@/lib/ui";
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
      <ToolHero
        title="What each USCIS case status means"
        description="The statuses USCIS shows most often, in the order a case usually moves through them. Find yours for what to do and what comes next."
        meta={<p>Updated {longDate(STATUSES_UPDATED)} · The wording on your account can differ slightly</p>}
      />
      <section className="pb-16 sm:pb-20">
        <div className={container}>
          <div className="-mt-2 pt-8">
            <StatusFinder statuses={STATUS_PAGES.map((s) => ({ name: s.name, tone: s.tone, meaning: s.meaning, href: statusHref(s) }))} />
          </div>

          <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-h2 text-midnight">Don&apos;t know your status yet?</h2>
              <p className="mt-3 max-w-xl text-body text-slate">
                Save your receipt number and we check it with USCIS about once a day. You see the current status, what it means
                and every earlier step in one place.
              </p>
            </div>
            <TrackCard stacked={false} />
          </div>
        </div>
      </section>
    </>
  );
}
