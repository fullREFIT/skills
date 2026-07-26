# Output Patterns

Reference guide for ensuring consistent, high-quality output from skills. Use these patterns when skills need to produce predictable results.

## Template Pattern

Provide templates for output format. Match strictness to requirements.

### Strict Template (Data formats, API responses)

Use when exact format is required:

```markdown
## Report structure

ALWAYS use this exact template structure:

```markdown
# [Analysis Title]

## Executive summary
[One-paragraph overview of key findings]

## Key findings
- Finding 1 with supporting data
- Finding 2 with supporting data
- Finding 3 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
```

Do not deviate from this structure.
```

### Flexible Template (Adaptable content)

Use when format should vary based on context:

```markdown
## Report structure

Sensible default format—adapt as needed:

```markdown
# [Analysis Title]

## Executive summary
[Overview]

## Key findings
[Adapt sections based on what you discover]

## Recommendations
[Tailor to the specific context]
```

Adjust sections as needed for the specific analysis type.
```

### Template with Required and Optional Sections

```markdown
## Document structure

**Required sections** (always include):
- Title
- Executive summary
- Conclusions

**Conditional sections** (include when relevant):
- Technical details (if technical audience)
- Cost analysis (if financial impact)
- Timeline (if phased implementation)

**Optional sections** (include if valuable):
- Appendices
- Glossary
- References
```

## Examples Pattern

For skills where output quality depends on seeing examples, provide input/output pairs.

### Basic Input/Output Examples

```markdown
## Commit message format

Generate commit messages following these examples:

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
```
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

**Example 2:**
Input: Fixed bug where dates displayed incorrectly in reports
Output:
```
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation
```

**Example 3:**
Input: Updated dependencies and refactored error handling
Output:
```
chore: update dependencies and refactor error handling

- Upgrade lodash to 4.17.21
- Standardize error response format across endpoints
```

Follow this style: type(scope): brief description, then detailed explanation.
```

### Good vs. Bad Examples (Anti-patterns)

Showing what NOT to do is as powerful as showing what to do:

```markdown
## Code review comments

**Good example:**
```
The null check on line 42 should happen before the array access
on line 40 to prevent potential NullPointerException when
`userData` is undefined.
```

**Bad example (avoid this style):**
```
This is wrong
```

**Why it matters:** Specific, actionable feedback helps the developer fix the issue. Vague comments waste time and create confusion.
```

### Progressive Examples (Simple to Complex)

```markdown
## SQL query formatting

**Simple query:**
```sql
SELECT name, email
FROM users
WHERE active = true;
```

**Query with join:**
```sql
SELECT u.name, u.email, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.active = true
  AND o.created_at > '2024-01-01';
```

**Complex query with subquery:**
```sql
SELECT
    u.name,
    u.email,
    (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
FROM users u
WHERE u.active = true
  AND u.created_at > (
      SELECT MIN(created_at)
      FROM users
      WHERE region = u.region
  );
```

Match complexity to the query requirements.
```

## Structured Data Patterns

### JSON Output

```markdown
## API response format

All responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": []
  }
}
```
```

### Tabular Data

```markdown
## Data export format

Export data as CSV with these conventions:

- Header row required
- UTF-8 encoding
- Double quotes around text fields containing commas
- ISO 8601 dates (YYYY-MM-DD)
- Decimal numbers use period (not comma)

Example:
```csv
id,name,created_at,amount
1,"Smith, John",2024-01-15,1234.56
2,"Jane Doe",2024-01-16,789.00
```
```

## Quality Standards Pattern

Define what "good" looks like:

```markdown
## Code quality standards

All generated code must:

**Readability:**
- Use descriptive variable names (no single letters except loop counters)
- Include comments for non-obvious logic
- Follow consistent indentation (4 spaces)

**Robustness:**
- Handle null/undefined inputs
- Validate parameters before use
- Provide meaningful error messages

**Efficiency:**
- Avoid unnecessary loops
- Use appropriate data structures
- Don't load entire files into memory for large files

**Example meeting all standards:**
```python
def calculate_total_revenue(transactions: list[dict]) -> float:
    """
    Calculate total revenue from a list of transactions.

    Args:
        transactions: List of transaction dictionaries with 'amount' key

    Returns:
        Total revenue as a float, or 0.0 if no valid transactions
    """
    if not transactions:
        return 0.0

    total = 0.0
    for transaction in transactions:
        amount = transaction.get('amount', 0)
        if isinstance(amount, (int, float)) and amount > 0:
            total += amount

    return total
```
```

## Naming Conventions Pattern

```markdown
## File naming conventions

**Documents:**
- Format: `YYYY-MM-DD_description_vN.ext`
- Example: `2024-01-15_quarterly_report_v2.pdf`

**Code files:**
- Use snake_case for Python: `user_authentication.py`
- Use camelCase for JavaScript: `userAuthentication.js`
- Use kebab-case for URLs/slugs: `user-authentication`

**Assets:**
- Descriptive names: `hero-banner-desktop.png`
- Include dimensions if relevant: `logo-200x50.png`
```

## Consistency Enforcement

### Terminology Table

```markdown
## Terminology standards

Use consistent terms throughout:

| Use This | Not This |
|----------|----------|
| user | customer, client, end user |
| API endpoint | URL, route, path |
| extract | pull, get, retrieve, fetch |
| field | box, element, control, input |
| validate | check, verify, confirm |
```

### Voice and Tone

```markdown
## Writing style

**Voice:** Active, direct
- ✓ "The system processes the request"
- ✗ "The request is processed by the system"

**Tone:** Professional, helpful
- ✓ "To resolve this, update the configuration file"
- ✗ "You messed up the config"

**Tense:** Present for instructions, past for completed actions
- ✓ "Run the script to generate the report"
- ✓ "The script generated three files"
```
