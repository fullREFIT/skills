// Route state model + frame ordering. Routes are addressable as either
//   /report/{slug}?item=r-02&tab=video&mode=presenter   (preferred)
//   #r-02-video                                          (hash fallback)
// "Frames" are the linear sequence used by Space / Shift+Space and the progress rail.

import type { PresentationMode, Report, ReportItem, RouteState } from './types';

const SPECIAL_TABS = new Set(['cover', 'methodology', 'closing']);

export function parseRouteState(url: URL, report: Report): RouteState {
  // Presenter is the only mode; any mode passed in the URL is coerced to presenter.
  const mode: PresentationMode = 'presenter';

  const queryItem = url.searchParams.get('item');
  const queryTab = url.searchParams.get('tab');
  const queryState =
    queryItem && queryTab ? { itemId: queryItem, tabId: queryTab, mode, focusMode: false } : undefined;

  const hashState = parseHashFallback(url.hash, report, mode);
  const fallback: RouteState = { itemId: 'cover', tabId: 'cover', mode, focusMode: false };

  return normalizeRouteState(report, queryState ?? hashState ?? fallback);
}

// Coerce a requested state into a valid one (unknown ids fall back to cover/summary).
export function normalizeRouteState(report: Report, state: RouteState): RouteState {
  if (state.itemId === 'cover') {
    return { ...state, tabId: 'cover' };
  }
  if (state.itemId === 'methodology') {
    return report.methodology ? { ...state, tabId: 'methodology' } : toCover(state);
  }
  if (state.itemId === 'closing') {
    return report.closing ? { ...state, tabId: 'closing' } : toCover(state);
  }

  const item = getItem(report, state.itemId);
  if (!item) {
    return toCover(state);
  }

  const tab = item.tabs.find((candidate) => candidate.id === state.tabId);
  return tab ? state : { ...state, tabId: 'summary' };
}

export function createRouteUrl(report: Report, state: RouteState): string {
  const params = new URLSearchParams({ item: state.itemId, tab: state.tabId, mode: state.mode });
  return `/report/${report.slug}?${params.toString()}`;
}

export function getNextTabState(report: Report, state: RouteState): RouteState {
  return stepTab(report, state, 1);
}
export function getPreviousTabState(report: Report, state: RouteState): RouteState {
  return stepTab(report, state, -1);
}
export function getNextItemState(report: Report, state: RouteState): RouteState {
  return stepItem(report, state, 1);
}
export function getPreviousItemState(report: Report, state: RouteState): RouteState {
  return stepItem(report, state, -1);
}
export function getNextMeaningfulState(report: Report, state: RouteState): RouteState {
  return stepFrame(report, state, 1);
}
export function getPreviousMeaningfulState(report: Report, state: RouteState): RouteState {
  return stepFrame(report, state, -1);
}

export function getCurrentItem(report: Report, state: RouteState): ReportItem | undefined {
  return report.items.find((item) => item.id === state.itemId);
}

export function getCurrentTab(report: Report, state: RouteState) {
  return getCurrentItem(report, state)?.tabs.find((tab) => tab.id === state.tabId);
}

// The full linear ordering: cover → methodology? → every item × every tab → closing?
export function getFrameStates(report: Report, mode: PresentationMode, focusMode = false): RouteState[] {
  const frames: RouteState[] = [{ itemId: 'cover', tabId: 'cover', mode, focusMode }];

  if (report.methodology) {
    frames.push({ itemId: 'methodology', tabId: 'methodology', mode, focusMode });
  }
  for (const item of report.items) {
    for (const tab of item.tabs) {
      frames.push({ itemId: item.id, tabId: tab.id, mode, focusMode });
    }
  }
  if (report.closing) {
    frames.push({ itemId: 'closing', tabId: 'closing', mode, focusMode });
  }

  return frames;
}

export function getProgressIndex(report: Report, state: RouteState): { index: number; total: number } {
  const frames = getFrameStates(report, state.mode, state.focusMode);
  const index = frames.findIndex((frame) => frame.itemId === state.itemId && frame.tabId === state.tabId);
  return { index: Math.max(0, index), total: frames.length };
}

function stepTab(report: Report, state: RouteState, direction: 1 | -1): RouteState {
  if (SPECIAL_TABS.has(state.tabId)) {
    return state;
  }
  const item = getItem(report, state.itemId);
  if (!item) {
    return normalizeRouteState(report, state);
  }
  const index = item.tabs.findIndex((tab) => tab.id === state.tabId);
  const nextIndex = clamp(index + direction, 0, item.tabs.length - 1);
  return { ...state, tabId: item.tabs[nextIndex]?.id ?? 'summary' };
}

function stepItem(report: Report, state: RouteState, direction: 1 | -1): RouteState {
  if (report.items.length === 0) {
    return state;
  }
  if (state.itemId === 'cover') {
    return direction > 0 ? { ...state, itemId: report.items[0].id, tabId: 'summary' } : state;
  }

  const currentIndex = report.items.findIndex((item) => item.id === state.itemId);
  if (currentIndex === -1) {
    return { ...state, itemId: report.items[0].id, tabId: 'summary' };
  }

  const nextIndex = clamp(currentIndex + direction, 0, report.items.length - 1);
  const nextItem = report.items[nextIndex];
  // Keep the same tab when the destination item also has it; otherwise land on summary.
  const nextTab = nextItem.tabs.some((tab) => tab.id === state.tabId) ? state.tabId : 'summary';
  return { ...state, itemId: nextItem.id, tabId: nextTab };
}

function stepFrame(report: Report, state: RouteState, direction: 1 | -1): RouteState {
  const frames = getFrameStates(report, state.mode, state.focusMode);
  const index = frames.findIndex((frame) => frame.itemId === state.itemId && frame.tabId === state.tabId);
  const nextIndex = clamp((index === -1 ? 0 : index) + direction, 0, frames.length - 1);
  return frames[nextIndex] ?? state;
}

function parseHashFallback(hash: string, report: Report, mode: PresentationMode): RouteState | undefined {
  const raw = hash.replace(/^#/, '');
  if (!raw) {
    return undefined;
  }
  if (raw === 'cover' || raw === 'cover-cover') {
    return { itemId: 'cover', tabId: 'cover', mode, focusMode: false };
  }
  for (const item of report.items) {
    const prefix = `${item.id}-`;
    if (raw.startsWith(prefix)) {
      return { itemId: item.id, tabId: raw.slice(prefix.length), mode, focusMode: false };
    }
  }
  return undefined;
}

function getItem(report: Report, itemId: string): ReportItem | undefined {
  return report.items.find((item) => item.id === itemId);
}

function toCover(state: RouteState): RouteState {
  return { ...state, itemId: 'cover', tabId: 'cover' };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
