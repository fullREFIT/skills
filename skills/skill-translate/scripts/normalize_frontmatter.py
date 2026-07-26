#!/usr/bin/env python3
"""
normalize_frontmatter.py — bring SKILL.md frontmatter into Agent Skills spec compliance.

The spec allows exactly six top-level frontmatter keys: name, description, license,
compatibility, metadata, allowed-tools. Anything else (version, author, homepage,
repository, argument-hint, user-invocable, model) is rejected by strict validators and
by upload paths, even though Claude Code tolerates it at runtime.

Rather than delete those keys — they carry real intent — this moves them under
`metadata`, which the spec defines as an arbitrary string-to-string map. Nothing is lost
and the file validates.

Usage:
    normalize_frontmatter.py <dir> [<dir> ...] [--apply] [--quiet]

Default is a dry run. Nothing is written without --apply.
Each <dir> is a skills root (scanned one level deep for */SKILL.md) or a single skill dir.

Exit: 0 clean or changes applied; 1 if a file could not be parsed.
"""

import os
import re
import sys

ALLOWED = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
KEY_RE = re.compile(r"^([A-Za-z0-9_-]+):(.*)$")


def split_frontmatter(text):
    """Return (pre, frontmatter, post) or None if there is no frontmatter block."""
    if not text.startswith("---"):
        return None
    rest = text[3:]
    if rest.startswith("\n"):
        rest = rest[1:]
    end = re.search(r"^---\s*$", rest, re.M)
    if not end:
        return None
    return "---\n", rest[: end.start()], rest[end.end():]


def parse_blocks(fm):
    """Chunk frontmatter into [(key, raw_block)] preserving multi-line values.

    A top-level key owns every following line until the next unindented `key:` line,
    which keeps quoted multi-line descriptions and indented metadata children intact.
    """
    blocks, cur_key, cur = [], None, []
    for line in fm.splitlines(keepends=True):
        m = KEY_RE.match(line)
        if m and not line[:1].isspace():
            if cur_key is not None:
                blocks.append((cur_key, "".join(cur)))
            cur_key, cur = m.group(1), [line]
        else:
            if cur_key is None:
                blocks.append((None, line))
            else:
                cur.append(line)
    if cur_key is not None:
        blocks.append((cur_key, "".join(cur)))
    return blocks


def scalar(raw, key):
    """Extract a single-line scalar value for `key` from its raw block."""
    first = raw.splitlines()[0]
    v = first[len(key) + 1:].strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        v = v[1:-1]
    return v


def normalize(text):
    """Return (new_text, moved_keys) or (None, reason) on failure."""
    parts = split_frontmatter(text)
    if not parts:
        return None, "no frontmatter"
    pre, fm, post = parts
    blocks = parse_blocks(fm)

    offenders = [(k, raw) for k, raw in blocks if k and k not in ALLOWED]
    if not offenders:
        return None, "already compliant"

    # A multi-line offender (a nested block masquerading as a top-level key) is not
    # safely representable as a metadata string — refuse rather than mangle it.
    for k, raw in offenders:
        if len(raw.rstrip("\n").splitlines()) > 1:
            return None, f"key '{k}' spans multiple lines — needs a human"

    kept, meta_children = [], []
    for k, raw in blocks:
        if k == "metadata":
            body = raw.splitlines(keepends=True)[1:]
            meta_children.extend(l for l in body if l.strip())
            continue
        if k and k not in ALLOWED:
            continue
        kept.append(raw)

    moved = []
    for k, raw in offenders:
        v = scalar(raw, k).replace('"', "'")
        meta_children.append(f'  {k}: "{v}"\n')
        moved.append(k)

    new_fm = "".join(kept)
    if not new_fm.endswith("\n"):
        new_fm += "\n"
    new_fm += "metadata:\n" + "".join(meta_children)
    return pre + new_fm + "---" + post, moved


def targets(paths):
    for p in paths:
        p = os.path.expanduser(p)
        if os.path.isfile(os.path.join(p, "SKILL.md")):
            yield os.path.join(p, "SKILL.md")
            continue
        if os.path.isdir(p):
            for child in sorted(os.listdir(p)):
                f = os.path.join(p, child, "SKILL.md")
                if os.path.isfile(f):
                    yield f


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    apply_ = "--apply" in sys.argv
    quiet = "--quiet" in sys.argv
    if not args:
        print(__doc__.strip(), file=sys.stderr)
        sys.exit(1)

    scanned = changed = skipped = 0
    problems = []
    home = os.path.expanduser("~")

    for f in targets(args):
        scanned += 1
        try:
            text = open(f, encoding="utf-8").read()
        except OSError as exc:
            problems.append((f, str(exc)))
            continue
        new, info = normalize(text)
        if new is None:
            if info != "already compliant":
                problems.append((f, info))
            continue
        changed += 1
        label = f.replace(home, "~")
        if not quiet:
            print(f"{'FIX ' if apply_ else 'WOULD FIX'} {label}  ->  metadata: {', '.join(info)}")
        if apply_:
            open(f, "w", encoding="utf-8").write(new)

    print(f"\nscanned {scanned} SKILL.md files · {changed} "
          f"{'normalized' if apply_ else 'would be normalized'} · {len(problems)} need attention")
    for f, why in problems:
        print(f"  SKIP {f.replace(home, '~')}: {why}")
    if not apply_ and changed:
        print("\nDry run. Re-run with --apply to write.")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
