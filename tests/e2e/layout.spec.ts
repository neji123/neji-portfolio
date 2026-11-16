import { expect, isMobile, LOCALES, openLocale, scrollThrough, test } from "./support";

const WIDTHS = [360, 768, 1024, 1440, 1920] as const;

test.describe("no sideways scroll", () => {
  test.beforeEach(({}, testInfo) => {
    // Widths are set by hand here, so one project is enough.
    test.skip(isMobile(testInfo.project.name), "Covered by the desktop project at every width.");
  });

  for (const locale of LOCALES) {
    for (const width of WIDTHS) {
      test(`${locale} at ${width}px, top to bottom`, async ({ page }) => {
        test.setTimeout(60_000);
        await page.setViewportSize({ width, height: 900 });
        await openLocale(page, locale);
        const overflow = () =>
          page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
        expect(await overflow()).toBeLessThanOrEqual(0);
        await scrollThrough(page);
        expect(await overflow()).toBeLessThanOrEqual(0);
      });
    }
  }
});
