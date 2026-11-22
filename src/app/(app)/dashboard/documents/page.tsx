import { Suspense } from "react";
import { getAccount } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { appPage } from "@/lib/ui";
import { Skeleton } from "@/components/ui/Skeleton";
import { DocumentsClient } from "@/components/app/documents/DocumentsClient";

export const metadata = pageMetadata({
  title: "Documents",
  description: "Your immigration documents in one private place, with expiry reminders.",
  path: "/dashboard/documents",
  noindex: true,
});

export default function DocumentsPage() {
  return (
    <div className={appPage}>
      <Suspense fallback={<Skeleton className="h-10 w-48" />}>
        <Documents />
      </Suspense>
    </div>
  );
}

async function Documents() {
  const account = await getAccount("/dashboard/documents");
  return <DocumentsClient email={account.email} remindersOn={account.preferences.documentReminders} />;
}
