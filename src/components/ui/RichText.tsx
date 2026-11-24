import Link from "next/link";
import { focusRing } from "@/lib/ui";
import { inAppHref } from "@/lib/in-app";

/** [text](href) links, **bold** key terms and bare email addresses, nothing else. */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|\*\*([^*]+)\*\*/g;

const linkClass = `rounded-sm font-medium text-blue underline decoration-blue/30 underline-offset-4 transition-colors duration-200 hover:decoration-blue ${focusRing}`;

/**
 * Renders plain copy with inline links. External links open in a new tab and say so to screen
 * readers. `inApp` keeps links to reference pages inside the dashboard (see lib/in-app).
 */
export function RichText({ text, inApp = false }: { text: string; inApp?: boolean }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(text.slice(last, i));
    const [, label, href, mail, bold] = m;
    if (bold) {
      parts.push(
        <strong key={i} className="font-semibold text-midnight">
          {bold}
        </strong>,
      );
    } else if (mail) {
      parts.push(
        <a key={i} href={`mailto:${mail}`} className={linkClass}>
          {mail}
        </a>,
      );
    } else if (href.startsWith("http")) {
      parts.push(
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>,
      );
    } else {
      parts.push(
        <Link key={i} href={inApp ? inAppHref(href) : href} className={linkClass}>
          {label}
        </Link>,
      );
    }
    last = i + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
