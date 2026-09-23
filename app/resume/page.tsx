import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé for ${siteConfig.name}, distributed systems and AI infrastructure engineer.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="shell page-shell resume-page">
      <header className="page-header resume-header" data-cosmos-mask>
        <div>
          <p className="eyebrow">Résumé</p>
          <h1>Engineering experience and evidence.</h1>
          <p>The downloadable PDF is the canonical recruiter copy. Project case studies provide deeper implementation context.</p>
        </div>
        <a className="button button-primary" href={siteConfig.resumePath} download data-spectrum-option>Download PDF</a>
      </header>
      <div className="resume-frame-wrap">
        <iframe className="resume-frame" title={`${siteConfig.name} résumé`} src={`${siteConfig.resumePath}#view=FitH`} />
        <p className="resume-fallback">If the embedded preview is unavailable, <a href={siteConfig.resumePath} data-spectrum-option>open the PDF directly</a>.</p>
      </div>
    </div>
  );
}
