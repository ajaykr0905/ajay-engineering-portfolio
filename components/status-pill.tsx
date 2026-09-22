import type { Project } from "@/lib/projects";

export function StatusPill({ status }: { status: Project["status"] }) {
  return <span className={`status status-${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}
