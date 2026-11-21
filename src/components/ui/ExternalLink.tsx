import { ArrowUpRight } from "lucide-react";
import { btnPrimary, btnSecondary } from "@/lib/ui";

/** A button-styled link to an official site, opening in a new tab. */
export function ExternalLink({
  href,
  children,
  primary = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${primary ? btnPrimary : btnSecondary} ${className}`}
    >
      {children}
      <ArrowUpRight aria-hidden className="size-4" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
