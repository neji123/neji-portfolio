import { type JourneyLeg, type JourneyStop, type JourneyStopId } from "@/types/journey";
import { type Localized } from "@/types/localized";

// France is plotted at the country's centroid: the ITEC Études mission was remote, so no city is claimed.
export const journeyStops: readonly JourneyStop[] = [
  { id: "tunis", lat: 36.81, lon: 10.18, current: false },
  { id: "montreal", lat: 45.5, lon: -73.57, current: false },
  { id: "france", lat: 46.6, lon: 2.4, current: false },
  { id: "kuwait-city", lat: 29.38, lon: 47.98, current: true },
];

export const journeyRoute: readonly JourneyLeg[] = [
  ["tunis", "montreal"],
  ["montreal", "france"],
  ["france", "kuwait-city"],
];

export const journeyCityLabels: Localized<Record<JourneyStopId, string>> = {
  en: { tunis: "Tunis", montreal: "Montréal", france: "France", "kuwait-city": "Kuwait City" },
  fr: { tunis: "Tunis", montreal: "Montréal", france: "France", "kuwait-city": "Koweït" },
  ar: { tunis: "تونس", montreal: "مونتريال", france: "فرنسا", "kuwait-city": "مدينة الكويت" },
};
