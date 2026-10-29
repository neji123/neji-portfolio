"use client";

import { useLenis } from "lenis/react";
import dynamic from "next/dynamic";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { HEADER_OFFSET } from "@/components/motion/smooth-scroll";
import { useDirection } from "@/hooks/use-direction";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { flightAt } from "@/lib/journey-flight";
import { isJourneyStopId, JOURNEY_ROUTE_ID, roleAnchorId } from "@/lib/journey-stops";
import { FINE_POINTER_QUERY } from "@/lib/motion";
import { type GlobeStop, type JourneyLeg, type JourneyStopId } from "@/types/journey";

import { createGlobeDriver, type GlobeDriver } from "./globe-driver";
import { GlobeLabels, type LabelNodes } from "./globe-labels";
import {
  GLOBE_SCENE_ATTRIBUTE,
  GLOBE_SCENES,
  type GlobePlacement,
  type GlobeSceneId,
  isGlobeSceneId,
  REDUCED_PLACEMENT,
  WIDE_LAYOUT_QUERY,
} from "./globe-scenes";

// three.js and React Three Fiber stay out of the page bundle until the page is idle.
const JourneyGlobe = dynamic(() => import("./journey-globe").then((m) => m.JourneyGlobe), {
  ssr: false,
});

const IDLE_TIMEOUT = 2000;
const IDLE_FALLBACK_DELAY = 200;
const LOW_POWER_QUERY = "(max-width: 47.99rem), (pointer: coarse)";
/** The line of the viewport (from the top) where a role counts as being read. */
const READING_LINE = 0.5;
/** How far into a role its anchor sits, so the camera lands while its heading is in view. */
const ANCHOR_DEPTH = 120;
const ROLE_SCROLL_GAP = 24;
/**
 * A section takes the globe over while its top travels from the bottom of the viewport
 * (1) to 40% of its height (0.4).
 */
const BLEND = { from: 1, to: 0.4 } as const;
/** Below this brightness the globe counts as background: the static fallback dims too. */
const FOREGROUND_DIM = 0.5;

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

/** Top of an element in the document, ignoring transforms (sections enter with a 3D tilt). */
function documentTop(element: HTMLElement): number {
  let top = 0;
  let node: Element | null = element;
  while (node instanceof HTMLElement) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
}

function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** The hero placement as CSS custom properties, so the static globe paints where the 3D one starts. */
function frameStyle(): CSSProperties {
  const vars = (prefix: string, place: GlobePlacement) => ({
    [`--gx-${prefix}`]: place.x,
    [`--gy-${prefix}`]: place.y,
    [`--gr-${prefix}`]: place.r,
  });
  return {
    ...vars("n", GLOBE_SCENES.hero.narrow),
    ...vars("w", GLOBE_SCENES.hero.wide),
    ...vars("rn", REDUCED_PLACEMENT.narrow),
    ...vars("rw", REDUCED_PLACEMENT.wide),
  } as CSSProperties;
}

type GlobeBackdropProps = {
  stops: readonly GlobeStop[];
  route: readonly JourneyLeg[];
  /** Accessible name of the group of city buttons. */
  label: string;
  /** Spoken after each city, e.g. "Show in Experience". */
  hint: string;
  /** The static globe, shown until the 3D one has drawn its first frame. */
  children: ReactNode;
};

/**
 * The one globe of the page, fixed behind every section. It shows the static fallback, loads
 * the WebGL globe once the page is idle, and feeds it the scene of the section being read,
 * the timeline flight and the pointer.
 */
export function GlobeBackdrop({ stops, route, label, hint, children }: GlobeBackdropProps) {
  const root = useRef<HTMLDivElement>(null);
  const driver = useRef<GlobeDriver>(createGlobeDriver());
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scenes, setScenes] = useState<GlobeSceneId[]>([]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [roleStop, setRoleStop] = useState<JourneyStopId | null>(null);
  const [hoveredStop, setHoveredStop] = useState<JourneyStopId | null>(null);
  const reducedMotion = useReducedMotion();
  const lowPower = useMediaQuery(LOW_POWER_QUERY);
  const wide = useMediaQuery(WIDE_LAYOUT_QUERY);
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const direction = useDirection();
  const parallax = finePointer && !lowPower && !reducedMotion;
  const lenis = useLenis();

  const anchors = useRef<(HTMLDivElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const sizes = useRef<{ width: number; height: number }[]>([]);
  const labelNodes = useMemo<LabelNodes>(() => ({ anchors, buttons, cards, sizes }), []);

  const home = stops.find((stop) => stop.current) ?? stops[0];
  const scene = scenes[sceneIndex] ?? "hero";
  const labelsShown = GLOBE_SCENES[scene].labels[wide ? "wide" : "narrow"];
  const activeStop =
    scene === "experience" ? roleStop : scene === "contact" ? (home?.id ?? null) : null;

  useEffect(() => {
    driver.current.wide = wide;
    driver.current.rtl = direction === "rtl";
    driver.current.labelsShown = labelsShown;
  }, [wide, direction, labelsShown]);

  useEffect(
    () =>
      whenIdle(() => {
        if (canRender3D()) setLoad(true);
      }),
    [],
  );

  // A hidden tab draws nothing.
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

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

  useGSAP(() => {
    const input = driver.current;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(`[${GLOBE_SCENE_ATTRIBUTE}]`),
    ).flatMap((element) => {
      const id = element.getAttribute(GLOBE_SCENE_ATTRIBUTE) ?? undefined;
      return isGlobeSceneId(id) ? [{ element, id }] : [];
    });
    const path = sections.map((section) => section.id);
    input.scenes = path;
    setScenes(path);
    const experienceIndex = path.indexOf("experience");

    // Each role in the timeline is a stop the camera lands on, in reading order.
    const track = document.getElementById(JOURNEY_ROUTE_ID);
    const roles = Array.from(track?.querySelectorAll<HTMLElement>("[data-stop]") ?? []).flatMap(
      (element) => {
        const stop = element.dataset.stop;
        return isJourneyStopId(stop) ? [{ element, stop }] : [];
      },
    );
    input.flightPath = roles.map((role) => role.stop);

    let sectionTops: number[] = [];
    let roleAnchors: number[] = [];
    let shownScene = Number.NaN;
    let shownRole = Number.NaN;

    const measure = () => {
      sectionTops = sections.map(({ element }) => documentTop(element));
      roleAnchors = roles.map(
        ({ element }) => documentTop(element) + Math.min(element.offsetHeight / 2, ANCHOR_DEPTH),
      );
    };

    const update = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      const span = height * (BLEND.from - BLEND.to);
      input.scene = sectionTops.reduce(
        (sum, top, i) =>
          i === 0 ? sum : sum + smoothstep01((scrollY + height * BLEND.from - top) / span),
        0,
      );
      input.flight = flightAt(scrollY + height * READING_LINE, roleAnchors, height);

      const sceneNow = Math.round(input.scene);
      if (sceneNow !== shownScene) {
        shownScene = sceneNow;
        setSceneIndex(sceneNow);
        const id = path[sceneNow] ?? "hero";
        if (root.current) {
          root.current.dataset.globeDepth =
            GLOBE_SCENES[id].wide.dim >= FOREGROUND_DIM ? "front" : "back";
        }
      }

      // The role being read lights its marker, but only while the timeline holds the globe.
      const reading = sceneNow === experienceIndex && input.flight > -0.5;
      const roleNow = reading ? Math.round(input.flight) : -1;
      if (roleNow === shownRole) return;
      shownRole = roleNow;
      roles.forEach(({ element }, i) => element.toggleAttribute("data-active", i === roleNow));
      setRoleStop(roles[roleNow]?.stop ?? null);
    };

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onRefresh: () => {
        measure();
        update();
      },
      onUpdate: update,
    });
    return () => roles.forEach(({ element }) => element.removeAttribute("data-active"));
  });

  const handleReady = useCallback(() => setReady(true), []);

  // A city leads to its role in the timeline (the first one, where a city holds two).
  const handleSelect = useCallback(
    (stopId: JourneyStopId) => {
      const roleId = stops.find((stop) => stop.id === stopId)?.roles[0]?.id;
      const role = roleId ? document.getElementById(roleAnchorId(roleId)) : null;
      if (!role) return;
      const offset = HEADER_OFFSET - ROLE_SCROLL_GAP;
      if (lenis) {
        lenis.scrollTo(role, { offset, immediate: reducedMotion });
      } else {
        window.scrollTo({
          top: documentTop(role) + offset,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
      role.focus({ preventScroll: true });
    },
    [lenis, reducedMotion, stops],
  );

  return (
    <>
      {/* Fixed behind the page at the large viewport height, so phones never resize the canvas. */}
      <div
        ref={root}
        data-globe-depth="front"
        className="globe-sky pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh"
      >
        <div
          aria-hidden={ready || undefined}
          style={frameStyle()}
          className={cn(
            "globe-frame transition-opacity duration-700 ease-(--ease-smooth-out)",
            ready && "opacity-0!",
          )}
        >
          {children}
        </div>
        {load && home ? (
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-[1100ms] ease-(--ease-expo-out) motion-reduce:duration-500",
              ready && "opacity-100",
            )}
          >
            <JourneyGlobe
              stops={stops}
              route={route}
              home={home}
              driver={driver}
              labelNodes={labelNodes}
              active={visible}
              activeStop={activeStop}
              hoveredStop={hoveredStop}
              sceneIndex={sceneIndex}
              reducedMotion={reducedMotion}
              lowPower={lowPower}
              parallax={parallax}
              onReady={handleReady}
            />
          </div>
        ) : null}
        <div aria-hidden="true" className="globe-vignette absolute inset-0" />
      </div>
      {/* The city buttons float above the content, under the header, wherever the globe is. */}
      {load ? (
        <div
          role="group"
          aria-label={label}
          inert={!ready || !labelsShown}
          className="pointer-events-none fixed inset-x-0 top-0 z-30 h-lvh"
        >
          <GlobeLabels
            stops={stops}
            nodes={labelNodes}
            shown={ready && labelsShown}
            activeStop={activeStop}
            hint={hint}
            onHover={setHoveredStop}
            onSelect={handleSelect}
          />
        </div>
      ) : null}
    </>
  );
}
