import { Suspense } from "react";
import { getAccount } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { appPanel, appSectionTitle } from "@/lib/ui";
import { Avatar } from "@/components/app/AccountCard";
import { SettingsSkeleton } from "@/components/app/Skeletons";
import { ProfileForm } from "./ProfileForm";
import { UsernameForm } from "./UsernameForm";

export const metadata = pageMetadata({
  title: "Profile settings",
  description: "Your TrackMyUSCIS profile.",
  path: "/dashboard/settings",
  noindex: true,
});

const panel = appPanel;

export default function ProfilePage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <Profile />
    </Suspense>
  );
}

async function Profile() {
  const account = await getAccount("/dashboard/settings");
  return (
    <div className="stagger flex flex-col gap-4">
      <section aria-labelledby="you-title" className={`${panel} flex items-center gap-3.5`}>
        <Avatar initials={account.initials} photoUrl={account.photoUrl} premium={account.plan === "premium"} size="lg" />
        <div className="min-w-0">
          <h2 id="you-title" className="truncate text-body font-semibold text-midnight">
            {account.name ?? "Your profile"}
          </h2>
          {account.username && <p className="truncate text-caption font-medium text-blue">u/{account.username}</p>}
          <p className="text-caption text-slate">
            {account.photoUrl ? "Photo from your Google account." : "Your initials stand in for a photo."}
          </p>
        </div>
      </section>

      <section aria-labelledby="name-title" className={panel}>
        <h2 id="name-title" className={appSectionTitle}>
          Name
        </h2>
        <p className="mt-0.5 mb-4 text-small text-slate">How we greet you in the dashboard.</p>
        <ProfileForm userId={account.id} firstName={account.firstName ?? ""} lastName={account.lastName ?? ""} />
      </section>

      {account.username && (
        <section aria-labelledby="username-title" className={panel}>
          <h2 id="username-title" className={appSectionTitle}>
            Username
          </h2>
          <p className="mt-0.5 mb-4 text-small text-slate">Your name on TrackMyUSCIS instead of your real name.</p>
          <UsernameForm userId={account.id} username={account.username} lockedUntil={account.usernameLockedUntil} />
        </section>
      )}
    </div>
  );
}
