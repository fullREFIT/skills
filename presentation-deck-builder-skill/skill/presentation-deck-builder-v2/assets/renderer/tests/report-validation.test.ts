import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateReport } from '../src/report-validation';
import type { Report } from '../src/types';

function loadSample(): Report {
  return JSON.parse(readFileSync(resolve('content/reports/sample-report.json'), 'utf8')) as Report;
}

describe('validateReport — structure & brand', () => {
  it('accepts the bundled sample report', () => {
    const report = validateReport(loadSample());
    expect(report.slug).toBeTruthy();
    expect(report.items.length).toBeGreaterThan(0);
  });

  it('requires exactly one summary tab per item', () => {
    const report = loadSample();
    report.items[0].tabs = report.items[0].tabs.filter((tab) => tab.type !== 'summary');
    expect(() => validateReport(report)).toThrow(/exactly one summary tab/);
  });

  it('rejects non-https source links', () => {
    const report = loadSample();
    report.items[0].sources[0].url = 'http://example.com';
    expect(() => validateReport(report)).toThrow(/https/);
  });

  it('rejects a slash color outside the active profile palette', () => {
    const report = loadSample();
    report.brand.wordmark.slashColor = '#00FF00';
    expect(() => validateReport(report)).toThrow(/color/);
  });

  it('rejects gold stat emphasis on a non-teams item', () => {
    const report = loadSample();
    const systemsItem = report.items.find((item) => item.layer === 'systems');
    expect(systemsItem).toBeDefined();
    systemsItem!.stats = [{ label: 'TEST', value: '1', emphasis: 'gold' }];
    expect(() => validateReport(report)).toThrow(/gold stat emphasis/);
  });

  it('rejects duplicate item ids', () => {
    const report = loadSample();
    report.items.push({ ...report.items[0] });
    expect(() => validateReport(report)).toThrow(/Duplicate item id/);
  });
});

describe('validateReport — presenter content budgets', () => {
  it('rejects a headline longer than 18 words', () => {
    const report = loadSample();
    report.items[0].headline = Array.from({ length: 19 }, (_, i) => `word${i}`).join(' ');
    expect(() => validateReport(report)).toThrow(/headline must be 18 words/);
  });

  it('rejects a takeaway longer than 24 words', () => {
    const report = loadSample();
    report.items[0].takeaway = Array.from({ length: 25 }, (_, i) => `w${i}`).join(' ');
    expect(() => validateReport(report)).toThrow(/takeaway must be 24 words/);
  });

  it('rejects a stat label longer than 14 characters', () => {
    const report = loadSample();
    report.items[0].stats = [{ label: 'THIS LABEL IS WAY TOO LONG', value: '1' }];
    expect(() => validateReport(report)).toThrow(/stat label .* exceeds 14 characters/);
  });

  it('rejects a highlight title longer than 5 words', () => {
    const report = loadSample();
    report.items[0].highlights = [{ title: 'one two three four five six', body: 'ok' }];
    expect(() => validateReport(report)).toThrow(/highlight title .* exceeds 5 words/);
  });

  it('rejects more than 3 verdict risks', () => {
    const report = loadSample();
    const withVerdict = report.items.find((item) => item.verdict);
    expect(withVerdict).toBeDefined();
    withVerdict!.verdict!.risks = ['a', 'b', 'c', 'd'];
    expect(() => validateReport(report)).toThrow(/at most 3 risks/);
  });

  it('rejects a tab label longer than 16 characters', () => {
    const report = loadSample();
    report.items[0].tabs[0].label = 'EXTREMELY LONG TAB LABEL';
    expect(() => validateReport(report)).toThrow(/label must be 16 characters/);
  });
});
