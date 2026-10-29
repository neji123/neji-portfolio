import { type LatLon } from "@/types/geo";

/**
 * The scroll choreography of the one persistent globe. Every section of the page names a scene
 * (`data-globe-scene`); the globe blends from one scene to the next as the section comes in.
 * No three.js here: the page bundle and the server-rendered fallback read this table too.
 */
export type GlobeSceneId =
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "contact";

/**
 * Where the globe sits: its centre as a share of the viewport (`x` from the inline-start edge,
 * so Arabic mirrors it), its radius as a share of the layout's base size (see `baseSize`), and
 * its brightness (1 in the foreground, low when it is only atmosphere behind the reading).
 */
export type GlobePlacement = { x: number; y: number; r: number; dim: number };

/**
 * What the camera looks at. "hero": the Mediterranean, Montréal to Kuwait City in view.
 * "spin": a slow turn of the planet. "flight": the stop of the role being read. "home": Kuwait City.
 */
export type GlobeAim = "hero" | "spin" | "flight" | "home";

export type GlobeScene = {
  aim: GlobeAim;
  wide: GlobePlacement;
  narrow: GlobePlacement;
  /** Whether the city labels are offered (they sit above the content, so only where it is clear). */
  labels: { wide: boolean; narrow: boolean };
};

export const GLOBE_SCENES: Record<GlobeSceneId, GlobeScene> = {
  // The planet rises from the end edge, under the copy; the viewport edge is its only horizon.
  hero: {
    aim: "hero",
    wide: { x: 0.7, y: 0.85, r: 0.57, dim: 1 },
    narrow: { x: 0.5, y: 0.98, r: 0.62, dim: 1 },
    labels: { wide: true, narrow: true },
  },
  // It drifts back behind the portrait and turns slowly: an atmosphere, not a subject.
  about: {
    aim: "spin",
    wide: { x: 0.27, y: 0.56, r: 0.5, dim: 0.42 },
    narrow: { x: 0.5, y: 0.5, r: 0.72, dim: 0.28 },
    labels: { wide: false, narrow: false },
  },
  // A companion on the end side, beside the timeline, flying from stop to stop.
  experience: {
    aim: "flight",
    wide: { x: 0.785, y: 0.54, r: 0.34, dim: 1 },
    narrow: { x: 0.82, y: 0.24, r: 0.3, dim: 0.75 },
    labels: { wide: true, narrow: false },
  },
  // The reading sections: the globe recedes, smaller and darker, still turning.
  projects: {
    aim: "spin",
    wide: { x: 0.62, y: 0.64, r: 0.3, dim: 0.22 },
    narrow: { x: 0.3, y: 0.78, r: 0.5, dim: 0.16 },
    labels: { wide: false, narrow: false },
  },
  skills: {
    aim: "spin",
    wide: { x: 0.84, y: 0.4, r: 0.26, dim: 0.2 },
    narrow: { x: 0.82, y: 0.35, r: 0.45, dim: 0.16 },
    labels: { wide: false, narrow: false },
  },
  education: {
    aim: "spin",
    wide: { x: 0.18, y: 0.62, r: 0.24, dim: 0.18 },
    narrow: { x: 0.2, y: 0.62, r: 0.4, dim: 0.15 },
    labels: { wide: false, narrow: false },
  },
  certifications: {
    aim: "spin",
    wide: { x: 0.5, y: 0.98, r: 0.5, dim: 0.18 },
    narrow: { x: 0.5, y: 1.02, r: 0.8, dim: 0.16 },
    labels: { wide: false, narrow: false },
  },
  // It comes back to the foreground, Kuwait City turned towards the contact action.
  contact: {
    aim: "home",
    wide: { x: 0.74, y: 0.55, r: 0.4, dim: 1 },
    narrow: { x: 0.5, y: 0.96, r: 0.7, dim: 1 },
    labels: { wide: true, narrow: true },
  },
};

/** Reduced motion: one calm placement for the whole page, no travel and no scrubbing. */
export const REDUCED_PLACEMENT: Record<"wide" | "narrow", GlobePlacement> = {
  wide: { x: 0.78, y: 0.62, r: 0.42, dim: 0.45 },
  narrow: { x: 0.5, y: 0.98, r: 0.62, dim: 0.4 },
};

export const GLOBE_SCENE_ATTRIBUTE = "data-globe-scene";
/** Tablets and up place the globe beside the content; phones place it above or below. */
export const WIDE_LAYOUT_QUERY = "(min-width: 48rem)";
/** Wide screens size the globe to the height, without letting it outgrow 62% of the width. */
export const WIDE_BASE_WIDTH_SHARE = 0.62;

export const HERO_AIM: LatLon = { lat: 35, lon: 8 };
/** The whole route in one view, between Montréal and Kuwait City. */
export const OVERVIEW_AIM: LatLon = { lat: 40, lon: -13 };
/** Kuwait City sits off-centre, on the side of the globe that faces the contact action. */
export const HOME_AIM = {
  wide: { lat: 26, lonOffset: 20 },
  narrow: { lat: 8, lonOffset: 0 },
} as const;

/** Pixels the globe's radius is measured against. */
export function baseSize(width: number, height: number, wide: boolean): number {
  return wide ? Math.min(width * WIDE_BASE_WIDTH_SHARE, height) : width;
}

export function isGlobeSceneId(value: string | undefined): value is GlobeSceneId {
  return value !== undefined && value in GLOBE_SCENES;
}

/** The blended placement at fractional scene index `scene` along `path`. */
export function placementAt(
  scene: number,
  path: readonly GlobeSceneId[],
  wide: boolean,
  out: GlobePlacement,
): GlobePlacement {
  const last = Math.max(path.length - 1, 0);
  const clamped = Math.min(Math.max(scene, 0), last);
  const index = Math.floor(clamped);
  const t = clamped - index;
  const layout = wide ? "wide" : "narrow";
  const from = GLOBE_SCENES[path[index] ?? "hero"][layout];
  const to = GLOBE_SCENES[path[Math.min(index + 1, last)] ?? "hero"][layout];
  out.x = from.x + (to.x - from.x) * t;
  out.y = from.y + (to.y - from.y) * t;
  out.r = from.r + (to.r - from.r) * t;
  out.dim = from.dim + (to.dim - from.dim) * t;
  return out;
}

/** How fast the globe eases into a new placement and brightness (per second). */
export const PLACEMENT_DAMPING = 3;

/** What the layers of the scene read each frame: brightness and the share of the timeline flight. */
export type GlobeLook = { dim: number; flightWeight: number; primed: boolean };

export function createGlobeLook(): GlobeLook {
  return { dim: 1, flightWeight: 0, primed: false };
}

/**
 * Advances `look` towards the blended scene at `scene`. `ease` is the frame's damping factor
 * for `PLACEMENT_DAMPING`; every layer eases the same way, so they stay in step with the camera.
 */
export function stepLook(
  look: GlobeLook,
  path: readonly GlobeSceneId[],
  scene: number,
  wide: boolean,
  reducedMotion: boolean,
  ease: number,
): GlobeLook {
  const layout = wide ? "wide" : "narrow";
  let dim: number;
  if (reducedMotion) {
    dim = REDUCED_PLACEMENT[layout].dim;
    look.flightWeight = 0;
  } else {
    const last = Math.max(path.length - 1, 0);
    const clamped = Math.min(Math.max(scene, 0), last);
    const index = Math.floor(clamped);
    const t = clamped - index;
    const from = GLOBE_SCENES[path[index] ?? "hero"];
    const to = GLOBE_SCENES[path[Math.min(index + 1, last)] ?? "hero"];
    dim = from[layout].dim + (to[layout].dim - from[layout].dim) * t;
    look.flightWeight = (from.aim === "flight" ? 1 - t : 0) + (to.aim === "flight" ? t : 0);
  }
  const k = look.primed && !reducedMotion ? ease : 1;
  look.dim += (dim - look.dim) * k;
  look.primed = true;
  return look;
}
