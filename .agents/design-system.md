# Clockout design spec (LOCKED after Pass 7, 2026-10-01)
GOAL: skeptical local owner on a phone → free-look form or call/text. One message per section.
LAYOUT: 1100px container, 20/32px gutters; sections py-16/24 separated by hairline border-t. Content max-w-3xl for lists/prose.
TYPE: Inter 400/500/600/700. H1 bold, tracking -0.035/-0.04em. H2 = `text-h2` utility (2rem→2.75rem, -0.03em, balance). Body 18px, muted-foreground for support lines. Micro labels uppercase 0.12em, used only inside example dialogs.
COLOR: monochrome tokens only (foreground/background/muted/border). No accent, no gradients. Light + dark via `.dark`.
SHAPE: radius 3xl (24px) for panels/media, 2xl for inner tiles, full for buttons/chips. Hairline borders; no shadows except slider handle.
RHYTHM (home): hero → town strip → ruled problems list → 3-step grid → proof panel → founder → ruled won't-do list → FAQ accordion → form. Never two boxed card grids in a row.
NEGATIVE: no robots/circuits, no device chrome, no eyebrow pills, no fake proof, no decorative motion.
