# Troubleshooting

Common failure modes with recognition patterns and fixes. Read when a phase misbehaves.

---

## Quick Reference Table

| Problem | Likely Cause | Fix |
|---|---|---|
| `nvm: command not found` | nvm not sourced in current shell | `source "$HOME/.nvm/nvm.sh"` then retry |
| `pyenv: command not found` after `brew install pyenv` | pyenv init not in shell config | `eval "$(pyenv init -)"` in current shell; add to `~/.zshrc` for persistence |
| `npm ci` fails with "lockfile out of sync" | package.json changed without lockfile update | Report the mismatch; ask user before falling back to `npm install` |
| Port already in use on smoke test | Previous process didn't clean up | `lsof -i :PORT` to identify; report PID; do not auto-kill |
| Missing Homebrew formula on Apple Silicon | `/opt/homebrew/bin` not on PATH | `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile` |
| Repo requires Postgres/Redis | Service dependencies | Report and stop. Do not auto-install databases. |
| `.env.example` placeholders look like fake secrets | They are — user must fill them | List the vars; stop until filled |
| `pnpm install` says package manager mismatch | corepack expecting specific pnpm version | `corepack enable && corepack prepare pnpm@<version> --activate` |
| Python venv activates but `pip install` fails with permissions | venv not actually activated, installing to system Python | Check `which pip` — must show path inside `.venv` |
| `gh api` rate limited during recon | Unauthenticated GitHub API calls hit 60/hour limit | Run `gh auth login`, or fall back to shallow clone |

---

## Recognition Patterns

### Pattern 1: Sycophantic Confirmation (most dangerous)

**Recognition:** The agent reports "Setup complete!" or "Phone Connect is ready to go!" without having run any verification. The final report is filled with `success: true` markers but the `Issues encountered` field is empty even when smoke test was skipped.

**Why it happens:** Long setup prompts create pressure to "finish." The agent confirms success to end the task. This is a confirmed failure mode from v6.0 of the Strategist spec.

**Fix:** Require the Phase 8 final report to include either a passing smoke test OR an explicit `Smoke test: SKIPPED` with reason. Empty smoke test section = invalid report = not done.

### Pattern 2: Silent Toolchain Assumption

**Recognition:** The agent runs `npm install` on a repo that has `pnpm-lock.yaml` and no `package-lock.json`. First symptom is usually a warning about lockfile regeneration that the agent ignores.

**Why it happens:** npm is the default mental model; agents reach for `npm install` before reading the lockfile.

**Fix:** Phase 1 recon must output the detected package manager in the Recon Report before Phase 4 runs. If the Recon Report says `pnpm` and Phase 4 runs `npm`, that's a phase-skip violation.

### Pattern 3: Global Install Pollution

**Recognition:** Agent runs `pip install <package>` without a virtualenv, or `npm install -g <package>` for something the repo uses. Other projects on the machine break later.

**Why it happens:** Agents default to global installs because they're simpler. Local virtualenvs require activation steps the agent forgets.

**Fix:** Phase 3 explicitly requires virtualenv creation for Python. Phase 4 specifies project-local install commands. Never use `-g` flags unless the package is a system-level CLI the user explicitly wants globally (and that's the user's decision, not the setup flow's).

### Pattern 4: .env Overwrite

**Recognition:** User re-runs setup on an existing clone. Their filled-in `.env` gets overwritten with the empty template. API keys lost.

**Why it happens:** Phase 5 does `cp .env.example .env` unconditionally.

**Fix:** Always check `[ ! -f .env ]` before copying. Never overwrite an existing `.env`. Phase 2 has the same principle for the clone directory.

### Pattern 5: Productionization Creep

**Recognition:** Agent generates `.bat` launchers, desktop shortcuts, or systemd services without being asked. Often triggered by the agent having seen the Phone Connect installer prompt or similar consumer-app setup patterns.

**Why it happens:** The Phone Connect prompt (and similar) includes productionization as part of setup. Agents pattern-match and reproduce.

**Fix:** Phase 7 explicitly bans productionization. If the agent generates a shortcut anyway, the agent skipped Phase 7 — not a skill failure, an agent obedience failure. Flag and either retry with a stricter agent or tell the agent to re-read Phase 7.

### Pattern 6: Ambiguity Override

**Recognition:** Recon Report lists `GAPS / AMBIGUITIES` but agent proceeds anyway, guessing at the toolchain. Installation appears to succeed but smoke test fails or produces wrong runtime behavior.

**Why it happens:** Agents optimize for completion. Stopping at the decision gate feels like failure to some agents.

**Fix:** Phase 1 has an explicit decision gate. Agents that ignore it need to be re-prompted with "re-read Phase 1 and stop at the decision gate." If the agent repeatedly ignores the gate, route to a different agent.

---

## When to Stop Completely

These situations are not recoverable within the skill and should halt execution:

1. **Repo requires services the skill cannot install** (Postgres, Redis, Kafka). Report and stop.
2. **Repo is archived or deprecated.** Check the repo banner during recon. Warn the user before proceeding.
3. **Repo has no dependency manifests at all.** Report as a recon gap and stop.
4. **Credentials required in env are not retrievable** (corporate SSO, keys behind a paywall). User must resolve out-of-band.
5. **Clone fails with auth error** on a private repo. Direct the user to `gh auth login` or SSH key setup.
6. **User's disk is full** or other system-level errors. Surface the error; do not retry.

Stopping cleanly with a clear reason beats pushing through and producing a broken install.
