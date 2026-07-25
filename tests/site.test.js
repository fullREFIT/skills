import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { brands } from '../site/main.js';

const root = resolve(import.meta.dirname, '..');

describe('landing page brand workbench', () => {
  it('publishes exactly four built-in profiles', () => {
    expect(Object.keys(brands)).toEqual([
      'carbon-forge',
      'tab-squirrel',
      'executive-signal',
      'editorial-studio'
    ]);
  });

  it('provides complete preview data for every profile', () => {
    for (const brand of Object.values(brands)) {
      expect(brand.label).toBeTruthy();
      expect(brand.wordmark).toBeTruthy();
      expect(brand.description.length).toBeGreaterThan(20);
      expect(Object.keys(brand.colors)).toHaveLength(9);
      for (const color of Object.values(brand.colors)) {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      }
      expect(Object.keys(brand.fonts)).toEqual(['body', 'display', 'mono']);
    }
  });

  it('links the download and public repository', () => {
    const html = readFileSync(resolve(root, 'site/index.html'), 'utf8');
    expect(html).toContain('/downloads/presentation-deck-builder-v2.zip');
    expect(html).toContain('https://github.com/fullREFIT/presentation-deck-builder-skill');
  });

  it('includes reduced-motion behavior and mobile breakpoints', () => {
    const css = readFileSync(resolve(root, 'site/styles.css'), 'utf8');
    expect(css).toContain('prefers-reduced-motion: reduce');
    expect(css).toContain('@media (max-width: 60rem)');
    expect(css).toContain('@media (max-width: 40rem)');
  });
});
