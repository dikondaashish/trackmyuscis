import { StatusFinder } from "@/components/StatusFinder";
import { ArrowUpRight } from "lucide-react";
import { GuidePage } from "@/components/app/Guide";
import { STATUSES, USCIS_CASE_STATUS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { appBtnSecondary } from "@/lib/ui";

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
      <StatusFinder statuses={STATUSES} compact />
      <a href={USCIS_CASE_STATUS} target="_blank" rel="noopener noreferrer" className={`mt-5 ${appBtnSecondary}`}>
        Check your status on uscis.gov
        <ArrowUpRight aria-hidden className="size-3.5" />
        <span className="sr-only">(opens uscis.gov in a new tab)</span>
      </a>
    </GuidePage>
  );
}
