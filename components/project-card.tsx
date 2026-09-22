import Link from "next/link";
import type { Project } from "@/lib/projects";
import { StatusPill } from "@/components/status-pill";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card">
      <div className="project-index" aria-hidden="true">0{index + 1}</div>
      <div className="project-card-content">
        <div className="project-meta-row">
          <p className="eyebrow">{project.eyebrow}</p>
          <StatusPill
            projectTitle={project.title}
            repositoryUrl={project.repositoryUrl}
            status={project.status}
          />
        </div>
        <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p className="project-summary">{project.summary}</p>
        <p className="project-focus"><strong>Current work:</strong> {project.currentFocus}</p>
        <ul className="tag-list" aria-label={`${project.title} technologies`}>
          {project.stack.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="project-links">
          <Link className="text-link" href={`/projects/${project.slug}`}>
            See how it works <span aria-hidden="true">→</span>
          </Link>
          {project.repositoryUrl ? (
            <a className="text-link" href={project.repositoryUrl}>
              Open GitHub repository <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
