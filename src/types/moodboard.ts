import { type JourneyStopId } from "./journey";

export type BoardLocale = "en" | "ar";

export type DirectionId = "night-route" | "departures";

export type NavCopy = {
  links: readonly string[];
  downloadCv: string;
};

export type HeroCopy = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  primaryCta: string;
  secondaryCta: string;
  portraitAlt: string;
};

export type BoardStop = {
  id: string;
  code: string;
  place: string;
  company: string;
  role: string;
  dates: string;
  summary: string;
  current: boolean;
};

export type BoardColumns = {
  code: string;
  destination: string;
  company: string;
  role: string;
  dates: string;
  status: string;
  now: string;
};

export type AboutCopy = {
  heading: string;
  paragraphs: readonly string[];
  figures: readonly string[];
};

export type SiteCopy = {
  nav: NavCopy;
  hero: HeroCopy;
  about: AboutCopy;
  stops: readonly BoardStop[];
  columns: BoardColumns;
  cities: Record<JourneyStopId, string>;
  globeLabel: string;
};

export type Swatch = {
  token: string;
  value: string;
  name: string;
  use: string;
};

export type DirectionCopy = {
  name: string;
  thesis: string;
  idea: string;
  firstViewport: string;
  liveThing: string;
  typeLatin: string;
  typeArabic: string;
  typeNote: string;
  motion: string;
  risk: string;
  raises: readonly string[];
  swatches: readonly Swatch[];
};

export type LanguageOption = {
  code: string;
  label: string;
  ariaLabel: string;
};

export type MoodboardUi = {
  boardLabel: string;
  siteNavLabel: string;
  directionsNavLabel: string;
  languageNavLabel: string;
  sections: {
    idea: string;
    firstViewport: string;
    liveThing: string;
    palette: string;
    type: string;
    interface: string;
    stop: string;
    motion: string;
    risk: string;
    raises: string;
  };
  specimenDisplay: string;
  specimenText: string;
  switcherCaption: string;
  languages: readonly LanguageOption[];
  localeName: Record<BoardLocale, string>;
};

export type MoodboardIndexCopy = {
  title: string;
  intro: string;
  directionsHeading: string;
};
