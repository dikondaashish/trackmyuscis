import { CaseSkeleton } from "@/components/app/Skeletons";
import { LoadingBar, Skeleton } from "@/components/ui/Skeleton";
import { appPage } from "@/lib/ui";

export default function Loading() {
  return (
    <div className={appPage}>
      <LoadingBar />
      <Skeleton className="h-5 w-24" />
      <CaseSkeleton />
    </div>
  );
}
