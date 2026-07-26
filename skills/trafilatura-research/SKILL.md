---
name: trafilatura-research
description: "Use Trafilatura for fast extraction of clean article text, metadata, and Markdown from web pages. Best for research corpora, article cleanup, and preparing sources for summaries or retrieval."
license: Apache-2.0
metadata:
  hermes:
    tags: [research, scraping, web-extraction, ai-research]
  version: "1.0.0"
  source: "https://github.com/adbar/trafilatura"
---
# Trafilatura Research Extraction

## When to use

Use this skill when the task needs clean article text, metadata, or Markdown from public pages, especially for research briefs, corpora, and source cleanup.

## Workflow

1. Check whether `trafilatura` is installed with `scripts/trafilatura_check.py`.
2. Use known URLs from search, last30days, GitHub, or user-provided sources.
3. Extract main text and metadata.
4. Preserve the source URL and extraction date.
5. If extraction fails or returns boilerplate, try Crawl4AI or Firecrawl next.

## Strengths

- Fast and lightweight.
- Good article extraction quality.
- Works from Python or CLI.
- Useful for batch-cleaning research sources.

## Caveats

- Not a browser automation tool.
- Not a full crawler orchestration framework.
- Less suitable for app-like pages, heavy JavaScript, or login-gated pages.

## Bad output

- Treating the extracted text as complete without checking for missing sections.
- Using it for dynamic UI scraping when a browser tool is required.
- Dropping URLs or metadata from research notes.
