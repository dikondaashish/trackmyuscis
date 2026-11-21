---
name: new-answer-page
description: TrackMyUSCIS workflow for adding a new answer page (or updating one) and getting it indexed by Google and AI assistants. Use when the user asks to add, write or publish an answer, a USCIS question page, an FAQ-style page, or "answer this question on the site", and after editing an existing answer. Covers picking the question, fact-checking against uscis.gov, writing the entry in src/lib/answers.ts, checks, and IndexNow submission after deploy.
---

# New answer page — TrackMyUSCIS

One real question per page, answered in the first two sentences, checked against the official source. Adding one entry to `src/lib/answers.ts` creates the page, its share card, its sitemap entry and its llms.txt line automatically.

Load `trackmyuscis-ui-system` (§6c, answer pages) and `trackmyuscis-brand` first. For keyword and AI-citation work, use `keyword-research`, `serp-analysis` and `geo-content-optimizer`.

## Checklist

```
- [ ] 1. Pick the question (real searches, not already answered)
- [ ] 2. Fact-check every claim on uscis.gov (or another official .gov source)
- [ ] 3. Write the entry in src/lib/answers.ts
- [ ] 4. Link it: related answers both ways, plus relevant forms/guides/status pages
- [ ] 5. Bump ANSWERS_UPDATED (if any answer changed)
- [ ] 6. Checks: npx tsc --noEmit, npm run lint, npx next build
- [ ] 7. Look at the page at 1440px and 390px; confirm title, short answer, sources
- [ ] 8. After production deploy: npm run indexnow -- /answers/<slug>
- [ ] 9. Optional: Search Console → URL Inspection → Request indexing (Google)
```

## 1. Pick the question

- Use the words people type or ask a chatbot: "How long does I-765 take?", not "EAD adjudication timelines".
- Check `ANSWERS` for overlap. One question per page; if it's a variation of an existing one, improve that page instead.
- Good sources of questions: Search Console queries, `keyword-research`, "People also ask" via `serp-analysis`, help emails.

## 2. Fact-check

- Every factual sentence must be supported by an official page (uscis.gov, egov.uscis.gov, justice.gov, state.gov). Read the page; don't rely on memory.
- Confirm each source URL returns 200 in a browser (egov.uscis.gov blocks scripts but works in browsers).
- Prefer stable facts. For things that change (fees, times), describe how to look them up and link the official tool instead of quoting a number.
- Never give legal advice or predict an outcome. When it depends on someone's situation, say so and point to a licensed attorney or DOJ-accredited representative.

## 3. Write the entry

```ts
{
  slug: "how-long-does-i-765-take",           // lowercase, hyphens, matches the question
  question: "How long does Form I-765 take?",  // the H1, phrased as people ask
  seoTitle: "How Long Does I-765 Take? Work Permit Processing Time", // optional, ≤ ~55 chars
  topic: "Delays and contacting USCIS",        // one of TOPICS
  short: "…",      // the direct answer: 1–2 sentences, ≤ ~300 characters, no links
  sections: [{ heading: "…", body: ["paragraph", ["bullet", "bullet"]] }], // 2–4 short sections
  sources: [SRC.processingTimes],              // official links only
  related: ["…", "…", "…"],                    // three existing slugs
}
```

- `short` is what Google snippets and AI assistants quote. Make it complete on its own.
- Plain US English, short sentences, contractions are fine, no exclamation marks, no "Learn more".
- Inline links use `[text](/path)`; external official links open in a new tab automatically.

## 4–7. Link, date, check, look

- Add the new slug to `related` on 1–3 existing answers so it isn't orphaned.
- Bump `ANSWERS_UPDATED` in `src/lib/answers.ts`.
- `npx tsc --noEmit && npm run lint && npx next build` must pass; the build must list `/answers/<slug>` and its `opengraph-image` as static.
- Verify in the preview browser: title tag, one H1, the Short answer panel, sources open in a new tab, no overflow at 390px.

## 8–9. Get it indexed (after deploy only)

```bash
npm run indexnow -- /answers/<slug>
```

- IndexNow notifies Bing (which also feeds ChatGPT search and Copilot), Yandex and others. Expect HTTP 200 or 202.
- Updated several pages? Pass several paths, or `--all` to resubmit the whole sitemap. Add `--dry-run` to preview.
- Google doesn't use IndexNow: in Search Console, inspect the URL and request indexing for important new pages.
