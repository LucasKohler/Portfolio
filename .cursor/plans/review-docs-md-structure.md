# Plan: Review Documentation (.md) Structure and Organization

**Task ID (proposed for publish)**: `review-docs-md-structure`

**Agent Role**: Planning agent (read-only exploration + plan authoring). No code/docs edits except this plan file.

**User Request**: "Faça uma revisão na estrutura dos arquivos .md e nas respectivas pastas para entender se essa organização está correta e legível" (Perform a review of the .md files structure and respective folders to determine if the organization is correct and readable/legible).

**MCP Publication Requirement**: Upon completion of this plan, MUST call `plan-broker__publish_plan` (via search_tool + use_tool) with this content (or consolidated version) and a descriptive kebab-case `task_id`. Do not exit plan mode without confirmed "ok" status from the publish.

---

## Context

The Portfolio repository is an AI-driven development reference project (Next.js + .NET monorepo). Per AGENTS.md (root and duplicated guidance), all agents and contributors **must** read a specific set of root-level Markdown files before any change:

Required References (from AGENTS.md:38-48):
- DESIGN.md, README.md, PRODUCT.md, ROUTES.md, COMPONENTS.md, CONTENT.md, IMPLEMENTATION_PLAN.md, ACCEPTANCE_CRITERIA.md, AI_PROMPTS.md

Decision hierarchy explicitly puts AGENTS.md and DESIGN.md at the top.

Current state (explored via list_dir, grep on *.md, find, and targeted reads of 15+ files):
- **Exactly 20 .md files live flat at the repository root** (confirmed with `ls -1 *.md | wc -l` and sorted list).
- `docs/` folder exists but is severely underused: only `UI-ANIMATION-ANALYSIS.md` (recent task artifact) + `architecture/adrs/ADR_TEMPLATE.md`. No index, no README, no navigation hub.
- `.agents/` is **well-organized** for its purpose (AI prompts, skills/SKILL.md, agent tomls, config) with a short README that correctly defers to root AGENTS.md. 17+ prompts + 6 skills.
- `stitch_the_kohler_portfolio/` (design export) contains a near-duplicate `technical_portfolio_design_system/DESIGN.md` (same color tokens as root DESIGN.md).
- `apps/web/` has minimal AGENTS.md (Next.js warning only) + boilerplate README.md — acceptable.
- `.cursor/` correctly isolates rules + transient plans.
- Screenshots (Portfolio - Home.png, Project Detail.png, Projects Index.png) sit at root alongside code and config.
- Content observations:
  - Heavy repetition of the "Required References" list + decision hierarchy (AGENTS.md, AI_PROMPTS.md, and echoed in prompts).
  - Bilingual mix: full Portuguese content in AI_PROMPTS.md (prompts + instructions), APPLICATION_DOCUMENTATION.md (title + body in PT), SETUP_MCP_FLOW.md (PT title + mixed).
  - Some conceptual overlap: ARCHITECTURE.md / DOMAIN.md / APPLICATION_DOCUMENTATION.md / CODING_STANDARDS.md all describe layering and responsibilities with slightly different emphasis.
  - AI_PROMPTS.md is very long (800+ lines) and contains both meta-instructions and many "Prompt N" step-by-step implementation scripts that duplicate guidance from IMPLEMENTATION_PLAN.md, AGENTS.md, ROUTES.md, etc.
  - Operational/MCP flow docs (SETUP_MCP_FLOW.md + scripts/*.ps1) mixed at root with product/architecture specs.
  - Cross-reference grep (pattern for known doc names + \.md) shows most links are "required list" style from the two AI entrypoint files; few deep hyperlinks between specs.
- Root `README.md` has a "Repository Structure" section but does not provide a "Documentation" navigation or purpose summary for the 20 files.

**Why this matters (per project principles in AGENTS.md, CONTRIBUTING.md, AI_WORKFLOW.md)**:
- The repo must demonstrate that "the codebase can grow without becoming messy".
- AI-assisted engineering relies on fast, unambiguous discovery of rules (AGENTS + core specs).
- Human contributors (CONTRIBUTING.md) and future maintainers need legible onboarding.
- Current flat root + underused docs/ creates discoverability debt and visual noise (`ls` at root is dominated by policy docs + design artifacts).
- This is a **Documentation-only** change (no backend/frontend/runtime impact). Scope control in AGENTS.md allows it as a contained task.

No destructive changes, no public contract breaks, no secrets involved.

---

## Recommended Approach

**Do not** move *everything* under `docs/` in a way that breaks the "read `FOO.md`" contract relied upon by AGENTS.md, AI_PROMPTS.md, 17+ reusable prompts, and the multi-agent workflow rules. Agents and the "Required References" section expect short paths at repository root for the core governance files.

**Pragmatic target structure** (minimal delta, maximum legibility gain):

```
/ (root)
  README.md                     # Keep (standard + add "Documentation" section with 1-line purposes + links)
  AGENTS.md                     # Keep at root (highest in decision hierarchy; agent entrypoint)
  DESIGN.md                     # Keep at root (visual contract; referenced first after AGENTS)
  ACCEPTANCE_CRITERIA.md        # Keep at root (enforcement checklist)
  CONTRIBUTING.md               # Keep (standard root doc)
  SECURITY.md                   # Keep (standard root doc)
  LICENSE (future)              # Standard

  docs/
    README.md                   # NEW: Documentation hub / index. "How to navigate these docs", purpose of each major doc, quick links, bilingual note.
    specs/
      PRODUCT.md
      ROUTES.md
      COMPONENTS.md
      CONTENT.md
    architecture/
      ARCHITECTURE.md
      DOMAIN.md
      APPLICATION_DOCUMENTATION.md
      CODING_STANDARDS.md
      adrs/
        ADR_TEMPLATE.md
        # (future ADR-0001-*.md etc.)
    ai/
      AI_WORKFLOW.md
      AI_PROMPTS.md             # Keep the long PT prompt collection here; consider splitting meta vs. step prompts later
    process/
      IMPLEMENTATION_PLAN.md
      RELEASE_CHECKLIST.md
      TESTING.md
    ops/
      SETUP_MCP_FLOW.md
    assets/                     # Optional later: move root PNG screenshots here + update any references in docs
      # (or keep screenshots at root if they are used as "hero images" in GitHub README rendering)

  .agents/                      # Leave as-is (already good). Update its README.md only if paths in examples change.
  .cursor/                      # Leave (tooling)
  apps/*/                       # Leave (app-specific docs stay minimal)
  stitch_the_kohler_portfolio/  # Leave (historical reference). Consider a root .gitignore or docs note; optionally remove or archive the inner duplicate DESIGN.md in a follow-up.

  # Root operational / generated stay: docker-compose*.yml, *.png (screenshots), global.json, etc.
```

**Key principles for the reorg**:
1. Preserve the "agent fast path": the 4-5 files in the top of the decision hierarchy + README stay at root with stable short names.
2. Group the rest by **concern** under `docs/`: specs (what to build), architecture (how it's structured), ai (how we use agents), process (how we ship), ops (how we run the MCP flow).
3. Add a single navigation point: `docs/README.md`.
4. Update **every** place that hardcodes the old "required list" or example paths:
   - Root AGENTS.md (the canonical list + decision hierarchy + "Required References" + any full examples in later sections)
   - AI_PROMPTS.md (the PT version of the list + many "leia X.md" instructions inside the 16+ prompts)
   - CONTRIBUTING.md (references AI_WORKFLOW.md + "relevant project documentation")
   - README.md (Repository Structure + any doc mentions)
   - .agents/prompts/*.md (scan for explicit "read FOO.md" that would break; most use relative or "the files listed in AGENTS")
   - .cursor/rules/plan-orchestration.md (mentions AGENTS + ACCEPTANCE)
   - Any other internal cross-refs found via grep.
5. Handle bilingual reality: docs/README.md should note "Core governance in EN at root; detailed PT implementation prompts live in docs/ai/AI_PROMPTS.md".
6. De-dupe opportunity (non-blocking for this plan): note the stitch subdir DESIGN.md as legacy; a future cleanup can delete or document it.
7. ADR process: the current location `docs/architecture/adrs/` is fine once we have an index or process note in ARCHITECTURE.md or docs/README.md. No need to move the template for v1 of this reorg.
8. Do **not** introduce new tooling (no mkdocs, no docusaurus) — keep plain .md + folder structure. Matches "simple but professional monorepo" and "do not overengineer".

**Alternatives considered (and why not primary)**:
- Full flat `docs/` for everything: would require updating dozens of agent prompts + AGENTS lists + risks breaking "copy-paste read these files" workflows. Too high migration cost for the gain.
- Keep everything at root + add only a TOC in README: does not solve the `ls *.md` noise or long-term growth (new ADRs, more analyses, more ops runbooks will make it worse).
- Move AI_PROMPTS into .agents/: tempting but AI_PROMPTS is referenced in the root "Required References" list and acts as a runnable script collection for the whole project. Better under docs/ai/.

**Files / locations that will change (high confidence from exploration)**:
- Create: `docs/README.md` (new hub)
- Move + update internal content if needed:
  - PRODUCT.md, ROUTES.md, COMPONENTS.md, CONTENT.md → `docs/specs/`
  - ARCHITECTURE.md, DOMAIN.md, APPLICATION_DOCUMENTATION.md, CODING_STANDARDS.md → `docs/architecture/`
  - AI_WORKFLOW.md, AI_PROMPTS.md → `docs/ai/`
  - IMPLEMENTATION_PLAN.md, RELEASE_CHECKLIST.md, TESTING.md → `docs/process/`
  - SETUP_MCP_FLOW.md → `docs/ops/`
- Edit (reference updates + any example paths):
  - AGENTS.md (multiple sections: Required References, decision hierarchy examples, "Read all markdown files in the root", later mentions of specific files)
  - AI_PROMPTS.md (the initial lists + nearly every Prompt N that says "leia X.md" or repeats the hierarchy)
  - CONTRIBUTING.md
  - README.md
  - .cursor/rules/plan-orchestration.md (light)
  - .agents/README.md (if it has path examples)
  - Possibly individual .agents/prompts/*.md that contain explicit file lists (use grep to find before editing)
- Optional cleanup (document as follow-up, not required for this plan's acceptance):
  - Root PNG screenshots → `docs/assets/` (update any markdown image links or references)
  - Note on stitch duplicate DESIGN.md
- No changes to actual implementation code, Docker, tests, or .NET/Next.js sources (pure docs reorg).

**Existing patterns / assets to reuse**:
- The decision hierarchy and "Required References" block text from AGENTS.md:1-63 (and mirrored in AI_PROMPTS.md).
- The ADR template structure at `docs/architecture/adrs/ADR_TEMPLATE.md` (keep location or reference it from new docs/README.md).
- .agents/skills/* /SKILL.md pattern (structured, self-describing) — the new docs/README.md can follow a similar lightweight "purpose + scope + when to read" format.
- Current "Repository Structure" code block in README.md (update it to reflect new docs/ layout).
- Cross-ref style already used in CONTRIBUTING.md ("Read the relevant project documentation. Read `AI_WORKFLOW.md` when...").
- Plan-broker publication flow + `.cursor/rules/plan-orchestration.md` (this plan itself must follow the "first step: get plan" but since we are authoring the plan, we are the source).

**Out of scope for the reorg implementation (but can be noted in the plan)**:
- Rewriting or splitting the very long AI_PROMPTS.md into smaller per-phase files.
- Creating actual ADR files.
- Adding a validation script (e.g. `scripts/validate-docs.sh` that checks required files exist and basic links).
- Moving or archiving stitch export subfolders.
- Changing screenshot hosting (they render in GitHub README today).

---

## Detailed Implementation Steps (for the executor)

The plan below is written so a future implementer (or backend-worker/frontend-worker if any docs touch code, but here pure docs) or human can execute safely.

1. **Preparation (read-only first)**
   - Read AGENTS.md (full), AI_PROMPTS.md (key sections with lists), README.md, CONTRIBUTING.md, .cursor/rules/plan-orchestration.md.
   - Run the discovery commands used in this planning session to get fresh file list:
     `find . -name "*.md" -type f | grep -v node_modules | sort`
     `ls -1 *.md`
     `grep -r --include="*.md" "AGENTS.md\|DESIGN.md\|ROUTES.md" . --exclude-dir=node_modules --exclude-dir=.git | head -30`
   - Confirm git status clean.

2. **Create the new docs hub**
   - Write `docs/README.md` with:
     - Short intro: "This folder contains detailed specifications, architecture notes, AI workflows, process checklists and operational guides. Core governance files remain at repository root per AGENTS.md decision hierarchy."
     - Navigation table or sections grouped by the 5 buckets (specs, architecture, ai, process, ops).
     - One-line purpose for every moved doc.
     - Note on bilingual content.
     - Link back to root AGENTS.md, DESIGN.md, ACCEPTANCE_CRITERIA.md.
     - How to propose doc changes (align with CONTRIBUTING + this structure).

3. **Move files (git mv where possible to preserve history)**
   - `git mv PRODUCT.md docs/specs/PRODUCT.md`
   - Same for ROUTES.md, COMPONENTS.md, CONTENT.md
   - `git mv ARCHITECTURE.md docs/architecture/ARCHITECTURE.md` etc. for the four architecture docs
   - `git mv AI_WORKFLOW.md docs/ai/AI_WORKFLOW.md`
   - `git mv AI_PROMPTS.md docs/ai/AI_PROMPTS.md`
   - `git mv IMPLEMENTATION_PLAN.md docs/process/IMPLEMENTATION_PLAN.md`
   - `git mv RELEASE_CHECKLIST.md docs/process/RELEASE_CHECKLIST.md`
   - `git mv TESTING.md docs/process/TESTING.md`
   - `git mv SETUP_MCP_FLOW.md docs/ops/SETUP_MCP_FLOW.md`
   - Create the subdirectories as needed (they will be created by the mv or explicitly).

4. **Update all references (the critical, error-prone step)**
   - In AGENTS.md:
     - Update the "Required References" bullet list to use new paths for the moved items (e.g. `docs/specs/ROUTES.md`).
     - Update the decision hierarchy example block if it lists paths.
     - Update the "Phase 0 — Inspect Context" sentence: "Read all markdown files in the root." → "Read the required references listed above and the documentation under `docs/` ."
     - Any other full file lists or "read X.md" examples (grep for them inside the file).
   - In AI_PROMPTS.md:
     - Update every occurrence of the required list (there are multiple copies at the top and inside prompts).
     - Update sentences inside each "Prompt N" that instruct "leia `ROUTES.md`", "consulte `COMPONENTS.md` e `CONTENT.md`", etc. Change to the new relative paths from repo root.
     - Keep the spirit: the prompts are still the detailed runnable steps.
   - In README.md: update the Repository Structure diagram/example and add a new "## Documentation" section after it that lists the root governance files + points to `docs/README.md` for everything else.
   - In CONTRIBUTING.md: update the "Before You Start" step that mentions `AI_WORKFLOW.md` to the new path `docs/ai/AI_WORKFLOW.md`. Add a note to read `docs/README.md` for navigation.
   - In .cursor/rules/plan-orchestration.md: the sentence "Ler `AGENTS.md`, `ACCEPTANCE_CRITERIA.md` e docs relevantes" — "docs relevantes" can stay general or be made more precise if desired (low priority).
   - In .agents/README.md: it only says "read the root `AGENTS.md`" — no change needed unless examples are added.
   - Scan .agents/prompts/ with grep for any hardcoded "read FOO.md" that would 404 after move; update the few that do (most delegate to AGENTS).
   - Any image or link references to the moved .md files from other .md (rare).
   - After edits, run `grep -r --include="*.md" "PRODUCT.md\|ROUTES.md\|COMPONENTS.md\|CONTENT.md\|AI_WORKFLOW.md\|IMPLEMENTATION_PLAN.md" . --exclude-dir=node_modules | grep -v docs/ | cat` to find stragglers.

5. **Add / update navigation in root files**
   - Enhance root README.md "Repository Structure" or add a dedicated short "Key Documentation" box.
   - Optionally add a comment in AGENTS.md near the required list: "Detailed specs live under `docs/specs/`, architecture under `docs/architecture/`, etc. See `docs/README.md`."

6. **Optional but recommended in same PR**
   - Move the three root PNG screenshots into `docs/assets/` (or a new `assets/` at root) and update any markdown that embeds them (README or the UI-ANIMATION-ANALYSIS if it references).
   - Add a short note in the new docs/README.md about the stitch export being visual reference only (and that its inner DESIGN.md duplicates the root one).

7. **Validation (mandatory — executor must run and report output)**
   - `git status --short --branch`
   - `git diff --check`
   - Re-run the file discovery:
     `find . -name "*.md" -type f | grep -v node_modules | sort`
   - Verify the "required references" are still resolvable (manual or `ls` the exact paths listed in the updated AGENTS.md).
   - `cd apps/web && npm run lint` (should be unaffected)
   - `dotnet build apps/api/Portfolio.slnx` (unaffected)
   - If any docs contain shell examples that were tested before, re-validate those commands still make sense.
   - Open key files in mind: "If an agent starts, can it still find the contract files in <5 reads?"
   - Confirm no 404 risk for the most common references (AGENTS, DESIGN, ACCEPTANCE, ROUTES, etc.).

8. **Commit / PR hygiene (per AGENTS.md rules)**
   - One primary reason: "Reorganize documentation for better legibility while preserving agent onboarding paths."
   - List every moved file and every edited reference file in the PR description.
   - Call out that this is docs-only and required reference lists were updated in lockstep.
   - Unvalidated areas: long-term usage by external contributors or specific prompt executions (recommend a small test with a fresh agent session after merge).

---

## Critical Files to Modify / Create (summary table for executor)

| Action     | Path (new)                          | Notes / Reuse |
|------------|-------------------------------------|---------------|
| Create     | docs/README.md                      | New navigation hub. Model after .agents/README.md brevity + purpose. |
| Move+Edit  | docs/specs/PRODUCT.md               | Update any self-refs if absolute. |
| Move+Edit  | docs/specs/ROUTES.md                | Heavy cross-ref target. |
| Move+Edit  | docs/specs/COMPONENTS.md            | Same. |
| Move+Edit  | docs/specs/CONTENT.md               | Same. |
| Move+Edit  | docs/architecture/ARCHITECTURE.md   | Overlap analysis with siblings. |
| Move+Edit  | docs/architecture/DOMAIN.md         | - |
| Move+Edit  | docs/architecture/APPLICATION_DOCUMENTATION.md | PT content. |
| Move+Edit  | docs/architecture/CODING_STANDARDS.md | - |
| Move       | docs/architecture/adrs/ADR_TEMPLATE.md | Already there; just ensure visible from hub. |
| Move+Edit  | docs/ai/AI_WORKFLOW.md              | Update refs in CONTRIBUTING + prompts. |
| Move+Edit  | docs/ai/AI_PROMPTS.md               | **Highest edit volume** — many repeated lists inside 16 prompts. |
| Move+Edit  | docs/process/IMPLEMENTATION_PLAN.md | Update "read all markdown files in the root". |
| Move+Edit  | docs/process/RELEASE_CHECKLIST.md   | - |
| Move+Edit  | docs/process/TESTING.md             | - |
| Move+Edit  | docs/ops/SETUP_MCP_FLOW.md          | Operational, good to isolate. |
| Edit       | AGENTS.md (root)                    | Core contract. Multiple sections. Use search_replace carefully for each list occurrence. |
| Edit       | AI_PROMPTS.md (will move)           | See above. |
| Edit       | README.md (root)                    | Structure diagram + new Documentation section. |
| Edit       | CONTRIBUTING.md                     | "Before you start" + AI_WORKFLOW path. |
| Edit (minor) | .cursor/rules/plan-orchestration.md | Optional tightening. |
| Scan+Edit  | .agents/prompts/*.md (as needed)    | Use `grep` first. Most are safe. |

**No changes** to: actual source under apps/, Dockerfiles, .agents/ structure (except possible prompt text fixes), stitch export contents, .env*, package files, etc.

---

## Verification & Success Criteria

The reorg is successful when:

1. A human running `ls` at root sees a clean, professional set of files (README + 5-7 governance/policy files max, no 20-md wall).
2. `docs/README.md` exists and provides clear one-glance navigation to any spec.
3. An agent following the updated "Required References" list in AGENTS.md can still locate every mandated document with the exact (new) paths provided.
4. All previous cross-references (grep hits) either point to the new locations or have been intentionally generalized to "see docs/README.md".
5. `git status` shows only intended moves + edits to .md files.
6. Validation commands listed in step 7 above pass and are recorded in the PR.
7. The decision hierarchy and "no fake claims / maintainable growth" spirit of the project is preserved (the reorg itself demonstrates the principle).

**Risks / items that need human judgment during execution**:
- Volume of search/replace in the very long AI_PROMPTS.md (risk of missing one copy of the list). Mitigate by doing replaces per unique string + final global grep.
- Any external links or bookmarks people may have to raw GitHub paths of the moved files (rare for internal specs; acceptable breakage for a docs hygiene PR).
- Bilingual readers: PT prompts will now live deeper; the new docs/README.md must make the location obvious.

**Next smallest safe step after this plan** (once published and approved):
- Executor reads this plan + the current (post-plan) state of AGENTS.md and docs/.
- Performs the preparation discovery commands.
- Creates the `docs/` skeleton + hub README first (small PR or first commit).
- Then batch of moves + reference updates.
- Full validation + PR.

---

## Appendices (from planning exploration)

**Exact root .md files at planning time (20)**:
ACCEPTANCE_CRITERIA.md AGENTS.md AI_PROMPTS.md AI_WORKFLOW.md APPLICATION_DOCUMENTATION.md ARCHITECTURE.md CODING_STANDARDS.md COMPONENTS.md CONTENT.md CONTRIBUTING.md DESIGN.md DOMAIN.md IMPLEMENTATION_PLAN.md PRODUCT.md README.md RELEASE_CHECKLIST.md ROUTES.md SECURITY.md SETUP_MCP_FLOW.md TESTING.md

**Key evidence locations**:
- AGENTS.md:38 (Required References), 54 (decision hierarchy), 114+ (more lists), 326 ("Follow DESIGN.md strictly"), 415 ("Check against ACCEPTANCE_CRITERIA.md").
- AI_PROMPTS.md: lines with repeated lists (multiple), 448, 508, 564, 622, 731, 763, 845 etc.
- .cursor/rules/plan-orchestration.md and .agents/README.md for workflow expectations.
- Current `docs/` contents and .agents/ structure confirmed via list_dir + find.
- Duplicate DESIGN tokens confirmed by reading both DESIGN.md files.

This plan was built by systematic read-only exploration (list_dir on ., .agents, docs, .cursor; find + grep for *.md; parallel read_file of 15+ high-value docs; search_tool for plan-broker schema; cross-ref greps). No assumptions about unopened files were used for the file list.

**Prepared for publication via plan-broker (task_id: review-docs-md-structure)**.