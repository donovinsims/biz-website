# Clockout website audit: plan

## Context
The attachment is an audit prompt (not an image): audit the Clockout site against the business context, recommend second, change third. No code changes are made until the owner picks recommendations (Step 5). This plan covers Steps 1-4 and 6 as a written report, with no edits to `src/`.

Inputs found in the repo: business context digest at `.agents/product-marketing.md` (derived from `clockout-business-context.md`, Sept 30 2026; the original file is not in the repo), prior optimization passes at `.agents/audit-progress.md`, the built site (Home, Examples, About, Privacy, Terms), and `src/content/site.ts`.

## Missing inputs (asked once, proceed on labeled assumptions)
1. The original `clockout-business-context.md` (only the digest is available; the digest wins any conflict).
2. How leads are actually handled after the form is submitted, including nights and weekends. I will not assume a workflow.
3. Analytics, Search Console, and Google Business Profile status (link or "not set up").
4. Final domain, or whether it is still undecided; where the site is deployed.
5. Whether any competitor names or outreach messages should be included.

Web access: available (WebSearch/WebFetch). Step 2 research will be dated and cited; the live site cannot be fetched (no public URL), so audit is of source code and the running preview only.

## Preliminary evidence from code (to be confirmed in the audit)
- **Critical, lead handling:** `FreeLookForm.tsx` only POSTs if `VITE_FORM_ENDPOINT` is set; otherwise it `console.info`s the payload and still shows "I'll reach out within an hour." Promise may not be operationally real.
- **High, stack:** brief requires Next.js; project is Vite + React Router SPA. Titles, meta, OG and JSON-LD are injected client-side in `useSeo` (`src/lib/seo.ts`); `index.html` has no static title or description. Crawlability and AI-search risk.
- **High, technical SEO:** no `public/` dir, so no `robots.txt`, sitemap, canonical, favicon, or OG image. `path: "*"` renders HomePage (soft 404).
- **High, local trust:** phone is a 608 number vs Roscoe/Rockford (815); contact email is a Gmail address; founder photo hosted on a third-party URL (`PHOTO_URL`).
- **Medium, schema:** `ProfessionalService` with `SITE_URL` from `window.location.origin` (wrong on previews, empty without JS); no `sameAs`, hours, or Business Profile tie-in.
- **Medium, claims:** FAQ items marked `[CONFIRM]` (data handling, support) are live copy; "I read every one myself" and "within an hour" depend on item 2 above.
- **Passed per prior notes (to re-verify):** "Clockout" spelling, no prices, single offer, no jargon, mobile overflow at 320px, tap targets.

## Deliverable (report in chat, headings per the prompt)
Header (date 2026-10-01, inputs, web access) / Context digest (<=10 lines) / Research brief (<=12 dated, cited, confidence-tagged bullets across A-F) / Audit findings (table per page, then site-wide, 14 dimensions, severity + confidence, quoted evidence) / Synthesis (one top recommendation, <=10 ranked list, Not-now list, risks, <=3 decisions, Fact/Assumption/Hypothesis/Recommendation labels) / 30- and 90-day re-audit checks.

## Method
1. Read remaining pages and components (`HomeSections.tsx`, `AboutPage.tsx`, `ExamplesPage.tsx`, `ExampleModal.tsx`, `LegalPages.tsx`, `SiteShell.tsx`, `track.ts`) for quoted evidence.
2. Run Step 2 web research (Google AI features and local guidance, owner AI adoption, Rockford-area competitors, WCAG 2.2 / CWV, Illinois and TCPA/SMS rules flagged for professional review, Next.js/COSS/Kibo changes).
3. Verify in the running preview: mobile and desktop, light/dark, modal focus/scroll behavior, rendered-vs-source HTML.
4. Write the report. Stop before implementation.

## Verification
Every finding cites file and quoted text; no invented stats or proof; each research bullet has source, date, confidence. Report ends with at most 3 decisions for the owner.
