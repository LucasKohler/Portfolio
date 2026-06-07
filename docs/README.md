# Documentation

This folder contains detailed specifications, architecture notes, AI workflows,
process checklists and operational guides.

Core governance files remain at the repository root per the decision hierarchy in
`AGENTS.md`:

- `AGENTS.md` — agent and contributor rules (highest priority)
- `DESIGN.md` — visual contract
- `ACCEPTANCE_CRITERIA.md` — enforcement checklist
- `README.md` — project overview
- `CONTRIBUTING.md` — contribution workflow
- `SECURITY.md` — security expectations

## Navigation

### Specs (`docs/specs/`)

What to build: product scope, routes, components and content.

| File | Purpose |
|------|---------|
| [PRODUCT.md](specs/PRODUCT.md) | Product goals, scope and constraints |
| [ROUTES.md](specs/ROUTES.md) | Frontend and backend route contracts |
| [COMPONENTS.md](specs/COMPONENTS.md) | UI component inventory and expectations |
| [CONTENT.md](specs/CONTENT.md) | Copy, project data and content rules |

### Architecture (`docs/architecture/`)

How the system is structured.

| File | Purpose |
|------|---------|
| [ARCHITECTURE.md](architecture/ARCHITECTURE.md) | Monorepo layering and boundaries |
| [DOMAIN.md](architecture/DOMAIN.md) | Domain model and responsibilities |
| [APPLICATION_DOCUMENTATION.md](architecture/APPLICATION_DOCUMENTATION.md) | Application layer documentation (PT) |
| [CODING_STANDARDS.md](architecture/CODING_STANDARDS.md) | Coding conventions and style |
| [adrs/ADR_TEMPLATE.md](architecture/adrs/ADR_TEMPLATE.md) | Template for Architecture Decision Records |

### AI (`docs/ai/`)

How agents and AI-assisted development are used in this repository.

| File | Purpose |
|------|---------|
| [AI_WORKFLOW.md](ai/AI_WORKFLOW.md) | Multi-agent workflow and validation rules |
| [AI_PROMPTS.md](ai/AI_PROMPTS.md) | Step-by-step implementation prompts (PT) |

### Process (`docs/process/`)

How features are planned, tested and released.

| File | Purpose |
|------|---------|
| [IMPLEMENTATION_PLAN.md](process/IMPLEMENTATION_PLAN.md) | Phased implementation plan |
| [RELEASE_CHECKLIST.md](process/RELEASE_CHECKLIST.md) | Pre-release verification checklist |
| [TESTING.md](process/TESTING.md) | Testing strategy and expectations |

### Operations (`docs/ops/`)

Local tooling and environment setup.

| File | Purpose |
|------|---------|
| [SETUP_MCP_FLOW.md](ops/SETUP_MCP_FLOW.md) | PlanBroker MCP flow setup (PT/mixed) |

### Analysis artifacts

| File | Purpose |
|------|---------|
| [UI-ANIMATION-ANALYSIS.md](UI-ANIMATION-ANALYSIS.md) | UI animation review notes |

## Language note

Core governance files at the repository root are in English. Detailed
implementation prompts in `docs/ai/AI_PROMPTS.md` and some architecture notes are
in Portuguese. When in doubt, follow the decision hierarchy in `AGENTS.md`.

## Visual reference

The `stitch_the_kohler_portfolio/` folder at the repository root is a Google
Stitch design export used as visual reference only. Its inner
`technical_portfolio_design_system/DESIGN.md` duplicates color tokens from the
canonical root `DESIGN.md` — prefer the root file for implementation.

## Proposing changes

Read `CONTRIBUTING.md` before editing documentation. Keep paths and cross-
references aligned with `AGENTS.md` when moving or renaming files.
