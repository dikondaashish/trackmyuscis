/**
 * Legal documents and long-form trust pages. Rendered by the catch-all route with
 * <LegalDocument>. Plain words, short sections, honest about what is live today.
 *
 * Inline syntax inside any string: [link text](/path or https://…). Email addresses
 * are linked automatically. A string[] inside `body` renders as a bullet list.
 */
import { COMPANY, LEGAL_UPDATED } from "@/lib/company";
import { DISCLAIMER } from "@/lib/site";

export type LegalSection = { id: string; heading: string; body: (string | string[])[] };

export type LegalDoc = {
  title: string;
  /** One line under the title. */
  summary: string;
  /** Search title when it should differ from the on-page title. */
  seoTitle?: string;
  /** Search description, 120–160 characters. */
  description: string;
  /** Shown as "Last updated". Omit for pages that aren't policies. */
  updated?: string;
  sections: LegalSection[];
  /** Listed on /legal and in the footer's Legal column. */
  policy: boolean;
};

const { legalName, incorporation, product, domain, email } = COMPANY;

const USCIS_AVOID_SCAMS = "https://www.uscis.gov/avoid-scams";
const USCIS_COMMON_SCAMS = "https://www.uscis.gov/avoid-scams/common-scams";
const USCIS_FIND_LEGAL = "https://www.uscis.gov/avoid-scams/find-legal-services";
const USCIS_TIP_FORM = "https://www.uscis.gov/report-fraud/uscis-tip-form";
const USCIS_FORMS = "https://www.uscis.gov/forms";
const FTC_REPORT = "https://reportfraud.ftc.gov/";
const DOJ_ROSTER = "https://www.justice.gov/eoir/recognition-accreditation-roster-reports";
const EOIR_PRO_BONO = "https://www.justice.gov/eoir/list-pro-bono-legal-service-providers";
const GPC = "https://globalprivacycontrol.org/";
const AAA_CONSUMER = "https://www.adr.org/consumer";
const WCAG = "https://www.w3.org/TR/WCAG22/";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  /* ------------------------------------------------------------------ terms */
  terms: {
    title: "Terms of Service",
    description:
      "The rules for using TrackMyUSCIS: what the service does, that it is not a law firm or the government, acceptable use, liability limits and how disputes work.",
    summary: `The rules for using ${product}. Please read them. Using the site means you agree to them.`,
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "who-we-are",
        heading: "1. Who we are",
        body: [
          `${product} ("${product}", "we", "us") is operated by ${legalName}, a ${incorporation} corporation. These Terms of Service ("Terms") cover ${domain} and any related services we offer (together, the "Service").`,
          "By using the Service you agree to these Terms and to our [Privacy Policy](/privacy). If you don't agree, please don't use the Service.",
        ],
      },
      {
        id: "what-we-do",
        heading: "2. What the Service does",
        body: [
          `${product} helps people follow a USCIS case. Today it:`,
          [
            "checks that a receipt number is in the right format and tells you which USCIS office issued it",
            "explains case statuses, forms and the usual steps in plain language",
            "links to the official USCIS processing times",
            "publishes immigration guides",
          ],
          "Some features are on their way and are labeled as such on the site, including saved cases, status alerts and the lawyer directory. When they launch, these Terms apply to them too.",
        ],
      },
      {
        id: "not-legal-advice",
        heading: "3. We are not a law firm or the government",
        body: [
          `${product} is not a law firm and does not give legal advice. Nothing on the Service is legal advice, and using it does not create an attorney–client relationship with us.`,
          DISCLAIMER,
          "We cannot see inside, change or speed up your case. Your USCIS notices and uscis.gov are the official source. For advice about your situation, talk to a licensed immigration attorney or a DOJ-accredited representative. See our [Disclaimer](/disclaimer).",
        ],
      },
      {
        id: "accounts",
        heading: "4. Accounts",
        body: [
          "You must be at least 18 years old to create an account. When you have one, you agree to:",
          [
            "give accurate information and keep it up to date",
            "keep your password private and tell us at once if you think someone else has used your account",
            "take responsibility for activity under your account",
          ],
          "We may suspend or close an account that breaks these Terms or puts other people or the Service at risk.",
        ],
      },
      {
        id: "your-information",
        heading: "5. Your information and other people's cases",
        body: [
          "Our [Privacy Policy](/privacy) explains what we collect and why.",
          "Only enter a receipt number or case details for your own case, or for a case you are allowed to manage, such as a family member who has agreed or a client you represent.",
        ],
      },
      {
        id: "acceptable-use",
        heading: "6. Acceptable use",
        body: [
          "You agree not to:",
          [
            "use the Service to break any law, including immigration law",
            "enter another person's case information without their permission",
            "scrape, bulk-query or overload the Service with bots or scripts",
            "try to get into accounts, systems or data that aren't yours",
            "copy, resell or reverse engineer the Service",
            "pretend to be a lawyer, a government official or anyone else",
            "use the lawyer directory to send spam or unwanted solicitations",
          ],
        ],
      },
      {
        id: "lawyer-directory",
        heading: "7. Lawyer directory and sponsored listings",
        body: [
          "Attorneys supply the information in their listings. We check that each attorney is licensed before the listing appears, but we do not recommend or guarantee any attorney, their fees or their results. Any agreement you make with a lawyer is between you and that lawyer.",
          "Some listings are paid placements. They always carry a Sponsored label. Our [Advertising and Lawyer Directory](/advertising) page explains how listings work.",
        ],
      },
      {
        id: "third-party",
        heading: "8. Other websites",
        body: [
          "We link to other sites, such as USCIS, the State Department, the Department of Justice and HealthCare.gov. We don't control them and aren't responsible for their content or their privacy practices.",
        ],
      },
      {
        id: "payments",
        heading: "9. Paid features",
        body: [
          "The Service is free today. If we offer paid plans, we will show the price, how often you are billed, how to cancel and the refund terms before you pay. Our [Refund Policy](/refunds) applies to any payment.",
        ],
      },
      {
        id: "intellectual-property",
        heading: "10. Our content and your license",
        body: [
          `We own the Service, including the ${product} name and logo, our text, design and code. We give you a personal, non-exclusive, non-transferable license to use the Service for your own, non-commercial purposes.`,
          "If you send us feedback or ideas, we may use them without owing you anything.",
          `To report content you believe infringes your copyright, email ${email.legal} with: your contact details, the work you own, where the material is on our site, a statement that you believe in good faith the use isn't authorized, a statement under penalty of perjury that your notice is accurate and that you are the owner or authorized to act for them, and your signature.`,
        ],
      },
      {
        id: "no-warranties",
        heading: "11. No warranties",
        body: [
          'The Service is provided "as is" and "as available". To the fullest extent the law allows, we make no promises that the Service will be accurate, complete, current, uninterrupted or free of errors. Processing times, examples and estimates describe what is typical, not what will happen in your case.',
        ],
      },
      {
        id: "liability",
        heading: "12. Limits on our liability",
        body: [
          `To the fullest extent the law allows, ${product} and its operator, officers, employees and partners are not liable for:`,
          [
            "the outcome of any immigration application, petition or case",
            "missed deadlines, or decisions you make based on the Service",
            "indirect, incidental, special, consequential or punitive damages, or lost profits or data",
          ],
          "Our total liability for any claim about the Service is limited to the greater of the amount you paid us in the 12 months before the claim or 100 US dollars. Some places don't allow these limits, so they may not all apply to you.",
        ],
      },
      {
        id: "indemnity",
        heading: "13. Indemnity",
        body: [
          `If you break these Terms or misuse the Service, you agree to cover our reasonable costs of claims that result, including reasonable legal fees.`,
        ],
      },
      {
        id: "changes",
        heading: "14. Changes and ending these Terms",
        body: [
          "We may update these Terms. We'll post the new version here with a new date and, for important changes, email account holders before they take effect. If you keep using the Service after a change, the new Terms apply.",
          "You can stop using the Service at any time. We may stop offering all or part of it.",
        ],
      },
      {
        id: "disputes",
        heading: "15. Governing law and disputes",
        body: [
          `These Terms are governed by the laws of the State of ${incorporation} and the United States, without regard to conflict-of-law rules.`,
          `If you have a problem, email ${email.legal} first. Most issues can be settled that way, and we'll try for 30 days before either side starts a formal claim.`,
          `If we can't settle it, the dispute will be decided by binding individual arbitration under the [American Arbitration Association Consumer Rules](${AAA_CONSUMER}), held in San Francisco County, California, or by video. Either of us may instead bring an individual claim in small-claims court. Claims may only be brought individually, not as part of a class or representative action.`,
          `You can opt out of arbitration by emailing ${email.legal} within 30 days of first accepting these Terms.`,
        ],
      },
      {
        id: "general",
        heading: "16. General",
        body: [
          "These Terms and our Privacy Policy are the whole agreement between you and us about the Service. If one part is found unenforceable, the rest still applies. If we don't enforce a right straight away, we haven't given it up. We may transfer these Terms as part of a merger or sale; you may not transfer them without our written consent.",
        ],
      },
      {
        id: "contact",
        heading: "17. Contact",
        body: [`General questions: ${email.support}. Legal notices: ${email.legal}.`],
      },
    ],
  },

  /* ---------------------------------------------------------------- privacy */
  privacy: {
    title: "Privacy Policy",
    description:
      "What TrackMyUSCIS collects, why, who sees it and your choices. Receipt numbers you check are not stored, and we never sell personal information.",
    summary: "What we collect, why, who sees it and the choices you have.",
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "short-version",
        heading: "The short version",
        body: [
          [
            "Receipt numbers you check on the homepage are checked in your browser. They are not sent to us or stored.",
            "We don't sell your personal information or share it for targeted advertising.",
            "We don't use advertising or analytics cookies.",
            "We never ask for your A-Number, Social Security number, passport or immigration documents.",
            `You can ask us to see, correct or delete your information at any time: ${email.privacy}.`,
          ],
        ],
      },
      {
        id: "who-we-are",
        heading: "1. Who we are",
        body: [
          `${product} is operated by ${legalName}, which is responsible for your personal information under this policy. It covers ${domain} and any related services (the "Service").`,
        ],
      },
      {
        id: "what-we-collect",
        heading: "2. What we collect",
        body: [
          "Information you type into our tools:",
          [
            "Receipt number check: done entirely in your browser. Nothing you type is sent to us.",
            "Processing-time and lawyer searches: the form, office, location and case type you choose are sent to our server so we can show results.",
          ],
          "Information you give us:",
          [
            "When you email us: your name, email address and what you write.",
            "When accounts launch: your email address, a password (stored only as a secure hash), the receipt numbers you choose to save, the case updates we fetch for you and your alert settings.",
          ],
          "Information collected automatically:",
          [
            "Standard server logs kept by our hosting provider: IP address, browser type, the pages requested and the time. We use them to keep the site secure and working.",
          ],
          "Please don't send us your A-Number, Social Security number, passport details or immigration documents. The Service doesn't need them.",
        ],
      },
      {
        id: "how-we-use",
        heading: "3. How we use it",
        body: [
          [
            "to run the Service and show you the results you ask for",
            "to reply when you contact us",
            "to send the case alerts and account messages you sign up for",
            "to protect the Service, our users and us from fraud, abuse and security threats",
            "to understand, in aggregate, which features are used so we can improve them",
            "to meet legal obligations",
          ],
          "We don't use your information to make automated decisions that have legal or similarly significant effects on you.",
        ],
      },
      {
        id: "sensitive",
        heading: "4. Immigration information",
        body: [
          "Details about an immigration case can be sensitive. We use them only to provide the features you ask for. We never use them for advertising or profiling, and we never share them with USCIS or any government agency unless the law requires it.",
        ],
      },
      {
        id: "sharing",
        heading: "5. Who we share it with",
        body: [
          [
            "Service providers who help us run the Service, such as hosting, email delivery and, if we offer paid plans, payment processing. They may only use it to provide their service to us.",
            "A lawyer you choose to contact through the directory, when that feature is live. They receive what you send them.",
            "Authorities, when the law requires it or to protect someone's safety, rights or property.",
            "A buyer or successor, if our business is merged or sold. This policy would still protect your information.",
            "Anyone else, only with your permission.",
          ],
          "We do not sell personal information, and we do not share it for cross-context behavioral advertising.",
        ],
      },
      {
        id: "cookies",
        heading: "6. Cookies",
        body: ["We use only cookies the site needs to work. Our [Cookie Policy](/cookies) has the details."],
      },
      {
        id: "retention",
        heading: "7. How long we keep it",
        body: [
          [
            "Server logs: up to 90 days, unless we need them longer to investigate abuse.",
            "Emails with us: up to 24 months after the conversation ends.",
            "Account information: while your account is open. When you delete it, we delete your information within 30 days, apart from backups, which are overwritten within a further 90 days, and anything the law requires us to keep.",
          ],
        ],
      },
      {
        id: "security",
        heading: "8. Security",
        body: [
          "Every page is served over an encrypted (HTTPS) connection, access to personal information is limited to people who need it, and passwords are stored only as secure hashes. No system is perfectly secure, so we can't guarantee absolute security. Our [Security](/security) page explains more and how to report a problem.",
        ],
      },
      {
        id: "your-rights",
        heading: "9. Your rights and choices",
        body: [
          "Wherever you live, you can ask us to:",
          [
            "tell you what personal information we hold about you and give you a copy",
            "correct information that is wrong",
            "delete your information",
            "stop sending you emails (every alert email will have an unsubscribe link)",
          ],
          `To make a request, email ${email.privacy} from the address linked to your account, or see [Your Privacy Choices](/privacy-choices). We will confirm it's you before acting, and reply within 45 days. You may use an authorized agent. If we turn down your request, you can appeal by replying to our answer. We will never treat you differently for using these rights.`,
        ],
      },
      {
        id: "us-states",
        heading: "10. California and other U.S. state rights",
        body: [
          "If you live in California or another state with a privacy law, you have the rights above plus the right to opt out of the sale or sharing of your personal information and to limit the use of sensitive personal information. We don't sell or share personal information and we already limit sensitive information to providing the Service, so there is nothing you need to switch off.",
          `In the past 12 months we have collected these categories: identifiers (such as email and IP address), internet activity (server logs) and, for account holders, immigration case information you chose to save. We collect them for the purposes in section 3. We honor [Global Privacy Control](${GPC}) signals as a request to opt out.`,
        ],
      },
      {
        id: "eea-uk",
        heading: "11. Visitors from the EEA, UK and Switzerland",
        body: [
          "We process your information to provide the Service you ask for (contract), for our legitimate interests in running and securing it, to meet legal obligations and, where needed, with your consent. You can also object to or restrict our processing, and complain to your local data protection authority.",
          "We are based in the United States and process information there. Where the law requires it, we use approved safeguards such as standard contractual clauses for transfers.",
        ],
      },
      {
        id: "children",
        heading: "12. Children",
        body: [
          "The Service is not directed to children under 13, and accounts are for adults 18 and over. We don't knowingly collect personal information from children under 13. If you believe a child has given us information, email us and we will delete it.",
        ],
      },
      {
        id: "changes",
        heading: "13. Changes to this policy",
        body: [
          "We'll post any change here with a new date. If a change is important, we'll email account holders before it takes effect.",
        ],
      },
      {
        id: "contact",
        heading: "14. Contact",
        body: [`Privacy questions and requests: ${email.privacy}.`],
      },
    ],
  },

  /* ---------------------------------------------------------------- cookies */
  cookies: {
    title: "Cookie Policy",
    description:
      "TrackMyUSCIS uses only the cookies the site needs to work. No advertising or tracking cookies. What that covers today and how to control cookies.",
    summary: "We use only the cookies the site needs to work. No advertising or tracking cookies.",
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "what-are-cookies",
        heading: "1. What cookies are",
        body: [
          "Cookies are small files a website stores in your browser. Similar tools, such as local storage, work the same way. We call them all cookies here.",
        ],
      },
      {
        id: "what-we-use",
        heading: "2. What we use today",
        body: [
          `${product} works without setting cookies of its own. Our hosting provider may set strictly necessary cookies to protect the site from attacks and abuse. These don't track you across other sites.`,
          "We do not use advertising, analytics or social-media cookies.",
        ],
      },
      {
        id: "accounts",
        heading: "3. When accounts launch",
        body: [
          "We will add one strictly necessary cookie that keeps you signed in. The site can't keep you signed in without it, so it doesn't need consent. It is deleted when you sign out or when it expires.",
        ],
      },
      {
        id: "future",
        heading: "4. If anything changes",
        body: [
          "If we ever add analytics, we'll update this page first, choose a privacy-friendly tool and ask for your consent where the law requires it. We treat [Global Privacy Control](" +
            GPC +
            ") signals as an opt-out.",
        ],
      },
      {
        id: "control",
        heading: "5. Controlling cookies",
        body: [
          "You can block or delete cookies in your browser settings. If you block strictly necessary cookies, parts of the site, such as signing in, may stop working.",
        ],
      },
      {
        id: "contact",
        heading: "6. Contact",
        body: [`Questions about cookies: ${email.privacy}.`],
      },
    ],
  },

  /* -------------------------------------------------------- privacy choices */
  "privacy-choices": {
    title: "Your Privacy Choices",
    description:
      "TrackMyUSCIS doesn't sell your personal information or share it for targeted ads. How to see, correct or delete your information and appeal a decision.",
    summary: "We don't sell your personal information or share it for targeted advertising. Here is how to use your rights.",
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "sell-share",
        heading: "Do not sell or share my personal information",
        body: [
          "We don't sell personal information, and we don't share it for cross-context behavioral advertising. There is nothing to switch off.",
          `If your browser sends a [Global Privacy Control](${GPC}) signal, we treat it as an opt-out request automatically.`,
        ],
      },
      {
        id: "sensitive",
        heading: "Limit the use of my sensitive information",
        body: [
          "We use immigration case details only to provide the features you ask for. We never use them for advertising or profiling.",
        ],
      },
      {
        id: "requests",
        heading: "See, correct or delete your information",
        body: [
          `Email ${email.privacy} with the subject "Privacy request", from the email address linked to your account if you have one. Tell us what you'd like us to do. We'll confirm it's you and reply within 45 days.`,
          "Someone you authorize can make a request for you. We'll ask for proof that they have your permission.",
        ],
      },
      {
        id: "emails",
        heading: "Emails",
        body: ["Every alert or account email will include an unsubscribe link. Messages we must send, such as security notices, can't be switched off while you have an account."],
      },
      {
        id: "appeals",
        heading: "Appeals",
        body: ["If we decline your request, reply to our answer to appeal. We'll respond within 60 days."],
      },
      {
        id: "more",
        heading: "More detail",
        body: ["Our [Privacy Policy](/privacy) explains everything we collect and why."],
      },
    ],
  },

  /* ------------------------------------------------------------- disclaimer */
  disclaimer: {
    title: "Disclaimer",
    description:
      "TrackMyUSCIS is independent and not affiliated with USCIS or the U.S. government. Its content is general information, not legal advice.",
    summary: DISCLAIMER,
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "not-government",
        heading: "Not affiliated with USCIS or the U.S. government",
        body: [
          `${product} is an independent website. It is not affiliated with, endorsed by or operated by U.S. Citizenship and Immigration Services (USCIS), the Department of Homeland Security, the Department of State or any government agency.`,
          `Official forms are free on [uscis.gov](${USCIS_FORMS}). Your USCIS notices and online account are the official record of your case.`,
        ],
      },
      {
        id: "not-legal-advice",
        heading: "Not legal advice",
        body: [
          `${product} is not a law firm. Information on this site is general and is not legal advice. Using the site does not create an attorney–client relationship. For advice about your case, talk to a licensed immigration attorney or a [DOJ-accredited representative](${DOJ_ROSTER}).`,
        ],
      },
      {
        id: "accuracy",
        heading: "Information can change",
        body: [
          "Processing times, fees and procedures are set by USCIS and change often. We work to keep pages current, but always check the official source before you act.",
          "Charts and numbers marked Example are illustrations of how the site will show data. They are not real statistics or a prediction for your case.",
          "The receipt number check confirms the format and the issuing office. It does not show your official case status yet.",
        ],
      },
      {
        id: "lawyers",
        heading: "Lawyer listings",
        body: [
          "Listings in the lawyer directory are written by attorneys and may be considered attorney advertising. Past results do not guarantee a similar outcome. We check that attorneys are licensed but don't recommend any particular one.",
        ],
      },
      {
        id: "urgent",
        heading: "If you need help urgently",
        body: [
          `If you or a family member is detained or facing removal, contact an immigration attorney right away. The Department of Justice keeps a [list of free legal service providers](${EOIR_PRO_BONO}).`,
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ advertising */
  advertising: {
    title: "Advertising and Lawyer Directory",
    description:
      "How TrackMyUSCIS makes money, how lawyers in the directory are license-checked and how sponsored listings are labeled so you always know what is an ad.",
    summary: "How we make money, how lawyers are checked and how sponsored listings are labeled.",
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "how-we-earn",
        heading: "How we make money",
        body: [
          `${product} is free to use. We plan to earn money from sponsored placements in the lawyer directory and, later, from optional paid features. We never sell your personal information.`,
          "Sponsors never pay for, review or change our guides, status explanations or processing-time information.",
        ],
      },
      {
        id: "sponsored",
        heading: "Sponsored listings",
        body: [
          "A sponsored listing is a paid placement. Every one carries a clear Sponsored label, so you always know what is an ad. Other results are ordered by how well they match your search, such as location and case type.",
        ],
      },
      {
        id: "verification",
        heading: "How we check lawyers",
        body: [
          "Before a listing appears, we confirm the attorney is licensed and in good standing with at least one U.S. state bar. Immigration law is federal, so a lawyer licensed in any state can handle immigration cases anywhere in the country. Accredited representatives must appear on the Department of Justice roster.",
          "We re-check every listing at least once a year and remove listings that no longer qualify.",
          "Being listed, verified or sponsored is not a recommendation. Choose a lawyer the way you would any professional: ask about fees in writing, check reviews and confirm their license yourself.",
        ],
      },
      {
        id: "attorney-advertising",
        heading: "Attorney advertising",
        body: [
          "Listing text comes from the attorneys themselves and may be considered attorney advertising under state bar rules. Past results do not guarantee a similar outcome.",
        ],
      },
      {
        id: "notarios",
        heading: "Only lawyers and accredited representatives can advise you",
        body: [
          `A "notario público", notary or immigration consultant is not allowed to give immigration legal advice in the United States. See [how to find legal help safely](${USCIS_FIND_LEGAL}) and our page on [avoiding immigration scams](/scams).`,
        ],
      },
      {
        id: "links",
        heading: "Links to other services",
        body: [
          "We link to helpful services, such as HealthCare.gov. We don't earn a commission from these links today. If a link ever earns us money, we'll say so next to it.",
        ],
      },
      {
        id: "report",
        heading: "Report a listing",
        body: [`If a listing looks wrong or misleading, email ${email.support} and we'll review it.`],
      },
      {
        id: "for-lawyers",
        heading: "For lawyers",
        body: [
          `Listings must be accurate and follow the advertising rules of every bar you belong to. We may edit or remove any listing that doesn't. To join the directory, email ${email.support}.`,
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- refunds */
  refunds: {
    title: "Refund Policy",
    description:
      "Everything on TrackMyUSCIS is free today, so there is nothing to refund. What the rules will be if paid plans are added, and how to report a billing error.",
    summary: `Everything on ${product} is free today, so there is nothing to refund.`,
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "today",
        heading: "Today",
        body: [`We don't charge for anything. No card is ever needed to use ${product}.`],
      },
      {
        id: "paid-plans",
        heading: "If we add paid plans",
        body: [
          "Before you pay, we will show the price, how often you will be billed, how to cancel and the refund terms. The full terms will be published on this page before any paid plan launches.",
          "You'll be able to cancel at any time. Cancelling stops future charges.",
        ],
      },
      {
        id: "errors",
        heading: "Billing errors",
        body: [`We will always refund a charge made in error or without your permission. Email ${email.support}.`],
      },
    ],
  },

  /* --------------------------------------------------------------- security */
  security: {
    title: "Security",
    description:
      "How TrackMyUSCIS protects the service and your information, how to spot someone impersonating us and how to report a security vulnerability.",
    summary: "How we protect the Service and how to report a security problem.",
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "how-we-protect",
        heading: "How we protect your information",
        body: [
          [
            "Every page is served over an encrypted HTTPS connection.",
            "The receipt number check runs in your browser, so the number never reaches our servers.",
            "We never ask for A-Numbers, Social Security numbers or immigration documents.",
            "Passwords will be stored only as secure hashes, never as plain text.",
            "Only the people who need access to personal information to run the Service have it.",
            "We keep our software and its dependencies up to date.",
          ],
        ],
      },
      {
        id: "phishing",
        heading: "Watch out for impersonation",
        body: [
          `We will never ask for your USCIS online account password, ask you to pay a USCIS fee through us, or ask for payment in gift cards. Real emails from us come only from @${domain} addresses. If you get a suspicious message using our name, forward it to ${email.security}.`,
        ],
      },
      {
        id: "report",
        heading: "Report a vulnerability",
        body: [
          `Email ${email.security} with a description of the problem and the steps to reproduce it. We will acknowledge your report within 3 business days and keep you updated while we fix it.`,
          "Please:",
          [
            "only test against your own account and data",
            "don't access, change or delete other people's information",
            "don't run denial-of-service, spam or social-engineering tests",
            "give us a reasonable time to fix the issue, normally 90 days, before you disclose it publicly",
          ],
          "We won't take legal action against good-faith research that follows these rules.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- accessibility */
  accessibility: {
    title: "Accessibility",
    description:
      "TrackMyUSCIS aims to meet WCAG 2.2 AA so everyone can use it on any device or assistive technology. Known limitations and how to report a problem.",
    summary: `We want everyone to be able to use ${product}, whatever device or assistive technology they use.`,
    updated: LEGAL_UPDATED,
    policy: true,
    sections: [
      {
        id: "standard",
        heading: "Our standard",
        body: [`We design and test the site to meet the [Web Content Accessibility Guidelines (WCAG) 2.2](${WCAG}) at level AA.`],
      },
      {
        id: "what-we-do",
        heading: "What that means in practice",
        body: [
          [
            "Every page works with a keyboard and shows a clear focus outline.",
            "Every form field has a visible label, and errors are explained next to the field.",
            "Text meets contrast requirements, and the site works when zoomed to 200% or on a 320-pixel-wide screen.",
            "Buttons and links are large enough to tap: at least 44 by 44 pixels.",
            "Photos have text descriptions, and charts have a written summary.",
            "Animation is turned off if you ask your device to reduce motion.",
          ],
        ],
      },
      {
        id: "limitations",
        heading: "Known limitations",
        body: [
          "The extra detail shown when you hover over a chart bar isn't available to keyboard users. The chart's written summary covers the same information.",
          "Sites we link to, such as uscis.gov, are run by others and may not meet the same standard.",
        ],
      },
      {
        id: "feedback",
        heading: "Tell us about a problem",
        body: [
          `If something is hard to use, email ${email.support} with "Accessibility" in the subject. Tell us the page and what happened. We'll reply within 5 business days and can give you the information in another format.`,
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ scams */
  scams: {
    title: "Avoid immigration scams",
    seoTitle: "How to Avoid Immigration Scams: Rules and Warning Signs",
    description:
      "Five rules to avoid immigration scams, the warning signs to watch for, how to find real legal help and where to report a scam to USCIS and the FTC.",
    summary: "Scammers target people waiting on USCIS. These simple rules keep you and your case safe.",
    policy: false,
    sections: [
      {
        id: "rules",
        heading: "Five rules to remember",
        body: [
          [
            `USCIS forms are free. Download them only from [uscis.gov/forms](${USCIS_FORMS}).`,
            "USCIS never asks for payment by phone, email, gift card, wire transfer or a payment app.",
            "Real USCIS emails come from addresses ending in uscis.gov or dhs.gov.",
            "Only a licensed attorney or a DOJ-accredited representative can give immigration legal advice. Notarios, notaries and consultants cannot.",
            "No one can pay to make USCIS decide your case faster, except through official premium processing on eligible forms.",
          ],
        ],
      },
      {
        id: "warning-signs",
        heading: "Warning signs",
        body: [
          [
            "Someone guarantees approval or a faster decision.",
            "Someone asks you to sign a blank form or one with false information.",
            "Someone keeps your original documents or won't give you copies of what they filed.",
            "Someone threatens deportation unless you pay right away.",
          ],
          `USCIS keeps a list of [common scams](${USCIS_COMMON_SCAMS}).`,
        ],
      },
      {
        id: "find-help",
        heading: "Find real legal help",
        body: [
          `Check a lawyer's license on their state bar's website, or find a recognized organization on the [Department of Justice roster](${DOJ_ROSTER}). For free or low-cost help, see the [DOJ list of pro bono providers](${EOIR_PRO_BONO}) and USCIS guidance on [finding legal services](${USCIS_FIND_LEGAL}).`,
        ],
      },
      {
        id: "report",
        heading: "Report a scam",
        body: [
          [
            `To USCIS: use the [USCIS tip form](${USCIS_TIP_FORM}).`,
            `To the Federal Trade Commission: [reportfraud.ftc.gov](${FTC_REPORT}).`,
            `If someone is using the ${product} name: email ${email.security}.`,
          ],
          `More from USCIS: [Avoid scams](${USCIS_AVOID_SCAMS}).`,
        ],
      },
    ],
  },
};

/** Policies in the order they appear on /legal and in the footer. */
export const POLICY_ORDER = [
  "terms",
  "privacy",
  "cookies",
  "privacy-choices",
  "disclaimer",
  "advertising",
  "refunds",
  "security",
  "accessibility",
] as const;
