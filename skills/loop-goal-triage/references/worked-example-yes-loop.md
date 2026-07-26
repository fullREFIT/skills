# Worked Example — When the Answer Is Yes

The companion to `worked-example-recreate-prompt.md`. That one refuses the loop. This one takes it — and shows the promotion path in action. A skill that only ever says "no loop" is as useless as one that loops everything. The discipline is the same procedure reaching opposite verdicts because the work is genuinely different.

The input is the **deterministic verification edge** that falls out of the content-recreation job: once a title package (LF + SF + LI) is drafted inline by a human, three checks must run on it before it ships.

1. The mechanical scan — zero em dash, semicolon, exclamation point, banned consultant/AI words, and no live `[FLAG]` or `[FILL]` markers across all three files.
2. The CTA redirect check — `curl -sI https://example.com/<slug>` returns a 30x to the expected destination.
3. The header check — provenance block present, absolute source path recorded, source file untouched.

## Step 1 — Read the work, not the framing

This is not the recreation. It is the pass that runs *after* the recreation. The judgment is already done and approved by a human; what remains is mechanical confirmation that the draft obeys rules a command can check.

## Step 2 — Find the finish line

Crisp and machine-checkable: "`voice_scan.py` reports zero violations across the three files, every minted link returns a 30x to its expected destination, and no source file shows in `git diff`." That is a true/false statement with a stated proof method. A real goal.

## Step 3 — Detectors

None fire. There is no taste judgment here — "clean scan" is not "good writing," and this pass only claims the former. It is mechanical, repeatable, and the proof lands in the transcript where an evaluator can read it.

## Step 4 — Classify, and pick the rung

- **Run it now, once per package, inside your session → bounded `/goal`.** This is the right first rung. Cheapest, fully attended, proves the check is reliable before you trust it anywhere unattended.

  ```
  /goal scripts/voice_scan.py reports zero violations across the three files in BUILD-NN/, every example.com link in them returns a 30x to its expected destination via curl -sI, and git status shows no modified source file; verify by running each and showing output; do not edit any draft to force a pass — report failures instead; or stop after 8 turns
  ```

  Note the constraint `do not edit any draft to force a pass`. Without it, a goal whose condition is "scan is clean" can reach done by quietly rewriting the prose — optimizing away the exact thing the human just produced. State what must not change, or the loop will change it.

- **Often better: skip the goal and just run the script.** If `voice_scan.py` plus a three-line `curl` loop already gives a clean exit code, that *is* the verifier. A `/goal` wrapped around a deterministic script you trust is overhead. Reach for `/goal` only when the check needs the model's judgment to interpret a result; reach for the bare script when it does not.

## Step 5 — The promotion path

- **Stay at `/goal`/script** while you are actively drafting packages and want the check inline.
- **Promote to a Routine** only if you want the scan to run unattended — for example, a nightly GitHub-triggered Routine that scans any package pushed to `03-APPROVED/` and posts violations to `#claude-agent` before a human schedules the post. That earns the cloud rung because it must run while the machine is off and its outcome is verifiable.
- **Do not reach for a dynamic workflow.** Three files is not a fan-out job. The orchestration overhead would cost more than the work.

## Step 6 — Verdict

Loop the edge. Bounded `/goal` (or the bare script) for the verification pass, promotable to a Routine if it needs to run unattended. The generative core stays inline — that verdict is unchanged from the companion example. This is the split move resolved: **inline judgment, looped check.**

## The lesson this example encodes

The same folder of work produced two opposite verdicts, and both are correct. The recreation refuses the loop because its "done" is a matter of taste. The verification accepts it because its "done" is a matter of fact. Triage is not a bias toward automating or refusing — it is finding the seam between the part a command can check and the part only a person can judge, and putting each on the right side of it.
