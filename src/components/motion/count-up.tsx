"use client";

import { useLocale } from "next-intl";
import { useRef } from "react";

import { localeMeta } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { DURATION, EASE, FULL_MOTION_QUERY, SCROLL_START } from "@/lib/motion";

type CountUpProps = {
  value: number;
  className?: string;
};

/** Counts from zero when scrolled into view. The HTML carries the final value, so it reads right without JS. */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatter = new Intl.NumberFormat(localeMeta[useLocale()].intl);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        const counter = { current: 0 };
        gsap.to(counter, {
          current: value,
          duration: DURATION.reveal * 1.4,
          ease: EASE.out,
          scrollTrigger: { trigger: element, start: SCROLL_START, once: true },
          onUpdate: () => {
            element.textContent = formatter.format(Math.round(counter.current));
          },
        });
        element.textContent = formatter.format(0);
        return () => {
          element.textContent = formatter.format(value);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {formatter.format(value)}
    </span>
  );
}
