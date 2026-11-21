import { AuthShell } from "@/components/auth/AuthShell";
import { pageMetadata } from "@/lib/seo";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = pageMetadata({
  title: "Choose a new password",
  description: "Choose a new TrackMyUSCIS password.",
  path: "/auth/reset-password",
  noindex: true,
});

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Choose a new password" description="Pick something you don't use on other sites.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
