#!/usr/bin/env node
/**
 * Tell IndexNow (Bing, Yandex, Seznam, Naver…) that pages are new or changed, so they are
 * re-crawled within minutes instead of days. Bing's index also feeds ChatGPT search and Copilot.
 * Google does not use IndexNow; use Search Console URL Inspection for Google.
 *
 *   npm run indexnow -- /answers/how-to-check-uscis-case-status /privacy
 *   npm run indexnow -- --all          # every URL in the live sitemap
 *   npm run indexnow -- --all --dry-run
 *
 * Run only AFTER the change is deployed to production. The key is the public file
 * public/<key>.txt (it must be reachable at https://trackmyuscis.com/<key>.txt).
 * SITE_URL can override the host for a different deployment.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SITE = (process.env.SITE_URL ?? "https://trackmyuscis.com").replace(/\/$/, "");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const paths = args.filter((a) => !a.startsWith("--"));

const publicDir = join(process.cwd(), "public");
const keyFile = readdirSync(publicDir).find(
  (f) => /^[a-f0-9]{32}\.txt$/.test(f) && readFileSync(join(publicDir, f), "utf8").trim() === f.slice(0, 32),
);
if (!keyFile) {
  console.error("No IndexNow key file found in public/ (expected <32 hex chars>.txt containing the same key).");
  process.exit(1);
}
const key = keyFile.slice(0, 32);

let urls = paths.map((p) => (p.startsWith("http") ? p : `${SITE}${p.startsWith("/") ? p : `/${p}`}`));
if (all) {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) {
    console.error(`Could not read ${SITE}/sitemap.xml (HTTP ${res.status}). Is the site deployed?`);
    process.exit(1);
  }
  const xml = await res.text();
  urls = [...urls, ...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])];
}
urls = [...new Set(urls)].filter((u) => u.startsWith(SITE));
if (urls.length === 0) {
  console.error("Nothing to submit. Pass paths (e.g. /answers/what-is-form-i-797) or --all.");
  process.exit(1);
}

const body = { host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList: urls.slice(0, 10000) };
console.log(`${dryRun ? "[dry run] Would submit" : "Submitting"} ${body.urlList.length} URL(s) to IndexNow for ${body.host}:`);
body.urlList.slice(0, 20).forEach((u) => console.log(`  ${u}`));
if (body.urlList.length > 20) console.log(`  …and ${body.urlList.length - 20} more`);
if (dryRun) process.exit(0);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
// 200 = accepted, 202 = accepted (key check pending). 403 = key file not reachable; 422 = URL not on this host.
const meaning = { 200: "accepted", 202: "accepted, key check pending", 400: "bad request", 403: "key not valid or key file not reachable", 422: "URLs don't belong to this host", 429: "too many requests" };
console.log(`IndexNow: HTTP ${res.status} ${meaning[res.status] ?? ""}`.trim());
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
