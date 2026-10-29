import { getTranslations } from "next-intl/server";

import { Magnetic } from "@/components/motion/magnetic";
import { WordReveal } from "@/components/motion/word-reveal";
import { GLOBE_AVOID_ATTRIBUTE, GLOBE_SCENE_ATTRIBUTE } from "@/components/three/globe-scenes";
import { ButtonLink } from "@/components/ui/button";
import { ArrowIcon, DownloadIcon } from "@/components/ui/icons";
import { contact } from "@/content/contact";
import { profile } from "@/content/profile";
import { type Locale } from "@/i18n/locales";

type HeroProps = {
  locale: Locale;
};

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "Hero" });
  const person = profile[locale];
  // The globe's city labels step aside from the name, the title and the actions.
  const avoid = { [GLOBE_AVOID_ATTRIBUTE]: "" };

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      {...{ [GLOBE_SCENE_ATTRIBUTE]: "hero" }}
      className="relative z-10 flex min-h-[calc(100svh-var(--header-height))] flex-col"
    >
      <div className="flex max-w-[60rem] flex-col gap-6 px-gutter pt-10 md:pt-16">
        <WordReveal
          as="h1"
          id="hero-title"
          text={person.name}
          avoidGlobe
          className="w-fit type-display text-balance"
        />
        {/* The long Arabic and French titles break onto two balanced lines instead of shrinking. */}
        <div className="rise-in flex flex-col gap-3 [animation-delay:380ms]">
          <p {...avoid} className="w-fit max-w-[34ch] type-lead font-medium text-balance">
            {person.title}
          </p>
          <p {...avoid} className="w-fit max-w-[min(46ch,34rem)] type-body">
            {person.tagline}
          </p>
          <p {...avoid} className="w-fit type-body text-muted">
            {person.location} · {person.availability}
          </p>
        </div>
        <div {...avoid} className="rise-in flex w-fit flex-wrap gap-3 pt-2 [animation-delay:520ms]">
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

      {/* Phone: room under the copy for the page's globe, which rises here as a horizon. */}
      <div aria-hidden="true" className="mt-auto h-[clamp(15rem,64vw,22rem)] md:hidden" />
    </section>
  );
}
