import { expect, isMobile, LOCALES, messages, openLocale, test } from "./support";

for (const locale of LOCALES) {
  test.describe(`WhatsApp and QR (${locale})`, () => {
    test("the number and the chat address are nowhere in the HTML", async ({ request }) => {
      const html = await (await request.get(`/${locale}`)).text();
      expect(html).not.toContain("wa.me");
      expect(html).not.toMatch(/50\s?506\s?050/);
      expect(html).not.toContain("21650506050");
    });

    for (const where of ["floating", "contact"] as const) {
      test(`the ${where} WhatsApp button builds the chat link on click`, async ({
        page,
        context,
      }) => {
        const t = messages[locale].Contact.whatsapp;
        // Answer the chat page locally (the context-wide guard would abort it).
        await context.route(/^https:\/\/wa\.me\//, (route) =>
          route.fulfill({ contentType: "text/html", body: "<title>chat</title>" }),
        );
        await openLocale(page, locale);
        const button =
          where === "floating"
            ? page.locator(".whatsapp-fab").getByRole("button", { name: t.label })
            : page.locator("#contact").getByRole("button", { name: t.label });
        if (where === "contact") await button.scrollIntoViewIfNeeded();
        else await expect(button).toBeVisible();

        const [chat] = await Promise.all([context.waitForEvent("page"), button.click()]);
        const url = new URL(chat.url());
        expect(url.origin).toBe("https://wa.me");
        expect(url.pathname).toMatch(/^\/216\d{8}$/);
        expect(url.searchParams.get("text")).toBe(t.message);
        await chat.close();
      });
    }

    test("desktop: QR code of this page, downloadable as SVG and PNG", async ({
      page,
    }, testInfo) => {
      test.skip(isMobile(testInfo.project.name), "Phones get the Share button instead.");
      const t = messages[locale].Contact.qr;
      await openLocale(page, locale);
      const qr = page.locator("svg#contact-qr");
      await qr.scrollIntoViewIfNeeded();
      await expect(qr).toBeVisible();
      expect(await qr.getAttribute("aria-label")).toMatch(new RegExp(`/${locale}$`));
      await expect(page.getByRole("button", { name: t.share })).toBeHidden();

      for (const [label, extension] of [
        [t.downloadSvg, "svg"],
        [t.downloadPng, "png"],
      ] as const) {
        const [download] = await Promise.all([
          page.waitForEvent("download"),
          page.getByRole("button", { name: label }).click(),
        ]);
        expect(download.suggestedFilename()).toBe(
          `qr-mohamed-neji-benzarti-${locale}.${extension}`,
        );
      }
    });

    test("phone: Share opens the share sheet, or copies the link without one", async ({
      page,
      context,
    }, testInfo) => {
      test.skip(!isMobile(testInfo.project.name), "Desktop shows the QR code instead.");
      const t = messages[locale].Contact.qr;
      await page.addInitScript(() => {
        const shared: ShareData[] = [];
        Object.assign(window, { __shared: shared });
        Object.defineProperty(navigator, "share", {
          configurable: true,
          value: async (data: ShareData) => {
            shared.push(data);
          },
        });
      });
      await openLocale(page, locale);
      await expect(page.locator("svg#contact-qr")).toBeHidden();
      const share = page.getByRole("button", { name: t.share });
      await share.scrollIntoViewIfNeeded();
      await share.click();
      const shared = await page.evaluate(
        () => (window as unknown as { __shared: ShareData[] }).__shared,
      );
      expect(shared).toHaveLength(1);
      expect(shared[0]?.url).toMatch(new RegExp(`/${locale}$`));

      // No share sheet: the link is copied instead.
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await page.evaluate(() => {
        Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
      });
      await share.click();
      await expect(page.getByRole("status").filter({ hasText: t.copied })).toBeVisible();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
        new RegExp(`/${locale}$`),
      );
    });
  });
}
