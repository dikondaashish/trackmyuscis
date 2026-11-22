import Image from "next/image";
import Link from "next/link";
import { COPYRIGHT } from "@/lib/company";
import { FOOTER_GROUPS, SHORT_DISCLAIMER } from "@/lib/site";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Five equal columns on desktop (brand + four link groups), 64px top and bottom,
 * then a divider and the bottom row.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-midnight text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-5 md:gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              aria-label="TrackMyUSCIS home"
              className={`inline-flex min-h-11 items-center rounded-md ${focusRing}`}
            >
              <Image src="/brand/logo-dark.svg" alt="TrackMyUSCIS" width={1180} height={196} className="h-8 w-auto" />
            </Link>
            <p className="mt-3 max-w-xs text-small leading-6 text-ice/80">
              Understand your USCIS case in plain English: receipt numbers, case statuses, processing times and legal help.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-4 md:grid-cols-4 md:gap-8 lg:gap-12"
          >
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="text-small font-semibold text-white md:mb-2.5">{group.title}</h2>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className={`inline-flex min-h-11 items-center rounded text-small text-ice/80 transition-colors duration-200 hover:text-white md:min-h-8 ${focusRing}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <p className="shrink-0 text-small text-ice/70">{COPYRIGHT}</p>
          <p className="max-w-2xl text-caption leading-5 text-ice/60 md:text-right">{SHORT_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
