"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { appBtnPrimary, appCard, appField, appFieldLabel } from "@/lib/ui";

/**
 * The second sign-in step the admin area requires. "setup" adds an authenticator app (scan the
 * QR code once); "code" asks for the current 6-digit code. After it succeeds the session is
 * upgraded and the page reloads into the admin area.
 */
export function AdminMfa({ mode, email }: { mode: "setup" | "code"; email: string }) {
  const router = useRouter();
  const uid = useId();
  const started = useRef(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const mfa = createClient().auth.mfa;
    (async () => {
      const { data: factors, error: listError } = await mfa.listFactors();
      if (listError) return setError("We couldn't load your sign-in settings. Reload the page.");
      if (mode === "code") {
        const factor = factors.totp[0];
        if (!factor) return setError("No authenticator app is set up. Reload the page.");
        return setFactorId(factor.id);
      }
      // Set-up: clear any half-finished attempt, then start a new one.
      for (const f of factors.all) if (f.factor_type === "totp" && f.status === "unverified") await mfa.unenroll({ factorId: f.id });
      const { data, error: enrollError } = await mfa.enroll({ factorType: "totp", friendlyName: `Admin ${new Date().toISOString().slice(0, 10)}` });
      if (enrollError || !data) return setError("We couldn't start the set-up. Reload the page and try again.");
      setFactorId(data.id);
      setQr(data.totp.qr_code);
      setSecret(data.totp.secret);
    })();
  }, [mode]);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await createClient().auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    if (verifyError) {
      setBusy(false);
      return setError("That code didn't work. Check the time on your phone and use the newest code.");
    }
    router.refresh();
  }

  return (
    <div className={`mx-auto mt-8 max-w-md ${appCard} p-6`}>
      <p className="flex items-center gap-2 text-title text-midnight">
        <ShieldCheck aria-hidden className="size-5 text-teal" />
        {mode === "setup" ? "Set up two-step sign-in" : "Enter your code"}
      </p>
      <p className="mt-2 text-small text-slate">
        {mode === "setup"
          ? `The admin area needs a second step. Scan this with an authenticator app (Google Authenticator, 1Password, Authy) on your phone, then enter the 6-digit code it shows. Signed in as ${email}.`
          : `Open your authenticator app and enter the 6-digit code for TrackMyUSCIS. Signed in as ${email}.`}
      </p>
      {mode === "setup" && qr && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <Image src={qr} alt="QR code to add TrackMyUSCIS to an authenticator app" width={176} height={176} unoptimized className="rounded-lg border border-border bg-white p-2" />
          {secret && (
            <p className="text-center text-small text-slate">
              Can&apos;t scan? Enter this key: <code className="font-mono text-midnight break-all">{secret}</code>
            </p>
          )}
        </div>
      )}
      <form onSubmit={verify} className="mt-5 flex flex-col gap-3">
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <label htmlFor={`${uid}-code`} className={appFieldLabel}>
          6-digit code
        </label>
        <input
          id={`${uid}-code`}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          className={`${appField} text-center tracking-[0.3em] tabular-nums`}
        />
        <button type="submit" disabled={busy || code.length !== 6 || !factorId} className={`${appBtnPrimary} disabled:opacity-60`}>
          {busy && <Spinner className="size-3.5" />}
          {mode === "setup" ? "Turn on and continue" : "Continue"}
        </button>
      </form>
    </div>
  );
}
