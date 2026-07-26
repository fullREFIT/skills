---
name: prep-project
description: >-
  Analyze a project folder and produce executor-ready specification packages. Auto-routes deliverables to Cowork (content, research, docs, analysis) or the Claude Code task-orchestrator (bash, MCP tools, deployment, Git), and produces both packages when a project spans surfaces. Outputs a single COWORK-BATCH.md (Cowork) or a 5-file spec — README.md, 00-PROJECT-INDEX.md, CLAUDE-TASKS.md, SPECS.md, DEPENDENCIES.md (orchestrator). Every task is self-contained with an absolute output path and verifiable acceptance criteria. Use when decomposing a project into autonomous-execution-ready tasks. MANDATORY TRIGGERS: prep project, prepare project, prep for cowork, prep for orchestrator, prep for execution, project spec, execution spec, batch execution prep, task decomposition, cowork batch, orchestrator spec.
license: MIT
allowed-tools: Read, Write, Glob, Grep
metadata:
  user-invocable: "true"
  argument-hint: "[/path/to/project-folder]"
  version: "2.2.0"
---

# Prep Project

Analyze a project folder and produce a specification package the executing agent runs with zero ambiguity. Replaces the older split between `prep-project-for-cowork` and `prep-project-for-orchestrator` — this skill detects routing automatically and produces both packages when a project spans surfaces.

## Two Output Targets

| Target | Format | When |
|---|---|---|
| **Cowork** | Single `COWORK-BATCH.md` file | Deliverables are content, documents, research, analysis, structured files. No terminal, MCP tools, or deployment. |
| **Orchestrator** (Claude Code task orchestrator) | 5-file spec package: `README.md`, `00-PROJECT-INDEX.md`, `CLAUDE-TASKS.md`, `SPECS.md`, `DEPENDENCIES.md` | Deliverables require bash, MCP tools (n8n, Supabase, Airtable, Slack, Vercel, etc.), database operations, Git, deployment, or code execution. |

If a project has deliverables of **both types**, this skill produces **both packages** automatically — no need to invoke the skill twice. Cross-package dependencies are tracked so the user knows which to run first.

## Workflow

Six steps. Same workflow regardless of target — Step 4 branches on routing.

1. **Analyze** the source project folder
2. **Classify** each deliverable by execution surface
3. **Sequence** tasks in dependency order
4. **Generate** the appropriate package(s) — Cowork batch, orchestrator spec, or both
5. **Verify** using the quality checklist
6. **Save and notify**

## Step 1: Analyze the Project

Read every file in the provided project folder recursively (skip binaries, `node_modules`, `.git`). Build a mental model:

- What is this project? (software, content, automation, product launch, brand identity, etc.)
- What needs to be built? (code, workflows, schemas, content, deployments, manual setup)
- What tools/platforms are involved? (Supabase, n8n, Vercel, Slack, APIs, CRMs)
- What are the dependencies between deliverables?
- What can be automated vs. what needs a manual runbook?
- Is there source material (transcripts, briefs, brand context) the executor will need?

## Step 2: Classify Each Deliverable

Use the routing table in [`references/routing-table.md`](references/routing-table.md). The summary classifier:

| Route To | Signals |
|----------|---------|
| **Cowork** | Write, draft, research, analyze, create document, design content strategy, produce report, generate file, outline, plan, review, score, evaluate, summarize, extract, organize |
| **Claude Code Orchestrator** | Build, deploy, configure, install, run, test, migrate, automate workflow, database operation, Git operation, bash command, MCP tool call (n8n, Supabase, Vercel, Slack, Airtable, Notion) |
| **Manual** | Requires browser login, credential creation, platform UI configuration, OAuth authorization, high-judgment human decisions |

Mixed projects are normal. A "launch a new lead magnet" project might have content tasks (Cowork), Vercel deployment tasks (Orchestrator), and Stripe checkout setup (Manual). All three get represented in the appropriate package.

## Step 3: Sequence Tasks

Order tasks so that:

- Tasks with no dependencies come first
- Tasks producing inputs for later tasks are sequenced before their dependents
- Independent tasks are grouped (Cowork runs sequentially but grouping signals they don't block each other; orchestrator can parallelize within groups)
- For Cowork batches with >10 tasks, insert a checkpoint task after every 5-7 tasks
- For orchestrator specs, group into Phase 1 (Parallel — no dependencies), Phase 2 (After Phase 1), etc.

Cross-package dependencies (e.g., orchestrator must deploy the database before Cowork can write the seed data) are flagged in the receiving package's prerequisites section.

## Step 4: Generate the Package(s)

### If Cowork-routable deliverables exist

Produce a single `COWORK-BATCH.md` file using the template in [`references/cowork-batch-template.md`](references/cowork-batch-template.md).

Save to: `{OUTPUT_ROOT}/cowork/{project-name}/COWORK-BATCH.md`

The Cowork batch document includes three batch-level rigor sections borrowed from the orchestrator template:

1. **Why This Matters** (always include) — 2–3 sentences giving Cowork the strategic frame so judgment calls inside vague task prompts land closer to intent. For purely mechanical batches, state "Tactical batch — follow each task literally" rather than padding.
2. **Architecture Constraints** (include only when relevant) — cross-cutting constraints that shape every task: republication format, voice persistence, source fidelity, downstream consumer requirements, batch-wide length budgets. Delete the section entirely if no such constraints exist.
3. **Task Dependency Graph** (include only for batches with 5+ tasks and real dependencies) — ASCII graph showing how tasks feed each other. Cowork still executes sequentially, but the graph informs upstream-failure-skip decisions.

These three sections appear at the top of the document, before Prerequisites. Task-level sections (Output path, Depends on, What to produce, Brand compliance, Acceptance criteria) remain unchanged.

### If Orchestrator-routable deliverables exist

Produce 5 files using the templates in [`references/orchestrator-spec-templates.md`](references/orchestrator-spec-templates.md):

| File | Purpose |
|------|---------|
| `README.md` | Project overview, business justification, success criteria |
| `00-PROJECT-INDEX.md` | Status tracker, execution order, output locations |
| `CLAUDE-TASKS.md` | Self-contained execution prompts per task (most important file) |
| `SPECS.md` | Detailed requirements per deliverable |
| `DEPENDENCIES.md` | External refs, credentials, blockers, MCP servers needed |

Save to: `{OUTPUT_ROOT}/projects/{project-name}/`

### If both targets apply

Produce both packages. In each, mark tasks that depend on output from the other package with explicit cross-references. Example: a Cowork task that needs a deployed Vercel URL marks itself as `Depends on: orchestrator package CODE-002 (Vercel deployment)`.

### Critical rules for every task prompt (both targets)

The acid test: **could the executor complete every task without asking a single question?** If not, the task is broken.

- **Self-contained.** All context, file paths, constraints, and reference content must be in the task prompt itself. The executor has zero memory of the planning conversation.
- **Absolute output paths.** Every task names the exact filesystem path where its output saves.
- **Inline content.** No "write compelling copy" or "create appropriate content" — content decisions belong to this skill, not the executor.
- **Verifiable acceptance criteria.** Every task ends with criteria a fresh agent can evaluate pass/fail.
- **Vague-language ban.** Never use: "appropriate", "as needed", "compelling", "relevant", "suitable", "engaging", "make it good", "polish it", "clean it up", "handle edge cases".
- **Absolute file references.** Source files referenced from tasks use full absolute paths.
- **Brand rules inline.** If a task produces customer-facing output, brand compliance rules are stated inline in the task prompt.
- **Sub-agent triggers (Cowork only).** For independent research subtasks within a single task, use "simultaneously" to trigger Cowork's parallel sub-agent capability.

For calibration examples showing exactly what good and bad task prompts look like — applicable to both targets — read [`references/good-vs-bad-prompts.md`](references/good-vs-bad-prompts.md).

## Step 5: Quality Check

Read [`references/quality-checklist.md`](references/quality-checklist.md) and verify every item before saving. Every check must pass. Common failures:

- Vague language in task prompts
- Missing absolute output paths
- Source material referenced but not embedded or linked
- Cowork tasks accidentally requiring bash or MCP execution
- Orchestrator tasks pretending to be Cowork tasks (missing the bash specifics)
- Cross-package dependencies not noted in prerequisites

If any check fails, fix the specific issue and re-verify before saving.

## Step 6: Save and Notify

Save packages to their target paths. Tell the user the absolute paths and the exact run command for each package.

**For Cowork-only projects:**
```
Cowork batch ready: {name}
Location: {OUTPUT_ROOT}/cowork/{name}/COWORK-BATCH.md
Tasks: {N} total
How to run: Open Cowork, reference COWORK-BATCH.md, say "Execute all tasks in this document sequentially."
```

**For orchestrator-only projects:**
```
Project prepped for orchestrator: {name}
Location: {OUTPUT_ROOT}/projects/{name}/
Tasks: {N} total ({A} automated, {R} runbooks)
Blocked: {B} (list blockers if any)
Run: 'run {folder-name}' in the Task Orchestrator session
```

**For mixed projects:**
```
Project prepped (multi-target): {name}
- Cowork batch: {OUTPUT_ROOT}/cowork/{name}/COWORK-BATCH.md ({N} tasks)
- Orchestrator spec: {OUTPUT_ROOT}/projects/{name}/ ({M} tasks)
Run order: {which package goes first}
```

## Bundled Resources

| File | Purpose | When to load |
|------|---------|--------------|
| [`references/routing-table.md`](references/routing-table.md) | Single source of truth for which deliverable type routes where | Step 2 (classification) |
| [`references/cowork-batch-template.md`](references/cowork-batch-template.md) | Exact format for COWORK-BATCH.md | Step 4 (Cowork-routable deliverables) |
| [`references/orchestrator-spec-templates.md`](references/orchestrator-spec-templates.md) | Templates for the 5-file orchestrator spec | Step 4 (orchestrator-routable deliverables) |
| [`references/good-vs-bad-prompts.md`](references/good-vs-bad-prompts.md) | Calibration examples — applies to both targets | Step 4 (writing task prompts) |
| [`references/quality-checklist.md`](references/quality-checklist.md) | Pre-save verification | Step 5 (always) |
| [`scripts/scaffold-project.sh`](scripts/scaffold-project.sh) | Bash helper for creating the orchestrator project directory structure | Step 4 (optional, for orchestrator target) |

## Migration Note

This skill replaces:
- `prep-project-for-cowork` (deprecated — use this skill, target = Cowork)
- `prep-project-for-orchestrator` (deprecated — use this skill, target = orchestrator)

If you have existing project specs from those skills, they remain valid — the underlying templates are unchanged. The consolidation only affects new projects going forward.

---

*Prep Project v2.2 — Cowork batch template gains Execution Contract section: pre-authorized actions, self-verification gate with one retry, scope boundary, explicit completion rule (May 2026)*
*v2.1 — Cowork batch template gains Why-This-Matters, Architecture Constraints, and Task Dependency Graph sections (May 2026)*
*v2.0 — Consolidated from prep-project-for-cowork + prep-project-for-orchestrator (May 2026)*
*Conformant to agentskills.io open standard*
