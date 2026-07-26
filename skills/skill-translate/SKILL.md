---
name: skill-translate
description: "Port a skill from one AI coding or chat platform to another. First checks whether translation is needed at all: Claude Code, Codex CLI, Cursor, and other Agent Skills-standard tools take the same SKILL.md unchanged, so those are installs, not conversions — copy the folder and validate. Genuine translation applies only to platforms with proprietary formats: ChatGPT Custom GPTs plus Actions, Gemini Gems and GEMINI.md, Perplexity Spaces, Hermes Agent. Maps each component to the target's character limits, MCP support, and file format. MANDATORY TRIGGERS: skill translate, convert skill, port skill, install this skill everywhere, install skill in codex, install skill in cursor, sync my skills across tools, does this skill work in cursor, skill for chatgpt, skill for gemini, skill for perplexity, skill for hermes, translate to chatgpt, translate to gemini, cross-platform skill, make this work in chatgpt."
metadata:
  version: "2.0.0"
  argument-hint: "<source skill path or name> [target: claude-code | codex | cursor | native-all | chatgpt | gemini | perplexity | hermes | all]"
  user-invocable: "true"
---

# Skill Translate — Cross-Platform Skill Porting

Gets a skill running on a platform other than the one it was written for. That means one of two very different jobs, and picking the wrong one wastes the whole run — so Step 0 exists to decide which.

Read [`references/platform-matrix.md`](references/platform-matrix.md) for the full compatibility matrix and per-platform conversion rules.

## Required Input

1. **Source skill** — path to a skill directory or SKILL.md file
2. **Target** — one of: `claude-code`, `codex`, `cursor`, `native-all`, `chatgpt`, `gemini`, `perplexity`, `hermes`, or `all`

If no target is specified, ask which tier the user means rather than guessing — "install everywhere I code" and "make this work in ChatGPT" are different jobs with different costs.

---

## Step 0 — Decide whether this is an install or a translation

**Do this first, every time.** Agent Skills is an open standard (agentskills.io), and as of mid-2026 it is read natively by a large and growing set of tools. For those, the skill is already in the right format — copying the folder *is* the port. Translating it would be work that degrades a working artifact.

**Tier 1 — native standard. Install, do not translate.** These read SKILL.md with `name` + `description` frontmatter unchanged:

| Platform | Personal skills dir | Project dir |
|---|---|---|
| Claude Code | `~/.claude/skills/<name>/` | `<project>/.claude/skills/<name>/` |
| Codex CLI | `~/.codex/skills/<name>/` | `<project>/.codex/skills/<name>/` |
| Cursor | `~/.cursor/skills/<name>/` (also `~/.agents/skills/`) | `.cursor/skills/` or `.agents/skills/` |

*Verified July 2026 against the agentskills.io specification and Cursor's skills docs. Cursor additionally reads `.claude/skills/` and `.codex/skills/` as legacy paths. Tool support moves fast — check the target's current docs before asserting a path that is not in this table.*

For Tier 1, run the bundled installer and stop:

```bash
scripts/install_skill.sh <path-to-skill-dir> [claude|codex|cursor|all]
```

It copies the skill folder, strips packaging cruft (`.zip`, `.skill`, `.DS_Store`, `__pycache__`), fixes script permissions, and validates that `name` matches the parent directory — the single most common reason a correctly-written skill silently fails to load.

**Tier 2 — proprietary format. Translate.** ChatGPT (Custom GPTs + Actions), Gemini (Gems, GEMINI.md), Perplexity (Spaces), Hermes Agent. These have their own configuration surfaces and hard character limits. Continue to Step 1.

**Mixed request** ("get this everywhere"): install Tier 1 first, report it, then translate for Tier 2. Never make the user wait on a lossy conversion to find out the lossless copy already worked.

---

## Step 1 — Read and Analyze the Source Skill

Read the source SKILL.md and all files in references/, scripts/, and assets/. Identify:

- **Core instructions** — the behavioral logic in the SKILL.md body
- **MCP dependencies** — which MCP tools the skill calls (search_thoughts, save_thought, etc.)
- **Bundled resources** — reference docs, scripts, templates
- **Triggers** — the MANDATORY TRIGGERS list from the description
- **Character budget** — total token count of the skill body + references

## Step 2 — Assess Platform Compatibility

For each target platform, check the compatibility matrix in [`references/platform-matrix.md`](references/platform-matrix.md):

| Component | ChatGPT | Gemini | Perplexity | Hermes Agent |
|-----------|---------|--------|------------|--------------|
| Persistent instructions | Yes (8K chars) | Yes (Gems ~2K, API unlimited) | Yes (Spaces, ~2K) | Yes (SKILL.md, unlimited) |
| MCP client support | Yes (SSE/HTTP) | Yes (stdio/SSE via CLI) | No (server only) | Yes (via tools/) |
| File uploads | Yes (20 files) | Yes (Gems knowledge) | Yes (Spaces files) | Yes (references/) |
| Script execution | Via Actions (API) | Via API function calling | No | Yes (native Python) |
| Structured output | JSON mode | JSON mode | No | Yes |

## Step 3 — Convert

For each target platform, follow the conversion procedure in [`references/platform-matrix.md`](references/platform-matrix.md). The output for each platform is different:

### ChatGPT → Custom GPT Configuration
- **Instructions block** (max 8,000 chars) — compressed skill body
- **Knowledge files** — references/ docs uploaded as files
- **Actions** (if MCP tools needed) — OpenAPI 3.0 spec pointing to Open Brain REST API
- Paste-ready text for the GPT Builder UI

### Gemini → Gem + optional GEMINI.md
- **Gem instructions** (target ~2,000 chars) — compressed skill body
- **GEMINI.md** (for Gemini CLI) — full skill body as markdown
- **MCP config snippet** — for `~/.gemini/settings.json` if MCP tools needed

### Perplexity → Space Configuration
- **Space instructions** (target ~1,500 chars) — heavily compressed, search-oriented
- **Knowledge files** — references/ docs uploaded to Space
- **MCP workaround** — instructions to use Perplexity as a research tool called FROM the skill, not as the skill host

### Hermes Agent → SKILL.md + tools/
- **SKILL.md** — near-identical to Claude format (Hermes uses agentskills.io standard)
- **Hermes-specific frontmatter** — add `platforms`, `metadata.hermes.tags`, `metadata.hermes.related_skills`
- **tools/ integration** — map MCP tool calls to Hermes tool registry entries
- **Memory integration** — map Open Brain writes to Hermes memory system if applicable

## Step 4 — MCP Dependency Resolution

When the source skill depends on MCP tools (like Open Brain), handle per platform:

| Platform | MCP Available? | Resolution |
|----------|---------------|------------|
| ChatGPT | Yes (SSE/HTTP) | Point to Open Brain MCP SSE endpoint. User must enable in Settings > Connectors |
| Gemini CLI | Yes (stdio/SSE) | Add MCP config to `~/.gemini/settings.json` |
| Gemini Gems | No | Provide manual instructions: "search Open Brain for X before proceeding" or use API function calling |
| Perplexity | No (client) | Cannot connect. Instruct user to run the skill on a MCP-capable surface and use Perplexity only for web research |
| Hermes | Yes (tools/) | Register Open Brain as a tool in Hermes tool registry |

## Step 5 — Produce Output

For each target platform, produce:

1. **The converted artifact** — ready to paste or deploy
2. **Installation instructions** — exact steps to install on that platform
3. **Capability delta** — what the original skill does that the converted version cannot do (honest assessment)
4. **MCP setup instructions** — if the skill uses MCP tools, how to connect them on that platform

Format the output with clear section headers per platform. If producing `all`, use a separator between platforms.

## Step 6 — Compression Strategy (when hitting character limits)

When the source skill exceeds the target platform's character limit:

1. **Cut references first** — move them to uploaded knowledge files instead of inlining
2. **Collapse tables into prose** — tables are token-expensive
3. **Remove examples** — keep the rules, cut the examples
4. **Merge similar steps** — combine steps that share logic
5. **Use imperative shorthand** — "Save decisions with permanent:true" not "For each qualifying decision, call save_thought with the permanent parameter set to true"
6. **Never cut the triage logic** — the classification rules are the skill's core value

If still over limit after all compression, split into a primary instruction block + a knowledge file that the model retrieves on demand.

## Edge Cases

**Skill has no MCP dependencies:** Straightforward text conversion. Most skills translate cleanly.

**Skill relies on bash/filesystem:** ChatGPT Actions can proxy some operations. Gemini CLI has full bash. Perplexity cannot. Hermes has native Python. Document what's lost.

**Skill uses Claude-specific features (subagents, worktrees, hooks):** These have no equivalent on other platforms. Document as capability delta, don't try to fake them.

**User wants a single "universal" version:** Partly possible now, and the answer differs by tier. Across Tier 1 the *same* SKILL.md folder is the universal version — one source of truth, copied to each skills directory, no per-platform variant to maintain. Across Tier 2 it remains impossible; the character limits and configuration surfaces are too different, so produce platform-specific outputs there. Say which half of the answer applies rather than giving a flat no.

**Target is a tool not in the matrix:** Check its docs for Agent Skills support before assuming translation is needed. The standard's adoption is still expanding, and the default assumption in this skill's v1.0 — that everything outside Claude needs conversion — is now wrong more often than it is right.

**Skill uses a bundled script:** Tier 1 carries it intact. Confirm the target runtime has the interpreter (Cursor and Codex both shell out; check Python availability rather than assuming), and preserve the execute bit — the installer does this, a manual `cp` often does not.

---
*Skill Translate v2.0 — July 2026*
*Tier 1, install unchanged: Claude Code, Codex CLI, Cursor (Agent Skills open standard, agentskills.io)*
*Tier 2, translate: ChatGPT (Custom GPTs + Actions), Gemini (Gems + CLI + API), Perplexity (Spaces), Hermes Agent*
