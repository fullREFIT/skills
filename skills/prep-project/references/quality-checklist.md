# Prep-Project Quality Checklist

Run this checklist against every package (COWORK-BATCH.md or 5-file orchestrator spec) before saving. Every item must pass. The principles are identical for both targets — the differences are noted inline where they apply.

## Self-Containment

- [ ] Could someone who has never heard of this project hand the package to the executor and get correct output?
- [ ] Every task prompt includes all context the executor needs (the executor has zero memory of the planning conversation)
- [ ] Source material referenced in tasks is either embedded inline OR linked with a full absolute path that the executor can read
- [ ] Brand compliance rules, if relevant to the task, are stated inline — never "follow brand guidelines" without specifying which rules
- [ ] No phrases that delegate decisions back to the executor: "appropriate", "as needed", "compelling", "relevant", "suitable", "engaging"
- [ ] No placeholder comments: no `<!-- TODO -->`, no `TBD`, no "see examples below" without examples

## Output Specifications

- [ ] Every task has a specific output path (absolute, e.g., `{OUTPUT_ROOT}/cowork/{project-name}/deliverable-1.md`)
- [ ] Every task has acceptance criteria a fresh agent can evaluate pass/fail without asking questions
- [ ] Output format is named explicitly (markdown, JSON, HTML, code with language, etc.)
- [ ] If the output is a file, the file extension is correct for the format

## Routing Discipline

- [ ] No Cowork tasks reference bash, terminal, or MCP-tool execution requirements (those route to orchestrator)
- [ ] No orchestrator tasks ask for "creative writing" without specific structural constraints (those route to Cowork)
- [ ] Manual tasks (credential creation, browser logins, platform UI configuration) are clearly marked as manual runbooks, not automated tasks
- [ ] If the project has deliverables on both Cowork and orchestrator paths, the user gets BOTH packages, with prerequisites clearly noted

## Dependencies and Sequencing

- [ ] Tasks with dependencies declare them explicitly: `Depends on: TASK-3`
- [ ] Independent tasks are grouped (signaling parallelism, even if execution is sequential)
- [ ] Blocked tasks are explicitly marked with the condition that unblocks them
- [ ] No circular dependencies (Task A → Task B → Task A)

## Risk Markers

- [ ] High-blast-radius actions (deploy to production, send to live email list, post to LinkedIn organic, modify production database) include a human review gate before execution
- [ ] External API calls that cost money or hit rate limits include explicit budget/limit constraints
- [ ] Any irreversible actions (delete, drop, force push) include a confirmation requirement

## Cowork-Specific Checks (apply to COWORK-BATCH.md only)

- [ ] No tasks require bash, code execution, deployment, or Git operations
- [ ] No tasks require Computer Use or browser automation
- [ ] If parallel sub-agents would help (independent research subtasks), the prompt uses "simultaneously" to trigger Cowork's parallel capability
- [ ] For batches with >10 tasks, a checkpoint task is inserted every 5-7 tasks instructing Cowork to verify progress

## Orchestrator-Specific Checks (apply to 5-file orchestrator spec only)

- [ ] All 5 files are present: `README.md`, `00-PROJECT-INDEX.md`, `CLAUDE-TASKS.md`, `SPECS.md`, `DEPENDENCIES.md`
- [ ] `DEPENDENCIES.md` lists every external system, credential, and MCP server the project needs
- [ ] `CLAUDE-TASKS.md` is the most-detailed file — every other file references it for execution prompts
- [ ] `SPECS.md` documents the *what* (deliverable specifications); `CLAUDE-TASKS.md` documents the *how* (executor prompts)
- [ ] Tasks requiring MCP tools name the specific MCP server (e.g., "Supabase MCP", not "the database")
- [ ] Tasks running bash commands include the exact command, not pseudocode

## Failure Resolution

If any check fails, fix the specific issue and re-verify. Do not save broken packages.

The acid test: **could the executor (Cowork or task orchestrator) complete every task in this package without asking a single question or producing wrong output?** If you can't answer "yes" with confidence, find the weak task and fix it before saving.
