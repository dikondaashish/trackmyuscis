import { ChevronDown } from "lucide-react";
import { GuideLinks, GuidePage, guideSectionTitle } from "@/components/app/Guide";
import { COMPANY } from "@/lib/company";
import { FAQ } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { appCard, appLink } from "@/lib/ui";

// The public /help page is the indexed one.
export const metadata = pageMetadata({
  title: "Help & Support",
  description: "Answers to common questions, and how to reach TrackMyUSCIS support.",
  path: "/help",
  noindex: true,
});

export default function DashboardHelpPage() {
  return (
    <GuidePage title="Help & Support" description="Answers to the questions people ask us most.">
      <div className={`${appCard} divide-y divide-border overflow-hidden`}>
        {FAQ.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-small font-semibold text-midnight transition-colors duration-200 hover:bg-cloud focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown
                aria-hidden
                className="size-4 shrink-0 text-slate transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="max-w-2xl px-4 pb-4 text-small text-slate">{item.a}</p>
          </details>
        ))}
      </div>

      <h2 className={`mt-8 ${guideSectionTitle}`}>Keep reading</h2>
      <GuideLinks
        className="mt-2.5"
        items={[
          { href: "/dashboard/answers", title: "More USCIS questions answered" },
          { href: "/dashboard/statuses", title: "What each case status means" },
          { href: "/dashboard/processing-times", title: "How long USCIS is taking" },
        ]}
      />

      <h2 className={`mt-8 ${guideSectionTitle}`}>Contact us</h2>
      <p className="mt-1 text-small text-slate">
        Email{" "}
        <a href={`mailto:${COMPANY.email.support}`} className={appLink}>
          {COMPANY.email.support}
        </a>
        . We usually reply within two business days.
      </p>
    </GuidePage>
  );
}
