import { Suspense } from "react";
import { getAccount } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { SettingsSkeleton } from "@/components/app/Skeletons";
import { PersonalProfile } from "../PersonalProfile";

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
    <PersonalProfile
      userId={account.id}
      personal={{
        firstName: account.firstName ?? "",
        lastName: account.lastName ?? "",
        dateOfBirth: account.dateOfBirth,
        email: account.email,
        initials: account.initials,
        photoUrl: account.photoUrl,
        premium: account.plan === "premium",
      }}
    />
  );
}
