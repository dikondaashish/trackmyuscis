import { Suspense } from "react";
import { getAccount } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { SettingsSkeleton } from "@/components/app/Skeletons";
import { CommunityProfile } from "./CommunityProfile";

export const metadata = pageMetadata({
  title: "Community profile",
  description: "Your TrackMyUSCIS community profile.",
  path: "/dashboard/settings",
  noindex: true,
});

export default function CommunityProfilePage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <Community />
    </Suspense>
  );
}

async function Community() {
  const account = await getAccount("/dashboard/settings");
  return (
    <CommunityProfile
      userId={account.id}
      username={account.username}
      usernameLockedUntil={account.usernameLockedUntil}
      community={account.community}
    />
  );
}
