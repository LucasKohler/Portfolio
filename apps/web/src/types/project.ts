export type ProjectStatus =
  | "In Progress"
  | "Case Study"
  | "Draft"
  | "Private Repository"
  | "Live Demo"
  | "Coming Soon";

export type ProjectCategory =
  | "Fullstack"
  | "Frontend"
  | "Backend"
  | "Data"
  | "AI Workflow"
  | "Architecture"
  | "Performance"
  | "Portfolio";

export type ProjectSummary = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  category: ProjectCategory[];
  status: ProjectStatus;
  stack: string[];
  featured: boolean;
  repositoryUrl: string | null;
  liveUrl: string | null;
};

export type Project = ProjectSummary & {
  overview: string;
  purpose: string;
  technicalHighlights: string[];
  implementationNotes: string;
  nextSteps: string[];
};

export type ProjectDetail = Project;
