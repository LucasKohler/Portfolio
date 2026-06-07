# Architecture

This repository is a pragmatic fullstack portfolio platform. It should look
small enough to understand quickly and structured enough to evolve without
turning into a tangle.

## Current Shape

```txt
/
  apps/
    api/
      src/
        Portfolio.Api
        Portfolio.Application
        Portfolio.Domain
        Portfolio.Infrastructure
      tests/
        Portfolio.Api.Tests
        Portfolio.Application.Tests

    web/
      src/
        app
        components
        config
        lib
        types

  stitch_the_kohler_portfolio/
  docker-compose.yml
  docker-compose.override.yml
```

The current structure uses `apps/api` and `apps/web`. Do not move these folders
without an approved ADR and protection tests.

## Backend

The backend follows a pragmatic Clean Architecture / modular monolith style.

```txt
Portfolio.Api
  HTTP endpoints, OpenAPI/Scalar, CORS and application composition.

Portfolio.Application
  Use-case orchestration, DTOs, service interfaces and application services.

Portfolio.Domain
  Domain models and domain enums with no infrastructure or ASP.NET dependency.

Portfolio.Infrastructure
  JSON-backed project repository, disabled contact delivery placeholder and
  future external details.
```

Dependency direction:

```txt
Api -> Application
Api -> Infrastructure
Infrastructure -> Application
Infrastructure -> Domain
Application -> Domain
Domain -> no outward dependency
```

## Frontend

The frontend uses Next.js App Router with Server Components by default.

```txt
src/app
  Routes and layouts.

src/components
  Reusable UI, layout, sections and project rendering.

src/config
  Site and environment configuration.

src/lib
  API client and small helpers.

src/types
  TypeScript types aligned with backend DTOs.
```

Project data should come from the backend API. The frontend should not duplicate
the full project catalog.

## Data Strategy

Version 1 uses backend-owned JSON project data:

```txt
apps/api/src/Portfolio.Infrastructure/Data/projects.json
```

This is intentional. SQL Server and EF Core are future evolution paths, not
current runtime requirements. Before introducing a database, create an ADR,
define ownership, add tests and document migration risks.

## Integration Flow

```txt
projects.json
  -> JsonProjectRepository
  -> ProjectQueryService
  -> ProjectsEndpoints
  -> /api/projects
  -> apps/web/src/lib/api.ts
  -> pages/components
```

## Architectural Guardrails

- Do not add microservices.
- Do not add shared packages unless they remove real duplication.
- Do not add a database just to look production-like.
- Do not move to `src/backend` and `src/frontend` without a separate migration
  plan.
- Do not expose internal domain objects directly if the model grows.
- Preserve public route and API contracts unless a breaking change is approved.
