// Content build step: validate a report JSON, then emit it where the site can fetch it.
//   --prepare-only  write into public/ for the Vite dev server (pre-build)
//   --dist-only     write into dist/ for the deployed bundle (post-vite-build)
//   (neither)       do both
// The renderer is never touched here — content and presentation stay separate.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Report } from '../src/types';
import { validateReport } from '../src/report-validation';

interface Args {
  input: string;
  out: string;
  prepareOnly: boolean;
  distOnly: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    input: 'content/reports/sample-report.json',
    out: 'dist',
    prepareOnly: false,
    distOnly: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--input') args.input = argv[index + 1] ?? args.input;
    if (value === '--out') args.out = argv[index + 1] ?? args.out;
    if (value === '--prepare-only') args.prepareOnly = true;
    if (value === '--dist-only') args.distOnly = true;
  }

  return args;
}

export function buildReport(args: Args): Report {
  const report = validateReport(JSON.parse(readFileSync(resolve(args.input), 'utf8')));
  const reportJson = `${JSON.stringify(report, null, 2)}\n`;
  const manifest = `${JSON.stringify(
    { defaultSlug: report.slug, reports: [{ slug: report.slug, title: report.title }] },
    null,
    2
  )}\n`;

  if (!args.distOnly) {
    writeGeneratedFile(resolve('public', 'reports', `${report.slug}.json`), reportJson);
    writeGeneratedFile(resolve('public', 'report-manifest.json'), manifest);
    writeGeneratedFile(resolve('public', '_redirects'), '/report/* /index.html 200\n');
  }

  if (!args.prepareOnly) {
    writeGeneratedFile(resolve(args.out, 'reports', `${report.slug}.json`), reportJson);
    writeGeneratedFile(resolve(args.out, 'report-manifest.json'), manifest);
    writeGeneratedFile(resolve(args.out, '_redirects'), '/report/* /index.html 200\n');
  }

  return report;
}

function writeGeneratedFile(filePath: string, contents: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = buildReport(parseArgs(process.argv.slice(2)));
    console.log(`Prepared report data: ${report.slug} (${report.items.length} items)`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
