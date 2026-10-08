import { describe, expect, it } from "vitest";
import { primaryNavigation, siteConfig, stack } from "@/lib/site";

describe("public identity", () => {
  it("aligns professional identity while retaining the compact site brand", () => {
    expect(siteConfig.name).toBe("Ajay Kumar Pondugala");
    expect(siteConfig.shortName).toBe("Ajay");
  });

  it("uses the canonical GitHub identity", () => {
    expect(siteConfig.github).toBe("https://github.com/ajaykr0905");
  });

  it("publishes a stable short link for the open-source tracker", () => {
    expect(siteConfig.openSourceTrackerPath).toBe("/opensource_dev");
    expect(siteConfig.openSourceTrackerUrl).toBe(`${siteConfig.url}${siteConfig.openSourceTrackerPath}`);
  });

  it("publishes working email contact destinations", () => {
    expect(siteConfig.emailHref).toBe("mailto:ajaykumar.rob27@gmail.com?subject=Portfolio%20conversation");
    const gmailUrl = new URL(siteConfig.gmailComposeUrl);
    expect(gmailUrl.hostname).toBe("mail.google.com");
    expect(gmailUrl.searchParams.get("to")).toBe(siteConfig.email);
    expect(gmailUrl.searchParams.get("su")).toBe("Portfolio conversation");
  });

  it("keeps recruiter navigation concise", () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual(["Projects", "Experience", "Writing", "Résumé"]);
  });

  it("states the selected engineering position", () => {
    expect(siteConfig.title).toBe("Software Engineer II at Cisco | Backend & Distributed Systems | Go, Java, PostgreSQL, Kubernetes");
    expect(siteConfig.focus).toBe("Backend & Distributed Systems");
    expect(siteConfig.location).toBe("Bengaluru, India");
    expect(siteConfig.website).toBe(siteConfig.url);
    expect(stack).toContain("Go");
    expect(stack).toEqual(expect.arrayContaining(["Java", "PostgreSQL", "RabbitMQ", "NATS", "Kubernetes"]));
  });
});
