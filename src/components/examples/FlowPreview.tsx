import type { Flow } from "@/content/examples";

const NODE_W = 26;
const NODE_H = 12;
const COL = 34;
const ROW = 30;
const PAD = 6;

/** Static mini canvas: the whole flow drawn as one scaled-down SVG. No interaction. */
export function FlowPreview({ flow }: { flow: Flow }) {
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  const x = (stage: number) => PAD + stage * COL;
  const y = (row = 0) => PAD + row * ROW;

  const maxStage = Math.max(0, ...flow.nodes.map((n) => n.stage));
  const maxRow = Math.max(0, ...flow.nodes.map((n) => n.row ?? 0));
  const width = x(maxStage) + NODE_W + PAD;
  const height = y(maxRow) + NODE_H + PAD;

  const last = flow.path.length - 1;
  const ids = [flow.path[0], flow.path[Math.floor(last / 2)], flow.path[last]];
  const labels = ids.map((id) => byId.get(id ?? "")?.label ?? "");

  return (
    <div aria-label={`Workflow: ${labels.join(", then ")}`} className="h-28 overflow-hidden rounded-2xl border" role="img" style={{ background: "var(--flow-canvas)" }}>
      <svg height="100%" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${width} ${height}`} width="100%">
        {flow.edges.map((e) => {
          const from = byId.get(e.from);
          const to = byId.get(e.to);
          if (!from || !to) return null;
          const x1 = x(from.stage) + NODE_W;
          const y1 = y(from.row) + NODE_H / 2;
          const x2 = x(to.stage);
          const y2 = y(to.row) + NODE_H / 2;
          const c = Math.max(8, (x2 - x1) / 2);
          return (
            <path
              d={`M ${x1} ${y1} C ${x1 + c} ${y1}, ${x2 - c} ${y2}, ${x2} ${y2}`}
              fill="none"
              key={`${e.from}-${e.to}`}
              stroke="var(--flow-edge)"
              strokeDasharray={e.label === "No" ? "3 3" : undefined}
              strokeWidth={1}
            />
          );
        })}
        {flow.nodes.map((n) => {
          const human = n.type === "approve";
          return (
            <rect
              fill={human ? "var(--flow-human)" : "var(--flow-node)"}
              height={NODE_H}
              key={n.id}
              rx={6}
              stroke={human ? "var(--flow-human-border)" : "var(--flow-node-border)"}
              strokeWidth={1}
              width={NODE_W}
              x={x(n.stage)}
              y={y(n.row)}
            />
          );
        })}
      </svg>
    </div>
  );
}