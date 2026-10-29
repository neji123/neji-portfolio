"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useRef, useState } from "react";

import {
  type GlobeMode,
  type GlobeStop,
  type GlobeView,
  type JourneyLeg,
  type JourneyStopId,
} from "@/types/journey";

import { GLOBE_FOV, GlobeCamera } from "./globe-camera";
import { type GlobeDriver } from "./globe-driver";
import { GlobeLabels } from "./globe-labels";
import { GlobeRoute } from "./globe-route";
import { GlobeSurface } from "./globe-surface";

/** Phones are capped at 1.5× (brief §4); large screens stop at 1.75× to keep the fill rate sane. */
const DPR: Record<"lowPower" | "full", [min: number, max: number]> = {
  lowPower: [1, 1.5],
  full: [1, 1.75],
};
const CAMERA = { fov: GLOBE_FOV, near: 0.1, far: 20, position: [0, 0, 5] } as const;

export type JourneyGlobeProps = {
  mode: GlobeMode;
  stops: readonly GlobeStop[];
  route: readonly JourneyLeg[];
  view: GlobeView;
  driver: RefObject<GlobeDriver>;
  /** False while the globe is off-screen: rendering stops entirely. */
  active: boolean;
  activeStop: JourneyStopId | null;
  reducedMotion: boolean;
  /** Phones and low-power devices: fewer dots, lower resolution, no antialiasing. */
  lowPower: boolean;
  parallax: boolean;
  hint: string;
  onReady: () => void;
  onSelect: (stop: JourneyStopId) => void;
};

/** Reports the first frame actually drawn, so the stage can swap the static globe out. */
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

export function JourneyGlobe({
  mode,
  stops,
  route,
  view,
  driver,
  active,
  activeStop,
  reducedMotion,
  lowPower,
  parallax,
  hint,
  onReady,
  onSelect,
}: JourneyGlobeProps) {
  const [hoveredStop, setHoveredStop] = useState<JourneyStopId | null>(null);
  const frameloop = !active ? "never" : reducedMotion ? "demand" : "always";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={lowPower ? DPR.lowPower : DPR.full}
      camera={CAMERA}
      gl={{ alpha: true, antialias: !lowPower, powerPreference: "high-performance" }}
      flat
      // The globe never takes the pointer from the page; only its city buttons do.
      style={{ pointerEvents: "none" }}
    >
      <RenderOnChange signature={`${active}|${activeStop}|${hoveredStop}|${reducedMotion}`} />
      <ReadySignal onReady={onReady} />
      <GlobeCamera
        mode={mode}
        view={view}
        stops={stops}
        driver={driver}
        reducedMotion={reducedMotion}
        parallax={parallax}
      />
      <GlobeSurface sparse={lowPower} />
      <GlobeRoute
        stops={stops}
        route={route}
        activeStop={activeStop}
        hoveredStop={hoveredStop}
        reducedMotion={reducedMotion}
      />
      <GlobeLabels
        stops={stops}
        activeStop={activeStop}
        hint={hint}
        onHover={setHoveredStop}
        onSelect={onSelect}
      />
    </Canvas>
  );
}
