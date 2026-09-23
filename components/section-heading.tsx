import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: ReactNode }) {
  return (
    <div className="section-heading" data-cosmos-mask>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {aside ? <div>{aside}</div> : null}
    </div>
  );
}
