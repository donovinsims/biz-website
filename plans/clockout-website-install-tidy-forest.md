# Clockout: one face, responsiveness audit, new "After" image

## Context
- Your photo appears twice on the homepage: in the hero (`HomeSections.tsx` ~line 46) and in the "who's behind this" section (~line 174).
- You want a deep responsiveness audit, with mobile as the priority.
- The "After" side of the before/after slider should show your attached image instead of the drawn mockup.

## 1. Show the face once
- Keep the hero photo, since that's where first trust is built.
- In the "who's behind" section, remove the `<img>`. Turn the grid (`md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`) into a single column of text, capped at `max-w-3xl` so lines stay readable.
- Leave the About page photo as is.

## 2. Replace the "After" panel (selected element only)
- Download the attachment into the project: `figma attachments get 943a2555-a7d0-4357-b1f1-750487f668e0 --dest src/assets/after-example.<ext>`. I'll view it first to check its aspect ratio.
- In `src/components/home/BeforeAfter.tsx`, `After()` will render only `<img src={afterImg} alt="…describes the improved page…" className="h-full w-full object-cover object-top" />`, with the alt text written from what the image shows.
- Remove the `Check`/`Phone` imports if nothing else uses them.
- The slider, Before panel, and labels stay as they are.
- If the image's aspect ratio doesn't fit the 4/5 (mobile) or 4/3 (desktop) frame, `object-top` keeps the top of the page visible. I'll flag any bad crop rather than change the frame without asking.

## 3. Deep responsiveness audit
- **Widths:** 320, 360, 375, 390, 414, 768, 1024, 1280, 1440, plus an 844×390 landscape phone. Check every route, the example dialog, the mobile menu, and the form, using the existing `/tmp/shot` scripts (`shot.mjs` with `W`, `find.mjs`, `qa.mjs`).
- **Checks:**
  - sideways overflow
  - text clipped, or buttons and links wrapping to two lines
  - tap targets under 44px
  - the sticky mobile bar covering the form or footer (add bottom padding if it does)
  - the hero fold at 375×667
  - the slider being draggable by touch, without blocking page scroll
  - the dialog fitting a short landscape screen
  - tablet (768–1023) layouts that look awkward between breakpoints
  - very wide screens (1440) keeping a sensible max width
- **Fixes:** high-confidence ones go in place with Tailwind utilities, and art direction stays locked. Re-render only what changed and append a "Responsive audit" entry to `.agents/audit-progress.md`.
- **Commits:** one per task (face, after image, responsive).

## Verification
- Rerun `qa.mjs` across the four modes and the new widths. Overflow must be 0 everywhere.
- Screenshot the slider at 390 and 1280, in light and dark, with the handle at 20%, 50%, and 80%.
