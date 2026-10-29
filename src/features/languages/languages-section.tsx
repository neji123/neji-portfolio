import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { spokenLanguages } from "@/content/education";
import { type Locale } from "@/i18n/locales";

type LanguagesSectionProps = {
  locale: Locale;
};

/** A short band: three languages, the same three the site speaks. */
export async function LanguagesSection({ locale }: LanguagesSectionProps) {
  const tSections = await getTranslations({ locale, namespace: "Sections" });

  return (
    <Section
      id="languages"
      labelledBy="languages-heading"
      scene="certifications"
      className="pt-0 md:pt-0"
    >
      <div className="grid items-baseline gap-x-12 gap-y-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <SectionHeading id="languages-heading" size="head">
          {tSections("languages")}
        </SectionHeading>
        <Reveal stagger>
          <ul className="flex flex-col gap-3 type-head">
            {spokenLanguages.map((language) => (
              <li key={language.id} data-reveal-item>
                {language.label[locale]}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
