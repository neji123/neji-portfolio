import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

const headingVariants = cva("text-balance", {
  variants: {
    size: {
      display: "type-display",
      head: "type-head",
      lead: "type-lead font-medium",
    },
  },
  defaultVariants: { size: "head" },
});

type HeadingProps = VariantProps<typeof headingVariants> & {
  level: 1 | 2 | 3;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Heading({ level, size, id, className, children }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={cn(headingVariants({ size }), className)}>
      {children}
    </Tag>
  );
}
