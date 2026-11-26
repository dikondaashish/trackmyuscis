import { ReceiptForm } from "@/components/ReceiptForm";
import { card } from "@/lib/ui";

/**
 * The receipt check, sized for a side column or the end of a page. The visitor starts
 * tracking right where they are instead of being sent to another page first.
 */
export function TrackCard({
  title = "Track your case",
  text = "Enter your receipt number to see which office has it, then save it to follow its status.",
  stacked = true,
  className = "",
}: {
  title?: string;
  text?: string;
  stacked?: boolean;
  className?: string;
}) {
  return (
    <section aria-label={title} className={`no-print ${card} p-5 sm:p-6 ${className}`}>
      <h2 className="text-title text-midnight">{title}</h2>
      <p className="mt-1 mb-4 text-small text-slate">{text}</p>
      <ReceiptForm stacked={stacked} />
    </section>
  );
}
