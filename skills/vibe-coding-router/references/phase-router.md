# Vibe Coding Phase Router

Use this reference when a task spans multiple phases or when the agent needs a quick map from task type to specialist skill.

## Route map

| Phase | Trigger | Primary skill/tool | Notes |
|---|---|---|---|
| Frame | Is this worth building? What should this be? | Product framing / office-hours skill | Decide GO/PILOT/NO GO/BORROW. |
| Spec | Turn this into an executable plan | Spec-generation skill | Create file paths, sequencing, verification, non-goals. |
| Architecture | Auth, state, hosting, data flow, runtime | Engineering review skill, `codebase-design` | Borrow Agent-Native/Mastra patterns before installing frameworks. |
| Prototype | Quick proof or throwaway UI | `prototype`, design-shotgun skill, `claude-design`, `sketch` | Define evidence that advances/kills idea. |
| Build | Implement code | Claude Code + `tdd` or `codebase-design` | Verify with real commands. |
| Debug | Broken behavior or errors | `diagnosing-bugs`, investigate skill | Reproduce, root cause, fix, verify. |
| Design | Visual/UX quality | `design-taste-frontend`, design-review skill | Do not over-apply marketing-page rules to command surfaces. |
| QA | Does it work in browser/mobile? | `webapp-testing`, QA or QA-only skill | Produce evidence, screenshots, commands. |
| Review | Check code/diff/security | Review skill, `requesting-code-review`, Codex | Separate must-fix from suggestions. |
| Ship | Merge/deploy/canary/docs | Ship, land-and-deploy, canary, document-release skills | Verify live path. |
| Content | Turn build into asset | `content-opportunity-tracker`, `script-forge`, media skills | The lesson is the asset. |
| Resume | Continue from prior context | SSOT, continuation brief, task store, context-restore skill | Do not redo archaeology without need. |

## Default executor selection

- **Claude Code:** repo-local implementation, tests, diffs, PRs.
- **Your primary agentic coding environment:** orchestration, task store, cross-platform handoff, cron, skill management, system review, mobile-friendly action.
- **Codex:** deterministic code inspection, targeted refactor, second opinion.
- **Claude Desktop:** planning, writing, artifact review, skill zip upload.

## Framework posture

- **Agent-Native:** use for shared action pattern, visual plan/recap, app-backed skills, human+agent shared state.
- **Mastra:** use for separate TypeScript AI apps needing workflows, model routing, HITL, evals, observability, MCP server authoring.
- **Existing runtime:** remains the runtime for your local agent capabilities. Do not rebuild existing features inside Mastra unless a narrow pilot proves the need.
