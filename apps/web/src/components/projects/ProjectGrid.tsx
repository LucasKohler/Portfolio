import { ProjectCard } from "@/components/projects/ProjectCard";
import { Card } from "@/components/ui/Card";
import type { ProjectSummary } from "@/types/project";

type ProjectGridProps = {
  emptyMessage?: string;
  projects: ProjectSummary[];
};

export function ProjectGrid({ emptyMessage, projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <Card className="p-8">
        <p className="text-base leading-7 text-muted">
          {emptyMessage ?? "No projects found for the current filters."}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
