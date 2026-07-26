# Hermes Agent — Conversion Notes

The Hermes Agent instance lives at `~/.hermes-agent/` (default) or a path you specify.

## Architecture

Hermes Agent is a self-improving AI agent from Nous Research. Key characteristics:
- **Stack:** Python 3.11+ (core), TypeScript/React (TUI), Postgres/SQLite (session store)
- **Entry points:** `run_agent.py` (conversation loop), `cli.py` (terminal UI), `model_tools.py` (tool orchestration)
- **Config:** `~/.hermes/config.yaml` (settings), `~/.hermes/.env` (API keys)
- **200+ LLM support** via OpenRouter, Nous Portal, or custom endpoints

## Skill Format

Hermes uses the agentskills.io SKILL.md format — nearly identical to Claude. Key additions:

```yaml
---
name: skill-name
description: "..."
version: 1.0.0
platforms: [linux, macos, windows]        # Hermes-specific
metadata:
  hermes:
    tags: [tag1, tag2]                     # Hermes-specific
    related_skills: [skill-a, skill-b]     # Hermes-specific
---
```

Skills live in the `/skills/` directory with markdown docs, optional `templates/` and `references/` subdirs.

## Tool System

Tools are auto-discovered via `tools/registry.py`. Core tools defined in `toolsets.py`.

For Open Brain integration, register tools that call the Open Brain REST API or MCP server. Hermes tools are Python async functions decorated with metadata for the tool registry.

## Memory System

Hermes has its own agent-curated memory with periodic nudges and trajectory generation. When a Claude skill writes to Open Brain, the Hermes version should:
1. Write to Open Brain (primary — cross-platform persistence)
2. Optionally update Hermes native memory (local agent context)

## Plugin System

Hermes supports plugins in `plugins/` for memory providers, model backends, and context engines. An Open Brain plugin could provide native integration without per-skill tool registration.

## Multi-Agent

Hermes uses a Kanban board dispatcher for parallel subagents. Skills that use Claude's Agent/subagent pattern map to Hermes Kanban tasks.

## Multi-Platform Messaging

Gateway platforms: Telegram, Discord, Slack, WhatsApp, Signal, CLI. Skills can be invoked from any connected channel.
