import { SettingsSkeleton } from "@/components/app/Skeletons";
import { LoadingBar } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <LoadingBar />
      <SettingsSkeleton />
    </>
  );
}
