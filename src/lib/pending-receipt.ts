/**
 * A receipt number checked on the public site, carried to the dashboard so the visitor
 * doesn't type it twice. Kept in this browser tab only (sessionStorage): never in a URL,
 * never sent anywhere until they save the case themselves.
 */
const KEY = "tmu:pending-receipt";

export function savePendingReceipt(receipt: string) {
  try {
    sessionStorage.setItem(KEY, receipt);
  } catch {
    // Private windows can refuse storage; the visitor types the number again.
  }
}

/** The waiting number, if any. It stays until clearPendingReceipt, so a re-run effect still finds it. */
export function readPendingReceipt(): string | null {
  try {
    const value = sessionStorage.getItem(KEY);
    return value && /^[A-Z]{3}\d{10}$/.test(value) ? value : null;
  } catch {
    return null;
  }
}

export function clearPendingReceipt() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
