import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ListOrdered, Workflow, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { CallTextButtons, PrimaryCta } from "@/components/site/cta";
import WorkflowDiagram, { FlowList } from "@/components/examples/WorkflowDiagram";
import type { Example } from "@/content/examples";

type Props = {
  example: Example | null;
  index: number;
  total: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
};

function H({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.12em]">{children}</h3>;
}

function Body({ example }: { example: Example }) {
  const [asList, setAsList] = useState(false);
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="flex flex-col gap-2">
        <H>The problem</H>
        <p className="text-base leading-relaxed sm:text-lg">{example.problem}</p>
      </section>
      <section className="flex flex-col gap-3">
        <H>What I set up</H>
        <ul className="flex flex-col gap-2">
          {example.setup.map((s) => (
            <li className="flex gap-3 text-base leading-snug sm:text-lg" key={s}>
              <span className="mt-2 size-1.5 sm:mt-2.5 shrink-0 rounded-full bg-foreground" />
              {s}
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <H>How it flows</H>
          <Button aria-pressed={asList} className="h-11 rounded-full px-3 sm:h-12 sm:px-4" onClick={() => setAsList((v) => !v)} variant="ghost">
            {asList ? <Workflow aria-hidden="true" /> : <ListOrdered aria-hidden="true" />}
            <span className="sm:hidden">Steps as list</span>
            <span className="max-sm:hidden">See the steps as a list</span>
          </Button>
        </div>
        {asList ? <FlowList flow={example.flow} /> : <WorkflowDiagram flow={example.flow} title={example.title} />}
      </section>
      <section className="rounded-2xl border bg-muted p-4 sm:p-5">
        <H>You stay in control</H>
        <p className="mt-2 text-base leading-relaxed sm:text-lg">{example.control}</p>
      </section>
      <section className="flex flex-col gap-3">
        <H>What changes</H>
        <ul className="flex flex-col gap-2">
          {example.changes.map((s) => (
            <li className="flex gap-3 text-base leading-snug sm:text-lg" key={s}>
              <span aria-hidden="true">→</span>
              {s}
            </li>
          ))}
        </ul>
      </section>
      {example.day && (
        <section className="flex flex-col gap-2">
          <H>A day with it</H>
          <p className="text-base leading-relaxed sm:text-lg">{example.day}</p>
        </section>
      )}
      <p className="w-fit rounded-full border px-3 py-1 text-muted-foreground text-xs">
        Illustrative example, not a client result
      </p>
    </div>
  );
}

function StepButtons({ onStep, className }: { onStep: (dir: 1 | -1) => void; className?: string }) {
  return (
    <div className={className}>
      <Button aria-label="Previous example" className="size-11 rounded-full sm:size-12" onClick={() => onStep(-1)} size="icon" variant="ghost">
        <ChevronLeft />
      </Button>
      <Button aria-label="Next example" className="size-11 rounded-full sm:size-12" onClick={() => onStep(1)} size="icon" variant="ghost">
        <ChevronRight />
      </Button>
    </div>
  );
}

export default function ExampleModal({ example, index, total, onClose, onStep }: Props) {
  const open = example !== null;
  const lastRef = useRef<Example | null>(example);
  const indexRef = useRef(index);
  if (example) {
    lastRef.current = example;
    indexRef.current = index;
  }
  const shown = lastRef.current;
  index = indexRef.current;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [role='slider'], [contenteditable='true']")) return;
      onStep(e.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onStep]);

  return (
    <Dialog onOpenChange={(o) => !o && onClose()} open={open}>
      <DialogPopup className="max-h-[90vh] max-w-[880px] overflow-hidden p-0 max-sm:h-full max-sm:max-h-full" showCloseButton={false}>
        {shown && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-start gap-3 border-b p-4 sm:p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background sm:size-12">
                <shown.icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p aria-live="polite" className="text-muted-foreground text-sm tabular-nums">
                  Example {index + 1} of {total}
                </p>
                <DialogTitle className="font-bold text-xl leading-tight tracking-tight sm:text-[1.75rem]">{shown.title}</DialogTitle>
                <DialogDescription className="mt-0.5 text-muted-foreground text-sm sm:mt-1 sm:text-base">{shown.hook}</DialogDescription>
              </div>
              <div className="flex shrink-0 gap-1">
                <StepButtons className="flex gap-1 max-sm:hidden" onStep={onStep} />
                <DialogClose render={<Button aria-label="Close" className="size-11 rounded-full sm:size-12" size="icon" variant="outline" />}>
                  <X />
                </DialogClose>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6" key={shown.slug}>
              <Body example={shown} />
            </div>
            <footer className="flex flex-col gap-2 border-t bg-background p-3 sm:flex-row sm:items-center sm:p-5">
              <PrimaryCta className="w-full sm:w-auto" event="example_cta_click" onBeforeScroll={onClose} source={`example_${shown.slug}`} />
              <div className="flex items-center gap-2 sm:contents">
                <StepButtons className="flex gap-1 sm:hidden" onStep={onStep} />
                <CallTextButtons className="flex-1 sm:flex-none" compact source={`example_${shown.slug}`} />
              </div>
            </footer>
          </div>
        )}
      </DialogPopup>
    </Dialog>
  );
}
