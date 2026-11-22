import { Suspense } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getAccount } from "@/lib/account";
import { COMPANY } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";
import { btnSecondary, card, focusRing } from "@/lib/ui";
import { SettingsSkeleton } from "@/components/app/Skeletons";

export const metadata = pageMetadata({
  title: "Account settings",
  description: "Sign-in and account settings for TrackMyUSCIS.",
  path: "/dashboard/settings/account",
  noindex: true,
});

const panel = `${card} p-5 sm:p-6`;
const inline = `rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`;

export default function AccountPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <AccountSettings />
    </Suspense>
  );
}

async function AccountSettings() {
  const account = await getAccount("/dashboard/settings/account");
  return (
    <div className="stagger flex flex-col gap-4 lg:gap-6">
      <section aria-labelledby="signin-title" className={panel}>
        <h2 id="signin-title" className="text-title text-midnight">
          Sign-in
        </h2>
        <dl className="mt-4 flex flex-col gap-4 text-small">
          <div>
            <dt className="text-slate">Email</dt>
            <dd className="mt-0.5 font-medium break-all text-midnight">{account.email}</dd>
          </div>
          <div>
            <dt className="text-slate">Signs in with</dt>
            <dd className="mt-0.5 font-medium text-midnight">{account.google ? "Google" : "Email and password"}</dd>
          </div>
        </dl>
        {!account.google && (
          <p className="mt-4 text-small text-slate">
            To change your password, use{" "}
            <Link href="/forgot-password" className={inline}>
              Forgot password
            </Link>{" "}
            after signing out.
          </p>
        )}
        <form action="/auth/sign-out" method="post" className="mt-5">
          <button type="submit" className={btnSecondary}>
            <LogOut aria-hidden className="size-4" />
            Sign out
          </button>
        </form>
      </section>

      <section aria-labelledby="delete-title" className={panel}>
        <h2 id="delete-title" className="text-title text-midnight">
          Delete account
        </h2>
        <p className="mt-1 max-w-prose text-small text-slate">
          Email{" "}
          <a href={`mailto:${COMPANY.email.privacy}?subject=Delete%20my%20account`} className={inline}>
            {COMPANY.email.privacy}
          </a>{" "}
          from <span className="font-medium text-midnight">{account.email}</span> and we&apos;ll delete your account and saved cases, as described in
          our{" "}
          <Link href="/privacy" className={inline}>
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
