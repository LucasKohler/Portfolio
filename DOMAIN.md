# Domain

The current domain is intentionally small. The product is a professional
portfolio platform that presents projects, case studies and contact intent
without inventing business claims.

## Core Concepts

### Project

A project represents one public portfolio item or documented case study.

Current fields include:

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

Rules:

- `slug` must be stable and URL-safe.
- `featured` controls Home page visibility.
- `repositoryUrl` and `liveUrl` must be null unless links are real.
- Project detail pages must be dynamic and slug-based.
- Project copy must avoid fake metrics, fake results and fake company claims.

### Project Status

Allowed status labels:

```txt
In Progress
Case Study
Draft
Private Repository
Live Demo
Coming Soon
```

Do not add unclear statuses such as "Almost Ready" or "Data Compiling".

### Project Category

Current category labels:

```txt
Fullstack
Frontend
Backend
Data
AI Workflow
Architecture
Performance
Portfolio
```

If categories change, update backend parsing/mapping, frontend types and tests
in the same scoped change.

### Contact

The contact endpoint currently validates a contact request and returns an honest
placeholder response. It does not send or store messages.

Rules:

- Do not fake email delivery.
- Do not store personal data without a real data handling decision.
- Add rate limiting, provider configuration and security review before enabling
  real delivery.

## Future Domain Growth

Possible future concepts:

- Blog or technical notes.
- Bilingual content.
- Tags.
- Admin/content workflows.
- Database-backed project content.

Do not implement these until the product need is explicit and scoped.
