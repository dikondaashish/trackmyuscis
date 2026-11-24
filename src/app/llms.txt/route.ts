import { COMPANY } from "@/lib/company";
import { FAQ, FORMS, GUIDES, USCIS_CASE_STATUS, USCIS_PROCESSING_TIMES } from "@/lib/content";
import { ANSWERS } from "@/lib/answers";
import { BLOG_POSTS } from "@/lib/blog";
import { LEGAL_DOCS, POLICY_ORDER } from "@/lib/legal";
import { DIRECTORY, directoryFee } from "@/lib/directory";
import { PT_CHECKED, PT_FORMS, PT_OFFICE_FORMS, officePages, rangeSummary } from "@/lib/processing-times";
import { FEE_SCHEDULE_EDITION, FORM_FACTS, feeSentence } from "@/lib/form-facts";
import { STATUS_PAGES, statusHref } from "@/lib/statuses";

/**
 * llms.txt (https://llmstxt.org): a plain summary of the site for AI assistants.
 * Built from the same content as the pages, so it stays in step with them.
 */
const url = (path: string) => `${COMPANY.siteUrl}${path}`;

export function GET() {
  const lines = [
    "# TrackMyUSCIS",
    "",
    "> TrackMyUSCIS is a free, independent USCIS case tracker. With a free account, people save their U.S. Citizenship and Immigration Services (USCIS) receipt numbers and see each case's current status and history, checked with the official USCIS Case Status API about once a day. The site also explains every case status, each form's fee, documents and steps, and the official processing time for every form and office, in plain English. It is not affiliated with USCIS or the U.S. government and does not give legal advice; USCIS notices and uscis.gov are the official source.",
    "",
    "Key facts:",
    "- A USCIS receipt number is 13 characters: a 3-letter office code (such as IOE, MSC, EAC, WAC, LIN, SRC) followed by 10 digits. It is printed on the receipt notice, Form I-797C.",
    "- Case tracking is free and needs an account: saved receipt numbers are checked with USCIS about once a day and the dashboard shows the status and its history. Email alerts for status changes are not switched on yet.",
    "- The quick receipt number check on the home page needs no account and runs in the browser; that number is not sent to TrackMyUSCIS or stored, and the check does not show a status.",
    `- Official case status: ${USCIS_CASE_STATUS}`,
    `- Official processing times: ${USCIS_PROCESSING_TIMES}`,
    "- Only licensed attorneys and DOJ-accredited representatives may give immigration legal advice.",
    "",
    "## Tools",
    "",
    `- [Case tracker](${url("/sign-up")}): Free account that saves USCIS receipt numbers and shows each case's current status and history, checked about once a day.`,
    `- [Receipt number check](${url("/#track")}): Checks a USCIS receipt number's format and tells you which office issued it. No account needed.`,
    `- [Processing times](${url("/processing-times")}): The official USCIS processing time for each form, category and office, read every month, and how to read the number.`,
    `- [Find an immigration lawyer](${url("/lawyers")}): Where to find free or low-cost immigration legal help and how to check that a lawyer or representative is real. The TrackMyUSCIS lawyer directory is not open yet.`,
    `- [Case statuses explained](${url("/status-explained")}): Plain-English meaning of each common USCIS case status, what to do and what usually comes next. Each status has its own page.`,
    "",
    "## Processing times by form",
    "",
    `Official USCIS times (80% of cases finished within), read for every office on ${PT_CHECKED}:`,
    ...PT_FORMS.map((p) => `- [Form ${p.form.form} processing time](${url(`/processing-times/${p.form.slug}`)}): ${rangeSummary(p)}.`),
    "",
    "## Processing times by field office",
    "",
    ...PT_OFFICE_FORMS.flatMap((p) => {
      const pages = officePages(p);
      return [
        `Form ${p.form.form} has a page for each of ${pages.length} USCIS field offices at ${url(`/processing-times/${p.form.slug}/`)}<office>, for example:`,
        ...pages.filter((o) => ["new-york-city-ny", "los-angeles-ca", "houston-tx", "chicago-il", "miami-fl", "seattle-wa"].includes(o.slug)).map((o) => `- [Form ${p.form.form} processing time in ${o.name}](${url(`/processing-times/${p.form.slug}/${o.slug}`)})`),
        "",
      ];
    }),
    "",
    "## USCIS forms",
    "",
    `Fees are from the USCIS Fee Schedule (Form G-1055), edition ${FEE_SCHEDULE_EDITION}.`,
    ...FORMS.map((f) => {
      const fee = feeSentence(f.slug);
      const facts = FORM_FACTS[f.slug];
      return `- [Form ${f.form}: ${f.title}](${url(`/forms/${f.slug}`)}): ${f.about}${fee ? ` General filing fee: ${fee}.` : ""}${facts ? ` Current edition: ${facts.edition}.` : ""}`;
    }),
    "",
    "## Guides",
    "",
    ...GUIDES.map((g) => `- [${g.title}](${url(`/guides/${g.slug}`)}): ${g.summary}`),
    `- [Avoid immigration scams](${url("/scams")}): ${LEGAL_DOCS.scams.summary}`,
    "",
    "## Blog",
    "",
    ...BLOG_POSTS.map((p) => `- [${p.title}](${url(`/blog/${p.slug}`)}): ${p.answer}`),
    "",
    "## Answers",
    "",
    ...ANSWERS.map((a) => `- [${a.question}](${url(`/answers/${a.slug}`)}): ${a.short}`),
    "",
    "## Case statuses",
    "",
    ...STATUS_PAGES.map((s) => `- [${s.name}](${url(statusHref(s))}): ${s.short ?? s.meaning}`),
    "",
    "## Common questions",
    "",
    ...FAQ.flatMap((q) => [`- ${q.q} ${q.a}`]),
    "",
    "## Optional",
    "",
    `- [About](${url("/about")}): What TrackMyUSCIS does, where its information comes from and how it is paid for.`,
    `- [Contact](${url("/contact")}): ${COMPANY.email.support}`,
    `- [List your immigration practice](${url("/lawyers/join")}): For lawyers. Licensed immigration attorneys and DOJ-accredited representatives can apply to be listed in the TrackMyUSCIS lawyer directory. ${DIRECTORY.freeAtLaunch ? `Free while the directory is launching, then a flat ${directoryFee}.` : `A flat ${directoryFee}.`} It is an advertising fee, never a fee per client or a share of legal fees, and every license is checked before a listing appears.`,
    ...POLICY_ORDER.map((k) => `- [${LEGAL_DOCS[k].title}](${url(`/${k}`)}): ${LEGAL_DOCS[k].summary}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
