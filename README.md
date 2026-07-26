# full/REFIT Skills

Practical, inspectable agent skills with working examples, validation, and guides written for both first-time users and technical operators.

## Start here

### I want to use a skill without reading code

Open the skill page in the catalog below. Each skill has a plain-language guide, a direct download, a first-success walkthrough, and troubleshooting steps.

### I want the source

```bash
git clone https://github.com/fullREFIT/skills.git
cd skills
```

### I want to inspect every available skill

```bash
python3 scripts/list-skills.py
```

## Skill catalog

| Skill | What it does | Guide | Download | Release | Live example |
| --- | --- | --- | --- | --- | --- |
| [Presentation Deck Builder v2](presentation-deck-builder-skill/) | Turns structured research into validated, branded presentation websites | [User guide](presentation-deck-builder-skill/USER-GUIDE.md) | [ZIP](https://fullrefit-presentation-deck-builder.vercel.app/downloads/presentation-deck-builder-v2.zip) | [v2.0.0](https://github.com/fullREFIT/skills/releases/tag/presentation-deck-builder-v2.0.0) | [Landing page](https://fullrefit-presentation-deck-builder.vercel.app) |

Machine-readable catalog: [skills-manifest.json](skills-manifest.json)

## What makes a full/REFIT public skill

Every published skill must provide:

- A clear job and a specific intended user
- A first successful outcome that can be reached without guessing
- A detailed guide that starts in plain language and ends with technical reference
- A downloadable, validated package
- Synthetic examples with no private customer or machine data
- Exact verification commands and expected results
- Security, privacy, update, and removal guidance
- A maintainer path for issues and contributions

The operating standard is documented in [Repository User Guide SOP](docs/REPOSITORY-USER-GUIDE-SOP.md). New repositories and skills should begin with the [User Guide Template](docs/templates/USER-GUIDE-TEMPLATE.md).

## Repository structure

```text
.
├── README.md
├── skills-manifest.json
├── presentation-deck-builder-skill/
│   ├── README.md
│   ├── USER-GUIDE.md
│   ├── site/
│   ├── tests/
│   └── skill/
│       └── presentation-deck-builder-v2/
├── docs/
│   ├── MATT-POCOCK-SKILLS-ANALYSIS.md
│   ├── GITHUB-OPTIMIZATION-PLAN.md
│   ├── REPOSITORY-USER-GUIDE-SOP.md
│   └── templates/
├── scripts/
├── .github/
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

## Validate the repository

Install the Presentation Deck Builder dependencies:

```bash
npm ci --prefix presentation-deck-builder-skill
npm ci --prefix presentation-deck-builder-skill/skill/presentation-deck-builder-v2/assets/renderer
```

Run the full repository gate:

```bash
npm run check
```

A passing run confirms repository structure, public-data safety, links, landing-page tests, renderer validation, TypeScript checks, and production builds.

## Add another skill

1. Read [Repository User Guide SOP](docs/REPOSITORY-USER-GUIDE-SOP.md).
2. Create one top-level folder whose name ends in `-skill`.
3. Include the required user, technical, security, and package files.
4. Add the skill to `skills-manifest.json` and the catalog above.
5. Add its checks to the root `package.json` and CI workflow.
6. Run `npm run check` before opening a pull request.

## Design principles borrowed from strong public skill repositories

This repository borrows several useful patterns from [mattpocock/skills](https://github.com/mattpocock/skills):

- One clear promise at the top of the README
- A short installation path before detailed explanation
- A browsable catalog instead of an unexplained file tree
- Progressive disclosure from README to guide to technical reference
- Explicit completion criteria and failure modes
- Automated quality and release gates

It does not copy Matt Pocock's positioning, prose, branding, or skill content. The evidence review and full comparison are in [Matt Pocock Skills Analysis](docs/MATT-POCOCK-SKILLS-ANALYSIS.md).

## Governance

- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)
- [License](LICENSE)

## License

Unless a skill folder states otherwise, code and documentation are available under the MIT License. Brand names and marks remain subject to the trademark notices in the relevant skill folder.
