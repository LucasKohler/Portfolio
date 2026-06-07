# Lucas Kohler Marques Portfolio Platform

A fullstack portfolio platform built as a real software project, not as a static one-page site.

The application presents engineering projects, case studies and technical notes through a Next.js frontend backed by an ASP.NET Core API. Project data is owned by the backend so the frontend can stay focused on rendering routes, interactions and reusable UI components.

## Goals

- Present a polished technical portfolio with a dark premium SaaS visual direction.
- Keep project content dynamic and easy to extend over time.
- Demonstrate a simple but professional monorepo with frontend, backend, Docker and tests.
- Avoid fake metrics, fake business claims and one-off project pages.
- Keep the codebase ready for future deployment, database-backed content and CI/CD.

## Stack

### Frontend

- Next.js App Router
- React
- TypeScript with strict mode
- Tailwind CSS
- Framer Motion
- lucide-react
- ESLint

### Backend

- .NET 10 LTS
- ASP.NET Core API
- C#
- Minimal API endpoint groups
- OpenAPI
- Scalar API reference
- CORS configuration
- xUnit tests

### Infrastructure

- Docker
- Docker Compose
- Separate `web` and `api` services
- `.env.example` for local configuration
- `.editorconfig` for formatting consistency

## Repository Structure

```txt
/
  apps/
    web/
      src/
        app/
        components/
        config/
        lib/
        types/
      Dockerfile

    api/
      src/
        Portfolio.Api/
        Portfolio.Application/
        Portfolio.Domain/
        Portfolio.Infrastructure/
      tests/
        Portfolio.Api.Tests/
        Portfolio.Application.Tests/
      Dockerfile
      Portfolio.slnx

  stitch_the_kohler_portfolio/
    # Google Stitch export used as visual reference only

  .agents/
    agents/
    prompts/
    skills/
    config.toml

  docs/
    README.md
    specs/
    architecture/
    ai/
    process/
    ops/

  AGENTS.md
  DESIGN.md
  ACCEPTANCE_CRITERIA.md
  CONTRIBUTING.md
  SECURITY.md

  docker-compose.yml
  docker-compose.override.yml
  .env.example
  .editorconfig
  .gitignore
  .nvmrc
  global.json
```

## Repository Map

- `apps/api/`: .NET backend with API, application, domain, infrastructure and
  backend tests.
- `apps/web/`: Next.js frontend with App Router, reusable components, API
  client helpers and frontend types.
- `docs/`: detailed specifications, architecture notes, AI workflows, process
  checklists and operational guides. Start at `docs/README.md`.
- `.agents/`: model-agnostic AI workflow assets, including custom agents,
  reusable prompts and structured skills.
- `docker-compose.yml` and `docker-compose.override.yml`: Docker Compose
  environment for the web and API services.
- Root governance: `AGENTS.md`, `DESIGN.md`, `ACCEPTANCE_CRITERIA.md`,
  `CONTRIBUTING.md` and `SECURITY.md`.
- Detailed documentation under `docs/`: specs, architecture, AI workflow,
  process and operations. See `docs/README.md`.

## Documentation

| Location | Purpose |
|----------|---------|
| `AGENTS.md` | Agent and contributor rules (highest priority) |
| `DESIGN.md` | Visual contract |
| `ACCEPTANCE_CRITERIA.md` | Enforcement checklist |
| `docs/README.md` | Navigation hub for all detailed documentation |
| `docs/specs/` | Product, routes, components and content |
| `docs/architecture/` | Layering, domain model and coding standards |
| `docs/ai/` | AI workflow and step-by-step prompts |
| `docs/process/` | Implementation plan, testing and release |
| `docs/ops/` | MCP flow and local tooling setup |

## Environment

Runtime versions are pinned or documented through project files:

- Node.js: `.nvmrc` uses `24`
- Frontend package engine: `node >=24`
- .NET SDK: `global.json` uses `10.0.201`
- Docker images: `node:24-alpine`, `mcr.microsoft.com/dotnet/sdk:10.0`, `mcr.microsoft.com/dotnet/aspnet:10.0`

Copy `.env.example` when creating local environment-specific files. Do not commit secrets.

```txt
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
INTERNAL_API_BASE_URL=http://api:8080
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
PORTFOLIO__CORS__ALLOWEDORIGINS__0=http://localhost:3000
WEB_PORT=3000
API_PORT=5000
```

## Running Locally Without Docker

Start the API:

```bash
dotnet run --project apps/api/src/Portfolio.Api/Portfolio.Api.csproj --urls http://localhost:5000
```

Start the web app in another terminal:

```bash
cd apps/web
npm install
npm run dev
```

For local non-Docker development, the frontend defaults to `http://localhost:5000` for server-side API calls. If you need to override it:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
INTERNAL_API_BASE_URL=http://localhost:5000
```

Local URLs:

```txt
Frontend: http://localhost:3000
API:      http://localhost:5000
Scalar:   http://localhost:5000/scalar
OpenAPI:  http://localhost:5000/openapi/v1.json
```

## Running Locally With Docker

Build and start the stack from the repository root:

```bash
docker compose up --build
```

Services:

```txt
web -> http://localhost:3000
api -> http://localhost:5000
```

The Compose setup uses:

- `docker-compose.yml` for production-oriented service definitions.
- `docker-compose.override.yml` for development targets, mounted source folders and watch-friendly settings.
- An API healthcheck at `/api/health`.
- `INTERNAL_API_BASE_URL=http://api:8080` so the web container can call the API container.

## Frontend Routes

```txt
/                  Home page
/projects          Projects index with search and category filters
/projects/[slug]   Dynamic project detail page
```

Project detail pages are generated from API data by slug. There are no manually created pages per project.

## Backend Endpoints

```txt
GET  /api/health
GET  /api/projects
GET  /api/projects/{slug}
POST /api/contact
GET  /openapi/v1.json
GET  /scalar
```

Endpoint behavior:

- `/api/health` returns service status.
- `/api/projects` returns summary data for project cards and featured work.
- `/api/projects/{slug}` returns full project detail data or `404`.
- `/api/contact` validates a contact payload and returns an honest accepted response. Email delivery is not configured yet and no message is sent or stored.

## Project Data Model

Project content is owned by the backend in:

```txt
apps/api/src/Portfolio.Infrastructure/Data/projects.json
```

The backend maps JSON records into domain models, then exposes explicit DTOs from the application/API layers. The frontend mirrors the response shape with TypeScript types in:

```txt
apps/web/src/types/project.ts
```

Each project supports:

```txt
slug
title
description
summary
category
status
stack
featured
repositoryUrl
liveUrl
overview
purpose
technicalHighlights
implementationNotes
nextSteps
```

Allowed status labels:

```txt
In Progress
Case Study
Draft
Private Repository
Live Demo
Coming Soon
```

## Adding New Projects

1. Add a new record to `apps/api/src/Portfolio.Infrastructure/Data/projects.json`.
2. Use a stable, URL-safe `slug`.
3. Keep `repositoryUrl` and `liveUrl` as `null` unless the links are real.
4. Set `featured: true` only for projects that should appear on the Home page.
5. Use existing `category` and `status` values unless the domain enums, backend parser and frontend types are updated together.
6. Run backend tests and frontend build after changing the data.

Useful validation commands:

```bash
dotnet test apps/api/Portfolio.slnx
cd apps/web && npm run build
```

## Build and Validation

Frontend:

```bash
cd apps/web
npm run lint
npm run build
```

Backend:

```bash
dotnet build apps/api/Portfolio.slnx
dotnet test apps/api/Portfolio.slnx
dotnet format apps/api/Portfolio.slnx --verify-no-changes
```

Docker:

```bash
docker compose build
docker compose up
```

## Deployment Notes

The project is prepared for future deployment but is not tied to a provider yet.

Possible paths:

- Deploy both services as containers using Azure Container Apps, Azure App Service, Render, Fly.io, Railway or a VPS.
- Deploy the frontend separately on Vercel and the API on a .NET-friendly host.
- Add CI/CD to run frontend lint/build, backend build/test and Docker build before release.

Before deploying:

- Replace placeholder external links in `apps/web/src/config/site.ts`.
- Configure production API base URLs.
- Configure CORS for the production frontend origin.
- Decide whether project data remains JSON-based or moves to a database, CMS or MDX content flow.
- Configure a real email provider before turning `/api/contact` into a delivery endpoint.

## Design Reference

The Google Stitch export lives in:

```txt
stitch_the_kohler_portfolio/
```

It was used as visual and contextual reference for:

- Dark premium SaaS identity
- Typography scale
- Section spacing
- Cards, badges and button hierarchy
- Home, projects index and project detail layouts
- Footer and contact section consistency

The exported HTML was not copied as the final architecture. The implementation uses reusable React components, backend-owned project data and a clean monorepo structure.

Reference screenshots are also kept at the repository root:

```txt
Portfolio - Home.png
Projects Index.png
Project Detail.png
```

## AI-Assisted Workflow

AI coding assistants can be used as implementation partners through staged
prompts:

1. Planning and Stitch export inspection.
2. Monorepo, Docker and tooling setup.
3. Backend foundation, project API and contact placeholder.
4. Frontend foundation, shared UI primitives and API client.
5. Home page, projects index and dynamic project detail.
6. Contact/footer consistency, responsive polish and final technical review.
7. README and repository documentation polish.

The workflow intentionally keeps implementation incremental so architecture,
content, design and validation can be reviewed between phases.

## Current Known Follow-ups

- Configure real GitHub, LinkedIn, resume and contact links.
- Run Docker validation in an environment where the Docker CLI is available.
- Add CI once the repository is connected to GitHub.
- Add production deployment documentation after choosing the target platform.
