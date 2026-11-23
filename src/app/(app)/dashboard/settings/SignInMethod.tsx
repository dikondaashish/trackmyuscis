import { Check, Mail } from "lucide-react";
import { GoogleLogo } from "@/components/ui/GoogleLogo";

/** How this account signs in: the Google "G" (or a mail icon), a Connected badge and the email. */
export function SignInMethod({
  google,
  email,
}: {
  google: boolean;
  email: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-cloud p-3">
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-[0_4px_12px_-6px_rgba(16,34,61,0.35)]">
        {google ? (
          <GoogleLogo className="size-5" />
        ) : (
          <Mail aria-hidden className="size-5 text-blue" />
        )}
        <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-teal text-white ring-2 ring-cloud">
          <Check aria-hidden className="size-2.5" strokeWidth={3} />
        </span>
      </span>
      <dl className="min-w-0 flex-1">
        <dt className="sr-only">Signs in with</dt>
        <dd className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-small font-semibold text-midnight">
            {google ? "Google" : "Email"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-caption font-medium text-teal">
            <span aria-hidden className="size-1.5 rounded-full bg-teal" />
            Connected
          </span>
        </dd>
        <dt className="sr-only">Email</dt>
        <dd className="text-small break-all text-slate">{email}</dd>
      </dl>
    </div>
  );
}
