import { type MetadataRoute } from "next";

import { site } from "@/content/site";
import { locales } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(locales.map((code) => [code, `${site.url}/${code}`])),
    "x-default": `${site.url}/${routing.defaultLocale}`,
  };

  return locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}
