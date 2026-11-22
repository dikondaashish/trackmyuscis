import { CasesSkeleton } from "@/components/app/Skeletons";
import { LoadingBar } from "@/components/ui/Skeleton";
import { appPage } from "@/lib/ui";

export default function Loading() {
  return (
    <div className={appPage}>
      <LoadingBar />
      <CasesSkeleton />
    </div>
  );
}
