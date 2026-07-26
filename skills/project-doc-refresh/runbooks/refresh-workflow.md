# Refresh Workflow Runbook

End-to-end narrative walkthrough. Use this to get unstuck mid-session or to answer "what comes next?"

---

## Session start

1. User invokes the skill by asking to refresh, audit, or update custom instructions / project docs / CLAUDE.md / system prompt.
2. Confirm mode (single-document, project-wide, portfolio). Ask if ambiguous.
3. Confirm surface (Claude.ai vs Claude Code). Read files directly if on Code; operate on pasted text if on Claude.ai.
4. Confirm the source document is available. If it's attached or pasted, proceed. If not, ask.
5. Ask two framing questions before any work:
   - "Do you want a minimal refresh (facts only) or am I allowed to recommend structural changes?"
   - "Is there recent context I should know — things that have changed in your domain or stack that I won't find in docs?"

These two questions save you from major rework later. Don't skip them.

## Phase 1 — Audit

1. Load `references/platform-changes-log.md` and `references/staleness-taxonomy.md`.
2. Read the full source document.
3. Build the classification table — every substantive claim gets a row.
4. Apply staleness flags using the taxonomy.
5. If structural issues are present, consult `references/structural-heuristics.md` and note them.
6. Count stale items. If >40%, recommend rebuild instead of refresh.
7. Write the audit report using `templates/audit-report.md`.
8. Present the audit to the user. **Stop.**

**Common mid-Phase-1 issues:**

- **"I can't tell if this is a rule or a fact."** Default to rule (preserve). Rules get preserved if you're wrong; facts get rewritten if you're wrong. Preservation is the safer error.
- **"There are too many items to classify individually."** Group related items (e.g., all the model-name references become one row). Don't lose granularity but don't drown in it either.
- **"The document references something I can't classify without research."** Flag it `UNVERIFIED` for now. You'll resolve in Phase 2 or ask the user.

## Checkpoint between Phase 1 and Phase 2

The user reviews the audit and:
- Approves the research plan as-is, OR
- Adds items to research, OR
- Removes items from research (says "don't bother verifying X, I know it's still true"), OR
- Changes classification ("that's actually a behavioral rule, not a fact").

Honor whatever they say. If they say "just proceed" without review, gently push back once: "The audit is the part that prevents a bad refresh — can you take 60 seconds on it?" If they insist on skipping, proceed but note in the final deliverable that audit was skipped.

## Phase 2 — Research

1. Load `runbooks/research-playbook.md`.
2. For each approved item, research using the source hierarchy.
3. Record findings using `templates/research-notes.md`.
4. When done, present findings to the user. **Stop.**

**Common mid-Phase-2 issues:**

- **"I found conflicting sources."** Prefer the authoritative one per the hierarchy. If they're equally authoritative, flag to the user and let them decide.
- **"I can't find a primary source."** Mark UNVERIFIED. Don't settle for a tertiary source just to close the item.
- **"The research suggests the user's document is more right than the current state."** This happens when the user has recent info you don't. Trust the user; note the conflict; flag for manual verification.
- **"I'm tempted to research items that weren't flagged."** Don't. Go back to the user with your reasoning for expanding scope if needed.

## Checkpoint between Phase 2 and Phase 3

The user reviews findings and:
- Approves all recommended updates, OR
- Vetoes specific updates, OR
- Corrects findings ("no, we use X, not Y"), OR
- Asks for more research on something.

Honor their corrections — they have context you don't. Don't argue with the user's domain knowledge.

## Phase 3 — Rewrite

1. Load `templates/diff-output.md`.
2. Produce the full updated document:
   - Apply approved changes.
   - Preserve behavioral rules, institutional knowledge, stylistic choices exactly.
   - Apply structural changes ONLY if approved in Phase 1 framing.
   - Maintain cache-friendly ordering (static first, dynamic last or removed).
3. Produce the changelog with every change logged.
4. Produce the preserved-as-is list.
5. Produce the residual risks and test plan.
6. Deliver the final artifact.

**Common mid-Phase-3 issues:**

- **"The new version sounds generic."** You've smoothed out voice. Compare paragraph-by-paragraph with the original; if any paragraph lost specificity or personality in translation, restore it. Voice preservation is non-negotiable.
- **"I want to reword something for clarity."** Don't. If an existing behavioral rule is unclear, flag it as a recommendation in residual risks — don't silently rewrite it.
- **"The user will want X change too."** Don't speculate. If you think a change is worth making, add it to residual risks as a recommendation for next refresh.

## Session end

1. Confirm the final artifact is complete.
2. State the specific next action (run canonical prompts, spot-check voice, commit the updated file, etc.).
3. Recommend a cadence for next refresh based on how stale this one was.
4. Ask if they want to run the skill against another document. If yes, loop back to session start.

---

## Portfolio mode specifics

When refreshing multiple projects in sequence:

1. Run Phase 1 on ALL documents first. Produce a portfolio audit summary that identifies:
   - Patterns across documents (e.g., "all 6 projects reference Skills v1 syntax").
   - Shared institutional knowledge that should be consistent.
   - Contradictions between documents.
2. Consolidate research in Phase 2 — if 5 projects reference the same stale Claude model, research once and apply the finding to all.
3. Run Phase 3 one document at a time, but flag cross-document consistency issues.
4. Deliver a portfolio summary at the end with systemic recommendations (e.g., "consider extracting shared context into a common skill").

Portfolio mode is where the audit-first discipline pays the biggest dividends — without it, you'd research the same fact 6 times.

---

## Common mistakes to avoid

- Researching before auditing. This skill exists because that's the default failure mode.
- Silently rewriting voice or behavioral rules "for clarity."
- Producing a final document without a changelog.
- Recommending structural changes the user didn't ask for.
- Proceeding past a checkpoint without user confirmation.
- Fabricating a platform fact when research turned up nothing.
- Trusting older tutorials over current docs.
- Treating Claude's self-knowledge as authoritative for Claude platform facts.
