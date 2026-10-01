# Clockout — design/UI defect audit & fix plan

## Context
User asked for a full design/UI audit. Code-read audit (no browser yet) found the app currently **does not compile** plus a set of layout, dark-mode, a11y and modal defects. Plan fixes them in priority order. Out of scope: form backend, legal copy, `[CONFIRM]` copy, favicon/OG/analytics (already tracked by user).

## P0 — Blockers
1. `src/app/routes.tsx` references un-imported `SiteShell`, `HomePage`, `ExamplesPage`, `AboutPage`, `PrivacyPage`, `TermsPage` (7 TS errors → blank preview). Import from `@/components/site/SiteShell` and `@/pages/*`; remove dead `Shell` and stale imports.
2. Delete the stale parallel tree: `src/app/{chrome,cta,workflow,lib}.tsx`, `src/app/examples-data.ts`, `src/app/pages/*` (keep `routes.tsx`).
3. `ExampleModal.tsx:81-130` switches to a Sheet under 768px — violates "Dialog not Drawer". Use Dialog at all sizes, full-screen on mobile via `max-sm:` classes; drop `useMediaQuery`.

## P1 — High
- Mobile sticky bar covers footer (`SiteShell.tsx:270`): move bottom padding from `main` to the wrapper/footer with `calc(6rem + env(safe-area-inset-bottom))`, `md:pb-0`.
- Modal empties during exit animation (`ExampleModal.tsx:87`): retain last example while closing.
- Add `DialogDescription` (use `example.hook`).
- Modal header crowding at 375px: move prev/next into footer row on mobile.
- Example cards lack focus-visible ring (`ExamplesPage.tsx:11`).
- Before/after slider has no visible focus (`BeforeAfter.tsx:84`): `peer` + `peer-focus-visible:` ring on handle.
- Form errors: `--destructive` equals foreground in both themes — give errors a distinct treatment (icon + weight + `aria-invalid` border) and `role="alert"`/`aria-live` on `ErrorText` (`FreeLookForm.tsx:52`).
- Theme switcher: avoid null-until-mounted pop-in (`theme-switcher/index.tsx:58`), unique `layoutId` per instance, share one theme state between header and menu instances.

## P2 — Medium
- `index.css`: collapse three duplicated `:root/.dark` token blocks into one; put `html`/`::selection` rules in `@layer base`; remove unlayered `*{…!important}` reset (keep reduced-motion rule layered); fix double scroll offset (keep one of `scroll-padding-top`/`scroll-margin-top`, ≈ header height).
- 48px consistency: theme buttons `size-10` → `size-12` + `aria-pressed`; header CTAs use `pill` variant; small inline tel/sms/email links get ≥44px hit areas; add `track("phone_tap")` to `FinalCta.tsx:43`.
- Mobile sticky bar: hide when the free-look form is in view (IntersectionObserver) and on input focus.
- Contrast: step numbers `/40` (`HomeSections.tsx:123`, also `aria-hidden`), BeforeAfter small muted text, email underline `decoration-border`.
- Email truncation in 2-col grid on mobile (`HomeSections.tsx:213`) → stack/wrap with `break-all`.
- Image width/height attrs (`HomeSections.tsx:48,181`, `AboutPage.tsx:32`).
- Modal: prev/next ArrowLeft/Right, reset scroll on change (key scroll container), live region "Example x of y".
- List toggle: fixed label + `aria-pressed`.
- Unify breakpoint (768 vs 800 in `use-media-query.ts`) with Tailwind `md`.
- WorkflowDiagram: narrower node width on mobile to stop horizontal scroll; keep Play under reduced-motion (step instantly); gate node scale transition; guard Play vs autoplay timeout; richer aria-label pointing to list view; unique marker id via `useId`.

## P3 — Low
- `ProofFirst` `px-3` → `px-5`; normalize heading sizes into 2–3 token classes in `index.css`.
- "(optional)" on headache textarea; `relative` on form for honeypot.
- Replace "✓" glyphs with aria-hidden icons.
- `index.html`: preconnect for fonts, `color-scheme` + `theme-color` meta, try/catch around localStorage in theme script, real `lang="en"`.
- Edge-label width derived from text; modal tag pill sizing.

## Verification
- `npx tsc --noEmit` clean.
- Preview at 375px and 1280px, light + dark: Home/Examples/About, footer fully visible above sticky bar, modal open/prev/next/close/exit animation, Play/Replay, list toggle, keyboard tab through cards, slider, form error state.
