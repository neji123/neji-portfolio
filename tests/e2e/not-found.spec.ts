import { expect, LOCALES, messages, test } from "./support";

for (const locale of LOCALES) {
  test(`${locale}: an unknown path shows the translated 404 page`, async ({
    page,
    consoleErrors,
  }) => {
    const response = await page.goto(`/${locale}/this-route-does-not-exist`);
    expect(response?.status()).toBe(404);
    // Chrome reports the document's own 404 status in the console: expected here, and only that.
    expect(consoleErrors).toEqual([
      "Failed to load resource: the server responded with a status of 404 (Not Found)",
    ]);
    consoleErrors.length = 0;
    const t = messages[locale].NotFound;
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(t.title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.getByRole("link", { name: t.home }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    await expect(page.locator("#hero-title")).toBeVisible();
  });
}
