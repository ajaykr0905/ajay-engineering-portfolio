import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const publicRoutes = [
  "/",
  "/experience",
  "/writing",
  "/resume",
  "/projects/fault-tolerant-transformer-lab",
  "/projects/distributed-scale-validation-platform",
  "/projects/voicemed-ai",
] as const;

async function spectrumColor(page: Page) {
  return page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--spectrum-color").trim());
}

async function projectSurfaceOpacity(page: Page) {
  return page.locator("article.project-card").first().evaluate((card) =>
    Number.parseFloat(getComputedStyle(card, "::before").opacity),
  );
}

async function horizontalDimensions(page: Page) {
  return page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
}

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

test("the portfolio remains dark-only without theme state or a theme control", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  await page.goto("/");

  await expect(page.getByRole("button", { name: /theme/i })).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await expect(page.evaluate(() => window.localStorage.getItem("theme"))).resolves.toBeNull();
  await expect(page.locator("body")).toHaveCSS("font-family", /interTight/i);
});

test("operating-system reduced motion freezes the spectrum and overrides animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => window.localStorage.setItem("portfolio-motion", "auto"));
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  const toggle = page.getByRole("button", { name: "Animations paused by system setting" });
  await expect(toggle).toHaveAttribute("aria-disabled", "true");
  await toggle.focus();
  await expect(toggle).toBeFocused();

  const initialColor = await spectrumColor(page);
  await page.waitForTimeout(200);
  expect(await spectrumColor(page)).toBe(initialColor);
  await expect(page.locator("html")).toHaveCSS("animation-name", "none");
});

test("a manually paused experience keeps a deterministic spectrum frame", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("portfolio-motion", "paused"));
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  const initialColor = await spectrumColor(page);
  await page.waitForTimeout(200);
  expect(await spectrumColor(page)).toBe(initialColor);
  await expect(page.locator("html")).toHaveCSS("animation-name", "none");
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

test("motion, navigation, project, GitHub, and calls to action are keyboard reachable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The desktop project provides the complete tab-order audit.");
  await page.goto("/");

  const found = {
    motion: false,
    navigation: false,
    projectPrimary: false,
    github: false,
    heroCallToAction: false,
    contactCallToAction: false,
  };

  for (let index = 0; index < 90 && !Object.values(found).every(Boolean); index += 1) {
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement | null;
      return {
        ariaLabel: element?.getAttribute("aria-label") ?? "",
        href: element?.getAttribute("href") ?? "",
        inNavigation: Boolean(element?.closest('nav[aria-label="Primary navigation"]')),
        isProjectPrimary: element?.hasAttribute("data-spectrum-primary") ?? false,
        text: element?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      };
    });

    found.motion ||= active.ariaLabel.toLowerCase().includes("animations");
    found.navigation ||= active.inNavigation;
    found.projectPrimary ||= active.isProjectPrimary;
    found.github ||= active.text.includes("GitHub");
    found.heroCallToAction ||= active.href === "/#projects";
    found.contactCallToAction ||= active.ariaLabel.startsWith("Email Ajay in Gmail");
  }

  expect(found).toEqual({
    motion: true,
    navigation: true,
    projectPrimary: true,
    github: true,
    heroCallToAction: true,
    contactCallToAction: true,
  });
  await expect(page.getByRole("button", { name: /theme/i })).toHaveCount(0);
});

test("fine pointers activate a full project row while GitHub remains an isolated spectrum control", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "This assertion targets fine-pointer hover behavior.");
  await page.goto("/");

  expect(await page.evaluate(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(true);
  const card = page.locator("article.project-card").first();
  const primary = card.locator("[data-spectrum-primary]");
  const github = card.getByRole("link", { name: "Open GitHub repository" });

  await page.evaluate(() => {
    const animation = document.documentElement.getAnimations().find((candidate) =>
      (candidate.effect as KeyframeEffect | null)?.target === document.documentElement,
    );
    if (!animation) throw new Error("Spectrum animation was not found.");
    animation.pause();
    animation.currentTime = 0;
  });

  expect(await projectSurfaceOpacity(page)).toBe(0);
  await primary.hover();
  await expect.poll(() => projectSurfaceOpacity(page)).toBeGreaterThan(0.95);
  expect(await card.evaluate((element) => getComputedStyle(element, "::before").transitionDuration)).toBe("0s");
  const firstColor = await card.evaluate((element) => getComputedStyle(element, "::before").backgroundColor);
  await expect(primary).toHaveCSS("color", "rgb(8, 8, 8)");
  await expect(card.locator(".project-summary")).toHaveCSS("color", "rgb(8, 8, 8)");
  await expect(card.getByRole("link", { name: "See how it works" })).toHaveCSS("color", "rgb(8, 8, 8)");
  await expect(card.locator("a.status-link")).toHaveCSS("color", "rgb(255, 255, 255)");

  await page.evaluate(() => {
    const animation = document.documentElement.getAnimations().find((candidate) =>
      (candidate.effect as KeyframeEffect | null)?.target === document.documentElement,
    );
    if (!animation) throw new Error("Spectrum animation was not found.");
    animation.currentTime = 16_000;
  });
  await expect.poll(async () =>
    card.evaluate((element) => getComputedStyle(element, "::before").backgroundColor),
  ).not.toBe(firstColor);

  await github.hover();
  await expect.poll(() => projectSurfaceOpacity(page)).toBeLessThan(0.05);
  await expect(github).toHaveCSS("color", "rgb(8, 8, 8)");
  const githubBackground = await github.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(githubBackground).not.toBe("rgba(0, 0, 0, 0)");
});

test("homepage and a project detail page have no automated accessibility violations", async ({ page }) => {
  for (const route of ["/", "/projects/fault-tolerant-transformer-lab"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  }
});

test("coarse pointers do not activate hover fills or pointer spotlights", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "This assertion targets the touch project.");
  await page.goto("/");

  expect(await page.evaluate(() => window.matchMedia("(pointer: coarse)").matches)).toBe(true);
  const hero = page.locator(".hero-grid");
  const card = page.locator("article.project-card").first();
  const primary = card.locator("[data-spectrum-primary]");
  const bounds = await primary.boundingBox();
  if (!bounds) throw new Error("Project primary link did not render.");
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

  await expect(hero).not.toHaveAttribute("data-pointer-active", "true");
  expect(await projectSurfaceOpacity(page)).toBe(0);
  await expect(primary.locator(".action-arrow")).toHaveCSS("opacity", "1");
});

test("forced colors remove decorative fills and preserve a native focus outline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The desktop project provides forced-colors coverage.");
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/");

  expect(await page.evaluate(() => window.matchMedia("(forced-colors: active)").matches)).toBe(true);
  const card = page.locator("article.project-card").first();
  const primary = card.locator("[data-spectrum-primary]");
  await primary.focus();
  await expect(primary).toBeFocused();
  expect(await card.evaluate((element) => getComputedStyle(element, "::before").display)).toBe("none");
  await expect(primary).toHaveCSS("outline-style", "solid");
  await expect(primary).toHaveCSS("outline-width", "3px");
});

test("public portfolio routes do not render image, picture, video, or audio elements", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "One browser profile is sufficient for the route-wide media audit.");

  for (const route of publicRoutes) {
    await page.goto(route);
    await expect(page.locator("img, picture, video, audio")).toHaveCount(0);
  }
});

test("360px and 1024px layouts do not create horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The desktop project supplies explicit viewport sizes.");

  for (const viewport of [{ width: 360, height: 800 }, { width: 1024, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const dimensions = await horizontalDimensions(page);
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  }
});

test("the primary experience remains usable without overflow at 200 percent page scale", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The desktop project provides the controlled page-scale check.");
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");
  const devtools = await page.context().newCDPSession(page);
  await devtools.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });

  expect(await page.evaluate(() => window.visualViewport?.scale)).toBeGreaterThanOrEqual(2);
  const dimensions = await horizontalDimensions(page);
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "See projects and code" })).toBeVisible();
});

test("captures deterministic monochrome rest and keyboard-focus artifacts", async ({ page }, testInfo) => {
  await page.addInitScript(() => window.localStorage.setItem("portfolio-motion", "paused"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");

  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: testInfo.outputPath(`homepage-monochrome-rest-${testInfo.project.name}.png`),
  });

  const primary = page.locator("[data-spectrum-primary]").first();
  await primary.focus();
  await expect(primary).toBeFocused();
  await expect.poll(() => projectSurfaceOpacity(page)).toBeGreaterThan(0.95);
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: testInfo.outputPath(`homepage-monochrome-focus-${testInfo.project.name}.png`),
  });
});
