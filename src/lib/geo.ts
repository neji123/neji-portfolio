import { type LatLon } from "@/types/geo";

const DEG = Math.PI / 180;

type Vec3 = readonly [number, number, number];

export type OrthographicView = {
  center: LatLon;
  radius: number;
};

export type ProjectedPoint = {
  x: number;
  y: number;
  /** cos of the angular distance from the view centre: 1 facing the viewer, 0 on the limb. */
  depth: number;
  visible: boolean;
};

function toVector({ lat, lon }: LatLon): Vec3 {
  const phi = lat * DEG;
  const lambda = lon * DEG;
  return [Math.cos(phi) * Math.cos(lambda), Math.cos(phi) * Math.sin(lambda), Math.sin(phi)];
}

function toLatLon([x, y, z]: Vec3): LatLon {
  return { lat: Math.asin(Math.max(-1, Math.min(1, z))) / DEG, lon: Math.atan2(y, x) / DEG };
}

/** Orthographic projection; `altitude` lifts the point above the surface as a fraction of the radius. */
export function projectOrthographic(
  point: LatLon,
  view: OrthographicView,
  altitude = 0,
): ProjectedPoint {
  const phi = point.lat * DEG;
  const phi0 = view.center.lat * DEG;
  const deltaLambda = (point.lon - view.center.lon) * DEG;
  const depth =
    Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(deltaLambda);
  const r = view.radius * (1 + altitude);
  const x = r * Math.cos(phi) * Math.sin(deltaLambda);
  const y =
    -r * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(deltaLambda));
  return { x, y, depth, visible: depth > 0 || Math.hypot(x, y) > view.radius };
}

/** Points along the great circle between two places (spherical linear interpolation). */
export function greatCircle(from: LatLon, to: LatLon, segments: number): LatLon[] {
  const a = toVector(from);
  const b = toVector(to);
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
  if (omega === 0) return [from, to];
  const sinOmega = Math.sin(omega);
  return Array.from({ length: segments + 1 }, (_, i) => {
    const t = i / segments;
    const wa = Math.sin((1 - t) * omega) / sinOmega;
    const wb = Math.sin(t * omega) / sinOmega;
    return toLatLon([wa * a[0] + wb * b[0], wa * a[1] + wb * b[1], wa * a[2] + wb * b[2]]);
  });
}

/** Angular distance between two places, in radians. */
export function angularDistance(from: LatLon, to: LatLon): number {
  const a = toVector(from);
  const b = toVector(to);
  return Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
}
