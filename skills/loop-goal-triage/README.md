# loop-goal-triage

Triage any task, prompt, project, or directory of work to the right Claude Code execution method, then rewrite the prompt to run that way. Built to prevent the most common failure in loop engineering: forcing generative or judgment-heavy work into an autonomous loop, where quality drifts as the model pattern-matches its own earlier output.

## What it decides

The method space is five-way, not a binary:
- **No loop** — a plain prompt or a human-gated inline session (most tasks).
- **`/goal`** — drive one task to a verifiable finish line.
- **`/loop`** — poll something on a timer.
- **Dynamic workflow** — fan out across many subagents on one big task.
- **Routine** — an unattended scheduled run in the cloud.

It also performs the highest-value move: splitting a task into the deterministic edge that can be looped (lint, tests, redirect checks) and the generative core that must stay inline.

## Install

**Claude Desktop / Claude.ai / Cowork:** Settings → Customize → Skills → "+" → Create skill → upload `loop-goal-triage.zip`. Toggle it on. Enable code execution (Settings → Capabilities) if you want the pre-scan script to run.

**Claude Code:**
```
cp -r loop-goal-triage ~/.claude/skills/loop-goal-triage      # personal
cp -r loop-goal-triage .claude/skills/loop-goal-triage        # project
```

## Use

Ask any of: "should I loop this," "/goal vs /loop for X," "how should I run this prompt," "I want to point Claude Code at this directory." The skill reads the work, runs the triage procedure, and returns a verdict plus a rewritten prompt (or a reasoned "no loop").

Optional fast pre-scan:
```
python3 scripts/loop_readiness_check.py path/to/prompt.md
```
The script flags signals and prints a provisional method. It is advisory; the verdict comes from the full procedure in SKILL.md.

## Files

- `SKILL.md` — the procedure, the detectors, the output format.
- `references/execution-methods.md` — verified mechanics and version floors (re-verify before quoting; this space moves fast).
- `references/triage-rubric.md` — the classification gates.
- `references/rewrite-playbook.md` — paste-ready templates per method.
- `references/worked-example-recreate-prompt.md` — a full "no loop" verdict on a real content-recreation prompt.
- `references/worked-example-yes-loop.md` — a full "yes, loop the edge" verdict plus the promotion path on the same job.
- `scripts/loop_readiness_check.py` — heuristic pre-scan.

## Note on volatile facts

Command names, version floors, default models, and pricing for `/goal`, `/loop`, dynamic workflows, and Routines change often. The skill instructs verification against primary sources (code.claude.com/docs and the Anthropic/OpenAI announcements) before asserting any specific. Treat the version numbers in the references as last-verified June 25, 2026, not permanent.
