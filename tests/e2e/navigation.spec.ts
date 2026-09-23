import { expect, test } from "@playwright/test";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

test("homepage communicates positioning and evidence path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Distributed Systems and AI Infrastructure Engineer");
  await expect(page.getByRole("link", { name: "See projects and code" })).toHaveAttribute("href", "/#projects");
  await expect(page.getByText("What each project does—and what works today.")).toBeVisible();
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
  const routes = ["/", "/experience", "/writing", "/resume", "/projects/fault-tolerant-transformer-lab"];

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
  }

  await page.goto("/");
  const personJsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(personJsonLd ?? "{}").name).toBe("Ajay");

  await page.goto("/resume");
  await expect(page.locator("iframe")).toHaveAttribute("title", "Ajay résumé");
  await expect(page.locator("iframe")).toHaveAttribute("src", `${siteConfig.resumePath}#view=FitH`);
  await expect(page.getByRole("link", { name: "Download PDF" })).toHaveAttribute("href", siteConfig.resumePath);
});

test("project cards expose their case study and GitHub repository", async ({ page }) => {
  await page.goto("/");

  for (const project of projects.filter((item) => item.featured)) {
    const card = page.locator("article.project-card").filter({ hasText: project.title });
    await expect(card.getByRole("link", { name: "See how it works" })).toHaveAttribute(
      "href",
      `/projects/${project.slug}`,
    );
    await expect(card.getByRole("link", { name: "Open GitHub repository" })).toHaveAttribute(
      "href",
      project.repositoryUrl ?? "",
    );
    const statusLink = card.locator("a.status-link");
    await expect(statusLink).toHaveAttribute("href", project.repositoryUrl ?? "");
    await expect(statusLink).toContainText(project.status);
    await expect(statusLink).toContainText("GitHub");
  }
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
