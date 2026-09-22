import type { Project } from "@/lib/projects";

type StatusPillProps = {
  status: Project["status"];
  repositoryUrl?: string;
  projectTitle?: string;
};

export function StatusPill({ status, repositoryUrl, projectTitle }: StatusPillProps) {
  const className = `status status-${status.toLowerCase().replace(" ", "-")}`;

  if (repositoryUrl && projectTitle) {
    return (
      <a
        aria-label={`${status} · GitHub. Open ${projectTitle} repository.`}
        className={`${className} status-link`}
        href={repositoryUrl}
      >
        <span>{status}</span>
        <span aria-hidden="true">· GitHub ↗</span>
      </a>
    );
  }

  return <span className={className}>{status}</span>;
}
