import Link from "next/link";
import { primaryNavigation, siteConfig } from "@/lib/site";
import { MotionToggle } from "@/components/motion-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" data-spectrum-option>
          <span className="brand-mark" aria-hidden="true" />
          {" "}
          <span>{siteConfig.name}</span>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} data-spectrum-option>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-controls">
          <MotionToggle />
        </div>
      </div>
    </header>
  );
}
