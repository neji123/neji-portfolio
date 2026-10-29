import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

type IconProps = {
  className?: string;
};

// One set, one 1.5 stroke, coloured by currentColor so states come from CSS.
/** `nudge`: the way the icon travels when its control is hovered (see [data-nudge] in globals.css). */
export function IconFrame({
  className,
  nudge,
  children,
}: IconProps & { nudge?: "inline" | "out" | "down"; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-nudge={nudge}
      className={cn("size-5 shrink-0", className)}
    >
      {children}
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconFrame>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </IconFrame>
  );
}

/** Points toward the reading end: mirrored in right-to-left. */
export function ArrowIcon({ className }: IconProps) {
  return (
    <IconFrame nudge="inline" className={cn("rtl:-scale-x-100", className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconFrame>
  );
}

/** Leaves the site toward the reading end: mirrored in right-to-left. */
export function ExternalIcon({ className }: IconProps) {
  return (
    <IconFrame nudge="out" className={cn("rtl:-scale-x-100", className)}>
      <path d="M8 16L16 8M9 8h7v7" />
    </IconFrame>
  );
}

/** A download points down in every script, so it is never mirrored. */
export function DownloadIcon({ className }: IconProps) {
  return (
    <IconFrame nudge="down" className={className}>
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    </IconFrame>
  );
}
