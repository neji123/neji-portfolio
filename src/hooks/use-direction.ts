"use client";

import { useLocale } from "next-intl";

import { type Direction, directionFor } from "@/i18n/locales";

/** Writing direction of the current locale, for motion that travels along the inline axis. */
export function useDirection(): Direction {
  return directionFor(useLocale());
}

/** +1 in left-to-right, -1 in right-to-left: multiply an inline x offset by it. */
export function useInlineSign(): 1 | -1 {
  return useDirection() === "rtl" ? -1 : 1;
}
