"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { INTRO_GATE_SCRIPT } from "@/lib/intro-gate";
import { DURATION } from "@/lib/motion";

const MS_PER_SECOND = 1000;
/** If the new language takes too long, the page comes back rather than staying hidden. */
const SWITCH_TIMEOUT_MS = 3000;

let pendingSwitch = false;
let switchTimer: number | undefined;
let shownLocale: string | null = null;
let hydrated = false;

function root(): DOMStringMap {
  return document.documentElement.dataset;
}

function clearSwitchLater(delay: number) {
  window.clearTimeout(switchTimer);
  switchTimer = window.setTimeout(() => {
    pendingSwitch = false;
    delete root().localeSwitch;
  }, delay);
}

/** The language switcher calls this, then navigates once the page has stepped back. */
export function beginLocaleSwitch(): number {
  pendingSwitch = true;
  root().localeSwitch = "out";
  clearSwitchLater(SWITCH_TIMEOUT_MS);
  return DURATION.fast * MS_PER_SECOND;
}

/**
 * The intro gate script, in the server HTML so it runs before the first paint. Only the
 * server render and hydration include it: a page rendered later on the client (after a
 * language switch) needs no gate, and React would refuse to create a script element.
 */
export function IntroGate() {
  useEffect(() => {
    hydrated = true;
  }, []);
  if (hydrated) return null;
  return <script dangerouslySetInnerHTML={{ __html: INTRO_GATE_SCRIPT }} />;
}

/**
 * Mounted by the layout. When a new language arrives it plays the page in from the reading
 * end, and it keeps the intro from replaying: a language switch is not a new visit.
 */
export function MotionGate() {
  const locale = useLocale();

  useIsomorphicLayoutEffect(() => {
    const data = root();
    if (shownLocale !== null && shownLocale !== locale) data.intro = "seen";
    shownLocale = locale;
    if (!pendingSwitch) return;
    pendingSwitch = false;
    data.localeSwitch = "in";
    clearSwitchLater(DURATION.medium * MS_PER_SECOND);
  }, [locale]);

  return null;
}
