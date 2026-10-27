import { boardLocales, directionIds } from "@/content/moodboard";
import { type BoardLocale, type DirectionId } from "@/types/moodboard";

export function isBoardLocale(value: string): value is BoardLocale {
  return (boardLocales as readonly string[]).includes(value);
}

export function isDirectionId(value: string): value is DirectionId {
  return (directionIds as readonly string[]).includes(value);
}

export function boardHref(direction: DirectionId, locale: BoardLocale): string {
  return `/moodboard/${direction}/${locale}`;
}

export function dirFor(locale: BoardLocale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
