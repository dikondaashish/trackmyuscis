import { COMPANY } from "@/lib/company";
import { FAQ, FORMS, GUIDES, STATUSES, USCIS_CASE_STATUS, USCIS_PROCESSING_TIMES } from "@/lib/content";
import { ANSWERS } from "@/lib/answers";
import { BLOG_POSTS } from "@/lib/blog";
import { LEGAL_DOCS, POLICY_ORDER } from "@/lib/legal";
import { PT_CHECKED, PT_FORMS, rangeSummary } from "@/lib/processing-times";

/**
 * llms.txt (https://llmstxt.org): a plain summary of the site for AI assistants.
 * Built from the same content as the pages, so it stays in step with them.
 */
const url = (path: string) => `${COMPANY.siteUrl}${path}`;

export function GET() {
  const lines = [
    "# TrackMyUSCIS",
    "",
    "> TrackMyUSCIS is a free, independent website that helps people follow a U.S. Citizenship and Immigration Services (USCIS) case in plain English: decoding receipt numbers, explaining case statuses and the usual steps for each form, pointing to official processing times and helping people find immigration legal help. It is not affiliated with USCIS or the U.S. government and does not give legal advice; USCIS notices and uscis.gov are the official source.",
    "",
    "Key facts:",
    "- A USCIS receipt number is 13 characters: a 3-letter office code (such as IOE, MSC, EAC, WAC, LIN, SRC) followed by 10 digits. It is printed on the receipt notice, Form I-797C.",
    "- The receipt number check on TrackMyUSCIS runs in the browser; the number is not sent to TrackMyUSCIS or stored.",
    `- Official case status: ${USCIS_CASE_STATUS}`,
    `- Official processing times: ${USCIS_PROCESSING_TIMES}`,
    "- Only licensed attorneys and DOJ-accredited representatives may give immigration legal advice.",
    "",
    "## Tools",
    "",
    `- [Receipt number check](${url("/#track")}): Checks a USCIS receipt number's format and tells you which office issued it.`,
    `- [Processing times](${url("/processing-times")}): How to check how long USCIS is taking for your form and office on the official USCIS tool, and how to read the number.`,
    `- [Find an immigration lawyer](${url("/lawyers")}): Where to find free or low-cost immigration legal help and how to check that a lawyer or representative is real. The TrackMyUSCIS lawyer directory is not open yet.`,
    `- [Case statuses explained](${url("/status-explained")}): Plain-English meaning of each common USCIS case status and what usually comes next.`,
    "",
    "## Processing times by form",
    "",
    `Official USCIS times (80% of cases finished within), read for every office on ${PT_CHECKED}:`,
    ...PT_FORMS.map((p) => `- [Form ${p.form.form} processing time](${url(`/processing-times/${p.form.slug}`)}): ${rangeSummary(p)}.`),
    "",
    "## USCIS forms",
    "",
    ...FORMS.map((f) => `- [Form ${f.form}: ${f.title}](${url(`/forms/${f.slug}`)}): ${f.about}`),
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
    ...STATUSES.map((s) => `- ${s.name}: ${s.meaning}`),
    "",
    "## Common questions",
    "",
    ...FAQ.flatMap((q) => [`- ${q.q} ${q.a}`]),
    "",
    "## Optional",
    "",
    `- [About](${url("/about")}): What TrackMyUSCIS does, where its information comes from and how it is paid for.`,
    `- [Contact](${url("/contact")}): ${COMPANY.email.support}`,
    ...POLICY_ORDER.map((k) => `- [${LEGAL_DOCS[k].title}](${url(`/${k}`)}): ${LEGAL_DOCS[k].summary}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
