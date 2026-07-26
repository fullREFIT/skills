---
name: skill-architect
description: "Comprehensive skill creation, improvement, and packaging following the agentskills.io open standard. Produces deployment-ready .zip files for upload to Claude.ai, Claude Desktop, Claude Code, Cowork, or any agentskills.io-compatible platform. Use when building new skills from scratch, auditing or improving existing skills, authoring SKILL.md files, configuring frontmatter, structuring bundled resources, or packaging skills for distribution. Handles the full lifecycle: intent capture, resource planning, SKILL.md authoring, validation, packaging, and iteration. MANDATORY TRIGGERS: skill creation, SKILL.md, skill improvement, skill audit, frontmatter, skill packaging, agentskills.io, progressive disclosure, skill validation, skill architecture, bundled resources, create a skill, build a skill, package a skill, new skill, update skill, improve skill."
license: MIT
---

# Skill Architect

Create, audit, improve, and package agent skills following the [Agent Skills](https://agentskills.io) open standard. Every skill produced must include a deployment-ready .zip file.

**Read [`references/detail.md`](references/detail.md) before executing.** It contains the full platform compatibility matrix, step-by-step creation procedures, frontmatter field reference, quality checklist, packaging commands, and troubleshooting guide.

---

## Triggers

Activate when the user asks to: create a skill, build a skill, package a skill, improve or audit an existing skill, write a SKILL.md, configure frontmatter, structure bundled resources, or distribute a skill.

---

## Mandatory Output Structure

Every skill produced must include:

```
skill-name/
├── SKILL.md              (required)
├── README.md             (required)
├── references/           (required, even if empty)
├── scripts/              (required, even if empty)
├── assets/               (required, even if empty)
└── skill-name.zip        (required — always, no exceptions)
```

### .zip Packaging Rule

```
skill-name.zip
└── skill-name/
    ├── SKILL.md
    ├── README.md
    ├── references/
    ├── scripts/
    └── assets/
```

No `.DS_Store`, `__pycache__`, `.git`, or the .zip itself inside the archive. Always nest inside the skill-name folder — never loose files at root.

**The .zip must be produced on every skill creation or update. No exceptions.**

---

## Input

- User description of the skill's purpose, or an existing skill folder to audit/improve
- Optional: example invocations, desired trigger phrases, target platform(s)

## Output

- `skill-name/SKILL.md` — frontmatter + instructions
- `skill-name/README.md` — installation and usage
- `skill-name/references/` — supporting documentation
- `skill-name/scripts/` — executable code (if needed)
- `skill-name/assets/` — templates and output files (if needed)
- `skill-name/skill-name.zip` — deployment-ready archive

---

## Creation Process (Summary)

1. **Capture intent** — gather concrete examples of how the skill will be used
2. **Plan resources** — identify what belongs in scripts/, references/, assets/
3. **Initialize directory** — `mkdir -p skill-name/{references,scripts,assets}`
4. **Write description** — most critical field; must include `MANDATORY TRIGGERS:` list; max 1024 chars; third person; slightly "pushy"
5. **Write SKILL.md body** — imperative form; point to reference files, don't duplicate them; under 500 lines
6. **Implement bundled resources** — scripts with error handling and execute permissions, references under 10K tokens each
7. **Write README.md** — installation instructions + file listing
8. **Validate and package** — run `scripts/package_skill.py` or manual checklist, then zip
9. **Iterate** — fix skill when Claude struggles; do not fix the prompt

Full procedures for each step: [`references/detail.md`](references/detail.md).

---

## Progressive Disclosure Architecture

| Tier | Budget | When Loaded |
|------|--------|-------------|
| Metadata (name + description) | ~100 tokens | Always — for skill discovery |
| SKILL.md body | <5,000 tokens | When skill triggers |
| Bundled resources | Unlimited | On demand — agent reads as needed |

Scripts execute without loading into context (zero token cost). Only script output consumes tokens.

---

## Bundled Resources Quick Reference

| Directory | Purpose | Key Rule |
|-----------|---------|----------|
| `scripts/` | Deterministic, repeatable code | `chmod +x`; include error handling |
| `references/` | Docs loaded into context on demand | Under 10K tokens per file |
| `assets/` | Templates and output files | Not read for reasoning — copied into output |

Do not include: standard library docs, credentials, generated/cached files, large datasets, hidden OS files.

---

## Reference Files

| File | Purpose |
|------|---------|
| [`references/detail.md`](references/detail.md) | Platform matrix, full creation steps, frontmatter reference, quality checklist, packaging commands, troubleshooting |
| [`references/example-patterns.md`](references/example-patterns.md) | Complete examples of each skill type |
| [`references/workflows.md`](references/workflows.md) | Sequential, conditional, and feedback loop patterns |
| [`references/output-patterns.md`](references/output-patterns.md) | Templates, structured data, quality standards |
| [`references/advanced-patterns.md`](references/advanced-patterns.md) | Multi-model optimization, MCP integration, enterprise deployment |
| [`references/security.md`](references/security.md) | Security audit checklist, credential management |
| [`references/troubleshooting.md`](references/troubleshooting.md) | Debugging strategies and common issue resolution |
| [`references/multi-agent-patterns.md`](references/multi-agent-patterns.md) | Sub-agent orchestration, parallel execution |
| [`references/skill-improvement-methodology.md`](references/skill-improvement-methodology.md) | Systematic audit and improvement process |

---

*Skill Architect v3.0 — April 2026 | agentskills.io open standard*
