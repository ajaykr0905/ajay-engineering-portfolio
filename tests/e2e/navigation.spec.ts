import { expect, test } from "@playwright/test";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

test("homepage communicates positioning and evidence path", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Distributed Systems and AI Infrastructure Engineer");
  await expect(page.getByRole("link", { name: "See projects and code" })).toHaveAttribute("href", "/#projects");
  await expect(page.getByText("Software Engineer II · Backend and platform reliability · Building fault-tolerant AI labs in public")).toBeVisible();
  await expect(page.getByText("What each project does—and what works today.")).toBeVisible();

  const primaryCallToAction = await page.getByRole("link", { name: "See projects and code" }).boundingBox();
  expect(primaryCallToAction).not.toBeNull();
  expect((primaryCallToAction?.y ?? 0) + (primaryCallToAction?.height ?? 0)).toBeLessThanOrEqual(720);
});

test("primary navigation targets the overview and exposes exactly one current destination", async ({ page }) => {
  const routes = [
    { route: "/", current: "Projects" },
    { route: "/projects/fault-tolerant-transformer-lab", current: "Projects" },
    { route: "/experience", current: "Experience" },
    { route: "/writing", current: "Writing" },
    { route: "/writing/deterministic-checkpoint-recovery", current: "Writing" },
    { route: "/writing/at-least-once-idempotency", current: "Writing" },
    { route: "/resume", current: "Résumé" },
  ] as const;

  for (const { route, current } of routes) {
    await page.goto(route);
    const navigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(navigation.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/#projects");
    await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(navigation.getByRole("link", { name: current })).toHaveAttribute("aria-current", "page");
  }
});

test("social metadata uses the verified site card without leaking it into project pages", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(`${siteConfig.name} — ${siteConfig.title}`);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    `${siteConfig.name} — ${siteConfig.title}`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${siteConfig.url}/og.png`);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", `${siteConfig.url}/og.png`);

  await page.goto("/projects/fault-tolerant-transformer-lab");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Fault-Tolerant Transformer Lab");
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(0);
});

test("public identity and metadata use Ajay without surname leakage", async ({ page }) => {
  const routes = [
    "/",
    "/experience",
    "/writing",
    "/writing/deterministic-checkpoint-recovery",
    "/writing/at-least-once-idempotency",
    "/resume",
    "/projects/fault-tolerant-transformer-lab",
    "/projects/distributed-scale-validation-platform",
    "/projects/voicemed-ai",
  ];

  for (const route of routes) {
    await page.goto(route);
    await expect(page.getByRole("link", { name: "Ajay", exact: true })).toBeVisible();

    const publicIdentity = await page.evaluate(() => ({
      visibleText: document.body.innerText,
      title: document.title,
      metadata: Array.from(document.head.querySelectorAll("meta[content]"), (element) =>
        element.getAttribute("content") ?? "",
      ).join(" "),
      structuredData: Array.from(document.querySelectorAll('script[type="application/ld+json"]'), (element) =>
        element.textContent ?? "",
      ).join(" "),
      accessibleLabels: Array.from(document.querySelectorAll("[aria-label], [title], [alt]"), (element) =>
        [element.getAttribute("aria-label"), element.getAttribute("title"), element.getAttribute("alt")]
          .filter(Boolean)
          .join(" "),
      ).join(" "),
    }));

    expect(publicIdentity.visibleText).not.toMatch(/Ajay (?:Kumar )?Pondugala/i);
    expect(publicIdentity.title).not.toMatch(/Ajay (?:Kumar )?Pondugala/i);
    expect(publicIdentity.metadata).not.toMatch(/Ajay (?:Kumar )?Pondugala/i);
    expect(publicIdentity.structuredData).not.toMatch(/Ajay (?:Kumar )?Pondugala/i);
    expect(publicIdentity.accessibleLabels).not.toMatch(/Ajay (?:Kumar )?Pondugala/i);
    expect(Object.values(publicIdentity).join(" ")).not.toMatch(/evidence checked/i);
  }

  await page.goto("/");
  const personJsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(personJsonLd ?? "{}").name).toBe("Ajay");

  await page.goto("/resume");
  await expect(page.locator("iframe")).toHaveAttribute("title", "Ajay résumé");
  await expect(page.locator("iframe")).toHaveAttribute("src", `${siteConfig.resumePath}#view=FitH`);
  await expect(page.getByRole("link", { name: "Download PDF" })).toHaveAttribute("href", siteConfig.resumePath);
  const resumeResponse = await page.request.get(siteConfig.resumePath);
  expect(resumeResponse.ok()).toBe(true);
  expect(resumeResponse.headers()["x-frame-options"]).toBe("SAMEORIGIN");
});

test("project cards expose one case study link and one GitHub link", async ({ page }) => {
  await page.goto("/");

  for (const project of projects.filter((item) => item.featured)) {
    const card = page.locator("article.project-card").filter({ hasText: project.title });
    await expect(card.getByRole("link", { name: project.title, exact: true })).toHaveAttribute(
      "href",
      `/projects/${project.slug}`,
    );
    await expect(card.getByRole("link", { name: "Open GitHub repository" })).toHaveAttribute(
      "href",
      project.repositoryUrl ?? "",
    );
    await expect(card.getByRole("link")).toHaveCount(2);
    await expect(card.locator("a.status-link")).toHaveCount(0);
    await expect(card.locator(".status")).toHaveText(project.status);
    await expect(card.locator(".project-focus")).toHaveCount(0);
    expect(await card.locator(".tag-list li").count()).toBeLessThanOrEqual(5);
  }
});

test("mobile project titles retain a comfortable touch target", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  for (const title of projects.filter((item) => item.featured).map((item) => item.title)) {
    const target = await page.getByRole("link", { name: title, exact: true }).boundingBox();
    expect(target, title).not.toBeNull();
    expect(target?.height ?? 0, title).toBeGreaterThanOrEqual(44);
  }
});

test("homepage promotes public-safe experience before projects and preserves section destinations", async ({ page }) => {
  await page.goto("/");

  for (const id of ["experience", "projects", "research", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }

  await expect(page.locator("#experience")).toContainText("Software Engineer II at Cisco");
  await expect(page.locator("#experience")).toContainText("Backend delivery, release readiness, and reliability work");
  await expect(page.locator("#experience")).not.toContainText(/customer|internal benchmark|private architecture/i);
  await expect(page.locator("#experience").getByRole("link", { name: "View experience record" })).toHaveAttribute(
    "href",
    "/experience",
  );

  const experiencePrecedesProjects = await page.evaluate(() => {
    const experienceSection = document.querySelector("#experience");
    const projectSection = document.querySelector("#projects");
    if (!experienceSection || !projectSection) return false;
    return Boolean(experienceSection.compareDocumentPosition(projectSection) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(experiencePrecedesProjects).toBe(true);
});

test("contact section offers one primary email action and a visible fallback address", async ({ page }) => {
  await page.goto("/");
  const contactSection = page.locator(".contact-section");
  await expect(contactSection.locator(".contact-actions a")).toHaveCount(1);
  await expect(contactSection.getByRole("link", { name: "Email Ajay in Gmail (opens in a new tab)" })).toHaveAttribute(
    "href",
    siteConfig.gmailComposeUrl,
  );
  await expect(contactSection.getByRole("link", { name: "Email Ajay in Gmail (opens in a new tab)" })).toHaveText(
    /Email Ajay/,
  );
  await expect(contactSection.getByRole("link", { name: "Use your email app" })).toHaveCount(0);
  await expect(contactSection.getByRole("link", { name: siteConfig.email })).toHaveAttribute(
    "href",
    siteConfig.emailHref,
  );
});

test("all project case studies render", async ({ page }) => {
  const slugs = ["fault-tolerant-transformer-lab", "distributed-scale-validation-platform", "voicemed-ai"];
  for (const slug of slugs) {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("What remains unproven")).toBeVisible();
    await expect(page.getByText(/evidence checked/i)).toHaveCount(0);
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

test("mobile header stays compact and project anchors clear it", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  const headerBox = await page.locator(".site-header").boundingBox();
  expect(headerBox).not.toBeNull();
  expect(headerBox?.height).toBeLessThanOrEqual(72);

  await page.getByRole("link", { name: "See projects and code" }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect.poll(() => page.evaluate(() => {
    const header = document.querySelector(".site-header")?.getBoundingClientRect();
    const projects = document.querySelector("#projects")?.getBoundingClientRect();
    if (!header || !projects) return false;
    return projects.top >= header.bottom + 8;
  })).toBe(true);

  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(scrollHeight).toBeLessThanOrEqual(5_600);
});
