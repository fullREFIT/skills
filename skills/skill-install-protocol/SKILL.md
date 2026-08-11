---
name: skill-install-protocol
description: "Install, distribute, and verify an existing agent skill from one canonical source across the client environments that are already present. Use when fanning out a skill, installing a skill from a repository, rebuilding client copies, checking ZIP parity, or verifying a skill installation. MANDATORY TRIGGERS: install skill, distribute skill, fan out skill, copy skill, skill parity, skill ZIP, install protocol, client skills."
license: "MIT"
compatibility: "Portable Agent Skills format. Requires a local filesystem and shell access for copy and verification steps."
---

# Skill Install Protocol

Install from one canonical source. Client copies are disposable distributions, never independent authorities.

## Step 0: Select the workflow

Choose one path before touching folders:

- Use a skill-authoring or packaging skill when converting an idea, transcript, or document into a new skill.
- Use a source-inspection and customization workflow when importing an existing or untrusted skill that needs adaptation.
- Use this protocol directly when the skill is already complete and only needs distribution and parity verification.

Do not duplicate work owned by another active workflow.

## Step 1: Establish the canonical source

Record the absolute canonical collection path and the skill slug. Confirm the canonical folder exists and contains `SKILL.md`. Inspect any bundled references, scripts, assets, license files, and existing archive.

The canonical source must also contain an upload-ready archive alongside the skill folder. If the archive is missing or stale, rebuild it before installing anywhere else.

Do not modify a client copy directly.

## Step 2: Discover installed clients

Check whether each client root exists before writing to it. Do not create a client root merely because a conventional path is known.

Typical roots include:

| Client | Personal root | Project root |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex | `~/.codex/skills/` | `.codex/skills/` |
| Hermes | `~/.hermes/skills/` | project-specific configured root |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |
| Antigravity | `~/.antigravity/skills/` | project-specific configured root |

Also check any explicitly named profile or optional-skills roots. Treat each existing root as a separate destination and record skipped roots with the reason they do not exist.

For desktop or web clients without a filesystem skill root, use the canonical archive through the platform's supported upload flow. Do not claim installation until the platform reports success or a fresh session discovers the skill.

## Step 3: Copy to existing destinations

For every existing destination:

1. Confirm the destination root is the intended client root.
2. Record whether the same skill slug already exists.
3. Copy the canonical folder as a complete unit.
4. Preserve file permissions where relevant.
5. Do not copy credentials, local configuration, caches, or generated artifacts that are excluded from the canonical package.

An existing same-named skill is overwritten only when the request authorizes replacement. Otherwise stop that destination and report the conflict.

## Step 4: Verify parity

Count files in the canonical folder and each destination folder. Compare relative paths and file hashes, not only directory counts. A mismatch is a failed copy. Re-copy the complete folder and verify again.

Verify the archive independently:

- one top-level skill folder
- `SKILL.md` present
- no nested archive
- no hidden OS files
- no cache directories
- no credentials

For new or substantially customized skills, run at least one positive trigger test and one negative-trigger test in a fresh client session. Routine unchanged fan-out can use structural parity only.

## Step 5: Reload and report

Reload the client when its runtime requires it. Otherwise use a fresh session or window. Report in one pass:

- canonical folder and archive path
- destinations installed successfully
- destinations skipped and why
- same-name destinations overwritten
- file and hash parity results
- behavioral tests run and outcomes
- anything that remains unverified

## Wrong output

- Copying from one client installation to another
- Creating missing client roots and calling that proof the client is installed
- Reporting file-count parity without comparing file paths or hashes
- Claiming desktop installation from the existence of a local ZIP
- Modifying a client copy instead of the canonical source
- Treating a failed or partial copy as acceptable
- Overwriting a same-named skill without recording it
- Claiming behavioral readiness without a fresh-session trigger test when the skill is new or customized

## Reference

Read `references/verification-matrix.md` when recording multiple client destinations or designing a parity report.
