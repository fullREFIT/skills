# Platform Conversion Matrix

Detailed conversion rules and format specifications for each target platform.

---

## ChatGPT — Custom GPT Format

### Target Format
ChatGPT uses Custom GPTs configured via the GPT Builder UI. No file-based system.

### Fields to Produce

| Field | Limit | Maps to |
|-------|-------|---------|
| **Name** | 50 chars | Skill `name` field |
| **Description** | 300 chars | First sentence of skill `description` |
| **Instructions** | 8,000 chars | Compressed SKILL.md body |
| **Conversation Starters** | 4 items, ~50 chars each | Derived from MANDATORY TRIGGERS |
| **Knowledge Files** | 20 files max | references/ directory contents |
| **Actions** | OpenAPI 3.0 spec | MCP tool calls translated to REST endpoints |

### Instructions Compression Rules

The 8,000 char limit requires aggressive compression from typical Claude skills (which can be 10,000+ chars):

1. Remove all markdown formatting beyond basic structure (no tables, no code fences for non-code)
2. Convert tables to numbered lists
3. Remove "When to Use" sections (the GPT's description handles triggering)
4. Remove "Required Capabilities" sections (GPT handles this implicitly)
5. Collapse multi-line examples into single-line
6. Use abbreviated natural language: "Save decisions as permanent. Save observations with 120-day stale_after."
7. Keep the classification logic — that's the core value

### Actions (for MCP-dependent skills)

When the source skill calls MCP tools, produce an OpenAPI 3.0 spec that maps to the Open Brain REST API:

```yaml
openapi: 3.0.0
info:
  title: Open Brain API
  version: 1.0.0
servers:
  - url: https://skwcqvtpiarpzqcmdvko.supabase.co/functions/v1/open-brain-rest
paths:
  /search:
    post:
      operationId: searchThoughts
      description: Search Open Brain by meaning
      x-openai-isConsequential: false
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                query: { type: string }
                limit: { type: integer, default: 10 }
              required: [query]
  /save:
    post:
      operationId: saveThought
      description: Save a thought to Open Brain
      x-openai-isConsequential: true
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                content: { type: string }
                type: { type: string }
                permanent: { type: boolean }
                stale_after: { type: string }
              required: [content]
```

**Auth:** Bearer token in Actions configuration (use MCP_ACCESS_KEY).

### MCP Native (Alternative to Actions)

ChatGPT supports MCP natively (SSE/HTTP transport). If the user prefers MCP over Actions:
- Settings > Connectors > Add Connector > MCP
- URL: `https://skwcqvtpiarpzqcmdvko.supabase.co/functions/v1/open-brain-mcp/sse`
- This gives ChatGPT direct access to all 25 Open Brain MCP tools
- Simpler than building Actions, but requires ChatGPT Pro/Plus

### Installation Instructions (ChatGPT)

1. Go to chatgpt.com > Explore GPTs > Create
2. Paste the Instructions block into the Instructions field
3. Upload reference files as Knowledge
4. If MCP: Settings > Connectors > Add MCP connector with Open Brain SSE URL
5. If Actions: Paste the OpenAPI spec into Actions > Create new action
6. Set 4 Conversation Starters from the trigger list
7. Save and publish (private or link-shared)

---

## Gemini — Gem + GEMINI.md

### Target Formats (two outputs)

**Gem** (consumer UI at gemini.google.com):
- Instructions field: ~2,000 chars recommended
- Knowledge files: upload references
- No MCP access from Gems UI

**GEMINI.md** (Gemini CLI, for developers):
- Markdown file at project root
- No character limit (bounded by context window)
- Full MCP support via `~/.gemini/settings.json`

### Gem Instructions Compression Rules

The ~2,000 char target requires heavy compression:

1. Reduce to the essential behavioral rules only
2. No examples, no tables, no formatting
3. Use imperative sentences: "Classify items. Permanent: decisions, rules, person notes. Long-lived (120d): observations, references. Short-lived (30d): session context."
4. Reference uploaded knowledge files: "See the attached permanence-tiers.md for classification details."
5. Include the MCP workaround if needed: "When you need to search or save to Open Brain, ask me to provide the information or switch to Gemini CLI."

### GEMINI.md Format

```markdown
# [Skill Name]

[Full skill body — can be nearly identical to Claude SKILL.md body]
[Remove Claude-specific references like "Call mcp__open-brain__save_thought"]
[Replace with generic: "Use the save_thought tool" or "Call Open Brain MCP save_thought"]
```

### MCP Configuration (Gemini CLI)

Add to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "open-brain": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://skwcqvtpiarpzqcmdvko.supabase.co/functions/v1/open-brain-mcp/sse"],
      "env": {}
    }
  }
}
```

### Installation Instructions (Gemini)

**Gem:**
1. Go to gemini.google.com > My Gems > New Gem
2. Set Name and paste compressed instructions
3. Upload reference files as knowledge
4. Save

**GEMINI.md (CLI):**
1. Place GEMINI.md at project root
2. Configure MCP in ~/.gemini/settings.json
3. Run `gemini` from that directory

---

## Perplexity — Space Configuration

### Critical Limitation

Perplexity is an MCP server, NOT an MCP client. You cannot connect external tools (like Open Brain) to Perplexity. Skills that depend on MCP tool calls cannot fully run on Perplexity.

### What CAN Be Done

Use Perplexity Spaces as a research-augmented instruction set. The skill becomes a behavioral guide for how Perplexity should search and structure results.

### Target Format

| Field | Limit | Source |
|-------|-------|--------|
| **Space name** | Short | Skill name |
| **Space description** | ~200 chars | First sentence of description |
| **Custom instructions** | ~1,500 chars | Heavily compressed skill body (research-relevant parts only) |
| **Knowledge files** | Upload | references/ directory |
| **Focus mode** | Academic/Web/All | Based on skill domain |

### Compression Strategy (Perplexity-specific)

Since Perplexity cannot execute MCP tools, strip ALL tool-calling instructions and convert to search-oriented behavior:

- Remove: `save_thought`, `create_task`, `link_thoughts`, `update_thought` calls
- Keep: Classification logic, quality criteria, triage rules
- Reframe: "Find and organize information following these rules..." instead of "Save to Open Brain..."
- Add: "Present findings in structured format ready for the user to paste into their knowledge system"

### MCP Workaround

For skills that need Open Brain data:
```
When the user needs information from Open Brain, suggest they:
1. Run the search on a MCP-connected surface (Claude Desktop, Claude Code)
2. Paste relevant results into this Perplexity conversation
3. Continue research here with that context
```

### Installation Instructions (Perplexity)

1. Go to perplexity.ai > Spaces > Create Space
2. Set name and description
3. Paste compressed instructions into Custom Instructions
4. Upload reference files
5. Set appropriate Focus mode

---

## Hermes Agent — Native SKILL.md

### Closest to Claude Format

Hermes Agent uses the agentskills.io standard — same SKILL.md frontmatter format as Claude. Conversion is minimal.

### Key Differences from Claude

| Aspect | Claude | Hermes |
|--------|--------|--------|
| Frontmatter | `name`, `description`, `version`, `user-invocable` | Same + `platforms`, `metadata.hermes.tags`, `metadata.hermes.related_skills` |
| MCP access | Built-in via MCP protocol | Via tools/ registry or direct API calls |
| Scripts | Bash via sandbox | Python (native), any language via subprocess |
| Memory | Conversation-scoped | Persistent agent memory (curated, trajectory-based) |
| Skill directory | `~/.claude/skills/` | `/skills/` in agent directory |

### Frontmatter Additions

```yaml
---
name: deep-save
description: "..." # same as Claude
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [knowledge-management, memory, open-brain, extraction]
    related_skills: [open-brain-sync, brain-push, auto-capture]
---
```

### Tool Mapping

Map MCP tool calls to Hermes tool invocations. Hermes tools are registered in `tools/registry.py` or `toolsets.py`. For Open Brain:

```python
# In the Hermes agent's tools/ directory, register Open Brain as a tool:
# Option A: Direct API calls via httpx
# Option B: MCP client library (if Hermes supports MCP stdio)

async def save_thought(content: str, type: str = "observation", permanent: bool = False, stale_after: str = None):
    """Save a thought to Open Brain via REST API."""
    resp = await httpx.post(
        f"{OPEN_BRAIN_URL}/functions/v1/open-brain-rest/save",
        json={"content": content, "type": type, "permanent": permanent, "stale_after": stale_after},
        headers={"Authorization": f"Bearer {MCP_ACCESS_KEY}"}
    )
    return resp.json()
```

### Memory Integration

Hermes has its own memory system (agent-curated, periodic review). When converting skills that write to Open Brain:
- Keep Open Brain as the primary knowledge store (Hermes can call it via tools/)
- Optionally also write to Hermes native memory for local agent context
- Map Open Brain `permanent` flag to Hermes memory's "core memory" concept

### Installation Instructions (Hermes Agent)

1. Copy skill directory to `~/.hermes-agent/skills/deep-save/`
2. Add Hermes frontmatter to SKILL.md
3. Register Open Brain tools in the agent's tool registry
4. If the skill needs MCP: configure in the agent's MCP settings or use REST API wrapper

### Hermes Agent Directory Reference

Example Hermes instance: `~/.hermes-agent/`
- Skills: `~/.hermes-agent/skills/`
- Tools: `~/.hermes-agent/tools/` or `~/.hermes-agent/toolsets.py`
- Config: `~/.hermes/config.yaml`
- Memory: Agent-curated persistent memory with periodic nudges

---

## Quick Decision Matrix

| If the skill... | Best target | Why |
|----------------|-------------|-----|
| Has no MCP dependencies | All platforms work | Pure instruction conversion |
| Reads from Open Brain only | ChatGPT (MCP), Gemini CLI, Hermes | All support MCP/API reads |
| Writes to Open Brain | ChatGPT (MCP), Gemini CLI, Hermes | Actions/MCP/tools handle writes |
| Needs bash/filesystem | Gemini CLI, Hermes only | Others lack execution |
| Is research-focused | Perplexity excels | Built for search augmentation |
| Needs subagents | Hermes only (Kanban) | No equivalent elsewhere |

---

## Tier 1 — Agent Skills open standard (install, do not translate)

*Added v2.0, July 2026. Verified against the agentskills.io specification and Cursor's skills documentation on 2026-07-24. Tool support for the standard is expanding; check the target's current docs before relying on a path not listed here.*

Claude Code, Codex CLI, and Cursor all read `SKILL.md` with `name` + `description` YAML frontmatter, and all use the same directory layout (`references/`, `scripts/`, `assets/`). There is no conversion step. Copying the folder is the entire port, and any "translation" applied to these targets can only lose fidelity.

### Discovery paths

| Platform | Personal | Project | Also reads |
|---|---|---|---|
| Claude Code | `~/.claude/skills/<name>/` | `<project>/.claude/skills/<name>/` | plugin-bundled skills |
| Codex CLI | `~/.codex/skills/<name>/` | `<project>/.codex/skills/<name>/` | `AGENTS.md` for persistent project context (separate mechanism) |
| Cursor | `~/.cursor/skills/<name>/`, `~/.agents/skills/<name>/` | `.cursor/skills/`, `.agents/skills/` | `.claude/skills/`, `.codex/skills/` as legacy compatibility paths |

### Constraints that apply to all three

- `name`: 1–64 chars, lowercase alphanumerics and single hyphens, no leading/trailing hyphen, **must match the parent directory name**.
- `description`: max 1,024 characters. This is the most common validation failure for skills written with long trigger lists — a description that overruns is rejected with a message that reads like a naming error.
- `SKILL.md` body: recommended under ~5,000 tokens / 500 lines; push depth into `references/`.

### Failure modes specific to Tier 1 installs

- **Name/directory mismatch.** The skill is skipped silently — no error, it simply never triggers. This is the first thing to check when an installed skill appears to do nothing.
- **Lost execute bit.** Copying through an archive or a GUI drag can drop `+x` on `scripts/`, so the skill's own tooling fails at runtime with a permissions error that looks unrelated.
- **Nested self-copy.** Unzipping an archive inside the skill's own folder leaves a `<name>/<name>/` directory that some scanners treat as a second, malformed skill.
- **Stale duplicate.** Installing to Cursor's `~/.cursor/skills/` while an older copy sits in a legacy path Cursor also reads means two versions are live and the winner is undefined. Remove the old one rather than leaving both.

Use `scripts/install_skill.sh` — it checks the name match and description length before copying, preserves execute bits, and excludes packaging artifacts.
