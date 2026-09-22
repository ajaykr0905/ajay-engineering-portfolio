import { expect, test } from "@playwright/test";

test("homepage communicates positioning and evidence path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Distributed Systems and AI Infrastructure Engineer");
  await expect(page.getByRole("link", { name: "View flagship system" })).toBeVisible();
  await expect(page.getByText("Built to be inspected, not just described.")).toBeVisible();
});

test("all project case studies render", async ({ page }) => {
  const slugs = ["fault-tolerant-transformer-lab", "distributed-scale-validation-platform", "voicemed-ai"];
  for (const slug of slugs) {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("What remains unproven")).toBeVisible();
  }
});

test("mobile navigation remains keyboard reachable", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});
