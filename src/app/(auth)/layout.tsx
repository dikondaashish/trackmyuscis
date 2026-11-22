import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BellOff, FileText, ListChecks } from "lucide-react";
import { COPYRIGHT } from "@/lib/company";
import { SHORT_DISCLAIMER } from "@/lib/site";
import { focusRing } from "@/lib/ui";
import { FlowLines } from "@/components/ui/FlowLines";

const whiteRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const POINTS = [
  { icon: ListChecks, title: "Every case in one list", text: "Save up to 10 receipt numbers for you and your family." },
  { icon: FileText, title: "Statuses in plain English", text: "See what each USCIS status means and what usually comes next." },
  { icon: BellOff, title: "Free and private", text: "No ads, and we never sell your data. Remove a case any time." },
];

const LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/help", label: "Help" },
];

/**
 * Sign in, sign up and password pages: no site header or footer, and sized to fit one screen.
 * A midnight brand panel on the left (desktop only) and the form centred on the right, with a
 * way back to the site. On desktop the small print sits in the panel; on phones under the form.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col lg:grid lg:h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[minmax(0,1fr)]">
      <aside className="relative isolate hidden flex-col justify-between gap-6 overflow-y-auto bg-midnight px-12 py-8 text-white lg:flex xl:px-16">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <FlowLines tone="dark" className="absolute inset-x-0 bottom-0 h-[42%] w-full" />
        </div>
        <Link href="/" aria-label="TrackMyUSCIS home" className={`inline-flex min-h-11 items-center self-start rounded-md ${whiteRing}`}>
          <Image src="/brand/logo-dark.svg" alt="TrackMyUSCIS" width={1180} height={196} className="h-9 w-auto" priority />
        </Link>

        <div className="enter max-w-md">
          <h2 className="text-h2">Your USCIS cases, in one place.</h2>
          <p className="mt-3 text-lead text-ice/80">A free account keeps your receipt numbers together, so you don&apos;t have to look them up every time.</p>
          <ul className="stagger mt-8 flex flex-col gap-5" style={{ "--stagger-base": "300ms" } as React.CSSProperties}>
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

        <div className="max-w-md">
          <p className="text-caption text-ice/60">{SHORT_DISCLAIMER}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 text-small text-ice/70">
            <span>{COPYRIGHT}</span>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`inline-flex min-h-11 items-center rounded hover:text-white ${whiteRing}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-cloud lg:overflow-y-auto">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label="TrackMyUSCIS home" className={`flex min-h-11 items-center rounded-md lg:invisible ${focusRing}`}>
            <Image src="/brand/logo-primary.svg" alt="TrackMyUSCIS" width={1180} height={196} className="h-7 w-auto sm:h-8" />
          </Link>
          <Link href="/" className={`inline-flex min-h-11 items-center gap-1.5 rounded-md text-small font-semibold text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}>
            <ArrowLeft aria-hidden className="size-4" />
            Back to site
          </Link>
        </header>

        <main id="main" tabIndex={-1} className="flex flex-1 items-start justify-center px-5 pb-6 pt-2 focus:outline-none sm:items-center sm:px-8 sm:py-3">
          {children}
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-x-5 px-5 pb-2 text-small text-slate lg:hidden">
          <span>{COPYRIGHT}</span>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`inline-flex min-h-11 items-center rounded hover:text-midnight ${focusRing}`}>
              {l.label}
            </Link>
          ))}
        </footer>
      </div>
    </div>
  );
}
