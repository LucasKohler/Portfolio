# COMPONENTS.md

## Component Architecture

The portfolio must be implemented as a reusable system across frontend and backend boundaries.

Do not build the site as copied static markup from the Stitch export.

---

## Frontend Structure

Recommended structure:

```txt
apps/web/
  src/
    app/
      layout.tsx
      page.tsx
      projects/
        page.tsx
        [slug]/
          page.tsx

    components/
      layout/
        Navbar.tsx
        Footer.tsx

      sections/
        Hero.tsx
        ValueSection.tsx
        FeaturedProjects.tsx
        ContactCTA.tsx

      projects/
        ProjectCard.tsx
        ProjectGrid.tsx
        ProjectFilters.tsx
        ProjectDetail.tsx
        ProjectStatusBadge.tsx

      ui/
        Button.tsx
        Badge.tsx
        Card.tsx
        SectionContainer.tsx
        SectionHeading.tsx

    lib/
      api.ts
      projects.ts
      routes.ts

    types/
      project.ts
      api.ts

    config/
      site.ts
```

---

## Backend Structure

Recommended structure:

```txt
apps/api/
  src/
    Portfolio.Api/
      Endpoints/
        ProjectsEndpoints.cs
        ContactEndpoints.cs
        HealthEndpoints.cs
      Configuration/
        CorsConfiguration.cs
        OpenApiConfiguration.cs
      Program.cs

    Portfolio.Application/
      Projects/
        GetProjects/
        GetProjectBySlug/
      Contact/
        SubmitContact/
      Common/

    Portfolio.Domain/
      Projects/
        Project.cs
        ProjectStatus.cs
        ProjectCategory.cs
      Contact/

    Portfolio.Infrastructure/
      Projects/
        JsonProjectRepository.cs
      Data/
        projects.json

  tests/
    Portfolio.Api.Tests/
    Portfolio.Application.Tests/
```

Keep the API simple at first, but do not put all logic directly in `Program.cs`.

---

## Layout Components

### `Navbar`

Purpose:

Primary navigation.

Links:

- Home
- Journey
- Skills
- Projects
- Contact

Rules:

- One shared component.
- Used across all pages.
- Projects links to `/projects`.
- Contact scrolls to the Contact section.
- Use active route state if practical.

---

### `Footer`

Purpose:

Simple closing navigation.

Footer must be identical across every page.

Content:

Left side:

- Lucas Kohler Marques
- Software Engineer
- Built with modern web technologies.

Right side:

- GitHub
- LinkedIn
- Email
- Resume

Rules:

- Use one shared component.
- Do not create footer variants.
- Do not include Twitter.
- Do not include copyright text unless explicitly requested.
- Do not use “Built with precision”.
- Must match the Home footer across all routes.

---

## Section Components

### `Hero`

Purpose:

Introduce Lucas and establish positioning.

Headline:

```txt
Software Engineer focused on fullstack systems, performance and AI-assisted development.
```

Supporting text:

```txt
I build fullstack applications, APIs, dashboards and data-driven systems with .NET, React, TypeScript and SQL Server — combining architecture, performance and AI-assisted workflows to turn complex requirements into maintainable software.
```

CTAs:

- View Projects
- View Resume

Rules:

- Do not include Contact Me in the Hero.
- Keep credibility badges.
- Preserve the technical visual on the right.

---

### `ValueSection`

Purpose:

Show what Lucas brings to engineering teams.

Cards:

1. Product-minded engineering
2. Fullstack execution
3. Performance and maintainability
4. AI-assisted productivity

Rules:

- Use reusable cards.
- Keep copy concise and business-oriented.

---

### `FeaturedProjects`

Purpose:

Preview selected projects on the Home page.

Rules:

- Fetch or derive projects marked as `featured`.
- Use the same project model used by `/projects`.
- Do not hardcode full project cards manually.
- Include `View All Projects`.

---

### `ContactCTA`

Purpose:

Final conversion section.

Content:

Headline:

```txt
Let’s build reliable software with measurable impact.
```

Supporting text:

```txt
Available for Software Engineer, Fullstack, Frontend, .NET, React and AI-assisted development opportunities.
```

Availability line:

```txt
Remote from Brazil · Open to remote opportunities
```

Buttons:

- Contact Me
- View Resume
- View GitHub
- LinkedIn

Rules:

- Shared wherever needed.
- Used before the footer on Home and Projects pages.
- Do not replace the footer.
- Do not add large contact cards.

---

## Project Components

### `ProjectCard`

Purpose:

Render one project in a grid.

Props/data:

- title
- description
- category
- status
- stack
- slug
- repositoryUrl
- liveUrl

Rules:

- Must link to `/projects/[slug]`.
- Must support hover state.
- Must not contain hardcoded project-specific layout hacks.

---

### `ProjectGrid`

Purpose:

Render project cards.

Rules:

- Receives a filtered project list.
- Responsive grid:
  - 3 columns desktop
  - 2 columns tablet
  - 1 column mobile

---

### `ProjectFilters`

Purpose:

Search and filter projects.

Filters:

- All
- Fullstack
- Frontend
- Backend
- Data
- AI Workflow
- Architecture

Rules:

- Client component.
- State-driven.
- Uses data returned from the API or passed into the page.

---

### `ProjectDetail`

Purpose:

Render detailed content for one project.

Sections:

- Overview
- Purpose
- Technical Highlights
- Implementation Notes
- Current Status / Next Steps
- Tech Stack
- GitHub / Demo buttons

Rules:

- Do not add fake metrics.
- Do not add Related Projects unless requested.
- Do not add large architecture code block.

---

## API Contracts

Frontend and backend must agree on project contracts.

Recommended frontend type:

```ts
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

export type Project = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  category: ProjectCategory[];
  status: ProjectStatus;
  stack: string[];
  featured: boolean;
  repositoryUrl?: string;
  liveUrl?: string;
  overview?: string;
  purpose?: string;
  technicalHighlights?: string[];
  implementationNotes?: string;
  nextSteps?: string[];
};
```

Backend DTOs should mirror this contract explicitly.

Avoid sharing generated types between frontend and backend in version 1 unless it is simple and clearly useful.
