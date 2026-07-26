# skill-translate

Convert Claude skills (SKILL.md format) into platform-native equivalents for ChatGPT, Gemini, Perplexity, and Hermes Agent.

## What It Does

Reads a Claude skill, analyzes its components (instructions, MCP dependencies, references, scripts), maps each to the target platform's constraints and format, and produces ready-to-deploy output for that platform.

## Supported Target Platforms

| Platform | Output Format | MCP Support | Char Limit |
|----------|--------------|-------------|------------|
| **ChatGPT** | Custom GPT (instructions + Actions + knowledge) | Yes (SSE/HTTP connectors) | 8,000 chars |
| **Gemini** | Gem instructions + GEMINI.md for CLI | Yes (CLI only, stdio/SSE) | ~2,000 (Gem) / unlimited (CLI) |
| **Perplexity** | Space instructions + knowledge files | No (server only) | ~1,500 chars |
| **Hermes Agent** | SKILL.md + tools/ registration | Yes (via tools registry) | Unlimited |

## Installation

### Claude.ai / Claude Desktop / Cowork
Upload `skill-translate.zip` via Settings > Customize > Skills

### Claude Code
```bash
cp -r skill-translate ~/.claude/skills/skill-translate
```

## Usage

```
/skill-translate /path/to/my-skill chatgpt
/skill-translate deep-save gemini
/skill-translate ~/.claude/skills/open-brain-sync all
```

Or natural language:
- "translate the deep-save skill for ChatGPT"
- "convert open-brain-sync to work in Hermes Agent"
- "make this skill work in Gemini"

## File Structure

```
skill-translate/
├── SKILL.md                              # Main skill instructions
├── README.md                             # This file
├── references/
│   ├── platform-matrix.md                # Full conversion rules per platform
│   └── hermes-agent-notes.md             # Hermes Agent architecture reference
├── scripts/                              # (empty)
├── assets/                               # (empty)
└── skill-translate.zip                   # Deployment archive
```

## Key Decisions

- **ChatGPT:** Prefer MCP connectors over Actions when the user has Pro/Plus (simpler setup, full tool access)
- **Gemini:** Always produce both Gem (consumer) and GEMINI.md (CLI) outputs
- **Perplexity:** Honest about limitations — if the skill needs MCP writes, document what's lost
- **Hermes:** Near 1:1 translation — focus on tool registration and memory integration

## Version History

- **1.0.0** (2026-06-09) — Initial release. Covers ChatGPT, Gemini, Perplexity, Hermes Agent.
