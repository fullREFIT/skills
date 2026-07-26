# github-repo-setup

**Repository-agnostic setup agent for any GitHub repository.**

Clone, inspect, install, configure, and smoke-test any GitHub repo on the current machine. Detects the repo's actual toolchain from its manifests rather than assuming. Uses version managers over global installs. Refuses to fabricate success when verification fails.

## What This Skill Does

Takes one input — a GitHub URL — and executes an 8-phase workflow:

1. **Phase 0** — Preflight: what's already installed on this machine
2. **Phase 1** — Reconnaissance: what does this repo actually need (the decision gate)
3. **Phase 2** — Install directory: safe clone or pull
4. **Phase 3** — Toolchain alignment: version managers honor repo pins
5. **Phase 4** — Dependency install: lockfile-driven package manager selection
6. **Phase 5** — Environment configuration: `.env` setup with stop-gate for missing secrets
7. **Phase 6** — Smoke test: minimum functional verification
8. **Phase 8** — Final report: structured audit output

(Phase 7 is a productionization *boundary* — the skill explicitly refuses to generate desktop shortcuts, `.bat` launchers, or systemd services unless asked.)

## Why This Skill Exists

Setup prompts typically fail in one of three ways:

1. They assume a toolchain (usually npm + pip) instead of reading what the repo actually uses
2. They confirm success without running a real verification
3. They generate productionization artifacts that collide with what the repo already provides

This skill solves all three by enforcing structured phase reports, a mandatory reconnaissance step before any install, and explicit boundaries on what it will and will not generate.

## Installation

### Claude.ai / Desktop / Cowork

1. Upload `github-repo-setup.zip` via Settings → Customize → Skills → "+" → "Create skill"
2. Toggle the skill on
3. Enable code execution in Settings → Capabilities (required for `detect-stack.sh`)
4. Trigger with any phrase from the MANDATORY TRIGGERS list (e.g., "set up this repo: https://github.com/...")

### Claude Code

```bash
# Personal install (all projects)
cp -r github-repo-setup/ ~/.claude/skills/github-repo-setup/

# Project-specific install
cp -r github-repo-setup/ .claude/skills/github-repo-setup/
```

No restart required. Skills are auto-detected.

### Other Platforms

See [agentskills.io](https://agentskills.io) for platform-specific install paths (Codex, VS Code, Cursor).

## Usage

Paste a GitHub URL with any trigger phrase:

```
Set up this repo: https://github.com/anthropics/anthropic-quickstarts
```

```
Clone and install https://github.com/vercel/next.js
```

```
Get this repo running: https://github.com/krishnakanthb13/antigravity_phone_chat
```

The skill will execute the 8 phases in order, stopping at the Phase 1 decision gate if the repo is ambiguously documented.

### Optional Overrides

- **Install directory:** tell the skill where to clone (default: `~/GitHub/<owner>/<repo>`)
- **Branch or tag:** specify a non-default branch
- **Skip phases:** rare — if you already ran preflight, say so

## File Layout

```
github-repo-setup/
├── SKILL.md                          The 8-phase workflow
├── README.md                         This file
├── references/
│   ├── phase-details.md              Expanded per-phase guidance
│   ├── troubleshooting.md            Failure mode recognition patterns
│   └── agent-operating-rules.md      The 8 rules with rationale
├── scripts/
│   └── detect-stack.sh               Phase 0 preflight (deterministic)
├── assets/
│   ├── recon-report-template.md      Phase 1 output template
│   └── final-report-template.md      Phase 8 output template
└── github-repo-setup.zip             Deployment artifact
```

## Prerequisites

- `git` available on PATH
- One or more of: `bash`, `zsh`, or PowerShell (for detect-stack.sh — PowerShell equivalent in troubleshooting reference)
- Optional but recommended: `gh` (GitHub CLI) for faster recon via API

Target environments:
- **Primary:** macOS arm64 with Homebrew, nvm, pyenv, 1Password CLI
- **Supported:** macOS Intel, Linux (Debian/Ubuntu/Fedora), Windows with WSL
- **Experimental:** Windows native PowerShell

## Known Limitations

1. **Repo-quality ceiling.** Badly-documented repos produce ambiguous Recon Reports. The skill stops rather than guesses. That's correct behavior but not magic — it won't rescue abandoned projects.
2. **Secrets are the user's job.** The skill templates `.env`, stops at unfilled values, and optionally integrates with 1Password CLI. It does not acquire credentials.
3. **Service dependencies stop the flow.** If a repo needs Postgres, Redis, or Kafka, the skill reports and stops. It will not auto-install databases. Run those separately.
4. **Cross-platform testing is incomplete.** The Windows branch is written from general knowledge and hasn't been extensively tested on native Windows (WSL works fine).
5. **Agent obedience matters.** The phase structure only works if the executing agent reads the SKILL.md fully before acting. Some agents skip ahead. When that happens, re-prompt with "re-read Phase 1 and stop at the decision gate."

## Version

v1.0 — April 2026

## License

MIT
