import nodemailer from "nodemailer";

/**
 * Transactional email over SMTP (for example a mailbox on our own domain).
 * Off until SMTP_HOST, SMTP_USER, SMTP_PASS and EMAIL_FROM are set. Server only.
 */
function transport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass || !process.env.EMAIL_FROM) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export const emailEnabled = () => transport() !== null;

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** One-click unsubscribe (RFC 8058), shown by Gmail and Apple Mail next to the sender. */
  unsubscribeUrl?: string;
};

export async function sendEmail(message: OutgoingEmail) {
  const t = transport();
  if (!t) throw new Error("Email is not configured");
  await t.sendMail({
    from: process.env.EMAIL_FROM,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    headers: message.unsubscribeUrl
      ? { "List-Unsubscribe": `<${message.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
      : undefined,
  });
}
