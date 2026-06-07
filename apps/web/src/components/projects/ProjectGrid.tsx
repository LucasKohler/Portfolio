"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Card } from "@/components/ui/Card";
import {
  filterItem,
  staggerContainer,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { ProjectSummary } from "@/types/project";

type ProjectGridProps = {
  className?: string;
  emptyMessage?: string;
  projects: ProjectSummary[];
  variant?: "default" | "compact";
};

export function ProjectGrid({
  className,
  emptyMessage,
  projects,
  variant = "default",
}: ProjectGridProps) {
  const reducedMotion = usePrefersReducedMotion();

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
    <motion.div
      animate="visible"
      className={cn(
        "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      initial={reducedMotion ? false : "hidden"}
      variants={reducedMotion ? undefined : staggerContainer}
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <motion.div
            animate={reducedMotion ? undefined : "visible"}
            exit={reducedMotion ? undefined : "exit"}
            initial={reducedMotion ? false : "hidden"}
            key={project.slug}
            layout={!reducedMotion}
            variants={reducedMotion ? undefined : filterItem}
          >
            <ProjectCard project={project} variant={variant} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
