"use client";

import { type ReactNode, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, FULL_MOTION_QUERY } from "@/lib/motion";

const DEFAULT_SPEED = 0.12;
const PERCENT = 100;

type ParallaxProps = {
  children: ReactNode;
  /** Fraction of its own height the element drifts across the viewport. Negative drifts the other way. */
  speed?: number;
  className?: string;
};

/** Scroll-linked vertical drift for depth. Vertical only, so it needs no RTL handling. */
export function Parallax({ children, speed = DEFAULT_SPEED, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.fromTo(
          element,
          { yPercent: -speed * PERCENT },
          {
            yPercent: speed * PERCENT,
            ease: EASE.linear,
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [speed] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
