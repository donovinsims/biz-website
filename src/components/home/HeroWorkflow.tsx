import { Check, Hand, Zap } from "lucide-react";
import { Link } from "react-router";

const stages = [
  { label: "New inquiry", Icon: Zap },
  { label: "Approved reply", Icon: Hand },
  { label: "Follow-up organized", Icon: Check },
];

/** Static, motion-free illustration of one example workflow. Links to that example. */
export default function HeroWorkflow() {
  return (
    <Link
      aria-label="Example workflow: new inquiry, approved reply, then follow-up organized. Opens the example."
      className="group block rounded-[2rem] border p-6 transition-colors hover:bg-muted sm:p-8"
      to="/examples#missed-leads"
    >
      <figure className="flex flex-col gap-6">
        <figcaption className="font-medium text-muted-foreground text-sm">
          Example workflow
        </figcaption>
        <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {stages.map((s, i) => (
            <li className="flex items-center gap-3" key={s.label}>
              {i > 0 && (
                <span aria-hidden="true" className="hidden text-muted-foreground sm:inline">
                  &rarr;
                </span>
              )}
              <span className="flex items-center gap-2 rounded-full border bg-background px-3.5 py-2 font-medium text-sm whitespace-nowrap">
                <s.Icon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.75}
                />
                {s.label}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-muted-foreground text-sm">
          See how a real fix runs end to end.
        </p>
      </figure>
    </Link>
  );
}
