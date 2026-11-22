---
name: trackmyuscis-ui-system
description: TrackMyUSCIS UI/UX system — the type scale, font setup, spacing, sizes, layout, components, photographs, motion and accessibility rules every page must follow. Load before building or changing any page, component, form or style in TrackMyUSCIS, together with trackmyuscis-brand (colors and logo).
---

# TrackMyUSCIS UI system — "simple first"

The main goal of this product is **the simplest possible UI and UX**. Users are anxious people checking an immigration case; clarity beats density every time. Benchmarks: **GOV.UK** (one thing per page, plain words), **Stripe** and **Linear** (restraint, precise type), **Apple** (generous space, 44pt targets), **Google search** (one input up front).

Colors and the logo come from the `trackmyuscis-brand` skill. Everything about size, type, spacing and behaviour comes from here. Other design skills (ui-ux-pro-max, design-taste-frontend, frontend-design) may inform layout ideas but never override these tokens.

## 1. Principles (in order)

1. **One job per screen.** Each page or section has one main action. If a second action competes, demote it to a text link.
2. **Remove before you style.** Prefer deleting an element over adding a border, badge, icon or colour to it.
3. **Plain words.** Headings name the thing ("Processing times"), buttons are a verb + object ("Check time", "Find lawyers"). No slogans, all-caps labels, eyebrows or exclamation marks. Never "Learn more".
4. **One of each.** One primary button, one secondary button, one card style, one link style, one heading scale. Extend `src/lib/ui.ts`; never invent a one-off.
5. **Honest UI.** Never show fake data as real (example data is labelled "Example"), never promise features that aren't live, always link to the official USCIS source.

## 2. Font

- **Inter** variable via `next/font/google` in `src/app/layout.tsx` with `axes: ["opsz"]`. Optical sizing is on (`font-optical-sizing: auto`), so text ≥ 32px renders in Inter's tighter *Display* cut automatically — the same approach as Linear and Vercel.
- Weights: **400** text, **500** nav/meta emphasis, **600** headings, titles, labels and buttons. Never 700+ (too loud) or < 400.
- `antialiased`, `text-rendering: optimizeLegibility`. Headings `text-wrap: balance`; paragraphs `text-wrap: pretty` (global in `globals.css`).
- Numbers that line up (receipt numbers, dates, steps): add `tabular-nums`.

## 3. Type scale — nine roles, nothing else

Defined once in `src/app/globals.css` (`@theme inline`). Tailwind's default sizes are **removed** (`--text-*: initial`), so `text-sm`, `text-lg`, `text-[15px]` etc. no longer exist. Each role carries its own line-height, tracking (Inter dynamic metrics) and weight — don't add `leading-*` or `tracking-*` on top.

| Class | Size | Line height | Tracking | Weight | Use for |
|---|---|---|---|---|---|
| `text-display` | 40 → 48px (fluid) | 1.2 | -0.022em | 600 | Homepage hero h1 only (two lines, second line blue) |
| `text-h1` | 36 → 48px (fluid) | 1.1 | -0.022em | 600 | Page titles (`PageIntro`) |
| `text-h2` | 30 → 36px (fluid) | 1.15 | -0.021em | 600 | Section headings |
| `text-h3` | 24px | 1.25 | -0.019em | 600 | Sub-section headings, prices, big form codes |
| `text-title` | 18px | 1.4 | -0.014em | 600 | Card titles, list items, FAQ questions, result headings |
| `text-lead` | 18px | 1.6 | -0.014em | 400 | Line under a heading, long-form reading (guides) |
| `text-body` | 16px | 1.5 | -0.011em | 400 | Default text, buttons, **all inputs** (≥16px stops iOS zoom) |
| `text-small` | 14px | 1.43 | -0.006em | 400 | Helper text, nav links, meta, footer links |
| `text-caption` | 12px | 1.33 | 0 | 400 | Badges, pills and the footer disclaimer only — the floor; nothing smaller |

Rules:
- One `h1` per page. Heading levels go in order (h1 → h2 → h3).
- Reading width: paragraphs `max-w-2xl` (~65 characters); hero lines `max-w-xl`.
- Text colour: `text-midnight` for headings and primary text, `text-slate` for secondary. Never grey on grey; never `text-slate` below 14px on a tinted ground.
- Prefer the shared constants: `display`, `h1`, `h2`, `lead` from `src/lib/ui.ts`.

## 4. Spacing (4px base, 8px rhythm)

| Where | Value | Class |
|---|---|---|
| Section padding (top & bottom) | 80px phone, 112px ≥640px | `section` (`py-20 sm:py-28`) |
| Section h2 → its line | 16px | `mt-4` |
| Section intro → content | 48px | `mt-12` (`mt-10` before a form card) |
| Sub-section h3 → content | 32px | `mt-8` |
| Between sub-sections on a page | 80px | `mt-20` |
| Grid gap between cards | 16px (12px on dense phone grids) | `gap-4` / `gap-3` |
| Card padding | 24px (32px for form cards ≥640px) | `p-6` / `sm:p-8` |
| Label → field | 8px | `mt-2` |
| Between form fields | 16px | `gap-4` |

Separate sections with a background change (`bg-white` ↔ `bg-cloud`, one `bg-midnight` band) — never with rules or shadows between sections.

## 5. Sizes

- **Container:** `container` = `max-w-7xl` (1280px) with equal gutters 20px phone / 32px ≥640px, so content is 1216px wide on desktop. Header, footer and every section use it so left and right edges line up. **Text-only pages are centred instead:** `docContainer` (`max-w-5xl`, 960px content: 224px contents list + 64px gap + 672px article) for policy pages, `readContainer` (`max-w-3xl`, 704px) for every one-column text page: `/legal`, `/answers` and each answer, `/help`, `/guides` and each guide, `/status-explained`, About, Contact, Case alerts, Sign in. Don't add an inner `max-w-*` inside it. A `PageIntro` photo still spans the full `container` (a wide banner under the centred title). Pass the same one to `<PageIntro width={…}>` so the title lines up with the content and the space left and right is equal; never leave text hugging the left of a 1216px container.
- **Touch targets:** every link, button, summary and control outside running text is **≥ 44px tall** (`min-h-11`). Primary/secondary buttons and inputs are **48px** (`min-h-12` / `h-12`); the hero receipt field and button are **56px** (`h-14`). Keep ≥ 8px between targets.
- **Radius:** 10px controls (`rounded-[10px]`), 12px icon tiles (`rounded-xl`), 16px cards and panels (`rounded-2xl`), full for pills/badges.
- **Icons:** lucide-react only (no emoji). 16px inline with text (`size-4`), 20px in icon tiles (`size-5`) inside a 44px `bg-ice` tile. Decorative icons get `aria-hidden`.
- **Header:** 64px phone, 76px ≥1024px (`lg:h-19`), sticky, white. Logo 28/32/36px tall. Five header entries from `HEADER_NAV` (`src/lib/nav.ts`, types in `site.ts`): "Your case", "Forms", "Resources" and "Company" open dropdown menus, "Pricing" is a plain link. Every public page is reachable from them (single answers and policies through their hub pages). Each menu item is a label plus one short line of what the page is for; the Forms menu lists every form in two columns with "All USCIS forms" at the bottom. Menus open on click or keyboard and on mouse hover, close on Escape (focus returns to the button), an outside click or a page change; the menu holding the current page is shown in midnight and only the best-matching link is highlighted (`bestMatch`). The phone menu shows the same groups as tap-to-open sections. Before the button sits one 44px search icon link to `/search` (from 640px; on phones it is the "Search the site" row at the top of the menu). The Track Case button has no icon, so the magnifier means search only. A "Skip to main content" link is the first focusable element on every page. Accounts are live (Supabase, project `zuzfgggfhojaklawefql`): an `AccountLink` before the search icon shows "Sign in", or "Dashboard" once signed in (checked in the browser so pages stay static); on phones it is a button at the bottom of the menu. Account pages (`/sign-in`, `/sign-up`, `/forgot-password`, `/auth/reset-password`) live in the `src/app/(auth)` route group, whose layout has no site header or footer: a midnight brand panel on the left from 1024px (logo, one heading, three static points, the disclaimer; no carousel) and the form column on cloud on the right with a "Back to site" link and a Terms/Privacy/Help line. Each page puts its form in `AuthShell` (24px h1, one line with the link to the other account page, white card). Every account page fits one screen with no scrolling down to 1280×720 and 375×812: keep forms short (names side by side, password rules on the label row), and on desktop the small print sits in the panel. Every other page lives in `src/app/(site)`, whose layout adds the skip link, header and footer (404s from the catch-all render there too). The signed-in app lives in `src/app/(app)` with no site header or footer: a 256px white sidebar from 1024px (logo, Cases, Settings, a Guides group linking to site pages, the account with a sign-out button at the bottom) and a 64px top bar with a menu on smaller screens; pages sit on cloud in `appPage` with `text-h3` titles. `/dashboard` lists cases in one table card (columns stack into rows on phones) with an "Add case" dialog (`components/app/Dialog.tsx`, native `<dialog>`; mark the first field `data-autofocus`); `/dashboard/cases/[id]` shows status, the form's typical steps, receipt-number facts and "Check status on USCIS" (copies the receipt number, opens USCIS in a new tab); `/dashboard/settings` has name, sign-in method, sign out and how to delete the account. Never show a case status we don't have: unchecked cases say "Not checked yet" until automatic checks are live. Session reads go through `getAccount()` (`src/lib/account.ts`) inside `<Suspense>`; `src/proxy.ts` guards `/dashboard`. One label per action everywhere: "Track Case".
- **Footer:** midnight, `py-16`, five equal columns ≥768px (logo + one line, then the four `FOOTER_GROUPS`; gap 32px, 48px ≥1024px), two columns on phones. Headings 14px/600 white, links 14px `text-ice/80` in 32px rows on desktop (44px on phones). Then `mt-12 pt-8 border-t` and the bottom row: "© 2026 TrackMyUSCIS" (14px `text-ice/70`) left, the independence disclaimer right-aligned as quiet fine print (12px `text-caption leading-5 text-ice/60`, no icon, max-w-2xl).

## 6. Components (`src/lib/ui.ts` and `src/components/`)

- `btnPrimary` (blue, white text) — one per view. `btnSecondary` (white, border) for the rest. `textLink` for inline "See all …" links (underline draws in on hover).
- `card` / `cardLink` — the only card. Linked cards lift 2px and tint the border on hover.
- **White panels on the tinted page.** Page bodies sit on `bg-cloud`; content never floats on it as bare text. Lists of links, facts or steps go in `rows` (one white panel, `divide-y`, each row inset with `rowPad`; linked rows use `rowLink` + `rowArrow` and tint on hover). Use `<LinkRows items=… />` for any list of page links (`compact` for short lists inside a longer page). Reading content (answers, guides, policies, About, Contact) goes in `panel` (`sm:p-10` for articles). Section headings (`text-h3`) stay outside the panel, 20–24px above it. No rules-only lists (`border-y`) anymore.
- `field`, `fieldLabel`, `SelectField` — every field has a visible label above it; placeholder is only an example ("e.g. Houston, TX").
- `SectionIntro` (h2 + one line), `PageIntro` (back link, h1, lead) — start every section/page with these.
- `ExternalLink` — official sites open in a new tab with an arrow-up-right icon and screen-reader "(opens in a new tab)".
- `StatusBadge` tones: info = blue on ice, success = teal on teal/10, warning = amber on amber/10, error = red on red/10.
- `StatusFinder` (Case Statuses): a search field that hides non-matching statuses; every status stays in the HTML and has its own anchor id. Long pages with a side column (policies, form pages) get a sticky "On this page" list on desktop; add `jump-target` to anything linked by anchor so it is tinted on arrival. Add `no-print` to controls that make no sense on paper.
- Site search (`/search`, `SiteSearch`, index in `src/lib/search.ts`): one field over statuses, answers, forms, guides and help, built from the content files so new entries are searchable automatically. Matching runs in the browser; the query is never put in the URL or sent anywhere (people paste receipt numbers). The page is `noindex` and not in the sitemap.
- Search forms use `next/form` and `@container` queries so they stack in narrow cards and sit in one row in wide ones.

## 6b. Company and legal pages

- **Low-profile company.** Lead with TrackMyUSCIS everywhere. The operating company's legal name appears only where the law needs it: Terms §1 and Privacy §1 (via `legalName` in `src/lib/company.ts`). Never put it in the header, footer, About, Contact, legal hub, page intros, metadata, JSON-LD, share images or llms.txt. Copyright line is "© 2026 TrackMyUSCIS". Emails, site URL, "Last updated" date and the copyright line live in `src/lib/company.ts` only; never hard-code them in a page.
- Policies and long-form trust pages live in `src/lib/legal.ts` (`LEGAL_DOCS`, `POLICY_ORDER`) and render through `<LegalDocument>` via the catch-all route: title + one-line summary + "Last updated", a sticky "On this page" list on desktop, short `text-title` sections at `max-w-2xl`, then "Other policies". `/legal` lists every policy.
- Inline links in copy use `[text](href)`; email addresses link automatically (`<RichText>`).
- Write policies in plain US English, describe only what is live today and label anything "when it launches". Any policy change: edit `legal.ts`, bump `LEGAL_UPDATED`.
- Never mention or link a sister product in this site.

## 6c. Search and AI assistants (most users arrive from Google and chatbots)

- Every page exports `pageMetadata({ title, description, path })` from `src/lib/seo.ts`: a keyword-led title ("USCIS Processing Times by Form and Office", under ~60 characters before " | TrackMyUSCIS"), a 140–160 character description, a canonical path, Open Graph and Twitter tags. Guides and text pages can set a `seoTitle` phrased the way people search.
- Every page renders `<JsonLd data={[…]} />` with schema builders from `seo.ts`: the root layout adds Organization + WebSite; pages add WebPage (or CollectionPage/AboutPage/ContactPage), BreadcrumbList, and FAQPage, Article, ItemList, DefinedTermSet or WebApplication where the content matches. Only mark up what is visible on the page.
- Every section has a share card from `ogImage()` (`src/lib/og.tsx`): logo, title, one line, and the page photo (crops in `src/assets/og/`) or the brand illustration. Catch-all pages use `/og/[page]`. Keep asset reads synchronous and path-scoped so images prerender.
- `robots.ts` names and allows search engines and AI crawlers; never block a public page there (use `noindex` instead, as on /sign-in). `sitemap.ts` uses fixed dates (`CONTENT_UPDATED`, `LEGAL_UPDATED`), never "now". `llms.txt` is generated from the same content; new pages should appear there too.
- Answer pages (`src/lib/answers.ts`, `/answers/[slug]`): one real question per page, answered in the first one or two sentences (the "Short answer" panel, marked speakable), then 2–4 short sections, official sources and three related questions. Check every fact against uscis.gov before publishing and bump `ANSWERS_UPDATED`. Adding an entry automatically adds the page, share card, sitemap and llms.txt lines.
- New images: `node --env-file=.env.local scripts/generate-image.mjs "<prompt>" out.png [aspect]` (Gemini; key in `.env.local`, never committed). Generated art is abstract and on-palette only: no people, text, flags or seals. Real people stay Unsplash photos.

## 7. Photographs

- **Source:** Unsplash, free Unsplash License only (never Unsplash+). Download through the official link `https://unsplash.com/photos/<id>/download?force=true&w=3840&q=78` (paid photos return 403). Originals are **3840px wide (4K)**, landscape, saved in `src/assets/photos/<slot>.jpg`.
- **Register every photo in `src/lib/photos.ts`** (static import + `alt` + `focus`), with its Unsplash id and photographer in a comment. Pages use `PHOTOS`, `FORM_PHOTOS`, `GUIDE_PHOTOS`, `TEXT_PAGE_PHOTOS`. Never put an `<img>` or a remote URL in a page.
- **Show photos only with `<Photo>`** (`src/components/ui/Photo.tsx`): rounded frame, fixed aspect ratio, `object-cover` with the photo's `focus`, blur-up placeholder, a correct `sizes`. `next.config.ts` serves AVIF then WebP at quality 75 with an extra 2560 step.
- **Where photos go:** at most one wide banner per content page via `PageIntro photo=` (4:3 phone → 16:9 tablet → 21:9 desktop); 16:10 covers on linked cards (`zoomOnHover`, 1.03); 4:3 thumbnails in lists. Homepage: the product UI leads the hero (no photo there; the right side is the `HeroReceiptCard`, which shows a sample receipt number, labelled "Sample number", until the visitor checks their own; `HeroTracker` then passes the result so the card shows "Your number"). The homepage has exactly four sections: hero (receipt check), "Find your form" (one small `cardLink` tile per form, three across on desktop), top USCIS answers (`LinkRows`), "About TrackMyUSCIS" FAQ. No tool-card grids, no "how it works" steps, no repeated links to pages already in the header. Never put a photo above a page's main action: tool and reference pages (processing times, lawyers, case statuses, forms) have no banner photo; About and guides may have one. Legal, sign-in, contact, pricing and help pages stay text-only.
- **What a photo must be:** the page's real subject (family → I-130, airport → I-131), sharp, natural light, calm and warm. **People should reflect immigrant communities** (South Asian, East Asian, Latino, Black/African, Middle Eastern, mixed families). No readable logos, brand names, signs or text; **no U.S. flags, seals, eagles, government buildings or passports with emblems** (implies government affiliation); no distressed people; no photo used twice.
- **Alt text** is written fresh: what is visible, 8–16 words, no names. **No captions** on or under photos. No photo credit line in the footer (the Unsplash License doesn't require one).
- Verify: check `currentSrc` picks a sensible width (about 2x the frame) and nothing loads an original JPEG.

## 8. Motion

- Hero / page intro enters once on load (`.enter`, 640ms, ease-out). Nothing fades in on scroll; no parallax, carousels or auto-rotating content.
- Hover: cards lift 2px, arrows nudge 2px, links draw an underline, buttons darken. Press: buttons scale to 0.98. All transitions 200ms.
- Everything respects `prefers-reduced-motion` (animations off, no lift/scale).

## 9. Accessibility checklist (WCAG 2.2 AA)

- Visible focus ring on everything (`focusRing`: 2px blue outline, 2px offset; white on midnight).
- Labels on every field; errors under the field with `aria-invalid` and `aria-describedby`; results in an `aria-live="polite"` region.
- Contrast ≥ 4.5:1 for text (brand palette pairs already pass).
- No horizontal scroll at 320px; mobile menu closes on Escape and returns focus.

## 10. Before you finish any UI change

1. `npx tsc --noEmit` and `npm run lint`.
2. Check the page at **1440×900** and **390×844** in the preview browser: no overflow, nothing under 12px, no target under 44px. Quick in-page check:
   ```js
   [...document.querySelectorAll('a,button,summary,input,select')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height<44&&!e.closest('p')})
   ```
3. If new classes don't appear (Turbopack serves stale CSS after `globals.css` edits): stop the dev server, `rm -rf .next`, start it again.
4. `npx next build` must pass (Cache Components: no `new Date()` in prerendered UI; pages that read `params` use `export const instant = false` to keep real 404s).
