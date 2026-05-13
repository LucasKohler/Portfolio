import { ArrowRight, Braces, FileText, Layers3, Server } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[30rem] rounded-lg border border-border bg-surface p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="mb-5 flex items-center justify-between border-b border-border pb-4 font-mono text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <Server aria-hidden="true" size={14} />
          API / Frontend / Data
        </span>
        <span className="text-primary">Maintainable Systems</span>
      </div>

      <div className="rounded border border-border bg-background p-5">
        <div className="h-2 w-3/4 rounded bg-[#24272c]" />
        <div className="mt-4 h-2 w-1/2 rounded bg-[#24272c]" />
        <div className="mt-4 h-2 w-5/6 rounded bg-primary/45" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="min-h-32 rounded border border-border bg-background p-4">
          <Layers3 aria-hidden="true" className="text-primary" size={20} />
          <p className="mt-14 font-mono text-xs font-semibold text-foreground">
            Architecture
          </p>
        </div>
        <div className="min-h-32 rounded border border-primary/25 bg-background p-4">
          <Braces aria-hidden="true" className="text-primary" size={20} />
          <p className="mt-14 font-mono text-xs font-semibold text-foreground">
            AI Workflow
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-6 -top-6 hidden h-24 w-24 border border-primary/20 md:block" />
      <div className="pointer-events-none absolute -bottom-5 -left-5 hidden h-20 w-20 border border-border md:block" />
    </div>
  );
}

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
