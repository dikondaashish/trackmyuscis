"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, CircleHelp, LogOut, Settings, ShieldCheck } from "lucide-react";
import type { Account } from "@/lib/account";
import { focusRing } from "@/lib/ui";

export function Avatar({
  initials,
  photoUrl = null,
  premium = false,
  size = "md",
}: {
  initials: string;
  photoUrl?: string | null;
  premium?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [broken, setBroken] = useState(false);
  const px = size === "sm" ? 28 : size === "lg" ? 48 : 32;
  const box = size === "sm" ? "size-7 text-caption" : size === "lg" ? "size-12 text-body" : "size-8 text-caption";
  return (
    <span aria-hidden className="relative shrink-0">
      {photoUrl && !broken ? (
        <Image
          src={photoUrl}
          alt=""
          width={px}
          height={px}
          sizes={`${px}px`}
          onError={() => setBroken(true)}
          className={`rounded-full border border-blue/20 bg-ice object-cover ${box}`}
        />
      ) : (
        <span
          className={`flex items-center justify-center rounded-full border border-blue/20 bg-ice font-semibold text-blue ${box}`}
        >
          {initials}
        </span>
      )}
      {premium && (
        <span className="absolute -right-1 -bottom-1.5 rounded-md border-2 border-white bg-blue px-1 text-caption leading-4 font-semibold text-white">
          Pro
        </span>
      )}
    </span>
  );
}

const PLAN_LABEL = { free: "Free plan", premium: "Premium member" } as const;

const menuItem = `flex h-9 w-full cursor-pointer items-center gap-2.5 px-3 text-small text-midnight transition-colors duration-200 hover:bg-cloud ${focusRing}`;

/**
 * Who is signed in, at the bottom of the sidebar and of the phone menu. Opens a menu
 * upward with the name, email, Settings, Help & Support, Your Privacy Choices and Sign out.
 */
export function AccountCard({ account, onNavigate }: { account: Account; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const premium = account.plan === "premium";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        id={menuId}
        hidden={!open}
        className="menu-up absolute inset-x-0 bottom-full z-50 mb-1.5 overflow-hidden rounded-xl border border-border bg-white py-1.5 shadow-[0_12px_32px_-12px_rgb(16_34_61/0.25)]"
      >
        <div className="border-b border-border px-3 pt-1.5 pb-2.5">
          <p className="truncate text-small font-semibold text-midnight">{account.name ?? "Your account"}</p>
          {account.username && <p className="truncate text-caption font-medium text-blue">u/{account.username}</p>}
          <p className="truncate text-caption text-slate">{account.email}</p>
        </div>
        <ul className="py-1">
          <li>
            <Link href="/dashboard/settings" onClick={close} className={menuItem}>
              <Settings aria-hidden className="size-4 text-slate" />
              Settings
            </Link>
          </li>
          <li>
            <Link href="/help" onClick={close} className={menuItem}>
              <CircleHelp aria-hidden className="size-4 text-slate" />
              Help &amp; Support
            </Link>
          </li>
          <li>
            <Link href="/privacy-choices" onClick={close} className={menuItem}>
              <ShieldCheck aria-hidden className="size-4 text-slate" />
              Your Privacy Choices
            </Link>
          </li>
        </ul>
        <form action="/auth/sign-out" method="post" className="border-t border-border pt-1">
          <button type="submit" className={`${menuItem} text-red hover:bg-red/5`}>
            <LogOut aria-hidden className="size-4" />
            Sign out
          </button>
        </form>
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${account.name ?? account.email}`}
        className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors duration-200 hover:bg-cloud ${
          open ? "bg-cloud" : ""
        } ${focusRing}`}
      >
        <Avatar initials={account.initials} photoUrl={account.photoUrl} premium={premium} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-small font-medium text-midnight">{account.email}</span>
          <span className={`block truncate text-caption ${premium ? "font-semibold text-blue" : "text-slate"}`}>
            {PLAN_LABEL[account.plan]}
          </span>
        </span>
        <ChevronUp
          aria-hidden
          className={`size-4 shrink-0 text-slate transition-[rotate] duration-200 ${open ? "" : "rotate-180"}`}
        />
      </button>
    </div>
  );
}

export function AccountCardSkeleton() {
  return (
    <div className="flex items-center gap-2.5 px-2 py-1.5" aria-hidden>
      <span className="skeleton size-8 rounded-full" />
      <div className="flex-1">
        <div className="skeleton h-3.5 w-32" />
        <div className="skeleton mt-1.5 h-3 w-16" />
      </div>
    </div>
  );
}
