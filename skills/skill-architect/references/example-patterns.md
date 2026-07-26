# Example Skill Patterns

Concrete examples of different skill architectures. Use these as starting points when creating new skills.

## Reference Content Skills

Add knowledge the agent applies to current work (conventions, patterns, style guides):

```yaml
---
name: api-conventions
description: API design patterns and conventions for this codebase. Use when designing new endpoints, reviewing API code, or ensuring consistency with existing patterns.
---

When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
- Include request validation

See `references/api_patterns.md` for detailed examples.
```


## Task Content Skills

Step-by-step instructions for specific actions (deployments, commits, code generation):

```yaml
---
name: deploy
description: Deploy the application to production. Use for production deployments, release management, or deployment troubleshooting.
context: fork
disable-model-invocation: true
---

Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target

Execute: `scripts/deploy.sh $ARGUMENTS`
```


## Visual Output Skills

Generate interactive HTML outputs leveraging agent artifact capabilities:

```yaml
---
name: codebase-visualizer
description: Generate interactive tree visualization of codebase structure. Use when users want to visualize project architecture, understand code organization, or create documentation diagrams.
allowed-tools: Bash(python:*)
---

Run the visualization script from project root:
```bash
python scripts/visualize.py .
```

The script generates an interactive HTML file using D3.js for exploration.
```


## MCP Integration Skills

Skills that leverage Model Context Protocol servers:

```yaml
---
name: database-query
description: Query the production database safely. Use for data analysis, report generation, or data validation tasks.
---

## MCP Server Setup
This skill requires the `postgres-mcp` server to be configured.

## Usage
To query the database, use the MCP tool:
```
DatabaseServer:query_read_only
```

Always use read-only queries unless explicitly authorized for writes.

See `references/schema.md` for table definitions.
```


## Subagent Research Skills

Leverage subagents for complex, isolated tasks:

```yaml
---
name: security-audit
description: Perform security audit of codebase. Use for security reviews, vulnerability assessment, or compliance checking.
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob, Bash(grep:*, find:*)
---

## Security Audit Procedure

Analyze the codebase for security issues:

1. **Dependency scan:** Check for known vulnerabilities
2. **Code patterns:** Search for dangerous patterns (eval, exec, SQL injection)
3. **Secrets scan:** Look for hardcoded credentials
4. **Permission review:** Audit file and API permissions

Document findings in structured format with severity ratings.
```


## Skill Family (Router + Sub-Skills)

For domains with multiple distinct capabilities, use a parent skill that routes to specialized sub-skills:

```yaml
---
name: document-skills
description: Universal document creation and conversion across all formats. Routes to sub-skills for PDF, PPTX, DOCX, and handles Markdown/CSV directly. Use when producing any document output.
---

# Document Skills

## Format Selection Guide

| Need | Format | Sub-Skill |
|------|--------|-----------|
| Rendered artifact | Markdown | (handled inline) |
| Presentation | PPTX | See `pptx/SKILL.md` |
| Formal document | DOCX | See `docx/SKILL.md` |
| Fixed-layout print | PDF | See `pdf/SKILL.md` |

## Markdown Documents
[Inline guidance for the simplest/most common format]

## Sub-Skill References
- Read `pdf/SKILL.md` for PDF operations
- Read `pptx/SKILL.md` for presentation work
- Read `docx/SKILL.md` for Word documents
```

**When to use a skill family:**
- Domain has 3+ distinct sub-capabilities
- Each sub-capability is complex enough for its own SKILL.md
- Users often need routing help ("create a document" vs "create a PDF")
- Sub-skills share some common resources (e.g., ooxml.md used by both DOCX and PPTX)

**Naming convention:** Parent uses domain name (`document-skills`), children use format/function names (`pdf`, `pptx`, `docx`).


## Generative Skills (Skills That Create Skills)

Skills that generate other skills based on observed needs:

```yaml
---
name: skill-generator
description: Generate new Claude skills from conversation patterns. Use when the user repeatedly performs similar tasks that would benefit from a dedicated skill.
---

## When to Generate a Skill

Trigger skill creation when:
1. Same workflow repeated 3+ times across conversations
2. User explicitly asks to automate a recurring pattern
3. Complex procedure with many steps that could be standardized

## Generation Process

1. Identify the repeating pattern
2. Extract the workflow steps
3. Determine what's fixed vs. variable
4. Create SKILL.md with proper frontmatter
5. Identify reusable resources (scripts, references, assets)
6. Validate with `scripts/quick_validate.py`
```
