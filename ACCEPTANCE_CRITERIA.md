# ACCEPTANCE_CRITERIA.md

## Global Criteria

- The project uses a monorepo structure with `apps/web` and `apps/api`.
- Frontend uses Next.js, React, TypeScript and Tailwind CSS.
- Backend uses .NET LTS and ASP.NET Core.
- Docker is configured from the beginning.
- The visual identity follows the approved dark premium SaaS direction.
- The site does not feel like a generic developer portfolio.
- There are no fake metrics, fake results or fake business claims.
- There are no generic developer cartoons.
- The code is organized into reusable components and clear backend layers.
- The same Navbar component is used across pages.
- The same Footer component is used across pages.
- The same ContactCTA component is reused where applicable.

---

## Architecture Criteria

Required root structure:

```txt
apps/
  web/
  api/
```

Required root files:

```txt
docker-compose.yml
docker-compose.override.yml
.env.example
.editorconfig
.gitignore
```

Do not create:

- One-off project detail pages
- Duplicated footer implementations
- Duplicated project data between frontend and backend
- Overcomplicated monorepo tooling unless explicitly approved

---

## Frontend Criteria

The frontend must:

- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Use internal navigation for project routes.
- Fetch project data from the backend API.
- Use reusable components.
- Preserve the approved design direction.
- Be responsive.

Frontend routes:

```txt
/
 /projects
 /projects/[slug]
```

---

## Backend Criteria

The backend must:

- Use .NET LTS.
- Use ASP.NET Core.
- Expose a health endpoint.
- Expose project endpoints.
- Expose a contact endpoint or clearly documented placeholder.
- Include OpenAPI.
- Include Scalar if compatible.
- Use CORS correctly.
- Keep logic outside `Program.cs` where practical.
- Have a clear path to future database integration.

Required endpoints:

```txt
GET  /api/health
GET  /api/projects
GET  /api/projects/{slug}
POST /api/contact
```

---

## Docker Criteria

Docker setup must include:

```txt
docker-compose.yml
docker-compose.override.yml
apps/web/Dockerfile
apps/api/Dockerfile
apps/web/.dockerignore
apps/api/.dockerignore
.env.example
```

The stack must run with:

```bash
docker compose up --build
```

Rules:

- No secrets baked into images.
- Environment variables are documented.
- Web and API run as separate services.
- API base URL is configurable.
- Containers should be suitable for future deployment.

---

## Footer Criteria

The footer must be identical on:

- Home page
- Projects Index page
- Project Detail page
- Any future page

Footer content:

```txt
Lucas Kohler Marques
Software Engineer
Built with modern web technologies.

GitHub
LinkedIn
Email
Resume
```

The footer must not include:

- Twitter
- Copyright line
- “Built with precision”
- Different spacing per page
- Different background shade per page
- Different link order per page
- Different typography per page

---

## Home Page Criteria

The Home page must include:

- Navbar
- Hero
- Value section
- Featured Engineering Work
- Contact CTA
- Footer

Hero headline:

```txt
Software Engineer focused on fullstack systems, performance and AI-assisted development.
```

Hero CTAs:

- `View Projects`
- `View Resume`

Hero must not include:

- `Contact Me`

Featured Engineering Work must:

- Use project data from backend/API flow
- Show selected/featured projects
- Include `View All Projects`

---

## Projects Index Criteria

The `/projects` page must include:

- Navbar
- Page title
- Supporting text
- Search input
- Category filters
- Project grid
- Contact CTA
- Footer

Project cards must:

- Be rendered from project data
- Include status badge
- Include category
- Include tech badges
- Link to `/projects/[slug]`
- Have a hover state

Filters must include:

- All
- Fullstack
- Frontend
- Backend
- Data
- AI Workflow
- Architecture

---

## Project Detail Criteria

The `/projects/[slug]` page must:

- Load project data by slug
- Show not-found state for invalid slugs
- Include Back to Projects button
- Include breadcrumb
- Include project status
- Include main visual preview placeholder
- Include Overview
- Include Purpose
- Include Technical Highlights
- Include Implementation Notes
- Include Current Status / Next Steps
- Include Tech Stack
- Include GitHub / Demo buttons when available
- Use the shared Footer

The page must not include by default:

- Related Projects
- Fake Results & Impact
- Fake Lighthouse score
- Fake load time
- Fake architecture code block
- Fake business metrics

---

## Contact Criteria

The navbar `Contact` item should scroll to the Contact section.

The Contact section must include:

- Headline
- Supporting text
- Availability line
- Contact Me button
- View Resume button
- View GitHub button
- LinkedIn button

The `Contact Me` button should use `mailto:` in version 1 unless the backend contact flow is actually implemented.

Contact section must not use large cards for:

- Email
- LinkedIn
- GitHub
- Location

---

## Project Data Criteria

Project data must be owned by the backend in version 1.

Each project should support:

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

Future migrations to database/CMS/MDX must be possible without rewriting frontend pages.

---

## Build Criteria

Before considering a task complete:

Frontend:

- Run lint if configured.
- Run build if possible.
- Fix TypeScript errors.

Backend:

- Run `dotnet build`.
- Run tests if configured.
- Run formatter if configured.

Docker:

- Run `docker compose build`.
- Run `docker compose up` if possible.

General:

- Check responsive layout.
- Check internal links.
- Check footer consistency.
- Check project routes.
- Check API routes.
