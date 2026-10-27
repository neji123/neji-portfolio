import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "./locales";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const routing = defineRouting({
  locales,
  defaultLocale,
  // First visit: negotiated from Accept-Language. After that, the visitor's choice wins.
  localeDetection: true,
  localeCookie: { maxAge: ONE_YEAR_IN_SECONDS },
});
