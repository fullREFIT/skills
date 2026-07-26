---
name: vibe-coding-router
description: "Route vibe-coding work to the right agent skill/tool without loading a mega-prompt. Use when you are building, planning, debugging, QAing, shipping, or content-mining software with Claude Code, Codex, or another LLM; when a request mentions vibe coding, super-app, command center, skill routing, design-taste, superpowers, Agent-Native, Mastra, or choosing which installed skill/tool should drive the next phase. MANDATORY TRIGGERS: vibe coding, vibe-coding-router, super-app, command center, choose skills, route skills, phase router."
license: MIT
allowed-tools: Bash, Read, Write, Edit
metadata:
  user-invocable: "true"
  tags: [vibe-coding, skill-routing, claude-code, codex, pwa]
  related_skills: [design-taste-frontend, webapp-testing, tdd, diagnosing-bugs, codebase-design, prototype, content-opportunity-tracker]
---

# Vibe Coding Router

## Purpose

Use this skill as the thin command center for AI-assisted software builds. Its job is to choose the smallest useful set of skills, tools, and artifacts for the current phase. It is not a replacement for design-taste, Claude Code, Codex, Agent-Native, or Mastra.

The core rule: **route by phase, then load only the needed specialist skill.** Do not paste or load every skill at once.

## Operating stance

- Lead with the next executable move.
- Prefer real verification over plans, mockups, or vibes.
- Keep the build tied to a project-local source of truth.
- Use skills as procedures, not decorations.
- Use broad frameworks as pattern sources first, dependencies second.
- Avoid global tool/skill bloat unless the install directly solves an active bottleneck.
- Treat the model as only one part of the system; diagnose failures as likely harness/context failures before blaming the model.
- Make tests, evals, guardrails, and observability proportional to the stakes of the build.

## First action

Before acting, classify the request in two passes:

### Pass 1: stake/risk mode

Choose the level of discipline required before choosing tools:

1. **Vibe/prototype mode** - disposable prototype, script, exploration, personal experiment, or throwaway learning artifact. Optimize for speed and evidence, but do not confuse the output with production architecture.
2. **Structured AI-assisted mode** - internal workflow, reversible feature, established codebase task, or medium-risk build. Require a concrete spec, targeted tests, and human review of critical paths.
3. **Agentic engineering mode** - production system, customer data, money movement, auth/security, durable automation, user-facing agent, or anything hard to unwind. Require project SSOT/rule files, deterministic tests, evals or trajectory checks where agentic behavior is involved, guardrails/hooks, observability, and explicit human review.

Applied rule from the Day 1 New SDLC guide: **structure scales, vibes do not**. Weekend prototypes can be vibe-coded; production systems need agentic engineering. If the boundary is blurry, route upward one discipline level.

### Pass 2: phase

Then classify the request into one phase:

1. **Frame** - vague idea, product direction, scope, ROI, what to build.
2. **Spec** - convert intent into a concrete implementation plan or issue.
3. **Architecture** - data flow, stack choice, boundaries, auth, runtime topology.
4. **Prototype** - quick throwaway proof, design exploration, spike.
5. **Build** - implement working code.
6. **Debug** - broken behavior, error, failed test, unknown root cause.
7. **Design** - visual direction, UX quality, mobile/product surface, landing/demo surface.
8. **QA** - browser/mobile/device verification, screenshots, flows, regressions.
9. **Review** - pre-commit/pre-PR/code quality/security check.
10. **Ship** - merge, deploy, canary, document release.
11. **Content capture** - turn the build into content, demo, runbook, lesson, or sales asset.
12. **Resume** - continue from an SSOT, continuation brief, prior plan, or task store.

Then follow the matching route below.

## Harness checklist

For any structured or agentic-engineering route, check the harness before coding:

- **Instructions/rules:** Are AGENTS.md, CLAUDE.md, project SSOT, or equivalent rule files present and current?
- **Knowledge/memory:** Does the agent have the right project context without dumping noisy archives into static context?
- **Examples:** Are there existing code patterns or prior artifacts the agent should imitate?
- **Tools/permissions:** Are APIs, MCP servers, scripts, credentials, and filesystem access scoped to the task?
- **Sandbox:** Where will code run, and what can it safely touch?
- **Guardrails/hooks:** Are deterministic checks needed before file edits, commits, deploys, or dangerous tool calls?
- **Tests/evals:** What deterministic tests and nondeterministic evals/trajectory checks define success?
- **Observability:** What logs, traces, screenshots, deployment health checks, or cost/latency signals will prove the result works after shipping?

When an agent fails, first inspect the harness: missing tool, vague rule, absent guardrail, stale context, or noisy context window. Model quality is not the only or usual explanation.

## Conductor vs orchestrator choice

Before assigning work, choose the operating mode:

- **Conductor mode:** hands-on, real-time direction. Use for ambiguous architecture, tricky debugging, unfamiliar codebases, business logic, auth/security, performance/correctness questions, or anything you need to understand deeply.
- **Orchestrator mode:** async delegation and review. Use for well-specified bounded tasks, established codebase patterns, migrations, test generation, and background work with clear acceptance criteria.

Do not maximize autonomy by default. The right starting point depends on task stakes and clarity, not on which tool sounds most advanced.

## 80% problem checkpoint

Before shipping AI-generated code, explicitly inspect the subtle final 20%:

- edge cases and unhappy paths
- realistic error handling
- integration points and environment assumptions
- business-logic assumptions
- hallucinated imports, packages, APIs, or flags
- security/auth/data handling
- long-term maintenance burden
- tests/evals that cover more than the happy path

AI is good at rapid implementation of well-specified work. Human attention should concentrate on ambiguous requirements, architecture tradeoffs, and correctness verification.

## Phase routes

### 1. Frame

Use when the user asks whether an idea is worth building, how big to make it, or what the product should be.

Preferred routes:

- Product framing tool or office-hours equivalent for opportunity shape.
- Plan/CEO-review tool for ambition, ROI, and founder-level tradeoffs.
- `external-skill-tool-evaluation` when the request is about adopting an outside repo, agent framework, MCP, skill, or tool.

Output should decide one of: **GO**, **PILOT**, **NO GO**, or **BORROW PATTERNS**.

### 2. Spec

Use when the idea is good enough to turn into concrete work.

Preferred routes:

- Spec-generation skill for executable build specs or GitHub issues.
- Task/memory tools when work must persist across sessions.
- A project-local SSOT markdown file when the work spans multiple sessions or agents.

Spec must include:

- project root and exact files likely touched
- user-visible outcome
- non-goals
- sequencing
- verification commands
- rollback or safe-stop criteria

### 3. Architecture

Use when the main risk is boundaries, auth, state, hosting, data flow, or agent/tool ownership.

Preferred routes:

- Engineering review skill for architecture review.
- `codebase-design` for deep module boundaries and seams.
- Agent-Native as a **pattern source** for shared actions across UI, API, agent, MCP, CLI.
- Mastra as a **candidate framework** only when building a separate TypeScript AI app or durable workflow service.

Default recommendation:

- Extend existing systems before adding a second agent framework.
- Use Agent-Native/Mastra patterns first; install only after one narrow pilot proves the dependency earns its weight.

### 4. Prototype

Use when the goal is to learn cheaply before committing to architecture.

Preferred routes:

- `prototype` for throwaway implementation.
- `spike` if installed/available and the goal is a technical feasibility check.
- Design-shotgun skill for multiple UI variants.
- `claude-design` or `sketch` for one-off HTML artifacts.

Prototype rules:

- Make it disposable.
- Define what evidence will kill or advance the idea.
- Do not confuse prototype output with production architecture.

### 5. Build

Use when the plan is clear and code should change.

Preferred routes:

- `tdd` when behavior is testable and stable enough for RED-GREEN-REFACTOR.
- `codebase-design` before editing deep modules.
- Claude Code for repo-local multi-file implementation.
- Your primary agentic coding environment for orchestration, status, scheduling, cross-platform handoff.
- Codex for deterministic inspection, targeted refactors, or second-opinion implementation.

Build rules:

- Read the project instructions first.
- Inspect existing package/workspace structure before creating new folders.
- Use one in-progress task at a time.
- Verify with real commands.
- Do not stop at a stub unless the explicit milestone is only a scaffold.

### 6. Debug

Use when something is broken or observed behavior disagrees with expected behavior.

Preferred routes:

- `diagnosing-bugs` or investigate skill.
- `systematic-debugging` if available and the bug is hard or cross-layer.

Debug rules:

- Reproduce before fixing.
- Identify root cause before patching.
- Check for false blockers, stale blockers, and self-noise from cron/reports.
- Verify the fix with the failing path, not just a nearby unit test.

### 7. Design

Use when the user asks how it should look, why it feels wrong, or asks for frontend/UX polish.

Preferred routes:

- `design-taste-frontend` for landing pages, portfolios, redesigns, and anti-slop frontend output.
- Design consultation or design-review skill for design-system or live visual QA.
- For dense app surfaces, use product UI conventions and accessibility first; do not force marketing-page taste rules into dashboards or command surfaces.

For mobile PWA work:

- Treat design-taste as a quality filter, not a full aesthetic generator.
- Prioritize one-handed use, connection/auth state, session resume, readable tool activity, and mobile viewport stability.
- Do not start with animation or visual polish before auth/WebSocket/session behavior works.

### 8. QA

Use when the question is "does this work?" or a browser/mobile/device flow needs verification.

Preferred routes:

- `webapp-testing` for local web apps, Playwright, mobile viewport checks, and PWA basics.
- QA skill to find, fix, and re-verify bugs in a browser.
- QA-only skill for report-only audits.
- iOS QA or iOS design-review skill for real device testing when native/iOS-device behavior matters.

QA output should include:

- exact URL or command tested
- viewport/device if relevant
- pass/fail evidence
- screenshots/video path when useful
- remaining blockers

### 9. Review

Use before landing changes or when asked to check quality/security.

Preferred routes:

- Pre-landing PR/diff review skill.
- Security-sensitive changes skill (CSO or equivalent).
- `requesting-code-review` for pre-commit security/quality gates.
- Codex as a second-opinion reviewer for high-risk or ambiguous diffs.

Review rules:

- Review actual diffs, not intentions.
- Separate must-fix defects from taste suggestions.
- Verify no secrets, token leaks, or unsafe auth shortcuts.

### 10. Ship

Use when code is ready to merge, deploy, or release.

Preferred routes:

- Ship skill for branch review, tests, push, PR.
- Land-and-deploy skill for merge + deploy + production verification.
- Canary skill for post-deploy monitoring.
- Document-release skill for docs after shipping.

Shipping rules:

- Run the project's real test/build commands.
- Verify the deployed/live path, not just local success.
- Save follow-up tasks in your task store with exact paths and completion criteria.

### 11. Content capture

Use when the build is also a publishable or reusable asset.

Preferred routes:

- `content-opportunity-tracker` for mining the build into content opportunities.
- `script-forge` for turning source material into scripts or posts.
- YouTube/media skills when producing video, screen-share, demo, transcript, or repurposed assets.

Content rules:

- The lesson is the asset.
- Avoid "my system was messy" framing.
- Prefer operational leverage, architecture tradeoffs, and client-relevant lessons.
- Sanitize secrets, private IDs, tokens, Slack threads, and customer data.

### 12. Resume

Use when continuing from prior context.

Preferred routes:

- Read the project-local SSOT or continuation brief first.
- Search your task/memory store for the project and recent session summaries.
- Use context-restore skill if the work was saved by it.

Resume rules:

- Do not re-run broad archaeology unless a missing fact blocks implementation.
- Verify live runtime state before building on historical assumptions.
- Respect explicit decisions in the SSOT unless the user supersedes them.

## Agent-Native and Mastra posture

### Agent-Native

Use as a pattern source when the build benefits from:

- one action powering UI, agent, HTTP, MCP, A2A, and CLI
- visual plan/visual recap artifacts
- app-backed skills
- agent and human UI sharing state
- reviewable product-grade agentic workflows

Default: **PILOT/BORROW**, not global install.

### Mastra

Use as a candidate framework when the build is a separate TypeScript AI application needing:

- durable workflows
- model routing
- human-in-the-loop suspend/resume
- observability/evals
- MCP server authoring
- production agent service boundaries

Default: **PILOT only for a separate TS agent app**. Do not use Mastra to rebuild capabilities your existing runtime already provides.

## Cross-agent usage

### Claude Code

Best for repo-local implementation, multi-file edits, tests, diffs, and PR preparation. Give Claude Code:

- the project root
- the SSOT/brief path
- the target phase
- the specific skill to invoke next
- exact verification commands

### Your primary agentic coding environment

Best for orchestration, memory, cross-platform messages, cron, tool routing, system review, and lightweight implementation. Can also build skills and manage scheduled workflows.

### Codex

Best for deterministic code inspection, targeted refactors, independent review, and debugging. Use Codex as a second opinion when the plan is risky or the diff is complex.

### Claude Desktop

Best for thinking, writing, plan review, and artifact review. Use uploadable zips or project briefs when it cannot access local repo/tool state.

## Output format

When this skill routes a request, respond with:

```markdown
## Route
Mode: <Vibe/prototype | Structured AI-assisted | Agentic engineering>
Phase: <one phase>
Primary skill/tool: <name>
Secondary skill/tool: <name or none>
Executor: <Claude Code | Codex | Claude Desktop | other>

## Why
<2-5 bullets>

## Harness / verification
<tests, evals, guardrails, observability, or why lightweight verification is enough>

## Next action
<one concrete action, command, or prompt>

## Guardrails
<only the relevant constraints>
```

If you need a reusable prompt to create a plan and spec before coding, use `references/universal-planning-spec-prompt.md`.

If the user asks for execution and the active agent has the tools to do it safely, execute instead of only producing a prompt.

## Common pitfalls

1. **Loading everything.** Do not load design-taste, testing, content, and framework docs all at once. Route to one phase.
2. **Mistaking a router for a framework.** This skill chooses work modes; it does not implement agents or UI by itself.
3. **Overusing design-taste.** It is powerful for marketing/frontend taste, but mobile command surfaces need clarity first.
4. **Installing frameworks too early.** Agent-Native and Mastra are promising, but patterns can be borrowed before dependencies are added.
5. **Skipping live verification.** Historical notes are useful context, not proof that a route, auth path, or deployment works today.
6. **Losing the content angle.** When content capture matters, capture the reusable lesson, not personal friction.
7. **Creating vague tasks.** Any pending task must include exact paths, context, and completion criteria.

## Verification checklist

Before finalizing a routed plan or build step:

- [ ] Stake/risk mode is named: vibe/prototype, structured AI-assisted, or agentic engineering.
- [ ] Phase is named.
- [ ] Only the necessary specialist skill/tool is selected.
- [ ] Executor is explicit.
- [ ] Project-local SSOT or continuation brief is referenced when relevant.
- [ ] Harness requirements are explicit: instructions, tools, sandbox, guardrails, tests/evals, observability.
- [ ] The conductor vs orchestrator choice fits the ambiguity and risk.
- [ ] The 80% problem is checked before shipping: edge cases, error handling, integrations, business logic, hallucinated dependencies, security.
- [ ] Live verification is required before relying on runtime state.
- [ ] Agent-Native/Mastra are treated as pattern sources unless a pilot is explicitly chosen.
- [ ] Content-product guardrails are preserved.
- [ ] Pending work, if any, is registered in your task store with exact paths and completion criteria.

## Source note

This skill incorporates the May 2026 Day 1 guide, "The New SDLC With Vibe Coding." See `references/new-sdlc-vibe-coding-day1.md` for the extracted implications used here.
