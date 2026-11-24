/**
 * Facts checked 2026-11-23 against uscis.gov: Form I-90 page and instructions (edition 01/20/25),
 * Replace Your Green Card page, G-1055 fee schedule (edition 11/19/26), Filing Fees page, the
 * 36-month extension alert (Sept. 10, 2024), I-90 PDF-upload filing (Oct. 7, 2026) and the
 * delivery-tracking page. Processing times aren't quoted: the post links to the USCIS tool.
 */
import cover from "@/assets/blog/green-card-renewal-i-90.jpg";
import type { BlogPost } from "../types";

export const greenCardRenewal: BlogPost = {
  slug: "green-card-renewal-i-90",
  title: "Green card renewal in 2026: cost, steps and the 36-month extension",
  seoTitle: "Green Card Renewal 2026: Form I-90 Cost and Steps",
  description:
    "How to renew a 10-year green card with Form I-90 in 2026: who should file, the $415 online fee, each step, and how your receipt notice extends your card 36 months.",
  topic: "Green card",
  published: "2026-11-23",
  updated: "2026-11-23",
  cover: { src: cover, alt: "A blank card inside a circular renewal arrow beside a small calendar tile" },
  answer:
    "To renew a 10-year green card, file Form I-90 when the card has expired or will expire within six months. In 2026 it costs $415 online or $465 on paper. Your I-90 receipt notice, together with the expired card, extends your proof of permanent residence for 36 months while USCIS makes the new card.",
  takeaways: [
    "File when your card expires within six months, or right away if it has already expired.",
    "Conditional residents with a 2-year card don't use I-90. They file Form I-751 or I-829.",
    "The fee is $415 online or $465 on paper, with no separate biometrics fee listed.",
    "The receipt notice plus your expired card proves your status for 36 months, for work and travel.",
    "Renewing doesn't change your permanent resident status; it's only the card that expires.",
  ],
  sections: [
    {
      id: "who-files",
      heading: "Who should file Form I-90",
      blocks: [
        "Form I-90, Application to Replace Permanent Resident Card, is for permanent residents who need a new card. File it if:",
        [
          "Your 10-year card has expired or will expire within the next six months.",
          "Your card was lost, stolen, damaged or destroyed.",
          "Your card has wrong information, or your name or other details have legally changed.",
          "You never received the card USCIS mailed to you.",
          "You got your card before turning 14 and have now turned 14.",
          "You have an older card version, or you're changing between commuter and residence status.",
        ],
        {
          kind: "callout",
          tone: "warning",
          title: "Have a 2-year card? Don't file I-90",
          text: "Conditional residents remove conditions instead: [Form I-751](/forms/i-751) if you got your card through marriage, or Form I-829 as an investor. Filing I-90 by mistake wastes the fee.",
        },
        "Thinking about citizenship? You may already qualify to naturalize. USCIS still expects you to carry a valid green card while an N-400 is pending, so check both before you decide. See [Form N-400](/forms/n-400).",
      ],
    },
    {
      id: "cost",
      heading: "How much it costs",
      blocks: [
        {
          kind: "table",
          caption: "Form I-90 fees (USCIS fee schedule, edition 11/19/26)",
          head: ["Situation", "Online", "Paper"],
          rows: [
            ["Renewal or replacement (most people)", "$415", "$465"],
            ["Turned 14, card expires before your 16th birthday", "$415", "$465"],
            ["Turned 14, card expires after your 16th birthday", "$0", "$0"],
            ["Card never arrived and was returned to USCIS as undeliverable", "$0", "$0"],
            ["Card has a mistake made by the government", "$0", "$0"],
          ],
          note: "The fee schedule lists no separate biometrics fee for Form I-90. Fees aren't refundable. You can ask for a fee waiver with Form I-912 if you qualify.",
        },
        "Filing online is $50 cheaper. On paper you pay by card (Form G-1450) or bank account (Form G-1650); USCIS no longer takes checks or money orders for most forms.",
      ],
    },
    {
      id: "steps",
      heading: "How to renew, step by step",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "File Form I-90",
              text: "Online through a free USCIS online account, which is cheaper and lets you upload documents and read notices, or by mail to the address on the [Form I-90 page](https://www.uscis.gov/i-90).",
            },
            {
              title: "Get your receipt notice",
              text: "USCIS sends an I-797C receipt notice with your 13-character receipt number. Keep it with your old card: together they prove your status. You can check your status online about 72 hours after filing.",
            },
            {
              title: "Go to your biometrics appointment",
              text: "A separate notice gives the date and place at an Application Support Center, where they take your photo, signature and fingerprints. Missing it without rescheduling can lead to a denial. See [biometrics appointments](/answers/uscis-biometrics-appointment).",
            },
            {
              title: "Wait for the decision",
              text: "Most cases don't need an interview, but USCIS can ask you to come to a field office. Check how long it's taking on the [USCIS processing times tool](https://egov.uscis.gov/processing-times/).",
            },
            {
              title: "Receive your new card",
              text: "USCIS mails it to your U.S. address with a USPS tracking number you can see in your account or in Case Status Online.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Moved while waiting?",
          text: "Update your address with USCIS within 10 days so the card reaches you. See [how to change your address with USCIS](/answers/how-to-change-address-with-uscis).",
        },
      ],
    },
    {
      id: "extension",
      heading: "Your receipt notice extends your card 36 months",
      blocks: [
        "Since September 10, 2024, the I-90 receipt notice extends a green card for **36 months** from the expiration date printed on the card. Before that it was 24 months.",
        "Carry the receipt notice together with your expired card. With both, you can show an employer you're authorized to work, and travel abroad and come back.",
        {
          kind: "callout",
          tone: "info",
          title: "Filed before September 10, 2024?",
          text: "USCIS mailed amended receipt notices showing the 36-month extension to people whose I-90 was already pending.",
        },
      ],
    },
    {
      id: "travel",
      heading: "Travelling while your I-90 is pending",
      blocks: [
        "The expired card plus the receipt notice is accepted as proof of status for travel and coming back into the U.S. USCIS still suggests getting your new card before a long trip if you can.",
        "If you don't have your card at all, or both the card and the extension have run out, call the [USCIS Contact Center](https://www.uscis.gov/contactcenter) to ask for an appointment at a field office. An officer can place a temporary stamp (often called an ADIT stamp) in your unexpired passport or on Form I-94.",
        "If your card will expire within six months while you're abroad, and you'll be back within a year and before it expires, file as soon as you return.",
      ],
    },
    {
      id: "not-received",
      heading: "If your new card never arrives",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Track the delivery", text: "Find the USPS tracking number in your USCIS account or Case Status Online. USPS Informed Delivery also shows mail before it arrives." },
            { title: "If USPS says delivered", text: "Ask your post office first. The card may be at the wrong address or held." },
            {
              title: "If it went back to USCIS",
              text: "Contact the USCIS Contact Center or use e-Request to report that you didn't receive the card. If USCIS confirms it was returned as undeliverable, the new I-90 is free.",
            },
            { title: "If it was delivered and lost", text: "File a new I-90 for a lost card and pay the regular fee." },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "How much does it cost to renew a green card in 2026?",
      a: "$415 if you file Form I-90 online, or $465 on paper. The fee schedule lists no separate biometrics fee.",
    },
    {
      q: "When should I renew my green card?",
      a: "Within six months before it expires, or right away if it has already expired.",
    },
    {
      q: "Can I work and travel with an expired green card?",
      a: "Yes, if you have filed Form I-90. The receipt notice extends your card for 36 months from its expiration date; carry both together.",
    },
    {
      q: "Do I lose my permanent resident status if my card expires?",
      a: "No. Your status doesn't expire with the card, but you're required to carry valid proof of it, so renew promptly.",
    },
    {
      q: "Should a conditional resident file Form I-90?",
      a: "No. Holders of a 2-year card remove conditions with Form I-751 (through marriage) or Form I-829 (investors).",
    },
  ],
  sources: [
    { label: "USCIS: Form I-90", href: "https://www.uscis.gov/i-90" },
    { label: "USCIS: Replace your green card", href: "https://www.uscis.gov/green-card/after-we-grant-your-green-card/replace-your-green-card" },
    { label: "USCIS: Fee schedule (Form G-1055)", href: "https://www.uscis.gov/g-1055" },
    {
      label: "USCIS: Green card validity extension to 36 months",
      href: "https://www.uscis.gov/newsroom/alerts/uscis-extends-green-card-validity-extension-to-36-months-for-green-card-renewals",
    },
    {
      label: "USCIS: Tracking delivery of your card",
      href: "https://www.uscis.gov/forms/filing-guidance/how-to-track-delivery-of-your-notice-or-secure-identity-document-or-card",
    },
    { label: "USCIS: Filing fees", href: "https://www.uscis.gov/forms/filing-fees" },
  ],
  links: [
    { href: "/forms/i-90", label: "Form I-90: replace or renew a green card" },
    { href: "/forms/i-751", label: "Form I-751: remove conditions on residence" },
    { href: "/answers/uscis-biometrics-appointment", label: "What happens at a biometrics appointment" },
    { href: "/answers/how-to-change-address-with-uscis", label: "How to change your address with USCIS" },
  ],
};
