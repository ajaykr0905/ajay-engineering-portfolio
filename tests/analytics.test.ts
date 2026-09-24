import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("page-view analytics", () => {
  const rootLayout = readFileSync(resolve(process.cwd(), "app", "layout.tsx"), "utf8");

  it("loads Vercel Analytics once from the shared root layout", () => {
    expect(rootLayout).toContain('import { Analytics } from "@vercel/analytics/next";');
    expect(rootLayout.match(/<Analytics\s*\/>/g)).toHaveLength(1);
  });

  it("renders analytics after the shared page chrome only on Vercel", () => {
    expect(rootLayout).toContain('const isVercelDeployment = process.env.VERCEL === "1";');
    expect(rootLayout).toContain("{isVercelDeployment ? <Analytics /> : null}");
    expect(rootLayout.indexOf("<SiteFooter />")).toBeLessThan(
      rootLayout.indexOf("{isVercelDeployment ? <Analytics /> : null}"),
    );
  });
});
