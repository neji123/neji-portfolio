"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";

import { type LatLon } from "@/types/geo";
import { type GlobeStop, type JourneyStopId } from "@/types/journey";

import { type GlobeDriver } from "./globe-driver";
import { dampFactor, distanceForDisc, toLatLon, toVector3 } from "./globe-math";
import {
  baseSize,
  GLOBE_SCENES,
  type GlobeAim,
  type GlobePlacement,
  HERO_AIM,
  HOME_AIM,
  OVERVIEW_AIM,
  PLACEMENT_DAMPING,
  placementAt,
  REDUCED_PLACEMENT,
} from "./globe-scenes";

export const GLOBE_FOV = 30;
/** How much closer the camera comes when it has landed on a stop of the timeline. */
const STOP_ZOOM = 1.35;
/** How much of the zoom a long hop gives up at its highest point. */
const HOP_ZOOM_OUT = 0.3;
/** Inside each flight, the share of scroll spent travelling; the rest dwells on the stops. */
const DWELL = { from: 0.15, to: 0.85 } as const;
/** The latitude the slow turn holds, and its speed in degrees per second. */
const SPIN = { lat: 24, speed: 4 } as const;
const DRIFT = { degrees: 3, speed: 0.15 } as const;
const PARALLAX = { lat: 2.2, lon: 3.2 } as const;
const DAMPING = { camera: 3.2, pointer: 4 } as const;
/** A long pause (tab hidden) must not fling the camera. */
const MAX_DELTA = 0.1;
const FULL_TURN = 360;
const HALF_TURN = 180;

type GlobeCameraProps = {
  stops: readonly GlobeStop[];
  /** The stop where the contact scene points, the current city. */
  home: LatLon;
  driver: RefObject<GlobeDriver>;
  reducedMotion: boolean;
  parallax: boolean;
};

type Aimed = { place: LatLon; zoom: number };

/** Longitude difference folded into -180..180, so blends take the short way round. */
function lonDelta(from: number, to: number): number {
  return ((((to - from + HALF_TURN) % FULL_TURN) + FULL_TURN) % FULL_TURN) - HALF_TURN;
}

/**
 * Where the camera looks while flying the timeline, and how close it comes.
 * It leaves the overview for the first role, then hops from stop to stop.
 */
function flightAim(
  flight: number,
  path: readonly JourneyStopId[],
  stops: ReadonlyMap<JourneyStopId, Vector3>,
  overview: Vector3,
  scratch: Vector3,
): Aimed {
  const stopAt = (i: number) => {
    const id = path[Math.min(Math.max(i, 0), path.length - 1)];
    return id === undefined ? undefined : stops.get(id);
  };
  const first = stopAt(0);
  if (!first || flight <= -1) return { place: toLatLon(overview), zoom: 1 };
  if (flight < 0) {
    const t = MathUtils.smoothstep(flight + 1, 0, 1);
    scratch.lerpVectors(overview, first, t).normalize();
    return { place: toLatLon(scratch), zoom: MathUtils.lerp(1, STOP_ZOOM, t) };
  }
  const index = Math.floor(flight);
  const from = stopAt(index) ?? first;
  const to = stopAt(index + 1) ?? from;
  const t = MathUtils.smoothstep(flight - index, DWELL.from, DWELL.to);
  scratch.lerpVectors(from, to, t).normalize();
  const hop = Math.min(1, from.angleTo(to) / (Math.PI / 2));
  return {
    place: toLatLon(scratch),
    zoom: STOP_ZOOM * (1 - HOP_ZOOM_OUT * hop * Math.sin(Math.PI * t)),
  };
}

/**
 * The one camera of the page. It blends the scene of the section being read into the next:
 * where the globe sits on screen (a view offset, so the globe is never cropped by a box),
 * how large it is, and what it looks at. Brightness is eased by each layer (`stepLook`).
 */
export function GlobeCamera({ stops, home, driver, reducedMotion, parallax }: GlobeCameraProps) {
  const camera = useThree((state) => state.camera);
  const stopVectors = useMemo(
    () => new Map(stops.map((stop) => [stop.id, toVector3(stop)])),
    [stops],
  );
  const overview = useMemo(() => toVector3(OVERVIEW_AIM), []);
  const state = useRef({
    direction: new Vector3(),
    target: new Vector3(),
    scratch: new Vector3(),
    goal: { x: 0, y: 0, r: 0, dim: 0 } satisfies GlobePlacement,
    place: { x: 0, y: 0, r: 0 },
    zoom: 1,
    spin: HERO_AIM.lon,
    x: 0,
    y: 0,
    primed: false,
  });

  useFrame(({ clock, size }, rawDelta) => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const delta = Math.min(rawDelta, MAX_DELTA);
    const input = driver.current;
    const now = state.current;
    const settle = !now.primed || reducedMotion;
    const pointerK = settle ? 1 : dampFactor(DAMPING.pointer, delta);
    const cameraK = settle ? 1 : dampFactor(DAMPING.camera, delta);
    const placeK = settle ? 1 : dampFactor(PLACEMENT_DAMPING, delta);
    const layout = input.wide ? "wide" : "narrow";

    const follow = parallax && !reducedMotion;
    now.x += ((follow ? input.pointer.x : 0) - now.x) * pointerK;
    now.y += ((follow ? input.pointer.y : 0) - now.y) * pointerK;

    // The two scenes being blended, and how far along the blend is.
    const last = Math.max(input.scenes.length - 1, 0);
    const scene = Math.min(Math.max(input.scene, 0), last);
    const index = Math.floor(scene);
    const t = scene - index;
    const fromAim = GLOBE_SCENES[input.scenes[index] ?? "hero"].aim;
    const toAim = GLOBE_SCENES[input.scenes[Math.min(index + 1, last)] ?? "hero"].aim;
    const weightOf = (aim: GlobeAim) => (fromAim === aim ? 1 - t : 0) + (toAim === aim ? t : 0);

    const aimAt = (aim: GlobeAim): Aimed => {
      if (aim === "hero") {
        const drift = Math.sin(clock.elapsedTime * DRIFT.speed) * DRIFT.degrees;
        return { place: { lat: HERO_AIM.lat, lon: HERO_AIM.lon + drift }, zoom: 1 };
      }
      if (aim === "spin") return { place: { lat: SPIN.lat, lon: now.spin }, zoom: 1 };
      if (aim === "home") {
        const offset = HOME_AIM[layout].lonOffset * (input.rtl ? -1 : 1);
        return { place: { lat: HOME_AIM[layout].lat, lon: home.lon + offset }, zoom: 1 };
      }
      return flightAim(input.flight, input.flightPath, stopVectors, overview, now.scratch);
    };

    let aimed: Aimed;
    if (reducedMotion) {
      // Reduced motion: one calm placement, the whole route in view, no travel.
      Object.assign(now.goal, REDUCED_PLACEMENT[layout]);
      aimed = { place: OVERVIEW_AIM, zoom: 1 };
    } else {
      // The slow turn only advances while a turning scene is on screen, so it resumes where it left.
      now.spin += delta * SPIN.speed * weightOf("spin");
      placementAt(scene, input.scenes, input.wide, now.goal);
      const from = aimAt(fromAim);
      const to = fromAim === toAim && t === 0 ? from : aimAt(toAim);
      aimed = {
        place: {
          lat: MathUtils.lerp(from.place.lat, to.place.lat, t),
          lon: from.place.lon + lonDelta(from.place.lon, to.place.lon) * t,
        },
        zoom: MathUtils.lerp(from.zoom, to.zoom, t),
      };
    }

    // Parallax nudges the view a few degrees, the way a window shifts when you lean.
    toVector3(
      { lat: aimed.place.lat - now.y * PARALLAX.lat, lon: aimed.place.lon + now.x * PARALLAX.lon },
      1,
      now.target,
    );

    if (settle) now.direction.copy(now.target);
    else now.direction.lerp(now.target, cameraK).normalize();
    now.zoom += (aimed.zoom - now.zoom) * cameraK;
    const { goal, place } = now;
    place.x += (goal.x - place.x) * placeK;
    place.y += (goal.y - place.y) * placeK;
    place.r += (goal.r - place.r) * placeK;
    now.primed = true;

    // The globe's on-screen radius sets the distance; the view offset moves it on screen.
    const { width, height } = size;
    const radius = place.r * now.zoom * baseSize(width, height, input.wide);
    const distance = distanceForDisc((2 * radius) / height, GLOBE_FOV);
    camera.position.copy(now.direction).multiplyScalar(distance);
    camera.lookAt(0, 0, 0);
    const centerX = (input.rtl ? 1 - place.x : place.x) * width;
    const centerY = place.y * height;
    camera.setViewOffset(width, height, width / 2 - centerX, height / 2 - centerY, width, height);
  });

  return null;
}
