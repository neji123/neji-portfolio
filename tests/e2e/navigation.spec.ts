import { sectionIds } from "../../src/content/site";
import { expect, isMobile, LOCALES, messages, openLocale, test } from "./support";

for (const locale of LOCALES) {
  test.describe(`navigation (${locale})`, () => {
    test("the page names its owner in a single h1 and in the title", async ({ page }) => {
      await openLocale(page, locale);
      const name = locale === "ar" ? "محمد الناجي البنزرتي" : "Mohamed Neji Benzarti";
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(name);
      await expect(page).toHaveTitle(new RegExp(name));
    });

    test("scrollspy marks the section being read in the menu", async ({ page }, testInfo) => {
      test.skip(isMobile(testInfo.project.name), "The header links are desktop only (menu below).");
      await openLocale(page, locale);
      const nav = page.getByRole("navigation", { name: messages[locale].Header.primaryNav });
      for (const id of sectionIds) {
        await page.evaluate((sectionId) => {
          const top = document.getElementById(sectionId)?.getBoundingClientRect().top ?? 0;
          window.scrollTo(0, window.scrollY + top);
        }, id);
        await expect(nav.locator(`a[href="#${id}"]`)).toHaveAttribute("aria-current", "location");
        await expect(nav.locator('a[aria-current="location"]')).toHaveCount(1);
      }
    });

    test("a menu link brings its section into view", async ({ page }, testInfo) => {
      await openLocale(page, locale);
      const t = messages[locale];
      if (isMobile(testInfo.project.name)) {
        await page.getByRole("button", { name: t.Header.openMenu }).click();
        await page.getByRole("dialog").getByRole("link", { name: t.Nav.projects }).click();
        await expect(page.getByRole("dialog")).toBeHidden();
      } else {
        await page
          .getByRole("navigation", { name: t.Header.primaryNav })
          .getByRole("link", { name: t.Nav.projects })
          .click();
      }
      await expect(page.locator("#projects-heading")).toBeInViewport();
    });
  });
}

test.describe("mobile menu", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!isMobile(testInfo.project.name), "The menu button shows below 1024 px.");
  });

  test("opens as a modal, traps focus, closes on Escape and returns focus", async ({ page }) => {
    await openLocale(page, "en");
    const t = messages.en.Header;
    const trigger = page.getByRole("button", { name: t.openMenu });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: t.primaryNav });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Focus never reaches the page behind, however far you tab (past the last control a native
    // modal lets it go to the browser's own toolbar, where document.activeElement is the body).
    for (let i = 0; i < 15; i += 1) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate(
        (node) => node.contains(document.activeElement) || document.activeElement === document.body,
      );
      expect(inside).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("holds the language switcher and the CV", async ({ page }) => {
    await openLocale(page, "en");
    await page.getByRole("button", { name: messages.en.Header.openMenu }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("link", { name: "Français (FR)" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: messages.en.Nav.downloadCv })).toBeVisible();
  });
});
