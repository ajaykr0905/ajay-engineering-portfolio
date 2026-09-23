import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="article-content-heading article-content-heading-primary" {...props} />,
    h2: (props) => <h2 className="article-content-heading" {...props} />,
    h3: (props) => <h3 className="article-content-subheading" {...props} />,
    p: (props) => <p className="article-content-copy" {...props} />,
    a: (props) => <a className="article-content-link" {...props} />,
    ul: (props) => <ul className="article-content-list" {...props} />,
    ol: (props) => <ol className="article-content-list" {...props} />,
    li: (props) => <li className="article-content-list-item" {...props} />,
    blockquote: (props) => <blockquote className="article-callout" {...props} />,
    pre: (props) => <pre className="article-code-block" {...props} />,
    code: (props) => <code className="article-code" {...props} />,
    hr: (props) => <hr className="article-divider" {...props} />,
    ...components,
  };
}
