"use client";

import { type ReactNode, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, FULL_MOTION_QUERY } from "@/lib/motion";

/** The tilt a section starts from as it rises out of the night, scrubbed with the scroll. */
const ENTER = { rotationX: 9, z: -140, y: 48, opacity: 0.35 } as const;

type DepthProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A section's content enters in perspective: tilted back and set deeper, it comes upright
 * as its top travels up the viewport. CSS 3D transforms only, inside the parent's
 * `.scene-space`. Vertical only, so it needs no RTL handling; still under reduced motion.
 */
export function Depth({ children, className }: DepthProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.fromTo(
          element,
          { ...ENTER, transformOrigin: "50% 0%" },
          {
            rotationX: 0,
            z: 0,
            y: 0,
            opacity: 1,
            ease: EASE.linear,
            scrollTrigger: { trigger: element, start: "top bottom", end: "top 55%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
