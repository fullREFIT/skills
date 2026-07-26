# Claude Platform Changes Log

Reference snapshot of Claude platform state. Load during Phase 1 audit. Use this as the baseline for detecting platform-fact staleness. When the skill runs, the current date will be later than this snapshot — always verify against live docs before declaring something current.

**Snapshot date:** April 2026

Everything below is subject to change. Treat this as a staleness *detector*, not a source of truth. When the user's document contradicts this log, the document is likely stale. When this log contradicts live Anthropic docs, the live docs win.

---

## Model lineup (as of snapshot)

- **Claude Opus 4.7** — most advanced, orchestration and complex reasoning.
- **Claude Opus 4.6** — previous-generation top model, still widely referenced.
- **Claude Sonnet 4.6** — balanced execution model, well-specified tasks, tool-calling.
- **Claude Haiku 4.5** — fast/cheap model for transforms and high-frequency calls.
- Model family pattern: Opus (orchestrate) → Sonnet (execute) → Haiku (transform).

**Common staleness signals in user docs:**
- References to Claude 3, 3.5, 3.7 as "current" → stale
- References to Claude 4.0, 4.1, 4.5 as "latest" → stale
- "Sonnet 3.5 is the best for..." → stale framing
- Missing any mention of heterogeneous model routing → likely pre-2025 thinking

## Skills (Skills 2.0 era — March 2026+)

- Skills are folders with a `SKILL.md` plus supporting files (references, templates, scripts, runbooks, assets).
- Frontmatter has `name` and `description` fields. Description loads into context; body loads on invocation.
- Skills support **progressive disclosure** — full content deferred until the skill is triggered.
- Skills can spawn **forked subagents** with isolated context.
- Skills can restrict tools and override model selection.
- **Commands have been unified with skills** — new workflows should be skills, not commands.

**Common staleness signals:**
- References to `commands/` directory → deprecated, now skills
- Skills without frontmatter → pre-2.0
- "Load the entire skill into context" → pre-progressive-disclosure thinking
- No mention of skills in a system prompt that handles procedural work → likely predates skills

## MCP (Model Context Protocol)

- De facto standard for agent-to-tool communication as of 2026.
- MCP servers can be remote (URL) or local.
- Tool descriptions are context — they consume budget; keep concise.
- Poor tool descriptions cause tool-selection errors in agent execution.

**Common staleness signals:**
- No mention of MCP when discussing tool integrations → pre-MCP thinking
- References to custom tool-calling schemas that MCP has superseded
- Bespoke API integration instructions that MCP connectors now handle

## Subagents

- Run in separate context windows; return summaries to the parent.
- Use for parallelizable or isolated-context tasks.
- Don't use when subtasks share state heavily or require sequential reasoning over common intermediate results.
- Opus models have a tendency to over-spawn subagents; instructions may need explicit guidance.

**Common staleness signals:**
- No mention of subagents in a doc that orchestrates multi-step work
- "Claude can only handle one task at a time" → stale
- Multi-agent framings that don't distinguish planner-worker from peer-to-peer

## Prompt / prefix caching

- Anthropic charges roughly ~1.25× base input rate for cache writes and ~0.1× for cache reads.
- Cache hit rates above ~70% deliver meaningful cost reductions; above 90% can reduce effective cost by ~80%+.
- Cache order matters: system prompt → tool definitions → skills → chat history → user input.
- Dynamic content (timestamps, session IDs, user-specific data) in the static prefix **destroys the cache**.

**Common staleness signals:**
- Timestamps, "today's date," or user IDs embedded in persistent instructions → cache-hostile
- No awareness of cache-ordering → pre-caching or pre-2025 thinking
- Instructions to "always include the current date at the top" → cache-destroying pattern

## Model routing / cost awareness

- Heterogeneous routing is mainstream: use Opus for planning, Sonnet for execution, Haiku for transforms.
- Plan-and-execute pattern can reduce cost 90% vs. frontier-model-throughout.
- Output tokens typically cost 4-8x input tokens — brevity is a cost lever.

**Common staleness signals:**
- "Always use the best model available" → cost-naive
- No routing strategy in a doc that governs high-frequency agent work

## Claude.ai product surface

- Projects support custom instructions, project documents, memory (when enabled).
- Memory system: Claude has per-project memory; memories update in background.
- Claude Code: uses `CLAUDE.md` (or `AGENTS.md`) as persistent project memory — keep concise.
- Deferred tools: tool definitions that load on demand via tool_search.
- Claude for Chrome, Excel, PowerPoint, Slack, and Cowork (desktop) extend Claude beyond the chat UI.

**Common staleness signals:**
- No mention of memory when discussing persistent context → pre-memory
- References to file/image/search features as "new" → likely stale
- Instructions that assume no tool access when tools are now default

## Interview-then-implement pattern

A 2025-2026 practice: have Claude interview you about requirements, write the spec to a file, then start a fresh session to implement against it. Prevents context drift by giving implementation a clean context with only the validated spec.

**Common staleness signals:**
- Monolithic "plan and execute in one session" guidance for long tasks
- No separation between planning and execution contexts

## Spec-driven development (SDD)

Mainstream by 2026: GitHub Spec Kit, AWS Kiro, JetBrains planning mode, Cursor plans, BMAD. Spec is an executable contract, not documentation. Agents reason against the spec throughout generation, testing, and validation.

**Common staleness signals:**
- "Just describe what you want and Claude will figure it out" framing for long-running work
- No acceptance criteria in project docs that govern autonomous execution

## Things to verify live (always)

Regardless of what this log says, verify the following against current Anthropic docs during any refresh because they change frequently:

1. Current model names and versions.
2. Context window sizes.
3. Pricing and cache pricing ratios.
4. Available tools in each product surface.
5. Skill spec (frontmatter fields, directory conventions).
6. MCP server catalog.
7. Product feature names (they get renamed).

When any of these appear in the user's document, treat them as `LIKELY_STALE` by default and verify.
