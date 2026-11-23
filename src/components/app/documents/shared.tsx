"use client";

import { forwardRef } from "react";
import { appField } from "@/lib/ui";

/** A JSON call to our own API: { ok, status, data } and never a throw. */
export async function api<T = Record<string, unknown>>(url: string, init?: { method?: string; body?: unknown }) {
  try {
    const res = await fetch(url, {
      method: init?.method ?? (init?.body ? "POST" : "GET"),
      headers: init?.body ? { "content-type": "application/json" } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string; code?: string };
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "Check your connection and try again." } as T & { error?: string; code?: string } };
  }
}

/** A 6-digit passcode or code field: digits only, big and spaced out. */
export const DigitsField = forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & { value: string; onChange: (v: string) => void }
>(function DigitsField({ value, onChange, className = "", ...rest }, ref) {
  return (
    <input
      ref={ref}
      type="password"
      inputMode="numeric"
      autoComplete="off"
      pattern="\d{6}"
      maxLength={6}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      className={`${appField} text-center font-semibold tracking-[0.5em] tabular-nums ${className}`}
      {...rest}
    />
  );
});

/** "Try again at 4:32 PM" for a lockout end time. */
export function lockedUntilText(iso: string | null | undefined) {
  if (!iso) return "Try again in a few minutes.";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return "Try again in a few minutes.";
  return `Try again at ${t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}.`;
}

/** "You have 3 attempts before a 5-minute lockout." Shown under the passcode field. */
export function lockoutHint(minutes: number) {
  const length = minutes === 60 ? "1-hour" : `${minutes}-minute`;
  return `You have 3 attempts before a ${length} lockout.`;
}
