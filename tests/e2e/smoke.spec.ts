import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { profile } from "../../src/content/profile";

const SCREENSHOT_DIR = "screenshots/phase-0";

test.describe("smoke", () => {
  test("renders a single h1 with the owner's name and no console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(profile.en.name);
    expect(consoleErrors).toEqual([]);
  });

  test("skip link moves focus target to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute("href", "#main");
    await expect(page.locator("main#main")).toBeVisible();
  });

  test("has no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("has zero axe violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("captures checkpoint screenshot", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
