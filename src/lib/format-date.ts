import { type Locale, localeMeta } from "@/i18n/locales";
import { type IsoMonth, type Period } from "@/types/localized";

const EN_DASH = "–";

function toDate(value: IsoMonth): { date: Date; hasMonth: boolean } {
  const [year, month] = value.split("-").map(Number);
  // UTC noon avoids a time zone ever moving the month.
  return {
    date: new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, 1, 12)),
    hasMonth: month !== undefined,
  };
}

export function formatMonth(value: IsoMonth, locale: Locale): string {
  const { date, hasMonth } = toDate(value);
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    year: "numeric",
    ...(hasMonth ? { month: "short" } : {}),
    timeZone: "UTC",
  }).format(date);
}

/** "Jun 2026 – Present", "2020 – 2025", or a single "2026" when start and end match. */
export function formatPeriod(period: Period, locale: Locale, presentLabel: string): string {
  const start = formatMonth(period.start, locale);
  if (period.end === period.start) return start;
  const end = period.end === null ? presentLabel : formatMonth(period.end, locale);
  return `${start} ${EN_DASH} ${end}`;
}
