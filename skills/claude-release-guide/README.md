# Claude Release Guide

A specialized sibling to `transcript-deep-dive`, focused exclusively on converting shallow source material about new Claude product releases (Claude Design, Claude Code features, new Opus/Sonnet/Haiku models, Cowork updates, MCP changes, pricing) into verified, teaching-grade implementation guides.

> **v1.1 note:** Renamed from the prior version to comply with SKILL.md reserved-word validation. The vendor name was rejected in the `name` field; this release uses the product family name instead.

## What It Adds Over transcript-deep-dive

| transcript-deep-dive | claude-release-guide |
|---|---|
| Any topic | Claude products only |
| Single transcript default | Multi-source cross-reference default |
| General web verification | Primary-source verification (claude.com/news, docs.claude.com) |
| Generic guide template | Release metadata block, rollout status, access-check section, "Teach This" |
| No voice enforcement | your configured voice (see config.example.md) with banned-word check |
| Contradiction handling optional | Multi-source contradiction detection mandatory |

## When to Use

- New Claude product or feature has dropped
- You have one or more transcripts, the official announcement, or third-party coverage
- You want a guide you can teach from, publish as a lead magnet, or post to Skool

## When NOT to Use

- Topic is not a Claude product → use `transcript-deep-dive`
- You want a short summary, not a guide → use a direct prompt
- You want to build a new skill → use `skill-architect`

## Required Setup

- Web search must be available in the session (mandatory for primary-source verification)
- At least one source material input (transcript, announcement, or pasted text)
- If using a specific brand voice: load your voice guide or brand guidelines as context

## Output

- Markdown guide with verified citations
- Release metadata block (date, status, model, access tier)
- Decision frameworks and limitations sections
- Sources & Verification log

---
*v1.0 — April 2026*
