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
| [OPT processing time 2026](/blog/opt-processing-time-2026) | opt processing time, opt ead processing time, how long does opt take |
| [STEM OPT extension 2026](/blog/stem-opt-extension-2026) | stem opt processing time, stem opt extension, 180 day rule |
| [OPT premium processing 2026](/blog/opt-premium-processing-2026) | opt premium processing, opt premium processing fee, 1780 |
| [OPT 90-day unemployment rule](/blog/opt-unemployment-90-days) | 90 day unemployment rule opt, opt unemployment days, stem 150 days |
| [Proposed $70,000 OPT fee](/blog/proposed-opt-fee-2026) | opt fee 70000, opt fee proposed rule |
| [November 2026 Visa Bulletin](/blog/november-2026-visa-bulletin) | visa bulletin, november visa bulletin 2026, priority date |
| [I-140 status check](/blog/i-140-status-check) | i-140 status, i140 tracker, i-140 premium processing fee |
| [Green card renewal (I-90)](/blog/green-card-renewal-i-90) | green card renewal, i-90 fee, green card renewal processing |

## Student and OPT demand (sister site, 3 months to 2026-11-24, impressions)

OPT processing time 188K, case status guide 76K, I-140 tracking 67K, OPT premium fee 48K, STEM OPT processing time 42K, 90-day unemployment 40K, OPT premium timeline 37K, EAD pending delays 36K, travel on OPT 22K, is my degree STEM eligible 21K, H-4 EAD status 18.5K, OPT denied 17K, Real ID for students 17K, 60-day grace period 16.6K, E-Verify number vs EIN 16K, second master's OPT 15K, OPT biometrics 15K, start work before EAD 14K, Spanish visa bulletin 13.6K, renewing F-1 visa on OPT 12K.

Official numbers read on 2026-11-24: I-765 (c)(3) 6 months, I-765 (c)(26) standalone H-4 18.5 months (80% of cases, Service Center Operations).

## Next, in priority order

1. **Fill in the December 2026 Visa Bulletin post the day it's published** (still "Coming soon" on 2026-11-24). Add the charts and what moved, rewrite the answer, status section and first FAQs, and keep the slug. The file's header lists the steps.
   From January 2027 on, publish each month's bulletin page early, around the 1st of the month before (the sister site's Search Console shows "december 2026" searches start weeks ahead), then fill it in on release day.
2. **Student topics next:** H-4 EAD status and processing time (18.5 months on 2026-11-24), EAD pending and delayed cases, travel on OPT, is my degree STEM eligible (CIP codes), OPT denied, 60-day grace period, start work before the EAD arrives, F-1 fixed admission rule (on hold since the September 14, 2026 court order).
3. **USCIS processing times in 2026, by form.** Covers I-130, I-485, N-400, I-765 and I-131 together. Needs the official numbers: egov.uscis.gov/processing-times asks for a human check, so read it in a normal browser first.
4. **N-400 processing time and interview.** 10K to 100K searches.
5. **Citizenship test questions.** 10K to 100K searches. Check the current civics test version on uscis.gov first.
6. **USCIS online account: add a paper case and read notices.** Very high navigational volume.
7. **EAD and H-4 EAD status check.** Proven impressions on the sister site.
8. **National Visa Center case status.** 10K to 100K searches.
9. **PERM processing time.** Use flag.dol.gov data.
10. **Green card interview questions.**
11. **Spanish posts.** "Boletín de visas" and "estatus de mi caso USCIS" already get impressions in Spanish.

## Rules for every post

- Facts come only from official sources (uscis.gov, travel.state.gov, dol.gov, federalregister.gov), checked the day the post is written. List them in `sources`.
- Never estimate numbers. If an official page can't be read, link to it instead of quoting a figure.
- No predictions of Visa Bulletin dates.
- Answer first in two or three sentences, then key takeaways, short sections, FAQ (5 questions) and links to our form and answer pages.
- Covers: `scripts/blog-cover.sh <slug> "<prompt>" [focus]`. It generates with Gemini, trims 0.5% off every edge and makes the 600 × 630 share crop. The picture must show what the post is about (the people, documents and situation), in the brand palette, with no readable text, flags, seals or real government document designs. Write alt text that describes what's visible.
- Add the post to `src/lib/blog/index.ts`. The sitemap, RSS feed, llms.txt and site search pick it up automatically.
- Never mention or link the sister product on this site.
