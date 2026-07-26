# [Tool or Repository Name] User Guide

> Replace every bracketed instruction before publication. This template serves first-time users and technical operators in one layered document.

## What this tool does

[Explain the input, transformation, output, intended user, and main limitation in plain language.]

### Use this when

- [User job]
- [User job]

### This does not

- [Important boundary]
- [Unsupported outcome]

## Choose your path

**Recommended:** [Name the easiest supported path and why.]

| Path | Choose it when | Start here |
| --- | --- | --- |
| [Download or UI path] | [Non-technical use case] | [Link] |
| [Agent installation] | [Agent use case] | [Link] |
| [Clone and run] | [Technical use case] | [Link] |

## Before you start

### What you need

| Requirement | What it is | Why it is needed | Check it |
| --- | --- | --- | --- |
| [Requirement] | [Plain-language definition] | [Reason] | `[Safe check command or UI path]` |

### Open a terminal

[Explain how to open the supported terminal application. Delete this section only when no terminal workflow exists.]

### Know your working folder

[Explain where the user should run commands and how the prompt or UI confirms the location.]

## Fastest first success

### Step 1: [Action]

[Explain what this action does.]

```bash
[Copyable command]
```

**Expected result:** [Exact message, file, page, or status.]

**If that does not happen:** [Safe recovery action.]

### Step 2: [Action]

[Repeat the same action, meaning, result, and recovery pattern.]

### First-success check

[State the observable outcome that proves the supported workflow worked.]

## Install by platform

### Claude.ai or Claude Desktop

1. [Exact UI path]
2. [Exact file to upload]
3. [Whether capabilities must be enabled]
4. [Trigger prompt]

**Expected result:** [Observable response or artifact.]

**Test status:** [Tested version and date, or format compatible but not tested.]

### Claude Code

```bash
[Exact installation command]
```

[State restart behavior and trigger test.]

### OpenAI Codex

```bash
[Exact installation command]
```

[State restart behavior and trigger test.]

### Cursor

```bash
[Exact installation command]
```

[State restart behavior and trigger test.]

### Manual or developer installation

```bash
[Clone and setup commands]
```

## Core workflows

### [Workflow name]

**Use this when:** [User job.]

**Starting input:** [File, text, URL, or state.]

**Decisions required:** [Only real decisions. Recommend defaults.]

1. [Step]
2. [Step]
3. [Step]

**Generated output:** [Exact files, page, external effect, or status.]

**Validate:**

```bash
[Validation command]
```

**Done when:** [Checkable completion criterion.]

**Common failure:** [Symptom and recovery.]

## Concepts and glossary

| Term | Meaning in this tool |
| --- | --- |
| [Term] | [Definition] |

## Configuration

### Configuration locations

| File or setting | Purpose | Required |
| --- | --- | --- |
| [Path or UI setting] | [Purpose] | [Yes or no] |

### Fields

| Field | Type | Default | Accepted values | Meaning |
| --- | --- | --- | --- | --- |
| [Field] | [Type] | [Default] | [Values] | [Meaning] |

### Environment variables

| Variable | Required | Secret | Purpose |
| --- | --- | --- | --- |
| [NAME] | [Yes or no] | [Yes or no] | [Purpose] |

Use synthetic values in examples. Never paste real credentials into the guide.

## Data, privacy, and security

### Data read

- [Data]

### Data written

- [Data and location]

### Data sent to external services

- [Service, data, and reason]

### Credentials

[Explain source and safe storage without exposing values.]

### Destructive actions

[Explain guards, confirmations, output markers, and rollback.]

### Security reports

[Link to SECURITY.md and private reporting path.]

## Verification and tests

### User verification

```bash
[Command that proves the user's result]
```

**Pass means:** [Observable result.]

### Maintainer release gate

```bash
[Install command]
[Full check command]
```

The gate covers:

- [Test]
- [Type or lint check]
- [Build]
- [Privacy scan]
- [Package verification]

### Generated artifacts

| Artifact | Location | Cleanup |
| --- | --- | --- |
| [Artifact] | [Path] | [Safe cleanup] |

## Troubleshooting

### [Symptom the user sees]

**Likely cause:** [Cause.]

**Check:**

```bash
[Safe diagnostic]
```

**Fix:** [Action.]

**Verify:** [Post-fix check.]

**Escalate when:** [Boundary and help path.]

## Architecture and technical reference

### Directory map

```text
[Current directory tree]
```

### Data flow

1. [Input stage]
2. [Validation stage]
3. [Transformation stage]
4. [Output stage]

### Runtime boundaries

[Process, browser, server, file, and external-service boundaries.]

### Schemas and APIs

[Link to canonical reference rather than duplicating it.]

### Build and deployment

- Build command: `[command]`
- Output directory: `[path]`
- Deployment provider: [provider]
- Git source: [repository]
- Root directory: [path]
- Production URL: [URL]

### Supported and unsupported behavior

| Area | Supported | Not supported |
| --- | --- | --- |
| [Area] | [Behavior] | [Boundary] |

## Update, migration, and removal

### Check your version

```bash
[Version command]
```

### Update

```bash
[Update command]
```

[State what is preserved.]

### Roll back

```bash
[Rollback command]
```

### Uninstall or remove

```bash
[Removal command]
```

[State which user files remain.]

## Getting help

- Bugs: [Issue form]
- Questions and ideas: [Discussion category]
- Security: [Private reporting path]

Include:

- Version or commit
- Operating system
- Exact step that failed
- Error text with credentials removed
- Minimal synthetic input when relevant

Never publish credentials, customer data, private reports, or personal information.

## Release verification record

- Guide tested on: [date]
- Platforms tested: [list]
- Canonical check: `[command]`
- Production URL verified: [URL]
- Known untested paths: [list]
