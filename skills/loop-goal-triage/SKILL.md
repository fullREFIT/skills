---
name: loop-goal-triage
description: "Triage any task, prompt, or project to the right execution method, then rewrite the prompt to run that way in Claude Code or Hermes. The space is five-way, not a binary: a plain prompt (most tasks), /goal or Hermes goal-mode (drive one task to a verifiable finish), timer polling (/loop or Hermes cron), dynamic workflow or delegation, or a durable Routine or Hermes cron/webhook job. Built to prevent the core failure: forcing generative or judgment-heavy work into a loop, where quality drifts as the model pattern-matches its own output. Splits deterministic sub-steps that can loop from generative cores that cannot. MANDATORY TRIGGERS: loop or goal, /goal vs /loop, should I loop this, loop-goal-triage, Hermes loop, Hermes goal, Hermes cron, how should I run this, autonomous run, batch this directory, point claude code at, convert to a loop, execution method, should I automate this, promote to a routine, run this unattended, can I run this in cowork, which surface, /goal vs routine, dynamic workflow vs goal."
license: MIT
---

# Loop / Goal Triage

Decide how a task should run before deciding to automate it. This skill takes a task, a prompt, a project, or a directory of work and returns one defended verdict: run it as a plain prompt, a goal-driven run, a timer poll, a dynamic workflow, or a durable routine. In Claude Code that may mean `/goal`, `/loop`, dynamic workflows, or cloud Routines. In Hermes that means `/goal` when available, the `cronjob` tool for timer or durable runs, `delegate_task` or spawned Hermes agents for parallel work, and a plain prompt for most work. It then rewrites the prompt to run that way, or explains why no loop should touch it.

## Table of Contents
1. [Core principle](#core-principle)
2. [Fast path (use this first)](#fast-path-use-this-first)
3. [When to use this skill](#when-to-use-this-skill)
4. [The triage procedure](#the-triage-procedure)
5. [The five execution methods (at a glance)](#the-five-execution-methods-at-a-glance)
6. [Hermes mapping](#hermes-mapping)
7. [Surface gate (check before recommending a method)](#surface-gate-check-before-recommending-a-method)
8. [The do-not-loop detectors](#the-do-not-loop-detectors)
9. [The split move](#the-split-move)
10. [The promotion path](#the-promotion-path)
11. [Output format](#output-format)
12. [The cost gate](#the-cost-gate)
13. [Volatile facts: verify before asserting](#volatile-facts-verify-before-asserting)
14. [Bundled resources](#bundled-resources)

---

## Core principle

The question is never "should this be a `/goal` or a `/loop`." That is a false binary, and treating it as the whole decision is the most common way to get this wrong. The real space has five answers, and the most frequent correct answer is the first one:

1. **No loop** — a single prompt, or a human-gated inline session. Most tasks land here.
2. **`/goal`** — drive one task to a verifiable finish line; a separate model judges "done" each turn.
3. **`/loop`** — re-run a prompt on a timer to poll something that changes.
4. **Dynamic workflow** — one big task fanned out across many subagents with cross-checking.
5. **Routine** — an unattended run on a schedule, an API call, or a Git event, in the cloud.

Two rules govern every triage. First, **a loop is only as trustworthy as its verifier** — an independent check, run by a different model or a deterministic command, that decides whether the work is actually done. No verifier, no loop. Second, **generative or judgment-heavy work degrades in a long autonomous run**, because the model starts pattern-matching its own earlier output and the quality flattens. That degradation is the signature failure this skill exists to prevent. When in doubt, the answer is "no loop."

---

## Fast path (use this first)

Most triages are obvious and do not need the full procedure. Answer in one line when the case is clear; escalate only when it is genuinely ambiguous. Being efficient here is part of the job — a six-section report for a question with an obvious answer is its own failure.

- Generative or taste-driven core (writing, revoicing, scripts, design, naming) → **no loop.** Stop. Loop only a deterministic downstream check if one exists.
- One task with a machine-checkable finish line (tests pass, build green, queue empty, redirect resolves), run it now → **bounded `/goal`**.
- Watching something that changes, on a timer, session open → **`/loop` in Claude Code, or a Hermes `cronjob` if running in Hermes**.
- That same watch, but it must run while the machine is off → **Routine in Claude Code, or a durable Hermes `cronjob`**.
- One genuinely large, parallel job where the split is not obvious → **dynamic workflow**.
- Unsure, or signals conflict → run the full procedure below.

If a one-line answer is plainly right, give it with its reason and skip the long report. Save the full procedure for real ambiguity, the split move, or a prompt rewrite.

---

## When to use this skill

Trigger on any of: choosing between `/goal` and `/loop`; asking whether to loop, batch, or automate a job; planning to point Claude Code at a directory of work; converting a written prompt into an autonomous run; or asking how a task "should run." Also trigger proactively when a user proposes wrapping creative, revoicing, writing, design, or other taste-driven work in an autonomous loop — that proposal is usually the error this skill catches.

---

## The triage procedure

Run these steps in order. Do not skip to a recommendation.

1. **Read the actual work, not the framing.** If a prompt or file is provided, read it fully. The unit being triaged is the task's true shape, not how the user described it. A request to "point Claude Code at this folder" may contain a prompt that forbids orchestration — the prompt's own constraints outrank the user's framing.

2. **Find the finish line.** Ask: is there a condition a machine can check — a test passing, a build exiting clean, a file count reaching zero, a redirect resolving? Write it as a true/false statement. If you cannot, there is no goal yet, and that pushes hard toward "no loop."

3. **Run the do-not-loop detectors** (below). If any fires on the core of the work, the core does not get looped. Stop trying to loop it and move to the split move.

4. **Classify the work** against the five methods using `references/triage-rubric.md`. Match on: presence of a machine-checkable finish line, whether the work is generative or mechanical, whether it is one task or many parallel pieces, whether it must run unattended or while away, and the cost ceiling.

5. **Apply the split move.** Separate any deterministic, verifiable sub-steps (which can be looped or scripted) from the generative or judgment core (which cannot). Most "should I loop this" questions resolve here: loop the verification, hand-run the judgment.

6. **Bound the cost.** Confirm a turn cap, time cap, or budget exists, and check the pricing context (see the cost gate). An unbounded loop on metered pricing is a defect, not a plan.

7. **Produce the verdict and the rewrite.** Output one recommendation with reasons, then either the rewritten prompt set up for the chosen method (templates in `references/rewrite-playbook.md`) or a plain-language explanation of why the work stays inline.

---

## The five execution methods (at a glance)

Full mechanics, version floors, and caveats live in `references/execution-methods.md`. Read it before asserting any version number or command behavior. The short form:

- **No loop / plain prompt** — one-shot work, exploratory work, or anything needing per-step human judgment. The default.
- **`/goal <condition>`** (Claude Code and Codex) — drives one task forward turn after turn until a built-in evaluator confirms the condition; self-iterating, so it does not need `/loop` to repeat. Add a turn cap because there is no built-in token budget.
- **`/loop <interval> <prompt>`** (Claude Code only) — re-runs a prompt on a timer to watch something; session-scoped, dies when the session closes, has no concept of "done." Not for driving a task to completion. In Hermes, use `cronjob` or a background watchdog instead.
- **Dynamic workflow** (Claude Code) — Claude writes a JavaScript orchestration script that fans work across many subagents with built-in adversarial verification; for big, parallel jobs where the split is not obvious. In Hermes, use `delegate_task` batch mode for bounded parallel analysis, or spawn independent Hermes processes for longer work.
- **Routine** (Claude Code, cloud) — a saved prompt plus a trigger (schedule, API, or GitHub event) that runs unattended on Anthropic's infrastructure and survives your machine being off. In Hermes, use `cronjob` for scheduled or one-shot follow-up runs, with `attach_to_session` when the user may reply. The durable answer `/loop` is not.

---

## Hermes mapping

Hermes has a `/goal` command in interactive sessions. Use it for one bounded, verifiable objective when the current Hermes session can keep working until the condition is met. Hermes does not need Claude Code's `/loop` command to achieve the same intent. Map the intent instead:

- **Drive one verifiable task to done now:** use Hermes `/goal` in CLI, or run the same bounded objective directly in the current Hermes turn with verification.
- **Poll or retry on a timer:** use the `cronjob` tool. For an unresolved near-term repair, create a one-shot follow-up cron 5 minutes later with the evidence and next action.
- **Durable recurring watch:** use `cronjob` with a self-contained prompt or a quiet `no_agent` script when the script output is already the final alert.
- **Parallel bounded analysis:** use `delegate_task` batch mode when the subproblems are independent and the result can return to the parent session.
- **Long independent worker:** spawn a separate Hermes process in tmux or use a durable cron job, depending on whether it needs interaction.

When the user is talking to Hermes, do not tell them to use Claude Code `/loop` unless Claude Code is specifically the target surface. Recommend the Hermes equivalent that preserves the intent: `/goal` for bounded completion, `cronjob` for timer polling or routines, and `delegate_task` for fan-out.

---

## Surface gate (check before recommending a method)

The triage logic is portable, but the command is surface-specific. Check where the work will actually run before naming the method:

- If the user is in Claude Code, name `/goal`, `/loop`, dynamic workflow, or Routine when appropriate.
- If the user is in Hermes, name Hermes `/goal`, `cronjob`, `delegate_task`, background terminal, or spawned Hermes agents.
- If the user is in Claude Desktop, Cowork, claude.ai web, or another tool, either route the work to the right execution surface or fall back to that surface's own automation: a Cowork batch, n8n workflow, OS cron, scheduled task, or plain script.

Never recommend a command that the current surface cannot run. A correct method on the wrong surface is a wrong answer.

---

## The do-not-loop detectors

If any of these describes the **core** of the work, the core is not loop-eligible. Loop the verifiable edges if any exist; keep the core inline and human-gated.

- **Generative or taste-driven judgment** — writing, revoicing, scripts, copy, design, naming, narrative, anything where "good" is a matter of judgment rather than a passing check. Long autonomous runs flatten this work as the model imitates its own prior output. Keep it inline, one piece at a time, with human checkpoints.
- **No machine-checkable finish line** — if "done" can only be described with adjectives ("clean," "compelling," "on-brand") and not a command or count, a loop will either churn forever or fake completion.
- **Per-step human approval is required** — for safety, correctness, money, or brand stakes. A loop removes the human from exactly the steps that need one.
- **One-off task** — if it runs once, a single prompt is faster and cheaper than designing a loop.
- **Quality-drift risk over a batch** — when running many items in sequence would let earlier output contaminate later output. Cap the batch and checkpoint; do not run the whole set unattended.
- **The source prompt forbids orchestration** — if the work's own instructions say "inline, one at a time, stop for review," honor that. It outranks any framing that says "just point an agent at it."

A detector firing is not a failure to automate. It is the correct finding that this work is done by a person with the model assisting, not by a loop running alone.

---

## The split move

The highest-value output of this skill is usually not "loop it" or "don't" — it is splitting one task into the part that loops and the part that does not.

- Isolate every sub-step with a deterministic, machine-checkable result: lint and formatting scans, test runs, link or redirect checks, build verification, schema validation, file-presence checks. These are loop-eligible (a bounded `/goal`) or, often better, a plain script.
- Keep the generative or judgment core inline and human-gated.
- Sequence them: the human (with the model assisting) produces the work; a deterministic downstream pass verifies it. The verification pass is where automation earns its keep without touching quality.

Example shape: for a content-recreation job, the recreation is inline and checkpointed; the mechanical scan (forbidden characters, no unresolved placeholders) and the link-redirect check are a clean downstream verification pass that can be scripted or run as a bounded `/goal`.

---

## The promotion path

Match the ambition to the proof. Start at the lowest rung that works and climb only when the work has earned it:

**plain prompt → bounded `/goal` or current-turn execution (prove it reaches done) → Routine or Hermes `cronjob` (if you'd want it recurring while away) → dynamic workflow or Hermes delegation (only when one thread genuinely cannot hold the job).**

Designing the heavy version first is the most common way to overspend. A Routine you never validated as a `/goal` is an unattended run you have no reason to trust.

The fastest way to find a real loop is to watch what you do **after** the agent finishes — the manual step you repeat by hand (run the check, mint the link, post the summary, open the PR) is the loop-eligible one. Automate that trailing step, never the judgment that precedes it. If nothing trails the judgment, there is no loop to find, and that is a complete answer.

---

## Output format

Return a triage report with these sections, in order:

1. **Verdict** — one line: the chosen method (or "no loop"), stated as a recommendation.
2. **Why** — the finish line (or its absence), which detectors fired, the cost context. Two to four sentences.
3. **The split** — what part, if any, is loop-eligible, and what part stays inline.
4. **The rewrite** — the prompt rewritten for the chosen method, ready to paste, using a template from `references/rewrite-playbook.md`; or, for a "no loop" verdict, the inline run instructions and why orchestration would hurt.
5. **Cost bound** — the turn cap, time cap, or budget attached, and the pricing caveat.
6. **Flags** — anything only the human can decide, and any volatile fact that should be re-verified.

Lead with the recommendation. Never present the five methods as a neutral menu; pick one and defend it.

---

## The cost gate

Pricing changes the answer by an order of magnitude, so confirm it before recommending an unattended or heavy run.

- On a fixed-price subscription the user is not maxing out, the marginal cost of a loop is near zero until rate limits, so looping is low-risk experimentation.
- On metered API pricing, loops, dynamic workflows, and subagent fan-out get expensive fast, and a loop down a wrong path burns money for longer before anyone notices. Bound hard, or recommend waiting.
- Always attach a bound: `/goal` takes a "stop after N turns" clause; `/loop` needs a stop and a watch on `/cost`; dynamic workflows should start with a small scoped run; Routines need a duration cap. Treat "max out your limits or you are wasting money" as motivated reasoning — the goal is useful work, not maximum token burn.

---

## Volatile facts: verify before asserting

Command names, version floors, default models, plan availability, and pricing for `/goal`, `/loop`, dynamic workflows, Routines, Hermes `/goal`, and Hermes cron behavior change over time and may have moved since this skill was written. Before stating any specific version number or behavior as fact, verify against the primary sources listed in `references/execution-methods.md` (code.claude.com/docs and the Anthropic and OpenAI announcements). State what you could not verify rather than asserting a stale specific.

---

## Bundled resources

| File | Read when |
|------|-----------|
| `references/execution-methods.md` | Confirming what each method does, its version floor, and its caveats |
| `references/triage-rubric.md` | Classifying a task: the signal checklist, the decision flow, the detectors expanded |
| `references/rewrite-playbook.md` | Rewriting a prompt into the chosen method (paste-ready templates) |
| `references/worked-example-recreate-prompt.md` | Seeing a full "no loop" verdict on a real content-recreation prompt |
| `references/worked-example-yes-loop.md` | Seeing a full "yes, loop the edge" verdict and the promotion path on the same job |
| `scripts/loop_readiness_check.py` | A fast heuristic pre-scan of a prompt or file; prints a provisional method and the signals it found (advisory, not a substitute for the procedure) |

Run the script for a quick first read, then run the full procedure for the verdict. The script flags signals; the judgment is yours.
