# Universal Deep Save Prompt

Run a deep save for the current conversation.

This prompt is LLM agnostic. It does not assume Hermes, Claude Code, Claude Desktop, ChatGPT, or any specific agent framework. Use whatever tools are available in the current runtime.

## Objective

Create a high-signal save of this conversation that helps the next session make better decisions, avoid repeated mistakes, and continue from the current verified state.

Preserve information that can influence future decisions or execution. Do not preserve clutter.

## Required behavior

Before saving, apply these references if available:

- Universal Agent Operating Standard for Deep Save
- Universal Execution Context Standard for Deep Save
- Any current project instructions supplied by the user
- Any current local continuation brief or restart board entry

If those references are not available, still follow the rules in this prompt.

## Signal filter

Save:

- Decisions the user made or accepted.
- Strategic corrections that should change future recommendations.
- Anti-drift rules, especially where the assistant was too agreeable, too polite, or wrong.
- Verified project state that affects the next action.
- Current blockers and exact next actions.
- Working assumptions that materially affect a decision.
- Important objections that change the frame.
- Lessons about how the assistant should behave differently next time.
- Source-of-truth files, absolute paths, safe slugs, thought IDs, task IDs, and restart commands.
- Open loops that need action, with owner and completion criteria.
- A mistake only when it produced a durable rule, corrected decision, or known pitfall.

Skip:

- Raw back-and-forth.
- Glazing, sycophancy, apologies, and politeness padding.
- False starts that were superseded and do not teach a durable lesson.
- Wrong recommendations unless the correction changes future behavior.
- Duplicate context already captured elsewhere.
- Tool logs, stack traces, and command output unless they prove a current blocker or verification result.
- Temporary confusion.
- Speculation that was not adopted as a decision.
- Low-signal chat noise.
- Any private credential, tokenized URL, bearer token, API key, OAuth token, secret URL, or raw share token.

If a prior assistant answer was wrong, do not save the wrong answer as truth. Save the corrected rule or decision.

## Source-of-truth hierarchy

Use these sources in order:

1. Current user instruction.
2. Universal deep-save operating references, if available.
3. Current conversation content.
4. Local continuation brief, if one exists or is created.
5. Durable knowledge and task store, if available.
6. Human-facing restart board, if available.

## Durable save requirements

Create a structured save that includes:

1. Durable decisions and rules.
2. Current project or session state.
3. What changed during the conversation.
4. What remains unresolved.
5. Exact next substantive action.
6. Owner for each pending action.
7. Durable thought or note IDs created or updated, if available.
8. Durable task IDs created or referenced, if available.
9. Local continuation brief absolute path, if created.
10. Safe restart-board link or slug, if created.
11. Verification performed.
12. What was intentionally skipped and why, summarized briefly.

Deduplicate before saving. Update existing durable notes instead of creating duplicates when the new content clearly supersedes or sharpens the old content.

## Proof restart cockpit

If Proof is available, use it as the human-facing restart cockpit. Do not treat it as the only source of truth.

The restart-board section should include:

- Project or session name.
- Current status.
- Continuation brief absolute path.
- Durable thought or note IDs.
- Pending task IDs.
- Canonical working folder.
- Last verified command or result.
- Next substantive action.
- One clear next action ending with `[EOM]`.

Put copy/paste material in fenced Markdown code blocks.

End the session update with a visible divider line:

`---`

Do not put tokenized Proof URLs or credentials in the board body.

## Dynamic Proof short link

If a Proof share link is needed and a Proof short-link tool is available, create or update a weekly short link.

Slug pattern:

`deep-save-wo_MMDDYY`

Where:

- `wo` means week ending.
- `MMDDYY` is the Sunday of the current week.
- The date must be calculated at runtime.

Example for a week ending Sunday 2026-07-12:

`deep-save-wo_071226`

If the configured production short-link domain is `proof.co`, the display link is:

`proof.co/deep-save-wo_MMDDYY`

If the configured production domain is different, use that configured domain and keep the same slug.

Every Monday, refresh the weekly link so it points to the current week's restart board or deep-save restart cockpit.

Do not expose the raw Proof tokenized URL. The final response may include only the safe short link and safe Proof title or slug.

## Final report format

Report the result in plain English:

```markdown
## Status
Complete / Partially complete / Blocked / Unresolved.

## Result
What was saved and where.

## What I did
Short summary of actions.

## Verification
What was confirmed, how it was confirmed, and what remains unverified.

## Durable knowledge
Thought or note IDs:
- [id] - [title]

Task IDs:
- [id] - [title]
- none

## Proof restart cockpit
Title: [safe title]
Short link: [safe short link]
Raw tokenized URL: not stored or repeated

## Local continuation brief
`/absolute/path/to/file.md`

## Next action
The exact next substantive action.

## Owner
Assistant / user / another agent / no further action.

## Recommendation
Recommended next move and why.

## Technical details
Only the minimal details needed to continue.
```

Do not end with a vague promise. If safe preservation work can be completed now, complete it. If follow-up work is outside the deep-save task, register it as a durable task with clear owner and completion criteria.
