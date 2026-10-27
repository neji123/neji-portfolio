"use client";

import { type ReactNode, useRef } from "react";

import { useInlineSign } from "@/hooks/use-direction";
import { gsap, useGSAP } from "@/lib/gsap";
import { DISTANCE, DURATION, EASE, FULL_MOTION_QUERY, SCROLL_START, STAGGER } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** "below" rises; "start" slides in from the reading-start edge (left in LTR, right in RTL). */
  from?: "below" | "start";
  /** Stagger the descendants marked `data-reveal-item` instead of moving the block as one. */
  stagger?: boolean;
  delay?: number;
};

export function Reveal({
  children,
  className,
  from = "below",
  stagger = false,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inlineSign = useInlineSign();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        const targets = stagger ? element.querySelectorAll("[data-reveal-item]") : element;
        gsap.from(targets, {
          autoAlpha: 0,
          y: from === "below" ? DISTANCE.rise : 0,
          x: from === "start" ? -DISTANCE.slide * inlineSign : 0,
          duration: DURATION.slow,
          ease: EASE.out,
          delay,
          stagger: stagger ? STAGGER.items : 0,
          scrollTrigger: { trigger: element, start: SCROLL_START, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [inlineSign, from, stagger, delay], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
