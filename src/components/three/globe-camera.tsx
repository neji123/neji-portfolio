"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import { MathUtils, Vector3 } from "three";

import {
  type GlobeMode,
  type GlobeStop,
  type GlobeView,
  type JourneyStopId,
} from "@/types/journey";

import { type GlobeDriver } from "./globe-driver";
import { dampFactor, distanceForDisc, toLatLon, toVector3 } from "./globe-math";

export const GLOBE_FOV = 30;
/** Disc share when the camera has landed on a stop: close enough to read the coast. */
const STOP_DISC = 1.45;
/** How much of the zoom a long hop gives up at its highest point. */
const HOP_ZOOM_OUT = 0.45;
/** Inside each flight, the share of scroll spent travelling; the rest dwells on the stops. */
const DWELL = { from: 0.15, to: 0.85 } as const;
/** As the hero leaves, the camera drifts south-east along the route and comes closer. */
const HERO_TRAVEL = { lat: -10, lon: 16, disc: 0.14 } as const;
const DRIFT = { degrees: 3, speed: 0.15 } as const;
const PARALLAX = { lat: 2.2, lon: 3.2 } as const;
const DAMPING = { camera: 3.2, pointer: 4 } as const;
/** A long pause (tab hidden, globe off-screen) must not fling the camera. */
const MAX_DELTA = 0.1;

type GlobeCameraProps = {
  mode: GlobeMode;
  view: GlobeView;
  stops: readonly GlobeStop[];
  driver: RefObject<GlobeDriver>;
  reducedMotion: boolean;
  parallax: boolean;
};

/**
 * Where the camera looks while flying the timeline (written into `out`), and how close it is.
 * The camera leaves the overview for the first role, then hops from stop to stop.
 */
function flightTarget(
  flight: number,
  path: readonly JourneyStopId[],
  stops: ReadonlyMap<JourneyStopId, Vector3>,
  overview: Vector3,
  overviewDisc: number,
  out: Vector3,
): number {
  const stopAt = (i: number) => {
    const id = path[Math.min(Math.max(i, 0), path.length - 1)];
    return id === undefined ? undefined : stops.get(id);
  };
  const first = stopAt(0);
  if (!first || flight <= -1) {
    out.copy(overview);
    return overviewDisc;
  }
  if (flight < 0) {
    const t = MathUtils.smoothstep(flight + 1, 0, 1);
    out.lerpVectors(overview, first, t).normalize();
    return MathUtils.lerp(overviewDisc, STOP_DISC, t);
  }
  const index = Math.floor(flight);
  const from = stopAt(index) ?? first;
  const to = stopAt(index + 1) ?? from;
  const t = MathUtils.smoothstep(flight - index, DWELL.from, DWELL.to);
  out.lerpVectors(from, to, t).normalize();
  const hop = Math.min(1, from.angleTo(to) / (Math.PI / 2));
  return STOP_DISC * (1 - HOP_ZOOM_OUT * hop * Math.sin(Math.PI * t));
}

export function GlobeCamera({
  mode,
  view,
  stops,
  driver,
  reducedMotion,
  parallax,
}: GlobeCameraProps) {
  const camera = useThree((state) => state.camera);
  const stopVectors = useMemo(
    () => new Map(stops.map((stop) => [stop.id, toVector3(stop)])),
    [stops],
  );
  const overview = useMemo(() => toVector3(view.center), [view.center]);
  const state = useRef({
    direction: new Vector3(),
    target: new Vector3(),
    disc: view.disc,
    x: 0,
    y: 0,
    primed: false,
  });

  useFrame(({ clock, size }, rawDelta) => {
    const delta = Math.min(rawDelta, MAX_DELTA);
    const input = driver.current;
    const now = state.current;
    const { target } = now;
    const settle = !now.primed || reducedMotion;
    const pointerK = settle ? 1 : dampFactor(DAMPING.pointer, delta);
    const cameraK = settle ? 1 : dampFactor(DAMPING.camera, delta);

    const follow = parallax && !reducedMotion;
    now.x += ((follow ? input.pointer.x : 0) - now.x) * pointerK;
    now.y += ((follow ? input.pointer.y : 0) - now.y) * pointerK;

    let disc: number;
    if (mode === "hero") {
      const travel = reducedMotion ? 0 : input.heroProgress;
      const drift = reducedMotion ? 0 : Math.sin(clock.elapsedTime * DRIFT.speed) * DRIFT.degrees;
      toVector3(
        {
          lat: view.center.lat + HERO_TRAVEL.lat * travel,
          lon: view.center.lon + HERO_TRAVEL.lon * travel + drift,
        },
        1,
        target,
      );
      disc = view.disc * (1 + HERO_TRAVEL.disc * travel);
    } else if (reducedMotion) {
      // Reduced motion: the whole route stays in view and the camera never travels.
      target.copy(overview);
      disc = view.disc;
    } else {
      disc = flightTarget(input.flight, input.flightPath, stopVectors, overview, view.disc, target);
    }

    // Parallax nudges the view a few degrees, the way a window shifts when you lean.
    if (now.x !== 0 || now.y !== 0) {
      const place = toLatLon(target);
      toVector3(
        { lat: place.lat - now.y * PARALLAX.lat, lon: place.lon + now.x * PARALLAX.lon },
        1,
        target,
      );
    }

    if (settle) now.direction.copy(target);
    else now.direction.lerp(target, cameraK).normalize();
    now.disc += (disc - now.disc) * cameraK;
    now.primed = true;

    // A portrait view is narrower than it is tall: fit the disc to the width instead.
    const fit = Math.min(1, size.width / size.height);
    camera.position.copy(now.direction).multiplyScalar(distanceForDisc(now.disc * fit, GLOBE_FOV));
    camera.lookAt(0, 0, 0);
  });

  return null;
}
