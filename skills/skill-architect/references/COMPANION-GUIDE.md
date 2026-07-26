# Skill Architect — Companion Guide

**Purpose:** This document provides a comprehensive analysis of all bundled resources (scripts, references, and assets) included in the Skill Architect skill. It is designed to be provided to AI alongside SKILL.md so the AI has full understanding of the skill's capabilities without needing to load the actual resource files. This saves tokens while preserving the knowledge those files contain.

**Skill Version:** v2.1 — February 2026
**Standard:** agentskills.io open standard (December 2025)

---

## Table of Contents

1. [Directory Structure Overview](#directory-structure-overview)
2. [Scripts — Detailed Analysis](#scripts--detailed-analysis)
   - [init_skill.py](#init_skillpy)
   - [package_skill.py](#package_skillpy)
   - [quick_validate.py](#quick_validatepy)
3. [References — Detailed Analysis](#references--detailed-analysis)
   - [example-patterns.md](#example-patternsmd)
   - [workflows.md](#workflowsmd)
   - [output-patterns.md](#output-patternsmd)
   - [advanced-patterns.md](#advanced-patternsmd)
   - [security.md](#securitymd)
   - [troubleshooting.md](#troubleshootingmd)
   - [multi-agent-patterns.md](#multi-agent-patternsmd)
4. [Assets — Detailed Analysis](#assets--detailed-analysis)
   - [universal-skill-improvement-prompt.md](#universal-skill-improvement-promptmd)
5. [Cross-File Relationships](#cross-file-relationships)
6. [How SKILL.md References These Files](#how-skillmd-references-these-files)

---

## Directory Structure Overview

```
skill-architect-improved/
├── SKILL.md                                    (706 lines — main skill)
├── COMPANION-GUIDE.md                          (this file)
├── scripts/
│   ├── init_skill.py                           (304 lines — skill scaffolding)
│   ├── package_skill.py                        (111 lines — zip packaging)
│   └── quick_validate.py                       (103 lines — YAML validation)
├── references/
│   ├── example-patterns.md                     (181 lines — skill type examples)
│   ├── workflows.md                            (222 lines — workflow patterns)
│   ├── output-patterns.md                      (346 lines — output formatting)
│   ├── advanced-patterns.md                    (369 lines — enterprise/advanced)
│   ├── security.md                             (220 lines — security audit)
│   ├── troubleshooting.md                      (378 lines — debugging guide)
│   └── multi-agent-patterns.md                 (804 lines — multi-agent orchestration)
└── assets/
    └── universal-skill-improvement-prompt.md   (317 lines — improvement prompt template)
```

**Total resource content:** ~3,031 lines across 10 files (excluding SKILL.md itself).

---

## Scripts — Detailed Analysis

The three Python scripts form a complete skill lifecycle toolchain: **initialize → validate → package**. They are executed directly (zero token cost) and only their output is consumed.

---

### init_skill.py

**File:** `scripts/init_skill.py` (304 lines)
**Purpose:** Scaffolds a new skill directory from a built-in template with proper structure, placeholder content, and example resource files.
**Dependencies:** Python 3 standard library only (`sys`, `pathlib`). No external packages required.

**Usage:**
```bash
python scripts/init_skill.py <skill-name> --path <output-directory>
```

**Examples:**
```bash
python scripts/init_skill.py my-new-skill --path skills/public
python scripts/init_skill.py my-api-helper --path skills/private
python scripts/init_skill.py custom-skill --path /custom/location
```

**What It Creates:**

The script creates a complete skill directory at `<output-directory>/<skill-name>/` containing:

| File | Content |
|------|---------|
| `SKILL.md` | Template with YAML frontmatter (`name` and `description` placeholder), structured guidance for choosing a skill structure pattern, TODO items for each section, and a "Resources" section explaining the three resource directories |
| `scripts/example.py` | Placeholder Python script with docstring explaining what real scripts look like (references PDF skill examples) |
| `references/api_reference.md` | Placeholder reference doc with guidance on when reference docs are useful and example structures (API reference, workflow guide) |
| `assets/example_asset.txt` | Placeholder asset file explaining what assets are and listing common asset types (templates, images, fonts, boilerplate, icons, data files) |

**SKILL.md Template Structure:**

The generated SKILL.md template includes comprehensive guidance on choosing a skill structure pattern. It describes four patterns the author can choose from:

1. **Workflow-Based** — Best for sequential processes. Example structure: Overview → Workflow Decision Tree → Step 1 → Step 2. Cited example: DOCX skill.
2. **Task-Based** — Best for tool collections. Example structure: Overview → Quick Start → Task Category 1 → Task Category 2. Cited example: PDF skill.
3. **Reference/Guidelines** — Best for standards or specifications. Example structure: Overview → Guidelines → Specifications → Usage. Cited example: Brand styling.
4. **Capabilities-Based** — Best for integrated systems. Example structure: Overview → Core Capabilities → numbered features. Cited example: Product Management.

The template instructs the author to delete the "Structuring This Skill" guidance section when done — it's scaffolding only.

**Key Implementation Details:**

- `title_case_skill_name()` converts hyphenated names to title case for display (e.g., `my-data-analyzer` → `My Data Analyzer`)
- `init_skill()` function: resolves the path, checks for existing directory (fails if exists), creates `SKILL.md` from template with `skill_name` and `skill_title` interpolated, creates all three resource subdirectories with example files
- `scripts/example.py` is created with execute permissions (`chmod 0o755`)
- Prints next steps after creation: edit SKILL.md TODOs, customize/delete example files, run validator
- Returns the created directory path or `None` on error

**Error Handling:**
- Refuses to overwrite existing skill directories
- Catches and reports directory creation failures
- Catches and reports file writing failures
- Returns `None` on any error (non-zero exit code via `main()`)

---

### package_skill.py

**File:** `scripts/package_skill.py` (111 lines)
**Purpose:** Packages a validated skill folder into a distributable `.skill` file (ZIP format).
**Dependencies:** Python 3 standard library (`sys`, `zipfile`, `pathlib`) plus a local import of `quick_validate.validate_skill`.

**Usage:**
```bash
python scripts/package_skill.py <path/to/skill-folder>
python scripts/package_skill.py <path/to/skill-folder> ./dist  # Optional output directory
```

**What It Does:**

1. **Validates the skill first** — imports `validate_skill` from `quick_validate.py` and runs full validation. If validation fails, packaging aborts with the specific error message. This ensures only valid skills get packaged.
2. **Creates a ZIP archive** — uses `zipfile.ZipFile` with `ZIP_DEFLATED` compression. Walks all files recursively via `rglob('*')`, adding each to the archive. The archive path structure preserves the parent directory (uses `relative_to(skill_path.parent)` so the skill directory name is the root in the zip).
3. **Outputs the `.skill` file** — saved as `<skill-name>.skill` in the specified output directory (or current working directory if not specified).

**Key Implementation Details:**

- The `.skill` extension is just a renamed ZIP file
- Each added file is printed during packaging (e.g., `Added: my-skill/SKILL.md`)
- Output directory is created if it doesn't exist (`mkdir(parents=True, exist_ok=True)`)
- File path is resolved to absolute before processing

**Error Handling:**
- Checks that skill path exists and is a directory
- Checks for SKILL.md existence
- Validation gate prevents packaging invalid skills
- Catches ZIP creation errors
- Non-zero exit code on any failure

**Relationship to Other Scripts:**
- Directly imports and calls `quick_validate.validate_skill()` — the two scripts must be in the same directory (or on the Python path)

---

### quick_validate.py

**File:** `scripts/quick_validate.py` (103 lines)
**Purpose:** Validates a skill's SKILL.md frontmatter against the agentskills.io specification. This is the validation backbone — called by `package_skill.py` and usable standalone.
**Dependencies:** Python 3 standard library (`sys`, `os`, `re`) plus `yaml` (PyYAML package required: `pip install pyyaml`).

**Usage:**
```bash
python scripts/quick_validate.py <skill_directory>
```

**What It Validates:**

The `validate_skill()` function accepts a skill directory path and returns a `(bool, str)` tuple — validity status and message.

**Validation checks in order:**

| Check | Rule | Error Example |
|-------|------|---------------|
| SKILL.md existence | File must exist in the directory | "SKILL.md not found" |
| Frontmatter presence | Content must start with `---` | "No YAML frontmatter found" |
| Frontmatter format | Must have opening and closing `---` delimiters | "Invalid frontmatter format" |
| YAML parsing | Frontmatter must be valid YAML via `yaml.safe_load` | "Invalid YAML in frontmatter: [error]" |
| Dictionary type | Parsed YAML must be a dict (not a list or scalar) | "Frontmatter must be a YAML dictionary" |
| Allowed properties | Only these keys permitted: `name`, `description`, `license`, `allowed-tools`, `metadata`, `compatibility` | "Unexpected key(s) in SKILL.md frontmatter: [keys]" |
| Required `name` | Must be present | "Missing 'name' in frontmatter" |
| Required `description` | Must be present | "Missing 'description' in frontmatter" |
| Name type | Must be a string | "Name must be a string, got [type]" |
| Name format (kebab-case) | Lowercase letters, digits, and hyphens only (`^[a-z0-9-]+$`) | "Name 'X' should be kebab-case" |
| Name edge cases | No leading/trailing hyphens, no consecutive hyphens | "Name 'X' cannot start/end with hyphen or contain consecutive hyphens" |
| Name length | Maximum 64 characters | "Name is too long (N characters). Maximum is 64 characters." |
| Description type | Must be a string | "Description must be a string, got [type]" |
| Description characters | No angle brackets (`<` or `>`) | "Description cannot contain angle brackets" |
| Description length | Maximum 1024 characters | "Description is too long (N characters). Maximum is 1024 characters." |
| Compatibility type | If present, must be a string | "Compatibility must be a string, got [type]" |
| Compatibility length | Maximum 500 characters | "Compatibility is too long (N characters). Maximum is 500 characters." |

**Key Implementation Details:**

- Frontmatter extraction uses regex: `^---\n(.*?)\n---` with `re.DOTALL`
- Allowed properties set: `{'name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility'}`
- Validates only the frontmatter — does not check body content, file structure, or resource integrity
- Returns `(True, "Skill is valid!")` if all checks pass

**Important Note on Allowed Properties:**

The validator's allowed properties list (`name`, `description`, `license`, `allowed-tools`, `metadata`, `compatibility`) represents the cross-platform agentskills.io standard properties. Claude Code-specific fields like `argument-hint`, `disable-model-invocation`, `user-invocable`, `model`, `context`, `agent`, and `hooks` are **not** in this list. This means the validator would flag Claude Code-specific frontmatter fields as unexpected. This is a known limitation — the validator targets the cross-platform standard, not Claude Code extensions.

---

## References — Detailed Analysis

The seven reference files contain the deep knowledge that SKILL.md points to via progressive disclosure. They are loaded into context only when the agent needs them for a specific task.

---

### example-patterns.md

**File:** `references/example-patterns.md` (181 lines)
**Purpose:** Provides complete, copy-paste-ready examples of each skill architecture type. This is the "cookbook" for skill structure decisions.

**Skill Types Covered (7 total):**

**1. Reference Content Skills** (lines 7-21)
- Purpose: Add knowledge the agent applies to current work (conventions, patterns, style guides)
- Example: `api-conventions` skill with REST patterns and pointer to `references/api_patterns.md`
- Key feature: No scripts needed — just knowledge injection

**2. Task Content Skills** (lines 24-42)
- Purpose: Step-by-step instructions for specific actions
- Example: `deploy` skill with numbered deployment steps and script execution
- Key features: `context: fork` for isolated execution, `disable-model-invocation: true` for user-only invocation
- Demonstrates the `$ARGUMENTS` variable substitution

**3. Visual Output Skills** (lines 45-62)
- Purpose: Generate interactive HTML outputs leveraging agent artifact capabilities
- Example: `codebase-visualizer` skill that runs a Python script to generate D3.js HTML
- Key feature: `allowed-tools: Bash(python:*)` to auto-approve Python execution

**4. MCP Integration Skills** (lines 65-87)
- Purpose: Skills that leverage Model Context Protocol servers
- Example: `database-query` skill requiring `postgres-mcp` server
- Key features: Documents MCP server prerequisites, uses `ServerName:tool_name` format, references `references/schema.md` for table definitions

**5. Subagent Research Skills** (lines 90-113)
- Purpose: Leverage subagents for complex, isolated tasks
- Example: `security-audit` skill using `context: fork` and `agent: Explore`
- Key features: Fresh context window for unbiased analysis, restricted tool set (`Read, Grep, Glob, Bash(grep:*, find:*)`), structured output format with severity ratings

**6. Skill Family (Router + Sub-Skills)** (lines 116-153)
- Purpose: Parent skill routes to specialized sub-skills for domains with multiple capabilities
- Example: `document-skills` router with format selection table pointing to `pdf/SKILL.md`, `pptx/SKILL.md`, `docx/SKILL.md`
- Key guidance: Use when domain has 3+ sub-capabilities, each complex enough for its own SKILL.md
- Naming convention: Parent uses domain name, children use format/function names
- Notes that sub-skills share resources (e.g., `ooxml.md` used by both DOCX and PPTX)

**7. Generative Skills (Skills That Create Skills)** (lines 155-181)
- Purpose: Skills that generate other skills based on observed patterns
- Example: `skill-generator` meta-skill that triggers on repeated workflows
- Trigger conditions: Same workflow repeated 3+ times, user explicitly asks, complex procedure needing standardization
- Process: Identify pattern → Extract steps → Determine fixed vs variable → Create SKILL.md → Add resources → Validate

---

### workflows.md

**File:** `references/workflows.md` (222 lines)
**Purpose:** Comprehensive reference for structuring multi-step workflows within skills. Covers seven distinct workflow patterns with concrete, implementable examples.

**Patterns Covered:**

**1. Sequential Workflows** (lines 7-35)
- Basic linear step sequences for complex tasks
- Example: PDF form filling process (5 steps: analyze → map → validate → fill → verify)
- **With Progress Tracking**: Copyable checklist pattern using `- [ ]` items so the agent can mark off completed steps during execution

**2. Conditional Workflows** (lines 37-84)
- **Simple branching**: Decision between two paths (creation vs editing workflow)
- **Multi-branch conditional**: Four-way decision tree for image processing (resize → PIL, convert → ImageMagick, OCR → pytesseract, enhance → OpenCV)
- Uses arrow notation (`→`) for visual routing

**3. Feedback Loop / Validation Loop** (lines 86-103)
- The "most important pattern for quality-critical operations"
- Edit → Validate → Fix if failed → Repeat until passes → Proceed
- Uses `**CRITICAL**` emphasis to prevent step-skipping

**4. Plan-Validate-Execute Pattern** (lines 105-130)
- Four-phase approach: Plan (create `changes.json`, no modifications) → Validate (run validator, repeat until passes) → Execute (only after validation) → Verify (post-execution check, restart from step 1 if failed)
- Emphasizes that NO file modifications happen during planning phase
- Includes `**STOP if validation fails**` blocking condition

**5. Iterative Refinement Pattern** (lines 132-156)
- Multi-pass review approach: Pass 1 (Structure) → Pass 2 (Accuracy) → Pass 3 (Style) → Pass 4 (Final check)
- Each pass has specific review criteria
- Used for content review workflows where quality requires multiple perspectives

**6. Error Recovery Patterns** (lines 158-195)
- **Graceful Degradation**: Try primary method → fallback method → report specific error if both fail
- **Checkpoint Pattern**: Process in batches of N, save checkpoint after each, validate batch results, restore from previous checkpoint on failure. Includes resume-from-checkpoint capability for interrupted operations

**7. Parallel vs Sequential Decision** (lines 197-222)
- Decision framework for determining whether steps can run in parallel
- Parallel criteria: No shared resources, no data dependencies, order doesn't matter
- Sequential criteria: Output-input chain, shared file access, order-dependent results
- Examples of each type

---

### output-patterns.md

**File:** `references/output-patterns.md` (346 lines)
**Purpose:** Reference guide for ensuring consistent, high-quality, predictable output from skills. Contains patterns for templates, examples, structured data, quality standards, naming conventions, and style consistency.

**Patterns Covered:**

**1. Template Pattern** (lines 7-81)
- **Strict Template**: For data formats and API responses. Exact structure required, no deviation permitted. Example: Report with mandatory sections (Title, Executive Summary, Key Findings, Recommendations).
- **Flexible Template**: For adaptable content. Provides sensible defaults but allows adjustment. "Adapt as needed" framing.
- **Required + Optional Sections Template**: Three-tier approach — Required sections (always include: Title, Summary, Conclusions), Conditional sections (include when relevant: Technical details, Cost analysis, Timeline), Optional sections (include if valuable: Appendices, Glossary, References).

**2. Examples Pattern** (lines 83-184)
- **Basic Input/Output Examples**: Three commit message examples showing input → output format, with progressive complexity. Demonstrates the `type(scope): description` pattern.
- **Good vs. Bad Examples (Anti-patterns)**: Shows what NOT to do alongside what to do. Code review example: "This is wrong" (bad) vs detailed null-check recommendation (good). Includes "Why it matters" rationale.
- **Progressive Examples (Simple → Complex)**: Three SQL queries of increasing complexity (simple SELECT → JOIN → subquery) with formatting conventions. Instructs to "match complexity to requirements."

**3. Structured Data Patterns** (lines 186-241)
- **JSON Output**: Standardized API response format with `success`, `data`, `metadata` structure. Separate error response format with `code`, `message`, `details`.
- **Tabular Data (CSV)**: Conventions for CSV export — header row required, UTF-8, double quotes for text with commas, ISO 8601 dates, period decimals. Includes concrete example.

**4. Quality Standards Pattern** (lines 243-290)
- Defines "what good looks like" across three dimensions:
  - **Readability**: Descriptive variable names, comments for non-obvious logic, consistent indentation (4 spaces)
  - **Robustness**: Handle null/undefined, validate parameters, meaningful error messages
  - **Efficiency**: Avoid unnecessary loops, appropriate data structures, streaming for large files
- Complete Python function example (`calculate_total_revenue`) demonstrating all standards with docstring, type hints, null handling, and input validation

**5. Naming Conventions Pattern** (lines 292-309)
- **Documents**: `YYYY-MM-DD_description_vN.ext` (e.g., `2024-01-15_quarterly_report_v2.pdf`)
- **Code files**: snake_case for Python, camelCase for JavaScript, kebab-case for URLs/slugs
- **Assets**: Descriptive names with dimensions when relevant (e.g., `logo-200x50.png`)

**6. Consistency Enforcement** (lines 311-345)
- **Terminology Table**: Standardizes vocabulary — "Use This / Not This" format. Example: "user" not "customer/client/end user", "extract" not "pull/get/retrieve/fetch"
- **Voice and Tone**: Active voice ("The system processes") not passive ("The request is processed"). Professional/helpful tone. Present tense for instructions, past for completed actions.

---

### advanced-patterns.md

**File:** `references/advanced-patterns.md` (369 lines)
**Purpose:** Reference for sophisticated skill designs requiring multi-model testing, MCP integration, verifiable outputs, enterprise deployment, or composable architectures.

**Patterns Covered:**

**1. Multi-Model Optimization** (lines 7-55)
- Skills act as additions to models, so effectiveness varies by underlying model
- **Model-specific adjustment table**: Haiku (more explicit instructions, simpler workflows), Sonnet (standard instructions), Opus (avoid over-explaining, trust judgment)
- **Writing for multiple models**: Shows how to add bracketed notes `[For simpler models, add explicit checks here]` within standard instructions
- **Cross-model testing**: JSON test case structure with `test_models: ["haiku", "sonnet", "opus"]` array and `expected_behavior` assertions

**2. MCP Integration Patterns** (lines 57-119)
- **Qualified tool references**: Always use `ServerName:tool_name` format (e.g., `BigQuery:bigquery_schema`, `GitHub:create_issue`)
- **MCP-dependent workflows**: Prerequisites table documenting required MCP servers and tools. Includes conditional paths: "If MCP available → use tool; If not → provide manual alternative"
- **Graceful MCP fallbacks**: Primary method uses MCP tool, fallback generates SQL/instructions for manual execution. Ensures skills work even without MCP configured

**3. Verifiable Intermediate Outputs** (lines 121-196)
- **Plan-Validate-Execute Pattern** (extended version): Four phases — Planning (create `changes.json` with old/new values, NO file modifications), Validation (run validator, `STOP if fails`), Execution (apply changes only after validation), Verification (post-execution check)
- **Audit Trail Pattern**: Three-stage logging — before (hash input, record timestamp), during (log each transformation), after (hash output, generate audit report). Includes complete audit report structure.

**4. Domain-Specific Subskills / Skill Family Pattern** (lines 198-237)
- Directory structure example: `analytics-skills/` with `analytics-core/`, `analytics-finance/`, `analytics-sales/`, `analytics-product/` subdirectories
- **Cross-referencing skills**: Parent skill lists related sub-skills with brief descriptions and routing instructions

**5. Enterprise Deployment Patterns** (lines 239-289)
- **Organization-wide skills**: Customization points via environment variables (`BRAND_PRIMARY_COLOR`, `LOGO_PATH`) and file overrides (`~/.org/templates/`). Sensible defaults when no customization exists.
- **Skill versioning**: Metadata-based versioning (`version: "2.1.0"`, `min_compatible_version: "2.0.0"`, `changelog`). In-body documentation of breaking changes, new features, and upgrade notes with migration guide references.

**6. Performance Optimization** (lines 291-328)
- **Token-efficient designs**: For large datasets — don't load into context, use summary scripts, process in batches, use streaming output
- **Lazy loading pattern**: Core docs in SKILL.md, additional references loaded only when needed for specific issues (auth, error codes, performance tuning). Explicit instruction: "Don't read all references upfront."

**7. Composable Skills** (lines 330-369)
- **Skill chaining**: Skills designed for pipeline composition — documents input format it accepts (from other skills) and output format it produces (for other skills). Example chain: data-extractor → data-analyzer → report-generator.
- **Shared conventions**: For skill families, establishes common data format conventions — ISO 8601 dates, period decimals, null handling, UTF-8 encoding — ensuring inter-skill output compatibility.

---

### security.md

**File:** `references/security.md` (220 lines)
**Purpose:** Comprehensive security reference for skill authors covering risk categories, secure coding practices, credential management, dependency vetting, data classification, and incident response.

**Sections Covered:**

**1. Risk Categories** (lines 7-27)
- **Code Execution Risks** (4 risks with mitigations):
  - Data exfiltration → Audit scripts for network calls
  - File system access → Limit to specific directories
  - Credential exposure → Use env vars, never hardcode
  - Resource exhaustion → Include timeouts and limits
- **Content Injection Risks** (3 risks with mitigations):
  - Prompt injection → Validate and sanitize inputs
  - Path traversal → Validate file paths (`../../etc/passwd`)
  - Command injection → Never construct shell commands from user input

**2. Secure Script Guidelines** (lines 29-94)
- **Input Validation**: Complete Python function `safe_process_file()` demonstrating path traversal prevention (`os.path.abspath` + `startswith` check), file existence validation, and allowed extension enforcement
- **Error Handling**: Python example `secure_database_query()` showing how to log full errors for debugging while returning safe messages to users (no sensitive data in error messages)
- **Shell Injection Prevention**: Side-by-side dangerous vs safe examples — `os.system(f"cat {user_input}")` (dangerous) vs `subprocess.run(["cat", user_input])` (safe, arguments escaped)

**3. Credential Management** (lines 96-131)
- **Never hardcode credentials**: Dangerous (inline API key) vs safe (`os.environ.get("API_KEY")` with existence check)
- **Document required environment variables**: Table format in SKILL.md with variable name, description, and required/optional status. Includes `export` commands for setup.

**4. Audit Checklist** (lines 133-155)
Three-category pre-deployment checklist:
- **Scripts** (7 items): Network call audit, no hardcoded credentials, input validation, path traversal prevention, no shell command construction, error handling, resource limits
- **SKILL.md** (3 items): No sensitive info, credentials documented as env vars, security warnings present
- **References and Assets** (3 items): No sensitive data, no real credentials in templates, synthetic example data

**5. Third-Party Dependencies** (lines 157-185)
- **Vetting checklist**: Popularity/maintenance, security advisories, behavior audit, version pinning
- **Version pinning**: `requirements.txt` with exact versions (e.g., `requests==2.31.0`)
- **Minimize dependencies**: Prefer standard library when possible — `urllib.request` example instead of `requests` for simple HTTP

**6. Sensitive Data Handling** (lines 187-209)
- **Data classification table**: Public (no restrictions), Internal (log access), Confidential (encrypt, audit, minimize retention), Restricted (never log, encrypt at rest and transit)
- **Logging guidelines**: Dangerous (logs SSN) vs safe (masks PII) examples

**7. Incident Response** (lines 211-220)
Five-step response protocol: Disable immediately → Audit logs → Rotate credentials → Notify stakeholders → Post-mortem

---

### troubleshooting.md

**File:** `references/troubleshooting.md` (378 lines)
**Purpose:** Diagnostic and resolution guide for common skill issues. Organized by problem category with symptoms, diagnostic steps, and solutions.

**Issue Categories Covered:**

**1. Skill Discovery Issues** (lines 7-69)

- **Skill Not Triggering** — Symptom: relevant request doesn't activate skill. Four diagnostic steps: check description specificity (bad: "Helps with files", good: includes triggers), verify name matches directory, check for reserved words, validate frontmatter syntax.
- **Wrong Skill Triggered** — Symptom: different skill activates. Two diagnostic steps: review overlapping descriptions, check description length (max 1024, front-load important keywords).
- **Skill Triggers at Wrong Times** — Symptom: activates when it shouldn't. Two solutions: narrow description (use "ONLY when..."), add negative conditions ("Do NOT use for CSV files — use csv-processor instead").

**2. Content Loading Issues** (lines 71-119)

- **Reference Files Not Read** — Symptom: agent ignores bundled references. Three diagnostics: check paths (forward slashes, relative to skill root), verify explicit links in SKILL.md (`See [references/guide.md](references/guide.md)`), use descriptive file names.
- **Partial File Reads** — Symptom: agent only reads part of a reference. Causes: file too long, nested references. Three solutions: add table of contents, keep references one level deep (SKILL.md → reference only, no chaining), split large files.

**3. Script Execution Issues** (lines 121-189)

- **Script Not Found** — Wrong path in instructions. Fix: use explicit paths (`python scripts/analyze_form.py` not just `analyze_form.py`), verify file exists, check permissions (`chmod +x`).
- **Script Fails to Execute** — Errors during run. Diagnostics: test independently, check dependencies, review error messages (missing imports, paths, permissions).
- **Script Output Not Used** — Script succeeds but agent ignores output. Solutions: clarify output format in SKILL.md (document JSON structure), distinguish "execute" (use output) from "read" (reference only) instructions.

**4. Output Quality Issues** (lines 191-261)

- **Inconsistent Output Format** — Varying formats for same task. Solutions: add strict template with "Do not deviate" instruction, provide examples, add validation step.
- **Missing Required Elements** — Output lacks required sections. Solutions: use checklist pattern (`- [ ]` items the agent verifies before completing), make requirements explicit with "Required sections" vs "Optional sections".
- **Poor Output Quality** — Technically correct but not useful. Solutions: add quality criteria (actionable, evidence-based, audience-appropriate), include good/bad examples.

**5. Workflow Issues** (lines 263-306)

- **Workflow Steps Skipped** — Agent bypasses validation or intermediate steps. Three solutions: make steps mandatory (`**CRITICAL**: Do not proceed...`), use progress checklist, add blocking conditions (`STOP and fix issues before continuing`).
- **Workflow Loops Forever** — Agent stuck in validation loop. Two solutions: add iteration limits ("Attempt up to 3 times, then report errors"), provide escape conditions (document errors, save progress, request guidance).

**6. Cross-Platform Issues** (lines 308-341)

- **Works in Claude but Not Other Platforms** — Three checks: frontmatter compliance (all platforms need name/description), path format (forward slashes only), script compatibility (different package availability).
- **Installation Location Issues** — Not discovered after install. Platform-specific location table: Claude Code (`~/.claude/skills/`), Codex (`~/.codex/skills/`), VS Code (`.github/skills/`), API (`/v1/skills`).

**7. Debugging Strategies** (lines 343-378)

- **Enable Verbose Logging**: Add `--verbose` flag to scripts for detailed output.
- **Isolate the Problem**: Test components separately (scripts, references, frontmatter), simplify and rebuild (remove optional components, test minimal skill, add back one at a time), compare with known-working skill.

---

### multi-agent-patterns.md

**File:** `references/multi-agent-patterns.md` (804 lines)
**Purpose:** The most comprehensive reference file. Covers advanced multi-agent orchestration, agent persistence, context window management, parallel execution, session teleportation, and generative/self-improving skills.

**This is the largest and most architecturally significant reference file in the skill.** It documents patterns observed in production Claude workflows across Claude Code, Claude Cowork, and Claude Cloud.

**Sections Covered:**

**1. Built-in Sub-Agent Inventory** (lines 7-55)

Three platform-specific agent tables:

- **Claude Code Sub-Agents**: `Explore` (read-only discovery, Read/Grep/Glob tools), `Plan` (strategic planning, Read/Grep/Glob), `Bash` (shell execution, Bash tool), `general-purpose` (all tools)
- **Claude Cowork Sub-Agents**: Same core agents but operating on local folders. Different typical use cases (e.g., Explore for "research synthesis, document analysis")
- **Claude Code Cloud/Background**: Agents can create Git branches, push commits, trigger deployment previews (Vercel/Netlify), run in parallel without blocking local dev
- **Skill invocation**: Shows `context: fork` + `agent: Explore` YAML configuration with `allowed-tools` restriction

**2. The RPEQ Orchestration Pattern** (lines 57-165)

The canonical multi-agent pattern: **Research → Plan → Execute → QA**

- **ASCII diagram** showing four-phase pipeline with parallel research agents funneling to sequential plan → execute → QA agents
- **Implementation example**: Executive Presentation Workflow
  - Phase 1: 4 parallel research agents (AI capabilities, enterprise adoption, implementation challenges, competitive landscape)
  - Phase 2: 1 plan agent synthesizing research into roadmap with milestones
  - Phase 3: 1 execution agent using Plan output + PowerPoint skill + brand guidelines
  - Phase 4: 1 QA agent checking visual issues, content accuracy, improvements
- **Orchestration Skill Pattern**: Complete YAML skill example (`research-to-deck`) encoding the RPEQ sequence as reusable skill instructions

**3. Agent Persistence Patterns** (lines 167-297)

- **Directory structure**: `cowork-agents/` with README.md (session onboarding), agents.md (definitions), skills/ (sub-skills), outputs/ (working files)
- **README as Session Onboarding**: "Bootstrap" document for new sessions. Lists available agents by category (Research, Planning, Execution, QA) with capabilities. Includes recommended workflow and quick-start instructions.
- **agents.md Definition Format**: Structured agent definitions with Type, Mode (parallel-capable/sequential), Best For, Invocation template, and Capabilities list. Enables "agent libraries" reusable across sessions.
- **Persisting Session-Generated Skills**: Template for documenting skills created during sessions, with creation date, purpose, location, triggers, and capabilities.

**4. Context Window Management** (lines 299-382)

- **The Context Compaction Problem**: In long conversations, compaction loses nuance, causes inconsistency, degrades quality. Sub-agents solve this.
- **Sub-Agent Context Isolation**: ASCII diagram showing parent context (may be compacted) spawning a fresh sub-agent context (only task prompt + skill instructions, no conversation baggage). Only results return to parent.
- **When to Use Sub-Agents** (decision table): Deep research → Explore agent, multiple research streams → parallel sub-agents, complex document generation → sub-agent isolation, QA/review → separate unbiased agent, long conversations → offload intensive tasks
- **Skill Design for Context Efficiency**: Example skill (`efficient-research`) that specifies exactly what to return (bullet points, top 3 sources, confidence) and what NOT to return (full source text, intermediate reasoning, search queries) — keeping the return payload small for parent context

**5. Parallel Execution Patterns** (lines 384-487)

- **Identifying Parallelizable Tasks**: Criteria — no dependencies, no resource conflicts, can be synthesized after. ASCII diagram showing sequential (4 units) vs parallel (1 unit + synthesis).
- **Parallel Research Pattern**: Template for spawning 4 agents simultaneously with different focus areas, source preferences, and structured output requirements. Synthesis step after all complete.
- **Parallel Feature Development (Vibe Coding)**: Multiple Claude Code instances each creating their own Git branch, implementing a variant, pushing to GitHub, triggering preview deployments. Evaluate all previews, merge the winner.
- **Parallel Execution in Cowork**: Cowork-specific behavior — agents appear in sidebar, can be monitored/adjusted mid-task, complete independently with post-completion synthesis.

**6. Session Continuity and Teleportation** (lines 489-587)

- **The Teleportation Concept**: ASCII diagram showing cloud session ↔ local session transfer preserving full context, Git branch, and task state
- **How it works**: Cloud → Local ("Open in CLI" copies session context, checks out branch, preserves history). Local → Cloud (background task in cloud, creates own branch, monitored from web/mobile).
- **Teleportation vs Git Checkout**: Teleportation preserves full task context; Git checkout only gets code changes
- **Designing Skills for Session Continuity**: Checkpoint-based state management with `checkpoints/` directory (phase completion files + `current-state.md`). Resumption protocol: read current state → identify last phase → resume from next.
- **Cross-Device Workflows**: Mobile (commute: review tasks, launch research, monitor) → Desktop (office: teleport research, detailed work, launch execution) → Mobile (evening: review results, approve via PRs, queue next day)

**7. Generative Skill Patterns** (lines 589-782)

- **The Meta-Skill Pattern**: `skill-factory` skill that generates new skills from observed patterns. Three-phase process: Pattern Recognition (triggers, fixed vs variable steps) → Skill Architecture (frontmatter, body, resources needed) → Generation (create directory) → Validate and Test.
- **Session-Generated Skills**: During task execution, agents notice recurring sub-tasks and create skills dynamically. Example: `powerpoint-reviewer` skill generated during a presentation workflow, with visual issues and consistency checklists.
- **Skill Evolution Pattern**: Version 1 (initial creation) → 1.1 (first refinement based on missed cases) → 2.0 (generalization with configurable strictness) → 2.1+ (continuous improvement from edge cases, feedback, platform changes).
- **Skill Composition Pattern**: Skills that invoke other skills in sequence. Example: `full-document-workflow` composing research-synthesizer → document-creator → document-reviewer → revision loop.
- **Self-Improving Skills**: After each execution — capture feedback (expectations met? manual corrections? edge cases?) → propose updates (new checks, clarified instructions, new examples) → version control (new version, preserve old for rollback, changelog) → validation (test on previous inputs, verify no regressions, promote if validated).

**8. Quick Reference Decision Matrix** (lines 787-800)

| Scenario | Pattern | Key Configuration |
|----------|---------|-------------------|
| Deep research on one topic | Single sub-agent | `context: fork`, `agent: Explore` |
| Research multiple topics | Parallel sub-agents | Spawn multiple `general-purpose` |
| Complex planning | Sequential agents | Research → Plan agent |
| Document generation | Isolated execution | Sub-agent with skill invocation |
| Quality review | Separate QA agent | Fresh context for unbiased review |
| Long conversation | Offload to sub-agents | Prevent context compaction |
| Cross-device work | Teleportation | Use "Open in CLI" to transfer |
| Repeated task | Generate skill | Meta-skill or manual creation |
| Complex workflow | Skill composition | Skills that invoke other skills |

---

## Assets — Detailed Analysis

---

### universal-skill-improvement-prompt.md

**File:** `assets/universal-skill-improvement-prompt.md` (317 lines)
**Purpose:** A reusable prompt template for comprehensively improving any Claude skill. Designed to be copied, customized with placeholders, and submitted to Claude as a standalone improvement request.

**This is an asset, not a reference — it's meant to be used in output (copied and provided to another Claude instance), not loaded into the working agent's context for its own instruction.**

**Structure:**

**1. The Full Prompt Template** (lines 9-143)
A complete, structured prompt enclosed in triple backticks with these sections:
- **SKILL IDENTIFICATION**: Placeholders for `[SKILL NAME]`, `[DOMAIN]`, `[CURRENT VERSION]`
- **OBJECTIVE**: Transform the skill into the most comprehensive version possible
- **RESEARCH REQUIREMENTS** (3 categories):
  - Specification Currency: agentskills.io standard, Claude-specific features, cross-platform compatibility
  - Domain-Specific Research: Official docs, best practices, recent changes, pitfalls, advanced techniques
  - Platform Evolution: Claude ecosystem, integrations, execution environments
- **ANALYSIS FRAMEWORK** (5 criteria): Completeness, Currency, Specification Compliance, Practical Utility, Cross-Platform Compatibility — each with specific evaluation questions
- **DELIVERABLES** (4 outputs): Research Summary, Improvement Recommendations, Improved Skill Package, Change Summary
- **QUALITY STANDARDS**: Frontmatter checklist (4 items), Body Content checklist (5 items), Reference Files checklist (4 items), Practical Value checklist (4 items)
- **CONSTRAINTS**: Preserve valuable content, maintain backward compatibility, don't remove without replacement, keep self-contained, verify claims through research

**2. Usage Instructions** (lines 146-167)
Four-step process: Copy template → Replace placeholders (table mapping each `[PLACEHOLDER]` to what to fill in) → Attach supporting files (zip or individual) → Submit to fresh Claude conversation

**3. Quick-Start Version** (lines 171-207)
A condensed version of the full prompt (~30 lines vs ~130 lines) for faster iteration. Covers the same ground but with abbreviated sections. Suitable when the user is confident in the approach and doesn't need the full analytical framework.

**4. Filled Example: MCP Builder Skill** (lines 211-258)
A concrete example showing the full prompt populated for the `mcp-builder` skill:
- Domain: "MCP (Model Context Protocol) server development"
- Research includes: MCP specification versions (2024-11-05, 2025-03-26, 2025-06-18, 2025-11-25), Python SDK/FastMCP updates, TypeScript SDK, recent features (Tasks, elicitation, OAuth, structured outputs), MCP Registry
- Platform evolution includes: MCP transport options (stdio, Streamable HTTP, SSE deprecated), cross-platform MCP adoption (OpenAI, Google)

**5. Tips for Best Results** (lines 262-285)
Five optimization tips:
1. Use Extended Thinking for complex skills
2. Provide ALL skill files (not just SKILL.md)
3. Specify Priority Improvements for known issues (example: "SSE is now deprecated")
4. Iterate: research → recommendations in one session, implementation in follow-up
5. Document Platform Targeting (primary/secondary platforms)

**6. Review Checklist** (lines 289-314)
Post-improvement verification organized into four categories:
- Specification Compliance (4 items)
- Information Currency (3 items)
- Practical Value (4 items)
- Package Completeness (4 items)

---

## Cross-File Relationships

Understanding how the files relate to each other is critical for the skill's coherence:

```
SKILL.md (entry point)
├── references/example-patterns.md     ← "Example Skill Patterns" section points here
├── references/workflows.md            ← Step 4 (Editing) implicitly draws from this
├── references/output-patterns.md      ← Quality/consistency guidance extends this
├── references/advanced-patterns.md    ← Advanced users pointed here from multiple sections
├── references/security.md             ← "Security Considerations" section points here
├── references/troubleshooting.md      ← "Troubleshooting" section points here
├── references/multi-agent-patterns.md ← Subagent section and advanced patterns reference this
├── scripts/init_skill.py              ← Step 3 (Initializing) invokes this
├── scripts/quick_validate.py          ← Step 5 (Validation) invokes this (via package_skill)
├── scripts/package_skill.py           ← Step 5 (Packaging) invokes this
└── assets/universal-skill-improvement-prompt.md ← Not directly referenced in SKILL.md body
```

**Script dependency chain:**
```
package_skill.py  ──imports──►  quick_validate.py
                                      │
init_skill.py  (standalone)           │
                                      ▼
                              Requires PyYAML (`yaml`)
```

**Reference cross-references:**
- `workflows.md` and `advanced-patterns.md` both cover Plan-Validate-Execute (workflows has the basic version, advanced has the extended version with JSON change plans)
- `security.md` and `advanced-patterns.md` both touch on MCP integration (security covers risks, advanced covers graceful fallbacks)
- `multi-agent-patterns.md` and `example-patterns.md` both cover skill families (multi-agent has composition patterns, example-patterns has the router/sub-skill example)
- `troubleshooting.md` references `quick_validate.py` as a diagnostic tool

---

## How SKILL.md References These Files

SKILL.md uses progressive disclosure to point to these files at appropriate moments:

| SKILL.md Section | Referenced File | How Referenced |
|-------------------|----------------|---------------|
| "Skill Type Decision Matrix" | `references/example-patterns.md` | "See `references/example-patterns.md` for complete examples of each type." |
| "Security Considerations" | `references/security.md` | "For the complete security audit checklist...read `references/security.md`." |
| "Example Skill Patterns" | `references/example-patterns.md` | "For complete examples...read `references/example-patterns.md`." |
| "Troubleshooting" | `references/troubleshooting.md` | "For detailed debugging strategies...read `references/troubleshooting.md`." |
| "Step 3: Initializing" | `scripts/init_skill.py` | `python scripts/init_skill.py <skill-name> --path <output-directory>` |
| "Step 5: Validation and Packaging" | `scripts/package_skill.py` | `python scripts/package_skill.py <path/to/skill-folder>` |
| "Additional Reference Files" table | All 7 reference files | Table with file names and one-line purpose descriptions |

**Files NOT directly referenced in SKILL.md body:**
- `assets/universal-skill-improvement-prompt.md` — This is an asset for users/agents to copy and use, not something the skill's body instructs the agent to read
- `scripts/quick_validate.py` — Only called indirectly through `package_skill.py`'s import; not invoked directly in SKILL.md instructions (though the troubleshooting reference mentions it)

---

*Companion Guide v1.0 — February 2026*
*For use alongside Skill Architect SKILL.md v2.1*
