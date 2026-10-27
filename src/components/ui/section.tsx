import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  /** Id of the heading that names this section. */
  labelledBy: string;
  /** "paper" switches to the daylight chart field; every role token inside follows. */
  field?: "night" | "paper";
  className?: string;
  children: ReactNode;
};

export function Section({ id, labelledBy, field = "night", className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "scroll-mt-header bg-ground px-gutter py-section text-ink",
        field === "paper" && "field-paper",
        className,
      )}
    >
      {children}
    </section>
  );
}
