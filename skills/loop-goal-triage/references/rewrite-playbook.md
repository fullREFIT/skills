# Rewrite Playbook

Templates for rewriting a task into the chosen method. Fill the bracketed parts. Keep the original intent; change only how it runs.

---

## No loop (inline, human-gated)

When the core is generative or judgment-driven, do not produce a loop. Produce run instructions:

> Run this inline in your current session. Do [task] one [unit] at a time, fully finishing and reviewing each before the next. Do not use `/goal`, `/loop`, `claude -p`, or a background agent for the [unit] itself. Start with 1 to validate, then [small batch] at a time, then stop for review. [If applicable: the only part that can be automated is the deterministic verification — see the split below.]

State plainly why: the core is judgment work, and a long autonomous run flattens quality as the model imitates its own earlier output.

---

## `/goal` (drive one task to done)

```
/goal <one measurable end state>; verify by <stated check>; do not <constraint that must hold>; or stop after <N> turns
```

Rules for a good condition:
- One measurable end state with a true/false answer (a test result, a build exit code, a count, a resolved redirect).
- A stated check the evaluator can see in the transcript (the agent must run it so the result is visible).
- A constraint that protects what must not change.
- A turn or time cap, because there is no built-in token budget.
- If quality matters beyond correctness, point the condition at a known-good reference rather than describing quality in adjectives.

Example:
```
/goal every file under content/ passes scripts/voice_scan.py with zero violations and no unresolved [FLAG] or [FILL] markers; verify by running the script and showing output; do not modify source files; or stop after 15 turns
```

---

## `/loop` (poll on a timer)

```
/loop <interval> <prompt that reads current state and reports or acts>
```

Rules:
- Use only for watching something that changes; it has no concept of "done."
- Keep it in an open session; it dies when the session closes.
- Watch cost with `/cost`; stop with Esc.

Example:
```
/loop 10m check whether any new review comments landed on PR 1842, and if so summarize them and draft replies for my approval
```

---

## Dynamic workflow (fan out, one big task)

```
Use a workflow: <big task>. Fan out across subagents by <natural split, e.g. file, module, source>. Have independent agents verify each other's work before merging. Return one coordinated result. Start with a small scoped slice first to confirm the approach.
```

Rules:
- Reserve for genuinely large, parallel work where the split is not obvious.
- Expect meaningfully higher token use; start small.
- Let the built-in adversarial verification do the checking.

---

## Routine (unattended, scheduled, cloud)

Configure (web UI or `/schedule`): a self-contained prompt + repo(s) + connectors + trigger.

```
Trigger: <schedule (>= 1 hour) | API call | GitHub event>.
Prompt: <fully self-contained instruction with an explicit success definition, because there is no human to approve mid-run>. Open a draft PR / post to <channel> for human review rather than merging or sending directly.
Bound: cap run duration; review output before it goes anywhere irreversible.
```

Example:
```
Trigger: nightly at 02:00.
Prompt: pull the top open bug labeled "ready", reproduce it, attempt a fix on a claude/ branch, run the test suite, and open a DRAFT PR with a summary of the cause and the change. Do not merge. If you cannot reproduce it, comment on the issue and stop.
```

---

## The split (most common real output)

When you split, produce two artifacts:

1. Inline run instructions for the generative core (the "no loop" template above).
2. A bounded `/goal` or a script for the deterministic verification edge.

State the order: produce inline, then run the verification pass. The automation lands on the check, never on the judgment.
