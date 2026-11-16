import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
/** `next dev`, for the one test of the dev-only contact path (no hCaptcha on localhost). */
const DEV_PORT = 3101;
const DEV_URL = `http://localhost:${DEV_PORT}`;
/** `E2E_DEV_SERVER=0` skips booting `next dev` when only production specs run. */
const withDevServer = process.env.E2E_DEV_SERVER !== "0";

/**
 * Every test but one sees the calm site: reduced motion (no fades to wait for) and no WebGL
 * (the static globe stays, so the suite does not heat the machine). `globe.webgl.ts` alone
 * runs the 3D globe.
 */
const calm = {
  contextOptions: { reducedMotion: "reduce" as const },
  launchOptions: { args: ["--disable-3d-apis"] },
};

// The suite runs against the production build (`npm run build` first), so it exercises what
// actually ships; files named *.dev.ts run against the dev server instead.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // One browser at a time keeps a laptop cool and the timings honest.
  workers: 1,
  timeout: 60_000,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      testMatch: /.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, ...calm },
    },
    {
      name: "mobile",
      testMatch: /.*\.spec\.ts/,
      use: { ...devices["Pixel 7"], ...calm },
    },
    {
      name: "globe",
      testMatch: /.*\.webgl\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "dev",
      testMatch: /.*\.dev\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: DEV_URL, ...calm },
    },
  ],
  webServer: [
    {
      command: `npm run start -- --port ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    ...(withDevServer
      ? [
          {
            command: `npm run dev -- --port ${DEV_PORT}`,
            url: `${DEV_URL}/en`,
            reuseExistingServer: !process.env.CI,
            timeout: 180_000,
          },
        ]
      : []),
  ],
});
