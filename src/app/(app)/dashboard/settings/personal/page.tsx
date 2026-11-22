import { Suspense } from "react";
import { Lock } from "lucide-react";
import { getAccount } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { appPanel, appSectionTitle } from "@/lib/ui";
import { Avatar } from "@/components/app/AccountCard";
import { SettingsSkeleton } from "@/components/app/Skeletons";
import { ProfileForm } from "../ProfileForm";

export const metadata = pageMetadata({
  title: "Personal profile",
  description: "Your private TrackMyUSCIS profile.",
  path: "/dashboard/settings/personal",
  noindex: true,
});

export default function PersonalProfilePage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <Personal />
    </Suspense>
  );
}

async function Personal() {
  const account = await getAccount("/dashboard/settings/personal");
  return (
    <div className="stagger flex flex-col gap-4">
      <section aria-labelledby="personal-title" className={appPanel}>
        <h2 id="personal-title" className={appSectionTitle}>
          Personal profile
        </h2>
        <p className="mt-0.5 flex items-center gap-1.5 text-small text-slate">
          <Lock aria-hidden className="size-3.5" />
          Private. Only you see this; it&apos;s never shown in the community.
        </p>
        <div className="mt-4 flex items-center gap-3.5 rounded-lg bg-cloud p-4">
          <Avatar initials={account.initials} photoUrl={account.photoUrl} premium={account.plan === "premium"} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-body font-semibold text-midnight">{account.name ?? "Your name"}</p>
            <p className="truncate text-small text-slate">{account.email}</p>
            <p className="text-caption text-slate">
              {account.photoUrl ? "Photo from your Google account." : "Your initials stand in for a photo."}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="name-title" className={appPanel}>
        <h2 id="name-title" className={appSectionTitle}>
          Name
        </h2>
        <p className="mt-0.5 mb-4 text-small text-slate">Your real name. We use it to greet you in the dashboard.</p>
        <ProfileForm userId={account.id} firstName={account.firstName ?? ""} lastName={account.lastName ?? ""} />
      </section>
    </div>
  );
}
