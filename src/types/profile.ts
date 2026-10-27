export type KeyFigure =
  | { kind: "count"; value: number; before?: string; after?: string; label: string }
  | { kind: "text"; label: string };

export type Profile = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  availability: string;
  about: readonly string[];
  figures: readonly KeyFigure[];
};
