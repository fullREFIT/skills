# Cowork Batch Execution Document Template

Use this template when generating the Cowork batch document.

---

```markdown
# {Project Name} — Cowork Batch Execution

**Project:** {project-name}
**Date:** {YYYY-MM-DD}
**Total Tasks:** {N}
**Estimated Time:** {total estimate}
**Output Root:** {OUTPUT_ROOT}/cowork/{project-name}/

## Why This Matters

{2-3 sentences. The business or content reason this batch exists. What outcome it enables, what it unblocks, who consumes the output. Use this section to give Cowork the strategic frame so judgment calls inside individual tasks land closer to intent. Avoid generic statements ("produce high-quality content") — name the specific decision, audience, or downstream use that depends on this work.}

{If purely tactical (reformatting existing content, mechanical transformation), state that plainly: "Tactical batch — no strategic context needed. Follow each task's specification literally."}

## Architecture Constraints

{Include this section ONLY if non-obvious constraints shape content or format decisions across the batch. Delete the section entirely if there are no cross-cutting constraints — don't pad.}

Constraints listed here apply to **every task** in the batch unless a specific task overrides them. Examples of what belongs here:

- **Republication format:** Carousel slides will be exported to PDF — keep slides under 30 words, avoid wide tables, no horizontal scrolling content.
- **Cross-platform reuse:** Same body content will appear on LinkedIn and the blog — opener/hook must differ between surfaces, body stays identical.
- **Source fidelity:** Quotes from source transcripts must be verbatim — no paraphrasing, no smoothing of filler words in direct quotes.
- **Voice persistence:** Maintain a single voice across artifacts (e.g., [Your Brand]: direct, no filler, no hollow affirmations) — don't switch register between tasks.
- **Downstream consumer:** Output will be ingested by an automated pipeline expecting strict markdown structure — front-matter must validate, H2 headings only at top level.
- **Length budget across the batch:** Total batch output must fit within a 12-slide carousel — per-task word counts are caps, not targets.

## Task Dependency Graph

{Include this section ONLY when the batch has 5+ tasks AND there are dependencies worth visualizing. Skip for small or fully independent batches.}

```
Task 1 (research)  ──┐
Task 2 (research)  ──┼──→ Task 4 (synthesis)  ──→  Task 6 (final report)
Task 3 (research)  ──┘                          ↗
                        Task 5 (outline)  ─────┘
```

Tasks with no arrows pointing into them are independent — they can run in any order. Tasks producing inputs for later tasks must complete before their dependents start. Cowork executes sequentially regardless of the graph, but the graph helps Cowork understand WHY a task references "Task N's output" and detect when an upstream task's failure should cause a downstream skip.

## Prerequisites

{If any Claude Code tasks must complete first, list them here:}
- [ ] {Claude Code task 1 — description} (run via Task Orchestrator)
- [ ] {Claude Code task 2 — description} (run via Task Orchestrator)

{If no prerequisites:}
None. All tasks can execute immediately.

## Execution Contract

Execute every task below in order. For each task:

1. Read the full task prompt before starting.
2. Produce the specified output at the specified path.
3. **Self-verify** every acceptance criterion. If any fails, attempt **one** regeneration targeting only the failed criterion. If it still fails, log the failure to `BATCH-SUMMARY.md` and continue.
4. Move to the next task.

**Pre-authorized actions.** Do these without asking:

- Read any file at any absolute path referenced in a task prompt.
- Invoke skills referenced in a task prompt (e.g., `your-brand-context`).
- Spawn parallel sub-agents when a task says "simultaneously."
- Apply Architecture Constraints when resolving ambiguity inside a task.
- Write to the Output Root directory and its subdirectories.
- Update `BATCH-SUMMARY.md` after every task (don't wait until the end).

**Out of scope — do not do without explicit task-level authorization:**

- Write, modify, or delete files outside the Output Root.
- Send Slack messages, emails, or any external communication.
- Install or modify connectors, change settings, or modify the environment.
- Modify task prompts or output paths.

**Error handling.** A task is considered failed after self-verification retry has also failed, or if the work cannot be produced at all. Log to `BATCH-SUMMARY.md`: task number, output path, the specific criterion that failed (or reason work could not be produced), and a one-line summary. Then continue. Do not stop the batch for a single failure.

**Upstream failure handling.** If a task depends on the output of an earlier failed task (per the Dependency Graph), mark it `SKIPPED — upstream failed` in `BATCH-SUMMARY.md` rather than producing degraded output from partial inputs.

**Checkpoints.** {Include this section only for batches with >10 tasks.} After completing tasks {N} through {M}, pause and verify that all output files exist at their specified paths and meet acceptance criteria. Note any issues in `BATCH-SUMMARY.md`. Then continue.

**Ambiguity protocol.** Do not ask for clarification. If a task is ambiguous, apply in order: (1) Architecture Constraints, (2) Why This Matters context, (3) the most reasonable assumption consistent with both. Log any non-obvious assumption in `BATCH-SUMMARY.md`. Do not skip tasks (except upstream-failure skips). Do not modify output paths.

**Completion rule.** The run ends when every task has either produced its output at the specified path with acceptance criteria met, or has a failure / skip entry in `BATCH-SUMMARY.md`. Do not declare partial success and stop. Do not summarize mid-batch and ask whether to continue.

---

## TASK 1: {Title}

**Output:** {exact file path, e.g., {OUTPUT_ROOT}/cowork/{project-name}/deliverable-1.md}
**Depends on:** {None | Task N}
**Time estimate:** {estimate}

### What to produce

{Specific, self-contained instructions. Everything Cowork needs is here.}

{For content tasks, include:}
- Exact structure (sections, headings, sequence)
- Word count or length guidance (e.g., "800-1200 words" not "medium length")
- Audience: {who reads this}
- Tone: {specific descriptors, e.g., "direct, no filler, practitioner-level" not "professional"}
- Source material: {full file path or inline content}

{For research tasks, include:}
- Exact questions to answer
- Sources to check (specific URLs, file paths, or search queries)
- Output format (table, narrative, scored list, etc.)
- Depth: {surface scan vs. deep analysis}
- If multiple independent research targets: "Research these simultaneously" to trigger parallel sub-agents

{For structured file tasks, include:}
- Exact file format (JSON schema, CSV columns, markdown structure)
- All field definitions
- Example row/entry
- Data source: {where to pull from}

### Brand compliance (if customer-facing)

{Include ONLY if the output is customer-facing. Otherwise delete this section.}

- Typography: [your brand font family]
- Colors: [your brand color palette]
- No emojis in professional materials
- No italics for emphasis
- Banned words: [list your brand's banned words]
- Reader is the subject; creator's work is the evidence

### Acceptance criteria

- [ ] {Verifiable check 1 — e.g., "Document contains exactly 5 sections with H2 headings"}
- [ ] {Verifiable check 2 — e.g., "Every recommendation includes a specific tool name and use case"}
- [ ] {Verifiable check 3 — e.g., "No banned words appear anywhere in the document"}
- [ ] {Verifiable check 4 — e.g., "File exists at the specified output path"}

---

## TASK 2: {Title}

**Output:** {exact file path}
**Depends on:** {Task 1 | None}
**Time estimate:** {estimate}

### What to produce

{Same structure as Task 1. Fully self-contained.}

### Acceptance criteria

- [ ] {checks}

---

{Continue for all tasks...}

---

## Batch Summary

When all tasks are complete, produce a summary at:
{OUTPUT_ROOT}/cowork/{project-name}/BATCH-SUMMARY.md

Include:
- Task count: {N} completed, {N} failed (if any)
- Output files produced (list each with path)
- Failed tasks (list with error reason)
- Any assumptions made during execution
- Any issues encountered
- Total execution time (approximate)
```
