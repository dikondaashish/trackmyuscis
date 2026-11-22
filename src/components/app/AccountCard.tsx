import { LogOut } from "lucide-react";
import type { Account } from "@/lib/account";
import { focusRing } from "@/lib/ui";

export function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-ice font-semibold text-blue ${
        size === "sm" ? "size-8 text-caption" : "size-9 text-small"
      }`}
    >
      {initials}
    </span>
  );
}

/** Who is signed in, with a sign-out button. Bottom of the sidebar and of the phone menu. */
export function AccountCard({ account }: { account: Account }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={account.initials} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-small font-semibold text-midnight">{account.name ?? "Your account"}</div>
        <div className="truncate text-caption text-slate">{account.email}</div>
      </div>
      <form action="/auth/sign-out" method="post">
        <button
          type="submit"
          aria-label="Sign out"
          title="Sign out"
          className={`flex size-11 cursor-pointer items-center justify-center rounded-[10px] text-slate transition-colors duration-200 hover:bg-cloud hover:text-midnight ${focusRing}`}
        >
          <LogOut aria-hidden className="size-4" />
        </button>
      </form>
    </div>
  );
}

export function AccountCardSkeleton() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="skeleton size-9 rounded-full" />
      <div className="flex-1">
        <div className="skeleton h-3.5 w-24" />
        <div className="skeleton mt-1.5 h-3 w-32" />
      </div>
    </div>
  );
}
