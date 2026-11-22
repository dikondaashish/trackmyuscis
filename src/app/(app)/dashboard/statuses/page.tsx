import { StatusFinder } from "@/components/StatusFinder";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { GuidePage } from "@/components/app/Guide";
import { STATUSES, USCIS_CASE_STATUS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// The public /status-explained page is the indexed one; this copy keeps signed-in people in the app.
export const metadata = pageMetadata({
  title: "Case statuses",
  description: "What each USCIS case status means, in plain English.",
  path: "/status-explained",
  noindex: true,
});

export default function DashboardStatusesPage() {
  return (
    <GuidePage
      title="What each case status means"
      description="The statuses USCIS shows most often, in plain language. The wording on your account can differ slightly."
    >
      <StatusFinder statuses={STATUSES} />
      <ExternalLink href={USCIS_CASE_STATUS} className="mt-6">
        Check your status on uscis.gov
      </ExternalLink>
    </GuidePage>
  );
}
