import { CalendarCheck, CalendarClock, CalendarX, CalendarOff } from "lucide-react";
import { daysUntil, expiryPhrase, expiryState, type ExpiryState } from "@/lib/documents/types";

const TONE: Record<ExpiryState, string> = {
  expired: "bg-red/10 text-red",
  today: "bg-red/10 text-red",
  soon: "bg-amber/10 text-amber",
  upcoming: "bg-amber/10 text-amber",
  valid: "bg-teal/10 text-teal",
  none: "bg-cloud text-slate",
};

const ICON: Record<ExpiryState, typeof CalendarCheck> = {
  expired: CalendarX,
  today: CalendarClock,
  soon: CalendarClock,
  upcoming: CalendarClock,
  valid: CalendarCheck,
  none: CalendarOff,
};

/** "Expires in 12 days" in amber, "Expired…" in red, "Valid until…" in teal. */
export function ExpiryBadge({ expiry, today }: { expiry: string | null; today: string }) {
  const days = daysUntil(expiry, today);
  const state = expiryState(days);
  const Icon = ICON[state];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-medium ${TONE[state]}`}>
      <Icon aria-hidden className="size-3.5 shrink-0" />
      {expiryPhrase(expiry, days)}
    </span>
  );
}
