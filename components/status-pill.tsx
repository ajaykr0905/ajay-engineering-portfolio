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
      <a className={`${className} status-link`} href={repositoryUrl}>
        <span>{status}</span>
        <span>· GitHub</span>
        <span className="sr-only">{` — open ${projectTitle} repository`}</span>
      </a>
    );
  }

  return <span className={className}>{status}</span>;
}
