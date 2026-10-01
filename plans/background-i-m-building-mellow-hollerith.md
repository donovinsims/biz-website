# Clockout — build the accepted design/UI fix plan

## Context
The accepted audit plan (`plans/background-i-m-building-toasty-glade.md`) is the spec. The app does not compile: `src/app/routes.tsx` uses un-imported `SiteShell`, `HomePage`, `ExamplesPage`, `AboutPage`, `PrivacyPage`, `TermsPage`, and still imports a stale parallel tree (`./chrome`, `./pages/*`). `src/App.tsx` imports `router` from `@/app/routes`, and nothing outside `src/app/` references the stale files. Build in the order below, running `npx tsc --noEmit` after each phase.

## Phases
1. **P0 (unblock)**
   - Rewrite `src/app/routes.tsx` to import `SiteShell` from `@/components/site/SiteShell` and the pages from `@/pages/*`. Remove the dead `Shell` and its stale imports. Keep the scroll-to-top-on-navigation behavior, in SiteShell if it is not already there.
   - Delete `src/app/{chrome,cta,workflow,lib}.tsx`, `src/app/examples-data.ts` and `src/app/pages/`.
   - `ExampleModal.tsx`: always render Dialog, full-screen on mobile via `max-sm:` classes. Drop the Sheet branch and `useMediaQuery`.
2. **P1**: items as listed in the audit plan.
   - SiteShell: mobile bar padding moves to the footer wrapper.
   - ExampleModal: retain the last example while closing; add `DialogDescription`; prev/next in the footer on mobile.
   - Focus rings on cards and the BeforeAfter slider.
   - FreeLookForm: distinct error treatment and `role="alert"`.
   - Theme switcher: no pop-in, unique `layoutId`, shared state.
3. **P2**: as listed.
   - `index.css` token dedupe, layered base rules, no unlayered `!important` reset, single scroll offset.
   - 48px consistency and hit areas; sticky bar hides when the form is in view or an input has focus.
   - Contrast, email wrapping, image dimensions.
   - Modal keyboard nav, scroll reset and live region.
   - List toggle `aria-pressed`; breakpoint unified at 768.
   - WorkflowDiagram: mobile widths, reduced-motion Play, `useId` marker.
4. **P3**: as listed (ProofFirst padding, heading tokens, "(optional)", icon glyphs, `index.html` meta and try/catch, edge-label sizing).

## Constraints
- Preserve the existing COSS UI components and the Kibo theme switcher, the monochrome tokens, the 48px pill buttons and the three routes. Edit in place; don't restructure.
- Out of scope: form backend, legal copy, `[CONFIRM]` copy, favicon/OG/analytics.

## Verification
- `npx tsc --noEmit` is clean.
- Preview at 375px and 1280px, light and dark: Home, Examples and About.
- Footer fully visible above the sticky bar.
- Modal open, prev/next, close and exit animation.
- Play/Replay and the list toggle.
- Keyboard tab through cards and the slider.
- Form error state.
