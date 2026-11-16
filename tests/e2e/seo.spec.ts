import { contact } from "../../src/content/contact";
import { profile } from "../../src/content/profile";
import { expect, isMobile, LOCALES, test } from "./support";

const OTHER = { en: ["fr", "ar"], fr: ["en", "ar"], ar: ["en", "fr"] } as const;

test.describe("SEO", () => {
  // Markup and files only: once is enough.
  test.beforeEach(({}, testInfo) => {
    test.skip(isMobile(testInfo.project.name), "Same markup on every device.");
  });

  for (const locale of LOCALES) {
    test(`${locale}: metadata, canonical, hreflang, social images and JSON-LD`, async ({
      page,
      request,
    }) => {
      await page.goto(`/${locale}`);
      const person = profile[locale];
      const head = page.locator("head");

      await expect(page).toHaveTitle(`${person.name} · ${person.title}`);
      const description = await head.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(50);

      const canonical = await head.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toMatch(new RegExp(`^https?://[^/]+/${locale}$`));
      const origin = new URL(canonical ?? "").origin;
      for (const code of ["en", "fr", "ar"]) {
        await expect(head.locator(`link[rel="alternate"][hreflang="${code}"]`)).toHaveAttribute(
          "href",
          `${origin}/${code}`,
        );
      }
      await expect(head.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        "href",
        `${origin}/en`,
      );

      // Open Graph and Twitter: the card of this language, which exists and is a 1200×630 PNG.
      await expect(head.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical ?? "",
      );
      await expect(head.locator('meta[property="og:locale:alternate"]')).toHaveCount(2);
      for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
        const url = await head.locator(selector).getAttribute("content");
        expect(url).toBe(`${origin}/og/og-${locale}.png`);
        const image = await request.get(new URL(url ?? "").pathname);
        expect(image.status()).toBe(200);
        expect(image.headers()["content-type"]).toBe("image/png");
      }
      await expect(head.locator('meta[property="og:image:width"]')).toHaveAttribute(
        "content",
        "1200",
      );
      await expect(head.locator('meta[property="og:image:height"]')).toHaveAttribute(
        "content",
        "630",
      );
      await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );

      // JSON-LD Person: the name in this language and the others, no phone number.
      const jsonLd = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
      );
      expect(jsonLd).toMatchObject({
        "@type": "Person",
        name: person.name,
        jobTitle: person.title,
        url: `${origin}/${locale}`,
      });
      expect(jsonLd.sameAs).toEqual(expect.arrayContaining([contact.linkedin, contact.github]));
      for (const code of OTHER[locale]) {
        if (profile[code].name !== person.name)
          expect(jsonLd.alternateName).toContain(profile[code].name);
      }
      expect(JSON.stringify(jsonLd)).not.toMatch(/telephone|\+965|98022955|wa\.me/);
    });
  }

  test("icons and the web manifest", async ({ page, request }) => {
    await page.goto("/en");
    const head = page.locator("head");
    for (const selector of [
      'link[rel="icon"][type="image/x-icon"]',
      'link[rel="icon"][type="image/png"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="manifest"]',
    ]) {
      const href = await head.locator(selector).first().getAttribute("href");
      expect(href, selector).toBeTruthy();
      expect((await request.get(href ?? "")).status(), selector).toBe(200);
    }
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    expect(manifest.short_name).toBe("MNB");
    for (const icon of manifest.icons as { src: string }[]) {
      const response = await request.get(icon.src);
      expect(response.status(), icon.src).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");
    }
  });

  test("sitemap.xml lists every language with its alternates; robots.txt points to it", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const code of LOCALES) {
      expect(sitemap).toMatch(new RegExp(`<loc>https?://[^<]+/${code}</loc>`));
      expect(sitemap).toContain(`hreflang="${code}"`);
    }
    expect(sitemap).toContain('hreflang="x-default"');
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Allow: \//);
    expect(robots).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
  });
});
