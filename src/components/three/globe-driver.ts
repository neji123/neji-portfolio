import { type JourneyStopId } from "@/types/journey";

import { type GlobeSceneId } from "./globe-scenes";

/**
 * What the page tells the globe each frame. The backdrop writes it from scroll and pointer
 * listeners; the scene reads it inside the render loop, so nothing re-renders React.
 */
export type GlobeDriver = {
  /** The scene of each section of the page, in reading order. */
  scenes: GlobeSceneId[];
  /** Position along `scenes`: `i` holds scene `i`, fractions blend into the next one. */
  scene: number;
  /** Position along the timeline: -1 is the overview, `i` sits on role `i`, fractions are flights. */
  flight: number;
  /** The globe stop of each timeline role, in reading order. */
  flightPath: JourneyStopId[];
  /** Pointer position over the viewport, -1 to 1 on each axis. */
  pointer: { x: number; y: number };
  /** Wide layout (globe beside the content) or narrow (above or below it). */
  wide: boolean;
  /** Right-to-left document: the "end side" is the left. */
  rtl: boolean;
  /** Whether the city labels are on offer; they leave the tab order when not. */
  labelsShown: boolean;
};

export function createGlobeDriver(): GlobeDriver {
  return {
    scenes: [],
    scene: 0,
    flight: -1,
    flightPath: [],
    pointer: { x: 0, y: 0 },
    wide: true,
    rtl: false,
    labelsShown: true,
  };
}
