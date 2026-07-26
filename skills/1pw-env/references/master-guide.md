# 1Password Environment System — Master Reference

Complete architecture, FAQ, and integration details for the 1Password credential management system.

**Source of truth location:** Your project root — wherever you keep your credential templates and `.env.1p.tpl` files.

---

## Sync Script Behavior

The sync script at `~/scripts/sync-env-from-1password.sh` performs this sequence:

1. Reads all items from the "Dev Credentials" vault via `op item list --vault "Dev Credentials" --format json`
2. Groups items by 1Password tags
3. Generates `~/.env.1p.tpl` with `op://Dev Credentials/<ITEM_TITLE>/credential` references for each item
4. Iterates through each `op://` reference and calls `op read` to resolve
5. Writes resolved values to `~/.env.mcp` as `export VAR_NAME="value"` lines
6. Sets permissions to 600
7. Reports resolved count and any failures

The script uses Python3 for JSON parsing and template generation, embedded as heredoc scripts. It creates a backup at `~/.env.mcp.bak` before each run.

The `/update-pw` slash command in Claude Code invokes this same script.

---

## Credential Resolution Flow

```
Item in 1Password vault
  Title: AIRTABLE_API_KEY
  Password field: <actual key value>
  Tags: ["Integrations"]
    ↓
Template line in ~/.env.1p.tpl:
  export AIRTABLE_API_KEY="op://Dev Credentials/AIRTABLE_API_KEY/credential"
    ↓
op read resolves to actual value:
  export AIRTABLE_API_KEY="patXXXXXXXXXX..."
    ↓
Written to ~/.env.mcp, sourced by ~/.zshrc
```

**Critical:** The 1Password item **title** must exactly match the desired environment variable name. The sync script uses the title as-is for the `export` statement.

---

## Fallback Chain

```
Primary:  op read (biometric) → ~/.env.mcp
Fallback: ~/.secrets/mcp.env (plaintext, pre-populated)
Last resort: Manual export in shell
```

The `~/.zshrc` credential loading logic:

```bash
if command -v op &> /dev/null && [[ -n "$OP_SESSION_my" ]]; then
    eval "$(op run --env-file ~/.env.mcp -- printenv | grep -E '^[A-Z_]+=')"
else
    [ -f ~/.env.mcp ] && source ~/.env.mcp
fi
```

---

## Static Local Config

These entries appear in `~/.env.1p.tpl` but are NOT from 1Password (hardcoded in the template):

```bash
export PLAYWRIGHT_MCP_BROWSER="chrome"
export PLAYWRIGHT_MCP_HEADLESS="true"
```

---

## FAQ: Complete Reference

### Credentials & Vault

**Q: How many credentials?** 212 items as of 2026-03-19, across categories: Tracker Products, Cloud Services, AI Services, Integrations, LLMs & Inference, Video & Media, Payment & Billing, Untagged.

**Q: Can team members use this?** No. Personal to your 1Password account. Others replicate the pattern with their own vault.

**Q: Can I use this for non-API credentials?** Yes — passwords, tokens, any secret. SSH keys should be stored in the 1Password SSH agent, not `~/.ssh/` files.

**Q: How do I know which credentials a project needs?** Search code for `process.env.`, `os.environ.get()`, `$VAR_NAME`, or check `.env.example` files.

### Files & Commits

**Q: What's safe to commit?** `~/.env.1p.tpl` (only op:// references). Never commit `.env.mcp`, `.secrets/`, or project `.env` files.

**Q: Why both .env.1p.tpl and .env.mcp?** Template vs. resolved output. Template is safe to share; resolved file contains plaintext secrets.

**Q: What if I manually edit ~/.env.mcp?** It gets overwritten on next `/update-pw`. Always modify via 1Password vault + sync.

### Security

**Q: How secure is plaintext ~/.env.mcp?** Permissions 600 (owner-only), ephemeral (regenerated per sync), requires local machine access. For maximum security, use `op run --env-file` to avoid any plaintext on disk.

**Q: Can I hardcode credentials?** No. Exception: client-safe keys explicitly designed to be public (e.g., Supabase anon key).

### Operational

**Q: Is ~/.env.mcp the same as project .env?** No. `~/.env.mcp` is global (all projects). Project `.env` is local override.

**Q: What if 1Password is unavailable?** Falls back to `~/.secrets/mcp.env` (plaintext, 600 permissions). Less secure but functional.

**Q: /update-pw vs. running the script?** Same thing. `/update-pw` is the Claude Code slash command that runs `~/scripts/sync-env-from-1password.sh`.

---

## Integration Checklist for New Projects

- [ ] Project reads credentials from environment variables (not hardcoded)
- [ ] Required credentials exist in 1Password "Dev Credentials" vault
- [ ] `/update-pw` has been run to sync
- [ ] `$ENV_VAR` is accessible in project code
- [ ] Any `.env` files are in `.gitignore`
- [ ] No secrets committed to git history
- [ ] Project README documents required env vars

---

## 212 Credentials by Category

| Category | Count | Prefix Examples |
|----------|-------|-----------------|
| Tracker Products | 12 | `SUPABASE_TRACKER_*`, `OPENAI_API_TRACKER_*` |
| Cloud Services | 5 | `SUPABASE_*`, `DATABASE_CONNECTION_SECRET` |
| AI Services | 40+ | `OPENAI_API_*`, `ANTHROPIC_*`, `CLAUDE_API_*` |
| Integrations | 50+ | `SLACK_*`, `AIRTABLE_*`, `N8N_*`, `ZOHO_*`, `GITHUB_*` |
| LLMs & Inference | 30+ | `GROQ_*`, `FAL_*`, `REPLICATE_*` |
| Video & Media | 15+ | `HEYGEN_*`, `JSON2VIDEO_*` |
| Payment & Billing | 10+ | `STRIPE_API_*`, `PAYMENT_GATEWAY_*` |
| Untagged/Unknown | 50+ | Various project-specific keys |

Full listing: `cat ~/.env.1p.tpl`

---

## Advanced: op CLI Direct Access

```bash
# Read a single credential without full sync
op read "op://Dev Credentials/MY_API_KEY/credential"

# Run a command with credentials injected (no plaintext on disk)
op run --env-file ~/.env.1p.tpl -- your-command-here

# Shorthand alias (opr) — defined in ~/.zshrc
opr node app.js

# List all vault items
op item list --vault "Dev Credentials"

# Check CLI status
op whoami
op account get

# Check service account rate limit usage
op service-account ratelimit
```

---

## AI Agent Credential Security

**Core principle: LLMs must never see credentials in plaintext.**

- AI agents should only access the specific credentials they need
- Credentials should be resolved at runtime, not baked into prompts or context
- Each agent gets its own `OP_SERVICE_ACCOUNT_TOKEN` scoped to a vault with just its credentials
- 1Password explicitly rejects MCP for credential delivery (credentials would enter the LLM context window)

### Service Account Pattern for Agents

```python
# Python SDK — token comes from environment variable, never hardcoded
import onepassword
client = onepassword.Client(
    service_account_token=os.environ["OP_SERVICE_ACCOUNT_TOKEN"]
)
api_key = client.secrets.resolve("op://Agent-Frank/OPENAI_API_KEY/credential")
```

```bash
# CLI pattern — pull token from env after /update-pw
SLACK_TOKEN=$(op read "op://Agent-Frank/SLACK_BOT_TOKEN/credential")
```

### Agent Vault Scoping (Phase 3)

| Agent | Vault | Token Env Var |
|-------|-------|---------------|
| Frank COO | Agent-Frank | FRANK_SERVICE_ACCOUNT_TOKEN |
| Dave bot | Agent-Dave | DAVE_SERVICE_ACCOUNT_TOKEN |
| n8n workflows | Workflow-Credentials | N8N_SERVICE_ACCOUNT_TOKEN |

---

## Service Accounts

Non-human 1Password identities for headless/automated systems. Token format: `ops_` prefix (enables code scanner detection in repos).

### Rate Limits

| Plan | Reads/Hour | Writes/Hour | Daily Cap |
|------|-----------|-------------|-----------|
| Business | 10,000 | 1,000 | 50,000 |
| Individual/Families | 1,000 | 100 | 1,000–5,000 |

**Warning:** Permissions are **immutable after creation** — changing vault scope requires creating a new service account.

### Creation Pattern

1. Create in 1Password web console (my.1password.com → Service Accounts)
2. Scope to specific vault(s), read-only
3. Store token in "Dev Credentials" vault as `AGENT_SERVICE_ACCOUNT_TOKEN`
4. Run `/update-pw` to make available as env var
5. Reference as `$AGENT_SERVICE_ACCOUNT_TOKEN` — never hardcode the token value

---

## SSH Agent Integration

1Password's SSH agent: private keys never leave 1Password. Biometric approval per operation.

**Better than `~/.ssh/` files:** No private keys on disk, biometric per use, automatic key management, Git commit signing built in.

### Setup

1. Enable: **1Password app → Settings → Developer → SSH Agent → Enable**
2. Configure `~/.ssh/config`:
   ```
   Host *
     IdentityAgent "~/Library/Group Containers/2BUA8C4S2C.com.1password/t/agent.sock"
   ```
3. Git commit signing (run these three git config commands):
   - `git config --global gpg.format ssh`
   - `git config --global gpg.ssh.program "/Applications/1Password.app/Contents/MacOS/op-ssh-sign"`
   - `git config --global commit.gpgsign true`
   - Then add your public key from 1Password: `git config --global user.signingkey "ssh-ed25519 <your-public-key>"`

Verify socket exists: `ls ~/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock`

---

## 1Password SDKs

Official SDKs for Python, TypeScript/JavaScript, Go. Embed a compiled Rust core — not CLI wrappers.

```python
# Python: pip install onepassword-sdk
import onepassword
client = onepassword.Client(
    service_account_token=os.environ["OP_SERVICE_ACCOUNT_TOKEN"]
)
secret = client.secrets.resolve("op://Dev Credentials/OPENAI_API_KEY/credential")
```

```typescript
// TypeScript: npm install @1password/sdk
import { createClient } from "@1password/sdk";
const client = await createClient({
  serviceAccountToken: process.env.OP_SERVICE_ACCOUNT_TOKEN!,
});
const secret = await client.secrets.resolve("op://Dev Credentials/SLACK_BOT_TOKEN/credential");
```

Use SDKs in application code. Use CLI (`op read`, `op run`) in shell scripts.

---

## 1Password Environments (Beta)

Project-scoped env var management with zero-disk-write security via UNIX named pipe.

```bash
op run --environments <env-id> -- npm start
```

**Known issue:** Hot-reload tools (Vite, nodemon) watching `.env` files cause restart loops with the mounted pipe.

---

## Version History

| Date | Change |
|------|--------|
| 2026-03-23 | Shell plugins enhancement added |
| 2026-03-19 | Final consolidation: 212 credentials, complete docs |
| 2026-03-18 | Hybrid fallback strategy (op run + plaintext fallback) |
| 2026-03-17 | Zero-rotation approach finalized |
| 2026-03-13 | Initial migration from Airtable to 1Password |
