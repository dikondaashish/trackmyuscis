import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { pageMetadata } from "@/lib/seo";
import { focusRing } from "@/lib/ui";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = pageMetadata({
  title: "Reset your password",
  description: "Get a link to choose a new TrackMyUSCIS password.",
  path: "/forgot-password",
  noindex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description={
        <>
          We&apos;ll email you a link.{" "}
          <Link href="/sign-in" className={`rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`}>
            Back to sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
