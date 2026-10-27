/**
 * Compile-time guard: every locale must have exactly the key shape of `en.json`.
 * A missing or extra key turns one of the constants below into a type error,
 * which fails `npm run typecheck` and `next build`.
 */
import type ar from "../../messages/ar.json";
import type en from "../../messages/en.json";
import type fr from "../../messages/fr.json";

type Shape<T> = T extends string ? string : { [K in keyof T]: Shape<T[K]> };

type SameShape<A, B> = [Shape<A>] extends [Shape<B>]
  ? [Shape<B>] extends [Shape<A>]
    ? true
    : "extra keys compared with en.json"
  : "missing or mistyped keys compared with en.json";

export const frMatchesEn: SameShape<typeof fr, typeof en> = true;
export const arMatchesEn: SameShape<typeof ar, typeof en> = true;
