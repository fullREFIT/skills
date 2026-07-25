// Client bootstrap: load + validate the report, render the active frame into the fixed
// presenter STAGE, run the fit-engine so the slide is viewport-safe, and wire keyboard /
// pointer / history navigation plus the off-canvas sidebar. All frames route through one
// render() call, so deep-linking and back/forward stay trivial.

import sampleReport from '../content/reports/sample-report.json';
import {
  createRouteUrl,
  getNextItemState,
  getNextMeaningfulState,
  getNextTabState,
  getPreviousItemState,
  getPreviousMeaningfulState,
  getPreviousTabState,
  normalizeRouteState,
  parseRouteState
} from './navigation';
import {
  renderHelpOverlay,
  renderItemBar,
  renderQuickJump,
  renderReportView,
  renderSidebar,
  renderTopChrome,
  renderTouchNav
} from './render-report';
import { fitSlide } from './fit-engine';
import './styles.css';
import type { Report, RouteState } from './types';
import { validateReport } from './report-validation';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) {
  throw new Error('Missing #app root element');
}
const appRoot = root;

// Live GitHub metrics for the custom card (render-report.ts builds the brand card; this
// fills Stars/Forks/Issues/Language + description from api.github.com). Public repos need
// no token. Results are cached in localStorage so a presentation works offline after one
// load; on any failure the card still shows avatar + owner/repo + Open-repo cleanly.
interface RepoMeta {
  stargazers_count?: number;
  forks_count?: number;
  open_issues_count?: number;
  language?: string | null;
  description?: string | null;
}
const GH_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function formatCount(value: number | undefined): string {
  if (typeof value !== 'number') return '—';
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`;
  return String(value);
}

async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta | null> {
  const cacheKey = `ghmeta:${owner}/${repo}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as { t: number; d: RepoMeta };
      if (Date.now() - parsed.t < GH_CACHE_TTL_MS) return parsed.d;
    }
  } catch {
    // ignore cache read errors
  }
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) return null;
    const json = (await response.json()) as RepoMeta;
    const data: RepoMeta = {
      stargazers_count: json.stargazers_count,
      forks_count: json.forks_count,
      open_issues_count: json.open_issues_count,
      language: json.language,
      description: json.description
    };
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), d: data }));
    } catch {
      // ignore cache write errors (private mode, quota)
    }
    return data;
  } catch {
    return null;
  }
}

function fillMetric(card: HTMLElement, key: string, value: string): void {
  const el = card.querySelector<HTMLElement>(`[data-gh="${key}"]`);
  if (el) el.textContent = value;
}

async function enrichGithubCards(): Promise<void> {
  const cards = Array.from(appRoot.querySelectorAll<HTMLElement>('.gh-card[data-owner][data-repo]'));
  for (const card of cards) {
    const owner = card.dataset.owner;
    const repo = card.dataset.repo;
    if (!owner || !repo) continue;
    const data = await fetchRepoMeta(owner, repo);
    if (!data) continue;
    fillMetric(card, 'stars', formatCount(data.stargazers_count));
    fillMetric(card, 'forks', formatCount(data.forks_count));
    fillMetric(card, 'issues', formatCount(data.open_issues_count));
    fillMetric(card, 'language', data.language ?? '—');
    if (data.description) fillMetric(card, 'description', data.description);
  }
}

let report: Report = validateReport(sampleReport);
let state: RouteState = parseRouteState(new URL(window.location.href), report);
let helpOpen = false;
let jumpOpen = false;
let sidebarOpen = false;
let touchStart: { x: number; y: number } | undefined;

void boot();

async function boot(): Promise<void> {
  report = await loadReport();
  state = parseRouteState(new URL(window.location.href), report);
  render();
}

// Prefer the generated public/reports/{slug}.json; fall back to the bundled sample.
async function loadReport(): Promise<Report> {
  const pathSlug = window.location.pathname.match(/\/report\/([^/?#]+)/)?.[1];
  const manifestSlug = await fetchManifestSlug();
  const slugs = Array.from(new Set([pathSlug, manifestSlug, report.slug].filter(Boolean)));

  for (const slug of slugs) {
    try {
      const response = await fetch(`/reports/${slug}.json`, { cache: 'no-cache' });
      if (response.ok) {
        return validateReport(await response.json());
      }
    } catch {
      // Ignore and try the next slug; the bundled sample keeps dev usable.
    }
  }
  return report;
}

async function fetchManifestSlug(): Promise<string | undefined> {
  try {
    const response = await fetch('/report-manifest.json', { cache: 'no-cache' });
    if (!response.ok) return undefined;
    const manifest = (await response.json()) as { defaultSlug?: string };
    return manifest.defaultSlug;
  } catch {
    return undefined;
  }
}

function render(): void {
  const focusClass = state.focusMode ? 'is-focus-mode' : '';

  appRoot.innerHTML = `
    ${renderTopChrome(report, state)}
    <main id="main" class="report-app ${focusClass}">
      ${renderItemBar(report, state)}
      <div class="stage" data-density="spacious" data-fit="ok">
        ${renderReportView(report, state)}
      </div>
      <footer class="stage-footer">
        <p class="footer-hint" aria-hidden="true">&larr; &rarr; tabs &middot; &uarr; &darr; items &middot; Space next</p>
      </footer>
    </main>
    <button class="edge-handle" type="button" data-action="toggle-sidebar" aria-label="Open navigation menu"></button>
    ${renderTouchNav()}
    ${renderSidebar(report, state, sidebarOpen)}
    ${sidebarOpen ? '<div class="scrim" data-action="close-sidebar" aria-hidden="true"></div>' : ''}
    ${renderHelpOverlay(helpOpen)}
    ${renderQuickJump(report, jumpOpen)}
  `;

  document.body.classList.toggle('is-sidebar-open', sidebarOpen);
  document.title = createDocumentTitle();

  // Fill live GitHub metrics on any custom card in the current view (best-effort, cached).
  if (appRoot.querySelector('.gh-card[data-owner]')) {
    void enrichGithubCards();
  }

  // Presenter is viewport-safe: run the fit-engine on the active slide after layout settles.
  scheduleFit();
}

let fitScheduled = false;
function scheduleFit(): void {
  if (fitScheduled) return;
  fitScheduled = true;
  // Two frames so layout settles before we measure.
  const run = () =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        fitScheduled = false;
        fitActiveSlide();
      })
    );
  // CRITICAL: measure with the real web font loaded. Outfit has different line metrics
  // than the Arial fallback, so fitting before it loads under-counts lines and lets a
  // dense slide overflow once the font swaps in. Wait for document.fonts before the first
  // measure; re-fit when fonts finish loading.
  if ('fonts' in document && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(run).catch(run);
  } else {
    run();
  }
}

function fitActiveSlide(): void {
  if (state.mode !== 'presenter') return;
  const stage = appRoot.querySelector<HTMLElement>('.stage');
  const slide = stage?.querySelector<HTMLElement>('.slide');
  if (!stage || !slide) return;

  const result = fitSlide(stage, slide);
  if (!result.fits) {
    // Budgets should prevent this; surface it loudly for QA if it ever happens.
    console.warn(
      `[fit] slide ${state.itemId}/${state.tabId} still overflows by ~${result.overshootPx}px at ${result.density}`
    );
  }
}

function createDocumentTitle(): string {
  if (state.itemId === 'cover') return `${report.title} | full/REFIT`;
  if (state.itemId === 'methodology') return `Methodology | ${report.title}`;
  if (state.itemId === 'closing') return `Closing | ${report.title}`;

  const item = report.items.find((candidate) => candidate.id === state.itemId);
  const tab = item?.tabs.find((candidate) => candidate.id === state.tabId);
  return item ? `${item.title} — ${tab?.label ?? 'Summary'} | ${report.title}` : `${report.title} | full/REFIT`;
}

function navigate(nextState: RouteState, push = true): void {
  state = normalizeRouteState(report, nextState);
  if (push) {
    window.history.pushState(state, '', createRouteUrl(report, state));
  }
  render();
}

function closeSidebar(): void {
  if (!sidebarOpen) return;
  sidebarOpen = false;
  render();
}

appRoot.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>('button, a, .scrim') : null;
  if (!target) return;

  const { itemId, tabId, action } = target.dataset;

  // Navigation buttons (tab strip, sidebar items) — navigate and close the drawer.
  if (itemId && tabId) {
    sidebarOpen = false;
    navigate({ ...state, itemId, tabId });
    return;
  }
  if (!action) return;

  switch (action) {
    case 'prev-tab':
      navigate(getPreviousTabState(report, state));
      break;
    case 'next-tab':
      navigate(getNextTabState(report, state));
      break;
    case 'prev-item':
      navigate(getPreviousItemState(report, state));
      break;
    case 'next-item':
      navigate(getNextItemState(report, state));
      break;
    case 'next-meaningful':
      navigate(getNextMeaningfulState(report, state));
      break;
    case 'toggle-sidebar':
      sidebarOpen = !sidebarOpen;
      render();
      break;
    case 'close-sidebar':
      closeSidebar();
      break;
    case 'toggle-help':
      helpOpen = !helpOpen;
      render();
      break;
    case 'toggle-jump':
      jumpOpen = !jumpOpen;
      render();
      break;
    case 'copy-link':
      void copyCurrentLink();
      break;
  }
});

document.addEventListener('keydown', (event) => {
  const target = event.target;
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    return;
  }

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      navigate(getNextTabState(report, state));
      break;
    case 'ArrowLeft':
      event.preventDefault();
      navigate(getPreviousTabState(report, state));
      break;
    case 'ArrowDown':
      event.preventDefault();
      navigate(getNextItemState(report, state));
      break;
    case 'ArrowUp':
      event.preventDefault();
      navigate(getPreviousItemState(report, state));
      break;
    case ' ':
      event.preventDefault();
      navigate(event.shiftKey ? getPreviousMeaningfulState(report, state) : getNextMeaningfulState(report, state));
      break;
    case '?':
      event.preventDefault();
      helpOpen = !helpOpen;
      render();
      break;
    case '/':
      event.preventDefault();
      jumpOpen = !jumpOpen;
      render();
      break;
    case 'Escape':
      helpOpen = false;
      jumpOpen = false;
      sidebarOpen = false;
      render();
      break;
    default:
      handleLetterKey(event);
  }
});

function handleLetterKey(event: KeyboardEvent): void {
  const key = event.key.toLowerCase();
  if (key === 'f') {
    event.preventDefault();
    navigate({ ...state, focusMode: !state.focusMode });
  } else if (key === 'g') {
    event.preventDefault();
    navigate({ ...state, itemId: 'cover', tabId: 'cover' });
  } else if (key === 'm') {
    event.preventDefault();
    sidebarOpen = !sidebarOpen;
    render();
  }
}

appRoot.addEventListener('touchstart', (event) => {
  const touch = event.changedTouches[0];
  touchStart = touch ? { x: touch.clientX, y: touch.clientY } : undefined;
});

appRoot.addEventListener('touchend', (event) => {
  if (!touchStart) return;
  const touch = event.changedTouches[0];
  if (!touch) return;

  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  const SWIPE_MIN = 60;
  // Horizontal swipe steps tabs (mirrors ←/→); vertical swipe steps items (mirrors ↑/↓).
  // Pick the dominant axis so a diagonal drag resolves to a single, predictable move.
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > SWIPE_MIN) {
      navigate(deltaX < 0 ? getNextTabState(report, state) : getPreviousTabState(report, state));
    }
  } else if (Math.abs(deltaY) > SWIPE_MIN) {
    navigate(deltaY < 0 ? getNextItemState(report, state) : getPreviousItemState(report, state));
  }
  touchStart = undefined;
});

window.addEventListener('popstate', () => {
  state = parseRouteState(new URL(window.location.href), report);
  render();
});

// Re-fit the current slide when the viewport changes (resize / orientation).
window.addEventListener('resize', () => {
  if (state.mode === 'presenter') scheduleFit();
});

async function copyCurrentLink(): Promise<void> {
  const url = new URL(createRouteUrl(report, state), window.location.origin).toString();
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    window.prompt('Copy current report link', url);
  }
}
