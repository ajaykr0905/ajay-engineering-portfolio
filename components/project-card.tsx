import Link from "next/link";
import { ConstellationGlyph } from "@/components/constellation-glyph";
import type { Project } from "@/lib/projects";
import { StatusPill } from "@/components/status-pill";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const visibleStack = project.stack.slice(0, 4);
  const remainingStackCount = project.stack.length - visibleStack.length;

  return (
    <article className="project-card" data-visual-key={project.visualKey}>
      <div className="project-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="project-card-content">
        <div className="project-meta-row">
          <p className="eyebrow">{project.eyebrow}</p>
          <StatusPill status={project.status} />
        </div>

        <div className="project-title-row">
          <h3>
            <Link
              className="project-primary-link"
              data-spectrum-primary
              href={`/projects/${project.slug}`}
            >
              <span>{project.title}</span>
              <span aria-hidden="true" className="action-arrow">↗</span>
            </Link>
          </h3>
          <div className="project-card-glyph" aria-hidden="true">
            <ConstellationGlyph size="small" visualKey={project.visualKey} />
          </div>
        </div>

        <p className="project-summary">{project.summary}</p>

        <ul className="tag-list" aria-label={`${project.title} technologies`}>
          {visibleStack.map((item) => <li key={item}>{item}</li>)}
          {remainingStackCount > 0 ? (
            <li aria-label={`${remainingStackCount} more technologies`}>+{remainingStackCount}</li>
          ) : null}
        </ul>

        <footer className="project-links">
          {project.repositoryUrl ? (
            <a className="text-link" data-spectrum-option href={project.repositoryUrl} rel="noreferrer">
              Open GitHub repository <span aria-hidden="true" className="action-arrow">↗</span>
            </a>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
