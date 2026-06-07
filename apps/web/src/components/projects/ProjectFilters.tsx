"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { cn } from "@/lib/cn";
import type { ProjectCategory, ProjectSummary } from "@/types/project";

const filters = [
  "All",
  "Fullstack",
  "Frontend",
  "Backend",
  "Data",
  "AI Workflow",
  "Architecture",
] as const;

type ProjectFilter = (typeof filters)[number];

type ProjectFiltersProps = {
  hasError?: boolean;
  projects: ProjectSummary[];
};

function matchesCategory(project: ProjectSummary, selectedFilter: ProjectFilter) {
  return (
    selectedFilter === "All" ||
    project.category.includes(selectedFilter as ProjectCategory)
  );
}

function matchesSearch(project: ProjectSummary, search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  const searchableText = [
    project.title,
    project.description,
    project.summary,
    project.status,
    ...project.category,
    ...project.stack,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearch);
}

export function ProjectFilters({
  hasError = false,
  projects,
}: ProjectFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ProjectFilter>("All");

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          matchesCategory(project, selectedFilter) &&
          matchesSearch(project, search),
      ),
    [projects, search, selectedFilter],
  );

  const emptyMessage = hasError
    ? "Project data is temporarily unavailable because the backend API could not be reached."
    : "No projects match the current search and filters.";

  return (
    <div>
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center">
        <label className="relative w-full md:w-72">
          <span className="sr-only">Search projects</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            size={20}
          />
          <input
            className="min-h-12 w-full rounded-md border border-border bg-background px-11 text-base text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects..."
            type="search"
            value={search}
          />
        </label>

        <div
          aria-label="Project category filters"
          className="flex flex-wrap gap-2"
          role="group"
        >
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter;

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "min-h-9 rounded border px-3 font-mono text-sm transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.97] motion-reduce:active:scale-100",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-[rgba(255,255,255,0.05)] text-muted hover:border-[#444] hover:text-foreground",
                )}
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <ProjectGrid emptyMessage={emptyMessage} projects={filteredProjects} />
    </div>
  );
}
