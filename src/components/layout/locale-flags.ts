import { FranceFlag } from "@/components/flags/france-flag";
import { TunisiaFlag } from "@/components/flags/tunisia-flag";
import { UnitedKingdomFlag } from "@/components/flags/united-kingdom-flag";
import { type Locale } from "@/i18n/locales";

export const localeFlags = {
  en: UnitedKingdomFlag,
  fr: FranceFlag,
  ar: TunisiaFlag,
} as const satisfies Record<Locale, unknown>;
