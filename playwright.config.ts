import { defineConfig, devices } from "@playwright/test";

const localChrome = process.platform === "darwin"
  ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  : undefined;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.CI ? undefined : localChrome },
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1"
    ? undefined
    : {
        command: "pnpm start --hostname 127.0.0.1 --port 3000",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
});
