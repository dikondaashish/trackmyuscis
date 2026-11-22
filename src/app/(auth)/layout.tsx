import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BellOff, FileText, ListChecks } from "lucide-react";
import { COPYRIGHT } from "@/lib/company";
import { DISCLAIMER } from "@/lib/site";
import { focusRing } from "@/lib/ui";

const whiteRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const POINTS = [
  { icon: ListChecks, title: "Every case in one list", text: "Save up to 10 receipt numbers for you and your family." },
  { icon: FileText, title: "Statuses in plain English", text: "See what each USCIS status means and what usually comes next." },
  { icon: BellOff, title: "Free and private", text: "No ads, and we never sell your data. Remove a case any time." },
];

/**
 * Sign in, sign up and password pages: no site header or footer. A midnight brand panel on
 * the left (desktop only) and the form centred on the right, with a way back to the site.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden flex-col justify-between gap-12 bg-midnight p-12 text-white lg:flex xl:p-16">
        <Link href="/" aria-label="TrackMyUSCIS home" className={`inline-flex min-h-11 items-center self-start rounded-md ${whiteRing}`}>
          <Image src="/brand/logo-dark.svg" alt="TrackMyUSCIS" width={1180} height={196} className="h-9 w-auto" priority />
        </Link>

        <div className="max-w-md">
          <h2 className="text-h2">Your USCIS cases, in one place.</h2>
          <p className="mt-4 text-lead text-ice/80">A free account keeps your receipt numbers together, so you don&apos;t have to look them up every time.</p>
          <ul className="mt-10 flex flex-col gap-6">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon aria-hidden className="size-5 text-ice" />
                </span>
                <span>
                  <span className="block text-title">{title}</span>
                  <span className="mt-1 block text-small text-ice/80">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="max-w-md text-caption text-ice/60">{DISCLAIMER}</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-cloud">
        <header className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8 lg:h-19">
          <Link href="/" aria-label="TrackMyUSCIS home" className={`flex min-h-11 items-center rounded-md lg:invisible ${focusRing}`}>
            <Image src="/brand/logo-primary.svg" alt="TrackMyUSCIS" width={1180} height={196} className="h-7 w-auto sm:h-8" priority />
          </Link>
          <Link href="/" className={`inline-flex min-h-11 items-center gap-1.5 rounded-md text-small font-semibold text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}>
            <ArrowLeft aria-hidden className="size-4" />
            Back to site
          </Link>
        </header>

        <main id="main" tabIndex={-1} className="flex flex-1 items-start justify-center px-5 py-8 focus:outline-none sm:items-center sm:px-8 sm:py-12">
          {children}
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-x-6 px-5 pb-6 text-small text-slate sm:px-8">
          <span>{COPYRIGHT}</span>
          {[
            { href: "/terms", label: "Terms" },
            { href: "/privacy", label: "Privacy" },
            { href: "/help", label: "Help" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className={`inline-flex min-h-11 items-center rounded hover:text-midnight ${focusRing}`}>
              {l.label}
            </Link>
          ))}
        </footer>
      </div>
    </div>
  );
}
