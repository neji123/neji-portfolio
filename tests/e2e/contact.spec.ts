import { type Page, type Request } from "@playwright/test";

import { COOLDOWN_MS } from "../../src/features/contact/cooldown";
import { WEB3FORMS_ENDPOINT } from "../../src/lib/web3forms";
import {
  expect,
  FAKE_CAPTCHA_TOKEN,
  LOCALES,
  messages,
  openLocale,
  type TestLocale,
  test,
} from "./support";

/** A person needs more than this to write; sooner is the time trap (MIN_FILL_MS in the form). */
const TIME_TRAP_MS = 10_000;
const MESSAGE = "Hello, this is an automated test of the contact form. Please ignore it.";

/** Answers Web3Forms' endpoint locally and records what the form sent. Never a real email. */
async function mockWeb3Forms(page: Page, success = true) {
  const sent: Request[] = [];
  await page.route(WEB3FORMS_ENDPOINT, async (route) => {
    sent.push(route.request());
    // A refusal comes back as 200 with success: false (no console noise from an error status).
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success, message: success ? "Email sent" : "Invalid" }),
    });
  });
  return sent;
}

/** The multipart body as field → value (text fields only). */
function fields(request: Request): Record<string, string> {
  const body = request.postData() ?? "";
  const out: Record<string, string> = {};
  for (const part of body.split(/--[-\w]+/)) {
    const match = part.match(/name="([^"]+)"\r?\n\r?\n([\s\S]*?)\r?\n$/);
    if (match?.[1]) out[match[1]] = match[2] ?? "";
  }
  return out;
}

function form(page: Page, locale: TestLocale) {
  return page.getByRole("form", { name: messages[locale].Contact.form.title });
}

async function showForm(page: Page, locale: TestLocale) {
  await form(page, locale).scrollIntoViewIfNeeded();
  await expect(form(page, locale)).toBeInViewport();
}

async function fill(page: Page, locale: TestLocale) {
  const t = messages[locale].Contact.form;
  const letter = form(page, locale);
  await letter.getByLabel(t.name).fill("Test Visitor");
  await letter.getByLabel(t.email, { exact: true }).fill("visitor@example.com");
  await letter.getByLabel(t.company).fill("Example Co");
  await letter.getByText(t.subjects.freelance, { exact: true }).click();
  await letter.getByLabel(t.message).fill(MESSAGE);
}

for (const locale of LOCALES) {
  test.describe(`contact form (${locale}, production build)`, () => {
    test("an empty send shows inline errors, focuses the first field and sends nothing", async ({
      page,
    }) => {
      const sent = await mockWeb3Forms(page);
      await openLocale(page, locale);
      await showForm(page, locale);
      const t = messages[locale].Contact.form;
      const letter = form(page, locale);

      await letter.getByRole("button", { name: t.submit }).click();
      const name = letter.getByLabel(t.name);
      await expect(name).toHaveAttribute("aria-invalid", "true");
      await expect(name).toBeFocused();
      await expect(letter.getByText(t.errors.nameRequired)).toBeVisible();
      await expect(letter.getByText(t.errors.subjectRequired)).toBeVisible();
      // The error is the field's description, in a live region: it is announced.
      const describedBy = (await name.getAttribute("aria-describedby")) ?? "";
      const error = page.locator(`[id="${describedBy}"]`);
      await expect(error).toHaveText(t.errors.nameRequired);
      await expect(error).toHaveAttribute("aria-live", "polite");
      expect(sent).toHaveLength(0);
    });

    test("the time trap: a send within 10 s of the form showing fails quietly", async ({
      page,
    }) => {
      const sent = await mockWeb3Forms(page);
      await openLocale(page, locale);
      await showForm(page, locale);
      await fill(page, locale);
      const t = messages[locale].Contact.form;
      await form(page, locale).getByRole("button", { name: t.submit }).click();
      await expect(form(page, locale).getByText(t.failed)).toBeVisible();
      expect(sent).toHaveLength(0);
    });

    test("a send carries the hCaptcha token, then the form rests (cooldown)", async ({ page }) => {
      test.setTimeout(60_000);
      const sent = await mockWeb3Forms(page);
      await openLocale(page, locale);
      await showForm(page, locale);
      await fill(page, locale);
      // hCaptcha (the fake) is loaded near the form and speaks the page's language.
      await expect
        .poll(() =>
          page.evaluate(
            () => (window as { __hcaptchaCalls?: { hl: string[] } }).__hcaptchaCalls?.hl ?? [],
          ),
        )
        .toContain(locale);
      await page.waitForTimeout(TIME_TRAP_MS + 500);

      const t = messages[locale].Contact.form;
      const letter = form(page, locale);
      await letter.getByRole("button", { name: t.submit }).click();
      await expect(letter.getByText(t.success)).toBeVisible();

      expect(sent).toHaveLength(1);
      const body = fields(sent[0]!);
      expect(body["h-captcha-response"]).toBe(FAKE_CAPTCHA_TOKEN);
      expect(body.access_key?.length ?? 0).toBeGreaterThan(0);
      expect(body).toMatchObject({
        from_name: "Portfolio",
        replyto: "visitor@example.com",
        name: "Test Visitor",
        email: "visitor@example.com",
        company: "Example Co",
        subject: `[Portfolio] ${t.subjects.freelance}: Test Visitor`,
        message: MESSAGE,
        locale,
      });
      expect(body.botcheck).toBeUndefined();

      // Cooldown: every control is disabled, and it survives a reload in the same tab.
      await expect(letter.getByRole("button", { name: t.sent })).toBeDisabled();
      await expect(letter.getByLabel(t.name)).toBeDisabled();
      await expect(letter.getByText(t.cooldown)).toBeVisible();
      const until = Number(
        await page.evaluate(() => sessionStorage.getItem("nb-contact-cooldown-until")),
      );
      expect(until - Date.now()).toBeGreaterThan(COOLDOWN_MS - 60_000);
      await page.reload();
      await showForm(page, locale);
      await expect(form(page, locale).getByLabel(t.name)).toBeDisabled();
    });

    test("a refused send offers the mailto fallback", async ({ page }) => {
      test.setTimeout(60_000);
      await mockWeb3Forms(page, false);
      await openLocale(page, locale);
      await showForm(page, locale);
      await fill(page, locale);
      await page.waitForTimeout(TIME_TRAP_MS + 500);
      const t = messages[locale].Contact.form;
      const letter = form(page, locale);
      await letter.getByRole("button", { name: t.submit }).click();
      await expect(letter.getByText(t.failed)).toBeVisible();
      await expect(letter.getByRole("link", { name: t.fallback })).toHaveAttribute(
        "href",
        /^mailto:benzartimedneji@gmail\.com\?subject=/,
      );
      await expect(letter.getByLabel(t.name)).toBeEnabled();
    });
  });
}
