import Link from "next/link";

import { TunisiaFlag } from "@/components/flags/tunisia-flag";
import { UnitedKingdomFlag } from "@/components/flags/united-kingdom-flag";
import { boardLocales, directionCopy, directionIds } from "@/content/moodboard";
import { type BoardLocale, type DirectionId, type MoodboardUi } from "@/types/moodboard";

import { boardHref } from "./guards";

const localeFlags = { en: UnitedKingdomFlag, ar: TunisiaFlag } as const;

const pillLinkClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-3 md:px-4 aria-[current=page]:bg-(--mb-ink) aria-[current=page]:text-(--mb-ground)";

type MoodboardBarProps = {
  direction: DirectionId;
  locale: BoardLocale;
  ui: MoodboardUi;
};

export function MoodboardBar({ direction, locale, ui }: MoodboardBarProps) {
  return (
    <div className="mb-step-small flex items-center justify-between gap-x-8 bg-(--mb-surface) px-4 py-2 md:px-10">
      <p className="hidden font-medium lg:block">{ui.boardLabel}</p>
      <div className="flex flex-1 items-center justify-between gap-x-2 lg:flex-none lg:gap-x-6">
        <nav aria-label={ui.directionsNavLabel}>
          <ul className="flex gap-1">
            {directionIds.map((id) => (
              <li key={id}>
                <Link
                  href={boardHref(id, locale)}
                  aria-current={id === direction ? "page" : undefined}
                  className={pillLinkClass}
                >
                  {directionCopy[id][locale].name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={ui.languageNavLabel}>
          <ul className="flex gap-1">
            {boardLocales.map((code) => {
              const Flag = localeFlags[code];
              const option = ui.languages.find((item) => item.code.toLowerCase() === code);
              return (
                <li key={code}>
                  <Link
                    href={boardHref(direction, code)}
                    hrefLang={code}
                    aria-label={option?.ariaLabel}
                    aria-current={code === locale ? "page" : undefined}
                    className={pillLinkClass}
                  >
                    <Flag className="h-3.5 w-auto rounded-[2px]" />
                    <span>{option?.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
