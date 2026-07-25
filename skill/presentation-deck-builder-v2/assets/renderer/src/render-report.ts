// Pure rendering functions: (report, state) -> HTML string. No DOM side effects here;
// app.ts owns the DOM and event wiring. Keeping render pure keeps deep-linking simple.

import type { EmbedBlock, HighlightBlock, ItemTab, Report, ReportItem, RouteState, SourceLink, StatBlock } from './types';
import { getCurrentItem, getCurrentTab, getProgressIndex } from './navigation';

export function renderReportView(report: Report, state: RouteState): string {
  if (state.itemId === 'cover') return renderCoverSlide(report);
  if (state.itemId === 'methodology' && report.methodology) return renderMethodologySlide(report);
  if (state.itemId === 'closing' && report.closing) return renderClosingSlide(report);

  const item = getCurrentItem(report, state);
  const tab = getCurrentTab(report, state);
  if (!item || !tab) return renderCoverSlide(report);

  switch (tab.type) {
    case 'summary':
      return renderSummarySlide(item);
    case 'source':
      return renderSourceSlide(item, tab);
    case 'decision':
      return renderDecisionSlide(item, tab);
    case 'video':
      return renderMediaSlide(item, tab, 'video');
    case 'tweet':
      return renderMediaSlide(item, tab, 'tweet');
    case 'proof':
    case 'controversy':
    case 'mechanics':
      return renderEvidenceSlide(item, tab);
    case 'further-reading':
      return renderFurtherReadingSlide(item, tab);
    default:
      return renderSummarySlide(item);
  }
}

export function renderWordmark(): string {
  return '<span class="wordmark" aria-label="full/REFIT">full<span class="wordmark__slash">/</span><span class="wordmark__refit">REFIT</span></span>';
}

export function renderTopChrome(report: Report, state: RouteState): string {
  const progress = getProgressIndex(report, state);
  const percent = progress.total <= 1 ? 0 : Math.round((progress.index / (progress.total - 1)) * 100);

  return `
    <header class="site-header">
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="site-header__brand">
        ${renderWordmark()}
        <span class="site-header__topic">${escapeHtml(report.topic)}</span>
      </div>
      <div class="site-header__controls" aria-label="Report controls">
        <button class="chrome-button" type="button" data-action="toggle-sidebar" aria-label="Open navigation menu">Menu</button>
        <button class="chrome-button" type="button" data-action="copy-link">Copy link</button>
        <button class="chrome-button" type="button" data-action="toggle-help" aria-label="Open keyboard help">?</button>
      </div>
      <div class="top-progress" aria-hidden="true"><span style="width: ${percent}%"></span></div>
    </header>
  `;
}

// Off-canvas navigation drawer. Hidden by default in presenter mode (CSS translateX),
// revealed by the edge handle or the header Menu button. Selecting a destination
// navigates and closes the drawer (app.ts). No reserved layout gutter when closed.
export function renderSidebar(report: Report, state: RouteState, open: boolean): string {
  const special = (id: string, tabId: string, rank: string, title: string) =>
    `<button class="rail-item rail-item--special" type="button" data-item-id="${id}" data-tab-id="${tabId}"${
      state.itemId === id ? ' aria-current="true"' : ''
    }>
      <span class="rail-item__rank">${rank}</span>
      <span class="rail-item__title">${title}</span>
    </button>`;

  const itemButtons = report.items
    .map(
      (item) => `<button class="rail-item" type="button" data-item-id="${escapeAttr(item.id)}" data-tab-id="summary"${
        item.id === state.itemId ? ' aria-current="true"' : ''
      }>
        <span class="rail-item__rank">${escapeHtml(item.rankLabel)}</span>
        <span class="rail-item__title">${escapeHtml(item.title)}</span>
      </button>`
    )
    .join('');

  return `
    <aside class="sidebar ${open ? 'is-open' : ''}" aria-label="Report navigation"${open ? '' : ' aria-hidden="true"'}>
      <div class="sidebar__header">
        <span class="sidebar__title">Navigate</span>
        <button class="chrome-button" type="button" data-action="close-sidebar">Close</button>
      </div>
      ${special('cover', 'cover', '00', 'Cover')}
      ${report.methodology ? special('methodology', 'methodology', 'M', 'Method') : ''}
      ${itemButtons}
      ${report.closing ? special('closing', 'closing', 'END', 'Closing') : ''}
    </aside>
  `;
}

// Per-item evidence tabs in a slim top-right bar (matching the reference): item crumb on
// the left, the item's tab buttons on the right. Report-level frames (cover / methodology /
// closing) have no per-item tabs, so the bar is omitted there.
export function renderItemBar(report: Report, state: RouteState): string {
  const item = getCurrentItem(report, state);
  if (!item) return '';

  // When the same label repeats within one item (e.g. two TWEET states), number them
  // "TWEET 1 / TWEET 2" so the tab strip is unambiguous. Unique labels stay as-is.
  const labelCounts = new Map<string, number>();
  for (const tab of item.tabs) {
    labelCounts.set(tab.label, (labelCounts.get(tab.label) ?? 0) + 1);
  }
  const labelSeen = new Map<string, number>();

  const tabs = item.tabs
    .map((tab) => {
      const ordinal = (labelSeen.get(tab.label) ?? 0) + 1;
      labelSeen.set(tab.label, ordinal);
      const displayLabel = (labelCounts.get(tab.label) ?? 0) > 1 ? `${tab.label} ${ordinal}` : tab.label;
      return `<button class="tab-button" type="button" data-item-id="${escapeAttr(item.id)}" data-tab-id="${escapeAttr(
        tab.id
      )}"${tab.id === state.tabId ? ' aria-current="true"' : ''}>${escapeHtml(displayLabel)}</button>`;
    })
    .join('');

  return `
    <div class="item-bar">
      <div class="item-bar__crumb">
        <span class="item-bar__rank">${escapeHtml(item.rankLabel)}</span>
        <span class="item-bar__title">${escapeHtml(item.title)}</span>
      </div>
      <nav class="tab-strip" aria-label="Current item tabs">${tabs}</nav>
    </div>
  `;
}

// Touch navigation D-pad. Mirrors the keyboard model (←/→ step tabs, ↑/↓ step items) for
// phones/tablets that have no arrow keys. CSS shows it only on coarse-pointer devices, so
// desktop presenters never see it. Buttons reuse the existing prev/next data-actions.
export function renderTouchNav(): string {
  return `
    <nav class="touch-nav" aria-label="Touch navigation">
      <button class="touch-nav__btn touch-nav__btn--up" type="button" data-action="prev-item" aria-label="Previous item">&uarr;</button>
      <button class="touch-nav__btn touch-nav__btn--left" type="button" data-action="prev-tab" aria-label="Previous tab">&larr;</button>
      <button class="touch-nav__btn touch-nav__btn--right" type="button" data-action="next-tab" aria-label="Next tab">&rarr;</button>
      <button class="touch-nav__btn touch-nav__btn--down" type="button" data-action="next-item" aria-label="Next item">&darr;</button>
    </nav>
  `;
}

export function renderHelpOverlay(open: boolean): string {
  const rows: Array<[string, string]> = [
    ['Left / Right', 'Previous or next tab'],
    ['Up / Down', 'Previous or next item'],
    ['Space', 'Next meaningful state'],
    ['Shift + Space', 'Previous meaningful state'],
    ['?', 'Open this help'],
    ['/', 'Quick jump'],
    ['F', 'Toggle focus chrome'],
    ['G', 'Jump to cover'],
    ['M', 'Open navigation menu']
  ];

  return `
    <div class="overlay ${open ? 'is-open' : ''}" role="dialog" aria-modal="true" aria-label="Keyboard help" ${
      open ? '' : 'hidden'
    }>
      <div class="overlay__panel">
        <div class="overlay__header">
          <p class="section-label">Keyboard</p>
          <button class="chrome-button" type="button" data-action="toggle-help">Close</button>
        </div>
        <dl class="shortcut-grid">
          ${rows.map(([key, desc]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(desc)}</dd></div>`).join('')}
        </dl>
      </div>
    </div>
  `;
}

export function renderQuickJump(report: Report, open: boolean): string {
  const options = report.items
    .map(
      (item) => `<button class="jump-option" type="button" data-item-id="${escapeAttr(item.id)}" data-tab-id="summary">
        <span>${escapeHtml(item.rankLabel)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.category)}</small>
      </button>`
    )
    .join('');

  return `
    <div class="overlay ${open ? 'is-open' : ''}" role="dialog" aria-modal="true" aria-label="Quick jump" ${
      open ? '' : 'hidden'
    }>
      <div class="overlay__panel overlay__panel--jump">
        <div class="overlay__header">
          <p class="section-label">Quick jump</p>
          <button class="chrome-button" type="button" data-action="toggle-jump">Close</button>
        </div>
        <div class="jump-list">${options}</div>
      </div>
    </div>
  `;
}

function renderCoverSlide(report: Report): string {
  return `
    <section class="slide slide--cover slide--dark" data-item-id="cover" data-tab-id="cover">
      <div class="cover-grid">
        <div class="cover-main">
          ${renderWordmark()}
          <p class="section-label">${escapeHtml(report.intro.label)}</p>
          <h1>${escapeHtml(report.intro.title)}</h1>
          ${report.intro.subtitle ? `<p class="cover-subtitle">${escapeHtml(report.intro.subtitle)}</p>` : ''}
          <p class="cover-summary">${escapeHtml(report.intro.summary)}</p>
          <div class="cover-controls" aria-label="Keyboard navigation">
            <kbd><b>&larr; &rarr;</b> tabs</kbd>
            <kbd><b>&uarr; &darr;</b> items</kbd>
            <kbd><b>Space</b> next</kbd>
            <kbd><b>?</b> help</kbd>
          </div>
        </div>
        <div class="cover-side">
          ${renderStats(report.intro.proofStats ?? [], 'dark')}
          ${report.intro.tags ? renderTags(report.intro.tags) : ''}
          <p class="nav-hint">Drive the briefing with the keyboard. Open the menu from the left edge.</p>
        </div>
      </div>
    </section>
  `;
}

function renderMethodologySlide(report: Report): string {
  const methodology = report.methodology;
  if (!methodology) return '';

  return `
    <section class="slide slide--methodology" data-item-id="methodology" data-tab-id="methodology">
      <div class="slide__narrow">
        <p class="section-label">${escapeHtml(methodology.label)}</p>
        <h1>${escapeHtml(methodology.title)}</h1>
        ${renderBody(methodology.body)}
      </div>
    </section>
  `;
}

function renderSummarySlide(item: ReportItem): string {
  return `
    <section class="slide slide--summary" data-item-id="${escapeAttr(item.id)}" data-tab-id="summary" data-tab-type="summary" data-layer="${escapeAttr(
      item.layer
    )}">
      <div class="summary-grid">
        <article class="summary-main">
          <p class="section-label">${escapeHtml(item.category)}</p>
          <div class="item-kicker"><span>${escapeHtml(item.rankLabel)}</span><span>${escapeHtml(
            item.itemClass
          )}</span><span>${escapeHtml(item.layer)}</span></div>
          <h1>${escapeHtml(item.headline)}</h1>
          <p class="thesis">${escapeHtml(item.thesis)}</p>
          <div class="why-block">
            <h2>${escapeHtml(item.whyLabel)}</h2>
            <p>${escapeHtml(item.whyBody)}</p>
          </div>
          <p class="takeaway"><span>Takeaway</span>${escapeHtml(item.takeaway)}</p>
        </article>
        <aside class="summary-side">
          ${renderStats(item.stats ?? [], 'light')}
          ${renderHighlights(item.highlights ?? [])}
          ${renderSourceList(item.sources, 'Primary source')}
          ${
            item.verdict
              ? `<div class="decision-preview"><span>${escapeHtml(item.verdict.state)}</span><p>${escapeHtml(
                  item.verdict.nextStep ?? item.verdict.whyNow
                )}</p></div>`
              : ''
          }
        </aside>
      </div>
    </section>
  `;
}

function renderSourceSlide(item: ReportItem, tab: ItemTab): string {
  const links = tab.links?.length ? tab.links : item.sources;
  // GitHub sources foreground the rich card (centered, like the reference); other
  // source kinds keep the two-column split with notes beside the embed.
  if (tab.embed?.kind === 'github-card' && tab.embed.url && parseGithubRepo(tab.embed.url)) {
    return `
    <section class="slide slide--source" data-item-id="${escapeAttr(item.id)}" data-tab-id="${escapeAttr(
      tab.id
    )}" data-tab-type="source" data-layer="${escapeAttr(item.layer)}">
      <div class="media-centered">
        <p class="section-label">${escapeHtml(item.category)}</p>
        <h2 class="media-caption">${escapeHtml(tab.title ?? item.title)}</h2>
        ${tab.body ? `<p class="media-note">${escapeHtml(Array.isArray(tab.body) ? tab.body[0] : tab.body)}</p>` : ''}
        <div class="media-embed">${renderEmbed(tab.embed)}</div>
      </div>
    </section>
  `;
  }

  return `
    <section class="slide slide--source" data-item-id="${escapeAttr(item.id)}" data-tab-id="${escapeAttr(
      tab.id
    )}" data-tab-type="source" data-layer="${escapeAttr(item.layer)}">
      <div class="slide__split">
        <article>
          <p class="section-label">${escapeHtml(item.category)}</p>
          <h1>${escapeHtml(tab.title ?? 'Source')}</h1>
          ${renderBody(tab.body ?? 'The source card keeps provenance visible even when an embed fails to load.')}
          ${tab.embed ? renderEmbed(tab.embed) : ''}
        </article>
        <aside>
          ${renderSourceList(links, 'Open source')}
          ${renderHighlights(tab.highlights ?? item.highlights ?? [])}
        </aside>
      </div>
    </section>
  `;
}

function renderDecisionSlide(item: ReportItem, tab: ItemTab): string {
  const verdict = item.verdict;
  if (!verdict) {
    return renderEvidenceSlide(item, tab);
  }

  return `
    <section class="slide slide--decision slide--dark" data-item-id="${escapeAttr(item.id)}" data-tab-id="${escapeAttr(
      tab.id
    )}" data-tab-type="decision" data-layer="${escapeAttr(item.layer)}">
      <div class="decision-grid">
        <article>
          <p class="section-label">${escapeHtml(tab.label)}</p>
          <h1><span class="verdict">${escapeHtml(verdict.state)}</span> ${escapeHtml(tab.title ?? item.title)}</h1>
          ${renderBody(tab.body ?? verdict.whyNow)}
        </article>
        <aside class="decision-panel">
          <div class="metric-pair"><span>Fit</span><strong>${escapeHtml(verdict.fit)}</strong></div>
          <div class="metric-pair"><span>Effort</span><strong>${escapeHtml(verdict.effort)}</strong></div>
          <div class="metric-pair"><span>Why now</span><strong>${escapeHtml(verdict.whyNow)}</strong></div>
          ${
            verdict.risks?.length
              ? `<div class="risk-list"><span>Risks</span>${verdict.risks
                  .map((risk) => `<p>${escapeHtml(risk)}</p>`)
                  .join('')}</div>`
              : ''
          }
          ${verdict.nextStep ? `<div class="next-step"><span>Next step</span><p>${escapeHtml(verdict.nextStep)}</p></div>` : ''}
        </aside>
      </div>
    </section>
  `;
}

// Tweet and video tabs center the live embed as the star of the slide (matching the
// reference), with a one-line caption above. The embed carries its own fallback link.
function renderMediaSlide(item: ReportItem, tab: ItemTab, kind: 'video' | 'tweet'): string {
  const caption = tab.title ?? item.headline;
  const note = tab.body ? (Array.isArray(tab.body) ? tab.body[0] : tab.body) : undefined;
  return `
    <section class="slide slide--media slide--media-${kind}" data-item-id="${escapeAttr(item.id)}" data-tab-id="${escapeAttr(
      tab.id
    )}" data-tab-type="${kind}" data-layer="${escapeAttr(item.layer)}">
      <div class="media-centered">
        <p class="section-label">${escapeHtml(tab.label)}</p>
        <h2 class="media-caption">${escapeHtml(caption)}</h2>
        ${note ? `<p class="media-note">${escapeHtml(note)}</p>` : ''}
        <div class="media-embed">${tab.embed ? renderEmbed(tab.embed) : renderSourceList(item.sources, 'Related source')}</div>
      </div>
    </section>
  `;
}

function renderEvidenceSlide(item: ReportItem, tab: ItemTab): string {
  return `
    <section class="slide slide--evidence slide--${escapeAttr(tab.type)}" data-item-id="${escapeAttr(
      item.id
    )}" data-tab-id="${escapeAttr(tab.id)}" data-tab-type="${escapeAttr(tab.type)}" data-layer="${escapeAttr(item.layer)}">
      <div class="slide__split">
        <article>
          <p class="section-label">${escapeHtml(tab.label)}</p>
          <h1>${escapeHtml(tab.title ?? item.headline)}</h1>
          ${renderBody(tab.body ?? item.thesis)}
        </article>
        <aside>
          ${renderStats(tab.stats ?? [], 'light')}
          ${renderHighlights(tab.highlights ?? [])}
          ${tab.links?.length ? renderSourceList(tab.links, 'Links') : ''}
        </aside>
      </div>
    </section>
  `;
}

function renderFurtherReadingSlide(item: ReportItem, tab: ItemTab): string {
  return `
    <section class="slide slide--reading" data-item-id="${escapeAttr(item.id)}" data-tab-id="${escapeAttr(
      tab.id
    )}" data-tab-type="further-reading" data-layer="${escapeAttr(item.layer)}">
      <div class="slide__narrow">
        <p class="section-label">${escapeHtml(tab.label)}</p>
        <h1>${escapeHtml(tab.title ?? 'Further reading')}</h1>
        ${renderBody(tab.body ?? 'Use these links to inspect the source trail behind the recommendation.')}
        ${renderSourceList(tab.links ?? item.furtherReading ?? [], 'Further reading')}
      </div>
    </section>
  `;
}

function renderClosingSlide(report: Report): string {
  const closing = report.closing;
  if (!closing) return '';

  return `
    <section class="slide slide--closing slide--dark" data-item-id="closing" data-tab-id="closing">
      <div class="slide__narrow">
        ${renderWordmark()}
        <p class="section-label">${escapeHtml(closing.label)}</p>
        <h1>${escapeHtml(closing.title)}</h1>
        ${renderBody(closing.body)}
        ${
          closing.cta
            ? `<a class="button button--primary" href="${escapeAttr(
                closing.cta.url
              )}" target="_blank" rel="noreferrer">${escapeHtml(closing.cta.label)}</a>`
            : ''
        }
      </div>
    </section>
  `;
}

function renderStats(stats: StatBlock[], tone: 'light' | 'dark'): string {
  if (stats.length === 0) return '';
  return `<div class="stat-grid stat-grid--${tone}">
    ${stats
      .map(
        (stat) =>
          `<div class="stat-card" data-emphasis="${escapeAttr(stat.emphasis ?? 'neutral')}"><span>${escapeHtml(
            stat.label
          )}</span><strong>${escapeHtml(stat.value)}</strong></div>`
      )
      .join('')}
  </div>`;
}

function renderHighlights(highlights: HighlightBlock[]): string {
  if (!highlights.length) return '';
  return `<div class="highlight-list">
    ${highlights
      .map(
        (highlight) =>
          `<section class="mini-card"><h3>${escapeHtml(highlight.title)}</h3><p>${escapeHtml(highlight.body)}</p></section>`
      )
      .join('')}
  </div>`;
}

function renderSourceList(links: SourceLink[], heading: string): string {
  if (links.length === 0) return '';
  return `<section class="source-list">
    <h2>${escapeHtml(heading)}</h2>
    ${links
      .map(
        (link) => `<a class="source-card" href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">
      <span>${escapeHtml(link.type ?? 'source')}</span>
      <strong>${escapeHtml(link.label)}</strong>
      <small>${escapeHtml(link.domain ?? safeDomain(link.url))}</small>
    </a>`
      )
      .join('')}
  </section>`;
}

function renderTags(tags: string[]): string {
  return `<div class="tag-list">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>`;
}

function renderBody(body: string | string[]): string {
  const paragraphs = Array.isArray(body) ? body : [body];
  return `<div class="body-list">${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>`;
}

// Embeds always degrade to a plain link — a failed embed must never break the report.
function renderEmbed(embed: EmbedBlock): string {
  const fallbackUrl = embed.url ?? embed.thumbnailUrl;

  if (embed.kind === 'youtube' && embed.url) {
    const videoId = getYouTubeId(embed.url);
    if (videoId) {
      return `<figure class="embed-card embed-card--youtube">
        <iframe title="YouTube video" src="https://www.youtube-nocookie.com/embed/${escapeAttr(
          videoId
        )}" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <figcaption>${
          embed.timestampLabel ? `Timestamp ${escapeHtml(embed.timestampLabel)} · ` : ''
        }<a href="${escapeAttr(embed.url)}" target="_blank" rel="noreferrer">Open on YouTube</a></figcaption>
      </figure>`;
    }
  }

  // Live X/Twitter embed via the standalone oEmbed iframe (renders the real tweet,
  // including inline video) — no global widgets.js needed. The iframe is self-contained
  // and scrolls internally; the caption keeps a working fallback link if it is blocked.
  if (embed.kind === 'tweet' && embed.url) {
    const tweetId = parseTweetId(embed.url);
    if (tweetId) {
      return `<figure class="embed-card embed-card--tweet-live">
        <div class="tweet-frame">
          <iframe title="Post on X"
            src="https://platform.twitter.com/embed/Tweet.html?id=${escapeAttr(
              tweetId
            )}&dnt=true&theme=light&width=550"
            allow="autoplay; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <figcaption><a href="${escapeAttr(embed.url)}" target="_blank" rel="noreferrer">Open post on X</a>${
          embed.timestampLabel ? ` · jump to ${escapeHtml(embed.timestampLabel)} in the video` : ''
        }</figcaption>
      </figure>`;
    }
    return `<figure class="embed-card embed-card--tweet">
      <blockquote><p>Post preview unavailable.</p><a href="${escapeAttr(
        embed.url
      )}" target="_blank" rel="noreferrer">Open post on X</a></blockquote>
    </figure>`;
  }

  // Custom Carbon Forge GitHub card — built from repo data (avatar from github.com/owner.png,
  // metrics fetched live by app.ts enrichGithubCards), NOT GitHub's OG image, so there are no
  // off-brand colors (the green/yellow language bar is gone). Avatar + owner/repo + Open-repo
  // render instantly and offline; metrics fill in when reachable.
  if (embed.kind === 'github-card' && embed.url) {
    const gh = parseGithubRepo(embed.url);
    if (gh) {
      const metric = (key: string, label: string) =>
        `<div class="gh-metric"><strong data-gh="${key}">—</strong><span>${label}</span></div>`;
      return `<figure class="embed-card embed-card--github">
        <article class="gh-card" data-owner="${escapeAttr(gh.owner)}" data-repo="${escapeAttr(gh.repo)}">
          <div class="gh-card__head">
            <img class="gh-card__avatar" src="https://github.com/${escapeAttr(
              gh.owner
            )}.png?size=160" alt="" loading="lazy" onerror="this.style.visibility='hidden'" />
            <div class="gh-card__id">
              <p class="gh-card__name">${escapeHtml(gh.owner)}/<b>${escapeHtml(gh.repo)}</b></p>
              <p class="gh-card__desc" data-gh="description"></p>
            </div>
            <svg class="gh-card__mark" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"/></svg>
          </div>
          <div class="gh-card__metrics">
            ${metric('stars', 'Stars')}${metric('forks', 'Forks')}${metric('issues', 'Issues')}${metric('language', 'Language')}
          </div>
        </article>
        <a class="button button--primary" href="${escapeAttr(
          embed.url
        )}" target="_blank" rel="noreferrer">Open the repo</a>
      </figure>`;
    }
  }

  if (embed.kind === 'image' && embed.thumbnailUrl) {
    return `<figure class="embed-card embed-card--image"><img src="${escapeAttr(
      embed.thumbnailUrl
    )}" alt="" loading="lazy">${
      fallbackUrl ? `<figcaption><a href="${escapeAttr(fallbackUrl)}" target="_blank" rel="noreferrer">Open image source</a></figcaption>` : ''
    }</figure>`;
  }

  if (embed.kind === 'html' && embed.html) {
    return `<div class="embed-card">${embed.html}</div>`;
  }

  return `<div class="embed-card embed-card--fallback"><p>Source preview</p>${
    fallbackUrl ? `<a href="${escapeAttr(fallbackUrl)}" target="_blank" rel="noreferrer">Open source</a>` : ''
  }</div>`;
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.replace('/', '') || null;
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
}

// Numeric tweet/post id from any x.com/twitter.com status URL (e.g. .../status/123 or /i/status/123).
function parseTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/) ?? url.match(/\/(\d{6,})/);
  return match ? match[1] : null;
}

// owner/repo from a github.com URL.
function parseGithubRepo(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('github.com')) return null;
    const [owner, repo] = parsed.pathname.replace(/^\//, '').split('/');
    return owner && repo ? { owner, repo: repo.replace(/\.git$/, '') } : null;
  } catch {
    return null;
  }
}

function safeDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'external';
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}
