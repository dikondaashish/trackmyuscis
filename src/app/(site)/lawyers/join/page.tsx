import { Check } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/ui/PageIntro";
import { RichText } from "@/components/ui/RichText";
import { COMPANY } from "@/lib/company";
import { DOJ_ROSTER } from "@/lib/content";
import { DIRECTORY, directoryFee } from "@/lib/directory";
import { breadcrumbSchema, faqSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { btnPrimary, panel, readContainer, rowPad, rows, section } from "@/lib/ui";
import { JoinForm } from "./JoinForm";

const PATH = "/lawyers/join";
const perDay = `$${Math.round(DIRECTORY.annualFee / 365)} a day`;
const DESCRIPTION = `Immigration attorneys and DOJ-accredited representatives can apply to be listed on TrackMyUSCIS. Free during launch, then ${directoryFee}. Licenses checked.`;

export const metadata = pageMetadata({
  title: "Immigration Lawyer Directory: List Your Practice",
  description: DESCRIPTION,
  path: PATH,
});

const NOTICE = `We'll email you at least ${DIRECTORY.noticeDays} days before the first invoice, and you can leave the directory instead of paying.`;

const STEPS = [
  { title: "Send your details", body: "Fill in the form below. It takes about five minutes and there is nothing to pay." },
  {
    title: "We check your license",
    body: `We look up attorneys with their state bar and accredited representatives on the [Department of Justice roster](${DOJ_ROSTER}), then email you the result.`,
  },
  {
    title: "Your profile goes live",
    body: "Once your license checks out, you get your own profile page and a place in our [Find a lawyer](/lawyers) search, by state and kind of case. We email you when it's live.",
  },
];

const COST = [
  DIRECTORY.freeAtLaunch
    ? `Free while the directory is launching. After launch, a listing is ${directoryFee}, which is ${perDay}.`
    : `A listing is ${directoryFee}, which is ${perDay}.`,
  "One flat price for every lawyer, sent as an invoice by email. We don't ask for a card when you apply.",
  ...(DIRECTORY.freeAtLaunch ? [NOTICE] : []),
  "It is an advertising fee. We never charge per client or per lead, and we never take a share of your legal fees.",
  "The fee doesn't buy a better position. People see listings by how well they match their search, such as location and kind of case.",
];

const WHO = [
  "Attorneys licensed and in good standing with the bar of any U.S. state or territory.",
  "Representatives accredited by the Department of Justice who work for a recognized organization.",
  "Not eligible: notarios, immigration consultants and document preparers. They may not give immigration legal advice in the United States.",
];

const FAQ = [
  {
    q: "How much does a listing cost?",
    a: DIRECTORY.freeAtLaunch
      ? `Nothing while the directory is launching. After launch, a listing is ${directoryFee}, which is ${perDay}. ${NOTICE}`
      : `${directoryFee}, which is ${perDay}, sent as one invoice by email.`,
  },
  {
    q: "Do you charge per lead or take a share of fees?",
    a: "No. The fee is a flat advertising fee, the same for every lawyer. We don't charge per client, per lead or per case, and we never share in legal fees.",
  },
  {
    q: "How do you check a license?",
    a: "We look up each attorney on the website of the state bar they name and confirm the license is active and in good standing. Accredited representatives must appear on the Department of Justice roster. We check every listing again at least once a year.",
  },
  {
    q: "When will my listing appear?",
    a: "As soon as we've checked your license. Your listing then appears on our Find a lawyer page and we email you to say it's live.",
  },
  {
    q: "Can people leave reviews?",
    a: "Yes. Signed-in TrackMyUSCIS members can rate you and write a short review. We check each one against our review rules before it appears, and we publish negative reviews too. No lawyer can pay to change or remove a review, and you may not review yourself or offer anything for a review. If a review breaks the rules, email us.",
  },
  {
    q: "Can I change or remove my listing?",
    a: `Yes, at any time. Email ${COMPANY.email.support} from the address you applied with and we'll update or remove it.`,
  },
];

export default function JoinDirectoryPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "List your immigration practice on TrackMyUSCIS", description: DESCRIPTION, path: PATH }),
          faqSchema(FAQ),
          breadcrumbSchema([
            { name: "Find a lawyer", path: "/lawyers" },
            { name: "List your practice", path: PATH },
          ]),
        ]}
      />
      <PageIntro
        title="List your immigration practice"
        description="Reach people who are following a USCIS case. For licensed immigration attorneys and DOJ-accredited representatives."
        back={{ href: "/lawyers", label: "Find a lawyer" }}
        width={readContainer}
      >
        <a href="#apply" className={btnPrimary}>
          Apply to be listed
        </a>
        <p className="mt-4 text-small text-slate">
          {DIRECTORY.freeAtLaunch ? `Free during launch, then ${directoryFee}.` : `${directoryFee}, one flat price.`} No card needed to apply.
        </p>
      </PageIntro>

      <section className={section}>
        <div className={readContainer}>
          <h2 className="text-h3 font-semibold text-midnight">How it works</h2>
          <ol className={`mt-6 ${panel}`}>
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 pb-6 last:pb-0">
                {i < STEPS.length - 1 && <span aria-hidden className="absolute top-9 bottom-0 left-[17px] w-0.5 bg-border" />}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue tabular-nums">
                  {i + 1}
                </span>
                <span className="pt-1">
                  <span className="block text-title font-semibold text-midnight">{s.title}</span>
                  <span className="mt-1 block text-body text-slate">
                    <RichText text={s.body} />
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">What it costs</h2>
          <ul className={`mt-6 ${rows}`}>
            {COST.map((c) => (
              <li key={c} className={`flex items-start gap-3 ${rowPad} py-4 text-body text-midnight`}>
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.5} />
                {c}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">Who can be listed</h2>
          <ul className={`mt-6 ${rows}`}>
            {WHO.map((w) => (
              <li key={w} className={`${rowPad} py-4 text-body text-midnight`}>
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-small text-slate">
            <RichText text="Being listed is not a recommendation by TrackMyUSCIS, and listings may count as attorney advertising under your bar's rules. See [how the directory works](/advertising)." />
          </p>

          <h2 id="apply" className="jump-target mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">
            Apply to be listed
          </h2>
          <p className="mt-3 text-body text-slate">
            What you enter here becomes your profile page, apart from your bar number and email, which we use only to check your license
            and reach you. Only the fields marked optional can be left empty.
          </p>
          <div className={`mt-6 ${panel} sm:p-8`}>
            <JoinForm feeLine={DIRECTORY.freeAtLaunch ? `After launch a listing is ${directoryFee}. ${NOTICE}` : `We'll email your invoice for ${directoryFee} once your license is checked.`} />
          </div>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">Common questions</h2>
          <div className={`mt-6 ${rows}`}>
            {FAQ.map((q) => (
              <div key={q.q} className={`${rowPad} py-5`}>
                <h3 className="text-title font-semibold text-midnight">{q.q}</h3>
                <p className="mt-1 text-body text-slate">{q.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
