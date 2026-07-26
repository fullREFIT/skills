#!/usr/bin/env python3
"""
loop_readiness_check.py - advisory pre-scan for loop/goal triage.

Scans a prompt or file for signals and prints a PROVISIONAL execution method.
This is a heuristic aid, not a verdict. Run the full triage procedure in
SKILL.md for the real decision. The script flags signals; judgment is yours.

Usage:
    python3 loop_readiness_check.py path/to/prompt.md
    cat prompt.md | python3 loop_readiness_check.py
"""

import sys
import re

SIGNALS = {
    "generative_core": [
        r"\brevoice", r"\bin voice\b", r"\bvoice\b", r"\bdraft", r"\bscript",
        r"\bcopywrit", r"\bnarrative", r"\btone\b", r"\bhumor\b", r"\bbrand\b",
        r"\bdesign\b", r"\bcreative\b", r"\bbest work\b", r"\bcompelling\b",
        r"\brecreate\b", r"\brewrite in\b",
    ],
    "anti_orchestration": [
        r"no\s*/?goal", r"no\s*/?loop", r"no background agent", r"no claude -p",
        r"\binline\b", r"one (?:at a time|piece|package|item)", r"stop for review",
        r"do not auto-continue", r"\bcheckpoint\b", r"human (?:review|gate|checkpoint)",
        r"validate the run", r"pattern-matching", r"quality (?:drifts|flattens)",
    ],
    "machine_checkable_done": [
        r"\btests? pass", r"\bexit(?:s)? 0\b", r"\bcompiles?\b", r"\bbuild (?:is )?green",
        r"\blint\b", r"\bgrep\b", r"\bcurl\b", r"\bschema\b", r"\bcount\b",
        r"queue is empty", r"zero (?:violations|errors)", r"redirect",
    ],
    "schedule_poll": [
        r"\bevery \d", r"\bpoll\b", r"\bwatch\b", r"\bmonitor\b", r"\bschedule",
        r"\bnightly\b", r"\bdaily\b", r"\bhourly\b", r"\bcron\b", r"\bwake up\b",
    ],
    "parallel_fanout": [
        r"\bparallel\b", r"\bsubagents?\b", r"\bfan out\b", r"\borchestrat",
        r"hundreds of", r"many files", r"across (?:the )?(?:repo|codebase)",
        r"\bmigration\b", r"repo-wide", r"\baudit\b",
    ],
    "unattended": [
        r"\bunattended\b", r"while (?:i am|i'm) away", r"machine off",
        r"\bovernight\b", r"\bwhile (?:you|i) sleep\b", r"runs? itself",
    ],
}


def scan(text):
    text_l = text.lower()
    hits = {}
    for name, patterns in SIGNALS.items():
        found = []
        for p in patterns:
            m = re.findall(p, text_l)
            if m:
                found.append(p.strip("\\b"))
        hits[name] = found
    return hits


def recommend(hits):
    gen = len(hits["generative_core"])
    anti = len(hits["anti_orchestration"])
    done = len(hits["machine_checkable_done"])
    sched = len(hits["schedule_poll"])
    par = len(hits["parallel_fanout"])
    unat = len(hits["unattended"])

    # Strongest signal first: explicit anti-orchestration or a generative core.
    if anti >= 2 or (gen >= 3 and done == 0):
        return ("NO LOOP (inline, human-gated)",
                "Generative/judgment core or explicit anti-orchestration language. "
                "Keep the core inline with checkpoints. Automate only deterministic "
                "verification edges (lint/test/redirect) as a script or bounded /goal.")
    if gen >= 2 and done >= 1:
        return ("SPLIT: no loop on the core, /goal or script on the edge",
                "Mixed signals: a generative core plus checkable sub-steps. Draft "
                "inline; run the deterministic checks as a downstream pass.")
    if unat >= 1 and sched >= 1:
        return ("ROUTINE (unattended, scheduled, cloud)",
                "Must run on a cadence while unattended. Self-contained prompt, "
                "draft/propose rather than ship, duration cap.")
    if sched >= 1:
        return ("/loop (poll on a timer, in-session)",
                "Watching something that changes. Session-scoped; no concept of done.")
    if par >= 2:
        return ("DYNAMIC WORKFLOW (fan out across subagents)",
                "Large, parallel work. Start with a small scoped slice; expect higher cost.")
    if done >= 1:
        return ("/goal (drive one task to a verifiable finish line)",
                "Has a machine-checkable done condition. Add a 'stop after N turns' bound.")
    return ("NO LOOP / plain prompt",
            "No clear finish line and no loop signal. A single prompt is likely best.")


def main():
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r", encoding="utf-8", errors="replace") as f:
            text = f.read()
    else:
        text = sys.stdin.read()

    if not text.strip():
        print("No input. Pass a file path or pipe text in.")
        sys.exit(0)

    hits = scan(text)
    verdict, why = recommend(hits)

    print("=" * 60)
    print("LOOP / GOAL TRIAGE - PROVISIONAL PRE-SCAN (advisory only)")
    print("=" * 60)
    print(f"\nPROVISIONAL METHOD: {verdict}")
    print(f"REASON: {why}\n")
    print("Signals found:")
    for name, found in hits.items():
        label = name.replace("_", " ")
        print(f"  {label:24s}: {len(found)}" + (f"  ({', '.join(sorted(set(found))[:6])})" if found else ""))
    print("\nThis is a heuristic, not a verdict. Run the full procedure in SKILL.md.")
    print("Generative cores stay inline even when a few 'done' signals appear.")


if __name__ == "__main__":
    main()
