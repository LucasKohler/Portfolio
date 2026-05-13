import { ArrowRight, FileText, GitBranch, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

type ContactCTAProps = {
  compact?: boolean;
};

export function ContactCTA({ compact = false }: ContactCTAProps) {
  return (
    <SectionContainer
      className={cn(
        "border-t border-border text-center",
        compact ? "py-16 md:py-18" : "py-18 md:py-20",
      )}
      id="contact"
    >
      <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-foreground md:text-4xl">
        Let’s build reliable software with measurable impact.
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted">
        Available for Software Engineer, Fullstack, Frontend, .NET, React and
        AI-assisted development opportunities.
      </p>

      <p className="mt-6 font-mono text-sm text-muted">
        Remote from Brazil · Open to remote opportunities
      </p>

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-4">
        <Button href={siteConfig.links.email} size="lg" variant="primary">
          Contact Me
          <Mail aria-hidden="true" size={18} />
        </Button>
        <Button href={siteConfig.links.resume} size="lg">
          <FileText aria-hidden="true" size={18} />
          View Resume
        </Button>
        <Button href={siteConfig.links.github} size="lg">
          <GitBranch aria-hidden="true" size={18} />
          View GitHub
        </Button>
        <Button href={siteConfig.links.linkedin} size="lg">
          LinkedIn
          <ArrowRight aria-hidden="true" size={18} />
        </Button>
      </div>
    </SectionContainer>
  );
}
