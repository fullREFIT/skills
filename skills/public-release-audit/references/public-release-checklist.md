# Public Release Evidence Checklist

## Provenance

- [ ] Origin is classified as ORIGINAL, DERIVATIVE, THIRD-PARTY, or UNKNOWN
- [ ] License is present and compatible with the intended distribution
- [ ] Copied code, text, transcripts, data, and assets have attribution or permission
- [ ] Generated output does not reproduce restricted source material
- [ ] Unresolved ownership questions produce `HOLD`

## Privacy and security

- [ ] No credentials, tokens, cookies, private keys, or secret values
- [ ] No personal absolute paths, private domains, internal hostnames, or private IDs
- [ ] No personal email addresses, client names, confidential strategy, or unpublished plans
- [ ] No private prompts or system instructions that reveal protected context
- [ ] No hidden files, caches, logs, archives, or development handoffs
- [ ] Every scanner finding was inspected, resolved, or documented as an intentional public reference

## Portability

- [ ] Dependencies are public, documented, and replaceable where practical
- [ ] Environment variables have an example file with safe placeholder values
- [ ] Installation path is stated for every claimed platform
- [ ] A clean temporary environment can discover and install the artifact
- [ ] The first useful workflow has a reproducible command or prompt
- [ ] Unsupported platforms are explicitly marked unverified

## Package quality

- [ ] `SKILL.md` has valid frontmatter and a useful trigger description
- [ ] Core instructions are concise and progressive disclosure is used
- [ ] References are linked directly from the core file
- [ ] README explains purpose, install, prerequisites, contents, and license
- [ ] Catalog and machine-readable manifest are updated when present
- [ ] Validation, tests, type checks, and builds pass where defined
- [ ] ZIP has one top-level folder and no hidden files, caches, nested ZIPs, or secrets
- [ ] Changelog identifies the release and its verification level

## Final report fields

- Verdict and confidence
- Provenance evidence
- Files and lines with privacy findings
- Portability results by platform
- Commands run and actual outcomes
- Changed files
- Remaining blockers
- Stable, beta, experimental, or private release tier
