import { contact } from "../../src/content/contact";
import { expect, LOCALES, messages, openLocale, test } from "./support";

for (const locale of LOCALES) {
  test(`${locale}: the CV downloads as a PDF`, async ({ page, request }) => {
    await openLocale(page, locale);
    const link = page
      .getByRole("link", { name: messages[locale].Hero.downloadCv })
      .filter({ visible: true })
      .first();
    await expect(link).toHaveAttribute("href", contact.cv);
    await expect(link).toHaveAttribute("download", "");

    const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
    expect(download.suggestedFilename()).toBe("CV_Mohamed_Neji_Benzarti.pdf");

    const response = await request.get(contact.cv);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });
}
