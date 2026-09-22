import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="text-balance text-4xl font-semibold tracking-tight" {...props} />,
    h2: (props) => <h2 className="mt-12 text-2xl font-semibold tracking-tight" {...props} />,
    p: (props) => <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]" {...props} />,
    a: (props) => <a className="text-[var(--accent)] underline underline-offset-4" {...props} />,
    ...components,
  };
}
