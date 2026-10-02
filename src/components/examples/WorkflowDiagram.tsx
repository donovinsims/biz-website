import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, CircleHelp, Hand, Pause, Play, RotateCcw, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { Flow, FlowNode, FlowNodeType } from "@/content/examples";

const icons: Record<FlowNodeType, LucideIcon | null> = {
  trigger: Zap,
  step: null,
  draft: Sparkles,
  decision: CircleHelp,
  approve: Hand,
  result: Check,
};

const nodeStyle: Record<FlowNodeType, string> = {
  trigger: "bg-foreground text-background border-foreground",
  step: "bg-card border-border",
  draft: "bg-card border-dashed border-foreground/50",
  decision: "bg-muted border-foreground/60",
  approve: "bg-card border-foreground ring-1 ring-foreground ring-offset-2 ring-offset-background",
  result: "bg-foreground text-background border-foreground",
};

const typeName: Record<FlowNodeType, string> = {
  trigger: "Trigger",
  step: "Step",
  draft: "AI draft",
  decision: "Decision",
  approve: "You approve",
  result: "Result",
};

const STEP_MS = 1500;

function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

type Pos = { x: number; y: number };

function layout(flow: Flow, vertical: boolean) {
  const W = vertical ? 128 : 132;
  const H = vertical ? 68 : 76;
  const gapMain = vertical ? 44 : 52;
  const gapCross = vertical ? 12 : 28;
  const stages = Math.max(...flow.nodes.map((n) => n.stage)) + 1;
  const hasBranch = flow.nodes.some((n) => (n.row ?? 0) > 0);
  const pos: Record<string, Pos> = {};
  const byStage = new Map<number, FlowNode[]>();
  for (const n of flow.nodes) byStage.set(n.stage, [...(byStage.get(n.stage) ?? []), n]);

  if (vertical) {
    const width = hasBranch ? W * 2 + gapCross : W;
    for (const [stage, nodes] of byStage) {
      const y = stage * (H + gapMain);
      if (nodes.length === 1) pos[nodes[0].id] = { x: (width - W) / 2, y };
      else nodes.forEach((n) => (pos[n.id] = { x: (n.row ?? 0) * (W + gapCross), y }));
    }
    return { pos, W, H, width, height: stages * (H + gapMain) - gapMain };
  }
  for (const n of flow.nodes) pos[n.id] = { x: n.stage * (W + gapMain), y: (n.row ?? 0) * (H + gapCross) };
  return {
    pos,
    W,
    H,
    width: stages * (W + gapMain) - gapMain,
    height: hasBranch ? H * 2 + gapCross : H,
  };
}

export default function WorkflowDiagram({ flow, title }: { flow: Flow; title: string }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduced = useReducedMotion();
  const { pos, W, H, width, height } = useMemo(() => layout(flow, !isDesktop), [flow, isDesktop]);
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const markerId = `flow-arrow-${useId().replace(/:/g, "")}`;

  const order = useMemo(() => new Map(flow.nodes.map((n, i) => [n.id, i + 1])), [flow]);
  const center = (id: string) => ({ x: pos[id].x + W / 2, y: pos[id].y + H / 2 });

  const play = () => {
    window.clearInterval(timer.current);
    setHasPlayed(true);
    setPlaying(true);
    setActive(0);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      if (i >= flow.path.length) {
        window.clearInterval(timer.current);
        setActive(-1);
        setPlaying(false);
        return;
      }
      setActive(i);
    }, STEP_MS);
  };

  const pause = () => {
    window.clearInterval(timer.current);
    setPlaying(false);
    setActive(-1);
  };

  useEffect(() => {
    window.clearInterval(timer.current);
    setActive(-1);
    setPlaying(false);
    setHasPlayed(false);
    return () => window.clearInterval(timer.current);
  }, [flow]);

  const activeId = active >= 0 ? flow.path[active] : null;
  const dot = activeId ? center(activeId) : null;

  const edgePath = (from: string, to: string) => {
    const a = pos[from];
    const b = pos[to];
    if (isDesktop) {
      const sx = a.x + W, sy = a.y + H / 2, ex = b.x, ey = b.y + H / 2;
      const mx = (sx + ex) / 2;
      return { d: `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`, lx: mx, ly: (sy + ey) / 2 };
    }
    const sx = a.x + W / 2, sy = a.y + H, ex = b.x + W / 2, ey = b.y;
    const my = (sy + ey) / 2;
    return { d: `M${sx},${sy} C${sx},${my} ${ex},${my} ${ex},${ey}`, lx: (sx + ex) / 2, ly: my };
  };

  const pad = 20;

  return (
    <div className="flex flex-col gap-3">
      <div className="dot-grid relative overflow-x-auto rounded-2xl border bg-muted/40 md:overflow-x-auto">
        <div
          aria-label={`Workflow diagram: ${title}, ${flow.nodes.length} steps. Use "See the steps as a list" for a text version.`}
          className="relative mx-auto"
          role="img"
          style={{ width: width + pad * 2, height: height + pad * 2 }}
        >
          <svg aria-hidden="true" className="absolute inset-0 overflow-visible text-foreground/50" height={height + pad * 2} width={width + pad * 2}>
            <defs>
              <marker id={markerId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
              </marker>
            </defs>
            <g transform={`translate(${pad},${pad})`}>
              {flow.edges.map((e) => {
                const { d, lx, ly } = edgePath(e.from, e.to);
                return (
                  <g key={`${e.from}-${e.to}`}>
                    <path d={d} fill="none" markerEnd={`url(#${markerId})`} stroke="currentColor" strokeWidth={1.5} />
                    {e.label && (
                      <g transform={`translate(${lx},${ly})`}>
                        <rect
                          className="fill-background stroke-border"
                          height="18"
                          rx="9"
                          width={Math.max(34, e.label.length * 6 + 16)}
                          x={-Math.max(34, e.label.length * 6 + 16) / 2}
                          y="-9"
                        />
                        <text className="fill-foreground font-semibold" dominantBaseline="central" fontSize="10" textAnchor="middle">
                          {e.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="absolute" style={{ left: pad, top: pad }}>
            {flow.nodes.map((n) => {
              const Icon = icons[n.type];
              const isActive = activeId === n.id;
              return (
                <div
                  className={cn(
                    "absolute flex items-center gap-2 rounded-xl border px-3 text-[0.78rem] leading-tight motion-safe:transition-[box-shadow,transform] motion-safe:duration-300",
                    nodeStyle[n.type],
                    isActive && "shadow-[0_0_0_3px_var(--background),0_0_0_5px_var(--foreground)] motion-safe:scale-[1.04]",
                  )}
                  key={n.id}
                  style={{ left: pos[n.id].x, top: pos[n.id].y, width: W, height: H }}
                  title={typeName[n.type]}
                >
                  <span className="absolute -top-2.5 -left-2.5 flex size-5 items-center justify-center rounded-full border bg-background font-semibold text-[0.65rem] text-foreground tabular-nums">
                    {order.get(n.id)}
                  </span>
                  {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />}
                  <span className="line-clamp-3 font-medium">{n.label}</span>
                </div>
              );
            })}
            {dot && !reduced && (
              <span
                aria-hidden="true"
                className="flow-glow pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground transition-[left,top] duration-[1200ms] ease-in-out"
                style={{ left: dot.x, top: dot.y }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
          <li className="flex items-center gap-1.5"><Zap className="size-3" aria-hidden="true" />Trigger</li>
          <li className="flex items-center gap-1.5"><Sparkles className="size-3" aria-hidden="true" />AI draft</li>
          <li className="flex items-center gap-1.5"><Hand className="size-3" aria-hidden="true" />You approve</li>
          <li className="flex items-center gap-1.5"><Check className="size-3" aria-hidden="true" />Result</li>
        </ul>
        {!reduced && (
          <Button className="h-12 rounded-full px-5" onClick={playing ? pause : play} variant="outline">
            {playing ? (
              <>
                <Pause aria-hidden="true" />
                Pause
              </>
            ) : hasPlayed ? (
              <>
                <RotateCcw aria-hidden="true" />
                Replay
              </>
            ) : (
              <>
                <Play aria-hidden="true" />
                Play
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export function FlowList({ flow }: { flow: Flow }) {
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  return (
    <ol className="flex flex-col gap-3">
      {flow.nodes.map((n, i) => {
        const outs = flow.edges.filter((e) => e.from === n.id && e.label);
        return (
          <li className="flex gap-3" key={n.id}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border font-semibold text-xs tabular-nums">
              {i + 1}
            </span>
            <div className="pt-0.5">
              <p className="text-base">
                <span className="text-muted-foreground">{typeName[n.type]}: </span>
                {n.label}
              </p>
              {outs.length > 0 && (
                <ul className="mt-1 text-muted-foreground text-sm">
                  {outs.map((e) => (
                    <li key={e.to}>
                      {e.label} → {byId.get(e.to)?.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
