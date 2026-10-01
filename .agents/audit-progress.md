# Clockout audit progress

Skills installed to `.claude/skills/` (Claude Code) via `npx skills add … -a claude-code -y`.
Note: build brief was not attached; business context doc + current build used as spec. Live code: `src/pages`, `src/components/{site,home,examples}`, `src/content`. `src/app/*` (except routes.tsx) is unused legacy.

## Pass 1 · product-marketing
- Findings: unsupported "No long lock-in contracts" (contract terms are [Open]); FAQ "customers know it's AI?" contradicted "no robot pretending to be you"; FAQ "how long does the free look take" didn't answer; hero paraphrased core promise.
- Applied: removed lock-in claim; rewrote both FAQs; hero subline now "I find the bottleneck, fix the process, then automate the rest."; created `.agents/product-marketing.md`.
- Rejected: none. Positioning, offer, founder voice already accurate.

## Pass 2 · customer-research
- Findings: data-privacy fear (top AI barrier in surveys) not addressed anywhere; voicemail abandonment (Invoca) sharper than "calls go unanswered".
- Applied: new FAQ "What happens to my customer information?" (marked [CONFIRM]); sharpened first problem line. Research saved to `.agents/customer-research.md`.
- Rejected: citing vendor statistics on site (unverifiable, off-voice).

## Pass 3 · site-architecture
- Findings: architecture (Home/Examples/About + form on every page, CTA rightmost in nav) already matches brief; no contact page in brief or build, none added. About stacked two identical CTA blocks; About had no link to Examples.
- Applied: replaced About's in-article CTA block with a "See examples of what I set up" link (FinalCta form follows directly).
- Rejected: adding /contact, services, or 404 page (not in brief); legal pages kept in footer only.

## Pass 4 · offers
- Findings: value-equation weakest lever = unclear deliverable/time; form section never named the offer; next steps didn't say you see part of the fix.
- Applied: form heading "Get a free look at your business."; subline states what you get before paying; 4 concrete next steps (form ~1 min → reply within an hour → see part of the fix or honest "nothing" → you decide).
- Rejected: bonuses, guarantees beyond the honest-answer promise, any urgency/scarcity.

## Pass 5 · copywriting
- Findings: hero paragraph repeated the town list (also in strip + form); reviews/get-paid example bullets were vague fragments.
- Applied: hero paragraph trimmed to person + outcome; reviews setup/changes and get-paid follow-up rewritten as concrete outcomes.
- Rejected: rewriting headlines/CTAs (already plain, outcome-led, first-person).

## Pass 6 · marketing-psychology
- Findings: switching anxiety, regret aversion, choice overload already handled (nothing to sign, use existing tools, "one fix to start", honest no). Gap: success state didn't say which number Donovin calls from (unknown-number avoidance risks a missed first contact).
- Applied: success state now names the number and suggests saving it.
- Rejected: social proof, anchoring, scarcity, loss-framed pressure copy (none supportable or on-brand).

## Pass 7 · design-first-ui-prompting
- Findings: H2 sizes/tracking drifted (2.6 vs 2.75rem, no negative tracking, no balance); three boxed containers in a row (problem cards, steps grid, proof panel) read as template; one-off uppercase eyebrow pill and off-scale 2rem radius on proof panel.
- Applied: `text-h2` utility in index.css used by every H2; Problems converted to editorial ruled list; eyebrow pill removed; proof panel radius → 3xl. Spec written to `.agents/design-system.md` — art direction LOCKED.
- Rejected: hero recomposition, new accent color, display serif (would replace approved direction).

## Pass 8 — make-interfaces-feel-better
- Top finding: image edges used solid borders that look heavy on photos. Switched them to a 1px inset outline at 10% opacity.
- Applied: `text-wrap: pretty` on paragraphs; replaced `transition-all` with scoped transitions on the dialog/sheet backdrop and accordion; the inline Call/Text links now meet the 44px target; removed the duplicate toast so the form shows only the success panel.
- Rejected: concentric radius on the proof panel (its padding is too large for the rule to apply).

## Pass 9 — emil-design-eng
| Before | After | Why |
| --- | --- | --- |
| Buttons didn't respond when pressed | `scale(0.97)` on `:active` | A press should feel acknowledged |
| Sticky bar used the default ease | `cubic-bezier(0.23,1,0.32,1)` | Feels like an immediate response |
- Kept: the marquee (slow and decorative, off under reduced motion), the Kibo theme switcher indicator, and the flow dot (skipped when reduced motion is on).
- Rejected: adding entrance animations. The content is read once, so motion there would only add noise.

## Pass 10 — cro (mobile skeptic view)
- Top finding: on a 390px screen the hero H1 ran 7 lines, which pushed the risk-reversal line toward the fold. The subline is now a smaller muted second tier, so the CTA, the reassurance, and the call option all sit higher.
- Verified: the primary CTA is above the fold, the sticky Call / Free look bar is present, the cost FAQ is answered honestly, the form asks only for what's needed with a honeypot, and nothing creates fake urgency.
- Rejected: adding testimonials, logos, or a "spots left" message. There's no real proof yet, and the constraints rule them out.

## Pass 11 — copy-editing
- Top finding: the copy is already clean. In the live tree, "Clockout" is spelled correctly everywhere (lowercase appears only in the storage key). There are no em dashes, no jargon (leverage/seamless/streamline), and no references to the old site.
- Kept on purpose: "actually" (×2) and "simply" (×1). Each one carries emphasis in a founder voice.
- No changes applied.

## Pass 12 — analytics
- Top finding: tracking was GA-only with inconsistent names (phone_tap, generate_lead), and nothing captured form_start.
- Applied: `src/lib/track.ts` is now a typed, provider-agnostic layer (dataLayer push + optional gtag + a `clockout:track` CustomEvent). Events: cta_primary_click, examples_cta_click, example_open, example_cta_click, form_start (fires once, ignores the honeypot), form_submit, call_tap, text_tap, email_tap, proof_section_view. Params carry only `source` or `slug`, with no field contents.
- Not added: a contact-visit event, because there's no contact page. No vendor script is installed; GTM/GA ID is still needed.

## Pass 13 — hallmark (audit only)
- Top finding (gates 34/50): the homepage scrolled sideways by 52px at 320px. Bare `1fr`/auto grid tracks plus a nowrap CTA inside the padded proof panel caused it.
- Applied: grid tracks now use `minmax(0,…)` (hero, who, final CTA, about); proof panel mobile padding is p-5; below 360px the primary CTA reads "Get a free look" so it stays on one line (gate 49). Overflow is now 0 on all pages at 320px.
- Passed: no italic headings, no invented metrics, no fake chrome, no inline colors outside tokens.
- Rejected: theme catalog/token renaming and the "Variety" rotation. Art direction is locked and the existing tokens are coherent. Also rejected the `overflow-x: clip` root guard, since the real cause is fixed and a clip would hide future regressions.

## Final QA + component audit
- 4 modes (390/1280 × light/dark, reduced motion): 0 overflow on all 5 routes, no JS errors, no 4xx (the earlier 404 is gone). Dialog takes focus, all 5 examples step through, Esc returns focus to the trigger. The mobile Sheet nav traps focus. An empty form submit focuses the first invalid field. The wordmark target was raised to 44px.
- Removed dead legacy `src/app/*` (chrome, cta, examples-data, lib, pages, workflow) and kept routes.tsx. Removed the unused `cn` dependency.
- Sources: only COSS (`components/ui`) and Kibo (`kibo-ui/theme-switcher`). base-ui, daypicker, radix controllable-state, and motion are imported only inside those. No ObsidianUI. `vite build` passes.

## Responsive audit
- Scope: 320/360/375/390/414/768/1024/1280/1440 plus 844×390 landscape, all 5 routes. Checked overflow, tap targets, button wrapping, hero fold, mobile menu, example dialog, slider.
- Result: 0 sideways overflow at every width on every route. The hero CTA sits at y 550–598 inside the 375×667 fold. The example dialog fits 844×390 (351px tall, no inner scroll). The sticky bar has `pb-[calc(6rem+…)]` page padding and hides over the form. The mobile menu renders cleanly.
- Fixed: the footer phone link was 24px tall and is now min-h-12. The slider range input now has `touch-pan-y`, so vertical swipes scroll the page while horizontal drags move the handle.
- Left alone: the FAQ triggers wrap to 2–3 lines by design, and the hero inline "Call"/"Text" links are 44px tall but about 36px wide inside a sentence.
- After image: the source was a 3324×6535 full-page screenshot (10.7MB), now a 1400×1680 WebP (180KB) cropped from the top. The 4/5 mobile frame shows only a strip of the page's hero, which is a crop limit of the source.
- Slider screenshots: 390 and 1280, light and dark, at 20/50/80%.
