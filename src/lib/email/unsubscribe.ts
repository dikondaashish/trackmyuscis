import { createHmac, timingSafeEqual } from "node:crypto";
import { COMPANY } from "@/lib/company";

/**
 * Signed links that turn off case emails without signing in. The link holds the account's
 * random ID and an HMAC of it (EMAIL_LINK_SECRET), never an email address.
 */
function sign(userId: string) {
  const secret = process.env.EMAIL_LINK_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(`unsubscribe:case-email:${userId}`).digest("base64url");
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || COMPANY.siteUrl).replace(/\/$/, "");
}

/** The page a person opens from the email ("Turn off case emails"), which asks once. */
export function unsubscribeUrl(userId: string) {
  const token = sign(userId);
  if (!token) return null;
  return `${siteUrl()}/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${token}`;
}

/** The one-click address mail apps POST to (List-Unsubscribe), and the page's form target. */
export function oneClickUnsubscribeUrl(userId: string) {
  const token = sign(userId);
  if (!token) return null;
  return `${siteUrl()}/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${token}`;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The account ID when the link is genuine, otherwise null. */
export function verifyUnsubscribe(userId: string | null, token: string | null): string | null {
  if (!userId || !token || !UUID.test(userId)) return null;
  const expected = sign(userId);
  if (!expected) return null;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? userId : null;
}
