import {
  expect,
  expectNoAxeViolations,
  LOCALES,
  messages,
  openLocale,
  scrollThrough,
  test,
} from "./support";

for (const locale of LOCALES) {
  test.describe(`accessibility (${locale})`, () => {
    // Reduced motion is the project default: no intro or entrance to wait for.
    test("axe: no violations on first paint and after scrolling the whole page", async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await openLocale(page, locale);
      await expectNoAxeViolations(page);
      await scrollThrough(page);
      await expectNoAxeViolations(page);
    });

    test("one h1 and headings that never skip a level", async ({ page }) => {
      await openLocale(page, locale);
      const levels = await page
        .locator("main :is(h1, h2, h3, h4, h5, h6)")
        .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName[1])));
      expect(levels.filter((level) => level === 1)).toHaveLength(1);
      expect(levels[0]).toBe(1);
      levels.forEach((level, i) => {
        if (i > 0) expect(level - (levels[i - 1] ?? 1), `heading ${i}`).toBeLessThanOrEqual(1);
      });
    });

    test("every image has an alt attribute, and content images describe themselves", async ({
      page,
    }) => {
      await openLocale(page, locale);
      const images = await page.locator("img").evaluateAll((nodes) =>
        nodes.map((node) => ({
          alt: node.getAttribute("alt"),
          decorative: Boolean(node.closest("[aria-hidden='true'], button[aria-label]")),
        })),
      );
      expect(images.length).toBeGreaterThan(0);
      for (const image of images) {
        expect(image.alt).not.toBeNull();
        if (!image.decorative) expect(image.alt?.length ?? 0).toBeGreaterThan(5);
      }
    });

    test("skip link is the first stop and moves focus to the main content", async ({ page }) => {
      await openLocale(page, locale);
      await page.keyboard.press("Tab");
      const skip = page.getByRole("link", { name: messages[locale].SkipLink.label });
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#main$/);
      await expect(page.locator("main#main")).toBeVisible();
    });
  });
}

test.describe("keyboard", () => {
  test("every stop of the tab order shows a visible focus ring", async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await openLocale(page, "en");
    const names: string[] = [];
    // The whole page: header, globe cities, cards, form, WhatsApp, footer, until focus cycles.
    for (let i = 0; i < 200; i += 1) {
      await page.keyboard.press("Tab");
      const stop = await page.evaluate(() => {
        const element = document.activeElement as HTMLElement | null;
        if (!element || element === document.body) return null;
        if (element.dataset.tabVisited) return null;
        element.dataset.tabVisited = "true";
        const style = getComputedStyle(element);
        const ring =
          (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) ||
          style.boxShadow !== "none";
        // Fields draw their focus as an accent underline; radios light their chip.
        const field = element.matches("input, textarea");
        const box = element.getBoundingClientRect();
        const label =
          element.getAttribute("aria-label") ||
          element.textContent?.trim().slice(0, 60) ||
          element.getAttribute("name") ||
          element.tagName;
        return { label, ring: ring || field, visible: box.width > 0 && box.height > 0 };
      });
      if (!stop) break;
      names.push(stop.label);
      expect(stop.visible, `${stop.label} is visible when focused`).toBe(true);
      expect(stop.ring, `${stop.label} shows a focus ring`).toBe(true);
    }
    const t = messages.en;
    const mustReach = [
      t.SkipLink.label,
      t.Contact.form.submit,
      t.Contact.whatsapp.label,
      ...(testInfo.project.name === "mobile"
        ? [t.Header.openMenu, t.Contact.qr.share]
        : [t.Nav.about, "English (EN)", t.Contact.qr.downloadSvg]),
    ];
    for (const name of mustReach) {
      expect(
        names.some((label) => label.includes(name)),
        `${name} is reachable`,
      ).toBe(true);
    }
  });
});
