---
name: plan-execute-router
description: "Executes the plan/execute model routing pattern to cut AI-workflow cost by 50–75% on feature builds, refactors, and migrations. Claude plans the task at frontier capability and produces a detailed spec, then routes execution to a cheaper model — via Codex CLI subprocess if available, a Claude Code subagent scoped to a smaller model, or manual copy-paste instructions when neither path exists. Optionally invokes a frontier review pass on the executor's output. Includes fit-check to detect when a task does NOT fit the pattern and cost estimation for the specific split chosen. MANDATORY TRIGGERS: model routing, plan-execute, plan then execute, route to cheaper model, delegate execution, split planning from execution, cheaper executor, cost split, plan-execute-router, model split, use Codex for execution, use Sonnet for execution, spec-then-code, spec then code, save on this build, cost-optimize this task."
license: MIT
---

# Plan-Execute Router

Executes the plan/execute model routing pattern. Claude produces a detailed spec at frontier capability; a cheaper model writes the code from that spec; Claude optionally reviews the result. Typical cost savings 50–75% versus running everything at frontier, when the pattern fits.

The pattern only works when the plan is detailed enough that the executor doesn't have to make architectural decisions. This skill enforces that discipline.

## When to invoke

Invoke this skill when the user:
- Names a feature build, refactor, migration, or well-scoped implementation task.
- Explicitly asks to route execution to a cheaper model, "plan-execute," "spec-then-code," or "save cost on this build."
- Says they want to save AI cost on a specific coding task and provides enough detail to plan it.

Do NOT invoke for:
- Pure exploration ("what's in this codebase?") — no execution phase to route.
- One-off small changes (under ~50 lines) — routing overhead exceeds savings.
- Interactive back-and-forth debugging — the pattern breaks when planning happens mid-execution.
- Tasks that need frontier capability throughout (novel algorithms, subtle debugging that surfaces during coding, unusual constraints). If unclear whether the task is frontier-only, run Phase 1's fit-check honestly and reroute if it fails.

## Execution protocol

Run these phases in order. Do not skip Phase 1 — it prevents applying the pattern to tasks it doesn't fit.

### Phase 1: Fit-check

Before planning anything, verify the task fits the plan/execute pattern by checking all three:

1. **Scope clarity.** The user's request specifies WHAT needs to be built with enough detail that architectural choices can be enumerated. If the user is still figuring out what they want, tell them explicitly: "This looks exploratory. The plan/execute pattern needs a clearer target. Want to work out the requirements first, then invoke the router?"

2. **Distinct phases.** The task has separable planning (design decisions, file/module identification, approach selection) and execution (writing the code that implements those decisions). If they're inseparable — e.g., "figure out why this test is failing" — the pattern doesn't fit.

3. **Size threshold.** The task represents at least ~30 minutes of AI work. Small changes have too much routing overhead relative to savings.

If any of the three fail, stop and tell the user which one failed and why. Offer to proceed at frontier directly.

If all three pass, proceed to Phase 2.

### Phase 2: Plan (frontier capability)

Produce a detailed spec using the current session's model (assumed frontier — Opus 4.8, Fable 5, or GPT-5.5 depending on the caller). The spec must be detailed enough that a cheaper model can execute it without making architectural decisions.

Follow the structure in `references/spec-template.md`. At minimum, the spec must include:

- **Feature description.** What is being built, in one paragraph.
- **Files affected.** Absolute or repo-relative paths to every file that will be created or modified.
- **Architectural approach.** How the pieces fit together. Named patterns (repository, adapter, event handler, etc.) where applicable.
- **Ordered implementation steps.** Numbered steps a mechanical executor can follow.
- **Constraints and edge cases.** What must not break, what edge cases matter, what testing considerations apply.
- **Acceptance criteria.** How to know the implementation is done and correct.

Write the spec to `<repo-root>/.plan-execute/specs/<timestamp>-<task-slug>.md`. If `.plan-execute/specs/` doesn't exist, create it.

Show the spec to the user. Ask: "Ready to hand this to the executor, or need to revise the plan first?" Do not proceed to Phase 3 until the user confirms.

### Phase 3: Route to executor

After spec confirmation, detect available executor paths and route in this priority order.

**Path 1: Codex CLI subprocess (preferred).**

Check availability:
```bash
which codex && codex --version
```

If available and the user has authenticated (`codex login` completed), invoke:
```bash
codex exec --model gpt-5.4 --sandbox workspace-write \
  "$(cat <spec-path>)"
```

Use `gpt-5.4` as the default executor model — it's the cheapest OpenAI mid-tier that reliably handles most coding execution work. If the user has expressed a preference for a different executor, honor it (see `references/executor-paths.md` for the current model options and their trade-offs).

Wait for Codex to complete. Capture stdout for the change summary. Do not exit the skill until Codex either finishes or reports an error.

**Path 2: Claude Code subagent (if Codex CLI unavailable).**

If Codex CLI is not available, check whether Claude Code subagent invocation is available in the current session. Delegate to a subagent with the model explicitly scoped:

```
Task tool invocation:
- description: "Execute spec: <task-slug>"
- prompt: "<spec content>"
- subagent_type: "general-purpose"
- model: "haiku"    # or "sonnet" for more complex specs
```

The subagent runs in its own context window with the specified model. The spec must be self-contained since the subagent has no memory of the parent session.

**Path 3: Manual copy-paste (fallback).**

If neither Codex CLI nor subagent delegation is available (e.g., running in Claude.ai or Cowork), produce copy-paste instructions:

```
The plan is written to <spec-path>.

To execute it manually:
1. Open ChatGPT (or your preferred cheaper coding tool).
2. Select GPT-5.4 (or GPT-5.4-mini for even lower cost).
3. Paste the spec content as the prompt, prefixed with: "Build exactly what this spec describes. Do not deviate from the plan."
4. Have it produce the code.
5. Return here to run the optional review pass in Phase 4.
```

### Phase 4: Review (optional, on request only)

Skip Phase 4 unless the user explicitly asks for a review pass.

If invoked:
1. Read the executor's output (PR, diff, or produced files).
2. Compare against the spec produced in Phase 2.
3. Check for: deviations from the spec, missed constraints or edge cases, code quality issues, security concerns, missing tests.
4. Produce feedback as a structured list.
5. Offer to route the feedback back to the executor for fixes (loop back to Phase 3 with the feedback appended to the original spec).

### Phase 5: Report

At the end of every invocation, report to the user:

- Which phases ran (fit-check pass/fail, plan confirmed, executor path used, review pass yes/no).
- Cost estimate for this specific split (use `references/cost-estimation.md` for the calculation).
- Where the spec was saved.
- Where the executor's output landed.
- Any errors or handoff issues encountered.

## Constraints

Rules the skill obeys without exception.

- **Never skip the fit-check.** Applying the pattern to a task it doesn't fit produces worse output than either all-frontier or all-cheap.
- **Never make architectural decisions in Phase 3.** If the executor asks a question, that means the plan was too thin. Return to Phase 2, deepen the spec, then retry Phase 3.
- **Never commit code without user confirmation.** The executor may write to the workspace, but no `git commit` or `git push` fires without an explicit user OK.
- **Never invoke Phase 4 without a request.** Review passes add cost and turn a two-step workflow into three. Only run it when the user asks or the task is high-stakes enough that the user has pre-approved review.
- **Never fabricate an executor model or pricing.** If unsure which model is currently available or what its pricing is, load `references/executor-paths.md` and check.

## Failure modes to guard against

- **Thin planning.** The spec is too vague and the executor makes architectural decisions the planner should have. Defense: the spec template requires specific sections; if any are empty when Phase 2 completes, revise before Phase 3.
- **Route to wrong executor.** Choosing Codex CLI when the user isn't authenticated fails silently; choosing a subagent when the parent session doesn't support delegation fails silently. Defense: verify availability with a concrete probe before invoking (Phase 3, Path 1's `which codex` check; similar probes for Path 2).
- **Skipped confirmation.** Running Phase 3 before the user confirms the plan wastes executor cost on a wrong plan. Defense: Phase 2 explicitly halts for user confirmation.
- **Cost estimation drift.** Model pricing changes; a cost estimate hardcoded in the skill goes stale. Defense: `references/cost-estimation.md` uses ranges and dates every pricing point; verify against provider pricing pages if the estimate matters to a decision.

## First-run notes

This is v1. Expected weaknesses:

- **Codex CLI availability detection is simple.** More sophisticated environment detection (checking whether Codex is authenticated, whether the current directory is inside a git repo, etc.) would improve robustness but complicates v1.
- **Cost estimation is approximate.** Real cost depends on the specific input/output token counts, which vary by task. The estimation gives a range, not a point value.
- **Subagent model scoping in Path 2 depends on the parent session's model tier.** On some tiers, the subagent's model is capped at the parent's — see `references/executor-paths.md` for current behavior.
- **The pattern's savings depend on the specific split.** All-frontier baseline versus plan/execute split with Sonnet 5 executor saves less than the same split with GPT-5.4-mini or self-hosted GLM 5.2. The skill defaults to GPT-5.4 as a middle-ground; users optimizing hard should pick a cheaper executor.

Iterate from real runs. Don't over-tune before there's data to tune against.
