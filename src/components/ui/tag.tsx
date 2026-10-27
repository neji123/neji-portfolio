import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

type TagProps = {
  children: ReactNode;
  className?: string;
};

/** A stack or technology name: a filled surface chip, never an outlined box. */
export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-surface px-3 py-1 type-small",
        className,
      )}
    >
      {children}
    </span>
  );
}
