import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TagList } from "@/components/ui/tag-list";
import { experiences } from "@/content/experience";
import { type Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { formatPeriod } from "@/lib/format-date";
import { localize } from "@/lib/localize";

import { RouteLine } from "./route-line";

type ExperienceSectionProps = {
  locale: Locale;
};

export async function ExperienceSection({ locale }: ExperienceSectionProps) {
  const tSections = await getTranslations({ locale, namespace: "Sections" });
  const t = await getTranslations({ locale, namespace: "Experience" });

  return (
    <Section id="experience" labelledBy="experience-heading" field="paper">
      <div className="flex flex-col gap-16 md:gap-24">
        <SectionHeading id="experience-heading">{tSections("experience")}</SectionHeading>
        <ol className="relative flex flex-col gap-16 ps-10 md:gap-24 md:ps-16">
          <RouteLine />
          {experiences.map((item) => {
            const current = item.period.end === null;
            return (
              <li key={item.id} data-stop={item.stop} className="relative">
                {/* The stop on the route; the current one keeps pulsing. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -start-10 top-2 ms-0.5 size-4 rounded-full bg-route md:-start-16",
                    current && "marker-pulse",
                  )}
                />
                <Reveal
                  from="start"
                  className="grid gap-x-12 gap-y-4 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
                >
                  {/* The same metadata band on every stop: years, place, then the role itself. */}
                  <div className="flex flex-col gap-1">
                    <p className="type-small font-semibold tabular-nums">
                      {formatPeriod(item.period, locale, t("present"))}
                    </p>
                    <p className="type-small text-muted">{localize(item.location, locale)}</p>
                    {current ? (
                      <p className="type-small font-semibold text-accent">{t("current")}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="type-head">{localize(item.company, locale)}</h3>
                      <p className="type-lead">{item.role[locale]}</p>
                    </div>
                    <p className="max-w-[60ch] type-body">{item.summary[locale]}</p>
                    <TagList items={item.stack} label={t("stack")} />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
