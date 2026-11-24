# Refreshing the processing-time pages (monthly)

The pages under `/processing-times/<form>` read `src/lib/processing-times-data/<date>.json`, a snapshot of the official USCIS tool (https://egov.uscis.gov/processing-times/). The tool is behind a bot check, so read it in a normal Chrome window.

1. Open the tool in Chrome (Claude in Chrome) and wait for the form list to load. The built-in browser gets a bot check; don't try to get past it.
2. In the page, wrap `window.fetch` to keep each response to `POST /processing-times` that contains `{"data":{"data":{"processingTime"`. It holds `officeCode`, `formName`, `completionMonth` and `subtypes[]` with `formType`, `range`, `serviceRequestDate` (the case inquiry date), `subtypeNoteEn`/`formNoteEn` (USCIS's notes) and `publicationDate`. **The number the page shows as "80% of cases are completed within" is `range[1]`.** Ignore `range[0]`.
3. For every form, category and office: set the three selects (native value setter plus a `change` event), submit with the "Get processing time" button, wait for a response whose `officeCode` matches, and check `range[1]` against the page text. Use a MessageChannel-based sleep and keep the tab in front: Chrome throttles timers in background tabs. Call `performance.setResourceTimingBufferSize(100000)`, because the default buffer fills after 250 requests.
4. Export each form as entries separated by ` ¶ ` (the tool output is cut at about 1,000 characters, so read it in slices):
   `#META <checked>^<USCIS last updated>^<period>`, `#NOTE <n>~<text>`, `#OFF <code>~<name>`, and
   `@<FORM>^<category code>^<category name>|<office>:<value>[W|D|Y]:<inquiry YYYY-MM-DD or ->:<note n or ->` (no unit letter means months).
5. Run `python3 scripts/processing-times-to-json.py src/lib/processing-times-data/<YYYY-MM-DD>.json part1.raw part2.raw …`. Notes are de-duplicated across files, and placeholder notes such as `$2` are dropped.
6. Add the new file at the top of `SNAPSHOTS` in `src/lib/processing-times.ts` (newest first) and keep the older ones. If a new USCIS note says a time covers only part of a category, add it to `PARTIAL` there.
7. Run `npx next build`, open two or three pages, then commit.

Rules: only numbers read from the tool on the day; no estimates or predictions.

## What updates by itself, and what doesn't

- The field office pages (`/processing-times/<form>/<office>`), the sitemap, llms.txt, site search and the "How long it takes" block on each form page all read the newest snapshot, so step 6 updates them too. An office that USCIS drops from the tool loses its page (a real 404); add a redirect if that page had traffic.
- The lead categories used in search descriptions and short answers are in `HEADLINE` in `src/lib/processing-times.ts`. If USCIS renames a category code, update it there.
- **Fees, documents and form editions do not come from this tool.** They live in `src/lib/form-facts.ts`. Each month, open the USCIS Fee Schedule (https://www.uscis.gov/g-1055, the PDF's footer shows its edition date) and each form's uscis.gov page ("Edition Date"), and update the rows, `FEE_SCHEDULE_EDITION` and `FORM_FACTS_CHECKED` together. Never estimate a fee.
- Case status pages are in `src/lib/statuses.ts` (`STATUSES_UPDATED`). Recheck them when USCIS changes its mail, biometrics, RFE or appeals guidance.

