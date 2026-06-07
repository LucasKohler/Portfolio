# Testing

Tests in this repository should protect real behavior. They should not exist
only to make the project appear mature.

## Current Test Coverage

Backend tests live in:

```txt
apps/api/tests/
  Portfolio.Api.Tests
  Portfolio.Application.Tests
```

Current coverage includes:

- Health endpoint response.
- Project list and project detail endpoint behavior.
- Invalid project slug returning `404`.
- Contact endpoint validation and honest placeholder response.
- OpenAPI endpoint availability.
- Application dependency registration.

## Test Strategy

### Unit Tests

Use unit tests for domain/application decisions that can be tested without HTTP
or external infrastructure.

Good candidates:

- Validation rules.
- Mapping behavior.
- Application service decisions.
- Domain invariants when they become meaningful.

### Integration Tests

Use integration tests for boundaries.

Good candidates:

- API status codes.
- API response shape.
- Serialization behavior.
- Dependency injection wiring.
- Repository behavior when persistence changes.

### Contract Tests

Contract tests may be added when frontend/backend contracts become more formal.
Until then, endpoint tests plus TypeScript types are enough for version 1.

### E2E Tests

Add E2E tests only when the UI has stable flows worth protecting. Good future
flows:

- Projects page search/filtering.
- Project detail navigation.
- Not-found project route.
- Contact CTA link behavior.

## Validation Commands

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

Documentation-only:

```bash
git diff --check
git status --short
```

## Rules

- Do not add fake tests.
- Do not delete tests to make a build pass.
- Add regression tests for bugs when practical.
- Add protection tests before moving code across architectural boundaries.
- Report commands that could not be run and why.
