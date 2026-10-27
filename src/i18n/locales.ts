// Pure locale facts, importable from content and server code without pulling in next-intl.
export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export type Direction = "ltr" | "rtl";

export type LocaleMeta = {
  /** Visible code in the language switcher. */
  code: string;
  /** Accessible name, always in the language itself. */
  nativeName: string;
  dir: Direction;
  /** BCP 47 tag for Intl formatting; Latin digits everywhere for consistent figures and dates. */
  intl: string;
  openGraph: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { code: "EN", nativeName: "English", dir: "ltr", intl: "en-GB", openGraph: "en_US" },
  fr: { code: "FR", nativeName: "Français", dir: "ltr", intl: "fr-FR", openGraph: "fr_FR" },
  ar: {
    code: "AR",
    nativeName: "العربية",
    dir: "rtl",
    intl: "ar-KW-u-nu-latn",
    openGraph: "ar_KW",
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function directionFor(locale: Locale): Direction {
  return localeMeta[locale].dir;
}
