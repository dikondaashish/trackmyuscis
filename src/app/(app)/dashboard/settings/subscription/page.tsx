import { Suspense } from "react";
import { Check } from "lucide-react";
import { getAccount } from "@/lib/account";
import { MAX_CASES } from "@/lib/cases";
import { pageMetadata } from "@/lib/seo";
import { appPanel, appSectionTitle } from "@/lib/ui";
import { SettingsSkeleton } from "@/components/app/Skeletons";

export const metadata = pageMetadata({
  title: "Subscription",
  description: "Your TrackMyUSCIS plan.",
  path: "/dashboard/settings/subscription",
  noindex: true,
});

const FREE_INCLUDES = [
  `Save up to ${MAX_CASES} receipt numbers`,
  "Plain-English meaning of every case status",
  "Processing times, forms and guides",
];

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <Subscription />
    </Suspense>
  );
}

async function Subscription() {
  const account = await getAccount("/dashboard/settings/subscription");
  const premium = account.plan === "premium";
  return (
    <section aria-labelledby="plan-title" className={`${appPanel} stagger`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="plan-title" className={appSectionTitle}>
          Your plan
        </h2>
        <span className="rounded-full bg-ice px-2 text-caption leading-5 font-medium text-blue">
          {premium ? "Premium" : "Free"}
        </span>
      </div>
      <p className="mt-0.5 text-small text-slate">
        {premium ? "You're a Premium member." : "You're on the Free plan. There's nothing to pay and no card on file."}
      </p>
      <ul className="mt-4 flex flex-col gap-2 text-small text-midnight">
        {FREE_INCLUDES.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-teal" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
