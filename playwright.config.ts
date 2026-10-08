import { defineConfig, devices } from "@playwright/test";

const localBrowser = process.platform === "darwin"
  ? "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
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
    launchOptions: { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH ?? (process.env.CI ? undefined : localBrowser) },
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
