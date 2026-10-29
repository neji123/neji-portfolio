"use client";

import { useLocale } from "next-intl";
import { type ReactNode, useRef } from "react";

import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { DURATION, EASE, FULL_MOTION_QUERY, SCROLL_START, STAGGER } from "@/lib/motion";

type SplitRevealProps = {
  /** One element (a heading or paragraph); its lines rise out of masks when it scrolls in. */
  children: ReactNode;
  className?: string;
};

/**
 * Splits into lines only (lines break between words), so Arabic keeps its joined letters.
 * Re-splits on resize and font load (autoSplit). Without JS or with reduced motion the text
 * simply stays as authored.
 *
 * SplitText moves the nodes React rendered, so React must never update them in place: a new
 * locale remounts the block, and the unmount reverts the split before React removes it.
 */
export function SplitReveal(props: SplitRevealProps) {
  return <SplitRevealBlock key={useLocale()} {...props} />;
}

function SplitRevealBlock({ children, className }: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = ref.current?.firstElementChild;
      if (!target) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        const split = SplitText.create(target, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: DURATION.reveal,
              ease: EASE.out,
              stagger: STAGGER.lines,
              scrollTrigger: { trigger: target, start: SCROLL_START, once: true },
            }),
        });
        return () => split.revert();
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
