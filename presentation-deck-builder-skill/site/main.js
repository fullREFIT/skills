export const brands = {
  'carbon-forge': {
    label: 'Carbon Forge',
    wordmark: 'full/REFIT',
    description: 'Built for technical reviews, operating briefs, and implementation decisions.',
    headline: 'Make the recommendation visible.',
    copy: 'Separate source evidence from judgment so the audience can inspect both.',
    colors: {
      dark: '#121010',
      canvas: '#F2F0EE',
      surface: '#FFFFFF',
      text: '#121010',
      muted: '#6B6765',
      primary: '#D43B2A',
      primaryText: '#B8301F',
      secondary: '#FFB400',
      border: '#D8D4D1'
    },
    fonts: {
      body: "'Outfit', sans-serif",
      display: "'Outfit', sans-serif",
      mono: "'JetBrains Mono', monospace"
    }
  },
  'tab-squirrel': {
    label: 'TabSquirrel',
    wordmark: 'TabSquirrel',
    description: 'Built for calm product education, knowledge organization, and approachable technology.',
    headline: 'Close the tabs. Keep the context.',
    copy: 'Present complex ideas without making the interface feel heavy or mechanical.',
    colors: {
      dark: '#1A1A1A',
      canvas: '#F2F0E9',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      muted: '#6B6C66',
      primary: '#CC5833',
      primaryText: '#A94729',
      secondary: '#2E4036',
      border: '#DDD8CE'
    },
    fonts: {
      body: "'Plus Jakarta Sans', sans-serif",
      display: "'Plus Jakarta Sans', sans-serif",
      mono: "'IBM Plex Mono', monospace"
    }
  },
  'executive-signal': {
    label: 'Executive Signal',
    wordmark: 'EXECUTIVE SIGNAL',
    description: 'Built for board briefings, priorities, metrics, and high-clarity executive decisions.',
    headline: 'Put the evidence trail beside the call.',
    copy: 'Keep status, risk, and recommendation visible without adding decorative noise.',
    colors: {
      dark: '#0B132B',
      canvas: '#F4F7FB',
      surface: '#FFFFFF',
      text: '#111827',
      muted: '#667085',
      primary: '#2F6BFF',
      primaryText: '#1F55D5',
      secondary: '#2DD4BF',
      border: '#DCE3EE'
    },
    fonts: {
      body: "'Inter', sans-serif",
      display: "'Inter', sans-serif",
      mono: "'IBM Plex Mono', monospace"
    }
  },
  'editorial-studio': {
    label: 'Editorial Studio',
    wordmark: 'Editorial Studio',
    description: 'Built for narrative reports, workshops, educational material, and story-led research.',
    headline: 'Give the argument room to unfold.',
    copy: 'Use typography and pacing to support the evidence rather than compete with it.',
    colors: {
      dark: '#24211D',
      canvas: '#F6F3EE',
      surface: '#FFFFFF',
      text: '#24211D',
      muted: '#6C665D',
      primary: '#46614F',
      primaryText: '#37503F',
      secondary: '#B7784A',
      border: '#E4DDD1'
    },
    fonts: {
      body: "'Inter', sans-serif",
      display: "'Cormorant Garamond', serif",
      mono: "'IBM Plex Mono', monospace"
    }
  }
};

function applyBrand(id) {
  const brand = brands[id];
  if (!brand) return;

  document.querySelectorAll('[data-preview]').forEach((preview) => {
    const variables = {
      '--deck-dark': brand.colors.dark,
      '--deck-canvas': brand.colors.canvas,
      '--deck-surface': brand.colors.surface,
      '--deck-text': brand.colors.text,
      '--deck-muted': brand.colors.muted,
      '--deck-primary': brand.colors.primary,
      '--deck-label': brand.colors.primaryText,
      '--deck-secondary': brand.colors.secondary,
      '--deck-border': brand.colors.border,
      '--deck-body': brand.fonts.body,
      '--deck-display': brand.fonts.display,
      '--deck-mono': brand.fonts.mono
    };
    Object.entries(variables).forEach(([property, value]) => preview.style.setProperty(property, value));
  });

  document.querySelectorAll('[data-preview-brand]').forEach((node) => {
    node.textContent = brand.label;
  });
  document.querySelectorAll('[data-preview-wordmark]').forEach((node) => {
    node.textContent = brand.wordmark;
  });

  const headline = document.querySelector('[data-preview-headline]');
  const copy = document.querySelector('[data-preview-copy]');
  const description = document.querySelector('[data-preview-description]');
  if (headline) headline.textContent = brand.headline;
  if (copy) copy.textContent = brand.copy;
  if (description) description.textContent = brand.description;

  document.querySelectorAll('.brand-option').forEach((button) => {
    const selected = button.dataset.brand === id;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
}

function moveSelection(current, offset) {
  const buttons = Array.from(document.querySelectorAll('.brand-option'));
  const index = buttons.indexOf(current);
  if (index < 0) return;
  const next = buttons[(index + offset + buttons.length) % buttons.length];
  next.focus();
  applyBrand(next.dataset.brand);
}

function initBrandSelector() {
  document.querySelectorAll('.brand-option').forEach((button) => {
    button.addEventListener('click', () => applyBrand(button.dataset.brand));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveSelection(button, 1);
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveSelection(button, -1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        const first = document.querySelector('.brand-option');
        first?.focus();
        if (first) applyBrand(first.dataset.brand);
      }
      if (event.key === 'End') {
        event.preventDefault();
        const buttons = document.querySelectorAll('.brand-option');
        const last = buttons[buttons.length - 1];
        last?.focus();
        if (last) applyBrand(last.dataset.brand);
      }
    });
  });
}

if (typeof document !== 'undefined') {
  initBrandSelector();
  applyBrand('carbon-forge');
}
