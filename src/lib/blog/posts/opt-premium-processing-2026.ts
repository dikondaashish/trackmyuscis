/**
 * Facts checked 2026-11-24 against the USCIS premium processing page, the January 9, 2026 premium
 * fee alert, the fee calculator and the processing times tool (see opt-sources.ts).
 */
import cover from "@/assets/blog/opt-premium-processing-2026.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const optPremiumProcessing2026: BlogPost = {
  slug: "opt-premium-processing-2026",
  title: "OPT premium processing in 2026: the $1,780 fee, the 30-day clock and when it's worth it",
  seoTitle: "OPT Premium Processing 2026: $1,780 Fee and Timeline",
  description:
    "OPT and STEM OPT premium processing costs $1,780 in 2026 for action within 30 business days. How to request it, when the clock starts and whether it's worth it.",
  topic: "Students & OPT",
  published: "2026-11-24",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "An application envelope speeds along a blue express lane past slower envelopes, beside a stopwatch, while a student checks his phone",
  },
  answer:
    "Premium processing for OPT and STEM OPT costs $1,780 in 2026, on top of the regular filing fee. USCIS must take action on your application within 30 business days of receiving your premium request, or refund the $1,780. You can request it when you file Form I-765 or any time after, online or by mail. Without it, USCIS's processing time for these applications is 6 months for 80% of cases (checked November 24, 2026).",
  takeaways: [
    "The fee is $1,780, up from $1,685 on March 1, 2026. It's paid separately from the $470 or $520 filing fee.",
    "USCIS must take action within 30 business days, or refund the premium fee.",
    "“Action” can be an approval, a denial or a request for evidence. A request for evidence stops the clock, and a new 30 days start when USCIS gets your reply.",
    "You can add premium processing to an OPT or STEM OPT application that's already pending.",
    "It doesn't make approval more likely. It only makes the decision faster.",
  ],
  sections: [
    {
      id: "what-you-get",
      heading: "What premium processing gets you",
      blocks: [
        "Premium processing is an optional, paid service. For OPT and STEM OPT applications, USCIS guarantees it will take “adjudicative action” within 30 business days. If it doesn't, it refunds the premium fee.",
        "Because OPT can use premium processing, USCIS says ordinary expedite requests generally aren't available for it. Premium processing is the official way to go faster.",
        "Adjudicative action means a decision or a request: approval, denial, a request for evidence (RFE) or a notice of intent to deny. If USCIS asks for more evidence, the 30 business days stop, and a new 30-day period starts when USCIS receives your response.",
        "After approval, USCIS says your card is usually produced within two weeks and then mailed. Premium processing doesn't speed up the card printing or the mail.",
      ],
    },
    {
      id: "fee",
      heading: "How much it costs in 2026",
      blocks: [
        {
          kind: "table",
          caption: "Premium processing fees for students",
          head: ["Application", "Before March 1, 2026", "Now"],
          rows: [
            ["Form I-765 for OPT or STEM OPT", "$1,685", "$1,780"],
            ["Form I-539 to change to F-1 or F-2 status", "$1,965", "$2,075"],
          ],
          note: "Sources: USCIS [premium fee alert](https://www.uscis.gov/newsroom/alerts/uscis-to-increase-premium-processing-fees) and [fee calculator](https://www.uscis.gov/feecalculator), checked November 24, 2026.",
        },
        "The premium fee is in addition to the Form I-765 filing fee, $470 online or $520 on paper, and USCIS wants it paid separately. A single payment for both can get the forms rejected.",
      ],
    },
    {
      id: "who-can",
      heading: "Who can use it",
      blocks: [
        "Premium processing is available for every F-1 student work permit category for practical training:",
        [
          "**(c)(3)(A):** pre-completion OPT",
          "**(c)(3)(B):** post-completion OPT",
          "**(c)(3)(C):** the 24-month STEM OPT extension",
        ],
        "Other student work permit categories, such as severe economic hardship, aren't on USCIS's premium processing list.",
      ],
    },
    {
      id: "how",
      heading: "How to request it",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "When you file",
              text: "File Form I-907 with your Form I-765, online in your USCIS account or by mail. Pay the two fees separately.",
            },
            {
              title: "After you've filed",
              text: "File Form I-907 online, or mail it to the USCIS Chicago lockbox. Include your I-765 receipt number so USCIS can match the two. If it can't, it rejects the I-907.",
            },
            {
              title: "Watch the clock",
              text: "The 30 business days start when USCIS receives a properly completed Form I-907 at the correct address.",
            },
            {
              title: "Contact USCIS if needed",
              text: "Once you've filed Form I-907, call 866-315-5718 with your receipt number, or send a secure message in your USCIS account if you filed online.",
            },
          ],
        },
      ],
    },
    {
      id: "worth-it",
      heading: "Is it worth $1,780?",
      blocks: [
        {
          kind: "table",
          caption: "Standard versus premium for OPT",
          head: ["", "Standard", "Premium"],
          rows: [
            ["Decision time", "6 months for 80% of cases", "Action within 30 business days"],
            ["Extra cost", "$0", "$1,780"],
            ["Approval chances", "Same", "Same"],
          ],
          note: "Standard time from USCIS's [processing times tool](https://egov.uscis.gov/processing-times/), category (c)(3), checked November 24, 2026.",
        },
        "It's most often worth it when waiting would cost more than the fee:",
        [
          "You have a job offer with a start date you'd otherwise miss.",
          "Your unemployment days would keep adding up while you wait.",
          "On STEM OPT, your case is getting close to the end of the 180-day work extension.",
        ],
        "It's less useful if you filed early and your start date is still months away, or if your application has a problem that's likely to trigger a request for evidence, because that resets the clock anyway.",
      ],
    },
  ],
  faq: [
    {
      q: "How much is premium processing for OPT in 2026?",
      a: "$1,780 for Form I-765 OPT and STEM OPT applications, since March 1, 2026. Before that it was $1,685.",
    },
    {
      q: "How long does OPT premium processing take?",
      a: "USCIS must take action within 30 business days of receiving your premium request. If it sends a request for evidence, a new 30-day period starts when it gets your response.",
    },
    {
      q: "Can I add premium processing after filing OPT?",
      a: "Yes. File Form I-907 online or by mail to the Chicago lockbox, with your I-765 receipt number.",
    },
    {
      q: "Does premium processing guarantee approval?",
      a: "No. It only guarantees that USCIS takes action within 30 business days. The decision itself follows the same rules.",
    },
    {
      q: "What happens if USCIS misses the 30 business days?",
      a: "USCIS refunds the $1,780 premium processing fee. Your application stays in line for a decision.",
    },
    {
      q: "Is premium processing available for STEM OPT?",
      a: "Yes. It covers pre-completion OPT, post-completion OPT and STEM OPT extensions, categories (c)(3)(A), (B) and (C).",
    },
  ],
  sources: [OPT_SRC.premium, OPT_SRC.premiumFeeAlert, OPT_SRC.fees, OPT_SRC.times, OPT_SRC.i765],
  links: [
    { href: "/answers/what-is-uscis-premium-processing", label: "What is USCIS premium processing?" },
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/blog/stem-opt-extension-2026", label: "STEM OPT extension in 2026" },
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
  ],
};
