"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { type ReactNode, useEffect, useMemo } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Anchor scrolls stop below the sticky header (4.5rem). */
export const HEADER_OFFSET = -72;
const LERP = 0.1;
const MS_PER_SECOND = 1000;

/** Drives Lenis from GSAP's ticker so ScrollTrigger and smooth scroll share one clock. */
function ScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const tick = (time: number) => lenis.raf(time * MS_PER_SECOND);
    const unsubscribe = lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      unsubscribe();
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  // Reduced motion: native wheel and instant anchor jumps. Touch always scrolls natively.
  const options = useMemo(
    () => ({
      autoRaf: false,
      lerp: LERP,
      smoothWheel: !reducedMotion,
      anchors: { offset: HEADER_OFFSET, immediate: reducedMotion },
    }),
    [reducedMotion],
  );

  return (
    <ReactLenis root options={options}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

/** Pauses page scrolling while an overlay (the mobile menu, the lightbox) is open. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [lenis, locked]);
}
