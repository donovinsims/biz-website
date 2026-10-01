# Clockout website: full build (after Phase 0)

## Context
Phase 0 is being finished in another chat. It covers COSS UI init, Kibo Theme Switcher, react-router, the Threads-style monochrome tokens, the no-flash theme script and the Donovin photo. This plan assumes all of that is in place and builds the rest of the site from the brief (attachments `design-prompt.txt` and `clockout-business-context.md`). The goal is a mobile-first (390px) lead-gen site with Home, /examples and /about. Every page pushes the visitor to the free-look form or a call/text.

Stack: Vite + React 19 + Tailwind v4 (kept instead of Next.js). UI comes only from COSS (`@/components/ui/*`) and Kibo (`@/components/kibo-ui/*`). The workflow diagram is custom SVG + Tailwind. No other UI, animation or diagram packages.

Before starting, invoke the `coss` and `coss-particles` skills to check component APIs (Base UI composition, `render` prop, Dialog/Drawer, Accordion, Form/Field, Toast).

## File layout
```
src/
  App.tsx                 routes: /, /examples, /about, /privacy, /terms (+ scroll-to-hash/top)
  content/site.ts         contact info, towns, CTA text, problems, steps, FAQ, "won't do" list
  content/examples.ts     the 5 examples (slug, icon, hook, problem, setup, control, changes, day, flow graph)
  lib/seo.ts              useSeo(title, description, jsonLd) — sets <title>, meta, JSON-LD script
  lib/track.ts            track(event, params) → window.gtag if present (no-op otherwise)
  components/site/
    SiteShell.tsx         header + <Outlet/> + footer + MobileCtaBar
    Header.tsx            wordmark, nav, Call/Text, "Free look", ThemeSwitcher; mobile menu in COSS Sheet
    Footer.tsx            wordmark, Roscoe IL, phone, email, Examples/About/Privacy/Terms, ©2026
    MobileCtaBar.tsx      fixed bottom bar <md: [Call] [Text] [Free look]; adds bottom padding to body
    ContactButtons.tsx    Call (tel:+16087131651) + Text (sms:) outline pills, tracked
    PrimaryCta.tsx        "Get a free look at your business" → smooth-scroll to #free-look (or /#free-look)
    Section.tsx           consistent spacing, max-w 1100px, thin top divider, H2 + optional subhead
    FreeLookForm.tsx      the form (shared by all pages)
    FinalCta.tsx          H2 "Tell me your biggest headache." + form + "What happens next" + contact + "Where I work"
    TownsMarquee.tsx      Kibo Marquee of service towns
  components/home/        Hero, Problems, HowItWorks, ProofFirst, WhoBehind, WontDo, Faq
  components/examples/    ExampleCard, ExampleModal, WorkflowDiagram, FlowList
  pages/                  HomePage, ExamplesPage, AboutPage, PrivacyPage, TermsPage
```
All copy is used exactly as written in brief §4. Text strings live in `content/*` so pages stay lean.

## Kibo additions (`npx kibo-ui add <name>`, one at a time)
`marquee` (towns strip), `comparison` (before/after slider in the proof sample), `announcement` or `pill` (labels such as "Example, not a client result" and "Illustrative example"). Map any `--success/--info/--warning/--destructive` usage to neutral tokens in `src/index.css`.

## Pages

**Home (§4.1–4.9)**
- Hero: eyebrow, H1, subhead, PrimaryCta, microcopy, "Would rather talk?" Call/Text links, and the photo (right on desktop, below the text on mobile, `fetchpriority=high`).
- Towns marquee under the hero (static wrap when reduced motion is on).
- Problems: 5 COSS Cards in a grid of 1/2/3 columns, line icons from lucide (already a COSS dependency), plus the closing line.
- How it works: 3 numbered steps, stacked on mobile and in a row on desktop.
- Proof-first: a visually distinct framed section (subtle-fill `bg-muted`, larger radius). The sample block uses a Kibo Comparison with two simple, labelled "before/after website concept" mock panels built in Tailwind, plus the label "Example of what a free look can look like." Then the /examples link and the CTA.
- Who's behind it: second photo crop (`object-position`), body copy, "Read my story →", first name, Roscoe IL, phone and email.
- What I won't do: check-list. The `[CONFIRM]` item is kept and marked with a code comment, not shown as a visible bracket.
- FAQ: COSS Accordion.
- FinalCta.
- Inject `ProfessionalService` JSON-LD with the areaServed towns, phone and email, and the brief's title and meta description.

**About (§4.10)**
- Photo beside the H1 (stacked on mobile), H1 "Hi, I'm Donovin." and the subline.
- Body in a ~680px column at 18px+ with the copy verbatim, a pull-quote block, and the small numbered Audit/Optimize/Automate block.
- CTA + microcopy, Call/Text, and FinalCta (form).
- `Person` JSON-LD with the title and meta description.

**Examples (§4.11)**
- H1, subline, and the honesty note in an Announcement.
- Grid of 6 cards (1/2/3 columns). Each card is a `<button>` of at least 48px with icon, title, hook and "See how it works →".
- Card 6, "Something else eating your week?", scrolls to `#free-look`.
- Below the grid: the "Most owners don't need all of these…" line, CTA, Call/Text, and FinalCta.
- Leave a commented slot above the grid for a future real example.

**Privacy / Terms**
- Short plain-language pages, required by brief §9 and linked from the footer. They are not in the main nav.

## Examples modal
- `ExampleModal` uses `useMediaQuery('(min-width: 768px)')` from COSS. Desktop gets a COSS Dialog (max-w ~880px, dimmed backdrop). Mobile gets a full-screen COSS Drawer/Sheet. Base UI already provides focus trap, Esc, backdrop close, scroll lock and focus return, and the title labels the dialog.
- 48px X button.
- Prev/Next arrows cycle through the 5 examples.
- Sticky footer with the CTA plus Call/Text. Clicking the CTA closes the modal and then scrolls to the form.
- Content order follows §4.11, with the small "Illustrative example, not a client result" label at the end.
- Hash sync: opening sets `#slug` with `history.replaceState`, closing clears it. On load and on `hashchange`, the matching modal opens. Prev/Next updates the hash.

## WorkflowDiagram (custom, the most complex piece)
- **Data model** per example: `nodes: {id, type: 'trigger'|'step'|'draft'|'decision'|'approve'|'result', label}` and `edges: {from, to, label?: 'Yes'|'No'}`, plus a `path: string[]` for the play order (the main "yes"/primary route).
- **Layout:** a small layering function assigns column = longest-path depth and row = branch index. Desktop places nodes left→right on a dot-grid panel (CSS `radial-gradient` of `--border`). Mobile (<768px) places them top→bottom, with branches shown as side-by-side pairs inside the column, so there's no horizontal scroll.
- Nodes are absolutely positioned HTML (rounded rectangles with an icon circle and a step-number badge). Edges are an SVG overlay of cubic-bezier paths with `marker-end` arrowheads and "Yes/No" labels. Everything uses `currentColor` and tokens, so both themes work.
- **Node styles, monochrome:**
  - Trigger: solid `bg-foreground text-background` + Zap icon
  - Step: 1px outline
  - Draft: dashed border + Sparkles icon
  - Decision: badge with a rotated-square marker + CircleHelp icon
  - Approve: double border (`ring` offset) + Hand icon
  - Result: solid + Check icon
- **Play:** a glowing dot (foreground dot with soft `box-shadow` in the foreground color, so it stays monochrome) moves along the `path` edges with an SVG `<animateMotion>`-free approach. Each segment animates via CSS `offset-path: path(...)` keyframes at ~1.5s per step, and the active node gets a highlight ring. The diagram auto-plays once on open. The button then changes to "Replay".
- **Reduced motion** (`matchMedia('(prefers-reduced-motion: reduce)')`): static diagram with the numbers only and the Play button hidden.
- The "See the steps as a list" toggle renders `FlowList`, an ordered list including the branches.

## Form (FreeLookForm)
- Uses COSS Form/Field/Input/Textarea/Label/Button.
- Required fields: name, business, phone. Optional: headache textarea, website URL, email (behind an "Add more details" disclosure to keep the form short).
- Inline validation errors use icon + text, `aria-invalid` and `aria-describedby`.
- Hidden honeypot field (`company_fax`), so submissions with it filled are silently dropped.
- **Submit:** POST JSON to `import.meta.env.VITE_FORM_ENDPOINT`, a form service that emails clockout815@gmail.com and can forward to Google Sheets and send the visitor an autoresponder. Formspree-compatible payload. Include UTM params from the URL and the page path.
- If no endpoint is configured (dev), fall back to logging plus the success state.
- **Success:** the form is replaced with the inline thank-you "Got it. I'll review your business and reach out within an hour.", a COSS Toast fires, and `track('generate_lead')` is called.
- On failure, show a message offering Call/Text/email.
- Microcopy: "No payment. No spam. I read every one myself."

## Cross-cutting
- **Smooth scroll:** `html { scroll-behavior: smooth }` inside `@media (prefers-reduced-motion: no-preference)`. Add `scroll-margin-top` for the sticky header. PrimaryCta on other pages navigates to `/#free-look`; it scrolls in place on pages that have FinalCta, which is all three.
- **Tracking:** `track()` on phone, sms and email taps, CTA clicks, form submit, and the proof section entering view (IntersectionObserver, fired once). GA4 is enabled later through `.figma/make/site.json` `analytics.googleAnalyticsId`.
- **SEO:** Home title/description go in `.figma/make/site.json` (the default shell). `useSeo` sets per-route values. OG title is "Clockout". Favicon is a simple "C" SVG in `public/`.
- **Accessibility:** one H1 per page, 2px focus ring through the `--ring` token, all targets ≥48px, below-fold images use `loading="lazy"`.
- **Spelling:** always "Clockout".

## Verification
- `pnpm build` passes.
- In the preview at 390px, 768px and desktop, in both themes: check every page, the sticky bar, the mobile menu, the FAQ accordion, the form (validation, success, honeypot), and that tel/sms/mailto links are correct.
- Open `/examples#reviews` directly. Check that the modal opens, Prev/Next updates the hash, Esc closes and focus returns to the card, the diagram plays and replays, and reduced motion shows the static diagram.
