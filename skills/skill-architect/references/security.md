# Security Best Practices

Reference guide for building secure skills. Consult when creating skills that handle sensitive data, execute code, or interact with external systems.

## Risk Categories

### Code Execution Risks

Skills can direct agents to execute arbitrary code. Consider:

| Risk | Example | Mitigation |
|------|---------|------------|
| **Data exfiltration** | Script sends data to external server | Audit all scripts for network calls |
| **File system access** | Script reads/writes unexpected paths | Limit scripts to specific directories |
| **Credential exposure** | Script logs or transmits secrets | Never hardcode credentials; use env vars |
| **Resource exhaustion** | Script creates infinite loops | Include timeouts and resource limits |

### Content Injection Risks

Skills can be tricked into processing malicious content:

| Risk | Example | Mitigation |
|------|---------|------------|
| **Prompt injection** | User input overrides skill instructions | Validate and sanitize inputs |
| **Path traversal** | Input like `../../etc/passwd` | Validate file paths before use |
| **Command injection** | Input with `; rm -rf /` | Never construct shell commands from user input |

## Secure Script Guidelines

### Input Validation

Always validate inputs in scripts:

```python
import os
import re

def safe_process_file(filepath: str) -> str:
    """Process a file with proper validation."""

    # Validate path doesn't escape working directory
    abs_path = os.path.abspath(filepath)
    working_dir = os.path.abspath('.')
    if not abs_path.startswith(working_dir):
        raise ValueError(f"Path outside working directory: {filepath}")

    # Validate file exists
    if not os.path.exists(abs_path):
        raise FileNotFoundError(f"File not found: {filepath}")

    # Validate file extension
    allowed_extensions = ['.txt', '.pdf', '.docx']
    _, ext = os.path.splitext(filepath)
    if ext.lower() not in allowed_extensions:
        raise ValueError(f"Unsupported file type: {ext}")

    # Process file...
    with open(abs_path, 'r') as f:
        return f.read()
```

### Error Handling

Provide meaningful errors without exposing sensitive details:

```python
def secure_database_query(query: str):
    """Execute query with secure error handling."""
    try:
        result = execute_query(query)
        return result
    except DatabaseError as e:
        # Log full error for debugging
        logger.error(f"Database error: {e}")
        # Return safe message to user
        raise RuntimeError("Database operation failed. Please check your query.")
    except PermissionError:
        raise RuntimeError("Access denied. Check your permissions.")
```

### Avoid Shell Injection

Never construct shell commands from user input:

```python
# DANGEROUS - Never do this
user_input = "file.txt; rm -rf /"
os.system(f"cat {user_input}")  # Executes malicious command

# SAFE - Use subprocess with list arguments
import subprocess
user_input = "file.txt"
subprocess.run(["cat", user_input], check=True)  # Arguments are escaped
```

## Credential Management

### Never Hardcode Credentials

```python
# DANGEROUS
api_key = "sk-1234567890abcdef"  # Exposed in skill files

# SAFE - Use environment variables
import os
api_key = os.environ.get("API_KEY")
if not api_key:
    raise ValueError("API_KEY environment variable not set")
```

### Document Required Environment Variables

In SKILL.md:

```markdown
## Prerequisites

This skill requires the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `API_KEY` | Service API key | Yes |
| `LOG_LEVEL` | Logging verbosity (default: INFO) | No |

Set these before using the skill:
```bash
export DATABASE_URL="postgresql://..."
export API_KEY="your-api-key"
```
```

## Audit Checklist

Before deploying a skill, verify:

### Scripts
- [ ] All scripts reviewed for unexpected network calls
- [ ] No hardcoded credentials or secrets
- [ ] Input validation on all user-provided data
- [ ] Path traversal prevention implemented
- [ ] No shell command construction from user input
- [ ] Appropriate error handling (no sensitive data in errors)
- [ ] Resource limits (timeouts, memory limits) where appropriate

### SKILL.md
- [ ] No sensitive information in instructions
- [ ] Required credentials documented as environment variables
- [ ] Security warnings for sensitive operations

### References and Assets
- [ ] No sensitive data in reference files
- [ ] Templates don't contain real credentials or PII
- [ ] Example data is synthetic, not real

## Third-Party Dependencies

### Vetting Dependencies

Before using external packages:

1. **Check popularity and maintenance**: Active development, recent releases
2. **Review security advisories**: Known vulnerabilities
3. **Audit for unexpected behavior**: Network calls, file access
4. **Pin versions**: Prevent unexpected updates

```python
# requirements.txt with pinned versions
requests==2.31.0
pandas==2.1.4
# Avoid: requests (unpinned - could change)
```

### Minimize Dependencies

Prefer standard library when possible:

```python
# Instead of installing 'requests' for simple HTTP
import urllib.request

def fetch_url(url: str) -> str:
    with urllib.request.urlopen(url) as response:
        return response.read().decode('utf-8')
```

## Sensitive Data Handling

### Data Classification

Define what data requires special handling:

| Classification | Examples | Handling |
|----------------|----------|----------|
| **Public** | Product names, public APIs | No restrictions |
| **Internal** | Internal docs, policies | Log access, don't expose externally |
| **Confidential** | Customer data, financials | Encrypt, audit, minimize retention |
| **Restricted** | Credentials, PII | Never log, encrypt at rest and transit |

### Logging Guidelines

```python
# DANGEROUS - Logs sensitive data
logger.info(f"Processing user {user_id} with SSN {ssn}")

# SAFE - Mask sensitive data
logger.info(f"Processing user {user_id}")  # SSN never logged
logger.debug(f"User data: {mask_pii(user_data)}")
```

## Incident Response

If a skill is compromised or misused:

1. **Disable immediately**: Remove skill from active use
2. **Audit logs**: Determine scope of exposure
3. **Rotate credentials**: Any credentials the skill accessed
4. **Notify stakeholders**: If sensitive data exposed
5. **Post-mortem**: Identify root cause and prevent recurrence
