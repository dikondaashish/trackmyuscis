/** A grey placeholder block that shimmers while content loads. Size it with className. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton ${className}`} />;
}

/** A thin bar across the top of the screen that moves while a page loads. */
export function LoadingBar() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-ice">
      <div className="loader-bar h-full w-1/2 origin-left rounded-full bg-blue" />
    </div>
  );
}
