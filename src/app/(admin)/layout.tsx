import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AdminNav, AdminNavView } from "@/components/admin/AdminNav";
import { LayoutDashboard } from "lucide-react";
import { appBtnSecondary, focusRing } from "@/lib/ui";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

/** The admin area: a plain top bar with three sections, then the page on cloud. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-cloud">
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/admin" aria-label="TrackMyUSCIS admin" className={`flex shrink-0 items-center gap-2 rounded-md ${focusRing}`}>
            <Image src="/brand/logo-primary.svg" alt="TrackMyUSCIS" width={1180} height={196} className="h-6 w-auto" priority />
            <span className="rounded-full bg-midnight px-2 py-0.5 text-caption font-semibold text-white">Admin</span>
          </Link>
          <div className="min-w-0 flex-1 overflow-x-auto">
            <Suspense fallback={<AdminNavView pathname="" />}>
              <AdminNav />
            </Suspense>
          </div>
          <span className="hidden shrink-0 sm:block">
            <Link href="/dashboard" className={appBtnSecondary}>
              <LayoutDashboard aria-hidden className="size-4 text-slate" />
              Your dashboard
            </Link>
          </span>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
