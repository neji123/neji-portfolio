import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
/** `next dev`, for the one test of the dev-only contact path (no hCaptcha on localhost). */
const DEV_PORT = 3101;
const DEV_URL = `http://localhost:${DEV_PORT}`;

// The suite runs against the production build (`npm run build` first), so it exercises what
// actually ships; files named *.dev.ts run against the dev server instead.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Every page runs WebGL: a few workers keep the machine responsive and the timings honest.
  workers: 2,
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
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      testMatch: /.*\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "dev",
      testMatch: /.*\.dev\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: DEV_URL },
    },
  ],
  webServer: [
    {
      command: `npm run start -- --port ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `npm run dev -- --port ${DEV_PORT}`,
      url: `${DEV_URL}/en`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});
