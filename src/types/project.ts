import { type ImageAsset, type Localized, type LocalizedText } from "./localized";

export type ProjectLink = { kind: "live"; url: string } | { kind: "private" };

export type Project = {
  id: string;
  name: LocalizedText;
  description: Localized<string>;
  stack: readonly string[];
  link: ProjectLink;
  featured: boolean;
  /** Home-page capture of the live site; private projects have none. */
  image?: ImageAsset;
};
