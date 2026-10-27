"use client";

import { REDUCED_MOTION_QUERY } from "@/lib/motion";

import { useMediaQuery } from "./use-media-query";

export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}
