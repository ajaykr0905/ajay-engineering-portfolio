import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("motion preference persists and can be resumed", async ({ page }) => {
  await page.addInitScript(() => {
    if (window.sessionStorage.getItem("motion-test-initialized") === null) {
      window.localStorage.removeItem("portfolio-motion");
      window.sessionStorage.setItem("motion-test-initialized", "true");
    }
  });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Pause animations" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(page.getByRole("button", { name: "Resume animations" })).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion-preference", "paused");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");

  await page.getByRole("button", { name: "Resume animations" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "active");
  await expect(page.evaluate(() => window.localStorage.getItem("portfolio-motion"))).resolves.toBe("auto");
});

test("operating-system reduced motion overrides animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => window.localStorage.setItem("portfolio-motion", "auto"));
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  const toggle = page.getByRole("button", { name: "Animations paused by system setting" });
  await expect(toggle).toHaveAttribute("aria-disabled", "true");
  await toggle.focus();
  await expect(toggle).toBeFocused();
});

test("ambient canvas is inert while the underlying project path stays clickable", async ({ page }) => {
  await page.goto("/");

  const canvas = page.getByTestId("ambient-constellation");
  await expect(canvas).toHaveCSS("pointer-events", "none");
  await expect(canvas).toHaveAttribute("aria-hidden", "true");

  await page.getByRole("link", { name: "See projects and code" }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
});

test("theme, motion, hero project links, cards, and calls to action are keyboard reachable", async ({ page }) => {
  await page.goto("/");

  const found = {
    motion: false,
    theme: false,
    heroProject: false,
    projectCard: false,
    primaryCallToAction: false,
  };

  for (let index = 0; index < 60; index += 1) {
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement | null;
      return {
        ariaLabel: element?.getAttribute("aria-label") ?? "",
        href: element?.getAttribute("href") ?? "",
        inHeroConstellation: Boolean(element?.closest(".hero-constellation-link")),
        inProjectCard: Boolean(element?.closest(".project-card")),
      };
    });

    found.motion ||= active.ariaLabel.includes("animations");
    found.theme ||= active.ariaLabel.startsWith("Use ") && active.ariaLabel.endsWith(" theme");
    found.heroProject ||= active.inHeroConstellation && active.href.startsWith("/projects/");
    found.projectCard ||= active.inProjectCard && active.href.startsWith("/projects/");
    found.primaryCallToAction ||= active.href === "/#projects";
  }

  expect(found).toEqual({
    motion: true,
    theme: true,
    heroProject: true,
    projectCard: true,
    primaryCallToAction: true,
  });
});

test("homepage and a project detail page have no automated accessibility violations", async ({ page }) => {
  for (const route of ["/", "/projects/fault-tolerant-transformer-lab"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  }
});

test("mobile coarse pointers do not activate pointer spotlights", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "This assertion targets the touch project.");
  await page.goto("/");

  expect(await page.evaluate(() => window.matchMedia("(pointer: coarse)").matches)).toBe(true);
  const card = page.locator("article.project-card").first();
  const bounds = await card.boundingBox();
  if (!bounds) throw new Error("Project card did not render.");
  await page.mouse.move(bounds.x + 20, bounds.y + 20);
  await expect(card).not.toHaveAttribute("data-pointer-active", "true");
});

test("the primary experience remains usable at 200 percent page scale", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The desktop project provides the controlled page-scale check.");
  await page.goto("/");
  const devtools = await page.context().newCDPSession(page);
  await devtools.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });

  expect(await page.evaluate(() => window.visualViewport?.scale)).toBeGreaterThanOrEqual(2);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "See projects and code" })).toBeVisible();
});

test("intermediate desktop widths do not create horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The desktop project supplies the intermediate viewport.");
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

test("captures deterministic dark and light visual QA artifacts", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("portfolio-motion", "paused");
    window.localStorage.setItem("theme", "dark");
  });
  await page.goto("/");
  await page.locator(".hero-art").evaluate((image: HTMLImageElement) => image.decode());
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");

  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: testInfo.outputPath(`homepage-dark-${testInfo.project.name}.png`),
  });

  await page.evaluate(() => {
    window.localStorage.setItem("theme", "light");
    document.documentElement.dataset.theme = "light";
  });
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: testInfo.outputPath(`homepage-light-${testInfo.project.name}.png`),
  });
});
