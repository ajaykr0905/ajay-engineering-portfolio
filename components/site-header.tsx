import Link from "next/link";
import { MotionToggle } from "@/components/motion-toggle";
import { PrimaryNavigation } from "@/components/primary-navigation";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link aria-label={siteConfig.name} className="brand" href="/" data-spectrum-option>
          <span className="brand-mark" aria-hidden="true" />
          {" "}
          <span className="brand-name">{siteConfig.name}</span>
        </Link>
        <PrimaryNavigation />
        <div className="header-controls">
          <MotionToggle />
        </div>
      </div>
    </header>
  );
}
