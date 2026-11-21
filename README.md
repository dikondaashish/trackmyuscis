# TrackMyUSCIS

Plain-English help for people waiting on a USCIS decision: what a receipt number means, what each case status means, the usual steps for each form, processing times, common questions, and where to find real legal help.

Live at [trackmyuscis.com](https://trackmyuscis.com). Independent: not affiliated with USCIS or any government agency, and not legal advice.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · hosted on Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run indexnow` | Tell search engines about new or changed pages (after a deploy) |
| `npm run image` | Generate an image with Gemini (needs `GOOGLE_API_KEY` in `.env.local`) |

## Where things live

- `src/app/` – pages, share images, `sitemap.ts`, `robots.ts`, `llms.txt`
- `src/components/` – UI components
- `src/lib/` – all site content (`content.ts`, `answers.ts`, `legal.ts`), SEO helpers and photos
- `src/assets/` – photos, share-card crops and the Inter font used for share images
- `public/brand/` – logos served to browsers
- `.claude/skills/` – project skills: brand palette, UI system, and the new-answer-page workflow

Pushes to `main` deploy to production on Vercel.
