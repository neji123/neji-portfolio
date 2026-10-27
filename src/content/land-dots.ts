import { type LandDot } from "@/types/geo";

import rawLandDots from "./geo/land-dots.json";

function isLandDot(value: number[]): value is [number, number] {
  return value.length === 2;
}

/** Land sample points (Natural Earth 110m, 2.2° grid) for the dotted globe. */
export const landDots: readonly LandDot[] = rawLandDots.filter(isLandDot);
