# Coding Standards

These standards keep the portfolio maintainable as it grows.

## General

- Prefer clarity over cleverness.
- Keep changes local to the requested behavior.
- Use existing patterns before creating new ones.
- Name things by domain meaning, not implementation novelty.
- Do not add abstractions until duplication or complexity makes them useful.
- Keep comments rare and useful.

## Backend

- Keep Domain free from ASP.NET Core, EF Core, file system and HTTP concerns.
- Keep Application focused on use-case orchestration and DTO mapping.
- Keep Infrastructure responsible for persistence, integrations and external
  details.
- Keep Api focused on endpoints, HTTP semantics and composition.
- Use explicit DTOs for API contracts.
- Preserve endpoint behavior unless a breaking change is approved.
- Validate request DTOs explicitly.

## Frontend

- Use the App Router structure already present in `apps/web/src/app`.
- Use Server Components by default.
- Use Client Components only for interactions and browser-only behavior.
- Keep reusable UI in `components/ui`.
- Keep route sections in `components/sections`.
- Keep project-specific rendering in `components/projects`.
- Avoid unnecessary `useEffect` and global state.
- Keep project data loaded from the backend API.

## TypeScript

- Keep strict typing.
- Avoid `any` unless there is a narrow, documented reason.
- Keep shared response types aligned with backend DTOs.
- Prefer small helper functions over complex component bodies.

## CSharp

- Keep nullable reference types enabled.
- Prefer explicit models and records for DTOs.
- Keep validation messages clear.
- Avoid leaking infrastructure exceptions as public API behavior.
- Keep tests close to meaningful behavior.

## Documentation

- Document implemented behavior as implemented.
- Mark future work as future work.
- Do not use documentation to imply a feature exists before it does.
- Update docs in the same PR when behavior or commands change.
