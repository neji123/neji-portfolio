"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, FULL_MOTION_QUERY } from "@/lib/motion";

/** The timeline's spine: the route drawn as a thick bar that grows with the scroll. */
export function RouteLine() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const line = ref.current;
      const list = line?.parentElement;
      if (!line || !list) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: EASE.linear,
            scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="absolute start-1.5 top-3 bottom-3 w-1 origin-top rounded-full bg-route"
    />
  );
}
