import { landDots } from "@/content/land-dots";
import { journeyRoute, journeyStops } from "@/content/journey";
import { directionCopy, moodboardUi, siteCopy } from "@/content/moodboard";
import { cn } from "@/lib/cn";
import { type BoardLocale, type BoardStop, type SiteCopy } from "@/types/moodboard";

import { DirectionNotes } from "./direction-notes";
import { GlobeSketch } from "./globe-sketch";
import { dirFor } from "./guards";
import { MoodboardBar } from "./moodboard-bar";
import { Portrait } from "./portrait";
import { SiteHeaderPreview } from "./site-header-preview";
import { SwatchList } from "./swatch-list";
import { SwitcherSpecimen } from "./switcher-specimen";
import { TypeSpecimen } from "./type-specimen";

// The route map behind the board: centred between Montréal and Kuwait City.
const MAP_GLOBE_CENTER = { lat: 34, lon: -12 };
const CV_HREF = "/cv/CV_Mohamed_Neji_Benzarti.pdf";

const primaryButton =
  "inline-flex min-h-12 items-center bg-(--mb-accent) px-6 font-medium text-(--mb-accent-ink)";
const secondaryButton =
  "inline-flex min-h-12 items-center bg-(--mb-surface) px-6 font-medium text-(--mb-ink)";

type DeparturesBoardProps = {
  locale: BoardLocale;
};

type BoardRowsProps = {
  stops: readonly BoardStop[];
  columns: SiteCopy["columns"];
};

/** The departures board: real stops as rows, separated by tone, never by rules. */
function BoardRows({ stops, columns }: BoardRowsProps) {
  return (
    <table className="mb-step-small w-full border-collapse text-start">
      <thead className="text-(--mb-muted)">
        <tr>
          <th scope="col" className="py-2 pe-4 text-start font-normal">
            {columns.code}
          </th>
          <th scope="col" className="py-2 pe-4 text-start font-normal">
            {columns.destination}
          </th>
          <th scope="col" className="hidden py-2 pe-4 text-start font-normal md:table-cell">
            {columns.company}
          </th>
          <th scope="col" className="py-2 pe-4 text-start font-normal">
            {columns.dates}
          </th>
          <th scope="col" className="hidden py-2 text-start font-normal sm:table-cell">
            {columns.status}
          </th>
        </tr>
      </thead>
      <tbody>
        {stops.map((stop, index) => (
          <tr key={stop.id} className={cn(index % 2 === 0 && "bg-(--mb-surface)")}>
            <td className="mb-step-lead mb-tabular py-3 ps-3 pe-4 align-top font-semibold text-(--mb-accent)">
              {stop.code}
            </td>
            <td className="py-3 pe-4 align-top">
              <span className="mb-step-body block font-medium">{stop.place}</span>
              <span className="block text-(--mb-muted) md:hidden">{stop.company}</span>
            </td>
            <td className="hidden py-3 pe-4 align-top md:table-cell">
              <span className="mb-step-body block">{stop.company}</span>
              <span className="block text-(--mb-muted)">{stop.role}</span>
            </td>
            <td className="mb-tabular py-3 pe-4 align-top">{stop.dates}</td>
            <td className="hidden py-3 pe-3 align-top sm:table-cell">
              {stop.current ? (
                <span className="inline-block bg-(--mb-accent) px-2 py-0.5 font-semibold text-(--mb-accent-ink)">
                  {columns.now}
                </span>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DeparturesBoard({ locale }: DeparturesBoardProps) {
  const ui = moodboardUi[locale];
  const site = siteCopy[locale];
  const copy = directionCopy.departures[locale];

  return (
    <div className="mb-root mb-departures mb-field min-h-svh" lang={locale} dir={dirFor(locale)}>
      <MoodboardBar direction="departures" locale={locale} ui={ui} />
      <main id="main">
        <section aria-labelledby="hero-name" className="flex min-h-[calc(100svh-3.75rem)] flex-col">
          <SiteHeaderPreview
            name={site.hero.name}
            nav={site.nav}
            label={ui.siteNavLabel}
            buttonClassName="inline-flex min-h-11 items-center bg-(--mb-ink) px-5 font-medium text-(--mb-accent-ink)"
          />
          <div className="mb-field mb-field-sign relative isolate flex flex-1 overflow-hidden">
            {/* The portrait stands behind the board: its cut edge meets the first row. */}
            <div className="grid flex-1 content-start gap-x-10 px-6 pt-10 md:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] md:px-10 md:pt-12">
              <div className="flex flex-col gap-10 pb-10 md:pb-12">
                <div className="flex flex-col gap-6">
                  <h1 id="hero-name" className="mb-display text-(--mb-accent)">
                    {site.hero.name}
                  </h1>
                  <div className="flex flex-col gap-3">
                    <p className="mb-step-lead font-medium">{site.hero.title}</p>
                    <p className="mb-step-body max-w-[46ch]">{site.hero.tagline}</p>
                    <p className="mb-step-body text-(--mb-muted)">{site.hero.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href="#route-map" className={`mb-button ${primaryButton}`}>
                      {site.hero.primaryCta}
                    </a>
                    <a href={CV_HREF} download className={`mb-button ${secondaryButton}`}>
                      {site.hero.secondaryCta}
                    </a>
                  </div>
                </div>
              </div>
              <Portrait
                alt={site.hero.portraitAlt}
                sizes="(min-width: 768px) 30vw, 70vw"
                priority
                className="h-[clamp(20rem,80vw,26rem)] self-end justify-self-center md:h-[clamp(24rem,34vw,32rem)] md:justify-self-end"
              />
              <div className="pb-12 md:col-span-2">
                <BoardRows stops={site.stops} columns={site.columns} />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="direction-name">
          <div className="flex flex-col gap-24 px-6 py-24 md:px-10 md:py-36">
            <header className="flex max-w-[64rem] flex-col gap-6">
              <h2 id="direction-name" className="mb-display">
                {copy.name}
              </h2>
              <p className="mb-step-lead">{copy.thesis}</p>
              <p className="mb-step-lead font-semibold">{copy.idea}</p>
            </header>

            <DirectionNotes copy={copy} ui={ui} />

            <figure
              id="route-map"
              className="mb-field mb-field-sign grid items-center gap-10 p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:p-12"
            >
              <figcaption className="flex flex-col gap-4">
                <span className="mb-step-head">{ui.sections.liveThing}</span>
                <span className="mb-step-body max-w-[46ch]">{copy.liveThing}</span>
              </figcaption>
              <GlobeSketch
                dots={landDots}
                stops={journeyStops}
                route={journeyRoute}
                cityLabels={site.cities}
                center={MAP_GLOBE_CENTER}
                label={site.globeLabel}
                labelSize={28}
                className="mx-auto w-full max-w-[36rem]"
              />
            </figure>

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
                  <a href="#route-map" className={`mb-button ${primaryButton}`}>
                    {site.hero.primaryCta}
                  </a>
                  <a href={CV_HREF} download className={`mb-button ${secondaryButton}`}>
                    {site.hero.secondaryCta}
                  </a>
                </div>
                <SwitcherSpecimen ui={ui} currentCode={locale.toUpperCase()} />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
