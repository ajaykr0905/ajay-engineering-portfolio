import Link from "next/link";
import { ConstellationGlyph } from "@/components/constellation-glyph";
import type { Project } from "@/lib/projects";
import { StatusPill } from "@/components/status-pill";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card" data-visual-key={project.visualKey}>
      <div className="project-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="project-card-content">
        <div className="project-meta-row">
          <p className="eyebrow">{project.eyebrow}</p>
          <StatusPill
            projectTitle={project.title}
            repositoryUrl={project.repositoryUrl}
            status={project.status}
          />
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

        <p className="project-focus">
          <strong>Current work:</strong> {project.currentFocus}
        </p>

        <ul className="tag-list" aria-label={`${project.title} technologies`}>
          {project.stack.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <footer className="project-links">
          <Link
            className="text-link"
            data-spectrum-option
            href={`/projects/${project.slug}`}
          >
            See how it works <span aria-hidden="true" className="action-arrow">→</span>
          </Link>
          {project.repositoryUrl ? (
            <a className="text-link" data-spectrum-option href={project.repositoryUrl}>
              Open GitHub repository <span aria-hidden="true" className="action-arrow">↗</span>
            </a>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
