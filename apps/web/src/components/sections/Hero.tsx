import { ArrowRight, FileText } from "lucide-react";
import { HeroPreview } from "@/components/sections/HeroPreview";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export function Hero() {
  return (
    <SectionContainer className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-20 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-normal text-foreground md:text-6xl lg:text-7xl">
          Software Engineer focused on fullstack systems, performance and
          AI-assisted development.
        </h1>

        <p className="mt-9 max-w-2xl text-lg leading-8 text-muted">
          I build fullstack applications, APIs, dashboards and data-driven
          systems with .NET, React, TypeScript and SQL Server — combining
          architecture, performance and AI-assisted workflows to turn complex
          requirements into maintainable software.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Button href={routes.projects} size="lg" variant="primary">
            View Projects
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
          <Button href={siteConfig.links.resume} size="lg">
            <FileText aria-hidden="true" size={18} />
            View Resume
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Badge>4+ Yrs Exp</Badge>
          <Badge>.NET Core</Badge>
          <Badge>React / TS</Badge>
        </div>
      </div>

      <div className="hidden lg:block">
        <HeroPreview />
      </div>

    </SectionContainer>
  );
}
