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
}: {
  id?: string;
  title?: React.ReactNode;
  subhead?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  labelledBy?: string;
}) {
  const headingId = labelledBy ?? (id ? `${id}-title` : undefined);
  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn("mx-auto w-full max-w-[1100px] px-5 sm:px-8", className)}
      id={id}
    >
      <div className={cn("py-16 sm:py-24", divider && "border-t")}>
        {title && (
          <header className="mb-10 max-w-2xl sm:mb-12">
            <h2
              className="text-h2"
              id={headingId}
            >
              {title}
            </h2>
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
