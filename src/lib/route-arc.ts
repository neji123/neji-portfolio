import { type LatLon } from "@/types/geo";

import { angularDistance, greatCircle } from "./geo";

/** Segments per route leg, shared by the SVG fallback and the 3D globe so both fly the same arcs. */
export const ARC_SEGMENTS = 72;
const ARC_BASE_LIFT = 0.06;
const ARC_LIFT_PER_RADIAN = 0.12;
// Consecutive legs that share a corridor (Tunis → Montréal → France) fly at different heights.
const ALTERNATE_LEG_LIFT = 1.9;

export type ArcPoint = {
  point: LatLon;
  /** Height above the surface, as a fraction of the globe's radius. */
  altitude: number;
};

/** The great-circle arc of one route leg, lifted into a flight path. `legIndex` sets its height. */
export function routeArc(from: LatLon, to: LatLon, legIndex: number): ArcPoint[] {
  const liftScale = legIndex % 2 === 0 ? ALTERNATE_LEG_LIFT : 1;
  const lift = liftScale * (ARC_BASE_LIFT + ARC_LIFT_PER_RADIAN * angularDistance(from, to));
  return greatCircle(from, to, ARC_SEGMENTS).map((point, i) => ({
    point,
    altitude: lift * Math.sin((Math.PI * i) / ARC_SEGMENTS),
  }));
}
