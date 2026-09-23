import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";
import { writingArticles } from "@/lib/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/experience", "/writing", "/resume"];
  return [
    ...routes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: new Date("2026-09-22"), changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...projects.map((project) => ({ url: `${siteConfig.url}/projects/${project.slug}`, lastModified: new Date(project.lastVerified), changeFrequency: "weekly" as const, priority: project.featured ? 0.9 : 0.6 })),
    ...writingArticles.map((article) => ({ url: `${siteConfig.url}/writing/${article.slug}`, lastModified: new Date(article.updatedAt), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
