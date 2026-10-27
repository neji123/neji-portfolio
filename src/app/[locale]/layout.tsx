import { type Metadata, type Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { profile } from "@/content/profile";
import { site, siteDescription } from "@/content/site";
import { directionFor, type Locale, localeMeta, locales } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { alexandria, archivo } from "@/lib/fonts";
import { personJsonLd, serializeJsonLd } from "@/lib/json-ld";

import "@/styles/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0c1a2c",
  colorScheme: "dark",
};

const languageAlternates = {
  ...Object.fromEntries(locales.map((code) => [code, `/${code}`])),
  "x-default": `/${routing.defaultLocale}`,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const person = profile[locale];
  const title = `${person.name} · ${person.title}`;
  const description = siteDescription[locale];

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: { canonical: `/${locale}`, languages: languageAlternates },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `/${locale}`,
      siteName: person.name,
      locale: localeMeta[locale].openGraph,
      alternateLocale: locales
        .filter((code) => code !== locale)
        .map((code) => localeMeta[code].openGraph),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: "SkipLink" });

  return (
    <html
      lang={typedLocale}
      dir={directionFor(typedLocale)}
      className={`${archivo.variable} ${alexandria.variable}`}
    >
      <body className="min-h-svh">
        <NextIntlClientProvider>
          <SmoothScroll>
            <SkipLink label={t("label")} />
            <Header locale={typedLocale} />
            {children}
            <Footer locale={typedLocale} />
          </SmoothScroll>
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd(typedLocale)) }}
        />
      </body>
    </html>
  );
}
