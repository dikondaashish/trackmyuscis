import type { Tone } from "@/lib/content";

const TONES: Record<Tone, string> = {
  info: "bg-ice text-blue",
  success: "bg-teal/10 text-teal",
  warning: "bg-amber/10 text-amber",
  error: "bg-red/10 text-red",
};

export function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold ${TONES[tone]}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
