import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormMessage } from "@/components/auth/FormMessage";
import { pageMetadata } from "@/lib/seo";
import { verifyUnsubscribe } from "@/lib/email/unsubscribe";
import { btnPrimary, btnSecondary } from "@/lib/ui";

export const metadata = pageMetadata({
  title: "Turn off case emails",
  description: "Stop emails about changes to your saved USCIS cases.",
  path: "/email/unsubscribe",
  noindex: true,
});

type Search = { u?: string; t?: string; done?: string; invalid?: string; error?: string };

/**
 * Opened from "Turn off case emails" in an alert. Asks once (a button, not the link
 * itself, so mail scanners that open links don't unsubscribe anyone), then confirms.
 */
export default function UnsubscribePage({ searchParams }: { searchParams: Promise<Search> }) {
  return (
    <AuthShell title="Case emails" description="Emails about changes to your saved cases.">
      <Suspense fallback={<div className="h-24" />}>
        <Unsubscribe searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

const settings = "/dashboard/settings/preferences";

async function Unsubscribe({ searchParams }: { searchParams: Promise<Search> }) {
  const q = await searchParams;

  if (q.done) {
    return (
      <div className="flex flex-col gap-4">
        <FormMessage tone="success">Case emails are off. We won&apos;t email you about status changes.</FormMessage>
        <p className="text-small text-slate">You can turn them back on any time in Settings, under Preferences.</p>
        <Link href={settings} className={btnSecondary}>
          Open Preferences
        </Link>
      </div>
    );
  }

  const userId = verifyUnsubscribe(q.u ?? null, q.t ?? null);
  if (!userId || q.invalid || q.error) {
    return (
      <div className="flex flex-col gap-4">
        <FormMessage tone="error">
          {q.error ? "We couldn't update your settings. Please try again." : "This link didn't work. It may be incomplete."}
        </FormMessage>
        <p className="text-small text-slate">Sign in to turn off case emails in Settings, under Preferences.</p>
        <Link href={settings} className={btnSecondary}>
          Open Preferences
        </Link>
      </div>
    );
  }

  const action = `/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${encodeURIComponent(q.t ?? "")}`;
  return (
    <form method="post" action={action} className="flex flex-col gap-4">
      <p className="text-body text-midnight">Stop emails when the status of a saved case changes?</p>
      <p className="text-small text-slate">Your cases stay saved, and you can still see every update in your dashboard.</p>
      <button type="submit" className={btnPrimary}>
        Turn off case emails
      </button>
    </form>
  );
}
