# Prompt Changelog: full/REFIT Skills Migration and GitHub Optimization

## Revised prompt

```text
Objective

Convert the existing public Presentation Deck Builder repository into the canonical full/REFIT public skills monorepo, benchmark its public-usability architecture against mattpocock/skills, and create an enforceable repository standard that helps non-technical users succeed without hiding the technical detail maintainers need.

GitHub repository paths support only owner/repository. Therefore use this achievable public structure:

- Repository: https://github.com/fullREFIT/skills
- Presentation Deck Builder project directory: presentation-deck-builder-skill/
- Canonical project page: https://github.com/fullREFIT/skills/tree/main/presentation-deck-builder-skill

Execute the migration and baseline improvements. Do not return only a plan.

Required work

1. Inspect the live mattpocock/skills repository and the current fullREFIT/presentation-deck-builder-skill repository using GitHub evidence.
2. Explain what Matt's repository does well in positioning, first-use flow, catalog architecture, invocation model, progressive disclosure, setup, routing, release discipline, and maintenance.
3. Separate repository lessons from popularity effects that a repository rewrite cannot reproduce, such as audience, reputation, and distribution.
4. Identify what the full/REFIT repository already does better and preserve those strengths.
5. Rename the existing GitHub repository to fullREFIT/skills so GitHub preserves the old repository URL as a redirect and retains history.
6. Move the existing project into presentation-deck-builder-skill/ within the same Git history.
7. Preserve Presentation Deck Builder v1 unchanged.
8. Update all canonical source, clone, guide, security, license, and download references for the monorepo layout.
9. Preserve the production landing page and direct ZIP URL.
10. Configure Vercel to build from presentation-deck-builder-skill/ and verify future Git deployments use the renamed repository.
11. Add the high-confidence public-usability baseline now:
   - Root promise and quick start
   - Browsable skill catalog
   - Machine-readable skill manifest
   - Root validation command
   - GitHub Actions quality gate
   - Contribution and security paths
   - Issue and pull-request templates
   - Changelog
   - Repository topics and discussions
12. Create an evidence-based GitHub optimization plan prioritized as now, next, and later. Do not add infrastructure merely to imitate a mature multi-skill repository.
13. Create a reusable Repository User Guide SOP and copyable template for every public repository, app, tool, and skill.
14. Make the guide standard work for two readers in one layered document:
   - A first-time non-technical reader who needs plain-language prerequisites, exact actions, expected results, and recovery steps
   - A technical operator who needs architecture, versions, commands, configuration, schemas, tests, deployment, security, failure modes, and migration details
15. Run local validation, tests, builds, package checks, public-path scans, GitHub link checks, and production desktop and mobile QA.
16. Create a tagged release from the canonical monorepo commit and verify its ZIP checksum against the production download.
17. Save the migration decision, verification record, residual tasks, and session summary to Open Brain.

Acceptance criteria

- https://github.com/fullREFIT/skills is public and uses main as its default branch.
- The old repository URL redirects rather than returning 404.
- Presentation Deck Builder is browsable under presentation-deck-builder-skill/.
- Git history is preserved.
- The root README tells a first-time visitor what the collection is, which skill to choose, and the fastest next action.
- The SOP and template are detailed enough for a fresh agent to produce a complete guide without asking for missing standards.
- One root command validates repository structure and the current skill's code, tests, type checks, builds, privacy checks, and package.
- GitHub Actions runs the same release gate.
- Vercel is connected to fullREFIT/skills with rootDirectory set to presentation-deck-builder-skill.
- The existing landing-page URL and ZIP URL still return the intended current release.
- All public source and guide links point to the canonical monorepo paths.
- The GitHub release asset and production ZIP have the same SHA-256 checksum.
- Every unverified compatibility or distribution path is labeled rather than claimed.

Wrong output

The task has failed if it does any of the following:

- Tries to create the impossible nested repository URL fullREFIT/skills/presentation-deck-builder-skill
- Creates a second active source repository and leaves users with two canonical versions
- Produces a polished comparison and plan without executing the safe migration and baseline improvements
- Copies Matt Pocock's branding, prose, or content instead of extracting reusable architecture
- Treats stars as proof that repository structure caused popularity
- Breaks the live Vercel deployment, direct download, old GitHub URL, or future Git deployments
- Deletes history, version 1, security guidance, privacy checks, tests, or the detailed user guide
- Writes beginner documentation that omits technical detail
- Writes technical documentation that assumes the reader knows terminal, directories, prerequisites, or recovery steps
- Advertises plugin or third-party installer support without an end-to-end clean-environment test
- Reports completion without live GitHub, package, Vercel, desktop, mobile, accessibility, and Open Brain verification

Use live evidence for current facts. Never expose credentials, private paths, customer data, or internal reports in public artifacts.
```

## What was actually wrong

### The requested GitHub URL is impossible

GitHub repository URLs have the shape `owner/repository`. A third path segment can only be a directory inside a repository. A literal agent could waste time trying to create an invalid nested repository or silently create the wrong repository.

**Fix:** Define `fullREFIT/skills` as the repository and `presentation-deck-builder-skill/` as its directory. State the canonical browser URL using `/tree/main/`.

### “Move” did not define history, redirect, or duplicate-source behavior

A fluent agent could create a new repository, copy files, and leave the old repository active. That would satisfy the visible URL request while creating two sources of truth.

**Fix:** Require a GitHub rename, in-history directory move, old-URL redirect, and one canonical source.

### The production dependency was hidden

The existing GitHub repository was connected to the live Vercel project. Moving files into a subdirectory without changing Vercel's root directory would make future Git deployments fail even if the existing cached production deployment remained online.

**Fix:** Make Vercel root configuration, Git-source verification, and a fresh production deployment explicit acceptance criteria.

### “Analyze what is good” was vulnerable to popularity imitation

Matt Pocock's repository has a large audience signal, but star count does not identify which repository choices caused adoption.

**Fix:** Require evidence by category, separate repository architecture from audience effects, and preserve full/REFIT strengths that Matt's repository does not provide.

### “Optimized and publicly usable” had no completion test

An agent could add badges, templates, automation, and files without improving first use.

**Fix:** Define success around first outcome, progressive disclosure, package integrity, safety, maintenance agreement, and verified public paths.

### The instruction-guide requirement did not define the information architecture

“Non-technical but detailed” can produce either a patronizing simplified guide or a wall of developer instructions.

**Fix:** Require one layered canonical guide with a plain-language first-success path and later technical reference. Require expected results and recovery after every critical action.

### The request asked for a plan but not which recommendations to implement

A plan-only response would be fluent and complete-looking while leaving the repository unchanged.

**Fix:** Require immediate implementation of safe baseline improvements and stage distribution or scale infrastructure until evidence justifies it.

### Verification was absent

The original request did not require link, package, CI, Vercel, browser, release, or redirect verification.

**Fix:** Add explicit evidence gates and define unverified claims as failure.

## Changes and what each fixes

| Change | Failure prevented |
| --- | --- |
| Replaced invalid nested repository with monorepo and directory URLs | Impossible GitHub operation |
| Required rename rather than duplicate creation | Two canonical repositories and lost redirects |
| Required same-history move | Lost provenance and broken release history |
| Added Vercel root-directory migration | Cached site appears healthy while future deploys fail |
| Added source-based benchmark categories | Vague praise and popularity cargo culting |
| Preserved full/REFIT strengths | Destructive imitation of a weaker governance model |
| Added layered guide architecture | Beginner or technical audience sacrificed |
| Added expected-result and recovery rules | Copyable steps that still leave users stranded |
| Added immediate baseline implementation | Plan theater |
| Added now, next, and later thresholds | Premature infrastructure |
| Added explicit wrong-output section | Fluent compliance that misses the objective |
| Added live acceptance tests | Unverified completion claims |

## Flags a rewrite alone cannot solve

- Repository quality cannot reproduce Matt Pocock's audience, reputation, distribution, or historical momentum.
- A GitHub social preview requires a suitable visual asset and repository-setting update.
- Third-party installer behavior depends on the current external service and must be tested after the monorepo is public.
- Plugin compatibility must be verified in a clean client profile before it is advertised.
- User success rates require real usage or support evidence. Documentation quality can reduce risk but cannot prove adoption in advance.

## Verdict

**Ready to run as-is.** The invalid URL has an explicit, safe interpretation and every remaining decision has a recommended default and a verification gate.
