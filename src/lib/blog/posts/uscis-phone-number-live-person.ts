/**
 * Facts checked 2026-11-28 against USCIS's Contact Center page (updated 10/13/2026), Contact Us page
 * (updated 12/22/2025) and Emma page (updated 06/03/2026). USCIS publishes no menu path or phrase for
 * reaching a live agent, so the post doesn't give one. "InfoPass" isn't used on these pages any more.
 * Demand: "uscis phone number" and "uscis customer service" 10K–100K a month (Keyword Planner, US);
 * Search Console already shows us near position 9–11 for "uscis case status contact number".
 */
import cover from "@/assets/blog/uscis-phone-number-live-person.jpg";
import type { BlogPost } from "../types";

const SRC = {
  contactCenter: { label: "USCIS: Contact Center", href: "https://www.uscis.gov/contactcenter" },
  contactUs: { label: "USCIS: Contact us", href: "https://www.uscis.gov/about-us/contact-us" },
  emma: { label: "USCIS: Meet Emma, our virtual assistant", href: "https://www.uscis.gov/tools/meet-emma-our-virtual-assistant" },
  appointment: { label: "USCIS: Request an appointment", href: "https://my.uscis.gov/en/appointment/v2" },
  times: { label: "USCIS: Check case processing times", href: "https://egov.uscis.gov/processing-times/" },
};

export const uscisPhoneNumberLivePerson: BlogPost = {
  slug: "uscis-phone-number-live-person",
  title: "USCIS phone number: how to reach a live person about your case",
  seoTitle: "USCIS Phone Number: Reach a Live Person (2026)",
  description:
    "The USCIS Contact Center number is 800-375-5283. Hours, the number from outside the U.S., how live help works, Emma chat and when to ask for an appointment.",
  topic: "Case status",
  published: "2026-11-28",
  author: "charlie",
  updated: "2026-11-28",
  cover: {
    src: cover,
    alt: "A man holds a phone to his ear while reading a notice at his kitchen table, with a laptop showing a case timeline and a chat bubble beside him",
  },
  answer:
    "The USCIS Contact Center number is 800-375-5283 (TTY 800-767-1833). From outside the United States, call 212-620-3418. The automated system answers 24 hours a day, and live representatives answer calls and chats Monday to Friday, 8 a.m. to 8 p.m. Eastern, except federal holidays. USCIS only connects you to a person when an online tool can't solve your question, so have your receipt number and a clear reason ready.",
  takeaways: [
    "**800-375-5283** is the main number. TTY is 800-767-1833, and from abroad it's 212-620-3418.",
    "Live help runs Monday to Friday, 8 a.m. to 8 p.m. Eastern, except federal holidays.",
    "The first person you reach (Tier 1) can handle case status questions, expedite requests, rescheduling and missing notices.",
    "Harder questions go to a USCIS officer (Tier 2), who may email or call you back later.",
    "You can also reach a live agent through the Emma chat on uscis.gov, in English or Spanish.",
  ],
  sections: [
    {
      id: "numbers",
      heading: "USCIS phone numbers and hours",
      blocks: [
        {
          kind: "table",
          caption: "USCIS Contact Center numbers",
          head: ["Who it's for", "Number", "When"],
          rows: [
            ["Anyone in the U.S.", "800-375-5283", "Automated answers 24 hours a day. Live help Monday to Friday, 8 a.m. to 8 p.m. Eastern, except federal holidays."],
            ["Deaf or hard of hearing (TTY)", "800-767-1833", "Same hours"],
            ["Calling from outside the U.S.", "212-620-3418", "Same hours"],
            ["Military members and families", "877-247-4645 (877-CIS-4MIL)", "USCIS military help line"],
          ],
          note: "Source: USCIS, [Contact Center](https://www.uscis.gov/contactcenter) and [Contact us](https://www.uscis.gov/about-us/contact-us), checked November 28, 2026.",
        },
        "The phone system understands speech. USCIS says you can ask your question in English or Spanish, and it can send you links to forms and information by email or text.",
      ],
    },
    {
      id: "live-person",
      heading: "How you actually get a live person",
      blocks: [
        "USCIS doesn't publish a button sequence or a magic word for reaching an agent. What it does say is this: if your question can be answered by an online tool or other self-service, you won't be connected to live help. So the way through is to have a question that self-service can't solve, and to say it plainly.",
        {
          kind: "steps",
          items: [
            {
              title: "Try the online tool first",
              text: "Check your status and the processing time for your form. If the answer is there, the phone system will send you back to it. See [how to check your case status](/answers/how-to-check-uscis-case-status).",
            },
            {
              title: "Call during live hours",
              text: "Monday to Friday, 8 a.m. to 8 p.m. Eastern. Outside those hours you only get the automated system.",
            },
            {
              title: "State the specific problem",
              text: "Say what you need in one sentence, for example that your case is outside the posted processing time, a notice or card never arrived, or you need to reschedule an appointment.",
            },
            {
              title: "Agree to a callback if it's offered",
              text: "If your question needs an officer, USCIS may call you back. It says callbacks can come between 7 a.m. and 8 p.m., Monday to Saturday, so keep your phone on.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Have these in front of you",
          text: "Your 13-character receipt number, your receipt notice, your full name and date of birth as they appear on the application, and your A-Number if you have one. [What is a receipt number?](/answers/what-is-a-uscis-receipt-number)",
        },
      ],
    },
    {
      id: "tiers",
      heading: "Tier 1 and Tier 2: who you're talking to",
      blocks: [
        "USCIS describes two levels of live help. Tier 1 is the first person who answers. Tier 2 is a USCIS Immigration Services Officer.",
        {
          kind: "table",
          caption: "What each level handles, according to USCIS",
          head: ["Level", "Handles"],
          rows: [
            ["Tier 1 (first representative)", "Case status questions, expedite requests, rescheduling appointments, notices that weren't delivered, accommodation requests, typos USCIS made, withdrawal requests"],
            ["Tier 2 (USCIS officer)", "Address changes before biometrics are scheduled, biometrics expedite requests, certain military issues, requests for in-person document services"],
          ],
          note: "Source: USCIS, [Contact Center](https://www.uscis.gov/contactcenter).",
        },
        "When a question is escalated, USCIS says you may get the answer by email or a follow-up call. The Tier 1 representative will ask whether you want a text message before an officer calls. You have to say yes out loud to get it.",
      ],
    },
    {
      id: "who-can-call",
      heading: "Who is allowed to call about a case",
      blocks: [
        "USCIS gives live help about a specific case to:",
        [
          "The applicant or petitioner.",
          "An attorney or accredited representative of record.",
          "A parent or legal guardian of a minor, or a legal guardian or custodian.",
          "A person or organization the applicant has authorized.",
        ],
        "A friend or relative who isn't on that list will usually get general information only.",
      ],
    },
    {
      id: "emma-chat",
      heading: "Emma and live chat",
      blocks: [
        "Emma is USCIS's virtual assistant. Look for \"Need Help? Chat with Emma\" in the lower right corner of uscis.gov, on a computer or phone. Emma answers in English and Spanish. USCIS says that if Emma can't answer your question, she may connect you to live chat with an agent. Live chat keeps the same hours as the phone line.",
        "Chat is often easier than calling if you're at work, and you can copy the answer for your records.",
      ],
    },
    {
      id: "without-calling",
      heading: "Things you can do without calling",
      blocks: [
        [
          "**Ask about a late case:** once you're outside the posted processing time, send an online case inquiry. USCIS says you should get a response within 30 days, or 15 days for expedited requests. See [what to do about a delayed case](/answers/contact-uscis-about-delayed-case).",
          "**Report a missing notice or card, or a USCIS typo:** use the e-Request tools.",
          "**Send a secure message:** from your USCIS online account.",
          "**Change your address:** online, in your account. See [how to change your address](/answers/how-to-change-address-with-uscis).",
          "**Ask for faster processing:** see [how expedite requests work](/blog/uscis-expedite-request).",
        ],
      ],
    },
    {
      id: "appointment",
      heading: "When you need an in-person appointment",
      blocks: [
        "USCIS field offices see people by appointment. You request one online or by calling 800-375-5283. USCIS lists these as reasons for an in-person appointment:",
        [
          "You need an emergency travel document.",
          "You need proof of your immigration status to work or travel.",
          "An immigration judge granted you permanent residence.",
        ],
        "The old name for these visits, InfoPass, no longer appears on USCIS's contact pages. The request form is on [my.uscis.gov](https://my.uscis.gov/en/appointment/v2).",
      ],
    },
    {
      id: "know-first",
      heading: "Know your status before you call",
      blocks: [
        "Most calls start with \"what's happening with my case?\" You can answer that yourself in seconds, and save the call for what only USCIS can fix. [Track your case](/#track) with your receipt number in a free TrackMyUSCIS account to see your current status and what it means in plain words. Then, if you still need to call, you'll know exactly what to ask.",
      ],
    },
  ],
  faq: [
    {
      q: "What is the USCIS phone number?",
      a: "800-375-5283. TTY is 800-767-1833. From outside the United States, call 212-620-3418.",
    },
    {
      q: "What are USCIS phone hours?",
      a: "The automated system answers 24 hours a day. Live representatives answer calls and chats Monday to Friday, 8 a.m. to 8 p.m. Eastern, except federal holidays.",
    },
    {
      q: "How do I talk to a live person at USCIS?",
      a: "Call 800-375-5283 during live hours and state a specific problem that online tools can't solve. USCIS says it won't connect you to a person if self-service can answer the question. You can also ask Emma on uscis.gov, which may connect you to a live chat agent.",
    },
    {
      q: "What is a USCIS Tier 2 officer?",
      a: "Tier 2 is a USCIS Immigration Services Officer. The first representative (Tier 1) escalates questions it can't resolve, and the officer may reply by email or a follow-up call.",
    },
    {
      q: "Can someone else call USCIS about my case?",
      a: "USCIS gives case help to the applicant or petitioner, an attorney or accredited representative of record, a parent or legal guardian, or someone the applicant has authorized.",
    },
    {
      q: "Can I walk into a USCIS office?",
      a: "Field offices work by appointment. Request one online at my.uscis.gov or by calling the Contact Center, for example for an emergency travel document or proof of status.",
    },
  ],
  sources: [SRC.contactCenter, SRC.contactUs, SRC.emma, SRC.appointment, SRC.times],
  links: [
    { href: "/answers/contact-uscis-about-delayed-case", label: "What to do about a delayed USCIS case" },
    { href: "/blog/uscis-expedite-request", label: "USCIS expedite requests: who qualifies and how to ask" },
    { href: "/answers/how-to-check-uscis-case-status", label: "How to check your USCIS case status" },
    { href: "/processing-times", label: "USCIS processing times by form and office" },
  ],
};
