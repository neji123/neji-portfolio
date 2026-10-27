import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { skillGroups } from "@/content/skills";
import { type Locale } from "@/i18n/locales";
import { localize } from "@/lib/localize";

import { SkillGroupIcon } from "./skill-group-icon";

type SkillsSectionProps = {
  locale: Locale;
};

/** A spec sheet, not a grid of identical cards: one row per layer of the stack. */
export async function SkillsSection({ locale }: SkillsSectionProps) {
  const tSections = await getTranslations({ locale, namespace: "Sections" });
  const t = await getTranslations({ locale, namespace: "Skills" });

  return (
    <Section id="skills" labelledBy="skills-heading" field="paper">
      <div className="flex flex-col gap-16 md:gap-24">
        <div className="flex flex-col gap-6">
          <SectionHeading id="skills-heading">{tSections("skills")}</SectionHeading>
          <p className="max-w-[48ch] type-lead">{t("intro")}</p>
        </div>
        <Reveal stagger>
          <ul className="flex flex-col gap-12 md:gap-14">
            {skillGroups.map((group) => (
              <li
                key={group.id}
                data-reveal-item
                className="grid gap-x-12 gap-y-4 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
              >
                <h3 className="flex items-center gap-3 type-lead font-semibold">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-surface">
                    <SkillGroupIcon group={group.id} className="size-5" />
                  </span>
                  {group.name[locale]}
                </h3>
                <ul className="flex flex-wrap gap-x-7 gap-y-2 type-lead">
                  {group.items.map((item) => {
                    const label = localize(item, locale);
                    return <li key={label}>{label}</li>;
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
