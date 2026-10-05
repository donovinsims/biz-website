import { Clock } from "lucide-react";
import type { NodeCard as NodeCardData, NodeCardTone } from "@/content/examples";

const CARD_FONT = '"Inter",ui-sans-serif,system-ui';

const toneColors: Record<NodeCardTone, { background: string; color: string }> = {
  green: { background: "var(--node-tag-green)", color: "var(--node-tag-green-text)" },
  yellow: { background: "var(--node-tag-yellow)", color: "var(--node-tag-yellow-text)" },
  red: { background: "var(--node-tag-red)", color: "var(--node-tag-red-text)" },
};

type NodeCardProps = {
  card: NodeCardData;
  /** Tour playhead is on this node. */
  active?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
};

export default function NodeCard({ card, active = false, isSelected = false, onSelect }: NodeCardProps) {
  const tone = toneColors[card.tone];
  return (
    <button
      aria-pressed={isSelected}
      className={[
        "nodrag nopan block w-[320px] rounded-2xl border border-[var(--node-border)] p-4 text-left",
        "transition-[transform,box-shadow] duration-200 ease-in-out",
        "motion-safe:hover:-translate-y-[2px]",
        isSelected
          ? "shadow-[var(--node-shadow),0_0_0_2px_#3B82F6]"
          : "shadow-[var(--node-shadow)] motion-safe:hover:shadow-[var(--node-shadow),0_14px_24px_-10px_rgba(0,0,0,0.28)]",
        active ? "ring-2 ring-foreground" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onSelect}
      style={{ background: "var(--node-card)", fontFamily: CARD_FONT }}
      type="button"
    >
      <span
        className="absolute -top-3 left-4 rounded-full px-2.5 py-0.5 text-[12px] leading-normal font-medium"
        style={{ background: tone.background, color: tone.color }}
      >
        {card.tag}
      </span>

      <span className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--node-inner)] text-[16px] font-semibold text-[var(--node-primary)]">
          {card.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 text-[16px] leading-tight font-semibold text-[var(--node-primary)]">{card.title}</span>
          <span className="block truncate text-[13px] leading-tight text-[var(--node-secondary)]">{card.subtitle}</span>
        </span>
        <span className="ml-auto shrink-0 rounded-full border border-[var(--node-border)] bg-[var(--node-badge)] px-2 py-0.5 text-[11px] leading-normal font-semibold whitespace-nowrap text-[var(--node-badge-text)] uppercase">
          {card.tokens}
        </span>
      </span>

      <span className="mt-3 block rounded-xl bg-[var(--node-inner)] px-4 py-3">
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--node-badge)] px-2 py-0.5 text-[11px] leading-normal font-semibold text-[var(--node-badge-text)] uppercase">
            {card.status}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[var(--node-badge)] px-2 py-0.5 text-[11px] leading-normal font-semibold text-[var(--node-badge-text)] uppercase">
            <Clock aria-hidden="true" size={12} strokeWidth={1.5} />
            {card.time}
          </span>
        </span>
        <span className="mt-2 block text-[13px] leading-[1.5] text-[var(--node-secondary)]">{card.description}</span>
      </span>
    </button>
  );
}
