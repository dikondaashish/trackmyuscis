import { SettingsSkeleton } from "@/components/app/Skeletons";
import { LoadingBar, Skeleton } from "@/components/ui/Skeleton";
import { appPage } from "@/lib/ui";

export default function Loading() {
  return (
    <div className={`${appPage} max-w-3xl`}>
      <LoadingBar />
      <Skeleton className="h-8 w-32" />
      <SettingsSkeleton />
    </div>
  );
}
