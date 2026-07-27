# full/REFIT Skills

Practical, inspectable agent skills with working examples, validation, and guides written for both first-time users and technical operators.

## Start here

### I want to use a stable skill without reading code

Open Presentation Deck Builder in the catalog below for its plain-language guide, direct download, first-success walkthrough, and troubleshooting. The portable agent skill collection has a separate beta catalog; each imported skill remains `beta` until its own end-to-end workflow is reverified from this canonical repository.

### I use Claude Code

From the root of your project, run:

```bash
npx skills@latest add fullREFIT/skills \
  --skill presentation-deck-builder-v2 \
  --agent claude-code \
  --yes \
  --copy
```

Expected result: the complete skill is copied to `.claude/skills/presentation-deck-builder-v2`. This path was verified from a clean project on 2026-07-26.

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

## Portable agent skill collection

The canonical repository also contains 31 portable skills for agentskills.io-compatible tools. Discover the public inventory before installing:

```bash
npx skills@latest add fullREFIT/skills --list --full-depth
```

Install one skill by its catalog name:

```bash
npx skills@latest add fullREFIT/skills \
  --skill skill-architect \
  --agent claude-code \
  --yes \
  --copy \
  --full-depth
```

Expected result: the selected folder is copied into `.claude/skills/`. Imported skills are marked `beta` until their individual end-to-end user workflow has been reverified from this canonical repository.

| Skill | What it does | Status |
| --- | --- | --- |
| [1pw-env](skills/1pw-env/) | 1Password credential management for development environments — sync secrets to `~/.env.mcp` via `op` CLI | `beta` |
| [claude-md-forge](skills/claude-md-forge/) | Distill source material (docs, transcripts, codebases) into optimized CLAUDE.md / AGENTS.md files | `beta` |
| [claude-release-guide](skills/claude-release-guide/) | Convert source material about a Claude product release into a verified, teaching-grade implementation guide | `beta` |
| [clearpath](skills/clearpath/) | Enforce a consistent file and folder naming convention system (LF/SF/LIC/LI prefixes) across a project | `beta` |
| [deep-save](skills/deep-save/) | Extract long conversations into a knowledge MCP (e.g., Open Brain) with signal/noise triage and permanence scoring | `beta` |
| [gamma-optimization](skills/gamma-claude-skill/) | Optimize and produce content specifically for the Gamma.app presentation platform | `beta` |
| [github-repo-setup](skills/github-repo-setup/) | Universal GitHub repository setup — README, .gitignore, branch protection, CI scaffolding | `beta` |
| [gpt-5-6-relay](skills/gpt-5-6-relay/) | Route tasks to GPT-5.6 threads (Sol/Terra/Luna tiers) via API relay | `beta` |
| [instagram-carousel-forge](skills/instagram-carousel-forge/) | Produce Instagram carousel PNG sets from any content input | `beta` |
| [interactive-checklist-skill](skills/interactive-checklist-skill/) | Build interactive HTML checklists with progress tracking, completion states, and export | `beta` |
| [linkedin-carousel-forge](skills/linkedin-carousel-forge/) | Produce LinkedIn carousel PDFs and infographic PDFs from content input — configure brand tokens in `config.example.md` | `beta` |
| [logo-designer](skills/logo-designer/) | AI-assisted logo concept and prompt generation using professional design studio methodologies | `beta` |
| [loop-goal-triage](skills/loop-goal-triage/) | Triage any task to the right execution method: plain prompt, /goal, /loop, dynamic workflow, or Routine | `beta` |
| [plan-execute-router](skills/plan-execute-router/) | Split plan and execute phases to different Claude tiers for cost optimization | `beta` |
| [prep-project](skills/prep-project/) | Analyze a project folder and produce executor-ready task spec packages routed to Cowork or the Claude Code task orchestrator | `beta` |
| [project-doc-refresh](skills/project-doc-refresh/) | Three-phase audit → research → diff workflow to keep project documentation current | `beta` |
| [project-orchestrator](skills/project-orchestrator/) | Decompose projects into routed task plans across Claude Cowork, Claude Code, Cursor, Warp.dev, n8n, and other AI tools | `beta` |
| [proof-shortio-airtable](skills/proof-shortio-airtable/) | Create a Proof entry, generate a Short.io short link, and log both to an Airtable record in one command — configure via env vars | `beta` |
| [script-forge](skills/script-forge/) | Write YouTube teleprompter scripts from source material — enforces creator voice, anti-patterns, editorial discipline, and structured narrative | `beta` |
| [signal-scanner](skills/signal-scanner/) | Scan your own builds, projects, and completed work to extract high-credibility content signals and proof artifacts | `beta` |
| [skill-architect](skills/skill-architect/) | Create, audit, improve, and package agent skills following the agentskills.io open standard | `beta` |
| [skill-creator](skills/skill-creator/) | Step-by-step guide for creating new agent skills from scratch | `beta` |
| [skill-translate](skills/skill-translate/) | Port skills across platforms (Claude Code ↔ Codex ↔ Cursor ↔ deepagents) | `beta` |
| [slack-gif-creator](skills/slack-gif-creator/) | Create animated GIFs and emoji animations optimized for Slack size constraints | `beta` |
| [sop-generator](skills/sop-generator/) | Generate structured Standard Operating Procedures from process descriptions | `beta` |
| [start-session](skills/start-session/) | Start or resume a Claude session — loads active tasks from a knowledge MCP, surfaces goals, and establishes working context | `beta` |
| [tiktok-carousel-forge](skills/tiktok-carousel-forge/) | Produce TikTok vertical carousel PNG sets — configure brand tokens in `config.example.md` | `beta` |
| [trafilatura-research](skills/trafilatura-research/) | Web content extraction and research using Trafilatura and related scraping tools | `beta` |
| [vibe-coding-router](skills/vibe-coding-router/) | Route AI-assisted builds through the right SDLC phase (plan, scaffold, implement, review, ship) | `beta` |
| [web-app-builder](skills/web-app-builder/) | Generate self-contained HTML/CSS/JS web apps and interactive tools from specifications | `beta` |
| [youtube-screen-share-forge](skills/youtube-screen-share-forge/) | Produce branded full-screen HTML presentation slides for YouTube screen sharing via Ecamm Live — configure brand tokens in `config.example.md` | `beta` |

The consolidation decision, safety boundary, and verification contract are recorded in [Claude Agent Skills consolidation](docs/CLAUDE-AGENT-SKILLS-MIGRATION.md).

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

1. For a full public project, read [Repository User Guide SOP](docs/REPOSITORY-USER-GUIDE-SOP.md).
2. Put full public projects in a top-level `-skill` folder. Put portable SKILL.md packages under `skills/<name>/`.
3. Include the files required for that publication tier, and do not claim untested compatibility.
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
