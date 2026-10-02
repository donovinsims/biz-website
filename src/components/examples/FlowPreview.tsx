import { Check, ChevronRight, GitBranch, Zap } from "lucide-react";
import type { Flow } from "@/content/examples";

const chipIcons = [Zap, GitBranch, Check];

/** Static three-chip strip: first, middle, last step of a flow. */
export function FlowPreview({ flow }: { flow: Flow }) {
  const byId = new Map(flow.nodes.map((n) => [n.id, n.label]));
  const last = flow.path.length - 1;
  const ids = [flow.path[0], flow.path[Math.floor(last / 2)], flow.path[last]];
  const labels = ids.map((id) => byId.get(id) ?? "");
  const chip = "flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1.5 font-medium text-xs whitespace-nowrap";

  return (
    <div aria-label={`Workflow: ${labels.join(", then ")}`} className="flex flex-wrap items-center gap-2" role="img">
      {ids.map((id, i) => {
        const Icon = chipIcons[i];
        return (
          <span className="contents" key={id}>
            {i > 0 && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />}
            <span className={chip}>
              <Icon aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              {labels[i]}
            </span>
          </span>
        );
      })}
    </div>
  );
}