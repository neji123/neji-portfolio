import { getTranslations } from "next-intl/server";

import { CountUp } from "@/components/motion/count-up";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Portrait } from "@/components/ui/portrait";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/content/profile";
import { type Locale } from "@/i18n/locales";
import { type KeyFigure } from "@/types/profile";

const PORTRAIT_DRIFT = 0.05;

function FigureText({ figure }: { figure: KeyFigure }) {
  if (figure.kind === "text") return <>{figure.label}</>;
  return (
    <>
      {figure.before ? `${figure.before} ` : null}
      <CountUp value={figure.value} />
      {figure.after}
      {` ${figure.label}`}
    </>
  );
}

type AboutSectionProps = {
  locale: Locale;
};

export async function AboutSection({ locale }: AboutSectionProps) {
  const tSections = await getTranslations({ locale, namespace: "Sections" });
  const tAbout = await getTranslations({ locale, namespace: "About" });
  const tHero = await getTranslations({ locale, namespace: "Hero" });
  const person = profile[locale];

  return (
    <Section id="about" labelledBy="about-heading" className="overflow-x-clip pb-0">
      <div className="grid items-end gap-x-12 gap-y-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Parallax speed={PORTRAIT_DRIFT} className="order-2 justify-self-center md:order-1">
          <Portrait
            alt={tHero("portraitAlt", { name: person.name })}
            sizes="(min-width: 768px) 36vw, 80vw"
            className="h-[clamp(24rem,62vw,40rem)]"
          />
        </Parallax>
        <div className="order-1 flex flex-col gap-10 md:order-2 md:pb-28">
          <SectionHeading id="about-heading">{tSections("about")}</SectionHeading>
          <Reveal stagger className="flex max-w-[62ch] flex-col gap-5">
            {person.about.map((paragraph) => (
              <p key={paragraph} data-reveal-item className="type-body">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal stagger>
            <ul aria-label={tAbout("figuresLabel")} className="flex flex-wrap gap-x-10 gap-y-3">
              {person.figures.map((figure) => (
                <li key={figure.label} data-reveal-item className="type-lead font-semibold">
                  <FigureText figure={figure} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
