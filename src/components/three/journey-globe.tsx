"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useRef } from "react";

import { type LatLon } from "@/types/geo";
import { type GlobeStop, type JourneyLeg, type JourneyStopId } from "@/types/journey";

import { GLOBE_FOV, GlobeCamera } from "./globe-camera";
import { type GlobeDriver } from "./globe-driver";
import { GlobeLabelProjector } from "./globe-label-projector";
import { type LabelNodes } from "./globe-labels";
import { GlobeRoute } from "./globe-route";
import { GlobeStars } from "./globe-stars";
import { GlobeSurface } from "./globe-surface";

/** Capped at 1.5× everywhere: the canvas covers the whole viewport for the whole page. */
const DPR: [min: number, max: number] = [1, 1.5];
const CAMERA = { fov: GLOBE_FOV, near: 0.1, far: 60, position: [0, 0, 5] } as const;

export type JourneyGlobeProps = {
  stops: readonly GlobeStop[];
  route: readonly JourneyLeg[];
  home: LatLon;
  driver: RefObject<GlobeDriver>;
  labelNodes: LabelNodes;
  /** False while the tab is hidden: rendering stops entirely. */
  active: boolean;
  activeStop: JourneyStopId | null;
  hoveredStop: JourneyStopId | null;
  /** The scene in view, rounded; reduced motion renders on demand, so a change must draw. */
  sceneIndex: number;
  reducedMotion: boolean;
  /** Phones and low-power devices: fewer dots and stars, no antialiasing. */
  lowPower: boolean;
  parallax: boolean;
  onReady: () => void;
};

/** Reports the first frame actually drawn, so the backdrop can swap the static globe out. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady();
  });
  return null;
}

/** On-demand rendering (reduced motion) still needs a frame whenever what is shown changes. */
function RenderOnChange({ signature }: { signature: string }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate, signature]);
  return null;
}

/** The page's one WebGL canvas: the globe, its route and the stars, behind every section. */
export function JourneyGlobe({
  stops,
  route,
  home,
  driver,
  labelNodes,
  active,
  activeStop,
  hoveredStop,
  sceneIndex,
  reducedMotion,
  lowPower,
  parallax,
  onReady,
}: JourneyGlobeProps) {
  const frameloop = !active ? "never" : reducedMotion ? "demand" : "always";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={DPR}
      camera={CAMERA}
      gl={{ alpha: true, antialias: !lowPower, powerPreference: "high-performance" }}
      flat
      // The globe never takes the pointer from the page; only its city buttons do.
      style={{ pointerEvents: "none" }}
    >
      <RenderOnChange
        signature={`${active}|${activeStop}|${hoveredStop}|${sceneIndex}|${reducedMotion}`}
      />
      <ReadySignal onReady={onReady} />
      <GlobeCamera
        stops={stops}
        home={home}
        driver={driver}
        reducedMotion={reducedMotion}
        parallax={parallax}
      />
      <GlobeStars sparse={lowPower} />
      <GlobeSurface sparse={lowPower} driver={driver} reducedMotion={reducedMotion} />
      <GlobeRoute
        stops={stops}
        route={route}
        driver={driver}
        activeStop={activeStop}
        hoveredStop={hoveredStop}
        reducedMotion={reducedMotion}
      />
      <GlobeLabelProjector
        stops={stops}
        nodes={labelNodes}
        driver={driver}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
