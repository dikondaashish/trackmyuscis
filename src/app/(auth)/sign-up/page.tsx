import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, webPageSchema } from "@/lib/seo";
import { focusRing } from "@/lib/ui";
import { SignUpForm } from "./SignUpForm";

export const metadata = pageMetadata({
  title: "Create an account",
  description: "Create a free TrackMyUSCIS account to save your USCIS receipt numbers and see them in one place.",
  path: "/sign-up",
  noindex: true,
});

export default function SignUpPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Create an account", description: "Create a TrackMyUSCIS account.", path: "/sign-up" })]} />
      <AuthShell
        title="Create your account"
        description="Free. Save your receipt numbers and see every case in one place."
        footer={
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className={`inline-flex min-h-11 items-center rounded font-semibold text-blue ${focusRing}`}>
              Sign in
            </Link>
          </>
        }
      >
        <SignUpForm />
      </AuthShell>
    </>
  );
}
