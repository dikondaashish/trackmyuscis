import { Suspense } from "react";
import { getAccount } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { card } from "@/lib/ui";
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

const panel = `${card} p-5 sm:p-6`;

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
    <div className="stagger flex flex-col gap-4 lg:gap-6">
      <section aria-labelledby="you-title" className={`${panel} flex items-center gap-4`}>
        <Avatar initials={account.initials} photoUrl={account.photoUrl} premium={account.plan === "premium"} size="lg" />
        <div className="min-w-0">
          <h2 id="you-title" className="truncate text-title text-midnight">
            {account.name ?? "Your profile"}
          </h2>
          {account.username && <p className="truncate text-small font-medium text-blue">u/{account.username}</p>}
          <p className="mt-0.5 text-small text-slate">
            {account.photoUrl ? "Photo from your Google account." : "Your initials stand in for a photo."}
          </p>
        </div>
      </section>

      <section aria-labelledby="name-title" className={panel}>
        <h2 id="name-title" className="text-title text-midnight">
          Name
        </h2>
        <p className="mt-1 mb-5 text-small text-slate">How we greet you in the dashboard.</p>
        <ProfileForm userId={account.id} firstName={account.firstName ?? ""} lastName={account.lastName ?? ""} />
      </section>

      {account.username && (
        <section aria-labelledby="username-title" className={panel}>
          <h2 id="username-title" className="text-title text-midnight">
            Username
          </h2>
          <p className="mt-1 mb-5 text-small text-slate">Your name on TrackMyUSCIS instead of your real name.</p>
          <UsernameForm userId={account.id} username={account.username} />
        </section>
      )}
    </div>
  );
}
