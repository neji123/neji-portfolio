import { getTranslations } from "next-intl/server";

import { GlobeBackdrop } from "@/components/three/globe-backdrop";
import { GlobeFallback } from "@/components/three/globe-fallback";
import { HERO_AIM } from "@/components/three/globe-scenes";
import { journeyCityLabels, journeyRoute, journeyStops } from "@/content/journey";
import { landDots } from "@/content/land-dots";
import { type Locale } from "@/i18n/locales";
import { globeStops } from "@/lib/journey-stops";

const GLOBE_LABEL_SIZE = 30;

type JourneyBackdropProps = {
  locale: Locale;
};

/**
 * The Journey Globe behind the whole page: one canvas for every section. The static globe
 * is server-rendered at the hero's placement and paints with the page; the 3D one takes
 * over once the page is idle.
 */
export async function JourneyBackdrop({ locale }: JourneyBackdropProps) {
  const tGlobe = await getTranslations({ locale, namespace: "Globe" });
  const tExperience = await getTranslations({ locale, namespace: "Experience" });

  return (
    <GlobeBackdrop
      stops={globeStops(locale, tExperience("present"))}
      route={journeyRoute}
      label={tGlobe("label")}
      hint={tGlobe("showRole")}
    >
      <GlobeFallback
        dots={landDots}
        stops={journeyStops}
        route={journeyRoute}
        cityLabels={journeyCityLabels[locale]}
        center={HERO_AIM}
        label={tGlobe("label")}
        labelSize={GLOBE_LABEL_SIZE}
        className="size-full"
      />
    </GlobeBackdrop>
  );
}
