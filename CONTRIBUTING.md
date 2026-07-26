# Contributing to full/REFIT Skills

Contributions should make a skill easier to discover, safer to install, more predictable to run, or simpler to maintain.

## Before opening a change

1. Read the relevant skill README and user guide.
2. Read [Repository User Guide SOP](docs/REPOSITORY-USER-GUIDE-SOP.md) for documentation changes.
3. Use synthetic examples. Do not commit customer data, credentials, private machine paths, or internal reports.
4. Keep the change focused on one skill or one repository-level improvement.

## Local setup

```bash
git clone https://github.com/fullREFIT/skills.git
cd skills
npm ci --prefix presentation-deck-builder-skill
npm ci --prefix presentation-deck-builder-skill/skill/presentation-deck-builder-v2/assets/renderer
npm run check
```

## Pull request requirements

A pull request must explain:

- The user problem being solved
- The files and behavior changed
- The verification performed
- Any compatibility, privacy, or migration risk
- The guide sections updated

When behavior changes, update the relevant user guide, examples, tests, manifest entry, and changelog in the same pull request.

## Documentation standard

Write the first path for someone who has never used a terminal. Follow it with exact technical reference for operators who need implementation detail. Every action must include an expected result or a recovery path.

## Security

Do not open a public issue for a suspected vulnerability or exposed credential. Follow [SECURITY.md](SECURITY.md).
