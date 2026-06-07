# ROUTES.md

## Route Strategy

The frontend must use Next.js App Router and internal navigation.

The experience should feel SPA-like, with smooth transitions and no full visual reload when navigating between project pages.

The backend must expose a .NET API consumed by the frontend.

---

## Frontend Routes

```txt
/
  Home

/projects
  Projects Index

/projects/[slug]
  Project Detail
```

---

## `/`

Home page.

Purpose:

Introduce Lucas, communicate positioning, show professional value and preview engineering work.

Sections:

1. Navbar
2. Hero
3. Engineering value cards
4. Featured Engineering Work
5. Contact CTA
6. Footer

Hero CTAs:

- `View Projects`
- `View Resume`

The Hero must not include `Contact Me`.

---

## `/projects`

Projects Index page.

Purpose:

Show a scalable matrix of engineering projects, case studies, experiments and technical implementations.

Required elements:

- Navbar
- Page title
- Supporting text
- Search input
- Category filters
- Project grid
- Project cards
- Contact CTA
- Footer

Filters:

- All
- Fullstack
- Frontend
- Backend
- Data
- AI Workflow
- Architecture

Data source:

- Fetch projects from the backend API.
- Do not duplicate full project content in frontend static files unless needed as a temporary fallback.
- If a fallback is used, document it clearly.

Each project card should link to:

```txt
/projects/[slug]
```

---

## `/projects/[slug]`

Dynamic Project Detail page.

Purpose:

Show detailed documentation for a selected project.

Data source:

- Fetch project by slug from the backend API.
- If the slug does not exist, show a not-found state.

Required sections:

1. Navbar
2. Back to Projects button
3. Breadcrumb
4. Project title
5. Status badge
6. Summary
7. Main visual preview placeholder
8. Overview
9. Purpose
10. Technical Highlights
11. Implementation Notes
12. Current Status / Next Steps
13. Tech Stack
14. GitHub / Demo buttons
15. Footer

Do not include by default:

- Related Projects
- Fake Results & Impact
- Fake metrics
- Fake Lighthouse score
- Fake architecture/code panel

---

## Backend API Routes

The backend must expose these routes:

```txt
GET  /api/health
GET  /api/projects
GET  /api/projects/{slug}
POST /api/contact
```

Optional documentation routes:

```txt
GET /openapi/v1.json
GET /scalar
GET /docs
```

Use whichever documentation route is idiomatic for the selected .NET/OpenAPI/Scalar setup.

---

## `GET /api/health`

Purpose:

Check whether the backend is running.

Expected response:

```json
{
  "status": "ok",
  "service": "portfolio-api"
}
```

---

## `GET /api/projects`

Purpose:

Return project summaries for the Projects Index page and Featured Engineering Work.

Should include enough data for cards:

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

Do not return unnecessary internal fields.

---

## `GET /api/projects/{slug}`

Purpose:

Return full project detail.

Should include:

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

If not found:

- Return `404 Not Found`
- Use a clear ProblemDetails response if practical

---

## `POST /api/contact`

Purpose:

Future contact form endpoint.

Version 1 may be implemented as one of:

1. Validation-only endpoint returning accepted response.
2. No-op placeholder clearly documented as not sending emails.
3. Disabled route until an email provider is configured.

Do not fake email delivery.

Expected future fields:

- name
- email
- subject
- message

Apply validation.

Use rate limiting if implementing real submission later.

---

## Navigation Behavior

Navbar:

- `Home` links to `/`
- `Journey` scrolls to the relevant Home section if present
- `Skills` scrolls to the relevant Home section if present
- `Projects` links to `/projects`
- `Contact` scrolls to the Contact CTA section

Footer links:

- GitHub
- LinkedIn
- Email
- Resume

External links should use safe attributes when opened in a new tab.
