import { journeyRoute, journeyStops } from "@/content/journey";
import { landDots } from "@/content/land-dots";
import { directionCopy, moodboardUi, siteCopy } from "@/content/moodboard";
import { type BoardLocale } from "@/types/moodboard";

import { DirectionNotes } from "./direction-notes";
import { GlobeSketch } from "./globe-sketch";
import { dirFor } from "./guards";
import { MoodboardBar } from "./moodboard-bar";
import { Portrait } from "./portrait";
import { SiteHeaderPreview } from "./site-header-preview";
import { SwatchList } from "./swatch-list";
import { SwitcherSpecimen } from "./switcher-specimen";
import { TypeSpecimen } from "./type-specimen";

// Camera over the western Mediterranean: Montréal near the limb, Kuwait City well inside the disc.
const HERO_GLOBE_CENTER = { lat: 35, lon: 8 };
const CV_HREF = "/cv/CV_Mohamed_Neji_Benzarti.pdf";

const primaryButton =
  "inline-flex min-h-12 items-center rounded-full bg-(--mb-accent) px-6 font-medium text-(--mb-accent-ink)";
const secondaryButton =
  "inline-flex min-h-12 items-center rounded-full bg-(--mb-surface) px-6 font-medium text-(--mb-ink)";

type NightRouteBoardProps = {
  locale: BoardLocale;
};

export function NightRouteBoard({ locale }: NightRouteBoardProps) {
  const ui = moodboardUi[locale];
  const site = siteCopy[locale];
  const copy = directionCopy["night-route"][locale];
  const currentStop = site.stops.find((stop) => stop.current);

  return (
    <div className="mb-root mb-night-route mb-field min-h-svh" lang={locale} dir={dirFor(locale)}>
      <MoodboardBar direction="night-route" locale={locale} ui={ui} />
      <main id="main">
        <section
          aria-labelledby="hero-name"
          className="relative isolate flex min-h-[max(calc(100svh-3.75rem),46rem)] flex-col overflow-hidden"
        >
          <SiteHeaderPreview
            name={site.hero.name}
            nav={site.nav}
            label={ui.siteNavLabel}
            buttonClassName="inline-flex min-h-11 items-center rounded-full bg-(--mb-surface) px-5 font-medium"
          />
          <div className="relative z-10 flex max-w-[58rem] flex-col gap-6 px-6 pt-8 md:px-10 md:pt-14">
            <h1 id="hero-name" className="mb-display">
              {site.hero.name}
            </h1>
            <div className="flex flex-col gap-3">
              <p className="mb-step-lead font-medium">{site.hero.title}</p>
              <p className="mb-step-body max-w-[min(46ch,34rem)]">{site.hero.tagline}</p>
              <p className="mb-step-body text-(--mb-muted)">{site.hero.location}</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#stop" className={`mb-button ${primaryButton}`}>
                {site.hero.primaryCta}
              </a>
              <a href={CV_HREF} download className={`mb-button ${secondaryButton}`}>
                {site.hero.secondaryCta}
              </a>
            </div>
          </div>
          {/* Phone: the horizon rises under the copy. Desktop: the planet rises from the end edge. */}
          <div className="relative mt-auto h-[clamp(15rem,64vw,22rem)] md:absolute md:inset-0 md:h-auto">
            <GlobeSketch
              dots={landDots}
              stops={journeyStops}
              route={journeyRoute}
              cityLabels={site.cities}
              center={HERO_GLOBE_CENTER}
              label={site.globeLabel}
              labelSize={30}
              className="absolute start-1/2 top-0 w-[150vw] max-w-none -translate-x-1/2 -translate-y-[9.68%] md:start-[70%] md:top-[22%] md:w-[min(88vw,84rem)] rtl:translate-x-1/2 md:[&_text]:text-[17px]"
            />
          </div>
        </section>

        <section
          aria-labelledby="about-heading"
          className="grid items-end gap-x-12 overflow-x-clip px-6 pt-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:px-10 md:pt-36"
        >
          <Portrait
            alt={site.hero.portraitAlt}
            sizes="(min-width: 768px) 36vw, 80vw"
            className="order-2 h-[clamp(24rem,62vw,40rem)] justify-self-center md:order-1"
          />
          <div className="order-1 flex flex-col gap-8 pb-16 md:order-2 md:pb-28">
            <h2 id="about-heading" className="mb-step-head">
              {site.about.heading}
            </h2>
            <div className="flex max-w-[62ch] flex-col gap-5">
              {site.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-step-body">
                  {paragraph}
                </p>
              ))}
            </div>
            <ul className="flex flex-wrap gap-x-10 gap-y-3">
              {site.about.figures.map((figure) => (
                <li key={figure} className="mb-step-lead mb-tabular font-semibold">
                  {figure}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="direction-name" className="mb-field mb-field-paper">
          <div className="flex flex-col gap-24 px-6 py-24 md:px-10 md:py-36">
            <header className="flex max-w-[64rem] flex-col gap-6">
              <h2 id="direction-name" className="mb-display">
                {copy.name}
              </h2>
              <p className="mb-step-lead">{copy.thesis}</p>
              <p className="mb-step-lead font-semibold text-(--mb-accent)">{copy.idea}</p>
            </header>

            <DirectionNotes copy={copy} ui={ui} />

            <section aria-labelledby="palette-heading" className="flex flex-col gap-8">
              <h3 id="palette-heading" className="mb-step-head">
                {ui.sections.palette}
              </h3>
              <SwatchList swatches={copy.swatches} />
            </section>

            <section aria-labelledby="type-heading" className="flex flex-col gap-10">
              <h3 id="type-heading" className="mb-step-head">
                {ui.sections.type}
              </h3>
              <div className="grid gap-16 md:grid-cols-2">
                <TypeSpecimen
                  lang="en"
                  dir="ltr"
                  faceLabel={copy.typeLatin}
                  display={moodboardUi.en.specimenDisplay}
                  text={moodboardUi.en.specimenText}
                />
                <TypeSpecimen
                  lang="ar"
                  dir="rtl"
                  faceLabel={copy.typeArabic}
                  display={moodboardUi.ar.specimenDisplay}
                  text={moodboardUi.ar.specimenText}
                />
              </div>
              <p className="mb-step-body max-w-[60ch] text-(--mb-muted)">{copy.typeNote}</p>
            </section>

            <section aria-labelledby="interface-heading" className="flex flex-col gap-8">
              <h3 id="interface-heading" className="mb-step-head">
                {ui.sections.interface}
              </h3>
              <div className="flex flex-wrap items-start gap-x-16 gap-y-8">
                <div className="flex flex-wrap gap-3">
                  <a href="#stop" className={`mb-button ${primaryButton}`}>
                    {site.hero.primaryCta}
                  </a>
                  <a href={CV_HREF} download className={`mb-button ${secondaryButton}`}>
                    {site.hero.secondaryCta}
                  </a>
                </div>
                <SwitcherSpecimen ui={ui} currentCode={locale.toUpperCase()} />
              </div>
            </section>

            {currentStop ? (
              <section id="stop" aria-labelledby="stop-heading" className="flex flex-col gap-8">
                <h3 id="stop-heading" className="mb-step-head">
                  {ui.sections.stop}
                </h3>
                <article className="flex flex-col gap-6 bg-(--mb-surface) p-6 md:p-10">
                  <dl className="mb-step-small grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
                    {[
                      [site.columns.destination, currentStop.place],
                      [site.columns.company, currentStop.company],
                      [site.columns.dates, currentStop.dates],
                      [site.columns.role, currentStop.role],
                    ].map(([term, value]) => (
                      <div key={term} className="flex flex-col gap-1">
                        <dt className="text-(--mb-muted)">{term}</dt>
                        <dd className="mb-step-body mb-tabular font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mb-step-lead max-w-[56ch]">{currentStop.summary}</p>
                </article>
              </section>
            ) : null}

            <section aria-labelledby="raises-heading" className="flex flex-col gap-8">
              <h3 id="raises-heading" className="mb-step-head">
                {ui.sections.raises}
              </h3>
              <ul className="grid gap-x-12 gap-y-6 md:grid-cols-2">
                {copy.raises.map((raise) => (
                  <li key={raise} className="mb-step-body max-w-[60ch]">
                    {raise}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
