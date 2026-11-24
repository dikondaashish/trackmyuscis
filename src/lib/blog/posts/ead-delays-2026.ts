/**
 * Facts checked 2026-11-24: USCIS I-765 page, processing times tool ((c)(3) 6 months, (c)(26) 18.5
 * months), premium processing page, archived automatic-extension page (see opt-sources.ts).
 */
import cover from "@/assets/blog/ead-delays-2026.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const eadDelays2026: BlogPost = {
  slug: "ead-delays-2026",
  title: "EAD taking too long? What you can do about a delayed work permit in 2026",
  seoTitle: "EAD Pending Too Long? What to Do in 2026",
  description:
    "If your work permit (EAD) is pending past USCIS's processing time or your card hasn't arrived, here's how to check, when to ask USCIS, and how to avoid a gap.",
  topic: "Students & OPT",
  published: "2026-11-13",
  author: "karthik",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A woman at a home desk looks at a stalled case timeline on her laptop, with a phone showing a message icon beside her",
  },
  answer:
    "First compare your wait with USCIS's official processing time for your exact category, because it varies a lot: 6 months for OPT and 18.5 months for standalone H-4 EADs (checked November 24, 2026). If your case is past that time, submit an online case inquiry. If USCIS approved it but the card hasn't come, allow 30 days from approval, then use e-Request. For OPT and STEM OPT, premium processing is the fastest way out.",
  takeaways: [
    "Check the processing time for your category, not the I-765 in general. They range from months to well over a year.",
    "You can ask USCIS about a case once it's outside the posted processing time.",
    "After approval, USCIS says the card is usually produced within two weeks. Allow 30 days from approval before asking about it.",
    "Renewals filed on or after October 30, 2025 get no automatic extension, so file as early as you're allowed.",
    "OPT and STEM OPT can add premium processing ($1,780) to a pending case. Other work permits can't.",
  ],
  sections: [
    {
      id: "is-it-delayed",
      heading: "Is your EAD actually delayed?",
      blocks: [
        "USCIS publishes a separate processing time for each work permit category. Find your category on your receipt notice (for example (c)(3)(B) for OPT, (c)(26) for H-4, (c)(9) for a pending green card), then look it up in the [official tool](https://egov.uscis.gov/processing-times/).",
        {
          kind: "table",
          caption: "Two examples from USCIS's processing times tool",
          head: ["Category", "Who it's for", "80% of cases finished within"],
          rows: [
            ["(c)(3)", "F-1 students: OPT and STEM OPT", "6 months"],
            ["(c)(26), standalone", "H-4 spouses of H-1B workers", "18.5 months"],
          ],
          note: "Service Center Operations, checked November 24, 2026. Times change, so check yours on the day you look.",
        },
        "Because these numbers show how long 80% of cases took, being a few weeks past them isn't unusual. But once you're outside the posted time, USCIS lets you ask about your case.",
      ],
    },
    {
      id: "what-to-do",
      heading: "What to do, step by step",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Check your status online",
              text: "Use your receipt number in Case Status Online or your USCIS account. A request for evidence you missed is a common cause of a stall. See [how to check your case status](/answers/how-to-check-uscis-case-status).",
            },
            {
              title: "If you're past the processing time, submit an inquiry",
              text: "Use USCIS's e-Request tools to report a case outside normal processing times. See [what to do about a delayed case](/answers/contact-uscis-about-delayed-case).",
            },
            {
              title: "If it's approved but no card arrived",
              text: "USCIS says the card is usually produced within two weeks of approval and mailed by USPS. Case Status Online shows the tracking number. After 30 days from approval, use e-Request to report a card that didn't arrive.",
            },
            {
              title: "If you moved",
              text: "Update your address with USCIS and USPS right away. USCIS warns a wrong address can delay or lose your card. See [how to change your address with USCIS](/answers/how-to-change-address-with-uscis).",
            },
          ],
        },
      ],
    },
    {
      id: "speed-up",
      heading: "Can you speed it up?",
      blocks: [
        [
          "**OPT and STEM OPT:** yes. Add premium processing with Form I-907 for $1,780 and USCIS must take action within 30 business days. See [OPT premium processing](/blog/opt-premium-processing-2026).",
          "**Other categories:** premium processing isn't offered. Your options are the case inquiry once you're past the posted time, and filing renewals early.",
        ],
      ],
    },
    {
      id: "avoid-gap",
      heading: "Avoid a gap when you renew",
      blocks: [
        {
          kind: "callout",
          tone: "warning",
          title: "No more automatic extensions for new renewals",
          text: "If you file a renewal on or after October 30, 2025, your current card is no longer automatically extended while you wait. Renewals filed before that date keep the automatic extension they had.",
        },
        [
          "**File at the earliest allowed date.** For an H-4 EAD renewal that's 180 days before your current card expires. For STEM OPT it's 90 days before your OPT ends. Check the form instructions for your category.",
          "**STEM OPT is different:** a timely STEM OPT extension still gives you up to 180 days of work authorization while it's pending. See [the STEM OPT 180-day rule](/blog/stem-opt-extension-2026).",
          "**Tell your employer early** if your renewal may not arrive in time, so you can plan together.",
        ],
      ],
    },
  ],
  faq: [
    {
      q: "How long does an EAD take in 2026?",
      a: "It depends on the category. USCIS shows 6 months for OPT and STEM OPT, and 18.5 months for standalone H-4 EADs, as of November 24, 2026.",
    },
    {
      q: "When can I contact USCIS about my EAD?",
      a: "Once your case is outside the posted processing time for your category, you can submit an online inquiry. For a missing card, wait 30 days from approval.",
    },
    {
      q: "My EAD was approved but the card hasn't arrived. What now?",
      a: "Check Case Status Online for the USPS tracking number. If 30 days have passed since approval, use USCIS's e-Request tools to report it.",
    },
    {
      q: "Is my EAD automatically extended while my renewal is pending?",
      a: "Not if you filed the renewal on or after October 30, 2025. STEM OPT extensions are different: a timely filing gives up to 180 days of work authorization.",
    },
    {
      q: "Can I pay to speed up my EAD?",
      a: "Only for OPT and STEM OPT, with premium processing at $1,780. Other work permit categories can't use it.",
    },
  ],
  sources: [OPT_SRC.times, OPT_SRC.i765, OPT_SRC.premium, OPT_SRC.autoExtension, OPT_SRC.eadRule, OPT_SRC.caseInquiry, OPT_SRC.stem],
  links: [
    { href: "/answers/contact-uscis-about-delayed-case", label: "What to do about a delayed USCIS case" },
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/blog/h4-ead-2026", label: "H-4 EAD in 2026" },
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
  ],
};
