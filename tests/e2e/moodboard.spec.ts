import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { boardLocales, directionIds, siteCopy } from "../../src/content/moodboard";

const SCREENSHOT_DIR = "screenshots/phase-1";

for (const direction of directionIds) {
  for (const locale of boardLocales) {
    test.describe(`moodboard ${direction} (${locale})`, () => {
      const url = `/moodboard/${direction}/${locale}`;

      test("sets language and direction, with one h1 naming the owner", async ({ page }) => {
        await page.goto(url);
        const root = page.locator(".mb-root:visible");
        await expect(root).toHaveAttribute("lang", locale);
        await expect(root).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).toHaveText(siteCopy[locale].hero.name);
      });

      test("has no horizontal scroll and zero axe violations", async ({ page }) => {
        await page.goto(url);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(results.violations).toEqual([]);
      });

      test("captures checkpoint screenshots", async ({ page }, testInfo) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(url);
        await page.evaluate(() => document.fonts.ready);
        const name = `${direction}-${locale}-${testInfo.project.name}`;
        await page.screenshot({ path: `${SCREENSHOT_DIR}/${name}-first-screen.png` });
        await page.screenshot({ path: `${SCREENSHOT_DIR}/${name}-full.png`, fullPage: true });
      });
    });
  }
}

test("language link switches the board to Arabic, right to left", async ({ page }) => {
  await page.goto("/moodboard/night-route/en");
  await page.getByRole("link", { name: "العربية" }).click();
  await expect(page).toHaveURL(/\/moodboard\/night-route\/ar$/);
  await expect(page.locator(".mb-root:visible")).toHaveAttribute("dir", "rtl");
});
