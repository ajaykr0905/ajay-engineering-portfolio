import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AmbientConstellation } from "@/components/ambient-constellation";
import { PointerTracker } from "@/components/pointer-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: `${siteConfig.name} portfolio`,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "distributed systems engineer",
    "AI infrastructure engineer",
    "backend engineer",
    "Kubernetes",
    "Go",
    "Java",
    "Python",
    "OpenTelemetry",
    "PyTorch",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: `${siteConfig.name} portfolio`,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ajay Pondugala — Distributed Systems and AI Infrastructure Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

const preferenceBoot = `
  const root = document.documentElement;
  const systemTheme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let theme = systemTheme;
  let motionPreference = 'auto';
  try {
    const savedTheme = localStorage.getItem('theme');
    theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemTheme;
    motionPreference = localStorage.getItem('portfolio-motion') === 'paused' ? 'paused' : 'auto';
  } catch (_) {}
  root.dataset.theme = theme;
  root.dataset.motionPreference = motionPreference;
  root.dataset.reducedMotion = reducedMotion ? 'true' : 'false';
  root.dataset.motion = reducedMotion || motionPreference === 'paused' ? 'paused' : 'active';
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: preferenceBoot }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <AmbientConstellation />
        <PointerTracker />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
