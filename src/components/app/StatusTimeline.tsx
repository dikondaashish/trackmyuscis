import type { TimelineEntry } from "@/lib/cases";

/**
 * A case's USCIS status history as a vertical timeline, newest first. Every step is a filled
 * teal dot on one teal line, so it reads as the journey so far from the bottom (received)
 * up to the current status, which gets a soft ring and a gentle pulse.
 */
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
      <p className="mt-4 text-caption text-slate">
        From USCIS, newest first{entries.some((e) => e.byYou) ? ", with the dates you confirmed" : ""}.
      </p>
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
              className="absolute top-4 bottom-0 left-[4.5px] w-0.5 rounded-full bg-teal/70"
            />
          )}
          <span aria-hidden className="relative mt-1 flex size-[11px] shrink-0">
            {/* The current status pulses softly: this is where the case is now. Off with reduced motion. */}
            {entry.current && <span className="ping absolute inset-0 rounded-full bg-teal" />}
            <span className={`relative size-[11px] rounded-full bg-teal ${entry.current ? "ring-4 ring-teal/15" : ""}`} />
          </span>
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
              {entry.byYou && " · Confirmed by you"}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
