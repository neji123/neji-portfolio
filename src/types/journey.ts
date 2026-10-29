import { type LatLon } from "./geo";

export type JourneyStopId = "tunis" | "montreal" | "france" | "kuwait-city";

export type JourneyStop = LatLon & {
  id: JourneyStopId;
  current: boolean;
};

export type JourneyLeg = readonly [from: JourneyStopId, to: JourneyStopId];

/** A role shown in a city's globe label, already formatted for one locale. */
export type GlobeRole = {
  /** The experience id, which also names the role's anchor in the timeline. */
  id: string;
  company: string;
  period: string;
};

/** A stop with everything its globe label needs in the current locale. */
export type GlobeStop = JourneyStop & {
  city: string;
  roles: readonly GlobeRole[];
};
