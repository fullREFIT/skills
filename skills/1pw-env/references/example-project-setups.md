# Example Project Setups — 1Password Environment System

Real-world integration patterns. **Default: Pattern A (`op run`) for interactive use. Pattern B (env file) for MCP servers and non-interactive scripts.**


## Pattern A: op run (Preferred — Zero-Disk Secrets)

Run any project with secrets injected at runtime. Nothing written to disk.

```bash
# Run project — secrets exist only in subprocess memory
op run --env-file ~/.env.1p.tpl -- node app.js
op run --env-file ~/.env.1p.tpl -- python main.py
op run --env-file ~/.env.1p.tpl -- npm start

# Shorthand alias
opr node app.js
opr npm run dev
```

Your code reads from `process.env` / `os.environ` as normal. No `.env` file needed.


## Pattern 1: Node.js / TypeScript

```javascript
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}
export const supabase = createClient(supabaseUrl, supabaseKey);
```

Run with: `opr node app.js`


## Pattern 2: Python

```python
import os
api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    raise ValueError('Missing OPENAI_API_KEY environment variable')
client = OpenAI(api_key=api_key)
```

Run with: `opr python main.py`


## Pattern 3: Python — SDK Direct Access (for agents)

Use when the script is headless or needs scoped credentials:

```python
import onepassword
import os

client = onepassword.Client(
    service_account_token=os.environ["OP_SERVICE_ACCOUNT_TOKEN"]
)
openai_key = client.secrets.resolve("op://Agent-Frank/OPENAI_API_KEY/credential")
slack_token = client.secrets.resolve("op://Agent-Frank/SLACK_BOT_TOKEN/credential")
```


## Pattern 4: Bash / Shell Scripts

```bash
#!/bin/bash
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Missing Supabase credentials. Run /update-pw or use opr" >&2
  exit 1
fi
curl -X GET "$SUPABASE_URL/rest/v1/my_table" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

Run with: `opr bash my-script.sh`


## Pattern 5: n8n Workflows

**Interactive start (preferred):**
```bash
opr n8n start
```

**Non-interactive (Pattern B fallback):**
```bash
/update-pw
n8n start
```

For n8n service account pattern, see `N8N-CREDENTIAL-PATTERNS.md`.


## Pattern 6: Docker Containers

**Pattern A (preferred):**
```bash
# Inject at runtime — nothing stored in container
opr docker run \
  -e SUPABASE_URL \
  -e SUPABASE_SERVICE_ROLE_KEY \
  my-app:latest
```

**Pattern B fallback:**
```bash
source ~/.env.mcp
docker run \
  -e SUPABASE_URL="$SUPABASE_URL" \
  -e SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  my-app:latest
```

docker-compose (reads from host shell after `opr` or source):
```yaml
services:
  app:
    build: .
    environment:
      SUPABASE_URL: $SUPABASE_URL
      SUPABASE_SERVICE_ROLE_KEY: $SUPABASE_SERVICE_ROLE_KEY
```


## Pattern 7: Next.js (Client + Server)

Server-side reads secrets directly. Client-side only gets `NEXT_PUBLIC_*` prefixed variables:

```typescript
// Server: lib/supabase.ts
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Client: lib/supabase-client.ts (public key only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

Run with: `opr npm run dev`


## Pattern 8: GitHub Actions (CI/CD)

Copy values from 1Password vault into GitHub repo secrets:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Load secrets from 1Password
        uses: 1password/load-secrets-action@v2
        with:
          export-env: true
        env:
          OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          SUPABASE_URL: op://Dev Credentials/SUPABASE_URL/credential
          SUPABASE_SERVICE_ROLE_KEY: op://Dev Credentials/SUPABASE_SERVICE_ROLE_KEY/credential
```


## Pattern 9: Claude Code Projects (CLAUDE.md reference)

```markdown
## Credentials
This project uses centralized 1Password credential management.
Preferred: `op run --env-file ~/.env.1p.tpl -- <command>` or `opr <command>`
Fallback: Run `/update-pw` to sync to environment.
Docs: QUICK-REFERENCE.md in the 1pw-env skill references/
```


## Exception: Project-Specific .env File

Only when a project needs **different** credentials from the global set (e.g., a separate Supabase project):

```bash
# .env (add to .gitignore, NEVER commit)
SUPABASE_URL=https://different-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```


## Decision Matrix

| Scenario | Approach |
|----------|----------|
| Interactive dev — max security | `opr command` (Pattern A) |
| MCP servers, cron jobs | `~/.env.mcp` via `/update-pw` (Pattern B) |
| AI agents | SDK + service account scoped to minimal vault |
| CI/CD pipelines | 1Password GitHub Action or platform secret store |
| Docker container | `opr docker run -e VAR` |
| Project needs different creds | `.env` in project root, in `.gitignore` |


## Quick Checklist for Any New Project

1. Verify needed credentials exist in "Dev Credentials" vault
2. Run `/update-pw` (or use `opr` for interactive commands)
3. Code reads from `process.env.VAR_NAME` (not hardcoded)
4. No `.env` file committed to git
5. Test: `echo $NEEDED_VAR` shows a value (or `opr env | grep NEEDED_VAR`)
6. Test: Run code, verify auth succeeds
