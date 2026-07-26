# Triage Rubric

Use this to classify a task after reading it. Work top to bottom; the first gate that returns a clear answer usually settles it.

## Gate 1 — Does it even need a loop?

Answer these. Any "no" near the top pushes toward a plain prompt or an inline session.

- Is there a finish line a machine can check (test, build, count, redirect, schema)? If no -> likely no loop; define one first or run inline.
- Is the work iterative (multiple rounds of work-then-check)? If it is one pass, a single prompt is faster.
- Is it tedious enough that babysitting it wastes real time? If it is quick by hand, skip the machinery.
- Is the core generative or judgment-driven (writing, revoicing, design, naming, taste)? If yes -> no loop on the core (see Gate 3).

## Gate 2 — If it does need a loop, which shape?

- Pushing one task to a finish line, right now, in your session -> `/goal`.
- Watching something that changes, on a timer, in an open session -> `/loop`.
- One big task that needs many agents in parallel and the split is not obvious -> dynamic workflow.
- Must run unattended on a schedule or an event, while your machine is off -> Routine.

## Gate 3 — The do-not-loop detectors (expanded)

Each detector below, if it describes the core of the work, means the core stays inline. Score the task: zero detectors firing on the core is a green light to loop the whole thing; one or more means split (Gate 4).

1. Generative or taste-driven judgment. Tell: success is described with adjectives, not a command. Examples: drafting, revoicing, copywriting, design, narrative, naming. Risk: in a long autonomous run the model imitates its own earlier output and the prose or design flattens. Handling: inline, one piece at a time, human checkpoint every few items.
2. No machine-checkable finish line. Tell: you cannot write "done" as a true/false statement. Handling: either build a checkable proxy (a reference to match, a rubric scored by a separate agent) or keep it inline.
3. Per-step human approval required. Tell: stakes are safety, correctness, money, brand, or anything irreversible. Handling: inline with the human in the loop; never an unattended Routine.
4. One-off. Tell: it runs once. Handling: single prompt.
5. Quality drift over a batch. Tell: running many items in sequence lets earlier output contaminate later output. Handling: cap the batch (often 1 to validate, then a small batch), checkpoint, and review before continuing; do not run the full set unattended.
6. Source prompt forbids orchestration. Tell: the work's own instructions say inline, one at a time, stop for review, or "no background agent." Handling: honor the prompt; it outranks the framing around it.

## Gate 4 — The split

When any detector fires, separate the task:

- Loop-eligible edges: deterministic, machine-checkable sub-steps. Lint/format scans, test runs, build checks, link or redirect verification, schema validation, file-presence checks. Run these as a bounded `/goal` or a plain script, as a downstream pass.
- Inline core: the generative or judgment work. Human produces it with the model assisting; checkpoints between batches.
- Order: produce inline -> verify with the deterministic pass. Automation lands on the verification, not the judgment.

## Gate 5 — Cost

- Confirm pricing: fixed subscription (loops cheap until rate limits) vs metered API (loops expensive fast).
- Attach a bound: `/goal` "stop after N turns"; `/loop` a stop plus `/cost` watch; dynamic workflow a small scoped first run; Routine a duration cap.
- Reject "max out your limits or you are wasting money" as a reason to run unbounded.

## Scoring summary

- Zero detectors + clear finish line + iterative + worth automating -> loop the whole thing (pick the shape in Gate 2).
- One or more detectors on the core -> split (Gate 4): inline core, automate the verifiable edges.
- No finish line and no checkable proxy -> no loop; run inline.
