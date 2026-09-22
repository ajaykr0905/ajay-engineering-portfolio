import { expect, test } from "@playwright/test";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

test("homepage communicates positioning and evidence path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Distributed Systems and AI Infrastructure Engineer");
  await expect(page.getByRole("link", { name: "See projects and code" })).toHaveAttribute("href", "/#projects");
  await expect(page.getByText("What each project does—and what works today.")).toBeVisible();
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
    await expect(
      card.getByRole("link", { name: `${project.status} · GitHub. Open ${project.title} repository.` }),
    ).toHaveAttribute("href", project.repositoryUrl ?? "");
  }
});

test("contact section offers Gmail and email-app fallbacks", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Email Ajay in Gmail (opens in a new tab)" })).toHaveAttribute(
    "href",
    siteConfig.gmailComposeUrl,
  );
  await expect(page.getByRole("link", { name: "Use your email app" })).toHaveAttribute(
    "href",
    siteConfig.emailHref,
  );
  await expect(page.getByRole("link", { name: siteConfig.email })).toHaveAttribute("href", siteConfig.emailHref);
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
