---
name: trackmyuscis-brand
description: TrackMyUSCIS brand system — the only color palette, typography and UI tone allowed in this project. Load before writing or changing any UI, page, component, email, chart, image or style in TrackMyUSCIS (pages, buttons, cards, status badges, progress bars, charts, OG images). Overrides palette/font choices suggested by other design skills.
---

# TrackMyUSCIS brand system — "Quiet confidence."

A premium, approachable color system for immigration technology. Calm, trustworthy, never alarming. Every color in the product comes from this palette — do not invent new hues, gradients or neon accents. Other design skills (design-taste-frontend, frontend-design, ui-ux-pro-max) may guide layout and craft, but **colors and fonts come from here**.

Files in this skill:
- `palette.json` — canonical tokens (source of truth)
- `brand.css` — CSS custom properties version
- `brand-reference.png` — the approved brand board (swatches + hero/nav/case-card example)
- `logos/` — original logo kit (SVG + PNG), `trackmyuscis-american-brand-presentation.png` and `…-brand-guidelines.txt`

## Palette

| Token | Hex | Tailwind class (via `@theme` in `src/app/globals.css`) | Use for |
|---|---|---|---|
| midnight | `#10223D` | `text-midnight` / `bg-midnight` | Headings, body text, footer, dark navbar |
| blue (Trust Blue) | `#285AC7` | `bg-blue` / `text-blue` | Primary CTA buttons, links, logo mark, focus rings |
| teal (Calm Teal) | `#087F79` | `bg-teal` / `text-teal` | Progress bars/steps, success & "Updated" status accents |
| ice (Ice Blue) | `#EAF1FC` | `bg-ice` | Subtle blue cards, pills/badges (e.g. "BRAND SYSTEM" pill), hover fills |
| cloud | `#F8FAFC` | `bg-cloud` | Main page background, hero surface |
| white | `#FFFFFF` | `bg-white` | Cards, forms, inputs, navbar |
| slate | `#516176` | `text-slate` | Secondary/muted text, nav links, captions |
| border | `#DDE6F0` | `border-border` | Dividers, card and input borders |
| amber | `#A85D11` | `text-amber` | Warning status (RFE, action required, holds) |
| red | `#B42318` | `text-red` | Error / denied status only |
| heritageRed (Heritage Red) | `#BB4350` | `text-heritage` / `bg-heritage` | **Logo stripes only** (and at most a tiny decorative American accent). Never for UI status, buttons or text. |

Note: these names intentionally override Tailwind's default `blue`, `teal`, `slate`, `red`, `amber` scales in this project — use the bare names (`bg-blue`, not `bg-blue-600`).

## Rules

- **Buttons:** primary = `bg-blue text-white`, rounded (~10px), medium weight. White text passes WCAG AA on both blue and teal.
- **Progress / timeline:** teal filled segments and dots; remaining track in `border` color.
- **Status badges:** soft tint background + strong text: success = teal text on a light teal tint (e.g. `bg-teal/10`), info = blue on ice, warning = amber on `amber/10`, error = red on `red/10`. Never use red for anything except errors/denials.
- **Surfaces:** page `cloud`, cards `white` with 1px `border` and generous radius (~16–20px), light or no shadow.
- **Typography:** Inter (Inter Display for big headings), tight tracking on headlines, midnight for headings, slate for supporting text. Headline voice like "Every case has a story." / "Stay informed at every step." Exact sizes, weights, spacing and component sizes live in the `trackmyuscis-ui-system` skill.
- **Tone:** calm and reassuring — no alarm colors for normal states, no hype, no gradients-on-everything.
- **Legal line** (footer, required by the logo guidelines — show clearly): "Independent immigration tracking platform. Not affiliated with USCIS or the U.S. government."

## Logo — "The American Journey" (concept 03)

Symbol = one white star on a flag-shaped block + three Heritage Red stripes, the last one an arrow (Star = America, Stripes = the journey, Arrow = progress). Wordmark "TrackMy" midnight + "USCIS" trust blue, Inter Display Semibold (outlined paths in SVG). Tagline: "TRACK YOUR CASE. KNOW YOUR NEXT STEP." Dark-lockup subline: "Independent immigration tracking platform".

Web files (served from `/brand/…`, originals + `brand-presentation` + guidelines in this skill's `logos/`):

| File | Use |
|---|---|
| `/brand/logo-primary.svg` | Full wordmark on light surfaces (navbar, footer on white/cloud). 1180×196 |
| `/brand/logo-dark.svg` | Wordmark on midnight/dark surfaces (blue flag, light-blue "USCIS"). |
| `/brand/logo-symbol.svg` | Symbol only, light backgrounds (compact nav, mobile, loaders). 180×126 |
| `/brand/logo-monochrome.svg` | All-white symbol for dark/photo backgrounds. |
| `/brand/logo-app.svg` / `logo-app-fullbleed.svg` | App/store icon (midnight rounded square / full bleed). |
| `/brand/logo-favicon.svg` | Favicon. Wired as `src/app/icon.svg`; `src/app/apple-icon.png` is a 180px render of the full-bleed app icon. |

PNG versions of each exist alongside (use for emails/OG images). Rules:
- Use `next/image` or `<img>` pointing at the SVG; always set `alt="TrackMyUSCIS"`. Don't recolor, re-type, stretch or add effects to the logo; keep clear space ≈ the star's height.
- Do **not** pair the logo with official seals, DHS emblems or real U.S. flag assets (implies government sponsorship).
- Calm Teal stays an interface-status color — never inside the logo.
- Trademark review is pending before production (per guidelines).
- Dark mode, if added later, must be derived from these tokens (midnight surfaces, ice/white text) — ask before inventing new colors.

## Implementation in this repo

Tokens are wired in `src/app/globals.css` (`:root` vars + Tailwind v4 `@theme inline`) and Inter is loaded via `next/font/google` in `src/app/layout.tsx`. If you change a hex value, update `palette.json`, `brand.css` and `globals.css` together.
