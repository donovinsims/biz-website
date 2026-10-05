import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Background,
  BackgroundVariant,
  EdgeLabelRenderer,
  Handle,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  getBezierPath,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
  type Edge,
  type EdgeProps,
  type EdgeTypes,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Check,
  ChevronRight,
  ChevronsRight,
  CircleHelp,
  Hand,
  Maximize,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Flow, FlowNodeType } from "@/content/examples";
import { useMediaQuery } from "@/hooks/use-media-query";

/* ------------------------------------------------------------------ layout */

const NODE_W = 172;
const COLUMN = 210;
const ROW = 150;
/** Narrow (vertical) layout spacing. */
const V_COLUMN = 200;
const V_ROW = 130;
const STEP_MS = 1500;

type Variant = "trigger" | "stacked" | "human" | "task";

const variants: Record<FlowNodeType, Variant> = {
  trigger: "trigger",
  step: "task",
  draft: "stacked",
  decision: "task",
  approve: "human",
  result: "task",
};

const nodeIcons: Record<FlowNodeType, LucideIcon | null> = {
  trigger: Zap,
  step: null,
  draft: Sparkles,
  decision: CircleHelp,
  approve: Hand,
  result: Check,
};

const variantHeights: Record<Variant, string> = {
  task: "h-[54px]",
  trigger: "h-[54px]",
  human: "h-[72px]",
  stacked: "h-[92px]",
};

const legend: { color: string; label: string; opacity?: number }[] = [
  { color: "var(--foreground)", label: "Trigger" },
  { color: "var(--foreground)", label: "AI draft", opacity: 0.45 },
  { color: "var(--flow-human-border)", label: "You approve" },
  { color: "var(--flow-port)", label: "Step" },
];

/* --------------------------------------------------------------- xy types */

type OomolNodeData = {
  label: string;
  kind: FlowNodeType;
  variant: Variant;
  active: boolean;
  vertical: boolean;
};
type OomolNodeType = Node<OomolNodeData, "oomol">;

type OomolEdgeData = { label?: "Yes" | "No"; active: boolean };
type OomolEdgeType = Edge<OomolEdgeData, "oomol">;

const edgeId = (from: string, to: string) => `${from}->${to}`;

function buildNodes(flow: Flow, vertical: boolean): OomolNodeType[] {
  return flow.nodes.map((n) => ({
    id: n.id,
    type: "oomol",
    position: vertical
      ? { x: (n.row ?? 0) * V_COLUMN, y: n.stage * V_ROW }
      : { x: n.stage * COLUMN, y: (n.row ?? 0) * ROW },
    data: { label: n.label, kind: n.type, variant: variants[n.type], active: false, vertical },
  }));
}

function buildEdges(flow: Flow): OomolEdgeType[] {
  return flow.edges.map((e) => ({
    id: edgeId(e.from, e.to),
    source: e.from,
    target: e.to,
    type: "oomol",
    data: { label: e.label, active: false },
  }));
}

/* ------------------------------------------------------------------ nodes */

const handleStyle = {
  width: 6,
  height: 6,
  minWidth: 6,
  minHeight: 6,
  borderRadius: 9999,
  border: "none",
  background: "var(--flow-port)",
};

function OomolNode({ data }: NodeProps<OomolNodeType>) {
  const Icon = nodeIcons[data.kind];
  const human = data.variant === "human";
  return (
    <div
      className={`flex flex-col justify-center gap-1 rounded-xl border px-3 text-xs ${
        human ? "bg-[var(--flow-human)] border-[var(--flow-human-border)]" : "bg-[var(--flow-node)] border-[var(--flow-node-border)]"
      } ${variantHeights[data.variant]} ${data.active ? "ring-2 ring-foreground" : ""}`}
      style={{ width: NODE_W }}
    >
      <div className="flex items-center gap-2">
        {Icon ? <Icon aria-hidden="true" className="shrink-0 opacity-70" size={14} /> : null}
        <span className="leading-tight">{data.label}</span>
      </div>
      {data.variant === "stacked" ? (
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-full rounded-full bg-current opacity-15" />
          <div className="h-1.5 w-3/4 rounded-full bg-current opacity-15" />
        </div>
      ) : null}
      <Handle
        className="rounded-full"
        position={data.vertical ? Position.Top : Position.Left}
        style={handleStyle}
        type="target"
      />
      <Handle
        className="rounded-full"
        position={data.vertical ? Position.Bottom : Position.Right}
        style={handleStyle}
        type="source"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ edges */

function OomolEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
  data,
  style,
}: EdgeProps<OomolEdgeType>) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const label = data?.label;
  return (
    <>
      <path
        className={`react-flow__edge-path ${data?.active ? "oomol-active-edge" : ""}`}
        d={path}
        fill="none"
        id={id}
        markerEnd={markerEnd}
        style={{ ...style, stroke: "var(--xy-edge-stroke)", strokeWidth: 1.5, strokeDasharray: label === "No" ? "5 5" : undefined }}
      />
      {label ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute rounded-full border px-1.5 py-0.5 text-[10px] leading-none"
            style={{
              transform: "translate(-50%, -50%)",
              left: labelX,
              top: labelY,
              background: "var(--flow-toolbar)",
              borderColor: "var(--flow-node-border)",
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

const nodeTypes = { oomol: OomolNode } satisfies NodeTypes;
const edgeTypes = { oomol: OomolEdge } satisfies EdgeTypes;

/* ------------------------------------------------------------------ chrome */

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground [&_svg]:size-3.5"
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function Canvas({ flow, title }: { flow: Flow; title: string }) {
  const narrow = useMediaQuery("(max-width: 640px)");
  const initialNodes = useMemo(() => buildNodes(flow, narrow), [flow, narrow]);
  const initialEdges = useMemo(() => buildEdges(flow), [flow]);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [colorMode] = useState<"dark" | "light">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const { zoom } = useViewport();
  const { fitView, setNodes: setFlowNodes, setViewport, zoomIn, zoomOut } = useReactFlow<OomolNodeType, OomolEdgeType>();

  useEffect(() => {
    if (!playing) return;
    const length = Math.max(flow.path.length, 1);
    const id = window.setInterval(() => setStep((s) => (s + 1) % length), STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, flow.path.length]);

  const activeId = playing ? flow.path[step] : undefined;
  const activeEdge = useMemo(() => {
    if (!playing || flow.path.length === 0) return undefined;
    const from = flow.path[(step - 1 + flow.path.length) % flow.path.length];
    const to = flow.path[step];
    return to && from ? edgeId(from, to) : undefined;
  }, [flow.path, playing, step]);

  const shownNodes = useMemo(() => nodes.map((n) => ({ ...n, data: { ...n.data, active: n.id === activeId } })), [nodes, activeId]);
  const shownEdges = useMemo(() => edges.map((e) => ({ ...e, data: { ...e.data, active: e.id === activeEdge } })), [edges, activeEdge]);

  const restore = () => {
    setPlaying(false);
    setStep(0);
    setEdges(initialEdges);
    setFlowNodes(initialNodes);
    if (narrow) setViewport({ x: 0, y: 0, zoom: 0.9 });
    else fitView();
  };

  const chrome = collapsed ? null : (
    <>
      <Panel position="top-left">
        <ul
          className="flex flex-wrap gap-x-3 gap-y-1 rounded-full border px-2.5 py-1 text-[10px] text-muted-foreground"
          style={{ background: "var(--flow-toolbar)", borderColor: "var(--flow-node-border)" }}
        >
          {legend.map((item) => (
            <li className="flex items-center gap-1" key={item.label}>
              <span className="size-2 rounded-full" style={{ background: item.color, opacity: item.opacity ?? 1 }} />
              {item.label}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel position="bottom-center">
        <div
          className="flex items-center gap-0.5 rounded-full border px-1 py-1"
          style={{ background: "var(--flow-toolbar)", borderColor: "var(--flow-node-border)" }}
        >
          <ToolButton label="Zoom out" onClick={zoomOut}>
            <Minus />
          </ToolButton>
          <span className="min-w-11 text-center text-[11px] tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <ToolButton label="Zoom in" onClick={zoomIn}>
            <Plus />
          </ToolButton>
          <span className="mx-0.5 h-4 w-px bg-border" />
          <ToolButton label="Fit to view" onClick={() => fitView()}>
            <Maximize />
          </ToolButton>
          <ToolButton label="Reset diagram" onClick={restore}>
            <RotateCcw />
          </ToolButton>
          {reduced ? null : (
            <ToolButton label={playing ? "Pause the tour" : "Play the tour"} onClick={() => setPlaying((v) => !v)}>
              {playing ? <Pause /> : <Play />}
            </ToolButton>
          )}
        </div>
      </Panel>
    </>
  );

  return (
    <ReactFlow
      attributionPosition="bottom-right"
      colorMode={colorMode}
      disableKeyboardA11y
      edgeTypes={edgeTypes}
      edges={shownEdges}
      fitView={!narrow}
      fitViewOptions={{ padding: 0.2 }}
      defaultViewport={narrow ? { x: 0, y: 0, zoom: 0.9 } : undefined}
      minZoom={0.2}
      nodeTypes={nodeTypes}
      nodes={shownNodes}
      nodesDraggable
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
      panOnDrag
      preventScrolling={false}
      zoomOnScroll={false}
    >
      <Background color="var(--flow-edge)" gap={24} size={1} variant={BackgroundVariant.Dots} />
      {chrome}
      <Panel position="top-right">
        <button
          aria-expanded={!collapsed}
          aria-label={collapsed ? `Show diagram controls for ${title}` : `Hide diagram controls for ${title}`}
          className="flex size-8 items-center justify-center rounded-full border text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground [&_svg]:size-3.5"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Show controls" : "Hide controls"}
          type="button"
        >
          {collapsed ? <ChevronRight /> : <ChevronsRight />}
        </button>
      </Panel>
    </ReactFlow>
  );
}

export default function OomolCanvas({ flow, title }: { flow: Flow; title: string }) {
  const narrow = useMediaQuery("(max-width: 640px)");
  const signature = `${narrow ? "v" : "h"}::${flow.nodes.map((n) => `${n.id}:${n.stage}:${n.row ?? 0}`).join("|")}::${flow.edges
    .map((e) => edgeId(e.from, e.to))
    .join("|")}::${flow.path.join(">")}`;

  return (
    <div
      aria-label={`Workflow diagram: ${title}, ${flow.nodes.length} steps.`}
      className="oomol-canvas h-[560px] overflow-hidden rounded-[24px] border sm:h-[420px]"
      role="img"
      style={{ background: "var(--flow-canvas)" }}
    >
      <ReactFlowProvider>
        <Canvas flow={flow} key={signature} title={title} />
      </ReactFlowProvider>
    </div>
  );
}