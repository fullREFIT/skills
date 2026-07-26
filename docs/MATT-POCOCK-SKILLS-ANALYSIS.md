# Analysis of mattpocock/skills

## Executive conclusion

The strongest feature of [mattpocock/skills](https://github.com/mattpocock/skills) is a coherent operating model, not its star count. The repository makes a sharp promise, gives users a short installation path, organizes skills by job, explains when each skill should run, and maintains a clear route from discovery to setup to repeatable use.

full/REFIT should borrow that discovery and maintenance architecture. It should keep its stronger privacy, packaging, user-guide, security, visual demonstration, and end-to-end verification standards.

## Evidence snapshot

This comparison was captured from GitHub on 2026-07-26.

| Measure | mattpocock/skills | full/REFIT before migration |
| --- | ---: | ---: |
| Public skills represented by `SKILL.md` | 41 | 1 |
| Stars | 189,226 | 0 |
| Forks | 16,247 | 0 |
| GitHub releases | Present | None |
| Active repository workflows | 2 | 0 |
| Changelog | Present | None |
| Root skill catalog | Present | Single-product README |
| Per-skill public docs | Broad coverage | One detailed guide |
| Security policy | Missing from GitHub community profile | Present |
| Contributing guide | Missing from GitHub community profile | Present |
| GitHub community health | 42 percent | 71 percent |

Sources:

- [Matt Pocock skills repository](https://github.com/mattpocock/skills)
- [Matt Pocock README](https://github.com/mattpocock/skills/blob/main/README.md)
- [Matt Pocock release workflow](https://github.com/mattpocock/skills/blob/main/.github/workflows/release.yml)
- [Matt Pocock writing-great-skills source](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills)
- [Presentation Deck Builder landing page](https://fullrefit-presentation-deck-builder.vercel.app)

Star and fork counts are evidence of distribution and trust, not proof that every repository choice caused that popularity. Matt Pocock's existing audience, newsletter, teaching reputation, and product ecosystem are material factors that a repository rewrite cannot reproduce.

## What the repository is actually about

Matt's repository is not a random prompt collection. It is an opinionated engineering operating system built from small, composable skills.

The README frames the collection around four common agent failures:

1. The agent did not understand the intended change.
2. The agent used too many words because it lacked shared domain language.
3. The code did not work because feedback loops were weak.
4. The codebase lost structure as generation accelerated.

Each failure is connected to a concrete skill or workflow. That creates a causal story. Users understand the problem before they inspect any skill file.

## Why the repository works

### 1. It has a sharp promise

“Skills for Real Engineers” establishes audience, standard, and point of view immediately. The copy rejects vague process ownership and argues for small tools that preserve operator control.

The lesson is not to copy that phrase. The lesson is to state who the repository serves, what standard it enforces, and what it refuses to become.

### 2. The first action appears early

The README provides a 30-second setup before the long explanation. It offers two installation models:

- Editable copies through `skills.sh`
- A managed Claude Code plugin

This reduces the distance from interest to first use.

### 3. The catalog explains when to use each skill

The catalog does more than list names. It separates user-invoked and model-invoked skills, groups them by job, and gives each one a one-line use case.

This is important because a skill library creates two costs:

- Context cost when every skill description is always available to the model
- Cognitive cost when the human must remember many manual commands

Matt addresses that trade-off with explicit invocation categories and a router skill.

### 4. Skills are small and composable

The repository's stated design goal is not one process that owns every step. It is a collection of focused skills that can be adapted, composed, or replaced.

This lowers adoption risk and makes failures easier to diagnose.

### 5. Progressive disclosure is deliberate

The root README handles discovery. Public docs explain each skill. `SKILL.md` contains the operating instructions. Supporting files hold reference detail.

The writing-great-skills reference describes this as an information hierarchy. Information stays at the highest level where every relevant execution branch needs it, then moves into linked files when only some branches need it.

### 6. Setup and routing are products

The setup skill inspects a repository, recommends defaults, records decisions, and creates a predictable per-project configuration. The router skill helps people choose the next skill.

This recognizes that installation alone does not create adoption. Users also need configuration and navigation.

### 7. Maintenance is visible

The repository includes:

- A changelog
- Changesets
- A release workflow
- Tagged releases
- A rule that catalog and docs must change when skills move or change

Public users can see that updates are deliberate and traceable.

### 8. It uses shared language

Matt uses compact terms such as progressive disclosure, context load, cognitive load, completion criterion, premature completion, sediment, and router.

Those terms make maintenance discussions shorter and more consistent. The useful pattern is a small public vocabulary, not the exact words.

## What full/REFIT already does better

Presentation Deck Builder v2 already has strengths that should remain part of the monorepo standard:

- A detailed first-time-user guide
- A direct downloadable package
- A working public landing page
- Four visible brand examples
- Custom-brand validation
- Public-path and credential scanning
- Synthetic sample data
- Unit tests, type checking, accessibility checks, and production builds
- A security policy
- A contributing guide
- Trademark boundaries
- A destructive-output guard
- Verified desktop and mobile behavior

The GitHub community profile rated the original full/REFIT repository at 71 percent, compared with 42 percent for Matt's repository. This does not make the original repository more usable overall. It does show that full/REFIT should not remove governance and security files merely to imitate a popular repository.

## Patterns to borrow now

### Root promise and catalog

Create one full/REFIT skills front door with a catalog, one-line jobs, status, guide, download, and live example.

### Shortest path before detail

Lead with the easiest path for a non-technical user. Keep clone, development, and architecture instructions below it.

### Progressive disclosure

Use this hierarchy:

1. Root README for discovery
2. Skill README for decision and quick start
3. User guide for complete operation
4. `SKILL.md` for agent execution
5. Reference files for schemas and edge cases

### Explicit completion criteria

Every workflow step should say how the user or agent knows it worked. “Run this command” is incomplete without the expected result or recovery path.

### Public maintenance trail

Use changelogs, tagged releases, validation workflows, and synchronized catalog entries.

### Setup and routing when the library grows

Add a setup skill and a router only when multiple skills create real configuration or navigation pressure. One skill does not yet justify a permanent router.

## Patterns to stage rather than copy immediately

### Changesets

Changesets are useful when several independently versioned skills change frequently. With one public skill, a changelog and tagged release are simpler. Adopt Changesets when the second independently versioned skill is published.

### Claude Code plugin distribution

Plugin metadata can improve installation, but it should not be advertised until a clean-machine installation test passes. A manifest without an end-to-end install is documentation theater.

### skills.sh distribution

The repository should test discovery and installation after the canonical monorepo is public. Do not advertise a one-line installer until the exact command succeeds against the public source.

### Router skill

A router is valuable when people cannot remember which of several skills to use. It is unnecessary for a one-skill catalog.

## What not to copy

- Matt's positioning, brand language, quotations, or skill content
- Popularity claims without evidence that a repository feature caused them
- A large process framework before the catalog has multiple skills
- Missing security and contribution guidance
- Install commands that have not been tested from a clean environment
- Complexity added only to make a one-skill repository resemble a mature collection

## Adopted full/REFIT principle

A public full/REFIT skill must be easy to discover, easy to try, safe to inspect, predictable to run, and explicit about what completion looks like.
