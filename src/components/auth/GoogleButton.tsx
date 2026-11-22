"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth";
import { createGoogleNonce } from "@/lib/google-identity";
import { btnSecondary } from "@/lib/ui";
import { Spinner } from "@/components/ui/Spinner";
import { rememberSignInMethod, useLastSignInMethod } from "@/lib/last-sign-in";
import { LastUsedBadge } from "./LastUsedBadge";

type Props = { clientId: string; next: string; context?: "signin" | "signup"; onError: (message: string) => void };

/**
 * Google sign-in. With a Google client ID it shows Google's own button, which fills in the
 * visitor's Google account ("Continue as Ashish") and signs in in a popup without leaving the
 * page. Without one, or if Google's script can't load, it falls back to the redirect flow.
 */
export function GoogleButton(props: Props) {
  const [failed, setFailed] = useState(false);
  const lastUsed = useLastSignInMethod() === "google" && props.context !== "signup";
  return (
    <div className="relative">
      {!props.clientId || failed ? (
        <GoogleRedirectButton {...props} />
      ) : (
        <GoogleIdentityButton {...props} onLoadFailed={() => setFailed(true)} />
      )}
      {lastUsed && <LastUsedBadge />}
    </div>
  );
}

function GoogleIdentityButton({ clientId, next, context = "signin", onError, onLoadFailed }: Props & { onLoadFailed: () => void }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const initialize = useCallback(async () => {
    const gis = window.google?.accounts.id;
    if (!gis || initialized.current) return;
    initialized.current = true;
    try {
      const { nonce, hashedNonce } = await createGoogleNonce();
      gis.initialize({
        client_id: clientId,
        nonce: hashedNonce,
        ux_mode: "popup",
        use_fedcm_for_button: true,
        button_auto_select: false,
        context,
        callback: async ({ credential }) => {
          setFinishing(true);
          const { error } = await createClient().auth.signInWithIdToken({ provider: "google", token: credential, nonce });
          if (error) {
            onError(authErrorMessage(error));
            setFinishing(false);
            return;
          }
          // Supabase keeps only Google's full name; save the separate first and last names
          // from Google's token so the server can fill an empty profile name with them.
          const names = googleNames(credential);
          if (names) await createClient().auth.updateUser({ data: names });
          rememberSignInMethod("google");
          // The server records consent for a new account, then redirects with the new session cookie.
          formRef.current?.requestSubmit();
        },
      });
      setReady(true);
    } catch {
      onLoadFailed();
    }
  }, [clientId, context, onError, onLoadFailed]);

  // Google's button has a fixed pixel width, so redraw it whenever the card's width changes.
  useEffect(() => {
    const slot = slotRef.current;
    if (!ready || !slot) return;
    let lastWidth = 0;
    const observer = new ResizeObserver(() => {
      const width = Math.min(Math.floor(slot.clientWidth), 400);
      if (!width || width === lastWidth) return;
      lastWidth = width;
      slot.replaceChildren();
      window.google?.accounts.id.renderButton(slot, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width,
      });
    });
    observer.observe(slot);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div className="relative flex min-h-11 w-full items-center justify-center" aria-busy={!ready || finishing}>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => void initialize()} onError={onLoadFailed} />
      <div ref={slotRef} className="flex w-full justify-center" inert={finishing} />
      <form ref={formRef} action={`/auth/google/complete?${new URLSearchParams({ next })}`} method="post" hidden />
      {(!ready || finishing) && (
        <div role="status" className="absolute inset-0 flex items-center justify-center gap-2 rounded-[10px] border border-border bg-white text-small text-slate">
          <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
          {finishing ? "Signing you in…" : "Loading Google sign-in…"}
        </div>
      )}
    </div>
  );
}

/** given_name / family_name from Google's ID token (already verified by Supabase above). */
function googleNames(credential: string): { given_name?: string; family_name?: string } | null {
  try {
    const part = credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), "=")), (c) => c.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    const names: { given_name?: string; family_name?: string } = {};
    if (typeof claims.given_name === "string") names.given_name = claims.given_name;
    if (typeof claims.family_name === "string") names.family_name = claims.family_name;
    return Object.keys(names).length ? names : null;
  } catch {
    return null;
  }
}

/** Fallback: "Continue with Google" that leaves for Google and comes back to /auth/callback. */
function GoogleRedirectButton({ next, onError }: Props) {
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    rememberSignInMethod("google");
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", next);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString() },
    });
    if (error) {
      onError(authErrorMessage(error));
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={signIn} disabled={busy} className={`${btnSecondary} w-full disabled:opacity-60`}>
      <svg aria-hidden viewBox="0 0 24 24" className="size-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
      </svg>
      {busy ? (
            <>
              <Spinner />
              Opening Google…
            </>
          ) : "Continue with Google"}
    </button>
  );
}

/** The "or" rule between Google and the email form. */
export function OrDivider() {
  return (
    <div className="my-4 flex items-center gap-4 text-small text-slate" aria-hidden>
      <span className="h-px flex-1 bg-border" />
      or
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
