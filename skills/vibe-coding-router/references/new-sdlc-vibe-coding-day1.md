# Day 1 — The New SDLC With Vibe Coding: Notes for `vibe-coding-router`

Source: "The New SDLC With Vibe Coding: From ad-hoc prompting to Agentic Engineering." Authors: Addy Osmani, Shubham Saboo, Sokratis Kartakis. Date: May 2026. 51 pages, 9,371 extracted words.

## Core thesis

The important shift is from writing code as syntax to expressing intent and designing the system that turns intent into reliable software. AI changes the SDLC unevenly: implementation compresses fastest, while requirements, architecture, verification, and judgment stay human-paced. Generation is increasingly solved; verification, judgment, and direction are the new craft.

## Spectrum: vibe coding → structured AI-assisted coding → agentic engineering

The guide treats "vibe coding" and "agentic engineering" as a spectrum, not a binary.

Key differentiator: how much structure, verification, and human judgment surrounds AI output.

- **Vibe coding:** casual prompts, minimal codebase understanding, "does it seem to work?" verification, copy-paste errors back into the model, appropriate for disposable prototypes/scripts/personal projects/hackathons, high risk accepted.
- **Structured AI-assisted coding:** detailed prompts with examples and constraints, manual tests/spot checks, selective review of critical paths, developer diagnoses root cause and AI implements fix, moderate risk with human checkpoints.
- **Agentic engineering:** formal specs, architecture docs, memory/rule files, automated tests, CI/CD gates, LM-judge/eval coverage, agents self-diagnose inside defined bounds while humans handle architectural issues, appropriate for production/team-scale systems.

Applied rule: the right place on the spectrum depends on stakes. Weekend prototype can be pure vibe coding. Production APIs, money movement, auth, customer data, or durable automation require agentic engineering.

## Tests and evals

Without both deterministic tests and nondeterministic evals, the practice remains vibe coding no matter how sophisticated the prompts are.

- **Tests** verify deterministic code behavior: given this input, function/service produces expected output.
- **Evals** verify agent trajectory and quality: did the agent choose the right tools, follow required steps, avoid hallucination, and produce an acceptable final result?
- Testing AI-generated code requires evaluating both the final artifact and the path taken to produce it. A fluent output that skipped verification is more dangerous than a visible error.
- Good evals require explicit rubrics: task success, tool-use quality, trajectory compliance, hallucination, response quality.

## Context engineering

Prompt cleverness matters less than context quality. The relevant question is: what would a skilled human developer need to contribute effectively, and how do we encode that knowledge so the AI can use it?

Six types of context:

1. **Instructions:** role, goals, operational boundaries.
2. **Knowledge:** retrieved docs, architecture diagrams, domain data.
3. **Memory:** short-term session logs and long-term persistent project state.
4. **Examples:** few-shot demonstrations and codebase reference patterns.
5. **Tools:** APIs, scripts, external services, and their usage contracts.
6. **Guardrails:** hard constraints, formatting rules, safety validations.

Static vs dynamic context is an engineering tradeoff:

- **Static context:** AGENTS.md, CLAUDE.md, GEMINI.md, global memory, persona. Always loaded; expensive; should be reviewed/versioned.
- **Dynamic context:** skill instructions, tool results, RAG documents, windowed history. Loaded only when needed; efficient and higher signal.

Agent Skills are presented as the key dynamic-context pattern: metadata always visible, full instructions loaded on task match, deep references loaded only when explicitly needed. This avoids context rot, preserves procedural memory, reduces multi-agent overhead, and improves portability across vendors/tools.

## Factory model

The developer's primary output is no longer just code; it is the system that produces code.

That system includes:

- specifications and context defining what needs to be built
- agents that translate specs into implementation
- tests and quality gates that verify correctness
- feedback loops that route failures back to agents for correction
- guardrails that constrain agents to safe predictable behavior

The developer becomes the factory manager: design the assembly line, define success criteria, verify output quality, and let agents iterate within constraints.

## Harness engineering

A raw model is not an agent. Agent = model + harness. The model is one input; behavior is dominated by the harness around it.

Harness components:

- **Instructions and rule files:** AGENTS.md, CLAUDE.md, GEMINI.md, skills, sub-agent prompts.
- **Tools:** functions, MCP servers, APIs, and prose telling the model when/how to use them.
- **Sandboxes/execution environments:** where code runs and what it can/cannot access.
- **Orchestration logic:** sub-agents, model routing, handoffs, specialist firing rules.
- **Guardrails/hooks:** deterministic lifecycle checks before tool calls, after edits, before commits.
- **Observability:** logs, traces, evals, cost/latency metering, drift tracking.

Harness by SDLC phase:

1. Requirements/planning/architecture = configure harness: instructions, rule files, architectural constraints, tools, schemas, hard rules.
2. Implementation = run harness: sandbox, execution environment, tools.
3. Testing/QA = feedback loop: tests run in harness; failures are captured and routed back for correction.
4. Review/deployment/maintenance = observe harness: hooks block unsafe actions; observability traces cost, latency, drift, and deployment decisions.

Important diagnostic: when an agent fails, first suspect configuration—not the model. Failures often trace to a missing tool, vague rule, absent guardrail, or noisy context window.

## Conductor vs orchestrator

Developers move between two modes:

- **Conductor:** real-time hands-on direction in editor/IDE, watching code appear, guiding line-by-line. Best for complex logic, tricky debugging, unfamiliar codebases, and moments requiring fine-grained understanding/control. Risk: human becomes throughput bottleneck.
- **Orchestrator:** async higher-level delegation, defining goals and reviewing results later. Best for well-defined bugs, features against established patterns, migrations, and test generation. Requires strong specification, decomposition, evaluation, and system-design skill.

The skill is choosing the mode by task, not defaulting to maximum autonomy.

## The 80% problem

AI rapidly generates the first ~80% of a feature; the remaining 20%—edge cases, error handling, integration points, subtle correctness, and business logic—requires deep contextual knowledge. Modern AI errors are less often syntax mistakes and more often conceptual failures that look plausible and pass shallow tests.

Common failures:

- wrong assumptions about business logic
- failure to ask for clarification on ambiguous requirements
- missed edge cases
- subtle architectural decisions that create maintenance burdens
- hallucinated imports/dependencies/packages
- inadequate error handling and security gaps

Best posture: use AI for rapid implementation of well-specified tasks; reserve human attention for ambiguous requirements, architecture tradeoffs, and correctness verification.

## Where coding agents fit

- **Editor agents:** inline completion, chat panels, modify/explain code in-place. Best for staying in flow.
- **Terminal agents:** plain-language goals, full file-system access, multi-file edits, run tools/tests, iterate on observations. Best for serious vibe coding and repo-local implementation.
- **Background agents:** cloud/sandbox autonomous tasks that run for hours and return PRs. Best for well-specified tasks that can be reviewed later: known bug fixes, test suite generation, migrations.

Right starting point depends on the task, not autonomy ranking.

## Production-ready agents

If the thing being built is itself an agent for real users, it needs its own tools, memory, evals, deployment infrastructure, scoped permissions, observability, and governance. One-off scripts/personal automation can remain regular coding-agent outputs. User-facing or team-scale agents need the production substrate.

The same terminal workflow can now scaffold, evaluate, deploy, observe, and refine production agents. MCP is a key standard for tool access; A2A is a key standard for cross-agent delegation.

## Economics

Vibe coding has low upfront CapEx but high hidden OpEx:

- token burn from dumping huge unstructured context and looping on unverified fixes
- maintenance tax from inconsistent generated code
- security remediation costs when vulnerabilities reach production

Agentic engineering has higher upfront CapEx but lower long-term OpEx:

- API schemas, deterministic tests, eval suites, structured context, guardrails
- higher first-pass success rate
- lower retry loops and maintenance burden

Context engineering is a financial lever. Static context bloat costs money and reduces signal. Dynamic context through skills/tools lowers token spend. Intelligent model routing should reserve frontier models for complex requirements/architecture/initial implementation and route deterministic tasks like test generation, review, and CI/CD monitoring to smaller/faster/cheaper models when available.

## Adoption recommendations

For individual builders:

1. Create/update project AGENTS.md or equivalent with stack, conventions, hard rules, workflow. Add rules whenever the agent repeats a mistake.
2. Install/use skills for build, evaluate, deploy, optimize workflows.
3. Pick one repetitive workflow and make it the first agent/automation; graduate it only when it earns its keep.
4. Write tests and evals before generating code; they are the contract with the AI.
5. Review every line that will ship. Verify real imports/packages and realistic failure handling.
6. Maintain developer judgment: debugging, system design, performance/correctness intuition, and code review stay essential.

For leaders/teams:

1. Treat AGENTS.md, prompts, eval suites, and skill libraries as code: reviewed, versioned, owned.
2. Set the bar at the eval, not the demo. Demo success once is not reliability.
3. Re-shape code review for AI-generated failure modes.
4. Make the prototype/production boundary explicit by project, branch, and environment.
5. Treat harness components—skills, MCP connections, eval harnesses, prompts—as shared infrastructure.

For organizations:

1. Treat AI-assisted development as engineering investment, not just a productivity feature.
2. Build production substrate before scaling: trajectory/final-response evals, traces, scoped permissions, security review.
3. Prefer open standards: MCP for tool access, A2A for cross-agent delegation.
4. Plan hybrid human-agent teams with handoff protocols.
5. Develop judgment, specification, evaluation, architecture, and review skills.

## Implications for `vibe-coding-router`

Add a mandatory stake/risk classifier before phase routing:

- **Disposable/prototype:** vibe coding is acceptable; optimize for speed and learning.
- **Internal workflow or reversible feature:** structured AI-assisted coding; require spec, targeted tests, and human review of critical paths.
- **Production/customer data/money/auth/agent serving users:** agentic engineering; require SSOT, AGENTS.md/CLAUDE.md, deterministic tests, evals/trajectory checks if agentic, guardrails/hooks, observability, and explicit human review.

Add a harness check to every serious build:

- Are project instructions current?
- Are tools and permissions scoped?
- Is the execution sandbox known?
- Are tests/evals defined before coding?
- Are hooks/guardrails needed before edits/commit/deploy?
- Is observability/tracing/logging in place for post-deploy behavior?

Add a conductor/orchestrator mode choice:

- Use conductor mode for ambiguous architecture, tricky bugs, unfamiliar code, business logic, security/auth, or anything you need to understand deeply.
- Use orchestrator mode for well-specified, bounded, established-pattern tasks with clear verification and reviewable artifacts.

Add an 80% problem checkpoint before shipping:

- Edge cases covered?
- Error handling realistic?
- Integration points verified?
- Business logic assumptions explicit?
- Imports/packages real?
- Architecture tradeoffs accepted by a human?
- Tests/evals cover the subtle 20%, not just happy path?

Best use of the guide: make `vibe-coding-router` not just choose a skill/tool, but choose the level of discipline required. The router should prevent accidental promotion of prototype-style vibe coding into production workflows.
