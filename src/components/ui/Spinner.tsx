import { LoaderCircle } from "lucide-react";

/** The one busy indicator: sits before a button's "Saving…" label. Still when motion is reduced. */
export function Spinner({ className = "size-4" }: { className?: string }) {
  return <LoaderCircle aria-hidden className={`${className} shrink-0 animate-spin motion-reduce:animate-none`} />;
}
