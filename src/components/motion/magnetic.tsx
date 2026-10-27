"use client";

import { type ReactNode, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { DURATION, EASE, FINE_POINTER_QUERY, FULL_MOTION_QUERY } from "@/lib/motion";

const DEFAULT_STRENGTH = 0.28;

type MagneticProps = {
  children: ReactNode;
  /** Share of the pointer's offset from the centre that the element follows. */
  strength?: number;
  className?: string;
};

/** Pulls its child toward the pointer. Mouse and trackpad only; still under reduced motion. */
export function Magnetic({ children, strength = DEFAULT_STRENGTH, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add(`${FINE_POINTER_QUERY} and ${FULL_MOTION_QUERY}`, () => {
        const xTo = gsap.quickTo(element, "x", { duration: DURATION.medium, ease: EASE.smooth });
        const yTo = gsap.quickTo(element, "y", { duration: DURATION.medium, ease: EASE.smooth });

        const onMove = (event: PointerEvent) => {
          const box = element.getBoundingClientRect();
          xTo((event.clientX - (box.left + box.width / 2)) * strength);
          yTo((event.clientY - (box.top + box.height / 2)) * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        element.addEventListener("pointermove", onMove);
        element.addEventListener("pointerleave", onLeave);
        return () => {
          element.removeEventListener("pointermove", onMove);
          element.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <span ref={ref} className={className ?? "inline-block"}>
      {children}
    </span>
  );
}
