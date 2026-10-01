import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import afterImg from "@/assets/after-example.webp";

/** Placeholder sample proof: a before/after website concept with a drag slider. Swap in the real artifact later. */
function Before() {
  return (
    <div className="flex h-full flex-col gap-3 bg-muted p-5 text-muted-foreground">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-foreground/20" />
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="h-2 w-8 rounded bg-foreground/15" key={i} />
          ))}
        </div>
      </div>
      <div className="h-20 rounded-lg bg-foreground/10" />
      <p className="text-[0.8rem] leading-snug">
        Welcome to our website! We have been proudly serving the area for many years with quality
        and integrity. Please browse our pages to learn about our many services…
      </p>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="h-10 rounded bg-foreground/10" key={i} />
        ))}
      </div>
      <p className="mt-auto text-[0.7rem]">Contact page → fill out 11 fields → wait</p>
    </div>
  );
}

function After() {
  return (
    <img
      alt="Redesigned painting company website: a bold headline, a short estimate form beside it, star rating and trust badges, and a before-and-after photo of a repainted house."
      className="h-full w-full object-cover object-top"
      decoding="async"
      loading="lazy"
      src={afterImg}
    />
  );
}

export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-2xl border has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-foreground has-[input:focus-visible]:ring-inset sm:aspect-[4/3]">
        <div className="absolute inset-0">
          <After />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Before />
        </div>
        <span className="pointer-events-none absolute top-3 left-3 rounded-full border bg-background px-2.5 py-1 font-semibold text-xs">
          Before
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-foreground px-2.5 py-1 font-semibold text-background text-xs">
          After
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-foreground"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm">
            <ChevronsLeftRight className="size-4" />
          </span>
        </div>
        <input
          aria-label="Drag to compare before and after"
          className="absolute inset-0 h-full w-full cursor-ew-resize touch-pan-y opacity-0"
          max={100}
          min={0}
          onChange={(e) => setPos(Number(e.target.value))}
          type="range"
          value={pos}
        />
      </div>
      <figcaption className="text-muted-foreground text-sm">
        Example of what a free look can look like: a before/after website concept. Not a client result.
      </figcaption>
    </figure>
  );
}
