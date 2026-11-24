/**
 * Site identity and contact details. Every legal page, the footer and the contact page
 * read from here, so a change is made once.
 *
 * Keep the company low-profile: lead with TrackMyUSCIS everywhere. `legalName` appears only
 * where the law needs the operator named (Terms §1 and Privacy §1), never in UI, schema,
 * metadata, share images or llms.txt.
 */
export const COMPANY = {
  legalName: "Zyene, Inc.",
  incorporation: "Delaware",
  location: "San Francisco, California",
  product: "TrackMyUSCIS",
  domain: "trackmyuscis.com",
  siteUrl: "https://trackmyuscis.com",
  email: {
    support: "support@trackmyuscis.com",
    privacy: "privacy@trackmyuscis.com",
    legal: "legal@trackmyuscis.com",
    security: "security@trackmyuscis.com",
  },
} as const;

/** Date shown as "Last updated" on every legal document. Change it whenever a policy changes. */
export const LEGAL_UPDATED = "November 24, 2026";

export const COPYRIGHT = `© 2026 ${COMPANY.product}`;
