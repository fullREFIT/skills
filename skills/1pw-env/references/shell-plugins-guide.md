# Shell Plugins Guide — Biometric CLI Authentication

Interactive CLI authentication using 1Password shell plugins and wrapper functions. Replaces plaintext credential exposure for manual CLI work with biometric authentication.

**Status:** Wrapper functions active with env var fallback. Full biometric auth pending 1Password app/CLI connection fix.


## Architecture

```
Interactive CLI (manual) → Shell Plugin / Wrapper → 1Password → Biometric Auth
MCP Servers (auto-start) → Environment Variables → ~/.env.mcp (unchanged)
Edge Functions (deployed) → Environment Variables (unchanged)
```

Shell plugins apply ONLY to interactive CLI work. MCP servers and Edge Functions continue using environment variables since they have no interactive auth available.


## opr — Universal op run Alias

The `opr` function is the fastest way to run any command with zero-disk secrets:

```bash
opr() {
  op run --env-file ~/.env.1p.tpl -- "$@"
}
```

```bash
opr node app.js
opr python main.py
opr npm run deploy
```


## Currently Active Wrappers

These wrapper functions are defined in `~/.zshrc` and fetch credentials on-demand from 1Password:

### Supabase

```bash
supabase() {
  local token=$(op read "op://Dev Credentials/Supabase Project/credential" 2>/dev/null) || \
    token="$SUPABASE_ACCESS_TOKEN"
  local project=$(op read "op://Dev Credentials/Supabase Project/PROJECT_REF" 2>/dev/null)
  SUPABASE_ACCESS_TOKEN="$token" \
  SUPABASE_PROJECT_REF="$project" \
  command supabase "$@"
}
```

Fallback: `SUPABASE_ACCESS_TOKEN` from environment.

### n8n

```bash
n8n() {
  local key=$(op read "op://Dev Credentials/n8n API Key/credential" 2>/dev/null) || \
    key="$N8N_API_KEY"
  N8N_API_KEY="$key" \
  N8N_API_URL="https://n8n.srv1236743.hstgr.cloud" \
  command n8n "$@"
}
```

Fallback: `N8N_API_KEY` from environment.

### Google Cloud

```bash
gcloud-secure() {
  local key=$(op read "op://Dev Credentials/Google Cloud API Key/credential" 2>/dev/null) || \
    key="$GOOGLE_API_KEY"
  GOOGLE_API_KEY="$key" \
  command gcloud "$@"
}
```

Fallback: `GOOGLE_API_KEY` from environment.

### Netlify

```bash
netlify() {
  local token=$(op read "op://Dev Credentials/Netlify Personal Access Token/credential" 2>/dev/null) || \
    token="$NETLIFY_AUTH_TOKEN"
  NETLIFY_AUTH_TOKEN="$token" \
  command netlify "$@"
}
```

Fallback: `NETLIFY_AUTH_TOKEN` from environment.


## CLIs with Official 1Password Plugins

These use `source ~/.1password/plugins.sh` (add to `~/.zshrc`):

| CLI | Plugin Status | Setup |
|-----|--------------|-------|
| Stripe | Official plugin available | `source ~/.1password/plugins.sh` |
| GitHub (gh) | Official plugin available | `source ~/.1password/plugins.sh` |
| Vercel | Official plugin available | `source ~/.1password/plugins.sh` |
| AWS | Official plugin available | `source ~/.1password/plugins.sh` |


## Creating Custom Vault Items

For CLIs without official plugins, create vault items in 1Password:

1. Open 1Password → Create Item → API Credential
2. Name: descriptive (e.g., `Supabase Project`)
3. Add fields: API Token, plus any custom fields (PROJECT_REF, API_URL)
4. Tag: `#cli`
5. Save

The `op read` path format: `op://[VaultName]/[ItemName]/[FieldName]`

**Always use "Dev Credentials" vault** — not "Personal".


## Testing

```bash
# Verify 1Password CLI works
op whoami

# Test reading a credential (should prompt for biometric)
op read "op://Dev Credentials/Supabase Project/credential"

# Test opr alias
opr echo "credentials loaded"

# Test wrapper function
supabase functions list

# Verify credential is NOT persisted in environment
env | grep SUPABASE_ACCESS_TOKEN  # Should return nothing after wrapper call
```


## Troubleshooting

| Issue | Fix |
|-------|-----|
| `op: command not found` | `brew install 1password-cli` |
| Biometric fails, falls back to password | 1Password Settings → Security → enable Touch ID |
| Vault item not found | Verify path: `op item list --vault "Dev Credentials"` |
| Plugin loaded but CLI still asks for password | Use wrapper function instead of official plugin |
| Permission denied on plugins.sh | `chmod +x ~/.1password/plugins.sh` |


## Decision Matrix

| Context | Method | Auth |
|---------|--------|------|
| Manual CLI work (you're typing) | `opr` alias or wrapper function | Biometric |
| MCP servers | Environment variables (`~/.env.mcp`) | None (auto-start) |
| Edge Functions | Environment variables (Supabase config) | None (deployed) |
| Non-interactive scripts | Environment variables | None |
| CI/CD pipelines | Service account token | Token |


## Implementation Status

| Phase | Status |
|-------|--------|
| Phase 1: Wrapper functions with fallback | ✅ Complete |
| Phase 2: opr alias added | ✅ Complete |
| Phase 3: Create vault items for custom CLIs | ⏳ Pending 1Password connection fix |
| Phase 4: Test wrapper functions with biometric | ⏳ Pending |
| Phase 5: Enable official plugins (Stripe, GitHub, etc.) | ⏳ Optional |
