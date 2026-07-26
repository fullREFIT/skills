import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import type { Report } from './types';
import { validateReport } from './report-validation';

export { validateReport };

export function readReportFile(filePath: string): Report {
  return validateReport(JSON.parse(readFileSync(filePath, 'utf8')));
}

// CLI: `tsx src/validate-report.ts <report-json-path>` — exits non-zero on failure.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: tsx src/validate-report.ts <report-json-path>');
    process.exit(1);
  }

  try {
    const report = readReportFile(filePath);
    console.log(`Validated report: ${report.slug} (${report.items.length} items)`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
