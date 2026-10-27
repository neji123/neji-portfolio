import { type ReactNode } from "react";

import { SplitReveal } from "@/components/motion/split-reveal";

import { Heading } from "./heading";

type SectionHeadingProps = {
  id: string;
  children: ReactNode;
  size?: "display" | "head";
  className?: string;
};

/** A section's h2, its lines rising out of masks as it scrolls in. */
export function SectionHeading({ id, children, size = "display", className }: SectionHeadingProps) {
  return (
    <SplitReveal className={className}>
      <Heading level={2} id={id} size={size}>
        {children}
      </Heading>
    </SplitReveal>
  );
}
