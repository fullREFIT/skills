import { z } from 'zod';
import type { Report, ReportItem, SourceLink, ItemTab } from './types';
import {
  WORD_BUDGETS,
  CHAR_BUDGETS,
  COUNT_BUDGETS,
  countWords,
  countChars,
  maxParagraphWords
} from './content-budgets';

// Carbon Forge palette — the only colors a report may reference (e.g. wordmark slash).
const PALETTE = new Set([
  '#121010', // Carbon Core
  '#D43B2A', // Forge Red
  '#FFB400', // Forge Gold
  '#333130', // Forge Dark
  '#F2F0EE', // Ash White
  '#FFFFFF', // Pure White
  '#878E88', // Echo
  '#E5E3E0' // Soft Gray
]);

const sourceLinkSchema = z
  .object({
    label: z.string().min(1),
    url: z.string().url(),
    domain: z.string().min(1).optional(),
    type: z.enum(['github', 'docs', 'tweet', 'youtube', 'issue', 'article', 'other']).optional()
  })
  .strict();

const statSchema = z
  .object({
    label: z.string().min(1),
    value: z.string().min(1),
    emphasis: z.enum(['neutral', 'red', 'gold']).optional()
  })
  .strict();

const highlightSchema = z
  .object({
    title: z.string().min(1),
    body: z.string().min(1)
  })
  .strict();

const embedSchema = z
  .object({
    kind: z.enum(['tweet', 'youtube', 'github-card', 'image', 'html']),
    url: z.string().url().optional(),
    html: z.string().min(1).optional(),
    thumbnailUrl: z.string().url().optional(),
    timestampLabel: z.string().min(1).optional()
  })
  .strict();

const itemTabSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum([
      'summary',
      'source',
      'proof',
      'tweet',
      'video',
      'controversy',
      'mechanics',
      'decision',
      'further-reading'
    ]),
    label: z.string().min(1),
    title: z.string().min(1).optional(),
    body: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),
    embed: embedSchema.optional(),
    stats: z.array(statSchema).optional(),
    highlights: z.array(highlightSchema).optional(),
    links: z.array(sourceLinkSchema).optional()
  })
  .strict();

const verdictSchema = z
  .object({
    state: z.enum(['USE', 'WATCH', 'IGNORE', 'REPLICATE', 'TEST']),
    fit: z.string().min(1),
    effort: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    whyNow: z.string().min(1),
    risks: z.array(z.string().min(1)).optional(),
    nextStep: z.string().min(1).optional()
  })
  .strict();

const reportItemSchema = z
  .object({
    id: z.string().min(1),
    rankLabel: z.string().min(1),
    itemClass: z.enum(['hidden', 'ranked', 'sponsor', 'appendix']),
    category: z.string().min(1),
    layer: z.enum(['systems', 'teams', 'neutral']),
    title: z.string().min(1),
    headline: z.string().min(1),
    thesis: z.string().min(1),
    whyLabel: z.string().min(1),
    whyBody: z.string().min(1),
    takeaway: z.string().min(1),
    verdict: verdictSchema.optional(),
    stats: z.array(statSchema).optional(),
    highlights: z.array(highlightSchema).optional(),
    sources: z.array(sourceLinkSchema).min(1),
    tags: z.array(z.string().min(1)).optional(),
    tabs: z.array(itemTabSchema).min(1),
    furtherReading: z.array(sourceLinkSchema).optional()
  })
  .strict();

const reportSchema = z
  .object({
    version: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case'),
    title: z.string().min(1),
    subtitle: z.string().min(1).optional(),
    topic: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
    brand: z
      .object({
        name: z.literal('full/REFIT'),
        theme: z.literal('carbon-forge'),
        wordmark: z
          .object({
            fullText: z.literal('full/REFIT'),
            slashColor: z.string().min(1),
            tagline: z.string().min(1).optional()
          })
          .strict()
      })
      .strict(),
    modeDefaults: z
      .object({
        defaultMode: z.enum(['presenter', 'reader']),
        showHelpHint: z.boolean(),
        showProgressRail: z.boolean()
      })
      .strict()
      .optional(),
    intro: z
      .object({
        label: z.string().min(1),
        title: z.string().min(1),
        subtitle: z.string().min(1).optional(),
        summary: z.string().min(1),
        proofStats: z.array(statSchema).optional(),
        tags: z.array(z.string().min(1)).optional()
      })
      .strict(),
    methodology: z
      .object({
        label: z.string().min(1),
        title: z.string().min(1),
        body: z.array(z.string().min(1)).min(1)
      })
      .strict()
      .optional(),
    items: z.array(reportItemSchema).min(1),
    closing: z
      .object({
        label: z.string().min(1),
        title: z.string().min(1),
        body: z.array(z.string().min(1)).min(1),
        cta: z
          .object({
            label: z.string().min(1),
            url: z.string().url()
          })
          .strict()
          .optional()
      })
      .strict()
      .optional(),
    seo: z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        ogImage: z.string().url().optional()
      })
      .strict()
      .optional()
  })
  .strict();

/**
 * Validate raw report input. Throws on the first failing layer:
 * 1. structural (zod schema), then 2. editorial / brand / presenter-budget rules.
 * Budget rules (content-budgets.ts) keep every slide presenter-safe so the runtime
 * fit-engine rarely has to step down past `standard`. Returns a typed Report on success.
 */
export function validateReport(input: unknown): Report {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Report validation failed (schema):\n${z.prettifyError(parsed.error)}`);
  }

  const report = parsed.data as Report;
  const errors: string[] = [];

  if (!PALETTE.has(report.brand.wordmark.slashColor.toUpperCase())) {
    errors.push(`brand.wordmark.slashColor must be a Carbon Forge color: ${report.brand.wordmark.slashColor}`);
  }

  validateReportLevelBudgets(report, errors);

  const itemIds = new Set<string>();
  for (const item of report.items) {
    if (itemIds.has(item.id)) {
      errors.push(`Duplicate item id: ${item.id}`);
    }
    itemIds.add(item.id);
    validateItem(item, errors);
  }

  validateHttpsLinks(report, errors);

  if (errors.length > 0) {
    throw new Error(`Report validation failed (editorial):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  }

  return report;
}

function validateReportLevelBudgets(report: Report, errors: string[]): void {
  if (countWords(report.intro.summary) > WORD_BUDGETS.bodyParagraph) {
    errors.push(`intro.summary must be ${WORD_BUDGETS.bodyParagraph} words or fewer`);
  }
  if (report.methodology && maxParagraphWords(report.methodology.body) > WORD_BUDGETS.bodyParagraph) {
    errors.push(`methodology body paragraphs must each be ${WORD_BUDGETS.bodyParagraph} words or fewer`);
  }
  if (report.closing && maxParagraphWords(report.closing.body) > WORD_BUDGETS.bodyParagraph) {
    errors.push(`closing body paragraphs must each be ${WORD_BUDGETS.bodyParagraph} words or fewer`);
  }
  report.intro.proofStats?.forEach((stat) => checkStatLabel(stat.label, 'intro.proofStats', errors));
}

function validateItem(item: ReportItem, errors: string[]): void {
  const summaryTabs = item.tabs.filter((tab) => tab.type === 'summary');
  if (summaryTabs.length !== 1) {
    errors.push(`Item ${item.id} must include exactly one summary tab`);
  }

  const tabIds = new Set<string>();
  for (const tab of item.tabs) {
    if (tabIds.has(tab.id)) {
      errors.push(`Item ${item.id} has duplicate tab id: ${tab.id}`);
    }
    tabIds.add(tab.id);
    validateTabBudgets(item.id, tab, errors);
  }

  // Core narrative field budgets (presenter-safe).
  if (countWords(item.headline) > WORD_BUDGETS.headline) {
    errors.push(`Item ${item.id} headline must be ${WORD_BUDGETS.headline} words or fewer`);
  }
  if (countWords(item.thesis) > WORD_BUDGETS.deck) {
    errors.push(`Item ${item.id} thesis must be ${WORD_BUDGETS.deck} words or fewer`);
  }
  if (countWords(item.whyBody) > WORD_BUDGETS.bodyParagraph) {
    errors.push(`Item ${item.id} whyBody must be ${WORD_BUDGETS.bodyParagraph} words or fewer`);
  }
  if (countWords(item.takeaway) > WORD_BUDGETS.takeaway) {
    errors.push(`Item ${item.id} takeaway must be ${WORD_BUDGETS.takeaway} words or fewer`);
  }

  // Summary card counts + per-card budgets.
  if ((item.stats?.length ?? 0) > COUNT_BUDGETS.summaryStats) {
    errors.push(`Item ${item.id} must have no more than ${COUNT_BUDGETS.summaryStats} summary stats`);
  }
  if ((item.highlights?.length ?? 0) > COUNT_BUDGETS.summaryHighlights) {
    errors.push(`Item ${item.id} must have no more than ${COUNT_BUDGETS.summaryHighlights} summary highlights`);
  }
  item.stats?.forEach((stat) => checkStatLabel(stat.label, `item ${item.id}`, errors));
  item.highlights?.forEach((h) => checkHighlight(h.title, h.body, `item ${item.id}`, errors));

  // Forge Gold signals Layer 2 (teams). It must not emphasize non-teams stats.
  if (item.layer !== 'teams' && item.stats?.some((stat) => stat.emphasis === 'gold')) {
    errors.push(`Item ${item.id} may only use gold stat emphasis when layer is "teams"`);
  }

  // Source labels must stay short enough to never wrap a card line.
  item.sources.forEach((s) => checkSourceLabel(s.label, `item ${item.id}.sources`, errors));
  item.furtherReading?.forEach((s) => checkSourceLabel(s.label, `item ${item.id}.furtherReading`, errors));

  // Decision (verdict) budgets.
  if (item.verdict) {
    if (countWords(item.verdict.whyNow) > WORD_BUDGETS.decisionWhyNow) {
      errors.push(`Item ${item.id} verdict.whyNow must be ${WORD_BUDGETS.decisionWhyNow} words or fewer`);
    }
    if ((item.verdict.risks?.length ?? 0) > COUNT_BUDGETS.decisionRisks) {
      errors.push(`Item ${item.id} verdict may list at most ${COUNT_BUDGETS.decisionRisks} risks`);
    }
  }
}

function validateTabBudgets(itemId: string, tab: ItemTab, errors: string[]): void {
  if (countChars(tab.label) > CHAR_BUDGETS.navLabel) {
    errors.push(`Item ${itemId} tab ${tab.id} label must be ${CHAR_BUDGETS.navLabel} characters or fewer`);
  }
  if (tab.body && maxParagraphWords(tab.body) > WORD_BUDGETS.bodyParagraph) {
    errors.push(`Item ${itemId} tab ${tab.id} body paragraphs must each be ${WORD_BUDGETS.bodyParagraph} words or fewer`);
  }
  tab.stats?.forEach((stat) => checkStatLabel(stat.label, `item ${itemId}.tabs.${tab.id}`, errors));
  tab.highlights?.forEach((h) => checkHighlight(h.title, h.body, `item ${itemId}.tabs.${tab.id}`, errors));
  tab.links?.forEach((l) => checkSourceLabel(l.label, `item ${itemId}.tabs.${tab.id}.links`, errors));
}

function checkStatLabel(label: string, where: string, errors: string[]): void {
  if (countChars(label) > CHAR_BUDGETS.statLabel) {
    errors.push(`${where} stat label "${label}" exceeds ${CHAR_BUDGETS.statLabel} characters`);
  }
}

function checkHighlight(title: string, body: string, where: string, errors: string[]): void {
  if (countWords(title) > WORD_BUDGETS.highlightTitle) {
    errors.push(`${where} highlight title "${title}" exceeds ${WORD_BUDGETS.highlightTitle} words`);
  }
  if (countWords(body) > WORD_BUDGETS.highlightBody) {
    errors.push(`${where} highlight body exceeds ${WORD_BUDGETS.highlightBody} words`);
  }
}

function checkSourceLabel(label: string, where: string, errors: string[]): void {
  if (countChars(label) > CHAR_BUDGETS.sourceLabel) {
    errors.push(`${where} label "${label}" exceeds ${CHAR_BUDGETS.sourceLabel} characters`);
  }
}

function validateHttpsLinks(report: Report, errors: string[]): void {
  const links: Array<{ path: string; link: SourceLink }> = [];

  for (const item of report.items) {
    item.sources.forEach((link, index) => links.push({ path: `items.${item.id}.sources[${index}]`, link }));
    item.furtherReading?.forEach((link, index) =>
      links.push({ path: `items.${item.id}.furtherReading[${index}]`, link })
    );
    for (const tab of item.tabs) {
      tab.links?.forEach((link, index) => links.push({ path: `items.${item.id}.tabs.${tab.id}.links[${index}]`, link }));
      if (tab.embed?.url && !tab.embed.url.startsWith('https://')) {
        errors.push(`items.${item.id}.tabs.${tab.id}.embed.url must use https`);
      }
      if (tab.embed?.thumbnailUrl && !tab.embed.thumbnailUrl.startsWith('https://')) {
        errors.push(`items.${item.id}.tabs.${tab.id}.embed.thumbnailUrl must use https`);
      }
    }
  }

  if (report.closing?.cta && !report.closing.cta.url.startsWith('https://')) {
    errors.push('closing.cta.url must use https');
  }

  for (const { path, link } of links) {
    if (!link.url.startsWith('https://')) {
      errors.push(`${path}.url must use https`);
    }
  }
}
