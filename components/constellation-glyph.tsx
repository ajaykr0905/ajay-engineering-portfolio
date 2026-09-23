import type { ProjectVisualKey } from "@/lib/projects";

type ConstellationGlyphProps = {
  visualKey: ProjectVisualKey;
  size?: "small" | "medium" | "large";
};

function TransformerGlyph() {
  return (
    <>
      <span className="glyph-orbit glyph-orbit-outer" />
      <span className="glyph-orbit glyph-orbit-inner" />
      <span className="glyph-core" />
      <span className="glyph-node glyph-node-one" />
      <span className="glyph-node glyph-node-two" />
      <span className="glyph-node glyph-node-three" />
    </>
  );
}

function DistributedGlyph() {
  return (
    <>
      <span className="glyph-edge glyph-edge-one" />
      <span className="glyph-edge glyph-edge-two" />
      <span className="glyph-edge glyph-edge-three" />
      <span className="glyph-edge glyph-edge-four" />
      <span className="glyph-edge glyph-edge-five" />
      <span className="glyph-packet" />
      <span className="glyph-node glyph-node-one" />
      <span className="glyph-node glyph-node-two" />
      <span className="glyph-node glyph-node-three" />
      <span className="glyph-node glyph-node-four" />
      <span className="glyph-node glyph-node-five" />
    </>
  );
}

function VoiceMedGlyph() {
  return (
    <span className="glyph-wave">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export function ConstellationGlyph({ visualKey, size = "medium" }: ConstellationGlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={`constellation-glyph constellation-glyph-${size}`}
      data-visual-key={visualKey}
    >
      {visualKey === "transformer" ? <TransformerGlyph /> : null}
      {visualKey === "distributed" ? <DistributedGlyph /> : null}
      {visualKey === "voicemed" ? <VoiceMedGlyph /> : null}
    </span>
  );
}
