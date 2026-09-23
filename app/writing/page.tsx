import type { Metadata } from "next";
import Link from "next/link";
import { writingArticles } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Engineering notes on AI infrastructure, distributed systems, reliability, and reproducible experiments.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  return (
    <div className="shell page-shell">
      <header className="page-header" data-cosmos-mask>
        <p className="eyebrow">Writing and evidence</p>
        <h1>Notes that connect implementation to engineering judgment.</h1>
        <p>Long-form records of the contracts, rejected approaches, executable tests, tradeoffs, and limitations behind the public labs.</p>
      </header>
      <section className="note-list" aria-label="Technical writing">
        {writingArticles.map((article) => (
          <article className="note-card" key={article.slug}>
            <div className="note-date">
              <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
              <span>{article.readingMinutes} min read</span>
            </div>
            <div data-cosmos-mask>
              <p className="eyebrow">{article.eyebrow}</p>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              <Link className="text-link" data-spectrum-option href={`/writing/${article.slug}`}>
                Read the article <span aria-hidden="true" className="action-arrow">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
      <aside className="writing-source-note" data-cosmos-mask aria-label="Public learning archive">
        <p className="eyebrow">Learning archive</p>
        <p>Daily exercises, tests, and implementation notes remain available in the public AI engineering journey.</p>
        <a className="text-link" data-spectrum-option href="https://github.com/ajaykr0905/ai-journey" rel="noreferrer">
          Open the AI Journey repository <span aria-hidden="true" className="action-arrow">↗</span>
        </a>
      </aside>
    </div>
  );
}
