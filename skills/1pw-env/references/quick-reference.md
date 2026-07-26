# Quick Reference — 1Password Environment System

Scannable lookup for common tasks, commands, and decisions.


## One-Liners

```bash
# Pattern A — zero-disk (preferred)
op run --env-file ~/.env.1p.tpl -- node app.js   # run command with secrets
opr python main.py                                # shorthand alias
op read "op://Dev Credentials/KEY/credential"    # single credential lookup

# Pattern B — env file (fallback)
/update-pw                                        # sync credentials from 1Password
source ~/.env.mcp                                 # manually source env vars

# Verification
echo "MY_KEY=${MY_KEY:+SET}"                     # check if credential is loaded
env | grep "^SUPABASE"                            # all env vars matching prefix
grep -c "^export" ~/.env.mcp                      # count loaded credentials

# 1Password CLI
op whoami                                         # check signed-in status
op account get                                    # check account details
op service-account ratelimit                      # check rate limit usage
op item list --vault "Dev Credentials"            # list all vault items
```


## Two Delivery Patterns

| Pattern | When to Use | Security | Command |
|---------|------------|----------|---------|
| **A: `op run`** | Interactive commands | Secrets never touch disk | `op run --env-file ~/.env.1p.tpl -- cmd` |
| **B: `~/.env.mcp`** | MCP servers, non-interactive | Plaintext file (chmod 600) | `/update-pw` then source |

**Default to Pattern A** unless biometric auth is unavailable.


## Secret Reference Syntax (`op://`)

```bash
# Basic
op://vault-name/item-name/field-name

# With env var (multi-environment)
op://$APP_ENV/mysql/password

# Query params
op://vault/item/field?attr=type
op://vault/item/otp?attr=otp
op://vault/item/key?ssh-format=openssh

# Template enclosed format (for op inject)
{{ op://Dev Credentials/item/credential }}
```


## File Locations

| File | Purpose | Commit? |
|------|---------|---------|
| `~/.env.1p.tpl` | Template (op:// refs only) | Yes |
| `~/.env.mcp` | Resolved credentials | Never |
| `~/.env.mcp.bak` | Previous backup | Never |
| `~/.env.mcp.lastrun` | Last sync timestamp | No |
| `~/.secrets/mcp.env` | Fallback | Never |
| `~/scripts/sync-env-from-1password.sh` | Sync script | Yes |

**Permissions:** `.env.mcp` and `.secrets/mcp.env` must be chmod 600.


## Critical Credentials (Checked After Every Sync)

| Variable | Purpose |
|----------|---------|
| AIRTABLE_API_KEY | Airtable base access |
| SUPABASE_URL | Supabase project URL |
| SLACK_BOT_TOKEN | Slack bot authentication |
| N8N_API_KEY | n8n workflow automation |
| VERCEL_ACCESS_TOKEN | Vercel deployment |
| KIT_YOUR_BRAND_MARKETING | Kit (ConvertKit) API |


## Rate Limits

| Plan | Reads/Hour | Writes/Hour | Daily Cap |
|------|-----------|-------------|-----------|
| Business | 10,000 | 1,000 | 50,000 |
| Individual/Families | 1,000 | 100 | 1,000–5,000 |

**Warning:** `/update-pw` reads 212+ items. Max 2-3 runs/hour.
For a single credential: `op read "op://Dev Credentials/VAR/credential"` instead.


## SDK Quick Start

```python
# Python: pip install onepassword-sdk
import onepassword
client = onepassword.Client(service_account_token=os.environ["OP_SERVICE_ACCOUNT_TOKEN"])
secret = client.secrets.resolve("op://Dev Credentials/VAR/credential")
```

```typescript
// TypeScript: npm install @1password/sdk
import { createClient } from "@1password/sdk";
const client = await createClient({ serviceAccountToken: process.env.OP_SERVICE_ACCOUNT_TOKEN! });
const secret = await client.secrets.resolve("op://Dev Credentials/VAR/credential");
```


## When to Run `/update-pw`

| Scenario | Action |
|----------|--------|
| After adding credential to 1Password | `/update-pw` |
| Credential variable shows empty | `/update-pw` |
| Auth error from tool/API | `/update-pw` |
| Session start / first use | `/update-pw` |
| After MacBook restart | `/update-pw` |
| Touch ID timeout in Claude Code | Run in Terminal.app |


## Troubleshooting Decision Tree

```
API key missing?
  ↓
Is it just one credential?
├─ YES → op read "op://Dev Credentials/VAR_NAME/credential"
└─ NO (multiple) → /update-pw
    ↓
    Worked?
    ├─ YES → Done
    └─ NO → Touch ID available?
        ├─ YES → Run in Terminal.app
        └─ NO → Is 1Password app open?
            ├─ YES → op signin, retry
            └─ NO → Open app, wait 10s, retry
```


## Do's and Don'ts

**DO:**
- Use `op run --env-file` or `opr` for interactive commands (Pattern A)
- Use service accounts for automated systems and AI agents
- Use 1Password SSH agent instead of ~/.ssh/ key files
- Scope agent vaults to minimum needed credentials
- Run `/update-pw` when adding credentials

**DON'T:**
- Commit `.env.mcp` or `.env` to git
- Edit `~/.env.mcp` manually
- Hardcode credentials in code
- Pass credentials through LLM prompts or context windows
- Give AI agents access to all 212 credentials
- Run `/update-pw` more than 2-3 times per hour


## Credential Categories (212+)

| Category | Count | Prefix Examples |
|----------|-------|-----------------|
| AI/ML | 40+ | OPENAI_*, ANTHROPIC_*, CLAUDE_*, GROQ_* |
| Cloud | 25+ | SUPABASE_*, AWS_*, GITHUB_*, VERCEL_* |
| Integration | 50+ | SLACK_*, AIRTABLE_*, N8N_*, ZOHO_* |
| Media/Video | 20+ | HEYGEN_*, JSON2VIDEO_*, REPLICATE_* |
| Payments | 10+ | STRIPE_*, PAYMENT_* |
| Other | 60+ | Project-specific keys |


**Full docs:** the 1Password documentation
