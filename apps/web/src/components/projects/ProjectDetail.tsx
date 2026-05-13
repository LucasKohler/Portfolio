import {
  ArrowLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Hourglass,
  Lock,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { routes } from "@/lib/routes";
import type { Project } from "@/types/project";

type ProjectDetailProps = {
  project: Project;
};

type DetailSectionProps = {
  children: ReactNode;
  title: string;
};

function DetailSection({ children, title }: DetailSectionProps) {
  return (
    <section>
      <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-normal text-foreground md:text-3xl">
        {title}
      </h2>
      <Card className="p-6 md:p-7">{children}</Card>
    </section>
  );
}

function ProjectActions({ project }: ProjectDetailProps) {
  return (
    <div className="flex flex-col gap-4">
      {project.liveUrl ? (
        <Button href={project.liveUrl} size="lg" variant="primary">
          <ExternalLink aria-hidden="true" size={18} />
          Live Demo
        </Button>
      ) : (
        <Button disabled size="lg">
          <Hourglass aria-hidden="true" size={18} />
          Live Demo Coming Soon
        </Button>
      )}

      {project.repositoryUrl ? (
        <Button href={project.repositoryUrl} size="lg">
          <Code2 aria-hidden="true" size={18} />
          GitHub Repository
        </Button>
      ) : (
        <Button disabled size="lg">
          <Lock aria-hidden="true" size={18} />
          Private Repository
        </Button>
      )}
    </div>
  );
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <SectionContainer className="py-12 md:py-16">
      <div className="mb-12 flex flex-col gap-5 font-mono text-sm text-muted md:flex-row md:items-center">
        <Button href={routes.projects} size="sm" variant="secondary">
          <ArrowLeft aria-hidden="true" size={16} />
          Back to Projects
        </Button>

        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
          <Link className="hover:text-foreground" href={routes.home}>
            Home
          </Link>
          <ChevronRight aria-hidden="true" size={14} />
          <Link className="hover:text-foreground" href={routes.projects}>
            Projects
          </Link>
          <ChevronRight aria-hidden="true" size={14} />
          <span className="text-primary">{project.title}</span>
        </nav>
      </div>

      <header className="mb-10 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.1] tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-muted md:text-xl">
            {project.summary}
          </p>
        </div>

        <div className="shrink-0">
          <ProjectStatusBadge status={project.status} />
        </div>
      </header>

      <div className="mb-18 flex aspect-[21/9] min-h-56 items-center justify-center rounded-lg border border-border bg-surface text-center">
        <span className="px-6 font-mono text-xs uppercase tracking-[0.12em] text-muted/70">
          Main Visual Preview Placeholder
        </span>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-14">
          <DetailSection title="Overview">
            <p className="text-base leading-8 text-muted">{project.overview}</p>
          </DetailSection>

          <DetailSection title="Purpose">
            <p className="text-base leading-8 text-muted">{project.purpose}</p>
          </DetailSection>

          <DetailSection title="Technical Highlights">
            <ul className="space-y-3 text-base leading-8 text-muted">
              {project.technicalHighlights.map((highlight) => (
                <li className="flex gap-3" key={highlight}>
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Implementation Notes">
            <p className="text-base leading-8 text-muted">
              {project.implementationNotes}
            </p>
          </DetailSection>

          <DetailSection title="Current Status / Next Steps">
            <div className="space-y-6 text-base leading-8 text-muted">
              <p>
                <strong className="font-semibold text-foreground">
                  Status:
                </strong>{" "}
                {project.status}
              </p>
              <div>
                <strong className="font-semibold text-foreground">
                  Next steps:
                </strong>
                <ul className="mt-4 space-y-3">
                  {project.nextSteps.map((nextStep) => (
                    <li className="flex gap-3" key={nextStep}>
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{nextStep}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DetailSection>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <Card className="p-6">
            <h2 className="mb-5 font-mono text-sm uppercase tracking-[0.08em] text-muted">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 font-mono text-sm uppercase tracking-[0.08em] text-muted">
              Project Type
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.category.map((category) => (
                <Badge key={category} variant="muted">
                  {category}
                </Badge>
              ))}
            </div>
          </Card>

          <ProjectActions project={project} />
        </aside>
      </div>
    </SectionContainer>
  );
}
