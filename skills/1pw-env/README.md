# 1pw-env Skill

Manage credentials across all projects using the 1Password environment variable system.

## What it does

Centralized credential management with 212+ credentials distributed from 1Password vault to Claude Code, MCP servers, AI agents, scripts, and workflows. Supports zero-disk secret injection via `op run`, credential syncing, service account setup, SSH agent integration, and troubleshooting auth failures.

## Installation

### Claude Code
```bash
cp -r 1pw-env ~/.claude/skills/
```

### Claude.ai / Claude Desktop
1. Extract `1pw-env.zip`
2. Settings → Customize → Skills → Upload
3. Select the `1pw-env` folder

### Cursor / VS Code / Codex
```bash
cp -r 1pw-env ~/.cursor/skills/
# or
cp -r 1pw-env ~/.copilot/skills/
```

## File Listing

| File | Purpose |
|------|---------|
| `SKILL.md` | Skill definition, core operations, two delivery patterns (op run and file sync), troubleshooting |
| `README.md` | This file. Installation and overview. |
| `references/quick-reference.md` | One-liners, command reference, rate limits |
| `references/master-guide.md` | Complete architecture, service accounts, SSH agent, SDKs, Environments, FAQ |
| `references/example-project-setups.md` | Node.js, Python, n8n, Docker, Next.js, CI/CD examples |
| `references/shell-plugins-guide.md` | Shell plugin setup, wrapper functions, biometric auth configuration |

## Prerequisites

- 1Password CLI installed: `brew install 1password-cli`
- 1Password desktop app (macOS, Windows, or Linux)
- CLI integration enabled in 1Password app settings
- A "Dev Credentials" vault with credentials stored as items (one per credential)

## Quick Start

Pattern A (preferred - zero disk):
```bash
op run --env-file ~/.env.1p.tpl -- node app.js
opr python main.py
op read "op://Dev Credentials/MY_API_KEY/credential"
```

Pattern B (fallback - file-based):
```bash
/update-pw
```

See `SKILL.md` for full documentation.
