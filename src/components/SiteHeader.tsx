import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";
import { PrimaryNav } from "@/components/PrimaryNav";
import {
  AccountMenu,
  HeaderAction,
  SignInLink,
  SiteAccountProvider,
} from "@/components/SiteAccount";
import { HEADER_NAV } from "@/lib/nav";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 lg:h-19">
        <Link
          href="/"
          aria-label="TrackMyUSCIS home"
          className={`flex min-h-11 shrink-0 items-center rounded-md ${focusRing}`}
        >
          <Image
            src="/brand/logo-primary.svg"
            alt="TrackMyUSCIS"
            width={1180}
            height={196}
            preload
            className="h-7 w-auto min-[390px]:h-8 lg:h-9"
          />
        </Link>

        <PrimaryNav entries={HEADER_NAV} />

        <SiteAccountProvider>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <SignInLink
              className={`hidden min-h-11 items-center whitespace-nowrap rounded-lg px-3 text-small font-semibold text-midnight transition-colors duration-200 hover:bg-ice lg:inline-flex ${focusRing}`}
            />
            <Link
              href="/search"
              aria-label="Search"
              className={`hidden size-11 items-center justify-center rounded-[10px] text-slate transition-colors duration-200 hover:bg-ice hover:text-midnight sm:inline-flex ${focusRing}`}
            >
              <Search aria-hidden className="size-5" />
            </Link>
            <HeaderAction
              className={`inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-[10px] bg-blue px-3 text-small font-semibold text-white transition-[background-color,scale] duration-200 hover:bg-midnight active:scale-[0.98] sm:px-5 ${focusRing}`}
            />
            <AccountMenu />
            <MobileMenu entries={HEADER_NAV} />
          </div>
        </SiteAccountProvider>
      </div>
    </header>
  );
}
