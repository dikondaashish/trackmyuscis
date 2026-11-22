import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAccount } from "@/lib/account";
import { caseEngineEnabled } from "@/lib/case-engine/client";
import { pageMetadata } from "@/lib/seo";
import { appPanel, appSectionTitle, focusRing } from "@/lib/ui";
import { SettingsSkeleton } from "@/components/app/Skeletons";
import { ComingSoonSwitch, PreferenceSwitch } from "../PreferenceSwitch";

export const metadata = pageMetadata({
  title: "Preferences",
  description: "Notification and privacy preferences for TrackMyUSCIS.",
  path: "/dashboard/settings/preferences",
  noindex: true,
});

const ABOUT = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact us" },
];

export default function PreferencesPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <Preferences />
    </Suspense>
  );
}

async function Preferences() {
  const account = await getAccount("/dashboard/settings/preferences");
  const { emailNotifications, publicProfile, showActivityStatus } = account.preferences;

  return (
    <div className="stagger flex flex-col gap-4">
      <section aria-labelledby="notify-title" className={appPanel}>
        <h2 id="notify-title" className={appSectionTitle}>
          Case notifications
        </h2>
        <p className="mt-0.5 text-small text-slate">
          {caseEngineEnabled()
            ? "We email you when USCIS changes the status of a saved case."
            : "Alerts start when automatic status updates launch. Your choice is saved now."}
        </p>
        <div className="mt-2 divide-y divide-border">
          <PreferenceSwitch
            userId={account.id}
            column="email_notifications"
            label="Email notifications"
            description={`Case status updates sent to ${account.email}`}
            initial={emailNotifications}
          />
          <ComingSoonSwitch label="SMS notifications" description="Text alerts to your phone." />
        </div>
      </section>

      <section aria-labelledby="privacy-title" className={appPanel}>
        <h2 id="privacy-title" className={appSectionTitle}>
          Privacy
        </h2>
        <p className="mt-0.5 text-small text-slate">
          Community features aren&apos;t live yet, so nobody else can see you today. These take effect when they launch.
        </p>
        <div className="mt-2 divide-y divide-border">
          <PreferenceSwitch
            userId={account.id}
            column="public_profile"
            label="Public profile"
            description="Show your community profile to other users."
            initial={publicProfile}
          />
          <PreferenceSwitch
            userId={account.id}
            column="show_activity_status"
            label="Show activity status"
            description="Let other users see when you were last active."
            initial={showActivityStatus}
          />
        </div>
      </section>

      <section aria-labelledby="about-title" className={appPanel}>
        <h2 id="about-title" className={appSectionTitle}>
          About
        </h2>
        <ul className="mt-2 divide-y divide-border">
          {ABOUT.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`group flex min-h-11 items-center justify-between rounded text-small font-medium text-midnight hover:text-blue ${focusRing}`}
              >
                {label}
                <ChevronRight
                  aria-hidden
                  className="size-4 text-slate transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
