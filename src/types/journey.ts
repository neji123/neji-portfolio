import { type LatLon } from "./geo";

export type JourneyStopId = "tunis" | "montreal" | "france" | "kuwait-city";

export type JourneyStop = LatLon & {
  id: JourneyStopId;
  current: boolean;
};

export type JourneyLeg = readonly [from: JourneyStopId, to: JourneyStopId];
