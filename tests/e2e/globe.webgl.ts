import { expect, openLocale, test } from "./support";

// The one test with WebGL and full motion (the "globe" project); every other test keeps the
// static globe so the suite stays light.
test("the 3D globe loads and replaces the static one without console errors", async ({ page }) => {
  await openLocale(page, "en");
  // The static globe hides itself once the 3D one has drawn its first frame.
  await expect(page.locator(".globe-sky canvas")).toBeAttached({ timeout: 20_000 });
  await expect(page.locator(".globe-frame")).toHaveAttribute("aria-hidden", "true", {
    timeout: 20_000,
  });
  // Console errors fail the test through the shared fixture.
});
