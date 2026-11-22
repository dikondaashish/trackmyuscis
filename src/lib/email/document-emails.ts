import { COMPANY } from "@/lib/company";
import { siteUrl } from "@/lib/email/unsubscribe";
import { documentTypeLabel, showDate } from "@/lib/documents/types";

/** Brand colors (see the trackmyuscis-brand skill); emails can't read CSS variables. */
const C = {
  midnight: "#10223D",
  blue: "#285AC7",
  amber: "#A85D11",
  red: "#B42318",
  ice: "#EAF1FC",
  cloud: "#F8FAFC",
  slate: "#516176",
  border: "#DDE6F0",
};

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const FOOTER_LEGAL = `${COMPANY.product} is an independent immigration tracking platform. Not affiliated with USCIS or the U.S. government.`;

/** The shared frame: logo, white card, small print. */
function frame({ title, preheader, body, footer }: { title: string; preheader: string; body: string; footer: string }) {
  const site = siteUrl();
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title></head>
<body style="margin:0;padding:0;background:${C.cloud};font-family:Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${C.midnight};">
<div style="display:none;max-height:0;overflow:hidden;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cloud};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
<tr><td style="padding:0 4px 20px;"><img src="${site}/brand/logo-primary.png" width="168" alt="${COMPANY.product}" style="display:block;height:auto;border:0;"></td></tr>
<tr><td style="background:#FFFFFF;border:1px solid ${C.border};border-radius:12px;padding:28px 24px;">
${body}
</td></tr>
<tr><td style="padding:20px 4px 0;font-size:12px;line-height:18px;color:${C.slate};">
${footer}<br><br>${escape(FOOTER_LEGAL)}
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td style="border-radius:8px;background:${C.blue};">
<a href="${escape(href)}" style="display:inline-block;padding:11px 18px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">${escape(label)}</a>
</td></tr></table>`;

/** The 6-digit code to change a passcode, or to reset a forgotten one (which removes documents). */
export function passcodeCodeEmail(input: { firstName: string | null; code: string; purpose: "change" | "forgot" }) {
  const greeting = input.firstName ? `Hi ${input.firstName},` : "Hi,";
  const forgot = input.purpose === "forgot";
  const subject = forgot ? "Your code to reset your documents passcode" : "Your code to change your documents passcode";
  const action = forgot ? "reset the passcode for your Documents" : "change the passcode for your Documents";
  const warning = forgot
    ? "Resetting your passcode permanently deletes every document you've saved, so nobody who gets into your email can see them."
    : null;

  const text = [
    greeting,
    "",
    `Use this code to ${action}:`,
    "",
    input.code,
    "",
    "It works for 10 minutes.",
    warning ? `\n${warning}` : null,
    "",
    "Didn't ask for this? You can ignore this email. Your passcode stays the same.",
    "",
    "—",
    FOOTER_LEGAL,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const body = `<p style="margin:0 0 12px;font-size:15px;line-height:22px;">${escape(greeting)}</p>
<p style="margin:0 0 16px;font-size:15px;line-height:22px;">Use this code to ${escape(action)}:</p>
<p style="margin:0;padding:16px;background:${C.ice};border-radius:10px;text-align:center;font-size:30px;line-height:36px;font-weight:600;letter-spacing:8px;color:${C.midnight};">${escape(input.code)}</p>
<p style="margin:12px 0 0;font-size:14px;line-height:21px;color:${C.slate};">It works for 10 minutes.</p>
${warning ? `<p style="margin:16px 0 0;font-size:14px;line-height:21px;color:${C.red};">${escape(warning)}</p>` : ""}
<p style="margin:16px 0 0;font-size:14px;line-height:21px;color:${C.slate};">Didn't ask for this? You can ignore this email. Your passcode stays the same.</p>`;

  return {
    subject,
    text,
    html: frame({ title: subject, preheader: `Your code is ${input.code}`, body, footer: "You're getting this because someone asked for a code on your account." }),
  };
}

/** A saved document expires soon, or today. */
export function documentReminderEmail(input: {
  firstName: string | null;
  category: string;
  filename: string;
  expiryDate: string;
  days: number;
}) {
  const site = siteUrl();
  const greeting = input.firstName ? `Hi ${input.firstName},` : "Hi,";
  const type = documentTypeLabel(input.category);
  const when = input.days === 0 ? "today" : `in ${input.days} days`;
  const subject = input.days === 0 ? `Your ${type.toLowerCase()} expires today` : `Your ${type.toLowerCase()} expires ${when}`;
  const date = showDate(input.expiryDate) ?? input.expiryDate;
  const urgent = input.days <= 10;
  const url = `${site}/dashboard/documents`;
  const settings = `${site}/dashboard/settings/preferences`;

  const text = [
    greeting,
    "",
    `Your ${type} (${input.filename}) expires ${when}, on ${date}.`,
    "",
    "If you've already renewed it, upload the new one or update the date so we stop reminding you.",
    "",
    `Open your documents: ${url}`,
    "",
    "—",
    `You're getting this because document reminders are on. Turn them off in Settings: ${settings}`,
    FOOTER_LEGAL,
  ].join("\n");

  const body = `<p style="margin:0 0 12px;font-size:15px;line-height:22px;">${escape(greeting)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ice};border-radius:10px;">
<tr><td style="padding:16px;">
<p style="margin:0;font-size:12px;line-height:16px;color:${C.slate};">${escape(type)}</p>
<p style="margin:2px 0 0;font-size:17px;line-height:24px;font-weight:600;color:${urgent ? C.amber : C.midnight};">Expires ${escape(when)}</p>
<p style="margin:4px 0 0;font-size:13px;line-height:18px;color:${C.slate};">${escape(date)} · ${escape(input.filename)}</p>
</td></tr></table>
<p style="margin:16px 0 0;font-size:14px;line-height:21px;color:${C.slate};">If you've already renewed it, upload the new one or update the date so we stop reminding you.</p>
${button(url, "Open your documents")}`;

  return {
    subject,
    text,
    html: frame({
      title: subject,
      preheader: `${type} expires ${when} (${date})`,
      body,
      footer: `You're getting this because document reminders are on. <a href="${escape(settings)}" style="color:${C.slate};text-decoration:underline;">Turn them off in Settings</a>.`,
    }),
  };
}
