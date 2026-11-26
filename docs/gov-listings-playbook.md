# .gov links and listings playbook

Started 2026-11-25. Three ways to earn .gov mentions without paying for them:

1. **Dead links on .gov "helpful links" pages**: find a broken link, offer our page as the fix.
2. **SAM.gov and SBA Small Business Search**: a free federal registration that puts a public profile, with our website, on a .gov site.
3. **California's supplier portal (Cal eProcure)**: the state version of the same thing.

**Never pay for SAM.gov registration. It is free.** Anyone charging for it is a reseller.

Rules that still apply here:
- Same facts everywhere (name, city, website, description). Copy them from this file, don't retype them.
- Never mention or link our sister site in any of these listings, and never list its URL as our website.
- The legal name appears in these listings only because a government registration requires it. Lead with TrackMyUSCIS (the DBA) wherever a field allows.

---

## 1. Dead links on .gov resource pages

### How the check was run
The script (kept outside the repo) fetched each page, pulled every outbound link and requested it. Anything flagged was then checked by hand. False alarms were removed, such as links with spaces in the URL, `{{template}}` placeholders, and sites that block scripts. USCIS's `egov.uscis.gov` blocks scripts, so its links were checked in a real browser.

**Pages checked on 2026-11-25 (35):** House offices (Hank Johnson, Wittman, Fletcher, Connolly, Donalds, Trahan, Magaziner, Fallon, Ramirez, Cherfilus-McCormick, Ocasio-Cortez, Simon, Espaillat, Vindman), Senate offices (Baldwin, Cortez Masto), DHS, USA.gov, NYC HRA, Delaware, New Jersey and New York state Offices of New Americans, Jersey City, Fargo library, Pima County library, Montgomery County MD, King County WA, Seattle (2 pages), Denver, LA County, Cook County, San Mateo County, California Courts self-help.

### What we found: USCIS retired two old tool URLs
Both now return **404** (confirmed in a browser):

| Old URL (dead) | What it was | Official replacement | Our page that helps |
|---|---|---|---|
| `egov.uscis.gov/casestatus/mycasestatus.do?initCaseSearch=` | Case Status Online | uscis.gov/casestatus | https://trackmyuscis.com/answers/how-to-check-uscis-case-status |
| `egov.uscis.gov/e-request/displayONPTForm.do?entryPoint=init&sroPageType=onpt` | e-Request "outside normal processing times" form | egov.uscis.gov/e-request | https://trackmyuscis.com/answers/contact-uscis-about-delayed-case |

Old copies of these URLs are probably still on many more city, county, library and congressional pages. When you find a new .gov immigration page, search its source for `mycasestatus.do` and `displayONPTForm.do` first.

### Pages with a dead link we can help fix

| .gov page | Dead link (anchor text) | Pitch |
|---|---|---|
| https://magaziner.house.gov/immigration-services | old case status URL ("status") | uscis.gov/casestatus + our case status guide |
| https://espaillat.house.gov/es/node/4601 | old case status URL ("status") | same |
| https://donalds.house.gov/en-espa-ol/english.htm | old "outside normal processing times" form | egov.uscis.gov/e-request + our delayed-case guide |

| https://www.anaheim.gov/5430/Citizenship-Corner (library) | `uscis.gov/tools/settling-us/welcome-united-states` ("Welcome to the United States: A Guide for New Immigrants"), 404 | the M-618 guide (uscis.gov/sites/default/files/document/guides/M-618.pdf) + our guides. No public library email; Central Library phone is 714-765-1880 |
| https://www.warner.senate.gov/general-questions-about-other-federal-agencies/ | `uscis.gov/resources`, 404 | uscis.gov/tools. Senate contact form only |

Contact forms checked 2026-11-25: Donalds and Espaillat only accept ZIP codes in their district. Magaziner requires a name, street address and email, and has a CAPTCHA.

Second sweep 2026-11-25 (22 more pages: Boston, Somerville, Warwick, Santa Clara and Pima libraries; Hayward, Anaheim, Lawton, Mountain View and Livermore; LA mayor, Chicago, Seattle welcoming city; Booker, Durbin, Warner; DHS case assistance). The only new dead links we're relevant to are the Anaheim and Warner rows above.

Other dead links found that we **can't** honestly replace (no pitch): Seattle's own DACA page (`seattle.gov/iandraffairs/programs/daca`) and several dead nonprofit links on seattle.gov/iandraffairs/resources; California Courts' link to `sfgov.org/oceia` (moved to sf.gov); Trahan's Census 2020 link; Fallon's uscode.house.gov link; Denver's identity-theft links.

**Be realistic:** congressional offices usually fix the link with the official USCIS URL and rarely add a private site. So always give them the official replacement first and offer our page as an optional extra. Expect a low hit rate from House offices. City, county and library pages, which already link to nonprofits and guides, are better targets. Keep scanning them.

**Possible new page:** Seattle's dead DACA link suggests a "DACA renewal: where things stand" page. That's a legal topic that keeps changing in court, so only write it with a careful source check.

### Outreach message (send through the office's contact form; House forms often ask for a ZIP in the district)

> Subject: Broken USCIS link on your immigration page
>
> Hi, a quick heads-up: the "status" link on your immigration services page goes to an old USCIS address (egov.uscis.gov/casestatus/mycasestatus.do) that now shows a "not found" page. The current USCIS case status tool is at https://www.uscis.gov/casestatus.
>
> If it's useful for constituents, we also keep a free plain-language guide on reading a USCIS case status and what each status means: https://trackmyuscis.com/answers/how-to-check-uscis-case-status
>
> Thanks for the work your caseworkers do.
> TrackMyUSCIS

For Donalds, use the e-Request URLs and the delayed-case guide instead.

---

## 2. SAM.gov and SBA Small Business Search

**What it gets us:** a SAM.gov entity record and a profile in SBA's Small Business Search (SBS, the tool that replaced DSBS in July 2025, at search.certifications.sba.gov). SBS pulls name, address, size and NAICS codes from SAM, and the profile shows our website.

**What it costs:** nothing. It takes about 10 business days, and longer if SAM asks for a notarized letter on company letterhead (for that, the Entity Administrator needs a government photo ID).

**Who has to do it:** you. SAM.gov needs a Login.gov account, the EIN, bank details for payments and the legal certifications, none of which Claude should enter.

### Steps
1. Sign in at sam.gov with Login.gov and choose **Register Entity → Get a UEI and register (all awards)**.
2. Fill in the fields below exactly as written.
3. Under Representations and Certifications, answer the size questions truthfully so the record shows **small business** for our NAICS codes.
4. After SAM activates (email notice), sign in to SBS with the same Login.gov account and add the narrative, keywords and website below.

### Fields (copy exactly)

| Field | Value |
|---|---|
| Legal business name | Zyene, Inc. |
| Doing business as (DBA) | TrackMyUSCIS |
| State of incorporation | Delaware |
| Physical address | **[fill in: street address, San Francisco, CA ZIP, must match IRS records]** |
| Website | https://trackmyuscis.com |
| Public email (SBS) | support@trackmyuscis.com |
| Primary NAICS | 519290 Web Search Portals and All Other Information Services |
| Other NAICS | 513210 Software Publishers; 541519 Other Computer Related Services; 541511 Custom Computer Programming Services |
| PSC (optional) | DA01 IT and Telecom: Business Application/Application Development Support Services |

### SBS capabilities narrative

> TrackMyUSCIS is a web app that makes USCIS information easy to follow. It checks saved USCIS cases, keeps a dated history of each status change, and explains every case status, form, receipt number and processing time in plain English. The site also publishes guides on student visas (F-1, OPT, STEM OPT), H-1B, green cards and citizenship, a monthly visa bulletin summary and a directory of immigration lawyers. We build and run our own software for public-facing information services: plain-language content, status tracking, notifications, and accessible, mobile-first web apps. We can help agencies, schools and public offices explain immigration processes to the public clearly, and keep their resource pages accurate. TrackMyUSCIS is independent and not affiliated with USCIS or any government agency.

### SBS keywords
USCIS case status, immigration case tracking, plain language, public information website, web application development, content design, accessibility, mobile-first web app, immigration information, processing times, status notifications, F-1 OPT, H-1B, green card, naturalization

---

## 3. California supplier portal (Cal eProcure)

Our state is California (company location: San Francisco). Registration is free.

1. Go to caleprocure.ca.gov → **Login/Register → New Bidder Registration**.
2. Use the **same fields as SAM above**: legal name, DBA, address, website, email and NAICS codes. Paste in the same narrative.
3. Optional but worth it: after registering, apply for **California Small Business (SB) certification** with DGS's Office of Small Business and DVBE Services (dgs.ca.gov/pd-certification). Certified firms appear in Cal eProcure's public **Certified Firm Search**, which shows the business's profile. If we qualify, a Microbusiness (MB) tag is added automatically. Questions: Certification@dgs.ca.gov, (916) 375-4940.
4. City level, optional: register on San Francisco's supplier portal (SF City Partner) with the same facts.

## Tracking

| Item | Status | Date |
|---|---|---|
| Magaziner dead link reported | not sent | |
| Espaillat dead link reported | not sent | |
| Donalds dead link reported | not sent | |
| SAM.gov registration | not started | |
| SBS profile filled in | waiting on SAM | |
| Cal eProcure registration | not started | |
| CA SB certification | not started | |
