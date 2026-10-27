import { type ImageAsset, type Localized, type LocalizedText } from "./localized";

export type ProjectLink = { kind: "live"; url: string } | { kind: "private" };

export type Project = {
  id: string;
  name: LocalizedText;
  description: Localized<string>;
  stack: readonly string[];
  link: ProjectLink;
  featured: boolean;
  /** Captured in Phase 3; absent until then. */
  image?: ImageAsset;
};
