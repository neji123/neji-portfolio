import { type JourneyStopId } from "./journey";
import { type Localized, type LocalizedText, type Period } from "./localized";

export type Experience = {
  id: string;
  company: LocalizedText;
  role: Localized<string>;
  location: Localized<string>;
  period: Period;
  summary: Localized<string>;
  stack: readonly string[];
  /** The globe stop this role belongs to. */
  stop: JourneyStopId;
};
