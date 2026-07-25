import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const ignored = new Set(['.git', '.vercel', 'node_modules', 'dist', '_archive']);
const textExtensions = new Set(['.md', '.py', '.sh', '.mjs', '.js', '.ts', '.tsx', '.json', '.html', '.css', '.yml', '.yaml', '.toml', '.txt']);
const findings = [];
const required = [
  'README.md',
  'USER-GUIDE.md',
  'LICENSE',
  'SECURITY.md',
  'skill/presentation-deck-builder-v2/SKILL.md',
  'skill/presentation-deck-builder-v2/assets/renderer/package.json',
  'skill/presentation-deck-builder-v2/scripts/prepare-branded-renderer.py'
];

const forbidden = [
  { label: 'private macOS user path', pattern: /\/Users\/[A-Za-z0-9._-]+\//g },
  { label: '1Password item reference', pattern: /op:\/\//g },
  { label: '1Password helper', pattern: /\b1pw\b/g },
  { label: 'GitHub token', pattern: /gh[opsu]_[A-Za-z0-9]{20,}/g },
  { label: 'OpenAI-style secret', pattern: /\bsk-[A-Za-z0-9_-]{20,}/g },
  { label: 'private revenue pipeline reference', pattern: /revenue-content-pipeline/gi },
  { label: 'Open Brain internal reference', pattern: /open-brain/gi },
  { label: 'private Hostinger service', pattern: /srv1236743|hstgr\.cloud/gi }
];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (ignored.has(name)) continue;
    const path = join(directory, name);
    const info = statSync(path);
    if (info.isDirectory()) walk(path);
    else if (textExtensions.has(extname(path).toLowerCase())) inspect(path);
  }
}

function inspect(path) {
  const rel = relative(root, path);
  if (rel === 'scripts/audit-public.mjs') return;
  const text = readFileSync(path, 'utf8');
  for (const rule of forbidden) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(text)) findings.push(`${rel}: ${rule.label}`);
  }
  if ((rel.endsWith('.md') || rel.endsWith('.html')) && text.includes('—')) {
    findings.push(`${rel}: em dash in public prose`);
  }
}

for (const path of required) {
  try {
    if (!statSync(join(root, path)).isFile()) findings.push(`${path}: required file is not a file`);
  } catch {
    findings.push(`${path}: required file missing`);
  }
}

walk(root);

if (findings.length) {
  console.error('Public-package audit failed:');
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log('Public-package audit passed. No private paths, credential patterns, or banned prose punctuation found.');
