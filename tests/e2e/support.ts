import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test as base } from "@playwright/test";

import ar from "../../messages/ar.json";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

export const LOCALES = ["en", "fr", "ar"] as const;
export type TestLocale = (typeof LOCALES)[number];

export const messages: Record<TestLocale, typeof en> = { en, fr, ar };

/** The rules the site promises: WCAG 2.2 AA, plus axe's best practices. */
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

/** Third-party origins a test must never reach for real: mail delivery and WhatsApp. */
const BLOCKED = /^https:\/\/(api\.web3forms\.com|wa\.me)\//;
const HCAPTCHA = /^https:\/\/([a-z0-9-]+\.)?hcaptcha\.com\//;

/**
 * A stand-in for hCaptcha's api.js: the same calls, no network. `execute` resolves a fixed
 * token, so a test can check that the form sends it.
 */
export const FAKE_CAPTCHA_TOKEN = "test-captcha-token";
const FAKE_HCAPTCHA_SCRIPT = `
(() => {
  const widgets = [];
  window.__hcaptchaCalls = { render: 0, execute: 0, reset: 0, remove: 0, hl: [] };
  window.hcaptcha = {
    render(container, params) { window.__hcaptchaCalls.render++; window.__hcaptchaCalls.hl.push(params.hl); widgets.push(container); return String(widgets.length); },
    execute() { window.__hcaptchaCalls.execute++; return Promise.resolve({ response: ${JSON.stringify(FAKE_CAPTCHA_TOKEN)} }); },
    reset() { window.__hcaptchaCalls.reset++; },
    remove() { window.__hcaptchaCalls.remove++; },
  };
  const onload = new URL(document.currentScript.src).searchParams.get("onload");
  if (onload && typeof window[onload] === "function") window[onload]();
})();`;

type Fixtures = {
  /** Console errors and uncaught exceptions of the test's page; asserted empty at the end. */
  consoleErrors: string[];
};

/**
 * Every test fails on a console error or an uncaught exception. No test reaches the mail service
 * or WhatsApp unless it routes them itself (a page route wins over these context routes), and
 * hCaptcha is always the fake.
 */
export const test = base.extend<Fixtures>({
  consoleErrors: [
    async ({ context, page }, use) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      // On the context, so popups (the WhatsApp tab) are covered too.
      await context.route(BLOCKED, (route) => route.abort("blockedbyclient"));
      await context.route(HCAPTCHA, (route) =>
        route.fulfill({ contentType: "text/javascript", body: FAKE_HCAPTCHA_SCRIPT }),
      );
      await use(errors);
      expect(errors, "console errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Opens a locale's page and waits for hydration (the header menu reacts once React runs). */
export async function openLocale(page: Page, locale: TestLocale, hash = "") {
  await page.goto(`/${locale}${hash}`);
  await page.waitForLoadState("load");
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === "true", null, {
    timeout: 15_000,
  });
}

/**
 * Scrolls the whole page in steps, so every scroll-triggered entrance plays, then settles.
 * Lenis smooths wheel input; jumping with scrollTo still fires ScrollTrigger.
 */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    const pause = () => new Promise((resolve) => setTimeout(resolve, 60));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await pause();
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await pause();
  });
  // Reduced motion (the project default) has no entrances; a short settle for layout.
  await page.waitForTimeout(300);
}

export async function expectNoAxeViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(AXE_TAGS);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();
  const summary = violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    nodes: violation.nodes
      .slice(0, 5)
      .map((node) => `${node.target.join(" ")}: ${node.failureSummary}`),
  }));
  expect(summary).toEqual([]);
}

export function isMobile(projectName: string): boolean {
  return projectName === "mobile";
}
