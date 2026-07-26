# Universal Planning + Spec Execution Prompt

Use this prompt when you want Claude, Codex, or another agent to use `vibe-coding-router` to create a plan and build spec for a project before implementation.

```text
Use the `vibe-coding-router` skill first.

I want you to create the plan and implementation spec for a project I want built. Do NOT start coding yet unless I explicitly approve execution after the spec is complete.

PROJECT IDEA / REQUEST:
<PASTE THE IDEA, GOAL, PROBLEM, OR FEATURE HERE>

OPTIONAL CONTEXT:
- Project root, if known: <ABSOLUTE_PATH_OR_UNKNOWN>
- Existing repo/app, if any: <ABSOLUTE_PATH_OR_URL_OR_NONE>
- Relevant files/docs/briefs: <ABSOLUTE_PATHS_OR_URLS>
- Target user/customer: <WHO THIS IS FOR>
- Business goal: <REVENUE / OPERATIONS / CONTENT / PRODUCT / INTERNAL TOOL>
- Preferred stack/tools, if any: <STACK_OR_NONE>
- Constraints: <TIME, BUDGET, AUTH, SECURITY, PLATFORM, DEVICE, API, HOSTING>
- Must avoid: <NON-GOALS / THINGS NOT TO BUILD>
- Definition of done, if known: <WHAT DONE MEANS>

ROUTING INSTRUCTIONS:
1. Treat this as the **Frame → Spec → Architecture** phase, not Build.
2. Use `vibe-coding-router` to choose the smallest useful specialist skill/tool set.
3. Do not load a broad bundle of skills. Pick only what the phase requires.
4. If the idea is still vague, use product-framing mode first and ask at most one high-leverage clarifying question. If reasonable assumptions are enough, proceed and label them.
5. If this is repo-specific, inspect the project root and instructions before writing the spec.
6. If this involves a specific agent runtime, load its companion skill before making architecture claims.
7. If this is frontend/product UI, use `design-taste-frontend` only for relevant UI/design guidance. Do not overdesign dashboards, command surfaces, or internal tools.
8. If this may become a web/PWA/mobile app, include a verification plan suitable for `webapp-testing` later, but do not run QA before something exists.
9. Treat Agent-Native and Mastra as pattern sources unless the spec explicitly justifies a narrow pilot dependency.
10. Preserve content guardrails if this is content/product work: the lesson is the asset; never make the builder the failure case.

YOUR TASK:
Create a project plan and implementation spec that another agent can execute without needing this conversation.

DELIVERABLE FORMAT:

# <Project Name> - Build Plan + Implementation Spec

## 1. Route decision
- Phase: Frame / Spec / Architecture
- Primary skill/tool to use next:
- Secondary skill/tool, if any:
- Recommended executor for implementation: Claude Code / Codex / other
- Why this route:

## 2. Executive summary
- What we are building:
- Who it is for:
- Why it matters:
- Business/user outcome:
- GO / PILOT / NO GO / BORROW PATTERNS recommendation:

## 3. Assumptions and open questions
Separate into:
- Assumptions safe to proceed with
- Questions that must be answered before build
- Questions that can wait until after first milestone
Ask no more than one blocking question unless multiple answers would materially change architecture.

## 4. Scope
### In scope
- ...

### Out of scope
- ...

### Non-goals / anti-drift rules
- ...

## 5. User stories / jobs to be done
Write concrete user stories or jobs. Include the user, action, outcome, and success signal.

## 6. Proposed architecture
Include:
- App/runtime shape
- Frontend surfaces
- Backend/API/services
- Data model/storage
- Auth/security model
- Integrations
- Agent/tool/skill involvement
- Hosting/deployment assumptions
- What should be reused vs newly built

If the repo already exists, reference exact absolute paths. If paths are unknown, specify where the implementation agent must inspect first.

## 7. Data and interface contracts
Include as relevant:
- API endpoints
- event shapes
- database tables/fields
- config keys
- environment variables, only for secrets
- file formats
- command interfaces
- error states

Do not invent fake credentials. For non-secret behavior, prefer config files over new environment variables.

## 8. UX / design direction
Include only the design guidance appropriate to the project type.
- Design read:
- Primary surfaces:
- Accessibility/mobile requirements:
- Loading/empty/error states:
- What not to overdesign:

## 9. Implementation milestones
Break into small, verifiable milestones. For each milestone include:
- Goal
- Files likely touched or created, using absolute paths if known
- Tasks
- Verification command or manual check
- Acceptance criteria
- Safe stop point

Milestone 1 should be the smallest useful proof, not the whole app.

## 10. Testing and verification plan
Include:
- Unit tests
- Integration tests
- Browser/PWA/mobile tests if relevant
- Manual QA paths
- Security/auth checks
- Performance checks if relevant
- Exact commands where known

Every verification step must be something a future agent can actually run or manually check.

## 11. Risks and mitigations
Cover:
- Technical risk
- Auth/security risk
- Scope risk
- Dependency/framework risk
- Data/privacy risk
- UX/adoption risk
- Content/reputation risk, if public-facing

## 12. Build-agent prompt
Write a ready-to-paste prompt for the implementation agent. It must include:
- Project root
- Spec path to save/read
- Exact first milestone
- Skills to load
- Guardrails
- Verification requirements
- Instruction not to exceed milestone scope

## 13. Task backlog
Create self-contained task bullets suitable for a task store or runbook. Each task must include:
- Project prefix
- DESKTOP/MOBILE tag if relevant
- Exact file paths or URLs when known
- Completion criteria
- What it unblocks

## 14. Content/product capture, if relevant
If this project can become a reusable content asset, include:
- Client-relevant lesson
- What screenshots/screen recordings to capture
- What must be sanitized
- What not to say

## 15. Final recommendation
State the recommended next action in one sentence.

QUALITY BAR:
- Be specific enough that Claude Code or another implementation agent can execute from the spec alone.
- Use absolute paths whenever paths are known.
- Do not create vague tasks.
- Do not prescribe broad skill loading.
- Do not start implementation yet.
- Do not fabricate current system state; inspect it if tools are available, otherwise mark assumptions.
```

## Short version

```text
Use `vibe-coding-router` first. Create a plan and implementation spec for this project, but do not code yet. Route this as Frame → Spec → Architecture. Pick only the smallest useful specialist skill/tool set. Inspect the repo if I provide a path. Produce a self-contained spec with scope, non-goals, architecture, data/API contracts, milestones, verification plan, risks, a ready-to-paste build-agent prompt, and task backlog. Use absolute paths when known. Treat Agent-Native/Mastra as pattern sources unless you justify a narrow pilot. Preserve content guardrails: the lesson is the asset; never make the builder the failure case.

Project idea:
<PASTE IDEA HERE>
```
