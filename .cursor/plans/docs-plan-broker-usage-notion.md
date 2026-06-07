# Plan: Complete Plan-Broker + publish_plan Documentation + Notion Integration

**Task ID (for publish)**: `docs-plan-broker-usage-notion`

**Agent Role**: Planning agent (plan mode). Read-only exploration only. The *only* file edited in this session is this plan file (via search_replace). No implementation edits, no Docker/config changes, no commits.

**User Request (translated + exact)**: "Quero que faça uma documentação completa de como usar o plan-broker e publish_plan, basicamente todo o cenário e comandos necessários. Se conecte com o notion e coloque lá tudo que é necessário fazer"

Mandatory publication rule (repeated from user): Ao finalizar o plano, OBRIGATORIAMENTE publique via MCP (plan-broker + publish_plan). task_id kebab-case descritivo. Não encerre sem chamar publish_plan e confirmar status "ok".

This plan itself must obey the rule before exit_plan_mode.

---

## Context

The Portfolio project has a sophisticated **Grok Build → PlanBroker MCP → Cursor** (Nível 2) orchestration flow for AI-assisted planning and implementation. This is a core part of its identity as an "AI-driven development reference project" (per AGENTS.md and .agents/).

Current state (from exploration):
- `.cursor/rules/plan-orchestration.md` describes the handoff contract for *implementation* agents.
- `docs/ops/SETUP_MCP_FLOW.md` covers setup, architecture diagram, daily scripts (setup/start/verify/stop/switch), permissions, and a prompt template for Grok Build that already mentions the publish obligation.
- `watch_plans.py` (root) + PowerShell scripts in `scripts/` implement the watcher, HTTP bridge for Grok, PID management, Windows toast/clipboard notify, and direct agent CLI dispatch.
- `.cursor/plans/` contains published plans (e.g. `review-docs-md-structure.md`, verify ones) + `index.json` (with versioning support via `.vN.md` archives on re-publish of same task_id).
- `plan-broker` python package lives at `~/mcp-servers/plan-broker/plan_broker.py` (Windows-mapped path `/mnt/c/Users/lucas/mcp-servers/plan-broker/plan_broker.py` in this WSL env). It exposes `publish_plan(plan_markdown, task_id, metadata=None) -> {"status": "ok", ...}`, `get_plan(task_id)`, `get_latest_plan()`, `list_plans()`.
- Global Cursor MCP (`~/.cursor/mcp.json` or Windows equivalent) registers the stdio wrapper; project `.cursor/mcp.json` stays minimal/empty.
- `.cursor/permissions.json` allowlists the 4 plan-broker tools for Auto-review Run Mode.
- Grok Build specific registration uses `grok mcp add` + the `scripts/fix-grok-mcp.sh` (and `grok-mcp-debug.sh` in broker dir) because of WSL path/venv/ line-ending issues.
- `tools/plan-broker/` in workspace appears to be a snapshot (only .pyc currently).
- **Zero mentions of Notion** anywhere in the repo (grep confirmed). The `grok_com_notion` MCP was announced as "connection failed" in this session. `grok_com_github` is connected and usable.
- Existing docs (docs/README.md, docs/ops/SETUP_MCP_FLOW.md, AI_WORKFLOW.md, AGENTS.md) reference the flow but do not provide a single, complete, scenario-driven "how to use as a planning agent" guide that covers *every* command, the exact MCP tool call sequence required in Grok sessions (`search_tool` then `use_tool` with qualified `plan-broker__*` names), fallback behavior, versioning, multi-workspace, and especially **how to materialize the knowledge into Notion**.

Why this task now:
- Planning agents (the role the user explicitly assigned: "Você é o agente de PLANEJAMENTO") have a non-negotiable contract: end every planning session by publishing the plan via the MCP and confirming "ok". This is repeated in user messages, SETUP doc, and prior plan artifacts.
- The flow is powerful but has discoverability and completeness gaps for the "complete scenario + commands" + cross-tool (Notion) requirement.
- Notion is intended as the living, searchable, commentable home for "tudo que é necessário fazer" (all necessary actions), while the repo MD stays the version-controlled source.
- This directly supports the project's goals: demonstrate maintainable growth, AI-assisted productivity with clear paper trail, and reusable workflows.

Scope: **Documentation** (primary) + **ops / MCP / tooling** (examples and instructions only). No backend/frontend/runtime changes. Touches at most the docs and .cursor/ (rules/docs) lightly. Follows AGENTS.md scope control.

---

## Recommended Approach (the one to execute)

Create a single, authoritative, complete guide:

**Primary deliverable**: `docs/ops/PLAN_BROKER_GUIDE.md`

This file will be the "one-stop manual" that a planning agent (or human) can open and follow end-to-end. It will be significantly more focused and exhaustive on *usage during planning + publish obligation* than the existing SETUP_MCP_FLOW.md (which remains as the "first-time environment setup runbook").

Content outline (must be exhaustive):

1. **Overview & Mental Model** — Grok Build (planning) → HTTP `publish_plan` (or direct python) → broker writes `.cursor/plans/{task_id}.md` + updates `index.json` (with archive on conflict) → watcher detects → notifies Cursor IDE or spawns `agent -p`. Cursor side uses `get_plan` via MCP or direct file read. `WORKSPACE_FOLDER` env is the key for multi-project correctness.

2. **The Mandatory Publish Contract for Planning Agents** (highlight box, repeated)
   - You are in plan mode.
   - At the end: (a) have written the final plan to the session `plan.md`, (b) call `search_tool` with query for "plan-broker", (c) call `use_tool` with `tool_name: "plan-broker__publish_plan"`, `tool_input: { "plan_markdown": <full or consolidated plan content>, "task_id": "kebab-case-descritivo", "metadata": { "source": "grok-build", "areas": ["documentation"], "priority": "normal", "origin": "planning-agent" } }`, (d) wait for response, (e) confirm `status == "ok"` (and note filename/version), (f) *then* call `exit_plan_mode`.
   - Never exit plan mode without the publish + ok confirmation.
   - task_id rules: kebab-case, descriptive, unique per logical task (e.g. `feat-contact-validation`, `docs-plan-broker-usage-notion`). Re-using re-versions the prior as `.vN.md`.

3. **All Commands & Scenarios (tables + copy-paste blocks)**
   - One-time: `.\scripts\setup-mcp-flow.ps1`, `.\scripts\verify-mcp-flow.ps1`
   - Daily on Windows/Cursor side: `start-mcp-flow.ps1` (all flags: -Workspace, -NoWatch, -DryRunWatch, -RunAgent, -Port), `stop-mcp-flow.ps1`, `switch-mcp-workspace.ps1`, `verify-mcp-flow.ps1`
   - Grok/WSL specific: `./scripts/fix-grok-mcp.sh`, manual `grok mcp list/remove/add`, the venv python direct invocation, `grok-mcp-debug.sh`
   - Direct python (for tests or when MCP down): `cd $BROKER; python -c "from plan_broker import publish_plan, get_plan, list_plans; ..."`
   - Watcher standalone: `python watch_plans.py --once <task_id> [--dry-run] [--run-agent] [--workspace ...]`
   - In a Grok planning session (this exact environment): the search_tool + use_tool sequence (exact qualified names from current discovery: `plan-broker__publish_plan`, `plan-broker__get_plan`, etc.).
   - Cursor consumption (reference the rule): "Use plan-broker get_plan com task_id ..."
   - Fallback when broker unavailable in the session (documented in prior plans): still write the plan content to `.cursor/plans/{task_id}.md` (the session plan.md or directly) so the orchestration contract is satisfied for the next consumer.

4. **Tool Reference (from live search_tool)**
   - Exact schemas + descriptions for the 4 tools.
   - Example `use_tool` call block for publish (the one this planning session will execute).
   - Metadata conventions used in existing index.json (source, areas, priority, review_focus, origin...).

5. **Versioning, Workspaces, State & Security**
   - How `.vN.md` + index.json work.
   - `.mcp-flow.pids`, `.active-workspace`, `.watcher-state.json`, `.pending-implementation.json`
   - WORKSPACE_FOLDER resolution (env > .cursor presence > cwd).
   - Never put secrets in plans or metadata.
   - Localhost-only HTTP, permissions.json + Run Mode requirement.

6. **Notion Integration — "Coloque lá tudo que é necessário fazer"**
   - Why: Notion as the cross-session, human-searchable, commentable, linked knowledge base for the entire AI orchestration playbook (beyond what lives in one repo clone).
   - Prerequisites: Obtain a Notion integration (internal or public), the MCP server binary/wrapper (community `notion-mcp` or equivalent that speaks stdio or provides HTTP that Grok/Cursor can reach). The exact package name/command is intentionally left for the implementer to choose based on what works in 2026; the doc must show *the pattern* that matches plan-broker registration.
   - Registration (parallel to plan-broker):
     - Add to global `~/.cursor/mcp.json` (or via Cursor UI).
     - For this Grok Build: `grok mcp add notion-mcp --command ... --env NOTION_TOKEN=...` (or workspace-specific).
     - Project-level notes (keep project .cursor/mcp.json minimal like today).
   - Permissions: add the discovered notion tool names (e.g. `notion-mcp:create_page`, `notion-mcp:append_block_children`, `notion-mcp:search`, `notion-mcp:update_page`, `notion-mcp:query_database` ...) to `.cursor/permissions.json` under mcpAllowlist + appropriate autoRun instructions.
   - Recommended Notion information architecture (create once):
     - Root page: "Portfolio — AI Workflows & Orchestration" (or "Lucas Kohler Marques — Engineering Knowledge Base").
     - Child database: "Published Plans" (columns: Task ID (title), Title, Version, Source, Areas (multi-select), Created/Updated, Status (select: planned/implemented/archived), Repo Link, Notion Link, Notes).
     - Child page or synced block: "Plan Broker Complete Guide" (this content, formatted with:
       - Toggle headings for each scenario/command block (so it's scannable).
       - Code blocks for every PowerShell / bash / python / MCP call.
       - Tables for tools, scripts flags, verification checklist.
       - Callout / warning blocks for the "MANDATORY publish + ok before exit_plan_mode".
       - Embedded or linked sub-pages for AGENTS.md excerpts, the plan-orchestration rule, etc.
     - Separate pages: "Multi-Agent Roles", "Validation Commands by Area", "Notion Sync Runbook".
   - How to populate from the guide (once MCP connected in a session):
     1. `search_tool` query="notion" (or the registered server name) to discover exact tool names and input schemas (MUST do this before any use_tool).
     2. Use the tools to `create_page` (parent page id of the AI KB), then `append_block_children` or rich text equivalents to turn MD sections into Notion blocks (headings, code, tables, callouts). Or use a "create from markdown" tool if the chosen MCP supports it.
     3. For the "Published Plans" DB: on every successful publish_plan in Grok, optionally also create/update a DB row (or do it from a post-publish Cursor step). Store the task_id, the plan_markdown excerpt or link to the .md in repo, metadata.
   - Sync policy: MD files in `docs/ops/` (and key root governance) are source of truth and go in PRs. Notion pages are derived / published artifacts for convenience, search, and collaboration. Document a lightweight "update Notion after PR merge" step or a small script.
   - Fallback when Notion MCP unavailable (as in current session): use the connected `grok_com_github` tools to create a gist or repo discussion/wiki entry containing the guide, or simply note in the MD "run the notion publish steps when MCP is added". The guide itself must list the exact manual copy-paste blocks a human can use to create the Notion pages by hand if the MCP is not yet wired.
   - Security: Never store real NOTION_TOKEN or secrets in repo files or plans. Use env or Cursor secret handling.

7. **Troubleshooting Matrix** (expanded from SETUP)
   - MCP not appearing in Grok: rerun fix-grok-mcp.sh, full quit/restart of Grok, refresh /mcps.
   - Wrong workspace: use switch or -Workspace, check .active-workspace and WORKSPACE_FOLDER.
   - publish_plan returns not-ok or no status: inspect the broker logs, re-verify, fall back to direct file write + manual watcher trigger.
   - Notion connection fails: connection string / token / server command differences between stdio vs HTTP; permissions; restart.
   - etc.

8. **References & Related Files** — explicit links/pointers to AGENTS.md (decision hierarchy), the plan-orchestration rule, SETUP_MCP_FLOW (as setup complement), watch_plans.py, all scripts, .agents/ structure, AI_WORKFLOW.md, current docs/README.md navigation.

**Files to create / modify (precise, minimal set)**:

Create:
- `docs/ops/PLAN_BROKER_GUIDE.md` (new, ~the entire guide content; make it the most complete single document on the topic in the repo).

Edit (pointers + integration only):
- `docs/ops/SETUP_MCP_FLOW.md` — add a prominent top banner: "For complete usage as a planning agent (publish obligation, all scenarios, exact MCP calls, Notion publishing), read `PLAN_BROKER_GUIDE.md` first. This file is the one-time setup + architecture reference."
- `docs/README.md` — add the new guide to the Operations table (with 1-line purpose).
- `.cursor/rules/plan-orchestration.md` — light cross-reference addition in the "Prompt para Grok Build" or "Publicação OBRIGATÓRIA" section pointing to the new guide for the full command catalog.
- (Optional but recommended) `.agents/prompts/` — consider a tiny new or update to an existing planning prompt to embed the "always end with publish_plan + ok + exit" checklist. Do not overdo; most prompts already delegate to AGENTS + plan-orchestration.
- No changes to source, Docker, .agents/ core structure, or any implementation code.

**Existing assets / code to reuse (do not reinvent)**:
- The full content and diagrams in `docs/ops/SETUP_MCP_FLOW.md` (summarize + link heavily; avoid duplication).
- `watch_plans.py` (the prompts it builds, resolution logic, notify vs run-agent).
- All `scripts/*.ps1` + `fix-grok-mcp.sh` (include their exact invocation examples and flag tables).
- `.cursor/plans/index.json` shape and the versioning rule (document observed behavior).
- Live schemas returned by `search_tool` for plan-broker (include exact tool_name values like `plan-broker__publish_plan`).
- The example plan files in `.cursor/plans/` (especially the structure and "Publish Status" sections from `review-docs-md-structure.md` and `feat-ui-animations.md`).
- `docs/README.md` navigation pattern and language note (bilingual).
- `.agents/skills/feature-delivery/SKILL.md` and the multi-agent prompts for how planning fits the larger delivery workflow.
- AGENTS.md validation rules (for docs-only: `git diff --check`, `git status --short`).

**Why not alternatives**:
- Just expand SETUP_MCP_FLOW.md heavily: it would become too long and mix "first install" with "every planning session usage + Notion". Separation keeps onboarding fast.
- Put the guide only in Notion, no repo MD: violates "versioned in git", "plain .md", and the requirement that agents can read files locally without external services.
- Create a full Notion sync script/tooling: over-engineering for v1 (per AGENTS "do not use complex tooling unless requested"). MD + manual/MCP-driven publish steps is sufficient and matches the simple monorepo philosophy.
- Ignore the "connect with notion" part: directly contradicts the user query.

---

## Critical Files (read before editing, modify or create)

**Must read first (implementer checklist)**:
- This plan (after publish).
- `docs/ops/SETUP_MCP_FLOW.md`
- `.cursor/rules/plan-orchestration.md`
- `watch_plans.py`
- `scripts/fix-grok-mcp.sh`, `scripts/start-mcp-flow.ps1`, `scripts/verify-mcp-flow.ps1`, `scripts/setup-mcp-flow.ps1`
- `docs/README.md`
- `AGENTS.md` (Required References + scope control + "Documentation-only" validation)
- `.cursor/plans/index.json` + one or two recent plan .md files (to match tone and "Publish Status" sections)
- The plan_broker source at `/mnt/c/Users/lucas/mcp-servers/plan-broker/plan_broker.py` (at least the publish_plan function and any docstrings for accuracy)

**Will be created**:
- `docs/ops/PLAN_BROKER_GUIDE.md`

**Will be lightly edited** (only to add 1-3 line pointers / banners):
- `docs/ops/SETUP_MCP_FLOW.md`
- `docs/README.md`
- `.cursor/rules/plan-orchestration.md` (optional tightening of the prompt example)

**Never touch in this task**:
- Any file under `apps/`, `stitch_the_kohler_portfolio/` (except possibly a pointer note if relevant), Docker files, package manifests, .agents/ (except a prompt if the plan explicitly justifies a tiny addition), existing plans in .cursor/plans/.

---

## Verification & Success Criteria (executor *must* perform and record)

1. **Pre-flight (read-only)**
   - `git status --short --branch` (clean).
   - Re-run key discovery: `grep -r "plan-broker|publish_plan" . --include="*.md" | head -20`; list .cursor/plans, docs/ops, scripts/.

2. **After writing the guide**
   - The new file exists at `docs/ops/PLAN_BROKER_GUIDE.md` and is comprehensive (spot-check all 8 sections above are present with copy-pasteable commands and Notion steps).
   - Pointers added to the three edited files are correct and do not break existing navigation.
   - `git diff --check`
   - `git status --short`

3. **The mandatory publish (this is part of verification for the *planning* of this task, performed by the planning agent before exit)**
   - Called `search_tool` for plan-broker / publish_plan (already done in planning; re-call if needed for freshness).
   - Called `use_tool` with correct `tool_name="plan-broker__publish_plan"`, full plan_markdown (the content of this plan or a cleaned version), correct kebab task_id, sensible metadata.
   - Captured the tool response.
   - Confirmed `"status": "ok"` (or equivalent success) + noted the written filename and version.
   - Only *after* the above: called `exit_plan_mode`.

4. **Notion section validation (when MCP available or manual)**
   - Document the exact steps a future session would take (search_tool + use_tool calls once notion server is registered).
   - Provide human-copy-paste instructions that produce the parent page + guide page + example DB row.
   - If the implementer has a working notion MCP in their session, actually perform a minimal seed (create the parent page titled "Portfolio — Plan Broker & AI Orchestration Guide (auto-generated from repo)" and paste the intro + mandatory publish section). Record the page URL.
   - If not available: the guide still contains the full instructions + fallback (github MCP or manual).

5. **End-to-end scenario test (documented, executed where possible)**
   - On a Windows/Cursor machine: run verify + start (dry or notify) + simulate a publish (python direct or via a test Grok session if available) + see watcher banner or .pending file.
   - In this Grok session: the publish call itself serves as the live test of the "planning agent publish path".
   - Manual: `python -c "from plan_broker import list_plans, get_latest_plan; ..."` (with proper WORKSPACE_FOLDER) succeeds and shows the just-published plan.

6. **Documentation quality**
   - A reader (human or agent) following only the new GUIDE + the three pointer updates can:
     - Set up the flow from zero.
     - Run a complete planning session in Grok Build and correctly publish.
     - Know exactly what to type/paste in Cursor.
     - Know how to get the content into Notion and keep it alive.
   - No "TODO" or "fill in the command here" placeholders in the final guide.
   - Bilingual note preserved where relevant (PT commands/examples are common in the ecosystem).

7. **Scope & safety**
   - Only documentation touched.
   - No secrets, no production URLs, no destructive actions.
   - All examples use the real paths and flags present in the repo today.

**Unvalidated in this plan (call out explicitly)**:
- Actual long-term usage volume of the Notion side (depends on user adopting it).
- Behavior of a specific Notion MCP server (none connected now; the guide will treat the tool names as "to be discovered via search_tool at usage time").
- Windows toast/clipboard paths (already exercised by existing verify and watcher).

---

## Next Smallest Safe Step (after publish + human approval of this plan)

1. Implementer reads this plan + the current SETUP_MCP_FLOW + plan-orchestration rule + a couple of existing published plans.
2. Creates `docs/ops/PLAN_BROKER_GUIDE.md` with the full outlined content (reuse text from SETUP where it fits, but make the new file the primary "usage bible").
3. Adds the 1-2 sentence pointers/banners in the three support files.
4. Runs the validation commands above (including the live publish_plan call for *this* task_id using the MCP tools — the planning agent will have already done the publish for the plan content; the implementer ensures the written guide matches and re-publishes or notes the published artifact).
5. If a Notion MCP is connectable in the implementer's environment, perform the first Notion page creation as a proof and record the URL in the guide + a short note in docs/ops/.
6. Open the new guide in the browser/Notion, follow its own instructions for a dry "planning session", confirm everything is copy-paste accurate.
7. PR with one clear message: "docs(ops): complete PlanBroker + publish_plan usage guide + Notion integration instructions".

This plan was produced after systematic read-only exploration (list_dir on ., .cursor, .agents, docs, tools/; multiple greps for plan-broker/notion; read of 15+ critical files including all scripts, rules, existing plans, AI docs, broker dir listing + source location; search_tool for exact MCP schemas; terminal discovery of paths and module).

**Prepared for mandatory publication via plan-broker (task_id: docs-plan-broker-usage-notion)**.

---

## Appendix: Key Evidence from Exploration (for implementer)

- plan-broker tool names (live): `plan-broker__list_plans`, `plan-broker__get_latest_plan`, `plan-broker__get_plan`, `plan-broker__publish_plan`
- publish_plan input schema: plan_markdown (str, required), task_id (str, required), metadata (object|null, default null)
- Broker dir (this env): `/mnt/c/Users/lucas/mcp-servers/plan-broker/` (plan_broker.py, run-*.ps1/sh, install.ps1, .venv, grok-mcp-debug.sh)
- Current .cursor/plans/ examples and index shape captured.
- No Notion references exist — this task introduces the integration path.
- docs/ structure is already clean post-prior reorg (good — we only add under ops/).

**Do not start implementation without re-reading the live state of the files listed in "Must read first".**