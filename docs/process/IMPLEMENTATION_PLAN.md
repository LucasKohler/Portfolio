# IMPLEMENTATION_PLAN.md

## Implementation Strategy

Do not implement the full portfolio in one large task.

Build incrementally:

1. Inspect documentation and Stitch export
2. Project setup
3. Docker foundation
4. Backend API foundation
5. Frontend foundation
6. Shared UI components
7. Project data contracts
8. Home page
9. Projects index
10. Dynamic project detail
11. Docker integration
12. Quality checks
13. Responsive polish
14. Future deploy readiness

---

## Phase 0 — Inspect Context

Before writing code:

- Read the required references listed in `AGENTS.md` and navigate detailed
  documentation via `docs/README.md`.
- Read `DESIGN.md`.
- Inspect the Google Stitch export folder.
- Identify useful assets, layout references and design tokens.
- Do not copy the Stitch export blindly.

Expected outcome:

- Implementation plan.
- File structure.
- Stack/version decisions.
- Risk list.

---

## Phase 1 — Repository Setup

Create the monorepo foundation:

```txt
apps/
  web/
  api/
```

Root files:

```txt
docker-compose.yml
docker-compose.override.yml
.env.example
.editorconfig
.gitignore
```

Do not use Nx/Turborepo initially.

Expected outcome:

- Clear monorepo structure.
- Root-level documentation remains visible.
- Docker strategy is defined.

---

## Phase 2 — Backend Setup

Create the .NET API under:

```txt
apps/api/
```

Preferred structure:

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

Use latest .NET LTS.

Backend setup must include:

- ASP.NET Core
- Health endpoint
- Projects endpoints
- Contact endpoint placeholder
- OpenAPI
- Scalar if compatible
- CORS
- Validation strategy
- Basic logging
- Dockerfile
- .dockerignore

Expected outcome:

- API runs locally.
- API exposes health endpoint.
- API exposes OpenAPI/Scalar docs.
- API has a clean structure, not all logic in `Program.cs`.

---

## Phase 3 — Frontend Setup

Create the Next.js app under:

```txt
apps/web/
```

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Framer Motion
- lucide-react if needed

Frontend setup must include:

- App Router
- Global styles
- Tailwind configuration
- Base layout
- API client helper
- Environment variable support
- Dockerfile
- .dockerignore

Expected outcome:

- Web app runs locally.
- Web app can read API base URL from environment.
- Base layout is ready for shared components.

---

## Phase 4 — Docker Foundation

Create Docker setup:

```txt
docker-compose.yml
docker-compose.override.yml
apps/web/Dockerfile
apps/api/Dockerfile
.env.example
```

Services:

- `web`
- `api`

Expected local URLs:

```txt
web: http://localhost:3000
api: http://localhost:5000 or http://localhost:8080
```

Rules:

- Do not bake secrets into Docker images.
- Use environment variables.
- Add health checks where practical.
- Compose should allow both services to run together.

Expected outcome:

```bash
docker compose up --build
```

starts the application stack.

---

## Phase 5 — Project Data Model

Create project contracts in backend and frontend.

Backend should own project data.

Initial backend source may be:

```txt
apps/api/src/Portfolio.Infrastructure/Data/projects.json
```

Create:

- Domain model
- DTOs
- Repository interface
- JSON repository implementation
- Application service/query handler

Frontend should have matching TypeScript types.

Do not duplicate full content manually in frontend.

Expected outcome:

- `GET /api/projects`
- `GET /api/projects/{slug}`

work and return typed project data.

---

## Phase 6 — Shared Frontend Components

Implement:

- Navbar
- Footer
- SectionContainer
- Button
- Badge
- Card
- SectionHeading

Rules:

- Footer must be one shared component.
- Navbar must be one shared component.
- No duplicate footers.
- Preserve dark premium SaaS design.

Expected outcome:

- Layout foundation matches the design direction.

---

## Phase 7 — Home Page

Implement:

- Hero
- What I bring to engineering teams
- Featured Engineering Work
- Contact CTA
- Footer

Rules:

- Hero CTAs: `View Projects`, `View Resume`
- Do not include `Contact Me` in Hero
- Featured projects must come from API/project data
- Contact CTA must appear before Footer

Expected outcome:

- Home page matches the approved Stitch direction.

---

## Phase 8 — Projects Index

Implement `/projects`.

Features:

- Search
- Category filters
- Project grid
- Project cards
- Contact CTA
- Footer

Rules:

- Fetch projects from API.
- Do not hardcode cards manually.
- Cards navigate to `/projects/[slug]`.

Expected outcome:

- Projects page is scalable and dynamic.

---

## Phase 9 — Project Detail

Implement `/projects/[slug]`.

Features:

- Fetch project by slug
- Back to Projects
- Breadcrumb
- Main visual preview placeholder
- Overview
- Purpose
- Technical Highlights
- Implementation Notes
- Current Status / Next Steps
- Tech Stack
- GitHub / Demo buttons
- Footer

Do not add:

- Fake metrics
- Related Projects
- Results & Impact unless real
- Large fake architecture panel

Expected outcome:

- Dynamic project detail page works for all projects.

---

## Phase 10 — Validation and Quality

Run available commands:

Frontend:

```bash
npm run lint
npm run build
```

or the package-manager equivalent.

Backend:

```bash
dotnet build
dotnet test
dotnet format
```

Docker:

```bash
docker compose build
docker compose up
```

Expected outcome:

- No TypeScript errors.
- No .NET build errors.
- Docker stack runs.
- Routes work.

---

## Phase 11 — Responsive Polish

Validate:

- Desktop
- Tablet
- Mobile

Check:

- Hero layout
- Project grid
- Project detail layout
- Footer consistency
- Navbar usability
- Text contrast
- Button hierarchy
- Small text readability

Expected outcome:

- UI is visually close to the approved Stitch design.

---

## Phase 12 — Future Deploy Readiness

Prepare for future deployment without deploying yet.

Document:

- Required environment variables
- Build commands
- Docker commands
- API URL configuration
- Possible deployment targets

Do not hardwire local URLs in production code.

Possible future deployment options:

- Azure Container Apps
- Azure App Service + Static Web App
- Render
- Fly.io
- Railway
- VPS with reverse proxy
- Vercel for frontend + Azure/Render/Fly for API, if Docker-only deployment is not required

Expected outcome:

- Codebase is ready to be deployed later with minimal restructuring.
