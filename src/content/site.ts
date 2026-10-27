import { type SiteMeta, type UiStrings } from "@/types/site";

import { profile } from "./profile";

export const siteMeta: SiteMeta = {
  locale: "en",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: `${profile.name} · ${profile.title}`,
  description: profile.tagline,
};

export const uiStrings: UiStrings = {
  skipToContent: "Skip to content",
  underConstruction: "Portfolio in progress. Design direction comes next.",
};
