import type React from "react";
import { cn } from "@/lib/utils";

export default function Section({
  id,
  title,
  subhead,
  children,
  className,
  divider = true,
  labelledBy,
  headingLevel = "h2",
}: {
  id?: string;
  title?: React.ReactNode;
  subhead?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  labelledBy?: string;
  /** Pass "h1" on standalone pages (e.g. 404) whose title is the page heading. */
  headingLevel?: "h1" | "h2";
}) {
  const headingId = labelledBy ?? (id ? `${id}-title` : undefined);
  const Heading = headingLevel;
  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn("mx-auto w-full max-w-[1100px] px-5 sm:px-8", className)}
      id={id}
    >
      <div className={cn("py-16 sm:py-24", divider && "border-t")}>
        {title && (
          <header className="mb-10 max-w-2xl sm:mb-12">
            <Heading
              className="text-h2"
              id={headingId}
            >
              {title}
            </Heading>
            {subhead && (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {subhead}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
