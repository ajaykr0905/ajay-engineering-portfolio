import Link from "next/link";
import { primaryNavigation, siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`AP ${siteConfig.shortName}, home`}>
          <span className="brand-mark" aria-hidden="true">AP</span>
          <span>{siteConfig.shortName}</span>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
