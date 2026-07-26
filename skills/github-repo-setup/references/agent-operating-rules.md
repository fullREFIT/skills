# Agent Operating Rules — Rationale

The eight rules from SKILL.md, expanded with the failure mode each prevents and why it matters.

---

## Rule 1: Never install without first completing Phase 1 recon

**Failure prevented:** Installing the wrong toolchain entirely. Running `npm install` on a Python-only repo, or `pip install` on a Node repo.

**Why it matters:** Installation is not reversible cleanly. Once you've run `npm install` in a repo, you've created `node_modules/` and possibly modified `package-lock.json`. Undoing that correctly requires the user to clean up manually. One wrong install can turn a 30-second setup into a 20-minute recovery.

**Enforcement:** Phase 4 should check that the Recon Report from Phase 1 exists and names a specific package manager. If there's no Recon Report in scope, Phase 4 must refuse to run.

---

## Rule 2: Never assume a toolchain

**Failure prevented:** Mental-model defaults (npm, pip, bare Python) instead of reading what the repo actually uses.

**Why it matters:** 2024-2026 has seen rapid package manager diversification. A repo using pnpm + uv + cargo in a mixed-language project is not unusual. Assuming npm + pip + single-language is wrong more often than it's right now.

**Enforcement:** Phase 1 recon reads every manifest. The Recon Report's `STACK DETECTED` section must name the specific package manager — not "Node" but "pnpm 9.x".

---

## Rule 3: Never overwrite an existing .env or clone directory

**Failure prevented:** Silent loss of user-entered credentials or a differently-configured repo checkout.

**Why it matters:** `.env` files are often the most expensive thing in a developer's workspace. They contain API keys that took time to acquire, sometimes credentials that cost money. Losing them to a reflexive `cp .env.example .env` is a real harm the user won't notice until a test fails hours later.

**Enforcement:** Phase 2 checks `remote.origin.url` against the target repo before assuming the directory can be pulled. Phase 5 checks `[ -f .env ]` before copying. Both phases stop and ask when there's any ambiguity.

---

## Rule 4: Never fabricate test output, env values, or success messages

**Failure prevented:** Sycophantic confirmation — the most dangerous failure mode because it hides real failures behind plausible success.

**Why it matters:** This is the v6.0 Strategist spec's named failure mode ("AI is fluently wrong"). An agent that confidently reports "smoke test passed" when no smoke test ran has produced output that passes every quality check a human will apply in a 10-second review. The user trusts the report. Everything downstream is broken.

**Enforcement:** Phase 6 must either produce actual test output or explicitly report `Smoke test: SKIPPED` with reason. The Phase 8 final report template has an `Issues encountered` section that must be populated (even with "none" if truly clean). Empty skipped-sections are a failure signal, not a success signal.

---

## Rule 5: Stop on ambiguity

**Failure prevented:** Guessing at the user's intent when the repo is under-documented.

**Why it matters:** Agents optimize for task completion. Stopping feels like failure. But a stopped setup is recoverable by asking one question; a completed-but-wrong setup requires debugging to even notice. The cost of asking is small; the cost of guessing wrong is large and delayed.

**Enforcement:** Phase 1 has an explicit decision gate on `GAPS / AMBIGUITIES`. Any entry in that section that affects install behavior halts the flow.

---

## Rule 6: Prefer repo-provided scripts

**Failure prevented:** Generating redundant or conflicting tooling on top of what the repo already provides.

**Why it matters:** A well-maintained repo has `make dev`, `npm run start`, or similar scripts the maintainers have vetted. Writing a `.bat` wrapper or a custom launcher creates two sources of truth and drifts out of sync with the next repo update. The user's environment becomes a fork.

**Enforcement:** Phase 1 recon enumerates `REPO-PROVIDED SCRIPTS/LAUNCHERS`. Phase 6 checks for test/build scripts before generating fresh commands. Phase 7 explicitly bans launcher generation unless requested.

---

## Rule 7: Version managers over global installs

**Failure prevented:** Polluting the user's global toolchain with project-specific versions that conflict with other projects.

**Why it matters:** A developer with 30 active repos needs 30 potentially-different Node/Python/Rust versions. Global installs serialize them — the last project to run `brew install node` wins, and the other 29 break. Version managers (nvm, pyenv, rustup) solve this. Ignoring them recreates the problem version managers were invented to fix.

**Enforcement:** Phase 3 uses `nvm use`, `pyenv local`, `rustup show`. Phase 4 uses project-local virtualenvs for Python. Global installs are only for system CLIs the user explicitly wants (and those decisions are the user's, not the skill's).

---

## Rule 8: Report, don't narrate

**Failure prevented:** Long conversational output that hides what actually happened behind description of what the agent plans to do.

**Why it matters:** Agents default to narrating their thought process. That's useful for debugging but fatal for auditability. A user who runs this skill on 10 repos needs comparable reports — same structure, same fields, same level of detail. Narrative breaks the comparability. The user has to re-read every word of each run.

**Enforcement:** Every phase has a structured output format. Phase 0 outputs a table. Phase 1 outputs the Recon Report template. Phase 8 outputs the Final Report template. The templates are the contract; narrative between them is optional and should be minimal.

---

## Meta-rule: When rules conflict

If two rules seem to conflict (e.g., "use version managers" vs "don't install anything"), the more conservative rule wins. Stopping and asking is always valid. Assuming is not.

If a user explicitly overrides a rule ("just use global npm, I know what I'm doing"), proceed with their override but note it in the Final Report's `Issues encountered` section. They should have an audit trail of where their setup deviated from standard.
