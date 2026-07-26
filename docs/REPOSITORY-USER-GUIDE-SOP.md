# Repository User Guide SOP

## Purpose

Create one instruction guide that lets a first-time non-technical reader reach a real result without guessing while giving a technical operator enough detail to install, inspect, modify, test, deploy, and troubleshoot the tool.

This SOP applies to every public full/REFIT repository, app, tool, skill, and independently usable package.

## Governing principle

Write in layers, not separate “simple” and “technical” guides.

The first layers reduce cognitive load for a new user. Later layers expose the implementation detail a technical user needs. Both readers use the same canonical document, which prevents instructions from drifting apart.

## Required repository files

Every independently usable public repository must include:

| File | Job |
| --- | --- |
| `README.md` | Front door, decision, shortest path, and guide link |
| `USER-GUIDE.md` | Canonical end-to-end instructions |
| `LICENSE` | Usage rights |
| `SECURITY.md` | Private vulnerability reporting and supported versions |
| `CONTRIBUTING.md` | Local setup, quality gates, and pull-request expectations |
| `CHANGELOG.md` | Material public changes and migrations |
| Working example | Synthetic input and expected result |
| Verification command | One command or clearly ordered command set that proves the supported workflow |

A repository may add `TROUBLESHOOTING.md`, `ARCHITECTURE.md`, or API reference files when their detail would make `USER-GUIDE.md` hard to navigate. The user guide must link to them at the exact point they become relevant.

## Required guide structure

Use the headings below unless the tool genuinely makes one irrelevant.

### 1. What this tool does

Answer in plain language:

- What goes in
- What happens
- What comes out
- Who it is for
- What it does not do

Completion criterion: a reader can decide within one minute whether the tool fits their job.

### 2. Choose your path

Offer the supported paths in recommended order. Common paths include:

- Download and use without editing code
- Install as an agent skill
- Clone and run locally
- Contribute or modify the source

Recommend one default. State the trade-off only when it affects the outcome.

Completion criterion: the reader knows which section to follow and why.

### 3. Before you start

List prerequisites with plain-language explanations.

For each prerequisite include:

- What it is
- Why it is needed
- Supported versions
- How to check whether it is already installed
- A verified installation link or command

Do not assume that “open a terminal,” “clone the repository,” “set an environment variable,” or “run from the project directory” is self-explanatory.

Completion criterion: the reader can verify every prerequisite before changing the system.

### 4. Fastest first success

Provide the shortest supported path to a real result.

Every step must contain:

1. The action
2. What the action does
3. The expected result
4. What to do if the expected result does not happen

Use copyable commands. Keep one operational phase per code block.

Completion criterion: the reader produces or opens the first valid output.

### 5. Install by platform

Document every supported platform separately. For agent skills, common targets are:

- Claude.ai and Claude Desktop
- Claude Code
- OpenAI Codex
- Cursor
- VS Code or Copilot
- Manual terminal use

For each platform include:

- Exact destination or UI path
- Exact archive or folder to use
- Whether a restart is needed
- A trigger prompt or smoke test
- The expected response or artifact
- Update and uninstall steps

Do not claim compatibility from format alone. Mark a platform as “format compatible, not tested” when no end-to-end test has been run.

### 6. Core workflows

Write one recipe for each user job, not one recipe for each internal module.

For every workflow state:

- Starting input
- Required decisions
- Exact steps
- Generated files or external effects
- Validation command
- Done condition
- Common failure and recovery

Completion criterion: each workflow ends in an observable user outcome.

### 7. Concepts and glossary

Define terms that the tool uses differently from ordinary language. Prefer one stable term for each concept.

A good glossary reduces both user confusion and agent verbosity. Do not create terminology merely to sound proprietary.

### 8. Configuration

Document:

- Configuration files and locations
- Required and optional fields
- Defaults
- Environment variables
- Accepted values
- Example configuration using synthetic values
- Validation rules
- Precedence when several configuration sources exist

Never place a real credential in an example.

### 9. Data, privacy, and security

Explain:

- What data the tool reads
- What data it writes
- What leaves the machine
- Which external services receive data
- Where credentials come from
- How destructive actions are guarded
- How generated output can be removed safely
- How to report a vulnerability privately

Completion criterion: a reader can make an informed data-handling decision before use.

### 10. Verification and tests

Separate user verification from maintainer verification.

User verification answers “Did my result work?”

Maintainer verification answers “Is the repository safe to release?”

Include:

- Canonical check command
- Individual test, lint, type, and build commands
- Expected success output in plain language
- Test data source
- Generated artifact locations
- Cleanup behavior

Do not say “looks good” or “should work.” State exactly what passed.

### 11. Troubleshooting

Organize by symptom, not component.

For each symptom include:

- What the reader sees
- Most likely cause
- Safe diagnostic
- Fix
- Verification after the fix
- Escalation path if unresolved

Start with common setup mistakes. End with technical diagnostics.

### 12. Architecture and technical reference

Include:

- Directory map
- Runtime boundaries
- Data flow
- Schemas and APIs
- Dependency responsibilities
- Build and deployment model
- Extension points
- Compatibility constraints
- Known limitations

Keep architecture factual. Do not describe planned components as implemented.

### 13. Update, migration, and removal

Explain:

- How to check the current version
- How to update
- Whether configuration or output is preserved
- Breaking changes
- Migration steps
- Rollback
- Uninstall or removal

Completion criterion: the reader can change versions without losing unknown data.

### 14. Getting help

Provide:

- Public issue path for reproducible bugs
- Discussion path for questions and ideas
- Private security path
- Information to include
- Information never to publish

## README standard

The README is a front door, not a compressed copy of the full guide.

It must include, in this order:

1. Name and one-sentence promise
2. Who it is for
3. Fastest supported first action
4. Proof or example of output
5. Skill or feature catalog
6. Link to the full user guide
7. Public safety guarantees
8. Development verification
9. Contribution, security, and license links

Wrong README patterns:

- Leading with internal architecture
- Listing features without a user outcome
- Hiding installation below a long essay
- Giving an untested one-line installer
- Saying “easy” without showing the steps
- Assuming the reader knows where commands run

## Plain-language rules

### Explain operational terms once

When first used, explain terms such as repository, terminal, working directory, dependency, build, local server, port, environment variable, and API key.

### State location before commands

Tell the reader which folder to open before running a command.

### Give one default

Recommend the best path. Avoid menus that transfer architecture decisions to a first-time user.

### Show expected results

After a command, state what new file, message, page, or status proves success.

### Include recovery beside the risky step

Do not collect every recovery note at the end when a failure can block the reader near the beginning.

### Keep examples synthetic

Use names and data created for documentation. Remove customer names, internal URLs, private paths, and credentials.

### Avoid false reassurance

Replace “simply,” “just,” “obviously,” and “should” with the actual action and verification.

## Technical-detail rules

Technical readers need precision, not a second vague guide.

Include:

- Supported runtime versions
- Exact package-manager behavior
- Lockfile expectations
- Full command order
- Configuration precedence
- File and schema contracts
- Network and external-service behavior
- Test boundaries
- Build output
- Deployment source and root directory
- Security assumptions
- Known unsupported paths

Keep commands copyable. Separate commands that have different side effects or verification gates.

## Authoring workflow

### Step 1: Verify the live product

Run the current supported workflow. Record the real commands, files, URLs, and outputs.

Completion criterion: every load-bearing guide claim has current evidence.

### Step 2: Map user jobs

List the outcomes users seek. Rank by frequency and importance.

Completion criterion: guide sections follow user jobs rather than source-code modules.

### Step 3: Write the first-success path

Write and test the shortest route to a valid result.

Completion criterion: a clean environment can follow it without undocumented state.

### Step 4: Add platform and workflow branches

Add only supported branches. Label untested compatibility accurately.

Completion criterion: no branch relies on hidden local context.

### Step 5: Add recovery and technical reference

Use observed failures, test failures, and support questions. Do not invent errors merely to make the guide appear complete.

Completion criterion: every common blocker has a safe next action.

### Step 6: Run a non-technical read-through

Check every unexplained term, location change, command, expected result, and decision.

Completion criterion: a reader can proceed without inferring developer conventions.

### Step 7: Run technical verification

Check commands, versions, paths, schemas, tests, build, deployment, security, and links.

Completion criterion: the guide describes the current repository rather than a planned or remembered version.

### Step 8: Release guide and behavior together

Update guide, README, examples, tests, manifest, and changelog in the same change.

Completion criterion: no public surface points to the previous behavior or location.

## Pull-request gate

A guide-changing pull request must answer:

- Which user outcome changed?
- Which first-success step changed?
- Which commands were executed?
- Which links were checked?
- Which platform paths were tested?
- Which privacy or credential scans ran?
- What remains untested?

## Release checklist

### Discovery

- [ ] Promise names the user outcome
- [ ] Intended user is clear
- [ ] Default path is recommended
- [ ] Catalog entry is current

### First use

- [ ] Prerequisites can be checked
- [ ] Commands state their working directory
- [ ] Expected result follows each critical step
- [ ] Recovery path exists for common failures
- [ ] First valid outcome was tested from a clean environment

### Non-technical usability

- [ ] Operational terms are explained
- [ ] UI paths are exact
- [ ] Decisions are recommended rather than dumped on the reader
- [ ] No hidden copy, rename, or directory step exists

### Technical completeness

- [ ] Runtime versions are stated
- [ ] Architecture and data flow are current
- [ ] Configuration and environment variables are complete
- [ ] Tests and build commands pass
- [ ] Deployment source and root are correct
- [ ] Limitations are explicit

### Safety

- [ ] Examples are synthetic
- [ ] No credentials or private paths are present
- [ ] External data transfer is disclosed
- [ ] Destructive actions have guards
- [ ] Security reporting path works

### Maintenance

- [ ] README links to the canonical guide
- [ ] Manifest and catalog agree
- [ ] Changelog records the behavior change
- [ ] Update and uninstall steps are current
- [ ] Public links return successful responses

## Wrong output

A guide fails this SOP when it is polished but still requires the reader to infer location, prerequisites, command meaning, expected output, platform behavior, or recovery. It also fails when it serves beginners by deleting the technical detail required to audit and maintain the tool.

## Template

Copy [USER-GUIDE-TEMPLATE.md](templates/USER-GUIDE-TEMPLATE.md) into the new repository and replace every bracketed instruction. Delete sections only when the tool genuinely has no corresponding behavior, then state that omission in the pull request.
