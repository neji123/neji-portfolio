import { type Locale } from "@/i18n/locales";
import { type LocalizedText } from "@/types/localized";

/** Resolves a value that is either shared by every locale (a brand name) or translated. */
export function localize(value: LocalizedText, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}
