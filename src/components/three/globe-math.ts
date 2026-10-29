import { Vector3 } from "three";

import { type LatLon } from "@/types/geo";

const DEG = Math.PI / 180;

/** A place on a sphere of `radius`: north is +y and longitude 0 faces +z, the default camera. */
export function toVector3({ lat, lon }: LatLon, radius = 1, target = new Vector3()): Vector3 {
  const phi = lat * DEG;
  const lambda = lon * DEG;
  return target.set(
    radius * Math.cos(phi) * Math.sin(lambda),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(lambda),
  );
}

/** The place under a direction from the globe's centre. */
export function toLatLon(direction: Vector3): LatLon {
  const unit = direction.clone().normalize();
  return { lat: Math.asin(unit.y) / DEG, lon: Math.atan2(unit.x, unit.z) / DEG };
}

/** Camera distance at which a unit globe's disc fills `fraction` of a view of `fovDegrees`. */
export function distanceForDisc(fraction: number, fovDegrees: number): number {
  const t = fraction * Math.tan((fovDegrees * DEG) / 2);
  return Math.sqrt(1 + 1 / (t * t));
}

/** Frame-rate independent easing factor towards a target. */
export function dampFactor(lambda: number, delta: number): number {
  return 1 - Math.exp(-lambda * delta);
}
