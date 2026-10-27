import Link from "next/link";

import {
  boardLocales,
  directionCopy,
  directionIds,
  moodboardIndex,
  moodboardUi,
} from "@/content/moodboard";
import { boardHref } from "@/features/moodboard/guards";

export default function MoodboardIndexPage() {
  return (
    <main id="main" className="flex flex-1 flex-col gap-12 px-6 py-16 md:px-16 md:py-24">
      <div className="flex max-w-[60ch] flex-col gap-4">
        <h1 className="text-5xl font-semibold tracking-tight text-balance">
          {moodboardIndex.title}
        </h1>
        <p className="text-lg text-pretty">{moodboardIndex.intro}</p>
      </div>
      <section aria-labelledby="directions-heading" className="flex flex-col gap-6">
        <h2 id="directions-heading" className="text-2xl font-semibold">
          {moodboardIndex.directionsHeading}
        </h2>
        <ul className="flex flex-col gap-6">
          {directionIds.map((id) => (
            <li key={id} className="flex flex-col gap-2">
              <span className="text-xl font-medium">{directionCopy[id].en.name}</span>
              <span className="max-w-[60ch]">{directionCopy[id].en.idea}</span>
              <span className="flex gap-4">
                {boardLocales.map((locale) => (
                  <Link
                    key={locale}
                    href={boardHref(id, locale)}
                    hrefLang={locale}
                    className="inline-flex min-h-11 items-center underline underline-offset-4"
                  >
                    {moodboardUi.en.localeName[locale]}
                  </Link>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
