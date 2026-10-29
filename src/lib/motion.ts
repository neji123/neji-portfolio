// Motion tokens shared by GSAP. CSS transitions use the matching custom properties in globals.css.

/** Seconds. */
export const DURATION = {
  quick: 0.15,
  fast: 0.25,
  medium: 0.45,
  slow: 0.8,
  reveal: 1.1,
  /** The current stop breathing (globe ring, timeline marker). */
  pulse: 2.4,
} as const;

export const EASE = {
  /** Exponential ease-out: arrives fast, settles soft. The house curve. */
  out: "expo.out",
  smooth: "power3.out",
  inOut: "power2.inOut",
  linear: "none",
} as const;

export const STAGGER = {
  words: 0.04,
  lines: 0.09,
  items: 0.08,
} as const;

/** Pixels an entering element travels. */
export const DISTANCE = {
  rise: 28,
  slide: 40,
} as const;

export const SCROLL_START = "top 85%";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const FULL_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
