import { certifications } from "../../src/content/certifications";
import { localize } from "../../src/lib/localize";
import { expect, expectNoAxeViolations, LOCALES, messages, openLocale, test } from "./support";

const withImage = certifications.filter((item) => item.proof.kind === "image");

for (const locale of LOCALES) {
  test(`${locale}: each certificate opens in an accessible lightbox`, async ({ page }) => {
    test.setTimeout(90_000);
    await openLocale(page, locale);
    const t = messages[locale].Certifications;

    for (const certification of withImage) {
      const name = localize(certification.name, locale);
      const trigger = page.getByRole("button", { name: t.openLabel.replace("{name}", name) });
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click();

      const dialog = page.getByRole("dialog", { name });
      await expect(dialog).toBeVisible();
      // The full image, with its translated description.
      const image = dialog.getByRole("img");
      await expect(image).toBeVisible();
      expect((await image.getAttribute("alt"))?.length ?? 0).toBeGreaterThan(10);
      expect(await image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(
        0,
      );
      // Focus is inside, and stays there.
      for (let i = 0; i < 4; i += 1) {
        await page.keyboard.press("Tab");
        const inside = await dialog.evaluate(
          (node) =>
            node.contains(document.activeElement) || document.activeElement === document.body,
        );
        expect(inside).toBe(true);
      }
      await expectNoAxeViolations(page, "dialog[open]");

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();

      // The close button and a click on the surround close it too. The pointer leaves the
      // card first: its hover lift would keep it moving under the cursor.
      await page.mouse.move(0, 0);
      await page.waitForTimeout(400);
      await trigger.click();
      await dialog.getByRole("button", { name: t.close }).click();
      await expect(dialog).toBeHidden();
      // Wait out the closing fade before reopening, and the opening fade before clicking.
      await page.mouse.move(0, 0);
      await page.waitForTimeout(400);
      await trigger.click();
      await expect(dialog).toBeVisible();
      await page.waitForTimeout(400);
      await page.mouse.click(5, (page.viewportSize()?.height ?? 600) - 5);
      await expect(dialog).toBeHidden();
    }
  });
}
