import { ArrowRight, Code2, ExternalLink, Lock, MonitorUp } from "lucide-react";
import Link from "next/link";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import type { ProjectSummary } from "@/types/project";

type ProjectCardProps = {
  project: ProjectSummary;
  variant?: "default" | "compact";
};

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

export function ProjectCard({ project, variant = "default" }: ProjectCardProps) {
  const primaryCategory = project.category[0] ?? "Project";
  const isCompact = variant === "compact";

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden p-0",
        isCompact ? "min-h-[18rem]" : "min-h-[27rem]",
      )}
      interactive
    >
      <div
        className={cn(
          "flex min-h-14 items-center justify-between gap-4 border-b border-border px-6 py-4",
          isCompact && "px-5 py-3",
        )}
      >
        <ProjectStatusBadge status={project.status} />
        <span className="text-right font-mono text-xs leading-5 text-muted">
          {project.category.join(" / ")}
        </span>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col px-6 py-7",
          isCompact && "px-5 py-5",
        )}
      >
        <p className="mb-3 font-mono text-xs text-primary/80">
          {primaryCategory}
        </p>
        <h3
          className={cn(
            "font-semibold leading-tight tracking-normal text-foreground",
            isCompact ? "text-xl" : "text-2xl md:text-3xl",
          )}
        >
          {project.title}
        </h3>
        <p
          className={cn(
            "mt-4 text-base leading-7 text-muted",
            isCompact ? "line-clamp-3" : "line-clamp-5",
          )}
        >
          {project.summary || project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-7">
          {project.stack.slice(0, isCompact ? 3 : 5).map((item) => (
            <Badge key={item} variant="muted">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <Link
        className={cn(
          "flex min-h-14 items-center justify-between gap-4 border-t border-border bg-surface-inset px-6 font-mono text-sm font-semibold text-foreground transition-colors group-hover:text-primary active:scale-[0.99] motion-reduce:active:scale-100",
          isCompact && "px-5",
        )}
        href={routes.projectDetail(project.slug)}
      >
        <span>View Project</span>
        <span className="flex items-center gap-3 text-muted transition-[color,transform] duration-300 group-hover:text-primary">
          <ArrowRight
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
            size={16}
          />
          <ProjectLinkIcon project={project} />
        </span>
      </Link>
    </Card>
  );
}
