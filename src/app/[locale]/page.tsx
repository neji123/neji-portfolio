import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { sectionIds } from "@/content/site";
import { SectionStub } from "@/features/section-stub";
import { Hero } from "@/features/hero/hero";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <main id="main">
      <Hero locale={locale} />
      {sectionIds.map((id) => (
        <SectionStub key={id} id={id} locale={locale} />
      ))}
    </main>
  );
}
