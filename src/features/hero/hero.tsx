import { getTranslations } from "next-intl/server";

import { Magnetic } from "@/components/motion/magnetic";
import { WordReveal } from "@/components/motion/word-reveal";
import { GlobeFallback } from "@/components/three/globe-fallback";
import { ButtonLink } from "@/components/ui/button";
import { ArrowIcon, DownloadIcon } from "@/components/ui/icons";
import { contact } from "@/content/contact";
import { journeyCityLabels, journeyRoute, journeyStops } from "@/content/journey";
import { landDots } from "@/content/land-dots";
import { profile } from "@/content/profile";
import { type Locale } from "@/i18n/locales";

// Camera over the western Mediterranean: Montréal near the limb, Kuwait City well inside the disc.
const GLOBE_CENTER = { lat: 35, lon: 8 };
const GLOBE_LABEL_SIZE = 30;

type HeroProps = {
  locale: Locale;
};

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "Hero" });
  const tGlobe = await getTranslations({ locale, namespace: "Globe" });
  const person = profile[locale];

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-var(--header-height))] flex-col overflow-hidden"
    >
      <div className="relative z-10 flex max-w-[60rem] flex-col gap-6 px-gutter pt-10 md:pt-16">
        <WordReveal
          as="h1"
          id="hero-title"
          text={person.name}
          className="type-display text-balance"
        />
        {/* The long Arabic and French titles break onto two balanced lines instead of shrinking. */}
        <div className="rise-in flex flex-col gap-3 [animation-delay:380ms]">
          <p className="max-w-[34ch] type-lead font-medium text-balance">{person.title}</p>
          <p className="max-w-[min(46ch,34rem)] type-body">{person.tagline}</p>
          <p className="type-body text-muted">
            {person.location} · {person.availability}
          </p>
        </div>
        <div className="rise-in flex flex-wrap gap-3 pt-2 [animation-delay:520ms]">
          <Magnetic>
            <ButtonLink href="#projects" variant="primary" size="lg">
              {t("viewWork")}
              <ArrowIcon />
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink href={contact.cv} download size="lg">
              <DownloadIcon />
              {t("downloadCv")}
            </ButtonLink>
          </Magnetic>
        </div>
      </div>

      {/* Phone: the horizon rises under the copy. Desktop: the planet rises from the end edge. */}
      <div className="pointer-events-none relative mt-auto h-[clamp(15rem,64vw,22rem)] md:absolute md:inset-0 md:h-auto">
        <GlobeFallback
          dots={landDots}
          stops={journeyStops}
          route={journeyRoute}
          cityLabels={journeyCityLabels[locale]}
          center={GLOBE_CENTER}
          label={tGlobe("label")}
          labelSize={GLOBE_LABEL_SIZE}
          className="absolute start-1/2 top-0 w-[150vw] max-w-none -translate-x-1/2 -translate-y-[9.68%] md:start-[70%] md:top-[22%] md:w-[min(88vw,84rem)] rtl:translate-x-1/2 md:[&_text]:text-[17px]"
        />
      </div>
    </section>
  );
}
