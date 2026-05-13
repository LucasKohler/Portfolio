import { Badge } from "@/components/ui/Badge";
import type { ProjectStatus } from "@/types/project";

type ProjectStatusBadgeProps = {
  status: ProjectStatus;
};

function getStatusVariant(status: ProjectStatus) {
  if (status === "Case Study") {
    return "cyan";
  }

  if (status === "In Progress" || status === "Live Demo") {
    return "primary";
  }

  return "muted";
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
}
