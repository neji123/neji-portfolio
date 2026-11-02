"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

import {
  HCAPTCHA_SITEKEY,
  type HCaptchaApi,
  isCaptchaRequired,
  loadHCaptcha,
} from "@/lib/hcaptcha";

/** Start loading while the form is still this far below the viewport. */
const NEAR_MARGIN = "800px 0px";

type Widget = { api: HCaptchaApi; id: string };

type HCaptcha = {
  /** Where the invisible widget lives (an empty element inside the form). */
  containerRef: RefObject<HTMLDivElement | null>;
  /**
   * Runs the check; resolves with the token, rejects if it fails or is closed. Resolves `null`
   * only on the local dev server, where hCaptcha is not loaded at all.
   */
  getToken: () => Promise<string | null>;
  reset: () => void;
};

/**
 * Invisible hCaptcha, loaded only when the form comes near the viewport (or on a submit before
 * that), in the page's language. `enabled` is false when the form cannot send anyway.
 */
export function useHCaptcha(locale: string, enabled: boolean): HCaptcha {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<Widget | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;
    if (!isCaptchaRequired()) {
      console.warn(
        "[contact] Local development: hCaptcha is not loaded; the form sends without a token.",
      );
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin: NEAR_MARGIN },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [enabled]);

  async function ensureWidget(): Promise<Widget> {
    if (widgetRef.current) return widgetRef.current;
    const api = await loadHCaptcha();
    const container = containerRef.current;
    if (!container) throw new Error("hcaptcha-no-container");
    widgetRef.current ??= {
      api,
      id: api.render(container, { sitekey: HCAPTCHA_SITEKEY, size: "invisible", hl: locale }),
    };
    return widgetRef.current;
  }

  // A new language renders a new widget, so the challenge speaks it.
  useEffect(() => {
    if (!near) return;
    // Rendering is best effort here; a submit retries and reports a failure.
    ensureWidget().catch(() => {});
    return () => {
      const widget = widgetRef.current;
      widgetRef.current = null;
      widget?.api.remove(widget.id);
    };
    // ensureWidget reads the current locale; re-rendering on locale is the point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near, locale]);

  async function getToken(): Promise<string | null> {
    if (!isCaptchaRequired()) return null;
    const widget = await ensureWidget();
    const { response } = await widget.api.execute(widget.id, { async: true });
    return response;
  }

  function reset() {
    const widget = widgetRef.current;
    if (widget) widget.api.reset(widget.id);
  }

  return { containerRef, getToken, reset };
}
