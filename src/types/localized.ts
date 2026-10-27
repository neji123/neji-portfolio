import { type Locale } from "@/i18n/locales";

/** A value given once per locale; a missing locale is a type error. */
export type Localized<T> = Record<Locale, T>;

/** Brand, product and technology names stay a plain string in every locale. */
export type LocalizedText = string | Localized<string>;

/** "YYYY" or "YYYY-MM". */
export type IsoMonth = `${number}` | `${number}-${number}`;

export type Period = {
  start: IsoMonth;
  /** `null` means "to the present". */
  end: IsoMonth | null;
};

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
};
