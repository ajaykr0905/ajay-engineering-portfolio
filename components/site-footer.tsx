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
          <a href={`mailto:${siteConfig.email}`}>Email</a>
          <a href={siteConfig.linkedin} rel="noreferrer">LinkedIn</a>
          <a href={siteConfig.github} rel="noreferrer">GitHub</a>
          <Link href="/resume">Résumé</Link>
        </div>
      </div>
    </footer>
  );
}
