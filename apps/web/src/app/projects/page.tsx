import { ContactCTA } from "@/components/sections/ContactCTA";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { getProjects } from "@/lib/api";
import type { ProjectSummary } from "@/types/project";

export const dynamic = "force-dynamic";

async function loadProjects(): Promise<{
  hasError: boolean;
  projects: ProjectSummary[];
}> {
  try {
    return {
      hasError: false,
      projects: await getProjects(),
    };
  } catch {
    return {
      hasError: true,
      projects: [],
    };
  }
}

export default async function ProjectsPage() {
  const { hasError, projects } = await loadProjects();

  return (
    <>
      <SectionContainer className="py-16 md:py-20">
        <header className="max-w-4xl">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Selected Engineering Projects
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-muted md:text-xl">
            A growing collection of software engineering projects, case
            studies, experiments and technical implementations.
          </p>
        </header>

        <div className="mt-16">
          <ProjectFilters hasError={hasError} projects={projects} />
        </div>
      </SectionContainer>

      <ContactCTA compact />
    </>
  );
}
