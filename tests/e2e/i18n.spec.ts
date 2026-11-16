import { expect, isMobile, LOCALES, messages, openLocale, test } from "./support";

const DIRECTION = { en: "ltr", fr: "ltr", ar: "rtl" } as const;

for (const locale of LOCALES) {
  test(`${locale}: <html> carries the language and the direction`, async ({ page }) => {
    await openLocale(page, locale);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute("dir", DIRECTION[locale]);
    await expect(page.locator("#hero-title")).toBeVisible();
  });
}

test("the header switcher moves to French, then Arabic (RTL), and remembers it", async ({
  page,
  context,
}, testInfo) => {
  await openLocale(page, "en");

  async function choose(name: string, from: keyof typeof messages) {
    if (isMobile(testInfo.project.name)) {
      await page.getByRole("button", { name: messages[from].Header.openMenu }).click();
      await page.getByRole("dialog").getByRole("link", { name }).click();
    } else {
      await page
        .getByRole("banner")
        .getByRole("navigation", { name: messages[from].LanguageSwitcher.label })
        .getByRole("link", { name })
        .click();
    }
  }

  await choose("Français (FR)", "en");
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("h1")).toHaveText("Mohamed Neji Benzarti");

  await choose("العربية (AR)", "fr");
  await expect(page).toHaveURL(/\/ar$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("h1")).toHaveText("محمد الناجي البنزرتي");
  // On phones the switcher sits in the closed menu: check the attribute, visible or not.
  await expect(page.locator('a[hreflang="ar"]').first()).toHaveAttribute("aria-current", "true");

  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === "NEXT_LOCALE")?.value).toBe("ar");
});

test("a first visit follows the browser's language", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ locale: "fr-FR", baseURL });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr$/);
  await context.close();
});

test("Arabic mirrors the layout: the menu sits at the reading start", async ({ page }) => {
  await openLocale(page, "ar");
  const name = page.getByRole("banner").getByRole("link").first();
  const box = await name.boundingBox();
  const width = page.viewportSize()?.width ?? 0;
  expect(box).not.toBeNull();
  // The wordmark starts the bar: on the right in RTL.
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeGreaterThan(width / 2);
});
