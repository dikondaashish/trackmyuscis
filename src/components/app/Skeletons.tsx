import { Skeleton } from "@/components/ui/Skeleton";
import { card } from "@/lib/ui";

const rowCols = "sm:grid sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_6.5rem_1.25rem] sm:items-center sm:gap-6";

/** The cases list while it loads: the same header and table rows, in grey. */
export function CasesSkeleton() {
  return (
    <div role="status" aria-label="Loading your cases">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-8 w-44" />
        </div>
        <Skeleton className="hidden h-12 w-32 rounded-[10px] sm:block" />
      </div>
      <div className={`${card} mt-6 overflow-hidden`}>
        <div className="hidden h-10 border-b border-border bg-cloud/60 sm:block" />
        <ul className="divide-y divide-border">
          {[0, 1, 2].map((i) => (
            <li key={i} className={`px-5 py-5 ${rowCols}`} style={{ opacity: 1 - i * 0.25 }}>
              <div>
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
              <Skeleton className="mt-3 h-4 w-32 sm:mt-0" />
              <Skeleton className="mt-3 h-6 w-28 rounded-full sm:mt-0" />
              <Skeleton className="hidden h-4 w-16 sm:block" />
              <span />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** One case while it loads: title, receipt number, then the panels. */
export function CaseSkeleton() {
  return (
    <div role="status" aria-label="Loading case">
      <Skeleton className="mt-4 h-8 w-64 max-w-full" />
      <Skeleton className="mt-3 h-5 w-40" />
      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className={`${card} p-5 sm:p-6`}>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-4 h-6 w-40 rounded-full" />
            <Skeleton className="mt-4 h-4 w-full max-w-md" />
            <Skeleton className="mt-2 h-4 w-3/4 max-w-sm" />
            <Skeleton className="mt-6 h-12 w-56 rounded-[10px]" />
          </div>
          <div className={`${card} p-5 sm:p-6`}>
            <Skeleton className="h-4 w-40" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mt-4 flex items-center gap-4">
                <Skeleton className="size-7 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>
        <div className={`${card} h-fit p-5 sm:p-6`}>
          <Skeleton className="h-4 w-44" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="mt-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-1.5 h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Settings while they load. */
export function SettingsSkeleton() {
  return (
    <div role="status" aria-label="Loading settings" className="flex flex-col gap-4 lg:gap-6">
      {[0, 1].map((i) => (
        <div key={i} className={`${card} p-5 sm:p-6`}>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-4 w-64 max-w-full" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-12 rounded-[10px]" />
            <Skeleton className="h-12 rounded-[10px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
