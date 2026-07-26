# Claude Code Prompt Template

Use this when you want Claude Code to run a build through the vibe-coding-router.

```text
Use the vibe-coding-router skill first.

Project root: <ABSOLUTE_PROJECT_ROOT>
Primary SSOT / brief: <ABSOLUTE_PATH_TO_SSOT_OR_CONTINUATION_BRIEF>
Goal: <WHAT WE ARE BUILDING OR DECIDING>
Current phase: <Frame | Spec | Architecture | Prototype | Build | Debug | Design | QA | Review | Ship | Content capture | Resume>

Instructions:
1. Load vibe-coding-router and route this request to the smallest useful specialist skill/tool set.
2. Do not load every available skill.
3. If this is a specific agent runtime project, load its companion skill before editing.
4. If this is frontend/product UI, use design-taste-frontend only where it applies. Do not overdesign command surfaces.
5. If this is browser/mobile/PWA verification, use webapp-testing or QA skill after there is something runnable.
6. If this is implementation, inspect the existing repo structure before creating new folders.
7. Verify with real commands and report exact outputs.
8. Use absolute paths in all final output.
9. Register any pending follow-up in your task store with exact paths and completion criteria.
10. Preserve content guardrails: the lesson is the asset; never make the builder the failure case.

Deliverable:
- Route decision: phase, primary skill/tool, secondary skill/tool, executor.
- Action taken or exact next implementation plan.
- Files touched with absolute paths.
- Tests/verification commands and results.
- Blockers and pending tasks, if any.
```

## Mobile PWA variant

```text
Use vibe-coding-router first.

Project root: {PROJECT_ROOT}
Primary SSOT: {PROJECT_ROOT}/mobile-app-SSOT.md
Continuation brief: {PROJECT_ROOT}/continuation-brief.md
Goal: Continue the mobile PWA build without broad archaeology or visual-polish drift.
Current phase: <Resume / Architecture / Build / QA>

Start by reading the SSOT and continuation brief. Follow their anti-drift rules. Verify live backend/auth/WebSocket behavior before relying on historical notes. Build the next minimal milestone only and verify it. Do not start with animations. Do not assume Cloudflare Access or WebSocket works without testing. Do not expose auth tokens, cookies, or API keys.
```
