import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/content/education";
import { type Locale } from "@/i18n/locales";
import { formatPeriod } from "@/lib/format-date";

type EducationSectionProps = {
  locale: Locale;
};

export async function EducationSection({ locale }: EducationSectionProps) {
  const tSections = await getTranslations({ locale, namespace: "Sections" });
  const tExperience = await getTranslations({ locale, namespace: "Experience" });

  return (
    <Section id="education" labelledBy="education-heading">
      <div className="flex flex-col gap-16 md:gap-24">
        <SectionHeading id="education-heading">{tSections("education")}</SectionHeading>
        <Reveal stagger>
          <ul className="grid gap-x-12 gap-y-14 md:grid-cols-2">
            {education.map((item) => (
              <li key={item.id} data-reveal-item className="flex flex-col gap-3">
                <p className="type-small font-semibold tabular-nums">
                  {formatPeriod(item.period, locale, tExperience("present"))}
                </p>
                {/* The school's name carries the weight; the degree reads beneath it. */}
                <h3 className="type-head">{item.school}</h3>
                <p className="type-lead">{item.degree[locale]}</p>
                <p className="type-small text-muted">
                  {item.note ? `${item.note[locale]} · ` : null}
                  {item.location[locale]}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
