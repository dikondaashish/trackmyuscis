import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { container, focusRing, h1, lead } from "@/lib/ui";

/**
 * The top of a tool or reference page: the title on the left and the page's own answer
 * (a number, a status card, a tool) on the right, with a strip of key facts underneath.
 * Text pages keep PageIntro; this one makes a page lead with its data.
 */
export function ToolHero({
  back,
  title,
  description,
  meta,
  aside,
  body,
  children,
}: {
  back?: { href: string; label: string };
  title: React.ReactNode;
  description?: string;
  /** One quiet line: when it was checked. */
  meta?: React.ReactNode;
  /** The page's answer, shown beside the title from 1024px and under it on phones. */
  aside?: React.ReactNode;
  /** Sits under the title in the left column (the short answer), so it fills the space beside `aside`. */
  body?: React.ReactNode;
  /** A strip under the title, usually <Stats>. */
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-white">
      <div className={`${container} enter pt-8 pb-10 sm:pt-10 sm:pb-12`}>
        {back && (
          <Link
            href={back.href}
            className={`-ml-1 mb-4 inline-flex min-h-11 items-center gap-1.5 rounded px-1 text-small font-medium text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}
          >
            <ArrowLeft aria-hidden className="size-4" />
            {back.label}
          </Link>
        )}
        <div className={aside ? "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-12" : ""}>
          <div className="min-w-0">
            <h1 className={`max-w-3xl ${h1}`}>{title}</h1>
            {description && <p className={`mt-3 max-w-2xl ${lead}`}>{description}</p>}
            {meta && <div className="mt-4 text-small text-slate">{meta}</div>}
            {body && <div className="mt-6">{body}</div>}
          </div>
          {aside && <div className="enter enter-delay min-w-0">{aside}</div>}
        </div>
        {children && <div className="mt-8 sm:mt-10">{children}</div>}
      </div>
    </section>
  );
}

export type Stat = { label: string; value: string; note?: string; href?: string };

/** Key facts as tiles: two across on phones, up to four on desktop. A tile with `href` is a link. */
export function Stats({ items }: { items: Stat[] }) {
  const tile = "block h-full rounded-xl border border-border bg-cloud p-4 sm:p-5";
  return (
    <dl className={`stagger grid grid-cols-2 gap-3 sm:gap-4 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((s) => {
        const body = (
          <>
            <dt className="text-small text-slate">{s.label}</dt>
            <dd className="mt-1">
              <span className="block text-h3 text-midnight tabular-nums">{s.value}</span>
              {s.note && <span className="mt-1 block text-small text-slate">{s.note}</span>}
            </dd>
          </>
        );
        return s.href ? (
          <Link
            key={s.label}
            href={s.href}
            className={`${tile} transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-blue/50 motion-reduce:hover:translate-y-0 ${focusRing}`}
          >
            {body}
          </Link>
        ) : (
          <div key={s.label} className={tile}>
            {body}
          </div>
        );
      })}
    </dl>
  );
}
