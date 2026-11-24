/**
 * Facts checked 2026-11-24: USCIS H-4 EAD page, processing times tool (I-765 (c)(26) standalone,
 * Service Center Operations: 18.5 months), fee calculator, the archived automatic-extension page and
 * the October 14, 2026 final rule (see opt-sources.ts).
 */
import cover from "@/assets/blog/h4-ead-2026.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const h4Ead2026: BlogPost = {
  slug: "h4-ead-2026",
  title: "H-4 EAD in 2026: who qualifies, processing time and the end of automatic extensions",
  seoTitle: "H-4 EAD 2026: Processing Time, Eligibility, Renewal",
  description:
    "USCIS shows 18.5 months for standalone H-4 EAD applications, and renewals no longer get an automatic extension. Who qualifies, what to file and when to renew.",
  topic: "Students & OPT",
  published: "2026-11-14",
  author: "charlie",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A woman in work clothes holds a blank work permit card beside her husband with a laptop bag, a calendar and hourglass on the shelf",
  },
  answer:
    "An H-4 spouse can get a work permit (H-4 EAD) if the H-1B spouse has an approved I-140 or has been extended beyond six years under AC21. USCIS's processing time for a standalone H-4 EAD application, category (c)(26), is 18.5 months for 80% of cases (checked November 24, 2026). Renewals filed on or after October 30, 2025 no longer get an automatic extension, so file your renewal as early as USCIS allows: 180 days before your card expires.",
  takeaways: [
    "Eligibility depends on your H-1B spouse: an approved I-140, or H-1B time extended under AC21 sections 106(a) and (b).",
    "USCIS shows 18.5 months for 80% of standalone H-4 EAD applications (category (c)(26), checked November 24, 2026).",
    "Renewals filed on or after October 30, 2025 don't get the old automatic extension. A final rule confirmed this on October 14, 2026.",
    "You can file a renewal up to 180 days before your current card expires, and not earlier.",
    "The fee is $470 online or $520 on paper. Premium processing isn't available for H-4 EAD.",
  ],
  sections: [
    {
      id: "eligibility",
      heading: "Who can get an H-4 EAD",
      blocks: [
        "You must be in H-4 status as the spouse of an H-1B worker, and your H-1B spouse must either:",
        [
          "Be the main beneficiary of an **approved Form I-140** immigrant petition, or",
          "Have been granted H-1B status beyond the usual six years under **AC21 sections 106(a) and (b)**, because their green card process started early enough (a PERM labor certification or I-140 filed at least 365 days before).",
        ],
        "H-4 children can't get an H-4 EAD. It's only for spouses.",
      ],
    },
    {
      id: "processing-time",
      heading: "How long the H-4 EAD takes",
      blocks: [
        {
          kind: "table",
          caption: "Official processing time, H-4 EAD",
          head: ["How you file", "80% of cases finished within"],
          rows: [["Standalone Form I-765, category (c)(26)", "18.5 months"]],
          note: "From USCIS's [processing times tool](https://egov.uscis.gov/processing-times/), Service Center Operations, checked November 24, 2026.",
        },
        "If you file your I-765 together with Form I-539 (to extend H-4 status), USCIS won't decide the work permit until it has decided the I-539. USCIS shows that combination as a separate line in its tool.",
        {
          kind: "callout",
          tone: "warning",
          title: "No premium processing for H-4 EAD",
          text: "Premium processing covers OPT and STEM OPT work permits, not H-4. USCIS also says it isn't available for an H-4 Form I-539 on its own. When the H-1B petition is filed with premium processing, USCIS may decide the spouse's forms at the same time if it can, but it doesn't promise to.",
        },
      ],
    },
    {
      id: "auto-extension",
      heading: "Automatic extensions are gone for new renewals",
      blocks: [
        "Until late 2025, a timely H-4 EAD renewal could keep you working after your card expired, as long as your H-4 I-94 was still valid. That changed:",
        [
          "**October 30, 2025:** DHS ended automatic EAD extensions for renewal applications filed on or after that date.",
          "**October 14, 2026:** a final rule made the change permanent.",
          "**Filed before October 30, 2025?** Renewals filed earlier keep the automatic extension they already had.",
        ],
        "With an 18.5-month processing time and no automatic extension, a gap between cards is a real risk. The only lever you control is filing early: USCIS lets you file a renewal up to 180 days before your current card expires.",
      ],
    },
    {
      id: "how-to-file",
      heading: "How to file",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Pick how to file",
              text: "Standalone if your H-4 status doesn't need extending. With Form I-539 if you're extending H-4. With your spouse's H-1B Form I-129 and your I-539 if they're filed together.",
            },
            {
              title: "Gather your evidence",
              text: "Proof of H-4 status (I-797 for your I-539 or your I-94), photo ID, your marriage certificate, proof of eligibility (your spouse's I-140 approval notice, or evidence of the AC21 extension), and two passport-style photos.",
            },
            {
              title: "Pay the fee",
              text: "$470 online or $520 on paper. If you're filing with Form I-485, use category (c)(9) instead, not (c)(26).",
            },
            {
              title: "Wait for approval before working",
              text: "You can't work on H-4 until USCIS approves your I-765. Your card's end date usually matches your H-4 I-94.",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "How long does the H-4 EAD take in 2026?",
      a: "USCIS shows 18.5 months for 80% of standalone H-4 EAD applications, category (c)(26), as of November 24, 2026.",
    },
    {
      q: "Is there an automatic extension for H-4 EAD renewals?",
      a: "Not for renewals filed on or after October 30, 2025. DHS ended automatic extensions then, and a final rule confirmed it on October 14, 2026.",
    },
    {
      q: "When can I file my H-4 EAD renewal?",
      a: "Up to 180 days before your current card expires. Filing at the start of that window gives you the most time.",
    },
    {
      q: "Can I use premium processing for H-4 EAD?",
      a: "No. Premium processing for work permits covers OPT and STEM OPT only.",
    },
    {
      q: "Who qualifies for the H-4 EAD?",
      a: "H-4 spouses of H-1B workers who have an approved I-140, or who were extended beyond six years under AC21 sections 106(a) and (b).",
    },
    {
      q: "How much does the H-4 EAD cost?",
      a: "$470 if you file Form I-765 online or $520 on paper.",
    },
  ],
  sources: [OPT_SRC.h4ead, OPT_SRC.times, OPT_SRC.fees, OPT_SRC.autoExtension, OPT_SRC.eadRule, OPT_SRC.premium],
  links: [
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
    { href: "/blog/ead-delays-2026", label: "EAD taking too long? What you can do" },
    { href: "/blog/i-140-status-check", label: "I-140 status check" },
    { href: "/answers/how-to-check-uscis-case-status", label: "How to check your USCIS case status" },
  ],
};
