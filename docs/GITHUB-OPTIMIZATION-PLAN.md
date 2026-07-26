# GitHub Optimization Plan

## Objective

Make `fullREFIT/skills` the canonical public home for inspectable, usable agent skills. Optimize for successful first use, maintenance clarity, safety, and discoverability. Do not optimize for superficial repository completeness or star count.

## Definition of success

The repository is optimized when:

- A first-time non-technical visitor can identify the right skill and reach a first successful outcome without guessing.
- A technical operator can inspect architecture, dependencies, tests, security posture, and deployment behavior.
- Every skill has one canonical guide and one verified package.
- Catalog, package, tests, documentation, release notes, and live links agree.
- New skills can be added through a repeatable checklist rather than rediscovering repository standards.
- Public changes are validated automatically before merge.

## Baseline assessment

### Strengths before migration

- Working public product and landing page
- Detailed guide
- Direct ZIP download
- Strong privacy and credential audit
- Synthetic examples
- Tests, type checking, and production build
- Security, contribution, license, and trademark files
- Verified desktop, mobile, and accessibility behavior

### Gaps before migration

- Repository name supported only one skill
- No reusable root catalog
- No machine-readable skill manifest
- No root instruction-guide standard
- No issue or pull-request templates
- No continuous-integration workflow
- No changelog or tagged release
- No GitHub topics
- No public discussion area
- No documented path for adding the next skill
- Public links assumed a standalone repository layout

## Benchmark lessons

The evidence review of [mattpocock/skills](https://github.com/mattpocock/skills) is in [MATT-POCOCK-SKILLS-ANALYSIS.md](MATT-POCOCK-SKILLS-ANALYSIS.md).

The most useful patterns are:

1. A sharp repository promise
2. A quick installation path before long explanation
3. A catalog organized by user job
4. Progressive disclosure across README, docs, skill, and references
5. Explicit invocation and completion rules
6. Setup and routing only when library size justifies them
7. Visible release and maintenance automation
8. Small, composable skills rather than one controlling framework

## Phase 0: Migration safety

Status: implemented in this migration.

- Rename the existing GitHub repository to `fullREFIT/skills` so GitHub preserves the old URL as a redirect.
- Move the existing project into `presentation-deck-builder-skill/` within the same Git history.
- Keep Presentation Deck Builder v1 separate and unchanged.
- Update every public source, guide, clone, security, and license link.
- Configure Vercel root directory to `presentation-deck-builder-skill`.
- Reconnect or verify the Vercel Git source after the GitHub rename.
- Preserve the canonical landing page and direct ZIP URL.
- Verify production after the move.

Wrong result:

- A second repository becomes canonical while the first remains active.
- GitHub history is lost.
- The old URL returns 404 instead of redirecting.
- Vercel keeps building from repository root and future deployments fail.
- The current download works only because an old deployment remains cached.

## Phase 1: Public usability baseline

Status: implemented in this migration unless marked after-publication verification.

### Repository front door

- Root README with promise, audience, quick start, catalog, principles, validation, and contribution path
- Machine-readable `skills-manifest.json`
- One top-level directory for each public skill project
- Stable links to guide, download, source, and live example

### Guide standard

- Repository User Guide SOP
- Copyable User Guide Template
- Required first-success walkthrough
- Plain-language path before technical reference
- Expected result and recovery path after every critical action
- Update, uninstall, security, privacy, and troubleshooting sections

### Contribution and support

- Contributing guide
- Security policy
- Code of conduct
- Bug report form
- Feature request form
- Pull-request template
- Blank issues disabled so reports carry enough context

### Automated verification

- Repository structure and safety validator
- Existing product public audit
- Landing-page tests and build
- Renderer validation, tests, type checking, and build
- GitHub Actions workflow on pushes and pull requests

### GitHub metadata

After-publication verification:

- Description names the repository's actual job
- Homepage points to the Presentation Deck Builder example until a collection website exists
- Topics cover agent skills, Claude Code, Codex, presentation tooling, and open source
- Discussions enabled for usage questions and ideas
- Wiki disabled because guides belong in versioned repository files

## Phase 2: Distribution and release quality

Status: tagged release implemented in this migration. Third-party installer and plugin distribution remain staged until clean-environment tests pass.

### Tagged release

Status: implemented.

Create the initial `presentation-deck-builder-v2.0.0` release from the canonical monorepo commit. Attach the same ZIP served by the landing page. Verify both assets have the same SHA-256 checksum.

### Third-party installer test

Status: implemented and verified on 2026-07-26.

The clean `skills.sh` test discovered exactly one skill and installed it project-locally for Claude Code. The installed 35-file package matched every Git-tracked source file byte for byte. The installed copy generated an isolated Carbon Forge renderer, validated its sample report, passed 12 tests, passed TypeScript, and produced a production build.

Verified command:

```bash
npx skills@latest add fullREFIT/skills \
  --skill presentation-deck-builder-v2 \
  --agent claude-code \
  --yes \
  --copy
```

Completion criteria met:

- Fresh install locates one intended `SKILL.md`.
- Installed package contains its references, scripts, assets, renderer, guide, license, and trademark notice.
- The installed package validates and produces the sample deck.

### Claude Code plugin pilot

Add plugin marketplace metadata only after a clean-profile install test succeeds. A valid JSON file alone is not completion.

### Release automation threshold

Use a manual tagged release while one independently versioned skill exists. Add Changesets and release automation when a second skill requires independent change tracking or monthly release work becomes repetitive.

## Phase 3: Discovery and trust

Target: after at least two public skills or verified external usage.

### Collection website

Build a lightweight collection page only when the root README catalog becomes insufficient. Reuse skill metadata from `skills-manifest.json` rather than maintaining a second manual catalog.

### Per-skill public documentation pages

Generate browsable pages from canonical guides. Do not rewrite the same instructions into another source of truth.

### Social preview

Create a branded repository social image that communicates “Practical agent skills with working examples and guides.” This requires a visual asset and GitHub repository settings access.

### Demonstration media

Add one short demonstration for each skill showing the first successful outcome. Keep the guide complete without requiring video.

### Usage feedback

Use GitHub Discussions categories for:

- Help and installation
- Show what you built
- Ideas
- Announcements

Mine recurring questions into guide improvements. Do not answer repeated confusion only in discussions.

## Phase 4: Scale controls

Trigger: three or more active skills.

- Add categories to the catalog
- Add a user-invoked router skill
- Add a setup skill only for shared configuration that users actually repeat
- Add per-skill versions to the manifest
- Add automated guide and manifest synchronization checks
- Add a deprecation policy
- Add ownership fields and maintenance status
- Add signed or provenance-backed release artifacts if external adoption justifies it

## Repository User Guide requirement

Every public repository or independently usable tool must have a detailed instruction guide. The guide must serve two readers in one document.

### Non-technical reader

The guide must explain:

- What the tool does
- What the reader needs before starting
- Where to click or what to copy
- What each critical command does in plain language
- What success looks like after each step
- How to recover from common mistakes
- How to update and remove the tool
- What data stays local or leaves the machine

### Technical reader

The same guide must include:

- Architecture and directory structure
- Runtime and version requirements
- Exact installation and build commands
- Configuration and environment variables
- Data schemas or APIs
- Validation, tests, and expected outputs
- Deployment behavior
- Security and privacy model
- Failure modes and diagnostic commands
- Compatibility and migration notes

The full procedure and checklist are in [Repository User Guide SOP](REPOSITORY-USER-GUIDE-SOP.md).

## Metrics

Measure outcomes rather than repository decoration.

### First-use metrics

- Time from README arrival to first successful result
- Percentage of install attempts completed without maintainer help
- Most common failed step
- Guide section most often linked in support replies

### Quality metrics

- CI pass rate on `main`
- Broken-link count
- Public-path or credential findings
- Package-to-source checksum mismatches
- Open security issues
- Time from behavior change to guide update

### Maintenance metrics

- Catalog and manifest drift
- Stale skills without a verified maintainer
- Repeated support questions not incorporated into docs
- Release frequency and failed release count

Stars, forks, and traffic can indicate reach. They do not replace first-use and quality evidence.

## Ownership

- Repository maintainer owns catalog, governance, CI, topics, and releases.
- Skill maintainer owns behavior, package, examples, guide, tests, and changelog entry.
- Every pull request that changes behavior must identify both owners when they differ.

## Recommended priority

Complete migration safety and Phase 1 now. Complete the tagged release and third-party installer test next. Delay plugin distribution, collection website work, and Changesets until usage or library size proves they are the bottleneck.
