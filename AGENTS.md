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
- AI-assisted development using model-agnostic coding assistants and equivalent
  tools

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
- `docs/specs/PRODUCT.md`
- `docs/specs/ROUTES.md`
- `docs/specs/COMPONENTS.md`
- `docs/specs/CONTENT.md`
- `docs/process/IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CRITERIA.md`
- `docs/ai/AI_PROMPTS.md`

Detailed specs live under `docs/specs/`, architecture under `docs/architecture/`,
AI workflow under `docs/ai/`, process under `docs/process/` and operations under
`docs/ops/`. See `docs/README.md` for navigation.

The Google Stitch export folder is located at the project root.

Use the Stitch export as visual and structural reference, but do **not** blindly copy generated code or preserve weak architecture from the export.

Decision hierarchy:

```txt
1. AGENTS.md
2. DESIGN.md
3. ACCEPTANCE_CRITERIA.md
4. docs/specs/ROUTES.md / docs/specs/COMPONENTS.md / docs/specs/CONTENT.md / docs/specs/PRODUCT.md
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

  .agents/
    agents/
    prompts/
    skills/
    config.toml

  AGENTS.md
  DESIGN.md
  README.md
  ACCEPTANCE_CRITERIA.md
  CONTRIBUTING.md
  SECURITY.md

  docs/
    README.md
    specs/
    architecture/
    ai/
    process/
    ops/

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

---

## AI-Driven Development Rules

This repository is also a reference project for professional AI-assisted
engineering. Agents must optimize for correctness, maintainability and
traceability, not for volume of generated code.

Before coding, agents must:

1. Read the required references listed above.
2. Inspect the current tree and relevant manifests.
3. Check `git status --short --branch`.
4. Identify the smallest safe change.
5. State assumptions when the repository does not answer a question.

Agents must not:

- Move code between `apps/api`, `apps/web`, `src`, `tests` or `infra` without
  an approved plan and validation strategy.
- Invent endpoints, tables, migrations, business rules, metrics or external
  integrations.
- Add dependencies unless they solve a real problem and are justified.
- Create empty abstraction layers for appearance.
- Hide uncertainty behind confident language.
- Claim that build, test, lint, Docker or browser validation passed unless the
  command was actually executed.

Prefer small pull requests that can be reviewed independently. A good AI-driven
change should leave a clear paper trail: what was requested, what changed, how
it was validated and what remains risky.

---

## Scope Control

Each task should declare whether it touches:

- Documentation
- Backend
- Frontend
- Tests
- Docker/infra
- CI/CD
- Security
- Observability

If a change crosses more than two areas, split it unless the user explicitly
approves a wider scope. Documentation may describe future work, but code must
represent only implemented behavior.

Stop and ask for human direction when:

- A public API contract would change.
- A destructive database migration is needed.
- A dependency or runtime version must be upgraded.
- Secrets, credentials, production URLs or personal data are involved.
- Requirements conflict with `DESIGN.md`, `ACCEPTANCE_CRITERIA.md` or this file.
- A refactor requires moving many files at once.

---

## Backend Engineering Rules

Current backend location:

```txt
apps/api/
```

Current backend projects:

```txt
Portfolio.Api
Portfolio.Application
Portfolio.Domain
Portfolio.Infrastructure
```

Dependency direction:

```txt
Api -> Application
Api -> Infrastructure
Infrastructure -> Application
Infrastructure -> Domain
Application -> Domain
Domain -> no application or infrastructure dependencies
```

Rules:

- Keep `Program.cs` focused on composition.
- Keep endpoint files focused on HTTP concerns, request/response mapping and
  status codes.
- Keep use-case orchestration in Application.
- Keep external details such as JSON files, databases, email providers and
  third-party integrations in Infrastructure.
- Keep Domain free from ASP.NET Core, EF Core, file system and HTTP concerns.
- Use explicit DTOs at API/Application boundaries.
- Preserve existing endpoints unless a breaking change is explicitly approved.

### Database And Migrations

The current version uses backend-owned JSON project data. SQL Server and EF Core
are future targets, not current runtime requirements.

Before adding EF Core, SQL Server or migrations:

1. Create or update an ADR.
2. Define the domain model and data ownership.
3. Add protection tests around affected behavior.
4. Document connection strings through environment variables only.
5. Treat destructive migrations as breaking changes requiring human approval.

Never create a migration just because a folder exists. Never include secrets in
connection strings or Docker images.

---

## Frontend Engineering Rules

Current frontend location:

```txt
apps/web/
```

Current frontend structure:

```txt
src/app
src/components
src/config
src/lib
src/types
```

Rules:

- Use Next.js App Router conventions already present in the project.
- Keep Server Components as the default.
- Use Client Components only for interaction, local client state, animation or
  browser APIs.
- Avoid unnecessary `useEffect`; derive state during render when possible.
- Avoid global state unless multiple distant workflows genuinely need it.
- Keep project data owned by the backend API.
- Do not create one page per project; use slug-based dynamic routes.
- Do not create a complex design system until repeated patterns justify it.

Before changing Next.js behavior, read the local Next.js guidance in
`apps/web/AGENTS.md`.

---

## Testing Rules

Tests must validate behavior that matters. Do not create placeholder tests that
only assert implementation details or exist for appearance.

Backend test priorities:

- Endpoint contract behavior.
- Validation behavior.
- Application service decisions.
- Repository behavior when data access changes.

Frontend test priorities, when introduced:

- Rendering behavior for routes and reusable components.
- Filtering/search behavior.
- API error and not-found states.
- Accessibility-sensitive interactions.

Use broader tests when touching shared contracts, routing, validation, data
loading, Docker or deployment behavior.

---

## Validation Rules

Run the smallest relevant validation set for the changed area.

Backend:

```bash
dotnet build apps/api/Portfolio.slnx
dotnet test apps/api/Portfolio.slnx
```

Frontend:

```bash
cd apps/web
npm run lint
npm run build
```

Docker:

```bash
docker compose config
docker compose build
```

Documentation-only changes should at least run:

```bash
git diff --check
git status --short
```

If a command cannot be run because the local environment is missing a required
tool or runtime, report that explicitly.

---

## Commits And Pull Requests

Keep commits focused. A PR should have one primary reason to exist.

Before opening or preparing a PR:

1. Confirm the diff only contains intended changes.
2. Summarize user-visible impact.
3. List validation commands and results.
4. Call out unvalidated areas.
5. Mention breaking changes, if any.

Do not mix documentation, backend refactors, frontend redesign, Docker changes
and CI setup in one PR unless the user explicitly approves that scope.

---

## Multi-agent workflow

This repository uses a conservative multi-agent workflow for analysis, planning,
implementation and review. The main agent remains accountable for the final
answer: it must consolidate findings and decisions instead of returning several
unmerged agent responses.

Custom agents live in:

```txt
.agents/agents/
```

Global subagent limits live in:

```txt
.agents/config.toml
```

Current agents:

- `explorer`: read-only codebase mapper for structure, entrypoints, modules,
  dependencies, tests and relevant files.
- `architect`: read-only architecture reviewer for boundaries, coupling,
  pragmatic Clean Architecture, ADR needs and overengineering risk.
- `qa-reviewer`: read-only reviewer for tests, validation gaps, fragile tests,
  regressions and acceptance criteria.
- `security-reviewer`: read-only reviewer for secrets, authentication,
  authorization, validation, logs, dependencies, Docker and agent safety.
- `pr-reviewer`: read-only reviewer for diffs, regressions, contracts, tests,
  security, performance, maintainability and scope.
- `backend-worker`: workspace-write worker for small approved backend changes.
- `frontend-worker`: workspace-write worker for small approved frontend changes.

Use `explorer` when:

- The relevant files, routes, modules or tests are not yet known.
- A task starts with codebase analysis, impact mapping or onboarding.
- The main agent needs file paths and entrypoints before planning.

Use `architect` when:

- Boundaries, coupling, layering, ADRs or overengineering risk matter.
- A change may affect backend/frontend contracts or folder structure.
- A refactor needs architectural review before implementation.

Use `qa-reviewer` when:

- A task changes behavior, validation, routing, contracts or data loading.
- Existing tests may be brittle or insufficient.
- The main agent needs a test plan before implementation.

Use `security-reviewer` when:

- Secrets, contact flows, CORS, authentication, authorization, input handling,
  dependencies, Docker or logs are involved.
- A feature might process personal data or external provider data.

Use `pr-reviewer` when:

- A diff or PR is ready for review.
- The main agent needs a consolidated risk check before merge or release.
- Scope creep, missing validation or regressions are possible.

Use `backend-worker` only after an approved backend implementation plan. Keep
the write set small and limited to the approved backend files.

Use `frontend-worker` only after an approved frontend implementation plan. Keep
the write set small and limited to the approved frontend files.

Read-only agents:

```txt
explorer
architect
qa-reviewer
security-reviewer
pr-reviewer
```

Workspace-write agents:

```txt
backend-worker
frontend-worker
```

Use multi-agent review when a task benefits from independent perspectives, such
as architecture review, PR review, security review, release readiness or
cross-cutting feature planning. Keep the workflow small: spawn only the agents
needed for the current question.

Use feature-plan multi-agent flow when:

- The change touches backend and frontend.
- A public contract may change.
- A database, migration, external provider or deployment concern is involved.
- The implementation requires tests across more than one layer.

Use review multi-agent flow when:

- A diff is ready for review.
- A release candidate needs risk assessment.
- A refactor may affect contracts, security or test coverage.

Human intervention is required before:

- Any destructive migration.
- Any public contract breaking change.
- Any secret, credential, production URL or private data handling change.
- Any deployment.
- Any MCP server configuration.
- Any broad file movement or architectural migration.

Multi-agent safety rules:

- Read-only agents must not edit files.
- Only `backend-worker` and `frontend-worker` may write, and only inside an
  explicitly approved task.
- Do not run two workspace-write workers in parallel on the same file, module,
  public contract or functional flow.
- Write-heavy tasks require a consolidated plan and human approval before
  implementation starts.
- No agent may deploy.
- No agent may touch secrets.
- No agent may configure external MCP servers without explicit approval.
- No agent may create destructive migrations without explicit approval.
- No agent may alter public contracts without highlighting the breaking change.
- Subagents should not make conflicting changes. If ownership is ambiguous, stop
  and split the task before editing.

When consolidating agent output, the main agent should:

1. Deduplicate findings.
2. Order risks by severity and practical priority.
3. Separate facts from inferences.
4. Cite file paths for evidence.
5. State what was not validated.
6. Recommend the next smallest safe step.

Example prompts:

Codebase review:

```txt
Use explorer, architect, qa-reviewer, security-reviewer and pr-reviewer in
read-only mode to review the current repository. Do not edit files. Return one
consolidated response with evidence, severity and next safe steps.
```

Feature planning:

```txt
Use explorer and architect to map the impacted files and boundaries, then use
qa-reviewer to identify protection tests. Do not implement. Return a
consolidated feature plan with risks, validation and files likely affected.
```

PR or diff review:

```txt
Use qa-reviewer, security-reviewer and pr-reviewer in read-only mode to review
this diff. Focus on bugs, contracts, missing tests, security, performance and
scope. Return findings first, ordered by severity.
```

Security review:

```txt
Use security-reviewer in read-only mode to inspect secrets, validation, CORS,
auth, logs, dependencies and Docker risk. Do not edit files. Return evidence and
practical remediation.
```

Controlled backend implementation:

```txt
Use backend-worker to implement only the approved backend plan. Do not touch
frontend, Docker, CI/CD or unrelated docs. Run or report backend validation.
```

Controlled frontend implementation:

```txt
Use frontend-worker to implement only the approved frontend plan. Do not touch
backend, Docker, CI/CD or unrelated docs. Run or report frontend validation.
```

---

## Reusable AI Workflows

Reusable prompts live in:

```txt
.agents/prompts/
```

Use them as task starters, not as permission to ignore repository context. A
prompt is successful only when the resulting change matches this repository,
passes relevant validation and stays inside the approved scope.
