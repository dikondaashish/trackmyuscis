import { Suspense } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getAccount } from "@/lib/account";
import { COMPANY } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";
import { appBtnSecondary, appPanel, appSectionTitle, focusRing } from "@/lib/ui";
import { SettingsSkeleton } from "@/components/app/Skeletons";
import { createClient } from "@/lib/supabase/server";
import { PasswordSettings } from "../PasswordSettings";
import { SignInMethod } from "../SignInMethod";

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
  const { data: hasPassword } = await (await createClient()).rpc("account_has_password");
  return (
    <div className="stagger flex flex-col gap-4">
      <section aria-labelledby="signin-title" className={panel}>
        <h2 id="signin-title" className={appSectionTitle}>
          Sign-in
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <SignInMethod google={account.google} email={account.email} />
          <PasswordSettings email={account.email} hasPassword={hasPassword === true} />
        </div>
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
