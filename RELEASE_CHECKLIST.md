# Release Checklist

Use this checklist before tagging, deploying or sharing a release candidate.

## Scope

- [ ] Confirm what changed since the last release.
- [ ] Confirm no unrelated files are included.
- [ ] Confirm documentation matches implemented behavior.
- [ ] Confirm breaking changes are documented.

## Backend

- [ ] Run `dotnet build apps/api/Portfolio.slnx`.
- [ ] Run `dotnet test apps/api/Portfolio.slnx`.
- [ ] Confirm `/api/health` behavior is unchanged.
- [ ] Confirm `/api/projects` and `/api/projects/{slug}` contracts are stable.
- [ ] Confirm `/api/contact` does not fake email delivery.

## Frontend

- [ ] Use the Node.js LTS version pinned by the project.
- [ ] Run `npm run lint` in `apps/web`.
- [ ] Run `npm run build` in `apps/web`.
- [ ] Check Home, Projects Index and Project Detail routes.
- [ ] Check invalid project slug behavior.
- [ ] Check footer consistency across routes.

## Docker

- [ ] Run `docker compose config`.
- [ ] Run `docker compose build`.
- [ ] Confirm no secrets are baked into images.
- [ ] Confirm documented ports and environment variables match Compose.

## Security

- [ ] Check the diff for secrets.
- [ ] Check `.env.example` contains only safe examples.
- [ ] Confirm CORS origins are intentional.
- [ ] Confirm contact/data handling is documented.

## Documentation

- [ ] README is accurate.
- [ ] AGENTS.md is accurate.
- [ ] Architecture and domain docs match the code.
- [ ] Known limitations are listed honestly.

## Release Notes

Document:

- What changed.
- Validation commands and results.
- Known risks.
- Rollback notes.
- Follow-up tasks.
