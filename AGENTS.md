# AGENTS.md

## Project Context

This repository is a personal portfolio platform for **Lucas Kohler Marques**, a mid-level Software Engineer focused on:

- Fullstack software engineering
- Next.js / React / TypeScript
- .NET / C# / ASP.NET Core
- SQL Server, data modeling and performance
- APIs, dashboards and business systems
- Architecture, maintainability and scalability
- Dockerized development and future deployment
- AI-assisted development using ChatGPT, Claude and Codex

The portfolio is not only a website. It is also a public technical showcase hosted on GitHub.

It must demonstrate that the codebase can grow without becoming messy.

---

## Primary Goal

Build a modern, extensible, production-oriented portfolio using:

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** .NET LTS, ASP.NET Core API
- **Infrastructure:** Docker and Docker Compose
- **Quality:** lint/build checks, formatting, clear architecture and future CI readiness

The project must be visually aligned with the Google Stitch design export and technically structured as a scalable monorepo.

---

## Required References

Before implementing or changing anything, always read:

- `DESIGN.md`
- `README.md`
- `PRODUCT.md`
- `ROUTES.md`
- `COMPONENTS.md`
- `CONTENT.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CRITERIA.md`
- `CODEX_PROMPTS.md`

The Google Stitch export folder is located at the project root.

Use the Stitch export as visual and structural reference, but do **not** blindly copy generated code or preserve weak architecture from the export.

Decision hierarchy:

```txt
1. AGENTS.md
2. DESIGN.md
3. ACCEPTANCE_CRITERIA.md
4. ROUTES.md / COMPONENTS.md / CONTENT.md / PRODUCT.md
5. Google Stitch export folder
6. Screenshots/assets
```

---

## Version Policy

Use the latest stable versions available at implementation time.

Prefer LTS versions for runtimes:

- Use the latest **.NET LTS** version available. Currently target `.NET 10 LTS` unless the environment requires a newer official LTS.
- Use the latest **Node.js LTS** version available.
- Do not use preview, nightly, alpha, beta, canary or experimental framework versions unless explicitly requested.

After choosing versions, pin them in the project where appropriate:

- Docker images
- `.nvmrc` or equivalent
- `global.json` for .NET SDK, if useful
- package lockfile

---

## Required Architecture

Use a simple but professional monorepo:

```txt
/
  apps/
    web/
      # Next.js frontend

    api/
      # .NET backend

  packages/
    shared/
      # Optional future shared contracts/types.
      # Do not create unless it adds real value.

  stitch-export/
    # Or the existing Stitch export folder name.
    # Visual reference only.

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

Do not use Nx, Turborepo or complex monorepo tooling unless explicitly requested. This project should be scalable, but not overengineered.

---

## Frontend Rules

Frontend location:

```txt
apps/web/
```

Required frontend stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion only where it improves the experience
- lucide-react for icons if needed

Use:

- Next.js App Router
- TypeScript strict mode
- Reusable components
- Server Components by default where possible
- Client Components only for interactive UI such as filters, search, animations and client state
- Internal navigation with `next/link`
- Environment variable for API base URL

Do not:

- Duplicate project data in the frontend if the backend is the intended source of truth.
- Hardcode one project page per project.
- Create visual-only components that cannot scale.
- Add unnecessary libraries.

---

## Backend Rules

Backend location:

```txt
apps/api/
```

Required backend stack:

- .NET LTS
- ASP.NET Core
- C#
- OpenAPI
- Scalar for API documentation, if compatible with the selected .NET version
- Health checks
- CORS configured for local frontend and future deployment
- Built-in validation or explicit validation for request DTOs
- Structured logging using the default logging stack initially; add Serilog only if it brings real value

Preferred backend style:

- Minimal APIs with clear endpoint grouping, or controllers if the structure becomes more complex.
- Keep the first version simple but well organized.

Recommended API capabilities:

```txt
GET  /api/health
GET  /api/projects
GET  /api/projects/{slug}
POST /api/contact
GET  /openapi/v1.json
GET  /scalar or /docs
```

`POST /api/contact` can be implemented as a safe placeholder/no-op or validation-only endpoint until an email provider is configured. Do not fake email delivery.

---

## Backend Architecture

Use a modular monolith structure that can grow:

```txt
apps/api/
  src/
    Portfolio.Api/
      Endpoints/
      Middleware/
      Configuration/
      Program.cs

    Portfolio.Application/
      Projects/
      Contact/
      Common/

    Portfolio.Domain/
      Projects/
      Contact/
      Common/

    Portfolio.Infrastructure/
      Projects/
      Contact/
      Data/

  tests/
    Portfolio.Api.Tests/
    Portfolio.Application.Tests/
```

If this structure is too heavy for the initial setup, create it incrementally, but do not put all backend logic directly in `Program.cs`.

Rules:

- Domain models should not depend on ASP.NET Core.
- Application services should contain use-case logic.
- Infrastructure should contain data access implementation.
- API layer should expose endpoints and map HTTP contracts.
- Keep DTOs explicit.
- Do not expose internal domain objects directly if the model grows.

---

## Data Strategy

Projects will be added over time inside the portfolio.

The first version should use a backend-owned project source, for example:

```txt
apps/api/src/Portfolio.Infrastructure/Data/projects.json
```

or an equivalent strongly typed in-memory repository.

The frontend should consume project data from the backend API.

The data model must be easy to migrate later to:

- PostgreSQL
- SQL Server
- SQLite
- CMS
- Git-based markdown/MDX content

Do not introduce a database in version 1 unless explicitly requested.

---

## Docker Rules

Use Docker from the beginning.

Required files:

```txt
docker-compose.yml
docker-compose.override.yml
apps/web/Dockerfile
apps/web/.dockerignore
apps/api/Dockerfile
apps/api/.dockerignore
.env.example
```

Development targets:

- `web` service
- `api` service

Recommended local ports:

```txt
web: http://localhost:3000
api: http://localhost:5000 or http://localhost:8080
api docs: http://localhost:5000/scalar or equivalent
```

Rules:

- Containers must be able to run together with Docker Compose.
- Do not bake secrets into images.
- Use `.env.example`.
- Use health checks where practical.
- Keep production and development concerns separated.
- Do not require a database container in version 1.

---

## UI Rules

Follow `DESIGN.md` strictly.

Preserve:

- Dark premium SaaS visual identity
- Strong spacing
- Clear section hierarchy
- Technical/product-oriented feel
- Reusable component styling
- Footer consistency across all routes

Do not:

- Make the UI colorful, playful, cyberpunk or gamer-like.
- Use generic developer cartoons.
- Add fake dashboards that do not match the design direction.
- Add fake metrics.
- Add fake business results.
- Add `Related Projects` unless explicitly requested.
- Add large fake `System Architecture` blocks.
- Create multiple footer variants.

---

## Routing Rules

Frontend expected routes:

```txt
/
  Home

/projects
  Projects Index

/projects/[slug]
  Project Detail
```

Backend expected routes:

```txt
GET  /api/health
GET  /api/projects
GET  /api/projects/{slug}
POST /api/contact
```

Project detail pages must be dynamic and slug-based.

---

## Copywriting Rules

Avoid:

- “Passionate developer”
- “Technology lover”
- “Always learning”
- Fake seniority
- Fake metrics
- Exaggerated claims
- Generic motivational copy

Prefer:

- Software engineering
- Maintainability
- Performance
- Architecture
- Business impact
- AI-assisted productivity
- Clear technical judgment
- Realistic technical documentation

---

## Work Style

For larger tasks, plan before implementing.

When implementing:

1. Read the documentation.
2. Inspect the Stitch export.
3. Propose the structure.
4. Implement incrementally.
5. Keep commits/tasks small.
6. Run available validation commands.
7. Check against `ACCEPTANCE_CRITERIA.md`.

Do not implement the whole project in a single uncontrolled pass.

If a requested implementation conflicts with documentation, explain the conflict before changing code.
