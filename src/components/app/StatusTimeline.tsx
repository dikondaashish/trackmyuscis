import type { TimelineEntry } from "@/lib/cases";

/** A case's USCIS status history as a vertical timeline, newest first; the current status in teal. */
export function StatusTimeline({
  entries,
  className,
}: {
  entries: TimelineEntry[];
  className?: string;
}) {
  return (
    <section aria-labelledby="history-title" className={className}>
      <h2 id="history-title" className="text-caption font-medium text-slate">
        Status history
      </h2>
      <TimelineList entries={entries} className="mt-3" />
      <p className="mt-4 text-caption text-slate">From USCIS, newest first.</p>
    </section>
  );
}

/** Just the list, for places with their own heading (the dashboard rows). */
export function TimelineList({
  entries,
  className,
}: {
  entries: TimelineEntry[];
  className?: string;
}) {
  return (
    <ol className={className}>
      {entries.map((entry, i) => (
        <li
          key={`${entry.status}-${entry.date ?? i}`}
          className="relative flex gap-3 pb-4 last:pb-0"
        >
          {i < entries.length - 1 && (
            <span
              aria-hidden
              className="absolute top-4 bottom-0 left-[5px] w-px bg-border"
            />
          )}
          <span
            aria-hidden
            className={`mt-1 size-[11px] shrink-0 rounded-full border-2 ${
              entry.current ? "border-teal bg-teal" : "border-border bg-white"
            }`}
          />
          <div className="min-w-0">
            <p
              className={`text-small text-midnight ${entry.current ? "font-semibold" : ""}`}
            >
              {entry.status}
              {entry.current && (
                <span className="sr-only"> (current status)</span>
              )}
            </p>
            <p className="text-caption text-slate tabular-nums">
              {entry.date ??
                (entry.current ? "Current status" : "Date not shared by USCIS")}
              {entry.current && entry.date && " · Current"}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
