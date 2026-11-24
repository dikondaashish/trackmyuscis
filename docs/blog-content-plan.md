# Blog content plan

Research done 2026-11-23. Update this file as posts ship.

## Where the demand is

**Google Keyword Planner** (Zyene Reviews Ads account, United States, Nov 2025 to Oct 2026, average monthly searches, competition low on nearly all):

| Monthly searches | Keywords |
|---|---|
| 1M to 10M | uscis case status, uscis case status check, my uscis case status |
| 100K to 1M | uscis processing times, visa bulletin, uscis status, uscis case status online, my uscis / uscis account |
| 10K to 100K | i-130 processing time, i-140 processing time, n-400 processing time, perm processing time, green card renewal, citizenship test questions, uscis change of address, uscis online account, green card status, national visa center case status, h1b case status, case tracker uscis |
| 1K to 10K | advance parole processing time, ead status check, green card interview questions, h4 ead processing time, i-129f processing time, i-140 status, i-751 / i-765 / i-90 processing time, priority date, uscis biometrics appointment, uscis filing fees, uscis premium processing, uscis receipt number, eb2 niw processing time, i-601a processing time, k1 visa processing times, asylum case status, uscis estatus de mi caso (Spanish) |

**Proven by our sister site's Search Console** (3 months to 2026-11-23): non-OPT immigration searches already reach it with little effort:
- Visa Bulletin (monthly dates and predictions, including Spanish "boletín de visas"): about 246K impressions. Its single December bulletin post had 233K impressions and 5.5K clicks.
- I-140 status and tracking: about 42K impressions; its I-140 tracking post had 66K impressions.
- I-765, EAD and H-4 EAD status: about 30K impressions.
- USCIS case status tracking guide: 76K impressions at position 8.9.

TrackMyUSCIS itself had 1 impression in Search Console (new property, data since 2026-11-20), so the first months depend on content.

## Published

| Post | Target searches |
|---|---|
| [December 2026 Visa Bulletin](/blog/december-2026-visa-bulletin) (published early, before the bulletin) | visa bulletin december 2026, december visa bulletin, december visa bulletin predictions, when is december visa bulletin coming out |
| [November 2026 Visa Bulletin](/blog/november-2026-visa-bulletin) | visa bulletin, november visa bulletin 2026, priority date |
| [I-140 status check](/blog/i-140-status-check) | i-140 status, i140 tracker, i-140 premium processing fee |
| [Green card renewal (I-90)](/blog/green-card-renewal-i-90) | green card renewal, i-90 fee, green card renewal processing |

## Next, in priority order

1. **Fill in the December 2026 Visa Bulletin post the day it's published** (still "Coming soon" on 2026-11-24). Add the charts and what moved, rewrite the answer, status section and first FAQs, and keep the slug. The file's header lists the steps.
   From January 2027 on, publish each month's bulletin page early, around the 1st of the month before (the sister site's Search Console shows "december 2026" searches start weeks ahead), then fill it in on release day.
2. **USCIS processing times in 2026, by form.** Covers I-130, I-485, N-400, I-765 and I-131 together. Needs the official numbers: egov.uscis.gov/processing-times asks for a human check, so read it in a normal browser first.
3. **N-400 processing time and interview.** 10K to 100K searches.
4. **Citizenship test questions.** 10K to 100K searches. Check the current civics test version on uscis.gov first.
5. **USCIS online account: add a paper case and read notices.** Very high navigational volume.
6. **EAD and H-4 EAD status check.** Proven impressions on the sister site.
7. **National Visa Center case status.** 10K to 100K searches.
8. **PERM processing time.** Use flag.dol.gov data.
9. **Green card interview questions.**
10. **Spanish posts.** "Boletín de visas" and "estatus de mi caso USCIS" already get impressions in Spanish.

## Rules for every post

- Facts come only from official sources (uscis.gov, travel.state.gov, dol.gov, federalregister.gov), checked the day the post is written. List them in `sources`.
- Never estimate numbers. If an official page can't be read, link to it instead of quoting a figure.
- No predictions of Visa Bulletin dates.
- Answer first in two or three sentences, then key takeaways, short sections, FAQ (5 questions) and links to our form and answer pages.
- Covers: `node --env-file=.env.local scripts/generate-image.mjs "<prompt>" src/assets/blog/<slug>.jpg 16:9`, abstract and on-palette, no text or government symbols. Then make the share crop in `src/assets/og/blog-<slug>.jpg` (600 × 630).
- Add the post to `src/lib/blog/index.ts`. The sitemap, RSS feed, llms.txt and site search pick it up automatically.
- Never mention or link the sister product on this site.
