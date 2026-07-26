# Phase Details — Expanded Guidance

Per-phase detail that doesn't fit in the main SKILL.md body. Read the section matching the current phase.

---

## Phase 0 — Full Preflight Command List

If `scripts/detect-stack.sh` is unavailable, run these manually:

```bash
echo "=== OS ===" && uname -a
echo "=== Shell ===" && echo $SHELL
echo "=== Languages ==="
node --version 2>/dev/null && npm --version 2>/dev/null
python3 --version 2>/dev/null && pip3 --version 2>/dev/null
go version 2>/dev/null
rustc --version 2>/dev/null && cargo --version 2>/dev/null
ruby --version 2>/dev/null
deno --version 2>/dev/null
bun --version 2>/dev/null
echo "=== Package managers ==="
brew --version 2>/dev/null | head -1
pnpm --version 2>/dev/null
yarn --version 2>/dev/null
uv --version 2>/dev/null
echo "=== Version managers ==="
nvm --version 2>/dev/null || echo "nvm: not loaded in this shell"
pyenv --version 2>/dev/null
asdf --version 2>/dev/null
mise --version 2>/dev/null
echo "=== Tools ==="
git --version 2>/dev/null
gh --version 2>/dev/null | head -1
docker --version 2>/dev/null
op --version 2>/dev/null
```

On Windows PowerShell, replace `2>/dev/null` with `2>$null` and `head -1` with `Select-Object -First 1`.

---

## Phase 1 — Manifest Priority Order

When multiple manifests exist, resolve conflicts using this order:

1. **Lockfile** (most authoritative) — `pnpm-lock.yaml` > `yarn.lock` > `package-lock.json` > `bun.lockb`. If two lockfiles exist, that's a repo bug — pick the newer one and report the conflict.
2. **Manifest** — `package.json`, `pyproject.toml`, etc.
3. **README** — lowest priority. README often lags behind lockfile changes.

A repo with `pnpm-lock.yaml` and a README saying `npm install` should be installed with `pnpm`. Flag the README discrepancy in the Recon Report's `GAPS / AMBIGUITIES` section.

### CI workflow as setup truth

`.github/workflows/*.yml` files are often the most reliable source of actual setup steps. Look for `steps:` blocks with `run:` commands. These reveal:

- Which Node/Python version is actually tested
- The exact install command sequence that passes CI
- Any pre-install setup (service containers, env setup, cache restore)

When README and CI disagree, CI wins.

---

## Phase 3 — Version Manager Edge Cases

### nvm not loaded

If `nvm --version` returns "command not found" in a fresh shell, source nvm before use:

```bash
source "$HOME/.nvm/nvm.sh"
nvm install
nvm use
```

On systems where nvm is installed via Homebrew, the path may be `/opt/homebrew/opt/nvm/nvm.sh` (Apple Silicon) or `/usr/local/opt/nvm/nvm.sh` (Intel Mac).

### pyenv shims not active

If `pyenv --version` works but `python3` still shows the system Python, the pyenv init isn't in the shell. Run:

```bash
eval "$(pyenv init -)"
```

Then re-run version checks. If the repo has `.python-version`, pyenv auto-switches once init is loaded.

### asdf / mise conflicts

If both asdf and mise are installed, they can fight over `.tool-versions`. Prefer mise if the shell is already configured for it (check `mise --version` and `type mise`). Otherwise use asdf. Do not install both fresh — pick one.

### Windows

On Windows, use `nvm-windows` (different project from Unix nvm, incompatible syntax). Python version management on Windows is typically via `py` launcher or pyenv-win. Do not assume Unix nvm commands work.

---

## Phase 4 — Package Manager Decision Tree

### Node ecosystem

```
Detect lockfile →
  pnpm-lock.yaml → pnpm install --frozen-lockfile
  yarn.lock      → yarn install --frozen-lockfile
                   (check yarn --version; 1.x vs 3.x+ behave differently)
  bun.lockb      → bun install
  package-lock.json → npm ci
                     (fall back to npm install if lockfile mismatch)
  none           → npm install (report: no lockfile, results may vary)
```

If `packageManager` field exists in package.json (e.g., `"packageManager": "pnpm@9.0.0"`), use that exact package manager. Corepack will auto-fetch the right version.

### Python ecosystem

```
Detect config →
  pyproject.toml with [tool.poetry]           → poetry install
  pyproject.toml with [project] (PEP 621)     → uv sync (preferred) or pip install -e .
  requirements.txt                            → uv pip install -r requirements.txt
                                                (fall back to pip if no uv)
  Pipfile                                     → pipenv install
  setup.py only                               → pip install -e .
```

**Always use a project-local virtualenv.** If the repo doesn't specify one:

```bash
# Preferred
uv venv && source .venv/bin/activate

# Fallback
python3 -m venv .venv && source .venv/bin/activate
```

### Lockfile mismatch handling

If `npm ci` fails with "lockfile out of sync":

1. Report the mismatch to the user explicitly.
2. Ask: "Fall back to `npm install` (may change lockfile) or stop?"
3. Do not silently fall back. Lockfile changes are meaningful and the user may be in the middle of dependency debugging.

---

## Phase 5 — 1Password Integration Pattern

If the user has `op` (1Password CLI) installed and asks for it, offer this pattern (do not execute without confirmation):

Create `.env.1p.tpl`:

```
DATABASE_URL=op://Personal/myapp-database/url
OPENAI_API_KEY=op://Personal/OpenAI/credential
NGROK_AUTHTOKEN=op://Personal/ngrok/credential
STRIPE_SECRET_KEY=op://Personal/Stripe/secret-key
```

At runtime, resolve secrets:

```bash
op inject -i .env.1p.tpl -o .env
```

The `.env.1p.tpl` can be committed to git (it contains only references, not secrets). The resulting `.env` must stay in `.gitignore`.

### When NOT to use 1Password pattern

- The repo is open source and other contributors won't have the user's 1Password vault
- The secrets are ephemeral (dev-only, regenerated daily)
- The user hasn't asked for it

Default behavior: just `cp .env.example .env` and list the required vars. Only offer the 1Password pattern if the user invokes it or has it in their known workflow.

---

## Phase 6 — Smoke Test Selection

### Priority ladder

1. **Unit tests without external deps** — `npm test`, `pytest`, `cargo test`, `go test ./...`. Only if tests don't require database/network/API keys.
2. **Build** — `npm run build`, `cargo build --release`, `go build ./...`. Proves compilation but not runtime correctness.
3. **Type check / lint** — `tsc --noEmit`, `ruff check`, `mypy`. Fast, cheap validation.
4. **Health endpoint** — start the app, poll a health URL, shut down. Only if the app starts cleanly in under 30 seconds without external services.
5. **Skip** — if none of the above work without secrets or services, skip and report.

### When to skip

- Integration tests requiring a live database
- Tests requiring API keys the user hasn't filled in yet
- Long-running test suites (>2 minutes) that would hide setup success behind test debugging

Skipping is the right move. Fabricating success is not.

### What to report when skipping

```
Smoke test: SKIPPED
Reason: Tests require DATABASE_URL and live Postgres instance.
Recommended manual verification:
  1. Fill in .env (DATABASE_URL, REDIS_URL)
  2. docker compose up -d postgres redis
  3. npm test
```

Honest skip with recommended verification beats false success.
