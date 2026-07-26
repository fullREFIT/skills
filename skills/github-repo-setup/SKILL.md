---
name: github-repo-setup
description: "Repository-agnostic setup agent that clones, inspects, installs, and smoke-tests any GitHub repository using the repo's own manifests rather than assumptions. Detects language stack (Node, Python, Rust, Go, Ruby, Deno, Bun, Docker) from lockfiles, aligns toolchains via version managers (nvm, pyenv, rustup, asdf, mise), installs with the correct package manager, handles .env setup, runs a minimum smoke test, and produces structured phase reports. Optimized for macOS arm64 with Homebrew, nvm, pyenv, and 1Password CLI; branches for Linux and Windows. Use when setting up a cloned repository, evaluating a new GitHub project, reproducing an environment, or onboarding a codebase. MANDATORY TRIGGERS: github repo setup, clone and install, repo setup, set up repository, install this repo, set up this project, onboard codebase, reproduce environment, new repo, fresh repo, get this repo running, set up dev environment, repo install, universal setup, github setup."
license: MIT
---

# GitHub Repo Setup

Clone, reconnaissance, install, configure, and smoke-test any GitHub repository on the current machine. Detect what the repo provides before installing. Verify what's already present before installing fresh. Install only what's missing. Never assume.

## Table of Contents

1. [Inputs](#inputs)
2. [Phase 0 — Preflight](#phase-0--preflight)
3. [Phase 1 — Reconnaissance](#phase-1--reconnaissance)
4. [Phase 2 — Install Directory](#phase-2--install-directory)
5. [Phase 3 — Toolchain Alignment](#phase-3--toolchain-alignment)
6. [Phase 4 — Dependency Install](#phase-4--dependency-install)
7. [Phase 5 — Environment Configuration](#phase-5--environment-configuration)
8. [Phase 6 — Smoke Test](#phase-6--smoke-test)
9. [Phase 7 — Productionization Boundary](#phase-7--productionization-boundary)
10. [Phase 8 — Final Report](#phase-8--final-report)
11. [Operating Rules](#operating-rules)
12. [Reference Files](#reference-files)

---

## Inputs

Required:
- **Repository URL** — HTTPS or SSH GitHub URL

Optional (leave blank to auto-detect):
- Install directory override
- Branch or tag override
- Skip-phase list (comma-separated phase numbers — rarely used)

Execute the phases in order. Do not skip reconnaissance. Do not install anything before reading the repo's own instructions. If a phase fails, stop and report — do not improvise past a failure.

---

## Phase 0 — Preflight

Detect host OS and report which branch the skill is executing on: `macOS` / `Linux` / `Windows`. All inline command examples in later phases assume macOS; adjust syntax for other OSes.

Run the stack detection script:

```bash
bash scripts/detect-stack.sh
```

If the script is unavailable, run the equivalent checks manually — see [`references/phase-details.md`](references/phase-details.md) Phase 0 section for the full command list.

Output a compact table with columns: `Tool | Installed? | Version`. Mark missing tools with `MISSING`. Do not fail the phase on missing tools — later phases decide which ones matter for this repo.

---

## Phase 1 — Reconnaissance

**Do not install dependencies yet.** Clone shallowly to a temp location only if the repo metadata cannot be read via the GitHub API. Prefer `gh api` or raw file fetches over full clones for this phase.

Read and summarize:

1. **README.md** — what does the project do? What setup steps are documented?
2. **Dependency manifests** — `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `pyproject.toml`, `requirements.txt`, `Pipfile`, `Cargo.toml`, `go.mod`, `Gemfile`, `composer.json`, `deno.json`, `bun.lockb`
3. **Containerization** — `Dockerfile`, `docker-compose.yml`, `devcontainer.json`
4. **Task runners** — `Makefile`, `justfile`, `Taskfile.yml`, `package.json` scripts
5. **Environment config** — `.env.example`, `.env.template`, `.envrc`, `config/` directory
6. **CI hints** — `.github/workflows/*.yml` often reveal the real install and test commands
7. **Version pins** — `.nvmrc`, `.node-version`, `.python-version`, `.tool-versions`, `rust-toolchain.toml`
8. **Repo-provided launchers** — `scripts/`, `bin/`, or `shortcuts/` folders with existing runners

Output the Recon Report using the template at [`assets/recon-report-template.md`](assets/recon-report-template.md). Fill in every section. If a section has no content, write `none detected` — do not omit the section.

**Decision gate:** If the Recon Report's `GAPS / AMBIGUITIES` section contains entries that affect install or run behavior, stop and ask the user to clarify. Do not proceed with assumptions that could install the wrong toolchain.

For manifest-to-action mappings (which lockfile means which installer), read [`references/phase-details.md`](references/phase-details.md) Phase 4 section.

---

## Phase 2 — Install Directory

Determine install directory:

- If the user provided an override, use it.
- Otherwise default to `$HOME/GitHub/<owner>/<repo>` on macOS/Linux, `$env:USERPROFILE\GitHub\<owner>\<repo>` on Windows.
- If the directory exists and contains the same cloned repo (remote URL matches), run `git pull` instead of re-cloning.
- If the directory exists but is a different repo or not a git repo, **stop and ask** — do not overwrite.

Canonical implementation:

```bash
OWNER_REPO=$(echo "$REPO_URL" | sed -E 's#.*github.com/([^/]+/[^/.]+).*#\1#')
DIR="$HOME/GitHub/$OWNER_REPO"

if [ -d "$DIR/.git" ]; then
  EXISTING=$(git -C "$DIR" config --get remote.origin.url)
  if echo "$EXISTING" | grep -q "$OWNER_REPO"; then
    echo "Repo already cloned — pulling latest..."
    git -C "$DIR" pull
  else
    echo "ERROR: $DIR exists but points to a different repo ($EXISTING). Stopping."
    exit 1
  fi
else
  mkdir -p "$(dirname "$DIR")"
  git clone "$REPO_URL" "$DIR"
fi
cd "$DIR"
```

If a branch or tag override was provided, `git checkout` after clone.

---

## Phase 3 — Toolchain Alignment

Use the version pins detected in Phase 1. Prefer version managers over global installs.

- `.nvmrc` or `engines.node` in package.json → `nvm install && nvm use`. If nvm isn't loaded in the shell, source it first: `source "$HOME/.nvm/nvm.sh"`.
- `.python-version` or Python constraint in pyproject.toml → `pyenv install -s <version> && pyenv local <version>`.
- `rust-toolchain.toml` → rustup auto-respects it; run `rustup show` to confirm.
- `.tool-versions` (asdf/mise) → if asdf or mise is installed, run `asdf install` or `mise install`; otherwise read the file and install each pin via its native manager.

**Do not globally upgrade Node, Python, or Rust.** Repo pins are project-local.

If a required language runtime is missing entirely (e.g., no Go installed but the repo needs Go), install via Homebrew on macOS (`brew install go`) or the official installer on Linux/Windows. Report what was installed.

For cross-platform version-manager commands and shell-sourcing edge cases, read [`references/phase-details.md`](references/phase-details.md) Phase 3 section.

---

## Phase 4 — Dependency Install

Use the package manager the lockfile specifies. **Lockfile wins over README when they disagree** — a repo with `pnpm-lock.yaml` but a README that says `npm install` is a README bug, not an install instruction.

Quick mapping:

| Detected | Command |
|---|---|
| `package-lock.json` | `npm ci` (fall back to `npm install` if lockfile mismatch — report the mismatch) |
| `pnpm-lock.yaml` | `pnpm install --frozen-lockfile` |
| `yarn.lock` | `yarn install --frozen-lockfile` |
| `bun.lockb` | `bun install` |
| `requirements.txt` | Prefer `uv pip install -r requirements.txt`; fall back to `python3 -m pip install -r requirements.txt` if uv unavailable |
| `pyproject.toml` (poetry) | `poetry install` |
| `pyproject.toml` (uv/pep 621) | `uv sync` |
| `Pipfile` | `pipenv install` |
| `Cargo.toml` | `cargo build` (often deferred to run phase unless README says otherwise) |
| `go.mod` | `go mod download` |
| `Gemfile` | `bundle install` |

For Python, prefer a project-local virtualenv. If the repo doesn't define one, create `.venv` via `uv venv` or `python3 -m venv .venv`, then activate before installing.

For Docker-based repos with `docker-compose.yml`, the install step may be `docker compose build` — follow the README.

Full decision tree including Poetry vs uv detection, lockfile mismatch handling, and container-based workflows lives in [`references/phase-details.md`](references/phase-details.md) Phase 4 section.

---

## Phase 5 — Environment Configuration

If `.env.example` or `.env.template` exists and no `.env` is present, copy the template:

```bash
[ -f .env.example ] && [ ! -f .env ] && cp .env.example .env
```

Print the list of env vars the user needs to fill in, grouped by category (credentials, ports, feature flags). **Do not generate fake values.**

If `op` (1Password CLI) is installed, offer — but do not execute without confirmation — a templated `.env.1p.tpl` pattern. See [`references/phase-details.md`](references/phase-details.md) Phase 5 section for the 1Password integration pattern.

**Stop here** if any required env var is unfilled. Do not start the app with placeholder values.

---

## Phase 6 — Smoke Test

Run the minimum command that proves the install worked. In priority order:

1. `npm test` / `pnpm test` / `yarn test` / `bun test` — if a test script exists and doesn't require external services
2. `npm run build` / `pnpm build` — if the repo is a buildable app
3. `make check` / `make test` — if a Makefile exposes one
4. The repo's documented "start" command plus a health-check URL (e.g., `curl -f http://localhost:3000/health`) — only if the app starts cleanly without long-running prerequisites

If no smoke test is feasible without the user filling in secrets, say so and move on. **Do not fabricate success.** Sycophantic confirmation at this phase is the most common failure mode — see [`references/troubleshooting.md`](references/troubleshooting.md) for recognition patterns.

---

## Phase 7 — Productionization Boundary

**Do not generate any of the following unless the user explicitly asks for them:**

- Desktop shortcuts (`.lnk`, `.desktop`, `.app`)
- Windows `.bat` launchers when the repo already provides `package.json` scripts or a Makefile
- Context menu entries, Automator actions, or shell aliases
- systemd services, launchd plists, or Docker Compose overrides
- `README_SETUP.md` or any rewrite of the project's own documentation

These are *productionization* steps, not setup. They belong to user workflow preferences, not to a universal setup flow. If the user asks for them explicitly, ask which platform and which entry points, then generate — but not before.

---

## Phase 8 — Final Report

Output the final report using the template at [`assets/final-report-template.md`](assets/final-report-template.md). Fill in every section honestly. "Issues encountered" should be populated with anything the agent noticed but handled non-fatally (lockfile mismatches, skipped smoke test, missing optional env vars).

Stop. Do not suggest follow-up automation. The user decides what comes next.

---

## Operating Rules

These are invariant across all phases. Violating any one is a failure mode.

- **Never install without first completing Phase 1 recon.**
- **Never assume a toolchain.** Read the manifests.
- **Never overwrite** an existing `.env` or clone directory.
- **Never fabricate** test output, env values, or success messages.
- **Stop on ambiguity.** If the repo's setup is non-obvious, ask before guessing.
- **Prefer repo-provided scripts** over generating new ones. If `make dev` exists, use it. Do not write a `.bat` equivalent.
- **Version managers over global installs.** Use `nvm`, `pyenv`, `rustup`, `asdf`, `mise` before `brew install node` or `pip install --global`.
- **Report, don't narrate.** Output the structured reports at each phase. Don't explain what's about to run; run it and report the result.

Full rationale for each rule lives in [`references/agent-operating-rules.md`](references/agent-operating-rules.md).

---

## Reference Files

| File | Purpose |
|------|---------|
| [`references/phase-details.md`](references/phase-details.md) | Expanded per-phase guidance: stack detection details, lockfile-to-installer mapping, version manager edge cases, 1Password integration pattern |
| [`references/troubleshooting.md`](references/troubleshooting.md) | Common failure modes with recognition patterns and fixes |
| [`references/agent-operating-rules.md`](references/agent-operating-rules.md) | The eight operating rules with rationale and the failure mode each prevents |
| [`scripts/detect-stack.sh`](scripts/detect-stack.sh) | Deterministic Phase 0 preflight — produces the stack detection table |
| [`assets/recon-report-template.md`](assets/recon-report-template.md) | Phase 1 output template |
| [`assets/final-report-template.md`](assets/final-report-template.md) | Phase 8 output template |

Read the appropriate reference file when deeper context is needed. Do not duplicate their content into the main workflow.
