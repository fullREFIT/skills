# Claude Agent Skills consolidation

**Migration date:** 2026-07-26
**Canonical repository:** https://github.com/fullREFIT/skills
**Historical source:** https://github.com/fullREFIT/claude-agent-skills

## Decision

The curated portable collection from `fullREFIT/claude-agent-skills` is now maintained under `skills/` in this repository. The existing `fullREFIT/skills` repository was retained because it already contained the Presentation Deck Builder release, governance, CI, manifest, and public installation path.

The repositories were not copied into two active canonical locations. The source history was joined to this repository during consolidation, and the historical repository is to be archived after the canonical branch and public installer are verified.

## Public boundary

Only the 31 previously curated public skill directories were imported. Internal project-state material and macOS metadata were excluded. The imported collection is checked by `scripts/validate-imported-skills.py`, while `scripts/validate-repository.py` continues to enforce the repository-wide public contract.

## Verification contract

The consolidation is complete only when:

1. All 31 imported directories have a `SKILL.md` and a manifest entry.
2. Frontmatter names and descriptions validate.
3. Public-safety scanning passes.
4. Existing Presentation Deck Builder validation and package parity still pass.
5. GitHub Actions pass on the canonical branch.
6. `npx skills@latest add fullREFIT/skills --list --full-depth` discovers the existing release and imported collection.
7. A selected imported skill installs successfully from the public canonical repository.
8. The historical source repository points visitors to the canonical repository and is archived.

## Maintenance rule

New portable skills belong under `skills/<directory>/`. Every addition, rename, or removal must update `skills-manifest.json`, the root README catalog, and the collection validator in the same change.
