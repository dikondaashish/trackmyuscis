"use client";

import { useSyncExternalStore } from "react";

/**
 * Remembers on this device whether the person last signed in with Google or with email,
 * so the sign-in page can mark that option "Last used". Stores only "google" or "email",
 * never the address. Disclosed in the Cookie Policy (§3).
 */
export type SignInMethod = "google" | "email";

const KEY = "tmu:last-sign-in";
const listeners = new Set<() => void>();

function read(): SignInMethod | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "google" || value === "email" ? value : null;
  } catch {
    return null;
  }
}

export function rememberSignInMethod(method: SignInMethod) {
  try {
    window.localStorage.setItem(KEY, method);
  } catch {
    // Storage blocked (private mode, settings): the hint just won't show.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The method used last on this device, or null (always null on the server). */
export function useLastSignInMethod(): SignInMethod | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
