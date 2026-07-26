// Presenter-safe content budgets — the single source of truth for how much text a
// slide may carry. Validation (report-validation.ts) enforces the HARD caps and fails
// the build when content exceeds them; the fit-engine then guarantees the rendered
// result stays inside the viewport. Budgets come from the v2 production spec.
//
// Two kinds of limit:
//   - word/char HARD caps  → rejected at validate time (build failure)
//   - per-slide max counts → rejected at validate time (e.g. too many stats)
// "target" ranges in the spec are advisory and intentionally NOT enforced here.

export const WORD_BUDGETS = {
  headline: 18, // hard cap 18 (target 8–14)
  deck: 32, // deck/thesis hard cap 32 (target 12–24)
  bodyParagraph: 85, // main body paragraph hard cap 85 (target 35–65)
  takeaway: 24, // hard cap 24
  highlightTitle: 5, // hard cap 5 words
  highlightBody: 24, // hard cap 24 (target 8–18)
  decisionWhyNow: 24 // hard cap 24
} as const;

export const CHAR_BUDGETS = {
  statLabel: 14, // hard cap 14 chars
  sourceLabel: 24, // hard cap 24 chars
  navLabel: 16 // tab/nav labels — keep short enough to never wrap
} as const;

export const COUNT_BUDGETS = {
  // Tightened so dense summary slides fit at a READABLE density (presenter-only). The
  // stacked highlight cards are the main height driver, so they are capped hardest.
  summaryStats: 4, // <= 4 stats (3 is ideal; a 4-up row still fits)
  summaryHighlights: 4, // <= 4 highlight cards — keeps text large and one-screen
  decisionRisks: 3, // max 3 risks
  sourceNotes: 3, // max 3 notes bullets on a source slide
  sourceMeta: 3 // max 3 source metadata items
} as const;

export function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function countChars(value: string): number {
  return value.trim().length;
}

// A body field may be a string or string[]; the cap applies per paragraph.
export function maxParagraphWords(body: string | string[]): number {
  const paragraphs = Array.isArray(body) ? body : [body];
  return paragraphs.reduce((max, p) => Math.max(max, countWords(p)), 0);
}
