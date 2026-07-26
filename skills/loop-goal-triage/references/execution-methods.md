# Execution Methods — Verified Mechanics

Facts verified June 25, 2026 against primary sources. Re-verify before asserting any version number or behavior, because this space moves fast.

Primary sources to check:
- Claude Code `/goal`: code.claude.com/docs/en/goal
- Claude Code dynamic workflows: code.claude.com/docs/en/workflows and claude.com/blog/introducing-dynamic-workflows-in-claude-code
- Claude Code routines: code.claude.com/docs/en/routines and claude.com/blog/introducing-routines-in-claude-code
- OpenAI Codex goals and subagents: developers.openai.com/codex

---

## No loop (plain prompt or human-gated inline session)

- What it is: a single prompt, or an interactive session where the human reviews each step. No autonomous iteration.
- Use when: the task is one-shot, exploratory, creative or judgment-driven, or needs approval at each step.
- Why it is the default: most tasks do not have a machine-checkable finish line, and forcing one onto them costs money and quality for no gain.

## `/goal` — drive one task to a verifiable finish line

- Tools: Claude Code (requires v2.1.139 or later) and OpenAI Codex (Codex CLI 0.128.0+, enable `features.goals` if absent).
- Behavior: sets a completion condition and keeps Claude working turn after turn; after each turn a separate small fast model reads the transcript and decides whether the condition holds. If not, another turn starts. The goal clears automatically when met. It self-iterates — it does not need `/loop` to repeat.
- The evaluator only sees the transcript; it cannot run commands or read files itself. The condition must be provable from Claude's own output (for example, "npm test exits 0" works because Claude runs the tests and the result is in the transcript).
- Syntax: `/goal <condition>` to set; `/goal` for status; `/goal clear` to end. Condition up to 4,000 characters. One active goal per session.
- No built-in token budget — always add a bound, for example "or stop after 20 turns."
- Modes: interactive; auto mode + `/goal` for unattended turns; non-interactive `claude -p "/goal <condition>"`.
- Failure modes: vague conditions cause endless churn or false "done"; conditions that measure only correctness can pass machine checks while being useless (point the condition at a known-good reference); compound objectives overwhelm the evaluator (split into sequential goals).

## `/loop` — poll something on a timer

- Tool: Claude Code only (since v2.1.72). Codex has no `/loop`; its nearest equivalent is the Automations tab or `codex exec` in a shell loop.
- Behavior: re-runs a prompt — or any slash command or skill — on a time interval, converting the interval to a schedule, running until you press Esc.
- Syntax: `/loop 5m <prompt>` (interval can lead, trail, or be omitted; with no interval Claude picks a gap from one minute to one hour based on activity).
- Properties: session-scoped (dies when the session closes), fires only when the session is idle, no catch-up for missed intervals, auto-expires after seven days, applies jitter so parallel sessions do not hit the API together.
- It has no concept of "done." It is for watching, not finishing. "Refactor until tests pass" is a `/goal`, not a `/loop`.

## Dynamic workflow — fan out across many subagents (Claude Code)

- Requires Claude Code v2.1.154 or later; available on paid plans (on Pro, enable from the Dynamic workflows row in `/config`). Availability details vary across sources — check the live docs.
- Behavior: Claude writes a JavaScript orchestration script for the task; a runtime executes it in the background, fanning work across tens to hundreds of parallel subagents while the session stays responsive. The loop, branching, and intermediate results live in the script, so the main context holds only the final answer.
- The coordination layer spends zero model tokens (it is ordinary JavaScript); the subagents still cost tokens, and a workflow consumes meaningfully more than a normal session.
- Built-in verification: independent agents can adversarially review each other's findings and iterate until they converge.
- Caps: 16 concurrent agents, 1,000 total per run. Triggers: include the word "workflow" in a prompt, run `/deep-research`, save and rerun a workflow command, or enable `ultracode`.
- Use when: one big task too large for a single thread, where the split is not obvious and quality matters more than token economy (large migrations, repo-wide audits, multi-angle plans).
- Codex parallel: Codex reaches "go wide" through subagents — the main thread spawns child agent threads, with `agents.max_depth` defaulting to 1 (a parent spawns children, children do not spawn their own children unless you raise it).

## Routine — unattended scheduled run in the cloud (Claude Code)

- Shipped April 14, 2026 in research preview. Configure once (prompt, repos, connectors, environment, permissions); runs on Anthropic-managed infrastructure, so it survives your machine being off.
- Triggers: scheduled (hourly, daily, weekdays, weekly, or a one-off future time; minimum interval one hour, sub-hourly rejected), API (HTTP POST to a per-routine endpoint with a bearer token), or GitHub events. A single routine can combine triggers.
- Each run clones the repo from the default branch; Claude works on `claude/`-prefixed branches. Runs have no permission prompts, so the prompt must be self-contained and explicit about success.
- Manage at the routines web UI or with `/schedule` in the CLI (CLI creates schedule triggers only; API and GitHub triggers are added from the web). GitHub triggers require the Claude GitHub App installed.
- Use when: work must run unattended on a cadence or in response to an event, at an hourly-or-slower interval, with a verifiable outcome (nightly bug fix to a draft PR, backlog grooming, PR review on every PR, alert triage).
- Cost/limits: research-preview caps on webhook events; pricing specifics (per-runtime-hour, run-duration cap) come from secondary reporting — verify against the live pricing page before relying on them.

---

## Quick decision table

| Signal | Method |
|--------|--------|
| One-shot, exploratory, or judgment-driven | No loop |
| One task, machine-checkable finish line, run it now | `/goal` |
| Watch something that changes, on a timer, in an open session | `/loop` |
| One big task, many parallel pieces, split not obvious | Dynamic workflow |
| Must run unattended on a schedule or event, machine off | Routine |
| Mix of generative core + deterministic edges | No loop for the core; `/goal` or a script for the edges |
