# Worked Example — A Content-Recreation Prompt

A real triage. The input is a prompt that recreates long-form scripts, short-form scripts, and LinkedIn posts "in voice" from source files, intended to be run by pointing a coding agent at a directory of content. The user's framing was "point Claude Code at the directory and let it run." This is exactly the case the skill exists to catch.

## Step 1 — Read the work, not the framing

The prompt's own instructions are decisive and override the "just point an agent at it" framing:
- "In the session you are already in. No `claude -p`, no `/goal`, no background agent. This is inline drafting, not orchestration."
- "One title package, fully finished and verified, before the next."
- "Start with 1 package to validate the run, then 3 per batch, then STOP for review."
- "In a longer autonomous run, quality drifts as the model starts pattern-matching its own earlier output and the prose flattens — the exact fluent failure this system exists to kill."
- A human checkpoint and candid self-review every three packages.

## Step 2 — Find the finish line

There is no machine-checkable finish line for the core. "Recreated in voice," "best work every file," "humor is a floor" are judgments, not checks. There is a deterministic edge: the mechanical scan (zero em dash, semicolon, exclamation point, banned words, no live `[FLAG]` or `[FILL]`) and the CTA link-redirect check (`curl -sI ... | grep -i location:`). Those are checkable. The recreation itself is not.

## Step 3 — Detectors

Four fire on the core: generative/taste-driven judgment; no machine-checkable finish line; quality drift over a batch (named explicitly by the prompt); and the source prompt forbids orchestration. Any one of these is disqualifying for looping the core. All four together make it unambiguous.

## Step 4 — Classify

The core is "no loop": inline, human-gated drafting. Not `/goal` (no checkable condition, and self-iteration would flatten voice). Not `/loop` (nothing to poll). Not a dynamic workflow (fanning the same generative task across parallel subagents multiplies the drift problem, it does not solve it). Not a Routine (unattended generation of brand-facing copy with no human gate is the highest-risk version of the failure).

## Step 5 — The split

- Inline core (human-gated): the recreation of each LF, SF, and LI file, one package at a time, 1 to validate then 3 per batch, checkpoint and self-review, exactly as the prompt already specifies.
- Loop-eligible edge (optional, downstream): the deterministic verification pass — run the mechanical scan across the three files and the CTA redirect check — after a package is drafted. This can be a plain script or a tightly bounded `/goal` whose condition is "scripts/voice_scan.py reports zero violations across the three files and `curl -sI` on the minted link returns a 30x to the expected destination." The prompt already anticipates this: "Tagging may run as a clean downstream pass before posting."

## Step 6 — Verdict

No loop on the recreation. The prompt is already correctly designed for inline, checkpointed execution, and pointing a coding agent at the directory is safe only because the prompt itself forbids the agent from batching or orchestrating the work. The single available automation is the deterministic verification pass, run after each package as a script or a bounded `/goal` — and even that is optional, not required.

## The lesson this example encodes

The wrong move here is the tempting one: "a directory of many files is obviously a batch job, so loop it." That reasoning ignores the nature of the work. A directory of generative work is not a batch job; it is many judgment tasks that happen to share a folder. The skill's job is to notice that and refuse the loop on the core, while still capturing the genuine automation at the verifiable edge.
