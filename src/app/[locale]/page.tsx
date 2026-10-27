import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { AboutSection } from "@/features/about/about-section";
import { CertificationsSection } from "@/features/certifications/certifications-section";
import { ContactSection } from "@/features/contact/contact-section";
import { EducationSection } from "@/features/education/education-section";
import { ExperienceSection } from "@/features/experience/experience-section";
import { Hero } from "@/features/hero/hero";
import { LanguagesSection } from "@/features/languages/languages-section";
import { ProjectsSection } from "@/features/projects/projects-section";
import { SkillsSection } from "@/features/skills/skills-section";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Fields alternate night / chart paper like chapters; Languages continues the Certifications paper.
  return (
    <main id="main">
      <Hero locale={locale} />
      <AboutSection locale={locale} />
      <ExperienceSection locale={locale} />
      <ProjectsSection locale={locale} />
      <SkillsSection locale={locale} />
      <EducationSection locale={locale} />
      <CertificationsSection locale={locale} />
      <LanguagesSection locale={locale} />
      <ContactSection locale={locale} />
    </main>
  );
}
