/**
 * Facts checked 2026-11-28 against USCIS's "How to track delivery of your notice or secure identity
 * document or card" page (updated 10/11/2024), the address change page (updated 11/23/2026) and the
 * Contact Center page (updated 10/13/2026). Those pages give NO number of days from production to
 * delivery and no fixed waiting period before reporting a missing card, so this post gives none.
 * egov.uscis.gov/e-request blocks automated reads (403); link to it, don't quote it.
 * Demand: "new card is being produced" and "card was mailed to me" 100–1K a month each; Search Console
 * shows us at position 8 for "how long from card produced to delivery uscis".
 */
import cover from "@/assets/blog/new-card-is-being-produced.jpg";
import type { BlogPost } from "../types";

const SRC = {
  delivery: {
    label: "USCIS: How to track delivery of your notice or secure identity document or card",
    href: "https://www.uscis.gov/forms/filing-guidance/how-to-track-delivery-of-your-notice-or-secure-identity-document-or-card",
  },
  address: { label: "USCIS: Change of address", href: "https://www.uscis.gov/addresschange" },
  contactCenter: { label: "USCIS: Contact Center", href: "https://www.uscis.gov/contactcenter" },
  eRequest: { label: "USCIS: e-Request self-service tools", href: "https://egov.uscis.gov/e-request/Intro.do" },
};

export const newCardIsBeingProduced: BlogPost = {
  slug: "new-card-is-being-produced",
  title: "\"New Card Is Being Produced\": what it means and how your card gets to you",
  seoTitle: "New Card Is Being Produced: What Happens Next",
  description:
    "Your USCIS status says New Card Is Being Produced or Card Was Mailed To Me. How the card is mailed, where to find the tracking number and what to do if it's missing.",
  topic: "Case status",
  published: "2026-11-28",
  author: "kiran",
  updated: "2026-11-28",
  cover: {
    src: cover,
    alt: "A woman opens her mailbox and takes out an envelope holding a new card, with a phone in her other hand showing a delivery tracking line",
  },
  answer:
    "\"New Card Is Being Produced\" means USCIS approved your case and is printing your green card, work permit or travel document. USCIS mails cards by USPS Priority Mail with delivery confirmation and shows the tracking number in your online account when the card goes out. USCIS doesn't publish a set number of days for printing and delivery, so follow the tracking number, keep your address current and act as soon as the mail looks lost.",
  takeaways: [
    "The status means your case is approved and the card is being printed.",
    "Cards travel by **USPS Priority Mail with delivery confirmation**.",
    "Your USCIS online account shows the USPS tracking number when the card is mailed.",
    "USPS does not forward USCIS mail. If you moved, change your address with USCIS itself.",
    "If the card looks lost, start with USPS's missing mail steps, then report it to USCIS.",
  ],
  sections: [
    {
      id: "meaning",
      heading: "What the card statuses mean",
      blocks: [
        "After an approval that comes with a card, your status usually moves through a few messages. In plain words:",
        {
          kind: "table",
          caption: "Card statuses, in order",
          head: ["Status", "In plain words"],
          rows: [
            ["New Card Is Being Produced", "Your case is approved. USCIS has ordered your card to be printed."],
            ["Card Was Mailed To Me", "The card has left USCIS. A USPS tracking number is usually shown."],
            ["Card Was Picked Up By The United States Postal Service", "USPS has the envelope and it's moving through the mail."],
            ["Card Was Delivered To Me By The Post Office", "USPS recorded the delivery at your address."],
            ["Card Was Returned To USCIS", "USPS couldn't deliver it and sent it back. You need to contact USCIS."],
          ],
          note: "The wording comes from USCIS's case status tool. See every message on our [status explained](/status-explained) page.",
        },
        "The approval notice (Form I-797) is mailed separately from the card, so they often arrive on different days. [What is Form I-797?](/answers/what-is-form-i-797)",
      ],
    },
    {
      id: "how-long",
      heading: "How long from production to delivery?",
      blocks: [
        "USCIS doesn't publish an official number of days from \"New Card Is Being Produced\" to the card in your hand, and we won't guess one. What USCIS does tell you is how the card travels and how to follow it:",
        [
          "Cards go out by **USPS Priority Mail with Delivery Confirmation**, under what USCIS calls its Secure Mail Initiative.",
          "If you have a USCIS online account, it updates automatically with your **USPS tracking number** when the card or travel document is mailed.",
          "Without an account, Case Status Online shows whether the card has been mailed.",
        ],
        {
          kind: "callout",
          tone: "tip",
          title: "Watch the status, not the calendar",
          text: "The useful signal is the change from \"being produced\" to \"mailed\". Once you have the tracking number, USPS tracking tells you where the envelope is.",
        },
      ],
    },
    {
      id: "be-ready",
      heading: "Three things to do while you wait",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Check the address USCIS has",
              text: "The card goes to the mailing address on file. USCIS says changing your address with USPS doesn't change it with USCIS, and USPS won't forward mail from USCIS. If you moved, update it in your USCIS online account right away. See [how to change your address with USCIS](/answers/how-to-change-address-with-uscis).",
            },
            {
              title: "Turn on USPS Informed Delivery",
              text: "USCIS recommends registering for USPS Informed Delivery, which emails you daily images of the mail on its way to you.",
            },
            {
              title: "Follow the status change",
              text: "[Track your case](/#track) in a free TrackMyUSCIS account so you can see when the status moves from produced to mailed and what each message means.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "A wrong address can cost you a new fee",
          text: "USCIS warns that if you don't update your address promptly, your case could be delayed, your documents could get lost, and you may need to reapply and pay the fee again.",
        },
      ],
    },
    {
      id: "missing",
      heading: "If the card doesn't arrive",
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: "Check the tracking number",
              text: "Look in your USCIS online account or Case Status Online, then look the number up with USPS.",
            },
            {
              title: "If USPS says delivered but you don't have it",
              text: "USCIS says to follow USPS's Find Missing Mail steps as soon as you believe your mail is missing. Check with neighbors, your building's mail room and your local post office too.",
            },
            {
              title: "If you think it went back to USCIS",
              text: "Contact the USCIS Contact Center at 800-375-5283, or send an online case inquiry and choose that you did not receive your card by mail. See [how to reach a live person at USCIS](/blog/uscis-phone-number-live-person).",
            },
            {
              title: "Ask what USCIS can do",
              text: "USCIS says it may be able to try a second delivery in some cases, and may reissue a document that wasn't delivered. It also says you generally need to file a new form for a non-delivered document to be reissued, so ask which applies to you before you file or pay anything.",
            },
          ],
        },
      ],
    },
    {
      id: "error",
      heading: "If the card arrives with a mistake",
      blocks: [
        "Check your name, date of birth, category and dates the day the card arrives. If something is wrong, contact USCIS. Its Contact Center handles typographical errors that USCIS caused, and USCIS's page on correcting, updating or replacing immigration documents explains which form applies when the mistake wasn't theirs.",
        "Keep the envelope and the card, and take a photo of both before you send anything back.",
      ],
    },
  ],
  faq: [
    {
      q: "What does \"New Card Is Being Produced\" mean?",
      a: "USCIS approved your case and ordered your card to be printed. It applies to green cards, work permits (EADs) and travel documents.",
    },
    {
      q: "How long after \"New Card Is Being Produced\" will I get my card?",
      a: "USCIS doesn't publish a set number of days. The card is mailed by USPS Priority Mail with delivery confirmation, and your online account shows the tracking number once it's mailed.",
    },
    {
      q: "Where do I find the tracking number for my card?",
      a: "In your USCIS online account, which updates automatically when the card is mailed. Case Status Online also shows whether the card has been mailed.",
    },
    {
      q: "Will USPS forward my card if I moved?",
      a: "No. USCIS says USPS will not forward mail from USCIS, and a USPS change of address doesn't change your address with USCIS. Update it with USCIS directly.",
    },
    {
      q: "What if USPS says my card was delivered but I don't have it?",
      a: "Follow USPS's Find Missing Mail steps right away. If you still don't have it, call the USCIS Contact Center at 800-375-5283 or send a case inquiry saying you did not receive your card by mail.",
    },
    {
      q: "Do I have to pay again if my card is lost in the mail?",
      a: "It depends. USCIS says it may try a second delivery or reissue the document in some cases, but that you generally need to file a new form for a non-delivered document. Ask USCIS which applies before you file.",
    },
  ],
  sources: [SRC.delivery, SRC.address, SRC.contactCenter, SRC.eRequest],
  links: [
    { href: "/answers/uscis-case-approved-what-next", label: "My USCIS case was approved. What happens next?" },
    { href: "/answers/how-to-change-address-with-uscis", label: "How to change your address with USCIS" },
    { href: "/status-explained", label: "Every USCIS case status, explained" },
    { href: "/blog/uscis-phone-number-live-person", label: "USCIS phone number: how to reach a live person" },
  ],
};
