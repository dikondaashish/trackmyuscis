/**
 * Facts checked 2026-11-23 against uscis.gov: Form I-140 page, G-1055 fee schedule (edition
 * 11/19/26), premium processing page (updated 11/10/2026), the March 1, 2026 premium fee alert,
 * I-140 filing and processing procedures (updated 02/18/2026), concurrent filing page, and the
 * adjustment filing charts page (updated 11/02/2026). Processing times aren't quoted: the USCIS
 * tool couldn't be read automatically, so the post links to it.
 */
import cover from "@/assets/blog/i-140-status-check.jpg";
import type { BlogPost } from "../types";

export const i140Status: BlogPost = {
  slug: "i-140-status-check",
  title: "I-140 status: how to check it, what it costs and what comes next",
  seoTitle: "I-140 Status Check, Fees and Premium Processing (2026)",
  description:
    "Check your I-140 status with your receipt number, see the 2026 filing and premium processing fees, and learn what an approved I-140 does and doesn't do.",
  topic: "Employment-based",
  published: "2026-11-23",
  updated: "2026-11-23",
  cover: { src: cover, alt: "An engineer checks a three-step case tracker on her laptop, two steps done, with an approval envelope beside the keyboard" },
  answer:
    "To check your I-140 status, enter the 13-character receipt number from your I-797C notice in USCIS Case Status Online, or sign in to your USCIS online account. In 2026 the I-140 costs $715 on paper or $665 online, plus an Asylum Program Fee, and premium processing costs $2,965 for a decision in 15 or 45 business days.",
  takeaways: [
    "Your receipt number is 3 letters and 10 digits. LIN means Nebraska Service Center, SRC means Texas Service Center, IOE means it was filed online.",
    "Premium processing went up to $2,965 on March 1, 2026. It promises action in 15 business days, or 45 for EB-1C managers and EB-2 NIW.",
    "An approved I-140 isn't a green card. It holds your priority date while you wait for a visa number.",
    "After 180 days of approval, the I-140 generally stays valid even if your employer withdraws it.",
  ],
  sections: [
    {
      id: "check-status",
      heading: "How to check your I-140 status",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Find your receipt number",
              text: "It's on the I-797C receipt notice USCIS sends after accepting the petition: three letters and 10 digits, such as SRC2690012345. Leave out dashes, but keep any asterisks.",
            },
            {
              title: "Use USCIS Case Status Online",
              text: "Enter the number at [USCIS Case Status Online](https://egov.uscis.gov/) to see the last action on your case and what usually comes next.",
            },
            {
              title: "Or sign in to your USCIS online account",
              text: "A free account shows recent actions on the case and any notices USCIS has posted. Employers' attorneys usually see the case in their own account.",
            },
            {
              title: "Check the processing time for your category",
              text: "Compare your receipt date with the current time on the [USCIS processing times tool](https://egov.uscis.gov/processing-times/). Our [processing times guide](/processing-times) explains how to read it.",
            },
          ],
        },
        {
          kind: "table",
          caption: "What the letters in an I-140 receipt number mean",
          head: ["Prefix", "Office"],
          rows: [
            ["LIN", "Nebraska Service Center"],
            ["SRC", "Texas Service Center"],
            ["IOE", "Filed online (electronic filing)"],
          ],
          note: "More on [what a receipt number is](/answers/what-is-a-uscis-receipt-number).",
        },
      ],
    },
    {
      id: "statuses",
      heading: "What the common status updates mean",
      blocks: [
        "USCIS doesn't publish an official glossary of these messages. This is our plain-English summary; see [every status explained](/status-explained) for more.",
        [
          "**Case Was Received:** USCIS accepted the petition and the fee. Your receipt notice is on its way.",
          "**Case Is Being Actively Reviewed:** an officer is working on it, or it's in the queue for review. It doesn't mean a decision is close.",
          "**Request for Additional Evidence Was Sent:** USCIS needs more documents before it can decide. Answer by the deadline on the notice. See [what an RFE is](/answers/what-is-a-request-for-evidence).",
          "**Case Was Approved:** the petition is approved. An approval notice (Form I-797) is mailed to the petitioner or their attorney.",
        ],
        {
          kind: "callout",
          tone: "info",
          title: "No update for months?",
          text: "That's normal for I-140s. Status pages often stay the same until a decision or an RFE. If your case is past the time USCIS shows for your category, you can [contact USCIS about a delayed case](/answers/contact-uscis-about-delayed-case).",
        },
      ],
    },
    {
      id: "fees",
      heading: "I-140 fees in 2026",
      blocks: [
        {
          kind: "table",
          caption: "Form I-140 fees (USCIS fee schedule, edition 11/19/26)",
          head: ["Fee", "Amount"],
          rows: [
            ["Filing fee, paper", "$715"],
            ["Filing fee, online", "$665"],
            ["Asylum Program Fee, most employers", "$600"],
            ["Asylum Program Fee, small employer (25 or fewer full-time employees) or self-petitioner", "$300"],
            ["Asylum Program Fee, nonprofit", "$0"],
            ["Premium processing (Form I-907), optional", "$2,965"],
          ],
          note: "Fees are paid in addition to each other and aren't refundable. Check the current [USCIS fee schedule](https://www.uscis.gov/g-1055) before you pay.",
        },
      ],
    },
    {
      id: "premium",
      heading: "Is premium processing worth it?",
      blocks: [
        "Premium processing doesn't make approval more likely. It buys speed: USCIS must take action (approve, deny, or send an RFE) within a set number of business days, or refund the fee.",
        [
          "**15 business days:** EB-1A extraordinary ability, EB-1B outstanding researchers and EB-2 without a national interest waiver. EB-3 skilled workers, professionals and other workers too, when USCIS has made premium processing available for them.",
          "**45 business days:** EB-1C multinational executives and managers, and EB-2 national interest waiver (NIW).",
        ],
        "It's most useful when a quick approval changes something: an H-1B worker nearing six years who needs an approved I-140 to extend, someone changing jobs, or someone whose priority date is about to become current.",
        {
          kind: "callout",
          tone: "warning",
          title: "The fee went up on March 1, 2026",
          text: "Premium processing for Form I-140 rose from $2,805 to $2,965. USCIS rejects an I-907 sent with the old amount.",
        },
        "If you file Form I-907 together with Form I-140, both must go by mail. If your pending I-140 was filed online (an IOE receipt), you can request premium processing later from your online account. More on [how premium processing works](/answers/what-is-uscis-premium-processing).",
      ],
    },
    {
      id: "after-approval",
      heading: "What an approved I-140 does, and doesn't do",
      blocks: [
        "An approved I-140 confirms that the job and the worker qualify for the category. It is **not** a green card and doesn't give you status on its own. To become a permanent resident you still need a visa number to be available and an approved I-485, or an immigrant visa from a U.S. consulate.",
        [
          "**It keeps your priority date.** Your place in the Visa Bulletin line stays with you, even for a later petition, unless the approval is revoked for fraud, misrepresentation or a material error.",
          "**The 180-day rule.** Once an I-140 has been approved for 180 days or more, or your I-485 has been pending 180 days or more, USCIS generally won't revoke it just because the employer withdraws it or goes out of business.",
          "**Changing jobs.** If your I-485 has been pending 180 days or more, you may be able to move to a same or similar job under the portability rules (INA 204(j)) without a new I-140.",
        ],
      ],
    },
    {
      id: "file-485",
      heading: "When you can file your I-485",
      blocks: [
        "You can file Form I-485 at the same time as the I-140, or while it's pending, when a visa number is immediately available for your category and country. In practice that means your priority date is earlier than the date in the Visa Bulletin chart USCIS accepts that month.",
        "For November 2026, USCIS accepts the Dates for Filing chart for employment-based cases. See the [November 2026 Visa Bulletin explained](/blog/november-2026-visa-bulletin) for every date.",
        {
          kind: "callout",
          tone: "tip",
          title: "Filing online?",
          text: "An I-485 can't be filed online or attached to an online I-140. If you want to file both together, file both on paper.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "How do I check my I-140 status?",
      a: "Enter the 13-character receipt number from your I-797C notice in USCIS Case Status Online, or sign in to your USCIS online account.",
    },
    {
      q: "How much is premium processing for an I-140 in 2026?",
      a: "$2,965, since March 1, 2026. USCIS must act within 15 business days, or 45 business days for EB-1C and EB-2 national interest waiver petitions.",
    },
    {
      q: "How much does Form I-140 cost?",
      a: "$715 on paper or $665 online, plus an Asylum Program Fee of $600, $300 for small employers and self-petitioners, or $0 for nonprofits.",
    },
    {
      q: "Is an approved I-140 a green card?",
      a: "No. It holds your priority date. You still need a visa number to be available and an approved I-485 or an immigrant visa.",
    },
    {
      q: "What happens if my employer withdraws an approved I-140?",
      a: "If it had been approved for at least 180 days, or your I-485 had been pending at least 180 days, USCIS generally keeps it valid and you keep your priority date.",
    },
  ],
  sources: [
    { label: "USCIS: Form I-140", href: "https://www.uscis.gov/i-140" },
    { label: "USCIS: Fee schedule (Form G-1055)", href: "https://www.uscis.gov/g-1055" },
    { label: "USCIS: How do I request premium processing?", href: "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing" },
    { label: "USCIS: Premium processing fee increase", href: "https://www.uscis.gov/newsroom/alerts/uscis-to-increase-premium-processing-fees" },
    {
      label: "USCIS: I-140 filing and processing procedures",
      href: "https://www.uscis.gov/forms/all-forms/petition-filing-and-processing-procedures-for-form-i-140-immigrant-petition-for-alien-workers",
    },
    {
      label: "USCIS: Concurrent filing of Form I-485",
      href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/concurrent-filing-of-form-i-485",
    },
    { label: "USCIS: Checking your case status online", href: "https://www.uscis.gov/tools/checking-your-case-status-online" },
  ],
  links: [
    { href: "/forms/i-140", label: "Form I-140: petition for a worker" },
    { href: "/forms/i-485", label: "Form I-485: apply for a green card from inside the U.S." },
    { href: "/answers/what-is-uscis-premium-processing", label: "What is USCIS premium processing?" },
    { href: "/processing-times", label: "USCIS processing times" },
  ],
};
