import { type JourneyStopId } from "@/types/journey";

/**
 * What the page tells the globe each frame. The stage writes it from scroll and pointer
 * listeners; the scene reads it inside the render loop, so nothing re-renders React.
 */
export type GlobeDriver = {
  /** 0 while the hero fills the screen, 1 once it has scrolled away. */
  heroProgress: number;
  /** Position along the timeline: -1 is the overview, `i` sits on role `i`, fractions are flights. */
  flight: number;
  /** The globe stop of each timeline role, in reading order. */
  flightPath: JourneyStopId[];
  /** Pointer position over the viewport, -1 to 1 on each axis. */
  pointer: { x: number; y: number };
};

export function createGlobeDriver(): GlobeDriver {
  return { heroProgress: 0, flight: -1, flightPath: [], pointer: { x: 0, y: 0 } };
}
