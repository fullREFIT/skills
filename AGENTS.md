# Agent Instructions

## Objective

Maintain a public collection of practical full/REFIT agent skills that a first-time user can install without guessing and a technical operator can audit without hidden context.

## Repository rules

- Treat each top-level directory ending in `-skill` as an independently usable public project.
- Keep one canonical user guide for each skill project.
- Update the root catalog and `skills-manifest.json` whenever a skill is added, renamed, removed, or materially changed.
- Use synthetic examples only.
- Keep private paths, credentials, customer data, and internal full/REFIT systems out of public files.
- Run `npm run check` before reporting a change complete.
- Preserve the landing-page URL and direct download URL unless a migration explicitly replaces and verifies them.
- Use [Repository User Guide SOP](docs/REPOSITORY-USER-GUIDE-SOP.md) for every new or rewritten instruction guide.

## Completion criteria

A repository change is complete only when code, documentation, package artifacts, catalog entries, tests, and public links agree.
