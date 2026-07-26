# Plan-Execute Router

A Claude skill that codifies the plan/execute model routing pattern for coding tasks. Claude produces a detailed spec at frontier capability; a cheaper model writes the code from that spec; Claude optionally reviews. Typical cost savings: 50–75% versus running everything at frontier when the pattern fits.

## What this skill does

When invoked on a suitable coding task, this skill:

1. Verifies the task fits the plan/execute pattern (clear scope, distinct phases, substantial size).
2. Produces a detailed spec at frontier capability, saved to a versioned specs directory.
3. Confirms the plan with you before executing.
4. Routes execution to a cheaper model via one of three paths (Codex CLI subprocess, Claude Code subagent, or manual copy-paste).
5. Optionally invokes a frontier review pass on the executor's output.
6. Reports cost estimate for the specific split used.

## When it's the right tool

Use it for feature builds, refactors, migrations, or any well-scoped implementation task where you have a clear target and enough size to justify the routing overhead (~30 min or more of AI work).

Do not use it for exploration, small one-off changes, interactive debugging, or truly frontier-only reasoning tasks. The skill's Phase 1 fit-check will catch most of these.

## Installation

### Claude Code

```bash
# Copy the skill folder to your Claude Code skills directory
cp -r plan-execute-router ~/.claude/skills/

# Or for project-scoped install:
cp -r plan-execute-router .claude/skills/
```

Restart your Claude Code session. The skill will auto-load when its triggers fire in conversation.

### Claude Desktop / Claude.ai / Cowork

1. Open Settings → Customize → Skills.
2. Click Upload.
3. Select `plan-execute-router.zip` from the skill's parent directory.
4. Restart your session.

Note: on Claude Desktop / claude.ai, only Path 3 (manual copy-paste) of the executor routing is available. The skill will detect this and route accordingly.

### Codex

```bash
cp -r plan-execute-router ~/.codex/skills/
```

The skill's protocol is model-agnostic on the planning side, so it works with Codex-hosted Claude or other configurations.

## Prerequisites for full functionality

To use Path 1 (Codex CLI subprocess), the executor path that most matches the transcript's approach:

1. Install Codex CLI:
   ```bash
   npm install -g @openai/codex
   # or
   brew install --cask codex
   ```
2. Authenticate:
   ```bash
   codex login
   ```
3. Verify:
   ```bash
   codex --version
   codex exec --help
   ```

If Codex CLI is not available, the skill falls back to Path 2 (subagent) or Path 3 (manual). All three paths produce the same end result; they differ in automation level.

## Usage

Once installed, the skill fires automatically on natural-language triggers. Examples that would invoke it:

- "Use the plan-execute router to build the authentication middleware."
- "Route this feature build to plan-execute — Claude plans, Codex executes."
- "Plan then execute on this refactor to save cost."
- "Spec-then-code this migration."

Or invoke explicitly by slash command in Claude Code:

```
/plan-execute-router Build a rate limiter for the API layer, 100 requests/minute per user, using Redis-backed sliding window.
```

## What you get out

For each invocation:

- A detailed spec saved to `<repo-root>/.plan-execute/specs/<timestamp>-<task-slug>.md`.
- Executor output (Codex-generated code, or subagent-produced changes, or copy-paste instructions).
- A cost estimate showing the split used and the savings versus all-frontier.
- Optional review pass output if you requested one.

## Directory structure

```
plan-execute-router/
├── SKILL.md              (the executable protocol Claude follows)
├── README.md             (this file)
├── references/
│   ├── spec-template.md      (structure a good plan should have)
│   ├── executor-paths.md     (Codex CLI, subagent, and manual paths)
│   └── cost-estimation.md    (cost math with current 2026 pricing)
├── scripts/              (empty — this skill is instruction-based, not script-based)
└── assets/               (empty)
```

## Companion resources

For the underlying theory — why the plan/execute split works, other routing patterns, cross-provider routing, third-party platforms, open-weight self-hosting — see the Model Routing Superguide.

For related cost levers that stack with routing — prompt caching, boot tax reduction, tool output compression, effort calibration — see the Claude Code Token Reduction Superguide.

## Limitations

- **Environment-specific paths.** Path 1 (Codex CLI) needs Codex installed and authenticated. Path 2 (subagent) needs Claude Code with subagent invocation available. Path 3 (manual) works everywhere but is slowest.
- **Codex CLI subprocess authentication.** The skill assumes `codex login` was completed. It does not automate authentication.
- **Cost estimation is approximate.** Real cost depends on the specific input/output token counts for your task. The estimate gives a range, not a point value.
- **Executor model choice defaults to GPT-5.4.** If you prefer Sonnet 5, GLM 5.2, or GPT-5.4-mini, specify it when invoking or edit the default in `references/executor-paths.md`.

## Version

v1.0.0 — initial release. See SKILL.md's "First-run notes" section for known weaknesses to iterate on.
