import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { routes } from "@/lib/routes";

export default function ProjectNotFound() {
  return (
    <SectionContainer className="flex min-h-[calc(100vh-22rem)] items-center py-16">
      <Card className="mx-auto max-w-2xl p-8 text-center md:p-10">
        <p className="font-mono text-sm uppercase tracking-[0.08em] text-primary">
          Project not found
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-normal text-foreground md:text-4xl">
          This project is not available.
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">
          The requested slug does not match a project currently served by the
          backend API.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href={routes.projects} variant="primary">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to Projects
          </Button>
        </div>
      </Card>
    </SectionContainer>
  );
}
