# Executor Paths — Plan-Execute Router

Three routes for delegating execution to a cheaper model. Ordered by preference: Path 1 is fully automated, Path 2 stays within one CLI, Path 3 is manual but works everywhere.

## Path 1: Codex CLI subprocess

Preferred path. Matches the transcript's approach directly. Requires Codex CLI installed and authenticated in the current environment.

### Availability check

Before invoking, run:

```bash
which codex && codex --version
```

If either fails, this path is unavailable. Fall back to Path 2.

If the version check succeeds but `codex exec` returns an auth error, the CLI is installed but not authenticated. Tell the user: "Codex CLI is installed but not logged in. Run `codex login` and then re-invoke, or I can fall back to Path 2 (subagent) or Path 3 (manual)."

### Invocation

Standard invocation:

```bash
codex exec \
  --model gpt-5.4 \
  --sandbox workspace-write \
  "$(cat <spec-path>)"
```

Flag notes:
- `--model gpt-5.4`: the default executor model. Options: `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano`, `gpt-5.5` (defeats the purpose — same tier as the planner).
- `--sandbox workspace-write`: allows Codex to write to the workspace but restricts network and other side effects. For more restrictive sandboxing: `--sandbox read-only`. For less: `--sandbox danger-full-access` (do not use without explicit user approval).

### Model selection within Path 1

Choose based on task complexity and cost tolerance:

- **`gpt-5.4`** ($2.50/M input, $15/M output) — default. Handles most spec-driven execution reliably.
- **`gpt-5.4-mini`** ($0.75/M input, $4.50/M output) — for well-specified, mechanical execution work. Roughly 3× cheaper than gpt-5.4, roughly 7× cheaper than gpt-5.5.
- **`gpt-5.4-nano`** ($0.20/M input, $1.25/M output) — very cheap; use only for the simplest execution (config changes, boilerplate). Verify quality on your workload before defaulting.
- **`gpt-5.5`** ($5/M input, $30/M output) — same tier as the planner. Do not use for the execution phase unless the plan explicitly requires frontier capability throughout, in which case the plan/execute split isn't the right pattern.

### Output handling

Codex writes changes to the workspace directly (under `--sandbox workspace-write`). Capture stdout for the change summary. If Codex opens a PR, capture the PR URL.

Do not exit the skill until Codex either completes or errors. If Codex times out, report the timeout and offer to retry with a lower-effort model or manual fallback.

## Path 2: Claude Code subagent

Fallback when Codex CLI is unavailable but Claude Code subagent delegation is. Stays within one CLI but changes the executor model via subagent scoping.

### Availability check

Verify subagent invocation is available in the current session. In Claude Code, this is the Task tool. If Task tool is not available (e.g., API mode without subagent support enabled), fall back to Path 3.

### Invocation

Delegate to a subagent with the model explicitly scoped:

```
Task tool invocation:
- description: "Execute spec: <task-slug>" (3-5 words)
- prompt: <full spec content>
- subagent_type: "general-purpose"
- model: "haiku"
```

Model options for the subagent:
- **`haiku`** — Haiku 4.5. Cheapest, fast. Works well for mechanical execution when the spec is detailed. Note: on the Claude API tier, subagents inherit at most the parent's model — a Sonnet parent can spawn a Haiku subagent, but a Haiku parent cannot upgrade the subagent.
- **`sonnet`** — Sonnet 5. More capable, still cheaper than Opus. Use for specs where the executor may need moderate reasoning.

### Subagent context

The subagent runs in its own context window. The spec must be self-contained — the subagent has no memory of the parent session, no access to files the parent read, no context on prior conversation.

If the spec references files, include the necessary file contents in the prompt or ensure the file paths are accessible from the subagent's tool inheritance.

### Output handling

The subagent returns its result to the parent context. Capture the return value. Parse for file changes, errors, or open questions.

## Path 3: Manual copy-paste (fallback)

Available everywhere. Use when neither Codex CLI nor subagent delegation is present (Claude.ai, Cowork, some API deployments).

### Instructions to the user

Produce copy-paste instructions in this format:

```
The spec is saved at <spec-path>.

To execute it manually:

1. Open your cheaper AI tool of choice. Options:
   - ChatGPT with GPT-5.4 selected
   - Codex web interface
   - Cursor with model set to GPT-5.4 or Composer 2.5

2. Copy the spec content from the file above.

3. Paste as the prompt, prefixed with:
   "Build exactly what this spec describes. Do not deviate from the plan. If any section is unclear, ask before implementing."

4. Have the tool produce the code changes.

5. When done, return here. I can run the optional review pass on the result.
```

### When Path 3 is the right choice even if Path 1 or 2 exist

- The task is small enough that the manual overhead is trivial.
- The user wants explicit visibility into what the executor does at each step.
- The executor's model isn't available in Path 1 or 2 (e.g., wanting GLM 5.2 or Cursor Composer 2.5 specifically).
- Compliance considerations require human review at the hand-off.

## Cross-path considerations

### Executor model matrix

| Model | Path 1 (Codex CLI) | Path 2 (subagent) | Path 3 (manual) |
|---|---|---|---|
| Claude Haiku 4.5 | — | Yes | Yes (via Claude Desktop) |
| Claude Sonnet 5 | — | Yes | Yes |
| GPT-5.4 | Yes | — | Yes |
| GPT-5.4-mini | Yes | — | Yes |
| GPT-5.4-nano | Yes | — | Yes |
| Cursor Composer 2.5 | — | — | Yes (via Cursor) |
| GLM 5.2 | Yes (if configured) | — | Yes (via Z.ai or self-hosted) |

Cross-provider routing (Claude planner + OpenAI executor) is Path 1's default configuration and the transcript's canonical example.

### Handoff quality

Regardless of path, the spec must be detailed enough that the executor doesn't need to guess. If the executor asks for clarification, that's a signal to return to Phase 2 and deepen the spec.

Path 1 and Path 2 give the executor direct workspace access; the executor writes files as it goes. Path 3 relies on the user pasting output back; the executor's changes materialize in the user's copy-paste. Neither is inherently better; the difference is where the workspace mutation happens.

### Failure recovery

If any path fails:

- **Codex CLI error** → report the error, offer Path 2 or 3 as fallback.
- **Subagent error** → report the error, offer Path 1 (if available) or Path 3.
- **Manual path breakdown** (user says the external tool got confused) → the spec is likely too thin; return to Phase 2.
