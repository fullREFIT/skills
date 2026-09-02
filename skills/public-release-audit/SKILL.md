---
name: public-release-audit
description: "Audit a private skill, prompt, framework, protocol, or project for safe public release, determine whether it is original and portable, choose the right package shape, generalize private dependencies, and produce a verified publication checklist. Use before publishing agent skills, prompts, protocols, frameworks, templates, or project artifacts to a public repository. MANDATORY TRIGGERS: public release, open source, publish, package for GitHub, make public, audit for publication, sanitize skill, generalize prompt, private to public."
license: "MIT"
compatibility: "Portable Agent Skills format. Commands assume a Git repository and Python 3."
---

# Public Release Audit

Audit before publishing. Do not treat a clean text scan as proof that an artifact is publishable. Publication requires four separate judgments: provenance, privacy, portability, and packaging quality.

## Workflow

### 1. Establish the publication target

Read the target repository instructions, contribution rules, license, CI, catalog, and package conventions before editing. Record:

- source path and repository
- intended public repository and subdirectory
- target platforms
- whether the artifact is a skill, protocol, reference, script, template, or full project
- required installation or first-success workflow

Use `references/package-selection.md` to choose the package shape. Prefer an Agent Skill when an agent should discover and invoke a repeatable workflow. Use a reference or protocol when the material is supporting guidance with no independent trigger or execution contract.

### 2. Determine provenance

Classify the artifact as ORIGINAL, DERIVATIVE, THIRD-PARTY, or UNKNOWN. Inspect licenses, attribution, upstream URLs, copied wording, embedded transcripts, imported code, and generated assets. Do not publish UNKNOWN material as original. If derivative material is publishable, preserve required attribution and license terms, and say exactly what was changed.

### 3. Scan for private material

Run the bundled scanner from the repository root:

```bash
python3 skills/public-release-audit/scripts/scan_public_safety.py <path>
```

Treat findings as leads, not automatic verdicts. Inspect every hit. Search for:

- credentials, tokens, cookies, private keys, and secret assignments
- personal names, email addresses, absolute home paths, private domains, internal hostnames, IDs, and channel references
- client names, private business logic, unpublished strategy, internal prompts, and personal voice or brand systems
- private MCPs, local tools, proprietary services, and assumptions a stranger cannot reproduce
- copied examples that still identify a real person, company, account, or private system

Generalize private values into explicit placeholders, environment variables, public service names, or pluggable interfaces. Do not delete a dependency silently when the workflow still requires it. Mark it optional, replace it, or classify the artifact PRIVATE.

### 4. Test portability

From a clean temporary directory, verify that a stranger can discover the package, install it at the claimed path, and complete its first useful workflow. Test every platform claimed in the README, or downgrade the claim to unverified. Run scripts, validators, tests, type checks, and builds that the artifact or repository defines.

A protocol is not portable merely because its Markdown is generic. A skill is not verified merely because `SKILL.md` exists. Record commands, outputs, versions, and any missing external dependency.

### 5. Select the release verdict

Use exactly one:

- `PUBLISH`: original, private-safe, portable, and verified at the claimed release tier
- `PUBLISH-AFTER-GENERALIZATION`: useful and original, but private values or platform assumptions require edits
- `PUBLISH-AFTER-VERIFICATION`: sanitized and structurally ready, but the claimed workflow has not been tested
- `PRIVATE`: depends on private infrastructure, personal context, or confidential material that cannot be cleanly separated
- `THIRD-PARTY`: not owned or not licensed for republication
- `ARCHIVE`: incomplete, obsolete, or not useful enough to maintain publicly
- `HOLD`: provenance, permission, or safety is unresolved

Do not upgrade a verdict because the artifact is valuable. Do not downgrade it merely because it uses a public dependency.

### 6. Package the release

For a skill, require:

```text
<skill-name>/
├── SKILL.md
├── README.md
├── references/
├── scripts/
├── assets/
└── <skill-name>.zip
```

Keep the core workflow in `SKILL.md`, move detail into directly linked references, include installation instructions, identify prerequisites, and state tested platforms. Validate frontmatter and package structure with the repository's validator. Ensure the archive contains one top-level skill directory and no hidden files, caches, nested archives, credentials, or private development artifacts.

For a protocol, place the reusable procedure under `protocols/` only if the repository already uses that convention. Include a purpose, inputs, sequence, decision gates, outputs, verification, and wrong-output examples. Do not create a protocol folder as a second skill catalog.

### 7. Update public discovery surfaces

When the verdict is publishable, update the repository catalog, machine-readable manifest if present, changelog, and CI checks. Add a user-facing first-success example. Mark the artifact beta until its claimed workflow has been tested from the canonical public repository. Do not call a local file public until the repository, release, and any live distribution surface have been independently verified.

### 8. Report

Return an evidence-backed report with:

1. verdict and confidence
2. provenance evidence and license decision
3. privacy findings and exact files changed
4. portability matrix by platform
5. selected package shape and why alternatives were rejected
6. validation and first-success commands with actual results
7. remaining blockers
8. exact files ready for review or publication

## Wrong output

- Publishing a private skill after replacing only its absolute paths
- Treating a public URL or open-source dependency as permission to copy its content
- Calling a scanner pass a privacy audit
- Calling a ZIP valid without inspecting its contents
- Claiming Claude Code compatibility after testing only a text file
- Creating a generic `protocols/` folder that duplicates the skill catalog
- Removing private dependencies without replacing the behavior they supplied
- Publishing before updating the catalog, license, installation path, and release checks
- Claiming GitHub or production publication when only local files were created

## References

Read `references/package-selection.md` when deciding between a skill, protocol, reference, template, or full project.

Read `references/public-release-checklist.md` when conducting the evidence review or writing the final report.

Run `scripts/scan_public_safety.py` before every release candidate. Inspect and resolve every finding before assigning `PUBLISH`.
