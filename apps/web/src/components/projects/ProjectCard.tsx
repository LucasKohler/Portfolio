import { ArrowRight, Code2, ExternalLink, Lock, MonitorUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { routes } from "@/lib/routes";
import type { ProjectSummary } from "@/types/project";

type ProjectCardProps = {
  project: ProjectSummary;
};

function getStatusVariant(status: ProjectSummary["status"]) {
  if (status === "Case Study") {
    return "cyan";
  }

  if (status === "In Progress" || status === "Live Demo") {
    return "primary";
  }

  return "muted";
}

function ProjectLinkIcon({ project }: ProjectCardProps) {
  if (project.liveUrl) {
    return <ExternalLink aria-hidden="true" size={18} />;
  }

  if (project.repositoryUrl) {
    return <Code2 aria-hidden="true" size={18} />;
  }

  if (project.status === "Private Repository") {
    return <Lock aria-hidden="true" size={18} />;
  }

  return <MonitorUp aria-hidden="true" size={18} />;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const primaryCategory = project.category[0] ?? "Project";

  return (
    <Card
      className="group flex min-h-[19rem] flex-col overflow-hidden p-0"
      interactive
    >
      <div className="flex min-h-14 items-center justify-between gap-4 border-b border-border px-6 py-4">
        <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
        <span className="text-right font-mono text-xs text-muted">
          {project.category.join(" / ")}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 py-7">
        <p className="mb-3 font-mono text-xs text-primary/80">
          {primaryCategory}
        </p>
        <h3 className="text-2xl font-semibold leading-tight tracking-normal text-foreground">
          {project.title}
        </h3>
        <p className="mt-4 line-clamp-4 text-base leading-7 text-muted">
          {project.summary || project.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((item) => (
            <Badge key={item} variant="muted">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <Link
        className="flex min-h-14 items-center justify-between gap-4 border-t border-border bg-surface-inset px-6 font-mono text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
        href={routes.projectDetail(project.slug)}
      >
        <span>View Project</span>
        <span className="flex items-center gap-3 text-muted transition-colors group-hover:text-primary">
          <ArrowRight aria-hidden="true" size={16} />
          <ProjectLinkIcon project={project} />
        </span>
      </Link>
    </Card>
  );
}
