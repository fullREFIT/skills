#!/usr/bin/env python3
"""
audit_claudemd.py — deterministic checks on a distilled CLAUDE.md.

Catches the failure modes that are hard to see in your own draft: README drift,
transcript narration, budget overrun, unmarked volatile facts, unfilled template
placeholders, and rules that are vibes rather than criteria.

Usage:
    python3 audit_claudemd.py path/to/CLAUDE.md [--json] [--quiet]

Exit codes:
    0  no FAILs (WARNs may be present)
    1  one or more FAILs
    2  could not read the file
"""

import argparse
import json
import os
import re
import sys

# ---------------------------------------------------------------- budgets

# Budget is measured in tokens, not lines. Lines reward padding: the same content
# reflowed into more bullets "grows" without gaining a word of substance.
HARD_MAX_TOKENS = 5000
SOFT_MAX_TOKENS = 4000
SOFT_MIN_TOKENS = 800
HARD_MAX_LINES = 600          # secondary — a paste signal, not a budget
MIN_OPERATIVE_RATIO = 0.30

# ---------------------------------------------------------------- patterns

README_HEADINGS = [
    (r"\binstall(ation|ing)?\b", "installation steps"),
    (r"\bgetting started\b", "getting-started guide"),
    (r"\bprerequisites?\b", "prerequisites list"),
    (r"\bbadges?\b", "badges"),
    (r"\blicen[sc]e\b", "license section"),
    (r"\bcontribut(ing|ion|ors)\b", "contribution guidelines"),
    (r"\bcode of conduct\b", "code of conduct"),
    (r"\bcontact\b", "contact info"),
    (r"\bsupport\b", "support channels"),
    (r"\bchange ?log\b", "changelog"),
    (r"\brelease (notes|history)\b", "release history"),
    (r"\backnowledge?ments?\b", "acknowledgements"),
    (r"\bcredits\b", "credits"),
    (r"\btable of contents\b", "table of contents"),
    (r"\bfaq\b", "generic FAQ"),
]

NARRATIVE = [
    r"\bwe (discussed|talked about|explored|covered|decided|agreed|looked at|went over)\b",
    r"\bin (this|the|our) (conversation|chat|discussion|session|transcript|video|call)\b",
    r"\bthe (transcript|conversation|speaker|presenter|video|author) (said|says|noted|mentioned|explained)\b",
    r"\bit was (decided|agreed|noted|suggested)\b",
    r"\bthis (document|file) (summari[sz]es|describes|covers|explains) (the|our|this) (conversation|discussion|transcript)\b",
]

VIBES = [
    r"\bhigh[- ]quality\b",
    r"\bbest practices?\b",
    r"\bas needed\b",
    r"\bwhere appropriate\b",
    r"\bwhen appropriate\b",
    r"\bprofessional tone\b",
    r"\bmake it (compelling|engaging|great|good)\b",
    r"\bbe (helpful|accurate|clear|thorough|concise)\b",
    r"\bwrite (clean|good|clear) code\b",
    r"\buse (good|sound) judg?ement\b",
]

PLACEHOLDERS = [
    r"\bTODO\b",
    r"\bTBD\b",
    r"\bFIXME\b",
    r"\bLorem ipsum\b",
    r"\[topic\]",
    r"\[source date\]",
    r"\[distillation date\]",
    r"\[approach\]",
    r"\[term\]",
    r"\[pattern name\]",
    r"\[list, or \"none\"\]",
    r"\[restate the single most important constraint",
    r"\[3.5 lines",
    r"\[2.4 lines",
]

# volatile facts: money, percentages, versions, model-ish names, big numbers
VOLATILE = [
    r"\$\s?\d[\d,]*(\.\d+)?\s*(k|m|b|/mo|/month|/yr|/year|per month|per year)?",
    r"\b\d{1,3}(\.\d+)?\s?%",
    r"\bv?\d+\.\d+(\.\d+)?\b",
    r"\b(gpt|claude|gemini|llama|mistral|grok)[- ]?[\w.]*\d",
]

DATE_NEAR = r"(as of|dated|20\d\d|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b|\bq[1-4]\b|source date|verify)"

IMPERATIVES = {
    "use", "avoid", "prefer", "write", "read", "run", "check", "verify", "lead",
    "start", "stop", "keep", "cut", "drop", "add", "include", "exclude", "treat",
    "assume", "ask", "confirm", "escalate", "halt", "route", "send", "draft",
    "cap", "limit", "require", "reject", "flag", "mark", "record", "log", "cite",
    "name", "state", "default", "fall", "open", "close", "gate", "test", "measure",
    "track", "reconsider", "propose", "apply", "enforce", "separate", "split",
    "merge", "rewrite", "replace", "prioriti", "optimi", "focus", "target",
    "validate", "sanity", "review", "surface", "quarantine", "date", "pull",
    "push", "build", "generate", "produce", "deliver", "hand", "skip", "never",
    "always", "do", "don't", "dont",
}

OPERATIVE_HINTS = [
    r"^\s*(?:[-*+]|\d+\.)\s*(?:\*\*)?when\b",
    r"\bwhen\b.{0,80}?,\s*(?:do|use|lead|prefer|treat|escalate|halt|ask|cut|send|write|check)\b",
    r"\bif\b.{0,80}?,\s*(?:do|use|lead|prefer|treat|escalate|halt|ask|cut|send|write|check)\b",
    r"\b(do not|don't|never|always|must not|must|only ever|under no circumstances)\b",
    r"→",
]


def strip_code_blocks(lines):
    out, in_fence = [], False
    for ln in lines:
        if ln.strip().startswith("```"):
            in_fence = not in_fence
            out.append("")
            continue
        out.append("" if in_fence else ln)
    return out


def is_operative(line):
    s = line.strip()
    if not s or s.startswith("#") or s.startswith(">") or s.startswith("|"):
        return False
    body = re.sub(r"^\s*(?:[-*+]|\d+[.)])\s*", "", s)
    body = re.sub(r"^\*\*(.+?)\*\*\s*[—\-:]\s*", "", body)
    if not body:
        return False
    for pat in OPERATIVE_HINTS:
        if re.search(pat, body, re.I):
            return True
    first = re.sub(r"[^a-z']", "", body.split()[0].lower()) if body.split() else ""
    return any(first.startswith(v) for v in IMPERATIVES)


def headings(lines):
    return [(i + 1, ln.strip().lstrip("#").strip()) for i, ln in enumerate(lines)
            if re.match(r"^#{1,6}\s", ln)]


def audit(path):
    findings = []

    def add(level, check, msg, line=None):
        findings.append({"level": level, "check": check, "message": msg, "line": line})

    with open(path, "r", encoding="utf-8", errors="replace") as fh:
        raw = fh.read()

    lines = raw.splitlines()
    clean = strip_code_blocks(lines)
    n = len(lines)
    heads = headings(lines)
    head_text = " ".join(h[1].lower() for h in heads)
    body_lower = raw.lower()

    # ---- budget (token-primary)
    if n == 0:
        add("FAIL", "budget", "File is empty.")
        return findings, {"lines": 0}
    approx_tokens = int(len(raw) / 3.6)
    if approx_tokens > HARD_MAX_TOKENS:
        add("FAIL", "budget", f"~{approx_tokens} tokens — over the hard ceiling of {HARD_MAX_TOKENS}. "
                              "This is a paste or a summary, not a distillation. Rerun the behavior test.")
    elif approx_tokens > SOFT_MAX_TOKENS:
        add("WARN", "budget", f"~{approx_tokens} tokens — over the {SOFT_MAX_TOKENS} target. "
                              "Check whether the overflow belongs in docs/ or in a skill.")
    if approx_tokens < SOFT_MIN_TOKENS:
        add("WARN", "budget", f"Only ~{approx_tokens} tokens. Fine if the source was thin — say so in the "
                              "handoff. Otherwise you likely dropped operative content.")
    if n > HARD_MAX_LINES:
        add("WARN", "budget", f"{n} lines at ~{approx_tokens} tokens — unusually fragmented. "
                              "Check for a pasted list or over-bulleted prose.")

    # ---- README drift
    for pat, label in README_HEADINGS:
        for ln_no, h in heads:
            if re.search(pat, h, re.I):
                add("FAIL", "readme-drift",
                    f"Heading '{h}' looks like {label} — README material. "
                    "Keep it only as a one-line constraint that changes a decision.", ln_no)

    # ---- narrative leakage
    for i, ln in enumerate(clean, 1):
        for pat in NARRATIVE:
            if re.search(pat, ln, re.I):
                add("FAIL", "narrative",
                    f"Transcript narration: \"{ln.strip()[:110]}\" — rewrite as an instruction or cut.", i)
                break

    # ---- unfilled placeholders
    for i, ln in enumerate(lines, 1):
        for pat in PLACEHOLDERS:
            if re.search(pat, ln, re.I):
                add("FAIL", "placeholder",
                    f"Unfilled template placeholder: \"{ln.strip()[:110]}\"", i)
                break

    # ---- required structure
    if not re.search(r"(decision rules?|rules|operating rules|how to decide|playbook)", head_text):
        add("FAIL", "structure",
            "No decision-rules section found. Rules are the point of the file — "
            "if the source produced none, say so explicitly rather than shipping without them.")
    if not re.search(r"(purpose|objective|what this|mission|scope)", head_text):
        add("WARN", "structure", "No purpose/objective section. A fresh agent needs the goal, not just the rules.")
    if not re.search(r"(rejected|do not re-?propose|dead ends?|ruled out|considered and)", head_text + body_lower):
        add("WARN", "structure",
            "No 'Rejected — do not re-propose' section. Long sources almost always contain dismissed options, "
            "and omitting them means the agent re-proposes what the user already killed.")
    if not re.search(r"(constraints?|non-?negotiable|guardrails?)", head_text):
        add("WARN", "structure", "No constraints section — hard limits and preferences are indistinguishable.")

    # ---- provenance
    if not re.search(r"(built from|source[s]?:|distilled|derived from|based on the (transcript|conversation|source))",
                     body_lower):
        add("WARN", "provenance",
            "No provenance footer. Without a source and a date the file cannot age honestly.")
    if not re.search(r"20\d\d", raw):
        add("WARN", "provenance", "No year appears anywhere. Date the source so facts inherit a timestamp.")
    if not re.search(r"(inferred|not stated in (the )?source|my synthesis|unverified)", body_lower):
        add("WARN", "provenance",
            "Nothing marked as inferred. Either every rule came verbatim from the source (rare), "
            "or inference is going unmarked.")

    # ---- volatile facts without a nearby date/verify cue
    # A fact is covered if its own line carries a date/verify cue, OR if the section it
    # sits in is a dated quarantine section (heading or section preamble carries the cue).
    # Section-scoped rather than line-windowed: a properly dated volatile section should
    # not start failing at its fifth bullet.
    has_volatile_section = bool(re.search(r"volatile|verify before|as of", head_text))
    section_dated = [False] * (len(clean) + 1)
    cur_dated, preamble = False, 0
    for i, ln in enumerate(clean, 1):
        if re.match(r"^\s*#", ln):
            cur_dated = bool(re.search(r"volatile|verify before|as of|20\d\d", ln, re.I))
            preamble = 0
        elif ln.strip():
            if preamble < 3 and re.search(DATE_NEAR, ln, re.I):
                cur_dated = True
            preamble += 1
        section_dated[i] = cur_dated

    for i, ln in enumerate(clean, 1):
        if re.match(r"^\s*#", ln) or section_dated[i]:
            continue
        for pat in VOLATILE:
            m = re.search(pat, ln, re.I)
            if not m:
                continue
            if not re.search(DATE_NEAR, ln, re.I):
                lvl = "WARN" if has_volatile_section else "FAIL"
                add(lvl, "volatile",
                    f"Undated volatile fact \"{m.group(0).strip()}\" in: \"{ln.strip()[:90]}\" — "
                    "date it inline, or move it to the quarantined volatile-facts section. "
                    "Decision thresholds (word caps, touch counts, team-size bands) are constraints, "
                    "not volatile facts — spell those as words so they stay in the rules.", i)
            break

    # ---- vibes
    for i, ln in enumerate(clean, 1):
        for pat in VIBES:
            if re.search(pat, ln, re.I):
                add("WARN", "vibes",
                    f"Unverifiable criterion: \"{ln.strip()[:110]}\" — replace with something an "
                    "independent observer could check, or cut it as default behavior.", i)
                break

    # ---- long verbatim quotes
    for i, ln in enumerate(clean, 1):
        if len(ln.strip()) > 400:
            add("WARN", "paste", f"Very long line ({len(ln.strip())} chars) — likely pasted verbatim.", i)

    # ---- operative ratio
    content = [ln for ln in clean if ln.strip() and not ln.strip().startswith("#")
               and not ln.strip().startswith("<!--") and not re.match(r"^\s*-{3,}\s*$", ln)]
    op = [ln for ln in content if is_operative(ln)]
    ratio = (len(op) / len(content)) if content else 0.0
    if ratio < MIN_OPERATIVE_RATIO:
        add("WARN", "operative-ratio",
            f"Only {ratio:.0%} of content lines read as instructions (target ≥{MIN_OPERATIVE_RATIO:.0%}). "
            "The file is describing more than it is directing.")

    # ---- absolutes balance
    absolutes = len(re.findall(r"\b(MUST|NEVER|ALWAYS)\b", raw))
    rules_guess = max(len(re.findall(r"^\s*\d+\.\s", raw, re.M)), 1)
    if absolutes > 12 and absolutes > rules_guess:
        add("WARN", "absolutes",
            f"{absolutes} hard absolutes. When everything is a MUST the model has no priority ordering "
            "and improvises one. Demote what is really a preference.")

    stats = {
        "lines": n,
        "content_lines": len(content),
        "operative_lines": len(op),
        "operative_ratio": round(ratio, 3),
        "headings": len(heads),
        "approx_tokens": approx_tokens,
    }
    return findings, stats


def main():
    ap = argparse.ArgumentParser(description="Audit a distilled CLAUDE.md.")
    ap.add_argument("path")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--quiet", action="store_true", help="print FAILs only")
    args = ap.parse_args()

    if not os.path.isfile(args.path):
        print(f"ERROR: not a file: {args.path}", file=sys.stderr)
        sys.exit(2)

    try:
        findings, stats = audit(args.path)
    except OSError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(2)

    fails = [f for f in findings if f["level"] == "FAIL"]
    warns = [f for f in findings if f["level"] == "WARN"]

    if args.json:
        print(json.dumps({"path": args.path, "stats": stats,
                          "fail_count": len(fails), "warn_count": len(warns),
                          "findings": findings}, indent=2))
        sys.exit(1 if fails else 0)

    print(f"\nCLAUDE.md audit — {args.path}")
    print(f"  ~{stats['approx_tokens']} tokens · {stats['lines']} lines · "
          f"{stats['operative_ratio']:.0%} operative · {stats['headings']} headings\n")

    shown = fails if args.quiet else fails + warns
    if not shown:
        print("  No findings. Still run the fresh-agent test by hand: read only this file "
              "and ask whether you could make the decisions it governs.\n")
    for f in shown:
        loc = f" (line {f['line']})" if f["line"] else ""
        print(f"  [{f['level']}] {f['check']}{loc}: {f['message']}")

    print(f"\n  {len(fails)} FAIL · {len(warns)} WARN")
    print("  Fix every FAIL. Judge each WARN on its merits and tell the user which you accepted.\n")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
