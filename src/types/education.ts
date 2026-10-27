import { type Localized, type Period } from "./localized";

export type Education = {
  id: string;
  degree: Localized<string>;
  school: string;
  note?: Localized<string>;
  location: Localized<string>;
  period: Period;
};

export type SpokenLanguage = {
  id: string;
  label: Localized<string>;
};
