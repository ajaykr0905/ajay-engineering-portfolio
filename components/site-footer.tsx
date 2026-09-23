import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <p className="footer-name">{siteConfig.name}</p>
          <p className="muted">Built with public-safe evidence and explicit limitations.</p>
        </div>
        <div className="footer-links" aria-label="Contact links">
          <a href={siteConfig.gmailComposeUrl} rel="noreferrer" target="_blank" data-spectrum-option>Gmail</a>
          <a href={siteConfig.linkedin} rel="noreferrer" data-spectrum-option>LinkedIn</a>
          <a href={siteConfig.github} rel="noreferrer" data-spectrum-option>GitHub</a>
          <a href={siteConfig.website} rel="noreferrer" data-spectrum-option>Website</a>
          <Link href="/resume" data-spectrum-option>Résumé</Link>
        </div>
      </div>
    </footer>
  );
}
