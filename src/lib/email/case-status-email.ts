import { COMPANY } from "@/lib/company";
import { siteUrl } from "@/lib/email/unsubscribe";

/** Brand colors (see the trackmyuscis-brand skill); emails can't read CSS variables. */
const C = {
  midnight: "#10223D",
  blue: "#285AC7",
  teal: "#087F79",
  ice: "#EAF1FC",
  cloud: "#F8FAFC",
  slate: "#516176",
  border: "#DDE6F0",
};

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** IOE0912345678 → IOE•••••5678, so a forwarded email doesn't expose the whole number. */
export const maskReceipt = (r: string) => `${r.slice(0, 3)}•••••${r.slice(-4)}`;

export type CaseStatusEmailInput = {
  firstName: string | null;
  caseTitle: string;
  caseId: string;
  receiptNumber: string;
  previousStatus: string | null;
  status: string;
  description: string | null;
  unsubscribeUrl: string | null;
};

export function caseStatusEmail(input: CaseStatusEmailInput) {
  const site = siteUrl();
  const caseUrl = `${site}/dashboard/cases/${input.caseId}`;
  const greeting = input.firstName ? `Hi ${input.firstName},` : "Hi,";
  const receipt = maskReceipt(input.receiptNumber);
  const subject = `New status for your ${input.caseTitle}`;
  const description = input.description?.trim() || null;

  const text = [
    greeting,
    "",
    `USCIS updated your case "${input.caseTitle}" (${receipt}).`,
    "",
    input.previousStatus ? `Before: ${input.previousStatus}` : null,
    `Now: ${input.status}`,
    description ? `\n${description}` : null,
    "",
    `See your case: ${caseUrl}`,
    "",
    "—",
    "You're getting this because case emails are on for your TrackMyUSCIS account.",
    input.unsubscribeUrl ? `Turn off case emails: ${input.unsubscribeUrl}` : `Turn them off in Settings: ${site}/dashboard/settings/preferences`,
    "TrackMyUSCIS is an independent immigration tracking platform. Not affiliated with USCIS or the U.S. government.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const off = input.unsubscribeUrl ?? `${site}/dashboard/settings/preferences`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.cloud};font-family:Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${C.midnight};">
<div style="display:none;max-height:0;overflow:hidden;">Now: ${escape(input.status)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cloud};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
<tr><td style="padding:0 4px 20px;"><img src="${site}/brand/logo-primary.png" width="168" alt="TrackMyUSCIS" style="display:block;height:auto;border:0;"></td></tr>
<tr><td style="background:#FFFFFF;border:1px solid ${C.border};border-radius:12px;padding:28px 24px;">
<p style="margin:0 0 12px;font-size:15px;line-height:22px;">${escape(greeting)}</p>
<p style="margin:0 0 20px;font-size:15px;line-height:22px;">USCIS updated your case <strong>${escape(input.caseTitle)}</strong> <span style="color:${C.slate};white-space:nowrap;">(${escape(receipt)})</span>.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ice};border-radius:10px;">
<tr><td style="padding:16px;">
${input.previousStatus ? `<p style="margin:0 0 8px;font-size:13px;line-height:18px;color:${C.slate};">Before: ${escape(input.previousStatus)}</p>` : ""}
<p style="margin:0;font-size:12px;line-height:16px;color:${C.slate};">Now</p>
<p style="margin:2px 0 0;font-size:17px;line-height:24px;font-weight:600;color:${C.midnight};">${escape(input.status)}</p>
</td></tr></table>
${description ? `<p style="margin:16px 0 0;font-size:14px;line-height:21px;color:${C.slate};">${escape(description)}</p>` : ""}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td style="border-radius:8px;background:${C.blue};">
<a href="${escape(caseUrl)}" style="display:inline-block;padding:11px 18px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">See your case</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:20px 4px 0;font-size:12px;line-height:18px;color:${C.slate};">
You're getting this because case emails are on for your ${COMPANY.product} account. <a href="${escape(off)}" style="color:${C.slate};text-decoration:underline;">Turn off case emails</a>.<br><br>
${COMPANY.product} is an independent immigration tracking platform. Not affiliated with USCIS or the U.S. government.
</td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject, html, text };
}
