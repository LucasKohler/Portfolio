# Contributing

This repository is a portfolio platform and an AI-driven development reference.
Contributions should improve the real product while keeping the codebase easy
to review, validate and evolve.

## Working Principles

- Prefer small, reviewable changes.
- Read `AGENTS.md` before changing files.
- Keep documentation aligned with implemented behavior.
- Do not add features, endpoints, tables, migrations or dependencies without a
  clear reason.
- Do not move code across major folders without an approved plan.
- Treat public API changes as breaking changes unless proven otherwise.

## Before You Start

1. Read the relevant project documentation. Start with `docs/README.md` for
   navigation.
2. Read `docs/ai/AI_WORKFLOW.md` when AI assistance or multi-agent review is
   involved.
3. Run `git status --short --branch`.
4. Identify the smallest useful change.
5. Check the existing architecture before creating new patterns.
6. Decide which validation commands apply.

## Branch Naming

Use short, descriptive branch names:

```txt
feature/nome-curto
bugfix/nome-curto
refactor/nome-curto
docs/nome-curto
chore/nome-curto
```

Use the prefix that best describes the primary change. Do not combine unrelated
feature, refactor, Docker and documentation work in one branch.

## Commit Messages

Use a simple conventional style:

```txt
feat: add project filtering
fix: correct contact validation
refactor: simplify project mapper
docs: update ai workflow
test: add project contract tests
chore: update ai agents
```

Keep each commit focused on one reason to change.

## Expected Validation

Backend changes:

```bash
dotnet build apps/api/Portfolio.slnx
dotnet test apps/api/Portfolio.slnx
```

Frontend changes:

```bash
cd apps/web
npm run lint
npm run build
```

Docker changes:

```bash
docker compose config
docker compose build
```

Documentation-only changes:

```bash
git diff --check
git status --short
```

If a command cannot run locally, document the exact reason.

## Pull Request Expectations

Each PR should include:

- What changed.
- Why it changed.
- Whether AI was used, and which workflow was used.
- Commands run and their results.
- Risks and unvalidated areas.
- Whether contracts, routes, environment variables or data shape changed.
- Whether migrations were added or changed.
- Whether security, performance or documentation was affected.
- Whether multi-agent review was used.

Avoid broad PRs that combine unrelated backend, frontend, Docker and
documentation changes.

## Human Review Triggers

Ask for human direction before:

- Adding or changing database migrations.
- Changing public API response shapes.
- Adding external providers or credentials.
- Replacing the current folder strategy.
- Changing runtime versions.
- Removing tests or validation steps.
- Introducing a new architectural abstraction.
