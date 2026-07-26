# vibe-coding-router

A thin command-center skill for routing AI-assisted software builds to the right specialist skill/tool by phase.

## What it does

This skill helps Claude Code, Codex, Claude Desktop, and other LLM agents decide which existing capability should drive the next step of a build:

- Design-taste-frontend for frontend quality and public/demo surfaces.
- Webapp-testing for browser/mobile/PWA verification.
- TDD, diagnosing-bugs, codebase-design, and prototype for software-development discipline.
- Content-opportunity-tracker and script-forge for content capture.
- Agent-Native and Mastra as pattern sources or pilot candidates, not default dependencies.

## Installation

### Claude Code
```bash
cp -r vibe-coding-router/ ~/.claude/skills/vibe-coding-router/
```
Invoke with `/vibe-coding-router`.

### Claude.ai / Desktop
Settings → Customize → Skills → Upload `vibe-coding-router.zip`.

## Usage examples

- "Route this mobile PWA work."
- "Which skills should Claude Code use for this build?"
- "Create a plan for vibe coding this app without loading everything."
- "Should we use design-taste, Agent-Native, or Mastra for this phase?"
- "Continue from the SSOT and choose the next build skill."

## Reusable prompts

- `references/claude-code-prompt-template.md` — general Claude Code execution template.
- `references/universal-planning-spec-prompt.md` — universal prompt for creating a plan and implementation spec before coding.

## Reload note

Existing sessions may not see newly installed skills until a new session or skill reload. Start a fresh session if the skill does not appear immediately.
