---
name: 1pw-env
description: "Manage credentials across all projects using the 1Password environment variable system. Handles op run zero-disk secret injection, syncing credentials from 1Password vault to shell environment, adding new credentials, service account setup for AI agents, SSH agent integration, SDK usage, rate limit awareness, and troubleshooting auth failures. Covers: 1Password vault → op run → subprocess (preferred) and vault → op CLI → ~/.env.1p.tpl → ~/.env.mcp → shell (fallback). MANDATORY TRIGGERS: 1password, credentials, env vars, environment variables, API key missing, auth failure, credential sync, op CLI, secrets management, .env.mcp, credential setup, new credential, Touch ID timeout, vault, shell plugins, biometric auth, service account, SDK, op run, SSH agent, rate limit, Connect Server, Environments, agentic autofill, OP_SERVICE_ACCOUNT_TOKEN, op run wrapper."
license: "MIT"
allowed-tools: Bash, Read, Grep, Glob
metadata:
  user-invocable: "true"
---
# 1Password Environment System Skill

Centralized credential management for all projects. One encrypted source of truth (1Password "Dev Credentials" vault) distributes 212+ credentials to Claude Code, MCP servers, AI agents, scripts, and workflows.

**Two delivery patterns. Use Pattern A by default.**


## Delivery Patterns

### Pattern A: `op run` — Zero-Disk Secrets (Preferred)

Spawns a subprocess with secrets injected as env vars. **Nothing written to disk.** stdout/stderr auto-masked. Requires biometric auth.

```bash
# Run any command with all credentials injected from template
op run --env-file ~/.env.1p.tpl -- node app.js
op run --env-file ~/.env.1p.tpl -- python main.py
op run --env-file ~/.env.1p.tpl -- npm start

# Shorthand alias (opr) — defined in ~/.zshrc
opr node app.js
opr python main.py

# Single credential lookup (no disk write)
op read "op://Dev Credentials/MY_API_KEY/credential"
```

**Use when:** Interactive commands, deployments, testing — any context with biometric auth available.

### Pattern B: `~/.env.mcp` File — Fallback for Non-Interactive Systems

```bash
/update-pw   # Syncs vault → ~/.env.1p.tpl → ~/.env.mcp, chmod 600
```

Writes plaintext credentials to disk (chmod 600). Auto-sourced by `~/.zshrc`.

**Use when:** MCP servers (need env vars at startup), cron jobs, non-interactive scripts.

**Why both exist:** MCP servers start automatically with no biometric auth available. Everything else should use Pattern A.


## Core Operations

### Sync credentials (Pattern B)

```bash
/update-pw
```

Reads all items from "Dev Credentials" vault, generates `~/.env.1p.tpl`, resolves via `op inject` (single batch call), writes `~/.env.mcp` chmod 600.

**Rate limit note:** Full sync uses `op inject` (one batch call) — much faster than the old sequential approach. Still, avoid running more than 2-3 times/hour. For one credential, use single-item mode: `~/scripts/sync-env-from-1password.sh --item ITEM_TITLE`.

### When to sync

| Situation | Action |
|-----------|--------|
| After adding credential to 1Password | `/update-pw` |
| Credential shows empty | `/update-pw` |
| 401 Unauthorized | `/update-pw` |
| Inside Claude Code (no Touch ID) | `/update-pw` — auto-uses Keychain service account |
| After MacBook restart | `/update-pw` |

### How auth works per environment

`~/scripts/sync-env-from-1password.sh` self-selects its auth method:

- **Terminal:** biometric (Touch ID) via the 1Password desktop app — unchanged.
- **Claude Code / cron / any non-interactive context:** biometric can't engage
  (the desktop integration only authorizes recognized terminal apps and there's
  no foreground prompt), so the script falls back to the read-only
  `op-mcp-secure-readonly` service account token in the macOS Keychain
  (service `op-mcp-secure`, account `<your-account>`). The token is exported only into
  the script's own process — it never enters the interactive shell.

No "run it in Terminal" step is needed anymore. `/update-pw` works in Claude Code.


## Adding New Credentials

1. Open **1Password app** → "Dev Credentials" vault → New item
2. **Title:** Exact env var name (`MY_NEW_API_KEY`)
3. **Password field:** Paste the value
4. **Tags:** Pick existing tag or leave untagged
5. Run `/update-pw`
6. Verify: `echo "MY_NEW_API_KEY=${MY_NEW_API_KEY:+SET}"`


## AI Agent Credential Security

**LLMs must never see credentials in plaintext.**

- AI agents access only the credentials they specifically need
- Each agent gets its own `OP_SERVICE_ACCOUNT_TOKEN` scoped to a vault with just its credentials
- Do NOT give agents access to all 212 credentials
- Do NOT pass credentials through LLM prompts or context windows
- 1Password shipped an official MCP server (May 2026) where secret values never enter the model's context window. Evaluate at: https://www.1password.dev/environments/mcp-codex-server

### Service Account Pattern (for agents)

```python
# Python SDK
import onepassword
client = onepassword.Client(
    service_account_token=os.environ["OP_SERVICE_ACCOUNT_TOKEN"]
)
api_key = client.secrets.resolve("op://Agent-Frank/OPENAI_API_KEY/credential")
```

```bash
# CLI pattern
export OP_SERVICE_ACCOUNT_TOKEN="ops_eyJ..."
OPENAI_KEY=$(op read "op://Agent-Frank/OPENAI_API_KEY/credential")
```

### Agent Vault Scoping (Phase 3 — in progress)

| Agent | Vault | Service Account Token Var |
|-------|-------|--------------------------|
| Frank COO | Agent-Frank | FRANK_SERVICE_ACCOUNT_TOKEN |
| Dave bot | Agent-Dave | DAVE_SERVICE_ACCOUNT_TOKEN |
| n8n workflows | Workflow-Credentials | N8N_SERVICE_ACCOUNT_TOKEN |


## Service Accounts

Non-human 1Password identities for headless/automated systems. Token format: `ops_` prefix.

### Rate Limits

| Plan | Reads/Hour | Writes/Hour | Daily Cap |
|------|-----------|-------------|-----------|
| Business | 10,000 | 1,000 | 50,000 |
| Individual/Families | 1,000 | 100 | 1,000–5,000 |

Check usage: `op service-account ratelimit`

**Warning:** Permissions are **immutable after creation** — to change vault access, create a new service account.

### Create service account (1Password web console)

1. Go to my.1password.com → Service Accounts
2. Create with read-only access to the specific vault only
3. Store token in "Dev Credentials" vault as `AGENT_SERVICE_ACCOUNT_TOKEN`
4. Run `/update-pw` to make token available as env var


## SDKs — Programmatic Access

Official SDKs embed a Rust core — not CLI wrappers. Use in application code.

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


## SSH Agent Integration

1Password's SSH agent: private keys never leave 1Password, biometric approval per operation.

```bash
# 1. Enable: 1Password app → Settings → Developer → SSH Agent → Enable
# 2. Add to ~/.ssh/config:
Host *
  IdentityAgent "~/Library/Group Containers/2BUA8C4S2C.com.1password/t/agent.sock"

# 3. Git commit signing:
git config --global gpg.format ssh
git config --global gpg.ssh.program "/Applications/1Password.app/Contents/MacOS/op-ssh-sign"
git config --global commit.gpgsign true
git config --global user.signingkey "ssh-ed25519 AAAA..."
```

Check socket exists: `ls ~/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock`


## Shell Plugin Wrappers

Biometric CLI auth for interactive use. Defined in `~/.zshrc`:

| Wrapper | Service | Vault |
|---------|---------|-------|
| `opr` | Any command | Dev Credentials (op run) |
| `supabase` | Supabase CLI | Dev Credentials |
| `n8n` | n8n CLI | Dev Credentials |
| `gcloud-secure` | Google Cloud | Dev Credentials |
| `netlify` | Netlify CLI | Dev Credentials |


## Verification & Diagnostics

```bash
echo "VAR_NAME=${VAR_NAME:+SET}"           # Check single credential
env | grep "^SUPABASE"                     # All vars matching prefix
grep -c "^export" ~/.env.mcp               # Total loaded credentials
op whoami                                  # Check CLI signed-in status
op service-account ratelimit               # Check rate limit usage
```


## Troubleshooting

```
API key empty or auth failure?
  ↓
  Single credential? → op read "op://Dev Credentials/VAR_NAME/credential"
  Multiple? → /update-pw
  ↓
  Worked? → Done
  ↓ No
  In Claude Code? → /update-pw auto-uses Keychain service account; if it warns
    the token is missing, re-add the op-mcp-secure Keychain item (Terminal, once)
  In Terminal? → 1Password app open? Settings → Developer → CLI integration ON
  Otherwise → Open 1Password app, wait 10s, retry
```

| Error | Cause | Fix |
|-------|-------|-----|
| `authorization timeout` | Touch ID can't prompt in Claude Code | Now auto-handled: `/update-pw` falls back to the Keychain service account |
| `not currently signed in` (Claude Code) | No biometric + no Keychain token | Re-add `op-mcp-secure` Keychain item (Terminal, once) |
| `op inject ... cannot prompt for confirmation` | Output file exists, no TTY | Fixed — script now passes `-f` to `op inject` |
| `does not have a field 'credential'` | SSH-key/document item in vault | Fixed — script skips `SSH_KEY`/`DOCUMENT` categories |
| `No items found in vault` | CLI can't access vault | Open 1Password app, verify vault |
| `op command not found` | CLI not installed | `brew install 1password-cli` |
| `account is not signed in` | Desktop app CLI integration off | 1Password → Settings → Developer → Enable CLI integration |
| Rate limit / 15-min block | Too many reads | Wait 15+ min, use `op read` for single creds |


## File Locations

| File | Purpose | Commit? |
|------|---------|---------|
| `~/.env.1p.tpl` | Template (op:// refs only) | Yes |
| `~/.env.mcp` | Resolved credentials (chmod 600) | Never |
| `~/scripts/sync-env-from-1password.sh` | Sync script | Yes |
| `~/.env.mcp.lastrun` | Last sync timestamp | No |


## Security Rules

- **Never** hardcode credentials in source code
- **Never** commit `.env.mcp` or any resolved credential file
- **Never** pass credentials through LLM context windows
- **Never** give AI agents access to all 212 credentials — scope vaults
- **Never** edit `~/.env.mcp` manually — regenerate via `/update-pw`
- `~/.env.1p.tpl` is safe to commit (op:// references only)


## Reference Files

| File | Contents |
|------|----------|
| [`references/master-guide.md`](references/master-guide.md) | Complete architecture, service accounts, SSH agent, SDKs, Environments, FAQ |
| [`references/example-project-setups.md`](references/example-project-setups.md) | Node.js, Python, n8n, Docker, Next.js, CI/CD, op run patterns |
| [`references/shell-plugins-guide.md`](references/shell-plugins-guide.md) | Shell plugin setup, wrapper functions, biometric auth |
| [`references/quick-reference.md`](references/quick-reference.md) | One-liners, categories, do's/don'ts, rate limits |
