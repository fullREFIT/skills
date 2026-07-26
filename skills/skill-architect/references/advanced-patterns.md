# Advanced Skill Patterns

Reference for sophisticated skill designs. Consult when building complex skills that require multi-model testing, MCP integration, verifiable outputs, or enterprise-scale deployment.

## Multi-Model Optimization

Skills act as additions to models, so effectiveness varies by underlying model.

### Model-Specific Considerations

| Model Class | Characteristics | Skill Adjustments |
|-------------|-----------------|-------------------|
| **Haiku** (fast, economical) | Less reasoning depth | More explicit instructions, simpler workflows |
| **Sonnet** (balanced) | Good reasoning, efficient | Standard instructions work well |
| **Opus** (powerful reasoning) | Deep reasoning, may over-think | Avoid over-explaining, trust model judgment |

### Writing for Multiple Models

```markdown
## Task execution

Follow these steps:

1. **Analyze the input**
   - Identify the file type and structure
   - Note any anomalies or special cases

   [For simpler models, add explicit checks here]
   If file type is unclear, check the first 100 bytes for magic numbers.

2. **Process the data**
   [Standard instructions work for all models]

3. **Validate output**
   [All models benefit from validation steps]
```

### Testing Across Models

Create test cases that verify skill behavior across model tiers:

```json
{
  "test_name": "basic_pdf_extraction",
  "skills": ["pdf-processing"],
  "query": "Extract all text from this PDF",
  "files": ["test-files/simple.pdf"],
  "expected_behavior": [
    "Uses pdfplumber or equivalent library",
    "Extracts text from all pages",
    "Outputs readable text content"
  ],
  "test_models": ["haiku", "sonnet", "opus"]
}
```

## MCP Integration Patterns

### Qualified Tool References

Always use fully qualified tool names for MCP servers:

```markdown
## Database operations

Use MCP tools with full server:tool format:

- Schema discovery: `BigQuery:bigquery_schema`
- Query execution: `BigQuery:execute_query`
- Issue creation: `GitHub:create_issue`
- File search: `Slack:search_messages`
```

### MCP-Dependent Workflows

When skills depend on MCP servers:

```markdown
## Prerequisites

This skill requires the following MCP connections:

| Server | Required Tools | Purpose |
|--------|---------------|---------|
| BigQuery | `bigquery_schema`, `execute_query` | Data analysis |
| Slack | `search_messages`, `post_message` | Notifications |

If MCP servers are not available, the skill will provide manual alternatives.

## Workflow

1. **Check MCP availability**
   - If BigQuery MCP available → Use `BigQuery:execute_query`
   - If not available → Generate SQL for manual execution

2. **Execute query**
   [MCP-based or manual path]

3. **Report results**
   - If Slack MCP available → Post to channel
   - If not available → Output to console
```

### Graceful MCP Fallbacks

```markdown
## Data retrieval

**Primary method** (with MCP):
Use `Database:execute_query` to run the query directly.

**Fallback method** (without MCP):
Generate the SQL query and provide instructions for manual execution:

```sql
-- Run this query in your database client:
SELECT * FROM users WHERE active = true;
```
```

## Verifiable Intermediate Outputs

For complex operations, create machine-verifiable checkpoints.

### Plan-Validate-Execute Pattern

```markdown
## Batch update workflow

### Phase 1: Planning
Create `changes.json` with all planned modifications:

```json
{
  "version": "1.0",
  "created_at": "2024-01-15T10:30:00Z",
  "changes": [
    {
      "file": "config/settings.yaml",
      "action": "update",
      "field": "database.host",
      "old_value": "localhost",
      "new_value": "db.example.com"
    }
  ]
}
```

Do NOT apply any changes in this phase.

### Phase 2: Validation
Run: `python scripts/validate_plan.py changes.json`

Validation checks:
- All referenced files exist
- Field paths are valid
- No conflicting changes
- Required fields present

**STOP if validation fails. Fix issues and re-validate.**

### Phase 3: Execution
Only after validation passes:
Run: `python scripts/apply_changes.py changes.json`

### Phase 4: Verification
Run: `python scripts/verify_changes.py changes.json`

Verify each change was applied correctly.
```

### Audit Trail Pattern

```markdown
## Document processing with audit

All operations are logged for auditability:

1. **Before processing**
   - Log input file hash: `sha256sum input.pdf`
   - Record timestamp and operation type

2. **During processing**
   - Log each transformation step
   - Record intermediate states

3. **After processing**
   - Log output file hash
   - Generate audit report: `python scripts/generate_audit.py`

Audit report includes:
- Input/output file hashes
- All operations performed
- Timestamps for each step
- Any errors encountered
```

## Domain-Specific Subskills

For large domains, split into focused subskills.

### Skill Family Pattern

```
analytics-skills/
├── analytics-core/           # Shared utilities
│   ├── SKILL.md
│   └── scripts/
├── analytics-finance/        # Finance-specific
│   ├── SKILL.md
│   └── references/
├── analytics-sales/          # Sales-specific
│   ├── SKILL.md
│   └── references/
└── analytics-product/        # Product-specific
    ├── SKILL.md
    └── references/
```

### Cross-Referencing Skills

```markdown
# Analytics Core

This skill provides shared utilities for all analytics skills.

## Related skills

For domain-specific analysis:
- Finance metrics → See `analytics-finance` skill
- Sales pipeline → See `analytics-sales` skill
- Product usage → See `analytics-product` skill

## Shared utilities

[Common functions used by all analytics skills]
```

## Enterprise Deployment Patterns

### Organization-Wide Skills

For skills deployed across teams:

```markdown
## Deployment notes

This skill is deployed organization-wide.

**Customization points:**
- Brand colors: Set `BRAND_PRIMARY_COLOR` environment variable
- Logo: Place `logo.png` in skill assets or set `LOGO_PATH` env var
- Templates: Override templates by placing files in `~/.org/templates/`

**Default behavior** (when no customization):
- Uses standard color scheme
- Uses text-only headers
- Uses built-in templates
```

### Skill Versioning

```yaml
---
name: document-processor
description: Process documents according to company standards.
metadata:
  version: "2.1.0"
  min_compatible_version: "2.0.0"
  changelog: "Added PDF form filling support"
---
```

In SKILL.md:
```markdown
## Version compatibility

Current version: 2.1.0

**Breaking changes since 2.0.0:**
- None

**New features in 2.1.0:**
- PDF form filling support
- Improved error messages

**Upgrade notes:**
If upgrading from 1.x, see [references/migration-guide.md](references/migration-guide.md)
```

## Performance Optimization

### Token-Efficient Designs

```markdown
## Large dataset processing

For datasets > 1000 rows:

1. **Don't load full dataset into context**
   Run: `python scripts/summarize_data.py data.csv`

   This produces a statistical summary without loading all rows.

2. **Process in batches**
   Run: `python scripts/process_batch.py data.csv --batch-size 100`

   Each batch is processed independently.

3. **Use streaming for output**
   Results are written incrementally, not accumulated in memory.
```

### Lazy Loading Pattern

```markdown
## Reference documentation

Core documentation is in SKILL.md.

**Load additional references only when needed:**

- API authentication issues? → See [references/auth.md](references/auth.md)
- Error code lookup? → See [references/error-codes.md](references/error-codes.md)
- Performance tuning? → See [references/performance.md](references/performance.md)

Don't read all references upfront. Access only what's needed for the current task.
```

## Composable Skills

### Skill Chaining

Skills can be designed to work together:

```markdown
## Workflow integration

This skill can be chained with other skills:

**Input from other skills:**
Accepts output from `data-extractor` skill (JSON format)

**Output for other skills:**
Produces output compatible with `report-generator` skill

**Example chain:**
1. `data-extractor`: Extract data from source
2. `data-analyzer` (this skill): Analyze extracted data
3. `report-generator`: Create formatted report
```

### Shared Conventions

For skill families, establish shared conventions:

```markdown
## Data format conventions

All analytics skills use these conventions:

**Date format:** ISO 8601 (YYYY-MM-DD)
**Numeric format:** No thousands separators, period for decimal
**Null values:** Use `null` in JSON, empty string in CSV
**File encoding:** UTF-8 without BOM

Following these conventions ensures skill outputs are compatible with each other.
```
