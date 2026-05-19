import { defineConfig, devices } from "@playwright/test";

const nextCacheDir = process.env.NEXT_CACHE_DIR ?? ".next/cache";
const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR ?? "test-results";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir,
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3014",
    trace: "on-first-retry"
  },
  webServer: {
    command: `NEXT_CACHE_DIR=${nextCacheDir} npm run dev`,
    url: "http://127.0.0.1:3014",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] }
    }
  ]
});