import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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
  ChevronsRight,
  ChevronRight,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";
import { cardFor, examples, type Flow, type NodeCard } from "@/content/examples";
import { useMediaQuery } from "@/hooks/use-media-query";
import NodeCardView from "./NodeCard";

/* ------------------------------------------------------------------ layout */

const CARD_W = 320;
/** Vertical gap between rows, estimated from the rendered card height. */
const VROW = 380;
/** Desktop: the branch lane sits to the right of the main column. */
const BRANCH_X = 360;
/** Narrow: the branch lane stacks under the main column. */
const BRANCH_GAP = 56;
const BRANCH_PAD = 176;
const STEP_MS = 1500;

const edgeId = (from: string, to: string) => `${from}->${to}`;

/* --------------------------------------------------------------- xy types */

type OomolNodeData = {
  card: NodeCard;
  active: boolean;
  selected: boolean;
  onSelect: () => void;
};
type OomolNodeType = Node<OomolNodeData, "oomol">;

type OomolEdgeData = { label?: "Yes" | "No"; active: boolean };
type OomolEdgeType = Edge<OomolEdgeData, "oomol">;

const flowSignature = (flow: Flow) =>
  `${flow.nodes.map((n) => `${n.id}:${n.type}:${n.stage}:${n.row ?? 0}`).join("|")}::${flow.edges
    .map((e) => `${e.from}>${e.to}`)
    .join("|")}`;

/** The copy that fills the cards lives on the example, not the bare flow. */
function cardSourceFor(flow: Flow, title: string): { setup: string[]; hook: string } {
  const byReference = examples.find((example) => example.flow === flow);
  if (byReference) return byReference;
  const signature = flowSignature(flow);
  const byShape = examples.find((example) => flowSignature(example.flow) === signature);
  if (byShape) return byShape;
  return { setup: [], hook: title };
}

function buildNodes(flow: Flow, source: { setup: string[]; hook: string }, narrow: boolean): OomolNodeType[] {
  const lastStage = flow.nodes.reduce((max, node) => Math.max(max, node.stage), 0);
  const branchY = lastStage * VROW + BRANCH_PAD + BRANCH_GAP;
  return flow.nodes.map((node, index) => {
    const branch = (node.row ?? 0) > 0;
    return {
      id: node.id,
      type: "oomol",
      position: branch
        ? narrow
          ? { x: 0, y: branchY }
          : { x: BRANCH_X, y: node.stage * VROW }
        : { x: 0, y: node.stage * VROW },
      data: {
        card: cardFor(source, node, index),
        active: false,
        selected: false,
        onSelect: () => {},
      },
    };
  });
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
  width: 8,
  height: 8,
  minWidth: 8,
  minHeight: 8,
  borderRadius: 9999,
  border: "2px solid var(--node-card)",
  background: "var(--edge-blue)",
};

function OomolNode({ data }: NodeProps<OomolNodeType>) {
  return (
    <div className="relative" style={{ width: CARD_W }}>
      <Handle position={Position.Top} style={handleStyle} type="target" />
      <NodeCardView
        active={data.active}
        card={data.card}
        isSelected={data.selected}
        onSelect={data.onSelect}
      />
      <Handle position={Position.Bottom} style={handleStyle} type="source" />
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
        style={{ ...style, stroke: "var(--edge-blue)", strokeWidth: 2, strokeDasharray: "6 5" }}
      />
      {label ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute rounded-full border px-2 py-0.5 text-[11px] leading-normal font-medium"
            style={{
              transform: "translate(-50%, -50%)",
              left: labelX,
              top: labelY,
              background: "var(--node-card)",
              borderColor: "var(--node-border)",
              color: "var(--node-secondary)",
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
  const source = useMemo(() => cardSourceFor(flow, title), [flow, title]);
  const initialNodes = useMemo(() => buildNodes(flow, source, narrow), [flow, source, narrow]);
  const initialEdges = useMemo(() => buildEdges(flow), [flow]);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [colorMode] = useState<"dark" | "light">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const { zoom } = useViewport();
  const { setNodes: setFlowNodes, setViewport, zoomIn, zoomOut } = useReactFlow<OomolNodeType, OomolEdgeType>();
  const defaultViewport = narrow ? { x: 0, y: 0, zoom: 0.9 } : { x: 0, y: 0, zoom: 0.85 };

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

  const toggle = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const shownNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          active: n.id === activeId,
          selected: n.id === selectedId,
          onSelect: () => toggle(n.id),
        },
      })),
    [nodes, activeId, selectedId, toggle],
  );
  const shownEdges = useMemo(() => edges.map((e) => ({ ...e, data: { ...e.data, active: e.id === activeEdge } })), [edges, activeEdge]);

  const restore = () => {
    setPlaying(false);
    setStep(0);
    setSelectedId(null);
    setEdges(initialEdges);
    setFlowNodes(initialNodes);
    setViewport(defaultViewport);
  };

  const chrome = collapsed ? null : (
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
  );

  return (
    <ReactFlow
      attributionPosition="bottom-right"
      colorMode={colorMode}
      defaultViewport={defaultViewport}
      disableKeyboardA11y
      edgeTypes={edgeTypes}
      edges={shownEdges}
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
      className="oomol-canvas h-[560px] overflow-hidden rounded-[24px] border"
      role="img"
      style={{ background: "var(--flow-canvas)" }}
    >
      <ReactFlowProvider>
        <Canvas flow={flow} key={signature} title={title} />
      </ReactFlowProvider>
    </div>
  );
}
