"use client";

import { useLenis } from "lenis/react";
import dynamic from "next/dynamic";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { HEADER_OFFSET } from "@/components/motion/smooth-scroll";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { flightAt } from "@/lib/journey-flight";
import { isJourneyStopId, JOURNEY_PANEL_ID, roleAnchorId } from "@/lib/journey-stops";
import { FINE_POINTER_QUERY } from "@/lib/motion";
import {
  type GlobeMode,
  type GlobeStop,
  type GlobeView,
  type JourneyLeg,
  type JourneyStopId,
} from "@/types/journey";

import { createGlobeDriver, type GlobeDriver } from "./globe-driver";

// three.js and React Three Fiber stay out of the page bundle until the globe is wanted.
const JourneyGlobe = dynamic(() => import("./journey-globe").then((m) => m.JourneyGlobe), {
  ssr: false,
});

/** Start fetching the 3D a screen before the globe scrolls into view. */
const LOAD_MARGIN = "100% 0px";
const IDLE_TIMEOUT = 2000;
const IDLE_FALLBACK_DELAY = 200;
const LOW_POWER_QUERY = "(max-width: 47.99rem), (pointer: coarse)";
const WIDE_LAYOUT_QUERY = "(min-width: 64rem)";
/** The line of the viewport (from the top) where a role counts as being read. */
const READING_LINE = 0.5;
/** How far into a role its anchor sits, so the camera lands while its heading is in view. */
const ANCHOR_DEPTH = 120;
const ROLE_SCROLL_GAP = 24;

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** WebGL, and a device that can afford it; otherwise the static globe stays. */
function canRender3D(): boolean {
  const nav: NavigatorHints = navigator;
  if (nav.connection?.saveData) return false;
  if (nav.hardwareConcurrency <= 2 || (nav.deviceMemory ?? Infinity) <= 2) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Runs `callback` after the page has loaded and the main thread is free, so the hero paints first. */
function whenIdle(callback: () => void): () => void {
  let idle: number | undefined;
  let timer: number | undefined;
  const start = () => {
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT });
    } else {
      timer = window.setTimeout(callback, IDLE_FALLBACK_DELAY);
    }
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
  return () => {
    window.removeEventListener("load", start);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) window.clearTimeout(timer);
  };
}

/** On narrow screens the journey window sticks above the timeline: scroll roles out from under it. */
function stickyPanelOffset(): number {
  const panel = document.getElementById(JOURNEY_PANEL_ID);
  if (!panel || window.matchMedia(WIDE_LAYOUT_QUERY).matches) return 0;
  return panel.offsetHeight;
}

type GlobeStageProps = {
  mode: GlobeMode;
  stops: readonly GlobeStop[];
  route: readonly JourneyLeg[];
  view: GlobeView;
  /** Accessible name of the globe. */
  label: string;
  /** Spoken after each city, e.g. "Show in Experience". */
  hint: string;
  /** The element whose scroll drives the camera: the hero section, or the experience timeline. */
  trackId: string;
  className?: string;
  /** The static globe, shown until the 3D one has drawn its first frame. */
  children: ReactNode;
};

/**
 * Holds the place of the Journey Globe. It shows the static fallback, loads the WebGL globe
 * once the page is idle and the globe is near, and feeds it scroll and pointer input.
 */
export function GlobeStage({
  mode,
  stops,
  route,
  view,
  label,
  hint,
  trackId,
  className,
  children,
}: GlobeStageProps) {
  const root = useRef<HTMLDivElement>(null);
  const driver = useRef<GlobeDriver>(createGlobeDriver());
  const [near, setNear] = useState(false);
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeStop, setActiveStop] = useState<JourneyStopId | null>(null);
  const reducedMotion = useReducedMotion();
  const lowPower = useMediaQuery(LOW_POWER_QUERY);
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const parallax = finePointer && !lowPower && !reducedMotion;
  const lenis = useLenis();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: LOAD_MARGIN },
    );
    // Off-screen, the canvas stops rendering altogether.
    const activeObserver = new IntersectionObserver(([entry]) => {
      setActive(entry?.isIntersecting ?? false);
    });
    nearObserver.observe(element);
    activeObserver.observe(element);
    return () => {
      nearObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!near || load) return;
    return whenIdle(() => {
      if (canRender3D()) setLoad(true);
    });
  }, [near, load]);

  useEffect(() => {
    if (!load || !parallax) return;
    const input = driver.current;
    const move = (event: PointerEvent) => {
      input.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      input.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      input.pointer.x = 0;
      input.pointer.y = 0;
    };
  }, [load, parallax]);

  useGSAP(
    () => {
      const track = document.getElementById(trackId);
      if (!track) return;
      const input = driver.current;

      if (mode === "hero") {
        ScrollTrigger.create({
          trigger: track,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            input.heroProgress = self.progress;
          },
        });
        return;
      }

      // Journey: each role in the timeline is a stop the camera lands on, in reading order.
      const roles = Array.from(track.querySelectorAll<HTMLElement>("[data-stop]")).flatMap(
        (element) => {
          const stop = element.dataset.stop;
          return isJourneyStopId(stop) ? [{ element, stop }] : [];
        },
      );
      input.flightPath = roles.map((role) => role.stop);
      let anchors: number[] = [];
      let shown = Number.NaN;

      const measure = () => {
        anchors = roles.map(({ element }) => {
          const box = element.getBoundingClientRect();
          return box.top + window.scrollY + Math.min(box.height / 2, ANCHOR_DEPTH);
        });
      };
      const update = () => {
        const reading = window.scrollY + window.innerHeight * READING_LINE;
        input.flight = flightAt(reading, anchors, window.innerHeight);
        const index = input.flight < -0.5 ? -1 : Math.round(input.flight);
        if (index === shown) return;
        shown = index;
        roles.forEach(({ element }, i) => element.toggleAttribute("data-active", i === index));
        setActiveStop(roles[index]?.stop ?? null);
      };

      ScrollTrigger.create({
        trigger: track,
        start: "top bottom",
        end: "bottom top",
        onRefresh: () => {
          measure();
          update();
        },
        onUpdate: update,
      });
      return () => roles.forEach(({ element }) => element.removeAttribute("data-active"));
    },
    { dependencies: [mode, trackId] },
  );

  const handleReady = useCallback(() => setReady(true), []);

  // A city leads to its role in the timeline (the first one, where a city holds two).
  const handleSelect = useCallback(
    (stopId: JourneyStopId) => {
      const roleId = stops.find((stop) => stop.id === stopId)?.roles[0]?.id;
      const role = roleId ? document.getElementById(roleAnchorId(roleId)) : null;
      if (!role) return;
      const offset = HEADER_OFFSET - ROLE_SCROLL_GAP - stickyPanelOffset();
      if (lenis) {
        lenis.scrollTo(role, { offset, immediate: reducedMotion });
      } else {
        window.scrollTo({
          top: role.getBoundingClientRect().top + window.scrollY + offset,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
      role.focus({ preventScroll: true });
    },
    [lenis, reducedMotion, stops],
  );

  return (
    <div ref={root} className={cn("relative isolate", className)}>
      <div
        aria-hidden={ready || undefined}
        className={cn(
          "size-full transition-opacity duration-700 ease-(--ease-smooth-out)",
          ready && "opacity-0",
        )}
      >
        {children}
      </div>
      {load ? (
        // The 3D globe rises into place over the static one, then takes over.
        <div
          role="group"
          aria-label={label}
          inert={!ready}
          className={cn(
            "absolute inset-0 translate-y-[5%] opacity-0 transition-[opacity,translate] duration-[1100ms] ease-(--ease-expo-out) motion-reduce:translate-y-0 motion-reduce:duration-500",
            ready && "translate-y-0 opacity-100",
          )}
        >
          <JourneyGlobe
            mode={mode}
            stops={stops}
            route={route}
            view={view}
            driver={driver}
            active={active}
            activeStop={mode === "journey" ? activeStop : null}
            reducedMotion={reducedMotion}
            lowPower={lowPower}
            parallax={parallax}
            hint={hint}
            onReady={handleReady}
            onSelect={handleSelect}
          />
        </div>
      ) : null}
    </div>
  );
}
