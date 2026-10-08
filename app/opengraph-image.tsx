import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — Backend & Distributed Systems`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: "72px", background: "#080808", color: "#f1f1ed" }}>
        <div style={{ display: "flex", fontSize: 26, color: "#b4b4ad", marginBottom: 32 }}>{siteConfig.name} · Bengaluru, India</div>
        <div style={{ display: "flex", fontSize: 70, fontWeight: 700, lineHeight: 1.1 }}>Backend &amp; Distributed Systems</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 38 }}>Software Engineer II at Cisco</div>
        <div style={{ display: "flex", fontSize: 24, color: "#b4b4ad", marginTop: 16 }}>Go · Java · PostgreSQL · Kubernetes</div>
        <div style={{ display: "flex", fontSize: 20, color: "#b4b4ad", marginTop: 38 }}>Merged NATS + Prometheus contributions · Reproducible reliability labs</div>
      </div>
    ),
    size,
  );
}
