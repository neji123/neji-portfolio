"use client";

import { type ReactNode, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { DURATION, EASE, FINE_POINTER_QUERY, FULL_MOTION_QUERY } from "@/lib/motion";

const DEFAULT_MAX_TILT_DEG = 5;
const PERSPECTIVE_PX = 900;
const LIFT_SCALE = 1.015;
const CENTER = 0.5;

type TiltProps = {
  children: ReactNode;
  /** Degrees at the card's edge. */
  maxTilt?: number;
  className?: string;
};

/** Tilts toward the pointer in 3D. Mouse and trackpad only; flat under reduced motion. */
export function Tilt({ children, maxTilt = DEFAULT_MAX_TILT_DEG, className }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add(`${FINE_POINTER_QUERY} and ${FULL_MOTION_QUERY}`, () => {
        gsap.set(element, { transformPerspective: PERSPECTIVE_PX });
        const tween = { duration: DURATION.medium, ease: EASE.smooth };
        const rotateX = gsap.quickTo(element, "rotationX", tween);
        const rotateY = gsap.quickTo(element, "rotationY", tween);
        const scale = gsap.quickTo(element, "scale", tween);

        const onMove = (event: PointerEvent) => {
          const box = element.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width - CENTER;
          const y = (event.clientY - box.top) / box.height - CENTER;
          rotateY(x * maxTilt * 2);
          rotateX(-y * maxTilt * 2);
          scale(LIFT_SCALE);
        };
        const onLeave = () => {
          rotateX(0);
          rotateY(0);
          scale(1);
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
    { scope: ref, dependencies: [maxTilt] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
