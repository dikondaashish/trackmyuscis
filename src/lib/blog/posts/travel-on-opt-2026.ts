/**
 * Facts checked 2026-11-24 against ICE's "Travel" FAQ for F and M students (updated 07/08/2025)
 * and the USCIS OPT page (see opt-sources.ts).
 */
import cover from "@/assets/blog/travel-on-opt-2026.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const travelOnOpt2026: BlogPost = {
  slug: "travel-on-opt-2026",
  title: "Can you travel on OPT? What to carry and when it's risky",
  seoTitle: "Can You Travel on OPT? Documents and Risks (2026)",
  description:
    "You can travel on OPT, but timing matters. What to carry to re-enter, why travel while OPT is pending is risky, and when you can't come back.",
  topic: "Students & OPT",
  published: "2026-11-12",
  author: "charlie",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A graduate at an airport gate holds a passport and a folder of documents, with a plane outside and a checklist beside her",
  },
  answer:
    "Yes, you can travel and come back on OPT, but bring the right documents and watch the timing. ICE says that once your OPT is approved you'll be expected to show your work permit (EAD) to re-enter, along with your I-20 endorsed for travel, a valid passport, a valid F-1 visa and a job letter if you have one. Traveling while OPT is pending is allowed but risky, and you can't re-enter during the 60-day grace period after your program or OPT ends.",
  takeaways: [
    "On approved OPT, carry your EAD, an I-20 endorsed for travel by your DSO, a valid passport, a valid F-1 visa and a job letter if you have one.",
    "Your passport should be valid for at least six months after the date you re-enter, unless your country is on ICE's exception list.",
    "Travel while OPT is pending is allowed but risky: USCIS mails requests and the card only to your U.S. address.",
    "If you go over your unemployment limit while abroad, you won't be eligible to re-enter in F-1 status.",
    "You can't re-enter during the 60-day grace period after your program or OPT ends.",
  ],
  sections: [
    {
      id: "documents",
      heading: "What to carry when you re-enter on OPT",
      blocks: [
        {
          kind: "table",
          caption: "Documents for re-entry on approved OPT",
          head: ["Document", "What ICE says"],
          rows: [
            ["Form I-20", "Endorsed for travel and signed by your DSO. Talk to your DSO before you go"],
            ["Passport", "Valid for at least six months after the date you re-enter (some countries are exempt)"],
            ["F-1 visa", "Valid, unless automatic revalidation applies to your trip"],
            ["Work permit (EAD)", "Expected in hand once USCIS has approved your OPT"],
            ["Job letter", "Bring one if you have a job"],
          ],
          note: "Source: [ICE travel FAQ for F and M students](https://www.ice.gov/sevis/travel).",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Expired F-1 visa?",
          text: "You can stay in the U.S. on an expired visa while you keep your status. But to come back from most trips abroad you'll need a new visa, and ICE says to bring your OPT-endorsed I-20 and EAD to the visa appointment.",
        },
      ],
    },
    {
      id: "by-stage",
      heading: "Travel at each stage of OPT",
      blocks: [
        {
          kind: "table",
          caption: "Is travel a good idea?",
          head: ["Your stage", "Can you re-enter?", "What to watch"],
          rows: [
            ["OPT application pending", "Yes, with caution", "USCIS may send a request for evidence while you're away, and it mails the EAD only to a U.S. address"],
            ["OPT approved, not yet working", "Yes, with your EAD", "Unemployment days keep counting while you're away"],
            ["OPT approved and working", "Yes, with your EAD and job letter", "Keep your SEVIS record and employer details current"],
            ["60-day grace period", "No", "The grace period is only for preparing to leave"],
          ],
          note: "Source: [ICE travel FAQ](https://www.ice.gov/sevis/travel).",
        },
      ],
    },
    {
      id: "risks",
      heading: "The biggest risks",
      blocks: [
        [
          "**A request for evidence you can't answer.** If USCIS writes while you're abroad, the letter goes to your U.S. address. Make sure someone can send you what's needed in time.",
          "**A card you can't receive.** USCIS can only mail your EAD to a U.S. address, and ICE expects you to have it in hand to re-enter once OPT is approved.",
          "**Running out of unemployment days abroad.** ICE says that if you exceed the unemployment limit while outside the U.S., you won't be eligible to re-enter in F-1 status. See [the 90-day unemployment rule](/blog/opt-unemployment-90-days).",
          "**Secondary inspection.** Border officers can ask more questions. Carry your documents in your hand luggage, not your checked bag.",
        ],
      ],
    },
    {
      id: "before-you-go",
      heading: "A checklist before you book",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Talk to your DSO", text: "Get a fresh travel signature on your I-20 and confirm your SEVIS record is active and correct." },
            { title: "Check your passport and visa", text: "Six months of passport validity after your return date, and a valid F-1 visa or a plan to get one." },
            { title: "Count your unemployment days", text: "Make sure your trip won't push you past 90 days, or 150 on STEM OPT." },
            { title: "Have a U.S. contact", text: "Someone who can watch your mail and send you an RFE or your card if needed." },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can I travel outside the U.S. while my OPT is pending?",
      a: "Yes, but ICE advises caution. USCIS may send a request for evidence while you're away, and if your OPT is approved you'll be expected to have your EAD in hand to re-enter. USCIS only mails it to a U.S. address.",
    },
    {
      q: "What documents do I need to re-enter on OPT?",
      a: "Your EAD, an I-20 endorsed for travel by your DSO, a passport valid at least six months past your re-entry date, a valid F-1 visa and a job letter if you have one.",
    },
    {
      q: "Can I re-enter during my 60-day grace period?",
      a: "No. ICE says the 60-day grace period after finishing your program or OPT is only for preparing to leave the U.S.",
    },
    {
      q: "Do unemployment days count while I'm traveling?",
      a: "Yes, if you have no employer on record. ICE says exceeding the limit while abroad makes you ineligible to re-enter in F-1 status.",
    },
    {
      q: "Can I travel on OPT with an expired F-1 visa?",
      a: "You can stay in the U.S. with an expired visa, but you'll usually need a new visa to return from abroad, unless automatic revalidation applies to your trip.",
    },
  ],
  sources: [OPT_SRC.iceTravel, OPT_SRC.opt, OPT_SRC.unemploymentCounter],
  links: [
    { href: "/blog/opt-unemployment-90-days", label: "The OPT 90-day unemployment rule" },
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/blog/f1-grace-period-60-days", label: "The F-1 60-day grace period" },
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
  ],
};
