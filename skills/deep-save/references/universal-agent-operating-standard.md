# Universal Agent Operating Standard for Deep Save

Use this reference when the next model is not Hermes, Claude Code, or any system that reads `SOUL.md` or `AGENTS.md` automatically.

## Purpose

A deep save preserves what should change future decisions and execution. It is not a transcript cleanup, apology archive, or log dump.

The agent performing the save must act as a judgment layer. Save what matters. Skip noise.

## Operating posture

The agent should behave as an execution partner, not a passive summarizer.

Required behavior:

- Identify the real objective before saving context.
- Preserve decisions, corrections, constraints, and next actions.
- Keep recommendations stable unless evidence or logic changes.
- Do not mirror the user's latest objection as truth without evaluating it.
- Do not preserve agreeable or polite assistant errors as if they were valid context.
- Treat user corrections as high-signal when they change future behavior.
- State conflicts between sources instead of silently blending them.
- Prefer verified state over conversational momentum.

## Anti-sycophancy rule

If a previous assistant answer was wrong, over-agreeable, or too polite, do not save it as truth.

Save one of these instead:

- the corrected decision,
- the durable rule that prevents the mistake,
- the unresolved question,
- the evidence that changed the recommendation.

Do not save:

- apology text,
- self-criticism,
- performative agreement,
- false consensus,
- repeated reassurance,
- wrong advice that was later superseded.

## Recommendation integrity

When a conversation contains recommendation changes, preserve the reason for the change.

A useful save says:

- previous recommendation,
- what changed,
- what was wrong or incomplete,
- what still stands,
- new recommendation,
- confidence level,
- next action.

Do not preserve a chain of contradictory recommendations without naming which one is current.

## Revenue and execution priority

If the conversation concerns immediate revenue, rank saved next actions by proximity to cash:

1. active payer, invoice, or current client obligation
2. live reply or buying signal
3. due follow-up
4. warm or trust-adjacent specific opportunity
5. qualified outbound with evidence
6. proof asset that helps close a live conversation
7. content that directly supports a sales motion
8. new sourcing
9. infrastructure
10. product or app work

Do not let infrastructure or product speculation outrank live revenue events unless the infrastructure prevents revenue events from being lost.

## System failure framing

If a task was missed because no system surfaced it, save that as a system-design issue, not an operator failure.

Canonical rule:

Tools notify the operator. The operator opens tools to resolve events, not discover them.

## Human-facing output standard

Final deep-save reports should be readable by a busy human.

Include:

- status,
- result,
- what was done,
- verification,
- next action,
- owner,
- recommendation,
- technical details only when needed.

Do not lead with raw logs, full stack traces, or tool transcripts.
