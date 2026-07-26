# Knowledge MCP Tools Reference for Deep Save

Quick reference for the MCP tools used by this skill. All tools are prefixed with `mcp__open-brain__` in Claude Code or accessed directly via MCP in Desktop/Cowork. Adapt the prefix if using a different knowledge MCP.

---

## Write Tools

### `save_thought`
Save a single thought with full metadata.

```json
{
  "content": "string (required)",
  "type": "observation | idea | reference | person_note | decision | learning",
  "source": "claude-desktop | claude-code | claude-web | cowork | cursor",
  "confidence": 0.0-1.0,
  "permanent": true | false,
  "stale_after": "YYYY-MM-DD",
  "provenance_url": "string",
  "session_id": "string"
}
```

### `save_thoughts_batch`
Save up to 20 thoughts in one call. Same parameters per item as `save_thought`. Use this for 3+ items — sequential `save_thought` calls can trip rate limits.

```json
{
  "thoughts": [
    { "content": "...", "type": "...", "permanent": true },
    { "content": "...", "type": "...", "stale_after": "2026-10-07" }
  ]
}
```

### `update_thought`
Update an existing thought's content or metadata. Use instead of creating a duplicate when dedup check finds a 60-85% match.

```json
{
  "thought_id": "uuid (required)",
  "content": "new content (optional)",
  "metadata_patch": { "key": "value" }
}
```

### `create_task` / `create_tasks_batch`
Create pending tasks. Tasks go in a separate table from thoughts.

```json
{
  "content": "[PROJECT] Task description (required)",
  "priority": "low | normal | high | urgent",
  "due_date": "YYYY-MM-DD",
  "revenue_pathway": "ATTRACT | CONVERT | CLOSE | EXPAND"
}
```

### `link_thoughts`
Create typed relationships between thoughts.

```json
{
  "source_id": "uuid (required)",
  "target_id": "uuid (required)",
  "link_type": "supports | contradicts | extends | supersedes | follows_from | related_to | example_of",
  "confidence": 0.0-1.0
}
```

---

## Read Tools (for Dedup Check)

### `search_thoughts`
Semantic search. Returns thoughts ranked by hybrid score.

```json
{
  "query": "string (required)",
  "limit": 10,
  "threshold": 0.4,
  "detail_level": "compact | full",
  "min_signal": 30,
  "recency_boost": false,
  "type": "observation | decision | ...",
  "since_date": "YYYY-MM-DD",
  "source": "slack | mcp | markdown | claude-code"
}
```

Use `detail_level: "compact"` for dedup checks — returns IDs and 100-char previews without loading full content.

### `get_thought_detail`
Fetch full content of specific thoughts by ID array. Use after compact search identifies relevant IDs.

```json
{
  "ids": ["uuid", "uuid"]
}
```

---

## Dedup Decision Matrix

| Similarity | Action | Tool |
|-----------|--------|------|
| >85% | Skip (exact duplicate) | — |
| 60-85% | Update existing thought | `update_thought` |
| <60% | Save as new | `save_thought` / `save_thoughts_batch` |

---

## Rate Limit Notes

- **save_thoughts_batch** processes items sequentially with internal rate-limit buffers
- **Maximum 20 items per batch call** — split larger sets into multiple calls
- If a batch partially fails, the response includes per-item results (created / duplicate / error)
- **search_thoughts** has no rate limit concern for dedup checks
