import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, webPageSchema } from "@/lib/seo";
import { focusRing } from "@/lib/ui";
import { SignInForm } from "./SignInForm";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to TrackMyUSCIS to see the USCIS cases you saved in one place.",
  path: "/sign-in",
  noindex: true,
});

export default function SignInPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Sign in", description: "Sign in to TrackMyUSCIS.", path: "/sign-in" })]} />
      <AuthShell
        title="Sign in"
        description="See the cases you saved, in one place."
        footer={
          <>
            New to TrackMyUSCIS?{" "}
            <Link href="/sign-up" className={`inline-flex min-h-11 items-center rounded font-semibold text-blue ${focusRing}`}>
              Create an account
            </Link>
          </>
        }
      >
        <Suspense>
          <SignInForm />
        </Suspense>
      </AuthShell>
    </>
  );
}
