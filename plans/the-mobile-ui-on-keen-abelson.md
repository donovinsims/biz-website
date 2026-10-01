# Make the /examples dialog less cramped on mobile

## Context
On a phone (screenshot, ~390px wide) the example dialog is oversized. The header (icon, 3-line title, hook) and the footer (step row, full-width CTA, Call/Text row) take about half the screen. Body copy is `text-lg` with 32px section gaps, so little content shows at a time. The desktop layout stays as is. This is a density fix, not a redesign.

## Scope
Per the selection rules, edits stay inside the selected dialog content `<div>` in `src/components/examples/ExampleModal.tsx` (header, body, footer). The two selected `FocusGuard` spans are Base UI internals and are not touched. Changes in other files are listed under "Needs your OK".

## Changes (all `ExampleModal.tsx`; mobile only via base classes, `sm:` keeps current desktop values)
1. **Header:** padding `p-5` -> `p-4 sm:p-6`. Icon badge `size-12` -> `size-10 sm:size-12`. Title `text-2xl` -> `text-xl sm:text-[1.75rem]`. Hook `DialogDescription` gets `text-sm sm:text-base`. Close button `size-12` -> `size-11 sm:size-12`, still at least 44px.
2. **Body text:** `text-lg` -> `text-base sm:text-lg` for problem, setup bullets, changes, control and day. Section gap `gap-8` -> `gap-6 sm:gap-8`. Body padding `p-5` -> `p-4 sm:p-6`. "You stay in control" card `p-5` -> `p-4 sm:p-5`.
3. **"See the steps as a list" button:** shorten the mobile label to "Steps as list" (full text from `sm:`) and use `h-11`, so the header row doesn't wrap.
4. **Footer (biggest win):**
   - Merge the step arrows and the "2 / 5" counter into the Call/Text row, so mobile has two rows instead of three.
   - Footer padding `p-4` -> `p-3`.
   - Keep `PrimaryCta` full width and at least 44px tall.
   - Call/Text become compact icon-plus-label buttons sharing the row with the arrows.
5. Keep `max-sm:h-full` and the single scroll area. Keep the 844x390 landscape fit.

## Needs your OK (outside the selected element)
- `WorkflowDiagram.tsx` (~L208-218): the legend ("Trigger / AI draft / You approve / Result") and the "Replay" button take two rows on mobile. Proposal: hide the legend below `sm` and put Replay on the diagram's row.
- `cta.tsx`: only if the footer rework needs a compact variant of `CallTextButtons`. I'd avoid this by laying it out in `ExampleModal.tsx`.

## Verification
- With headless Chromium (scripts in `/tmp/shot`), open the dialog at 320, 375 and 390 wide, plus 844x390 landscape. Screenshot light and dark.
- Confirm no overflow, tap targets of at least 44px, the CTA visible without scrolling, and desktop (1280) unchanged.
- Commit as one change.
