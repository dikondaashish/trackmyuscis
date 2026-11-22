import { Suspense } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getAccount } from "@/lib/account";
import { COMPANY } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";
import { appBtnSecondary, appPanel, appSectionTitle, focusRing } from "@/lib/ui";
import { SettingsSkeleton } from "@/components/app/Skeletons";

export const metadata = pageMetadata({
  title: "Account settings",
  description: "Sign-in and account settings for TrackMyUSCIS.",
  path: "/dashboard/settings/account",
  noindex: true,
});

const panel = appPanel;
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
    <div className="stagger flex flex-col gap-4">
      <section aria-labelledby="signin-title" className={panel}>
        <h2 id="signin-title" className={appSectionTitle}>
          Sign-in
        </h2>
        <dl className="mt-3 flex flex-col gap-3 text-small">
          <div>
            <dt className="text-caption text-slate">Email</dt>
            <dd className="font-medium break-all text-midnight">{account.email}</dd>
          </div>
          <div>
            <dt className="text-caption text-slate">Signs in with</dt>
            <dd className="font-medium text-midnight">{account.google ? "Google" : "Email and password"}</dd>
          </div>
        </dl>
        {!account.google && (
          <p className="mt-3 text-small text-slate">
            To change your password, use{" "}
            <Link href="/forgot-password" className={inline}>
              Forgot password
            </Link>{" "}
            after signing out.
          </p>
        )}
        <form action="/auth/sign-out" method="post" className="mt-4">
          <button type="submit" className={appBtnSecondary}>
            <LogOut aria-hidden className="size-3.5" />
            Sign out
          </button>
        </form>
      </section>

      <section aria-labelledby="delete-title" className={panel}>
        <h2 id="delete-title" className={appSectionTitle}>
          Delete account
        </h2>
        <p className="mt-0.5 max-w-prose text-small text-slate">
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
