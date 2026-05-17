# AI Workflow

This project uses AI as an engineering assistant, not as an unchecked code
generator. AI should accelerate analysis, planning, implementation and review
while preserving human judgment.

## Standard Flow

1. Understand the task and current repository state.
2. Read the required references in `AGENTS.md`.
3. Inspect code before proposing changes.
4. Plan the smallest safe change.
5. Implement incrementally.
6. Run relevant validation.
7. Report what changed, what was validated and what remains risky.

## Scope Rules

AI agents should classify every task as one or more of:

- Documentation
- Backend
- Frontend
- Tests
- Docker/infra
- CI/CD
- Security
- Observability

If a task crosses too many areas, split it into separate PRs.

## Single-agent vs multi-agent workflow

Use a single agent for small, local tasks where the impacted files and
validation commands are obvious.

Use multi-agent review when the task benefits from independent read-only
perspectives, such as architecture review, feature planning, PR review, security
review or release readiness.

Use reusable prompts in `.codex/prompts/` when the task follows a known pattern
but does not need parallel agents. Prompts are task starters, not permission to
skip repository inspection.

Use skills in `.agents/skills/` when the task matches a structured reusable
workflow. Skills are procedural guides for repeatable work; they complement
prompts and agents, but do not replace repository inspection or validation.

Repository AI files have different roles:

- `AGENTS.md`: operational rules that agents must follow.
- `.codex/agents/*.toml`: custom agent roles, permissions and instructions.
- `.codex/prompts/*.md`: reusable task prompts.
- `.agents/skills/*/SKILL.md`: structured reusable workflows for repeatable
  engineering tasks.

Recommended feature flow:

1. Run `explorer` in read-only mode to map files, entrypoints and tests.
2. Run `architect` in read-only mode when boundaries or contracts matter.
3. Produce one consolidated plan.
4. Get human approval before implementation.
5. Use either `backend-worker` or `frontend-worker` when implementation is
   needed. Use both only when their write sets do not overlap.
6. Run `qa-reviewer` to check tests and regression risk.
7. Run `security-reviewer` when secrets, validation, auth, dependencies,
   personal data, Docker or external providers are involved.
8. Run `pr-reviewer` before merge.
9. Run final validation and report what was not validated.

Recommended bugfix flow:

1. Reproduce or localize the bug with the main agent or `explorer`.
2. Identify the smallest affected area.
3. Plan the fix and regression test.
4. Use the relevant worker only after the plan is clear.
5. Validate with the narrowest useful test/build/lint command.

Recommended refactor flow:

1. Use `explorer` to map current behavior and tests.
2. Use `architect` to check boundaries and overengineering risk.
3. Add or identify protection tests before edits.
4. Refactor one module or concern at a time.
5. Use `pr-reviewer` for regression and scope review.

Recommended PR review flow:

1. Use `qa-reviewer` for test and regression gaps.
2. Use `security-reviewer` if the diff touches inputs, dependencies, secrets,
   auth, Docker or deployment configuration.
3. Use `pr-reviewer` to consolidate bugs, contracts, performance,
   maintainability and scope.
4. The main agent returns one consolidated review.

Recommended security flow:

1. Use `security-reviewer` in read-only mode.
2. Separate evidence from speculation.
3. Classify findings by severity.
4. Require human approval before touching secrets, auth, provider config,
   production URLs or personal data.

Human validation is mandatory before merge. Multi-agent output is advisory until
the main agent consolidates it and the relevant validation commands have been
run or explicitly marked as not run.

Do not use multi-agent workflow as an excuse to increase scope. More agents
should reduce blind spots, not expand the task.

## Prompt Library

Reusable prompts live in `.codex/prompts/`. Each prompt includes:

- Objective
- When to use
- Reusable prompt
- Checklist
- Expected output
- Acceptance criteria

Prompts are starting points. The repository state and `AGENTS.md` always take
priority.

## Validation Discipline

AI output is not accepted until it has been reviewed and validated. Do not state
that a command passed unless it was executed.

For documentation-only changes, use:

```bash
git diff --check
git status --short
```

For code changes, run the area-specific commands documented in `AGENTS.md` and
`CONTRIBUTING.md`.

## Anti-Patterns

Avoid:

- Large uncontrolled rewrites.
- Generic prompts with no repository context.
- Empty folders that imply unsupported maturity.
- Fake tests or fake documentation.
- Blind dependency additions.
- Business rules invented by the AI.
- Migrations without domain and data ownership review.
- Contracts changed without calling out breaking changes.
