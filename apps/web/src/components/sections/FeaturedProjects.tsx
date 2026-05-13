import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/lib/routes";
import type { ProjectSummary } from "@/types/project";

type FeaturedProjectsProps = {
  hasError?: boolean;
  projects: ProjectSummary[];
};

export function FeaturedProjects({
  hasError = false,
  projects,
}: FeaturedProjectsProps) {
  return (
    <SectionContainer className="border-t border-border py-18 md:py-20">
      <SectionHeading
        description="A preview of case studies, technical experiments and software engineering projects focused on architecture, performance, data and AI-assisted development."
        title="Featured Engineering Work"
      />

      {projects.length > 0 ? (
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="compact" />
          ))}
        </div>
      ) : (
        <Card className="mt-12 p-8">
          <p className="text-base leading-7 text-muted">
            {hasError
              ? "Featured projects are temporarily unavailable because the backend API could not be reached."
              : "Featured projects will appear here when they are marked as featured in the backend API."}
          </p>
        </Card>
      )}

      <div className="mt-10 flex justify-center">
        <Button href={routes.projects}>
          View All Projects
          <ArrowRight aria-hidden="true" size={16} />
        </Button>
      </div>
    </SectionContainer>
  );
}
