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
      description="Enter your email and we'll send you a link to choose a new password."
      footer={
        <Link href="/sign-in" className={`inline-flex min-h-11 items-center rounded font-semibold text-blue ${focusRing}`}>
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
