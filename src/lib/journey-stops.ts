import { experiences } from "@/content/experience";
import { journeyCityLabels, journeyStops } from "@/content/journey";
import { type Locale } from "@/i18n/locales";
import { type GlobeStop, type JourneyStopId } from "@/types/journey";

import { formatPeriod } from "./format-date";
import { localize } from "./localize";

/** The experience timeline whose roles drive the journey globe. */
export const JOURNEY_ROUTE_ID = "experience-route";
/** The sticky window holding the journey globe. */
export const JOURNEY_PANEL_ID = "journey-panel";

/** The id of a role's entry in the experience timeline, the target of a globe city. */
export function roleAnchorId(experienceId: string): string {
  return `role-${experienceId}`;
}

export function isJourneyStopId(value: string | undefined): value is JourneyStopId {
  return journeyStops.some((stop) => stop.id === value);
}

/** Every stop with its translated city name and the roles held there, in timeline order. */
export function globeStops(locale: Locale, presentLabel: string): GlobeStop[] {
  return journeyStops.map((stop) => ({
    ...stop,
    city: journeyCityLabels[locale][stop.id],
    roles: experiences
      .filter((item) => item.stop === stop.id)
      .map((item) => ({
        id: item.id,
        company: localize(item.company, locale),
        period: formatPeriod(item.period, locale, presentLabel),
      })),
  }));
}
