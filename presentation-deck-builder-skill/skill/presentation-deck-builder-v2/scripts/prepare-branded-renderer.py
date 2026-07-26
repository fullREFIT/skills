#!/usr/bin/env python3
"""Create an isolated, branded presentation renderer from a report JSON file."""
from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import sys
from pathlib import Path

EXCLUDES = {'.git', 'node_modules', 'dist', '.vercel', '__pycache__'}
HEX = re.compile(r'^#[0-9A-Fa-f]{6}$')
SLUG = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
SAFE_FONT = re.compile(r'^[^{};<>\r\n]+$')
ROLES = {'dark', 'dark2', 'canvas', 'surface', 'text', 'muted', 'primary', 'primaryHover', 'secondary', 'border'}
MARKER = '.presentation-deck-builder-output'


def die(message: str) -> None:
    print(f'ERROR: {message}', file=sys.stderr)
    raise SystemExit(1)


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding='utf-8'))
    except Exception as error:
        die(f'Cannot read JSON {path}: {error}')
    if not isinstance(value, dict):
        die(f'Expected a JSON object in {path}')
    return value


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        die(f'Expected renderer marker missing: {label}')
    return text.replace(old, new, 1)


def validate_profile(profile: dict) -> None:
    for field in ('id', 'label', 'name', 'wordmark', 'colors', 'fonts', 'rules'):
        if field not in profile:
            die(f'Brand profile missing {field}')
    if not SLUG.fullmatch(str(profile['id'])):
        die('Brand profile id must be a kebab-case slug')
    for field in ('label', 'name', 'wordmark'):
        value = profile[field]
        if not isinstance(value, str) or not value.strip() or len(value) > 100:
            die(f'Brand profile {field} must be a non-empty string of 100 characters or fewer')
        if not SAFE_FONT.fullmatch(value):
            die(f'Brand profile {field} contains unsafe characters')
    if not isinstance(profile['rules'], list) or not all(isinstance(rule, str) for rule in profile['rules']):
        die('Brand profile rules must be an array of strings')
    missing = ROLES - set(profile['colors'])
    if missing:
        die(f'Missing color roles: {sorted(missing)}')
    for role in ROLES:
        if not HEX.fullmatch(str(profile['colors'][role])):
            die(f'Color {role} must be six-digit hex')
    for field in ('body', 'display', 'mono', 'googleCss'):
        if field not in profile['fonts'] or not isinstance(profile['fonts'][field], str):
            die(f'Fonts missing {field}')
    for field in ('body', 'display', 'mono'):
        if not SAFE_FONT.fullmatch(profile['fonts'][field]):
            die(f'Font field {field} contains unsafe CSS characters')
    font_url = profile['fonts']['googleCss']
    if font_url and not font_url.startswith('https://fonts.googleapis.com/css2?'):
        die('googleCss must be empty or an https://fonts.googleapis.com/css2 URL')


def patch_css(path: Path, profile: dict) -> None:
    text = path.read_text(encoding='utf-8')
    colors = profile['colors']
    values = {
        '--color-carbon-core': colors['dark'],
        '--color-forge-red': colors['primary'],
        '--color-forge-gold': colors['secondary'],
        '--color-forge-dark': colors['dark2'],
        '--color-ash-white': colors['canvas'],
        '--color-pure-white': colors['surface'],
        '--color-echo': colors['muted'],
        '--color-soft-gray': colors['border'],
        '--accent-primary-hover': colors['primaryHover'],
        '--font-body': profile['fonts']['body'],
        '--font-display': profile['fonts']['display'],
        '--font-mono': profile['fonts']['mono'],
    }
    for token, value in values.items():
        text, count = re.subn(rf'({re.escape(token)}:\s*)([^;]+)(;)', rf'\g<1>{value}\g<3>', text, count=1)
        if count != 1:
            die(f'Could not set CSS token {token}')
    path.write_text(text, encoding='utf-8')


def patch_types(path: Path) -> None:
    text = path.read_text(encoding='utf-8')
    text = replace_once(text, "name: 'full/REFIT';", 'name: string;', 'brand name')
    text = replace_once(text, "theme: 'carbon-forge';", 'theme: string;', 'brand theme')
    text = replace_once(text, "fullText: 'full/REFIT';", 'fullText: string;', 'wordmark')
    path.write_text(text, encoding='utf-8')


def patch_validator(path: Path, profile: dict) -> None:
    text = path.read_text(encoding='utf-8')
    text = replace_once(text, "name: z.literal('full/REFIT'),", 'name: z.string().min(1),', 'validator name')
    text = replace_once(text, "theme: z.literal('carbon-forge'),", 'theme: z.string().min(1),', 'validator theme')
    text = replace_once(text, "fullText: z.literal('full/REFIT'),", 'fullText: z.string().min(1),', 'validator wordmark')
    palette = 'const PALETTE = new Set([\n' + ''.join(f"  '{value.upper()}',\n" for value in sorted(set(profile['colors'].values()))) + ']);'
    text, count = re.subn(r'const PALETTE = new Set\(\[[\s\S]*?\]\);', palette, text, count=1)
    if count != 1:
        die('Could not replace validator palette')
    text = text.replace('must be a Carbon Forge color', f"must be a {profile['label']} profile color")
    path.write_text(text, encoding='utf-8')


def patch_wordmark(path: Path, profile: dict) -> None:
    text = path.read_text(encoding='utf-8')
    wordmark = html.escape(profile['wordmark'])
    aria = html.escape(profile['name'], quote=True)
    replacement = "export function renderWordmark(): string {\n  return '<span class=\"wordmark\" aria-label=\"" + aria + "\">" + wordmark + "</span>';\n}"
    text, count = re.subn(r'export function renderWordmark\(\): string \{[\s\S]*?\n\}', replacement, text, count=1)
    if count != 1:
        die('Could not replace wordmark renderer')
    path.write_text(text, encoding='utf-8')


def patch_index(path: Path, profile: dict) -> None:
    text = path.read_text(encoding='utf-8')
    name = html.escape(profile['name'], quote=True)
    text = re.sub(r'<title>.*?</title>', f'<title>{name} Presentation</title>', text, count=1)
    text = re.sub(r'<meta name="description" content="[^"]*"\s*/>', f'<meta name="description" content="A {name} presentation website." />', text, count=1)
    if profile['id'] != 'carbon-forge':
        text = re.sub(r'\s*<link rel="icon"[^>]*>', '', text, count=1)
    font_url = profile['fonts']['googleCss']
    if font_url:
        text = re.sub(r'<link href="https://fonts\.googleapis\.com/css2[^\"]+" rel="stylesheet"\s*/>', f'<link href="{html.escape(font_url, quote=True)}" rel="stylesheet" />', text, count=1)
    path.write_text(text, encoding='utf-8')


def safe_prepare_output(source: Path, output: Path, force: bool) -> None:
    source = source.resolve()
    output = output.resolve()
    if output in {Path('/').resolve(), Path.home().resolve()} or output == source:
        die('Refusing unsafe output path')
    if output.exists():
        if not force:
            die(f'Output exists: {output}. Re-run with --force only if this skill created it.')
        if not (output / MARKER).is_file():
            die(f'Refusing to replace unmarked directory: {output}')
        shutil.rmtree(output)
    shutil.copytree(source, output, ignore=shutil.ignore_patterns(*EXCLUDES))
    (output / MARKER).write_text('Created by presentation-deck-builder-v2.\n', encoding='utf-8')


def main() -> None:
    skill_root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--brand', required=True, help='Preset id or custom-brand')
    parser.add_argument('--source', type=Path, default=skill_root / 'assets' / 'renderer', help='Optional renderer source')
    parser.add_argument('--output', type=Path, required=True, help='New isolated renderer directory')
    parser.add_argument('--report', type=Path, required=True, help='Report JSON to render')
    parser.add_argument('--brand-profile', '--custom-profile', dest='brand_profile', type=Path, help='Required when --brand custom-brand')
    parser.add_argument('--force', action='store_true', help='Replace only an output previously created by this skill')
    args = parser.parse_args()

    if not args.source.is_dir():
        die(f'Source renderer missing: {args.source}')
    if not args.report.is_file():
        die(f'Report missing: {args.report}')
    is_custom = args.brand in {'custom', 'custom-brand'}
    profile_path = args.brand_profile if is_custom else skill_root / 'assets' / 'brands' / f'{args.brand}.json'
    if is_custom and not profile_path:
        die('--brand-profile is required when --brand custom-brand')
    if not profile_path or not profile_path.is_file():
        die(f'Brand profile missing: {profile_path}')

    profile = load_json(profile_path)
    validate_profile(profile)
    safe_prepare_output(args.source, args.output, args.force)
    patch_css(args.output / 'src' / 'styles.css', profile)
    patch_types(args.output / 'src' / 'types.ts')
    patch_validator(args.output / 'src' / 'report-validation.ts', profile)
    patch_wordmark(args.output / 'src' / 'render-report.ts', profile)
    patch_index(args.output / 'index.html', profile)

    report = load_json(args.report)
    slug = str(report.get('slug', ''))
    if not SLUG.fullmatch(slug):
        die('Report slug missing or invalid')
    report['brand'] = {
        'name': profile['name'],
        'theme': profile['id'],
        'wordmark': {
            'fullText': profile['wordmark'],
            'slashColor': profile['colors']['primary'],
        },
    }
    if profile.get('tagline'):
        report['brand']['wordmark']['tagline'] = profile['tagline']

    rendered = json.dumps(report, indent=2) + '\n'
    for relative in [
        Path('content/reports/sample-report.json'),
        Path(f'content/reports/{slug}.json'),
        Path(f'public/reports/{slug}.json'),
    ]:
        destination = args.output / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(rendered, encoding='utf-8')

    manifest = {
        'defaultSlug': slug,
        'reports': [{
            'slug': slug,
            'title': report.get('title', slug),
            'description': report.get('seo', {}).get('description', report.get('subtitle', '')),
            'jsonPath': f'/reports/{slug}.json',
            'publicPath': f'/report/{slug}',
        }],
    }
    (args.output / 'public' / 'report-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')

    package_path = args.output / 'package.json'
    package = load_json(package_path)
    package['name'] = f'presentation-{slug}'
    package['description'] = f"{profile['label']} presenter website for {slug}"
    package.setdefault('scripts', {})['validate'] = f'tsx src/validate-report.ts content/reports/{slug}.json'
    package_path.write_text(json.dumps(package, indent=2) + '\n', encoding='utf-8')
    (args.output / 'brand-profile.applied.json').write_text(json.dumps(profile, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'status': 'prepared', 'brand': profile['id'], 'slug': slug, 'output': str(args.output.resolve())}, indent=2))


if __name__ == '__main__':
    main()
