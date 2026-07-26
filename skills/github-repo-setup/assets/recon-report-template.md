# Recon Report

**Repo:** `<owner/repo>`
**Primary language:** `<lang>`
**Stars:** `<n, if available>`
**Default branch:** `<branch>`
**Last commit:** `<date, if available>`
**Archived:** `<yes/no — flag in gaps if yes>`

---

## Stack Detected

- **Node:** `<version pin or "any" or "not required">`
- **Package manager:** `<npm | pnpm | yarn | bun | none>`
- **Python:** `<version pin or "any" or "not required">`
- **Python installer:** `<pip | uv | poetry | pipenv | none>`
- **Other languages:** `<go | rust | ruby | deno | bun | docker | none>`

## Documented Setup (from README)

1. `<step 1 as written in README>`
2. `<step 2 as written in README>`
3. `<step 3 as written in README>`

## Documented Run Command

`<e.g., npm start / make dev / python app.py / docker compose up>`

## Test Command

`<e.g., npm test / pytest / cargo test — or "none documented">`

## Environment Variables Required

Grouped by category. List names only — do not fill values.

**Credentials / API keys:**
- `<VAR_NAME>` — `<brief description from .env.example or README>`

**Infrastructure / URLs:**
- `<VAR_NAME>` — `<description>`

**Feature flags / config:**
- `<VAR_NAME>` — `<description>`

If none detected, write: `none detected`

## Containerization

- **Dockerfile:** `<present/absent>`
- **docker-compose.yml:** `<present/absent — services: ...>`
- **devcontainer.json:** `<present/absent>`

## Repo-Provided Scripts / Launchers

List anything in `scripts/`, `bin/`, `Makefile`, `justfile`, or package.json scripts that the maintainers intend as entry points.

- `<path or command>` — `<purpose>`

If none, write: `none`

## CI Hints (.github/workflows/)

- **Test command used in CI:** `<command, if identifiable>`
- **Node/Python versions tested:** `<versions>`
- **Notable setup steps from CI:** `<list>`

## Gaps / Ambiguities

**This section is the decision gate.** List anything unclear that would require the agent to assume something that affects install or runtime behavior. If this section has any entries, **stop and ask the user before proceeding to Phase 2**.

- `<ambiguity 1>`
- `<ambiguity 2>`

If none, write: `none — proceeding to Phase 2`

---

*Generated during Phase 1 of github-repo-setup skill execution.*
