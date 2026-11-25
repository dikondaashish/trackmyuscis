import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Phone, Search, Share2, ShieldCheck, Star, UserRound, X } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ListingCard } from "@/components/lawyers/LawyerBits";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { RichText } from "@/components/ui/RichText";
import { COMPANY } from "@/lib/company";
import { DOJ_ROSTER } from "@/lib/content";
import { DIRECTORY, directoryFee } from "@/lib/directory";
import { breadcrumbSchema, faqSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import type { Listing } from "@/lib/directory-listings";
import { btnPrimary, btnSecondary, card, container, focusRing, h2, panel, readContainer, rowPad, rows, section } from "@/lib/ui";
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

/** What the example card on this page shows. Clearly labelled "Example"; never shown as a real listing. */
const EXAMPLE: Listing = {
  slug: "example",
  role: "attorney",
  fullName: "Your Name",
  firmName: "Your Law Firm",
  phone: "",
  website: null,
  photoUrl: null,
  barState: "TX",
  licensedSince: 2015,
  licenseCheckedOn: null,
  officeStreet: null,
  officeCity: "Houston",
  officeState: "TX",
  officeZip: null,
  languages: "English, Spanish",
  practiceAreas: ["family", "work-visas", "citizenship"],
  consultationModes: ["video", "in_person"],
  freeConsultation: true,
  consultationFee: null,
  education: [],
  career: [],
  bio: "",
  updated: "2026-11-24",
  rating: null,
};

const BENEFITS = [
  {
    icon: UserRound,
    title: "Your own profile page",
    body: "Photo, bio, cases you take, languages, consultation fee, office, education and career, on a page with its own address. Set up so search engines can read your details.",
  },
  {
    icon: Search,
    title: "Found by state and kind of case",
    body: "People search by state, city and case type, next to the USCIS guides they read while their case is pending.",
  },
  {
    icon: ShieldCheck,
    title: "A license-checked badge",
    body: "We check your license before you're listed and show the date, so people can see you're real before they call.",
  },
  {
    icon: Star,
    title: "Reviews that carry weight",
    body: "Signed-in members rate you, and we check every review against public rules. Nobody can buy or remove one, so good reviews mean something.",
  },
  {
    icon: Share2,
    title: "Easy to share",
    body: "Share buttons for Facebook, LinkedIn, X, WhatsApp and email, and a clean link for your website or email signature.",
  },
  {
    icon: Phone,
    title: "People contact you directly",
    body: "Calls go to your office and clicks go to your website. No middleman, no per-lead fees and no share of your legal fees.",
  },
];

const INCLUDED = ["Profile page and directory listing", "License-checked badge", "Reviews from members", "Share buttons and your own link", "Update or remove it any time"];

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

      <section className="border-b border-border bg-white">
        <div className={`${container} grid items-center gap-12 pt-8 pb-14 sm:pt-10 sm:pb-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16`}>
          <div className="enter">
            <Link
              href="/lawyers"
              className={`-ml-1 mb-4 inline-flex min-h-11 items-center gap-1.5 rounded px-1 text-small font-medium text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}
            >
              <ArrowLeft aria-hidden className="size-4" />
              Find a lawyer
            </Link>
            <h1 className="max-w-xl text-display text-midnight">
              List your immigration practice. <span className="text-blue">Get found by people with a USCIS case.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lead text-slate">
              A license-checked profile in our lawyer directory, for licensed immigration attorneys and DOJ-accredited representatives.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#apply" className={btnPrimary}>
                Apply to be listed
                <ArrowRight aria-hidden className="size-4" />
              </a>
              <a href="#pricing" className={btnSecondary}>
                See pricing
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small text-midnight">
              {[DIRECTORY.freeAtLaunch ? "Free during launch" : `${directoryFee}, flat`, "No card to apply", "About 5 minutes"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-teal" strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <figure className="enter enter-delay relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden className="absolute -inset-4 -z-0 rounded-3xl bg-ice sm:-inset-6" />
            <div className="relative">
              <ListingCard l={EXAMPLE} preview headingLevel="h2" />
            </div>
            <figcaption className="relative mt-4 text-center text-small text-slate">
              <span className="mr-2 rounded-full bg-white px-2 py-0.5 text-caption font-semibold text-blue">Example</span>
              How your listing looks in our search. It opens your full profile.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={section} aria-labelledby="included">
        <div className={container}>
          <SectionIntro id="included" title="What you get" description="Everything a person needs to choose you and get in touch, on a site they already use for their case." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <li key={title} className={`${panel} h-full`}>
                <span className="flex size-11 items-center justify-center rounded-xl bg-ice text-blue">
                  <Icon aria-hidden className="size-5" />
                </span>
                <h3 className="mt-4 text-title text-midnight">{title}</h3>
                <p className="mt-2 text-body text-slate">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${section} bg-white`} aria-labelledby="how">
        <div className={container}>
          <SectionIntro id="how" title="How it works" description="Three steps, and you never pay before your license is checked." />
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                {i < STEPS.length - 1 && <span aria-hidden className="absolute top-5 left-14 hidden h-px w-[calc(100%-3.5rem)] bg-border md:block" />}
                <span className="relative flex size-10 items-center justify-center rounded-full bg-blue text-small font-semibold text-white tabular-nums">{i + 1}</span>
                <h3 className="mt-4 text-title text-midnight">{s.title}</h3>
                <p className="mt-2 max-w-sm text-body text-slate">
                  <RichText text={s.body} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={section} aria-labelledby="pricing">
        <div className={container}>
          <SectionIntro id="pricing" title="One simple price" description="The same flat price for every lawyer. No contracts, no per-lead fees." />
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
            <div className={`${card} reveal flex flex-col overflow-hidden`}>
              <div className="border-b border-border bg-midnight p-6 sm:p-8">
                {DIRECTORY.freeAtLaunch ? (
                  <>
                    <p className="text-small font-semibold text-ice/80">While the directory launches</p>
                    <p className="mt-2 flex items-baseline gap-2 text-white">
                      <span className="text-display tabular-nums">$0</span>
                    </p>
                    <p className="mt-2 text-body text-ice/80">
                      Then ${DIRECTORY.annualFee} a year after launch, which is {perDay}.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-small font-semibold text-ice/80">Directory listing</p>
                    <p className="mt-2 flex items-baseline gap-2 text-white">
                      <span className="text-display tabular-nums">${DIRECTORY.annualFee}</span>
                      <span className="text-body text-ice/80">a year</span>
                    </p>
                    <p className="mt-2 text-body text-ice/80">That&apos;s {perDay}, sent as one invoice by email.</p>
                  </>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="text-small font-semibold text-midnight">Included</p>
                <ul className="mt-3 grid gap-2.5">
                  {INCLUDED.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-body text-midnight">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.5} />
                      {t}
                    </li>
                  ))}
                </ul>
                <a href="#apply" className={`mt-8 ${btnPrimary} w-full`}>
                  Apply to be listed
                </a>
                <p className="mt-3 text-center text-small text-slate">No card needed to apply.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-title text-midnight">How billing works</h3>
                <ul className={`mt-4 ${rows}`}>
                  {COST.map((c) => (
                    <li key={c} className={`flex items-start gap-3 ${rowPad} py-4 text-body text-midnight`}>
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.5} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-title text-midnight">Who can be listed</h3>
                <ul className={`mt-4 ${rows}`}>
                  {WHO.map((w, i) => (
                    <li key={w} className={`flex items-start gap-3 ${rowPad} py-4 text-body text-midnight`}>
                      {i < WHO.length - 1 ? (
                        <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.5} />
                      ) : (
                        <X aria-hidden className="mt-1 size-4 shrink-0 text-slate" strokeWidth={2.5} />
                      )}
                      {w}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-small text-slate">
                  <RichText text="Being listed is not a recommendation by TrackMyUSCIS, and listings may count as attorney advertising under your bar's rules. See [how the directory works](/advertising)." />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`} aria-labelledby="apply">
        <div className={readContainer}>
          <h2 id="apply" className={`jump-target scroll-mt-28 ${h2}`}>
            Apply to be listed
          </h2>
          <p className="mt-3 text-lead text-slate">
            What you enter here becomes your profile page, apart from your bar number and email, which we use only to check your license
            and reach you. Only the fields marked optional can be left empty.
          </p>
          <div className={`mt-8 ${panel} sm:p-8`}>
            <JoinForm feeLine={DIRECTORY.freeAtLaunch ? `After launch a listing is ${directoryFee}. ${NOTICE}` : `We'll email your invoice for ${directoryFee} once your license is checked.`} />
          </div>
        </div>
      </section>

      <section className={section} aria-labelledby="questions">
        <div className={readContainer}>
          <h2 id="questions" className={h2}>
            Common questions
          </h2>
          <div className={`mt-8 ${rows}`}>
            {FAQ.map((item) => (
              <details key={item.q} className="disclosure group">
                <summary
                  className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 ${rowPad} py-4 text-left text-title text-midnight transition-colors duration-200 hover:bg-cloud group-open:hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue`}
                >
                  {item.q}
                  <ChevronDown aria-hidden className="faq-chevron size-5 shrink-0 text-slate transition-transform duration-200" />
                </summary>
                <p className={`${rowPad} pb-6 text-body text-slate`}>{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-body text-slate">
            Still have a question? Email{" "}
            <a href={`mailto:${COMPANY.email.support}`} className={`rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`}>
              {COMPANY.email.support}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
