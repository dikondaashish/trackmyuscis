import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ListingCard } from "@/components/lawyers/LawyerBits";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { COMPANY } from "@/lib/company";
import { DOJ_ROSTER } from "@/lib/content";
import { DIRECTORY, directoryFee } from "@/lib/directory";
import { breadcrumbSchema, faqSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import type { Listing } from "@/lib/directory-listings";
import { PHOTOS } from "@/lib/photos";
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

/** What a listing includes, in the order a lawyer would ask about it. Everything here is live today. */
const FEATURES = [
  {
    title: "Your own profile page",
    body: "Photo, bio, cases you take, languages, consultation fee, office, education and career, at its own address. Built so search engines can read your details.",
  },
  {
    title: "A place in our search",
    body: "People find you by state, city and case type, on the site they already use to follow their USCIS case.",
  },
  {
    title: "A license-checked mark",
    body: "We check your license before you're listed and show the date, so people know you're real before they call.",
  },
  {
    title: "Reviews that mean something",
    body: "Signed-in members rate you and we check every review against public rules. Nobody can buy or remove one.",
  },
  {
    title: "Direct contact, no middleman",
    body: "Calls go to your office and clicks to your website. Share buttons for Facebook, LinkedIn, X, WhatsApp and email come with every profile.",
  },
];

const INCLUDED = ["Profile page and directory listing", "License-checked mark", "Reviews from members", "Share buttons and your own link", "Changes or removal at any time"];

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
        <div className={`${container} grid items-center gap-10 pt-8 pb-12 sm:pt-10 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
          <div className="enter">
            <Link
              href="/lawyers"
              className={`-ml-1 mb-4 inline-flex min-h-11 items-center gap-1.5 rounded px-1 text-small font-medium text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}
            >
              <ArrowLeft aria-hidden className="size-4" />
              Find a lawyer
            </Link>
            <h1 className="max-w-xl text-display text-midnight">List your immigration practice</h1>
            <p className="mt-4 max-w-xl text-lead text-slate">
              A license-checked profile in front of people following a USCIS case. For licensed immigration attorneys and DOJ-accredited
              representatives.
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
            <ul className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                [DIRECTORY.freeAtLaunch ? "$0" : `$${DIRECTORY.annualFee}`, DIRECTORY.freeAtLaunch ? "during launch" : "a year, flat"],
                [`$${DIRECTORY.annualFee}`, DIRECTORY.freeAtLaunch ? "a year after launch" : `${perDay}`],
                ["5 min", "to apply, no card"],
              ].map(([n, label]) => (
                <li key={label}>
                  <span className="block text-h3 text-midnight tabular-nums">{n}</span>
                  <span className="block text-small text-slate">{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <Photo
            photo={PHOTOS.lawyersJoin}
            preload
            sizes="(min-width: 1280px) 584px, (min-width: 1024px) 45vw, 100vw"
            className="enter enter-delay aspect-[4/3] rounded-2xl lg:aspect-[5/4]"
          />
        </div>
      </section>

      <section className={section} aria-labelledby="included">
        <div className={`${container} grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
          <div>
            <h2 id="included" className={h2}>
              What your listing includes
            </h2>
            <p className="mt-3 max-w-xl text-lead text-slate">Everything a person needs to choose you and get in touch.</p>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {FEATURES.map((f) => (
                <li key={f.title} className="py-5">
                  <h3 className="text-title text-midnight">{f.title}</h3>
                  <p className="mt-1 text-body text-slate">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-2xl border border-border bg-white p-4 sm:p-8 lg:sticky lg:top-28">
            <p className="mb-4 flex items-center justify-between gap-3 text-small text-slate">
              <span className="font-semibold text-midnight">Example listing</span>
              <span>As it appears in our search</span>
            </p>
            <div className="rounded-xl bg-cloud p-3 sm:p-5">
              <ListingCard l={EXAMPLE} preview />
            </div>
            <p className="mt-4 text-small text-slate">
              The card opens a full profile page with your bio, background, office, reviews and a contact card that stays on screen.
            </p>
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`} aria-labelledby="how">
        <div className={container}>
          <h2 id="how" className={h2}>
            How it works
          </h2>
          <p className="mt-3 max-w-2xl text-lead text-slate">Three steps, and nothing to pay before your license is checked.</p>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-10">
            {STEPS.map((st, i) => (
              <li key={st.title} className="border-t-2 border-midnight pt-5">
                <span className="block text-h1 text-blue tabular-nums">{i + 1}</span>
                <h3 className="mt-3 text-title text-midnight">{st.title}</h3>
                <p className="mt-2 text-body text-slate">
                  <RichText text={st.body} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={section} aria-labelledby="pricing">
        <div className={container}>
          <h2 id="pricing" className={`jump-target scroll-mt-28 ${h2}`}>
            One simple price
          </h2>
          <p className="mt-3 max-w-2xl text-lead text-slate">The same flat price for every lawyer. No contract, no per-lead fees.</p>
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
            <div className={`${card} reveal overflow-hidden`}>
              <div className="bg-midnight p-6 sm:p-8">
                <p className="text-small font-semibold text-ice/80">{DIRECTORY.freeAtLaunch ? "While the directory launches" : "Directory listing"}</p>
                <p className="mt-2 flex items-baseline gap-2 text-white">
                  <span className="text-display tabular-nums">{DIRECTORY.freeAtLaunch ? "$0" : `$${DIRECTORY.annualFee}`}</span>
                  {!DIRECTORY.freeAtLaunch && <span className="text-body text-ice/80">a year</span>}
                </p>
                <p className="mt-2 text-body text-ice/80">
                  {DIRECTORY.freeAtLaunch ? `Then $${DIRECTORY.annualFee} a year after launch, which is ${perDay}.` : `That's ${perDay}, sent as one invoice by email.`}
                </p>
              </div>
              <div className="p-6 sm:p-8">
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

            <div className="flex flex-col gap-10">
              <div>
                <h3 className="text-title text-midnight">How billing works</h3>
                <ul className="mt-3 divide-y divide-border border-y border-border">
                  {COST.map((c) => (
                    <li key={c} className="py-4 text-body text-midnight">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-title text-midnight">Who can be listed</h3>
                <dl className="mt-3 divide-y divide-border border-y border-border">
                  {WHO.map((w, i) => (
                    <div key={w} className="grid gap-1 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
                      <dt className={`text-small font-semibold ${i < WHO.length - 1 ? "text-teal" : "text-slate"}`}>{i < WHO.length - 1 ? "Can be listed" : "Can't be listed"}</dt>
                      <dd className="text-body text-midnight">{w.replace(/^Not eligible: /, "")}</dd>
                    </div>
                  ))}
                </dl>
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
