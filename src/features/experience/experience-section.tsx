import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { GLOBE_DISC_FRACTION, GlobeFallback } from "@/components/three/globe-fallback";
import { GlobeStage } from "@/components/three/globe-stage";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TagList } from "@/components/ui/tag-list";
import { experiences } from "@/content/experience";
import { journeyCityLabels, journeyRoute, journeyStops } from "@/content/journey";
import { landDots } from "@/content/land-dots";
import { type Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { formatPeriod } from "@/lib/format-date";
import { globeStops, JOURNEY_PANEL_ID, JOURNEY_ROUTE_ID, roleAnchorId } from "@/lib/journey-stops";
import { localize } from "@/lib/localize";
import { type GlobeView } from "@/types/journey";

import { RouteLine } from "./route-line";

// The overview between Montréal and Kuwait City: the whole route in one view.
const JOURNEY_VIEW: GlobeView = { center: { lat: 40, lon: -13 }, disc: GLOBE_DISC_FRACTION };
const JOURNEY_LABEL_SIZE = 34;

type ExperienceSectionProps = {
  locale: Locale;
};

export async function ExperienceSection({ locale }: ExperienceSectionProps) {
  const tSections = await getTranslations({ locale, namespace: "Sections" });
  const t = await getTranslations({ locale, namespace: "Experience" });
  const tGlobe = await getTranslations({ locale, namespace: "Globe" });

  return (
    <Section id="experience" labelledBy="experience-heading" field="paper">
      <div className="flex flex-col gap-16 md:gap-24">
        <SectionHeading id="experience-heading">{tSections("experience")}</SectionHeading>
        {/* Phone: the globe window sticks above the roles. Wide: it rides beside them. */}
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-16">
          <ol
            id={JOURNEY_ROUTE_ID}
            className="relative flex flex-col gap-16 ps-10 md:gap-24 md:ps-16"
          >
            <RouteLine />
            {experiences.map((item) => {
              const current = item.period.end === null;
              return (
                <li
                  key={item.id}
                  id={roleAnchorId(item.id)}
                  tabIndex={-1}
                  data-stop={item.stop}
                  className="group relative outline-offset-8"
                >
                  {/* The stop on the route; the current one keeps pulsing, the one the globe shows grows. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -start-10 top-2 ms-0.5 size-4 rounded-full bg-route transition-transform duration-(--duration-medium) ease-(--ease-smooth-out) group-data-active:scale-150 md:-start-16",
                      current && "marker-pulse",
                    )}
                  />
                  <Reveal
                    from="start"
                    className="grid gap-x-12 gap-y-4 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
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
          {/* A night window onto the route: the camera flies to the city of the role being read. */}
          <div
            id={JOURNEY_PANEL_ID}
            className="field-night sticky top-header z-10 order-first -mx-gutter h-[min(32svh,17rem)] overflow-hidden bg-ground lg:top-[calc(var(--header-height)+1rem)] lg:order-none lg:mx-0 lg:h-[min(calc(100svh-var(--header-height)-4rem),44rem)]"
          >
            <GlobeStage
              key={locale}
              mode="journey"
              stops={globeStops(locale, t("present"))}
              route={journeyRoute}
              view={JOURNEY_VIEW}
              label={tGlobe("journeyLabel")}
              hint={tGlobe("showRole")}
              trackId={JOURNEY_ROUTE_ID}
              className="size-full"
            >
              <GlobeFallback
                dots={landDots}
                stops={journeyStops}
                route={journeyRoute}
                cityLabels={journeyCityLabels[locale]}
                center={JOURNEY_VIEW.center}
                label={tGlobe("journeyLabel")}
                labelSize={JOURNEY_LABEL_SIZE}
                className="size-full"
              />
            </GlobeStage>
          </div>
        </div>
      </div>
    </Section>
  );
}
