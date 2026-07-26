# Skill Architect — Detail Reference

Full procedures, platform matrix, and packaging steps. Read before executing any skill creation or packaging task.

---

## Platform Feature Matrix

| Feature | Claude.ai / Desktop / Cowork | Claude Code | Claude API | Cursor / VS Code / Codex |
|---------|------------------------------|-------------|------------|--------------------------|
| SKILL.md format | Yes | Yes | Yes | Yes |
| Upload method | Settings → Customize → Skills → Upload .zip | `~/.claude/skills/` or `.claude/skills/` | `/v1/skills` endpoint | Platform-specific paths |
| Slash commands (`/name`) | Yes | Yes | N/A | Varies |
| Auto-triggering by description | Yes | Yes | Yes | Varies |
| `scripts/` execution | Yes (VM environment) | Yes (direct bash) | Yes (Code Execution Tool) | Varies |
| `references/` loading | Yes | Yes | Yes | Yes |
| `assets/` usage | Yes | Yes | Yes | Yes |
| `argument-hint` | Ignored | Active | Ignored | Ignored |
| `user-invocable` | Ignored | Active | Ignored | Ignored |
| `allowed-tools` | Ignored | Active | Ignored | Ignored |
| `model` selection | Ignored | Active | Ignored | Ignored |
| `context: fork` (subagents) | Ignored | Active | Ignored | Ignored |
| `hooks` (lifecycle) | Ignored | Active | Ignored | Ignored |
| `disable-model-invocation` | Ignored | Active | Ignored | Ignored |

**Design principle:** Build skills using the universal fields (`name`, `description`, body, bundled resources). Add Claude Code-specific fields only when needed, and document them as platform-specific in comments.

### Installation Paths

| Platform | Personal Skills | Project Skills |
|----------|-----------------|----------------|
| Claude.ai / Desktop / Cowork | Settings → Customize → Skills → Upload .zip | N/A (use Projects) |
| Claude Code | `~/.claude/skills/<skill-name>/` | `.claude/skills/<skill-name>/` |
| OpenAI Codex | `~/.codex/skills/` | `.codex/skills/` |
| VS Code / Copilot | `~/.copilot/skills/` | `.github/skills/` |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |

### Claude.ai Upload Requirements

- The .zip must contain the skill folder as the top-level item (not loose files at root)
- Structure: `my-skill.zip → my-skill/ → SKILL.md, references/, scripts/, assets/`
- Claude Code-specific frontmatter fields are silently ignored (not rejected)
- Code execution must be enabled in Settings → Capabilities for scripts to run
- Skills are private to the uploading user unless shared (Team/Enterprise)

---

## Skill Creation Process (Full)

### Step 1: Capture Intent with Concrete Examples

Gather concrete examples before writing anything:
- "What functionality should this skill support?"
- "Give examples of how this skill would be used — what would someone type?"
- "What should trigger this skill? What should NOT trigger it?"
- "What edge cases or unusual scenarios exist?"
- "What does a good output look like? What does a bad output look like?"

Conclude when there is a clear understanding of the skill's functionality, trigger conditions, and expected outputs.

### Step 2: Plan Reusable Resources

Analyze each example to identify what should be bundled:

| If you find... | Create... | Example |
|----------------|-----------|---------|
| Same code rewritten each time | `scripts/` file | `scripts/rotate_pdf.py` |
| Same boilerplate copied each time | `assets/` template | `assets/hello-world/` |
| Schema/API rediscovered each time | `references/` doc | `references/schema.md` |
| Complex multi-step procedure | Body workflow in SKILL.md | Sequential steps with validation gates |

### Step 3: Initialize the Skill Directory

```bash
mkdir -p skill-name/{references,scripts,assets}
```

Or use the initialization script if available:

```bash
python scripts/init_skill.py <skill-name> --path <output-directory>
```

### Step 4: Write the Description (CRITICAL)

The `description` frontmatter field determines when the agent activates the skill. The agent only sees the description until the skill triggers.

**Requirements:**
- Include BOTH what the skill does AND when to use it
- All trigger conditions go in the description, not the body
- Write in third person: "This skill provides..." not "Use this skill when..."
- Maximum 1024 characters
- Include a `MANDATORY TRIGGERS:` keyword list at the end
- Be slightly "pushy" — undertriggering is more common than overtriggering

**Good example:**
```yaml
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, and formatting preservation. This skill should be used when working with .docx files for creating, modifying, or analyzing documents. Also use for reports, memos, letters, or any formatted document output. MANDATORY TRIGGERS: Word, document, .docx, report, letter, memo, tracked changes, comments."
```

### Step 5: Write the SKILL.md Body

The skill is written for another agent instance to use. Include non-obvious, non-standard knowledge only.

**Writing style:** Use imperative/infinitive form (verb-first), not second person:
- Good: "To accomplish X, do Y" / "Read the schema before querying"
- Bad: "You should do X" / "If you need to do X"

**Body content checklist:**
1. Purpose statement (2-3 sentences)
2. Table of contents (if body exceeds 100 lines)
3. Practical usage instructions (the core workflow)
4. References to ALL bundled resources with explicit read instructions
5. Examples for complex workflows
6. No duplication with reference files — SKILL.md points to them, doesn't repeat them

**Token budget:** Keep SKILL.md body under 500 lines / ~5,000 tokens. Move detail to reference files.

### Step 6: Implement Bundled Resources

- `scripts/` — Write, test, and set execute permissions (`chmod +x`). Include error handling.
- `references/` — Keep individual files under 10K tokens. Include grep patterns in SKILL.md for files exceeding 10K words.
- `assets/` — Separate output resources from documentation. Include templates, starter code, images.

### Step 7: Write README.md

Every skill includes a README.md with:
- One-line description
- What the skill does (brief)
- Installation instructions for each target platform
- File listing with purpose of each file
- Prerequisites (if any)

### Step 8: Validate and Package

Run validation:

```bash
python scripts/package_skill.py <path/to/skill-folder>
```

The script validates:
- YAML frontmatter format and required fields
- Naming conventions and directory structure
- Description completeness
- File organization

If `package_skill.py` is not available, validate manually against the Quality Checklist, then create the .zip:

```bash
cd /path/to/parent/
zip -r skill-name/skill-name.zip skill-name/ -x "*.DS_Store" -x "*__pycache__*" -x "*.git*" -x "*.zip"
```

**The .zip must be produced. Every time. No exceptions.**

### Step 9: Iterate

1. Use the skill on real tasks
2. Observe struggles, inefficiencies, or misunderstandings
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes, re-validate, re-package
5. Repeat

**Key insight:** If Claude consistently misunderstands or struggles with the skill, the skill needs improvement — not more explanation to Claude. Fix the skill, not the prompt.

---

## SKILL.md Configuration — Full Reference

### YAML Frontmatter Template

```yaml
---
name: my-skill
description: "What this skill does and when to use it. Max 1024 chars. Third person."
license: "MIT"
# Claude Code-specific fields (ignored on other platforms):
# argument-hint: [filename] [format]
# user-invocable: true
# allowed-tools: Read, Grep, Glob
# model: sonnet
# context: fork
# agent: Explore
---
```

### Required Fields

| Field | Constraints | Description |
|-------|-------------|-------------|
| `name` | 1-64 chars, lowercase, hyphens, numbers only | Must match directory name. No reserved words ("anthropic", "claude", "ai"). No consecutive hyphens. |
| `description` | 1-1024 chars, third person | What the skill does AND when to trigger. Include `MANDATORY TRIGGERS:` list. |

### Standard Optional Fields (All Platforms)

| Field | Description |
|-------|-------------|
| `license` | SPDX identifier (e.g., "MIT", "Apache-2.0", "Proprietary") |
| `compatibility` | Up to 500 chars — version requirements or platform notes |
| `metadata` | Custom key-value pairs for organizational use |

### Claude Code-Specific Fields

| Field | Default | Description |
|-------|---------|-------------|
| `argument-hint` | — | Autocomplete hint. Example: `[issue-number]` |
| `disable-model-invocation` | `false` | `true` = user must invoke via `/name`; agent cannot auto-trigger |
| `user-invocable` | `true` | `false` = hidden from `/` menu; only agent can invoke |
| `allowed-tools` | — | Tools usable without permission prompts when skill is active |
| `model` | `inherit` | Model override: `sonnet`, `opus`, `haiku`, or `inherit` |
| `context` | — | `fork` = run in isolated subagent context |
| `agent` | — | Subagent type: `Explore`, `Plan`, `general-purpose`, or custom name |
| `hooks` | — | Lifecycle hooks: `PreToolUse`, `PostToolUse`, `Stop` |

### String Substitutions (Claude Code)

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | Arguments passed when invoking via slash command |
| `${CLAUDE_SESSION_ID}` | Current session ID for logging/correlation |

### Dynamic Context Injection (Claude Code)

The `` !`command` `` syntax executes shell commands during preprocessing:

```markdown
Current git branch: !`git branch --show-current`
```

The agent receives only the command output, not the command itself.

---

## Quality Checklist

### Frontmatter
- [ ] `name` follows convention (lowercase, hyphens, max 64 chars, matches directory)
- [ ] `description` includes what it does AND when to trigger (max 1024 chars)
- [ ] Description written in third person
- [ ] Description includes `MANDATORY TRIGGERS:` keyword list
- [ ] No reserved words in name ("anthropic", "claude", "ai")
- [ ] Claude Code-specific fields commented or documented as platform-specific

### Body Content
- [ ] Under 500 lines
- [ ] Uses imperative/infinitive form (not second person)
- [ ] Table of contents included if body exceeds 100 lines
- [ ] References ALL bundled resources with explicit read instructions
- [ ] No duplication between SKILL.md body and reference files
- [ ] Examples provided for complex workflows

### Bundled Resources
- [ ] `references/` directory exists (even if empty for simple skills)
- [ ] `scripts/` directory exists (even if empty)
- [ ] `assets/` directory exists (even if empty)
- [ ] Scripts tested, working, with error handling
- [ ] Scripts have execute permissions (`chmod +x`)
- [ ] Reference files each under 10K tokens
- [ ] Large files (>10K words) have grep patterns in SKILL.md
- [ ] Assets separated from documentation
- [ ] No `.DS_Store`, `__pycache__`, `.git` artifacts

### Package
- [ ] README.md present with installation instructions
- [ ] .zip file created with skill folder as top-level directory
- [ ] .zip does not contain the .zip itself or hidden files
- [ ] .zip structure: `skill-name.zip → skill-name/ → SKILL.md, ...`

### Progressive Disclosure
- [ ] Essential info in SKILL.md, detail in references
- [ ] One level of nesting maximum
- [ ] Body under ~5,000 tokens

### Cross-Platform
- [ ] Forward slashes for all paths
- [ ] No platform-specific assumptions unless documented
- [ ] Tested on target platform(s)

---

## Packaging and Distribution

### For Claude.ai / Desktop / Cowork Upload

1. Validate against Quality Checklist
2. Create .zip with skill folder as top-level directory
3. Navigate to Settings → Customize → Skills → "+" → "Create skill" → Upload .zip
4. Toggle the skill on
5. Test with a prompt that should trigger it

Code execution must be enabled (Settings → Capabilities) for `scripts/` to run.

### For Claude Code Installation

```bash
# Personal (all projects)
cp -r skill-name/ ~/.claude/skills/skill-name/

# Project-specific
cp -r skill-name/ .claude/skills/skill-name/
```

Skills are detected automatically. No restart needed.

### For API Distribution

Upload via the `/v1/skills` endpoint. See [Agent Skills API docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) for details.

---

## Troubleshooting

- **Skill not triggering** → Description missing trigger keywords or too vague; add `MANDATORY TRIGGERS:` list. Make description "pushier."
- **Reference files not read** → SKILL.md doesn't explicitly link to them; add `Read [file](file)` instructions
- **Scripts not executing** → Missing execute permissions (`chmod +x`) or code execution disabled in Claude.ai settings
- **Upload rejected** → .zip structure wrong (files at root instead of nested in skill folder), or reserved word in `name` field
- **Inconsistent output** → Add strict templates, validation steps, and anti-examples
- **Claude Code-specific features not working on Claude.ai** → Expected. Fields like `hooks`, `context: fork`, `allowed-tools` are Claude Code-only. They are silently ignored elsewhere.

For deeper debugging strategies, read [`troubleshooting.md`](troubleshooting.md).

---

*Skill Architect v3.0 — April 2026*
*Conformant to agentskills.io open standard (December 2025)*
