"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRACK_CASE_HREF } from "@/lib/site";

/** The header's Track Case button. Hidden on the homepage, where the receipt check sits right below it. */
export function TrackCaseButton({ className }: { className: string }) {
  if (usePathname() === "/") return null;
  return (
    <Link href={TRACK_CASE_HREF} className={className}>
      Track Case
    </Link>
  );
}
