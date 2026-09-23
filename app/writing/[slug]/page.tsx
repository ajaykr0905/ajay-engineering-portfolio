import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { siteConfig } from "@/lib/site";
import {
  getWritingArticle,
  writingArticles,
  type WritingSlug,
} from "@/lib/writing";

type ArticleModule = { default: ComponentType };

const articleLoaders = {
  "deterministic-checkpoint-recovery": () => import("@/content/writing/deterministic-checkpoint-recovery.mdx"),
  "at-least-once-idempotency": () => import("@/content/writing/at-least-once-idempotency.mdx"),
} satisfies Record<WritingSlug, () => Promise<ArticleModule>>;

export function generateStaticParams() {
  return writingArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getWritingArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/writing/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.name],
      images: [],
    },
    twitter: {
      title: article.title,
      description: article.summary,
      images: [],
    },
  };
}

export default async function WritingArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getWritingArticle(slug);
  if (!article) notFound();

  const { default: ArticleContent } = await articleLoaders[article.slug]();
  const articleUrl = `${siteConfig.url}/writing/${article.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    isPartOf: { "@type": "WebSite", name: `${siteConfig.name} portfolio`, url: siteConfig.url },
  };

  return (
    <article className="shell page-shell article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Link className="back-link" data-spectrum-option href="/writing">
        <span aria-hidden="true" className="action-arrow">←</span> All writing
      </Link>

      <header className="article-header" data-cosmos-mask>
        <p className="eyebrow">{article.eyebrow}</p>
        <h1>{article.title}</h1>
        <p className="article-deck">{article.summary}</p>
        <dl className="article-meta" aria-label="Article details">
          <div><dt>Published</dt><dd><time dateTime={article.publishedAt}>{article.publishedLabel}</time></dd></div>
          <div><dt>Reading time</dt><dd>{article.readingMinutes} minutes</dd></div>
          <div><dt>Evidence commit</dt><dd><a href={article.sourceCommitUrl} rel="noreferrer">{article.sourceCommit.slice(0, 8)}</a></dd></div>
        </dl>
      </header>

      <div className="article-layout">
        <aside className="article-context" aria-label="Related implementation">
          <p className="eyebrow">Implementation</p>
          <Link className="text-link" data-spectrum-option href={article.projectPath}>
            {article.projectLabel} <span aria-hidden="true" className="action-arrow">→</span>
          </Link>
          <a className="text-link" data-spectrum-option href={article.repositoryUrl} rel="noreferrer">
            Repository <span aria-hidden="true" className="action-arrow">↗</span>
          </a>
          <a className="text-link" data-spectrum-option href={article.sourceCommitUrl} rel="noreferrer">
            Pinned source snapshot <span aria-hidden="true" className="action-arrow">↗</span>
          </a>
        </aside>
        <div className="article-prose" data-cosmos-mask>
          <ArticleContent />
        </div>
      </div>
    </article>
  );
}
