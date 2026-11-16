import { WEB3FORMS_ENDPOINT } from "../../src/lib/web3forms";
import { expect, messages, openLocale, test } from "./support";

// Runs against `next dev` on localhost (the "dev" project): hCaptcha is never loaded there and
// the form sends without a token. The endpoint is answered locally: never a real email.
test("dev server: the form sends without hCaptcha", async ({ page }) => {
  test.setTimeout(120_000);
  const captchaRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("hcaptcha.com")) captchaRequests.push(request.url());
  });
  const sent: string[] = [];
  await page.route(WEB3FORMS_ENDPOINT, async (route) => {
    sent.push(route.request().postData() ?? "");
    await route.fulfill({ contentType: "application/json", body: '{"success":true}' });
  });

  await openLocale(page, "en");
  const t = messages.en.Contact.form;
  const letter = page.getByRole("form", { name: t.title });
  await letter.scrollIntoViewIfNeeded();
  await letter.getByLabel(t.name).fill("Test Visitor");
  await letter.getByLabel(t.email, { exact: true }).fill("visitor@example.com");
  await letter.getByText(t.subjects.other, { exact: true }).click();
  await letter.getByLabel(t.message).fill("A message long enough for the form to accept it.");
  await page.waitForTimeout(10_500);
  await letter.getByRole("button", { name: t.submit }).click();

  await expect(letter.getByText(t.success)).toBeVisible();
  expect(sent).toHaveLength(1);
  expect(sent[0]).not.toContain("h-captcha-response");
  expect(captchaRequests).toEqual([]);
});
