import { ImageResponse } from "next/og";

export const alt = "Ajay Kumar Pondugala — Distributed Systems and AI Infrastructure Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#07100d", color: "#f4f7f5", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, color: "#81efb5" }}>
        <div style={{ width: 18, height: 18, borderRadius: 99, background: "#56e39f" }} />
        Ajay Kumar Pondugala
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 76, lineHeight: 1.04, letterSpacing: -3, fontWeight: 700, maxWidth: 1000 }}>Distributed Systems and AI Infrastructure Engineer</div>
        <div style={{ fontSize: 30, color: "#a9b8b1" }}>Public projects with working code, tests, setup guides, and honest limitations</div>
      </div>
      <div style={{ display: "flex", gap: 24, fontFamily: "monospace", color: "#81efb5", fontSize: 24 }}>Go · Java · Python · Kubernetes · PyTorch</div>
    </div>,
    size,
  );
}
