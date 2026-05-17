# Security

This project does not currently process payments, authentication or persistent
user data. Security work should still be practical and explicit.

## Current Security Posture

- Contact submission is validation-only unless a delivery provider is configured.
- No secrets should be committed.
- Environment variables are documented in `.env.example`.
- CORS is configured for local frontend origins.
- External links should use safe behavior when opened in a new tab.

## Secrets

Rules:

- Never commit `.env`, credentials, tokens or production URLs containing secrets.
- Keep example values in `.env.example` non-sensitive.
- Do not bake secrets into Docker images.
- Do not paste secrets into documentation, prompts or tests.

## API Validation

Endpoint rules:

- Validate request DTOs explicitly.
- Return clear validation errors.
- Do not leak stack traces as API responses.
- Treat public response shape changes as contract changes.

The contact endpoint must not claim delivery unless a provider is configured and
tested.

## CORS

CORS should allow the local frontend and future approved deployment origins.
Avoid wildcard production CORS unless there is a documented reason.

## Database And Personal Data

There is no database in version 1. Before adding SQL Server or storing contact
messages:

1. Create an ADR.
2. Define retention and access expectations.
3. Add validation and security tests.
4. Document connection string handling.
5. Review destructive migration risk.

## Dependency Hygiene

- Add dependencies only when they solve a real problem.
- Prefer framework features before extra packages.
- Review package purpose, maintenance and security implications.
- Keep lockfiles committed.

## Security Review Checklist

- No secrets in diff.
- No fake email delivery.
- CORS changes are intentional.
- User input is validated.
- External links are safe.
- Docker images do not contain secrets.
- Error responses do not reveal internals.
