import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { appCard, appPage, appTitle, focusRing } from "@/lib/ui";

/**
 * Reference pages inside the dashboard (statuses, processing times, answers, help): the same
 * content as the public pages, in the app's compact sizes. Narrow column for easy reading.
 */
export function GuidePage({
  title,
  description,
  back,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className={appPage}>
      <div className="max-w-3xl">
      {back && (
        <Link
          href={back.href}
          className={`-ml-1 mb-3 inline-flex min-h-8 items-center gap-1 rounded px-1 text-small font-medium text-slate hover:text-midnight ${focusRing}`}
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          {back.label}
        </Link>
      )}
      <div className="enter">
        <h1 className={appTitle}>{title}</h1>
        {description && <p className="mt-0.5 text-small text-slate">{description}</p>}
      </div>
      <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

/** A compact white list of links, one row each, with an optional line under the title. */
export function GuideLinks({ items, className = "" }: { items: { href: string; title: string; note?: string }[]; className?: string }) {
  return (
    <ul className={`${appCard} divide-y divide-border overflow-hidden ${className}`}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`group flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-200 hover:bg-cloud focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue`}
          >
            <span className="min-w-0">
              <span className="block text-small font-semibold text-midnight group-hover:text-blue">{item.title}</span>
              {item.note && <span className="mt-0.5 block text-caption text-slate">{item.note}</span>}
            </span>
            <ChevronRight
              aria-hidden
              className="size-3.5 shrink-0 text-slate transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const guideSectionTitle = "text-small font-semibold text-midnight";
