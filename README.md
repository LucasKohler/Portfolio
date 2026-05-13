# Lucas Kohler Marques — Portfolio Platform

Personal portfolio platform for **Lucas Kohler Marques**, a Software Engineer focused on fullstack systems, performance, architecture and AI-assisted development.

This repository is designed to be both:

1. A professional portfolio for recruiters, hiring managers and tech leads.
2. A public technical showcase of modern frontend, backend, Docker and architecture practices.

---

## Positioning

**Software Engineer focused on fullstack systems, performance and AI-assisted development.**

Core areas:

- Next.js / React / TypeScript
- .NET / C# / ASP.NET Core
- SQL Server / data modeling / query optimization
- APIs, dashboards and business systems
- Dockerized development
- Architecture and maintainability
- AI-assisted engineering workflows

---

## Project Goals

This project must demonstrate:

- A polished, recruiter-friendly UI
- A scalable project matrix
- Dynamic project detail pages
- Frontend and backend integration
- Clean monorepo organization
- Dockerized local development
- Extensible architecture for adding projects over time
- Honest technical case studies without fake metrics or fake claims

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react, if icons are needed

### Backend

- .NET LTS
- ASP.NET Core
- C#
- OpenAPI
- Scalar, if compatible with the selected .NET version
- Health checks
- CORS
- Validation for request DTOs

### Infrastructure

- Docker
- Docker Compose
- `.env.example`
- Separate Dockerfiles for web and API

### Quality

- TypeScript strict mode
- ESLint
- Prettier, if configured
- dotnet format
- .editorconfig
- Build/lint validation
- Future GitHub Actions support

---

## Version Policy

Use the latest stable versions available at implementation time.

Prefer LTS versions:

- Latest .NET LTS, currently `.NET 10 LTS` unless a newer official LTS exists.
- Latest Node.js LTS.
- Latest stable Next.js.

Do not use preview, alpha, beta, canary or nightly releases unless explicitly requested.

---

## Repository Structure

Recommended structure:

```txt
/
  apps/
    web/
      # Next.js frontend

    api/
      # .NET backend

  stitch-export/
    # Google Stitch export folder, or the existing export folder name

  AGENTS.md
  DESIGN.md
  README.md
  PRODUCT.md
  ROUTES.md
  COMPONENTS.md
  CONTENT.md
  IMPLEMENTATION_PLAN.md
  ACCEPTANCE_CRITERIA.md
  CODEX_PROMPTS.md

  docker-compose.yml
  docker-compose.override.yml
  .env.example
  .editorconfig
  .gitignore
```

Backend internal structure:

```txt
apps/api/
  src/
    Portfolio.Api/
    Portfolio.Application/
    Portfolio.Domain/
    Portfolio.Infrastructure/

  tests/
    Portfolio.Api.Tests/
    Portfolio.Application.Tests/
```

Frontend internal structure:

```txt
apps/web/
  src/
    app/
    components/
    lib/
    types/
    config/
```

---

## Expected Frontend Routes

```txt
/
  Home page

/projects
  Projects index page with searchable/filterable matrix

/projects/[slug]
  Dynamic project detail page
```

---

## Expected Backend API

```txt
GET  /api/health
GET  /api/projects
GET  /api/projects/{slug}
POST /api/contact
```

The backend is the preferred source of truth for project data in version 1.

The frontend should consume the API instead of duplicating project content.

---

## Design Reference

The UI was designed in Google Stitch.

The Stitch export folder is located at the project root.

Use it as reference for:

- Visual hierarchy
- Layout
- Spacing
- Typography direction
- Component appearance
- Page structure
- Assets

Do not treat the exported code as final production architecture.

The final implementation must follow:

- `AGENTS.md`
- `DESIGN.md`
- `ROUTES.md`
- `COMPONENTS.md`
- `ACCEPTANCE_CRITERIA.md`

---

## How Projects Should Be Added

Projects must be added through the backend data source, not by manually creating one page per project.

Initial data source may be:

```txt
apps/api/src/Portfolio.Infrastructure/Data/projects.json
```

A project should support:

- slug
- title
- description
- summary
- category
- status
- stack
- featured
- repositoryUrl
- liveUrl
- overview
- purpose
- technicalHighlights
- implementationNotes
- nextSteps

Future versions may migrate this to a database, CMS or MDX-based content system.

---

## Docker Development

Expected commands after setup:

```bash
docker compose up --build
```

Expected services:

```txt
web
api
```

Expected local URLs:

```txt
Frontend: http://localhost:3000
API:      http://localhost:5000 or http://localhost:8080
Docs:     /scalar, /docs or equivalent
```

Exact ports should be documented after implementation.

---

## Key Rules

- Do not hardcode project pages manually.
- Do not duplicate project content in frontend and backend.
- Do not invent fake metrics or fake professional results.
- Do not create multiple footer versions.
- Do not add unnecessary libraries.
- Keep the codebase extensible and easy to reason about.
