/**
 * app.js — Whyframe Module 02: Type Scale Builder
 *
 * Main UI orchestration module.
 * Responsibilities:
 * - Populate input controls from fonts.js
 * - Respond to user input, generate scale via scale.js
 * - Render preview cards for each scale step
 * - Trigger AI reasoning via api.js
 * - Handle copy-to-clipboard for CSS, Tailwind, Figma token outputs
 *
 * Uses ES module imports — no bundler required (served from Vercel or live server).
 */

import { generateScale, generateCSSVariables, generateTailwindConfig, generateFigmaTokens, generateSVG } from './scale.js';
import { FONTS, getFontsByCategory, getFontByName, getGoogleFontsUrl } from './fonts.js';
import { getAIReasoning } from './api.js';

// ─── Named Multipliers ────────────────────────────────────────────────────────

const MULTIPLIERS = [
  { value: 1.067, name: 'Minor Second' },
  { value: 1.125, name: 'Major Second' },
  { value: 1.200, name: 'Minor Third' },
  { value: 1.250, name: 'Major Third' },
  { value: 1.333, name: 'Perfect Fourth' },
  { value: 1.414, name: 'Tritone' },
  { value: 1.618, name: 'Golden Ratio' },
];

// ─── State ────────────────────────────────────────────────────────────────────

let state = {
  base: 16,
  multiplier: 1.333,
  multiplierName: 'Perfect Fourth',
  stepsAbove: 3,
  stepsBelow: 2,
  primaryFont: FONTS[0],
  weight: 400,
  pairedFont: null,
  platform: 'Web',
  context: '',
  scale: [],
};

// ─── DOM References ───────────────────────────────────────────────────────────

const els = {};

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Inject Google Fonts dynamically
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = getGoogleFontsUrl();
  document.head.appendChild(link);

  cacheElements();
  populateFontSelectors();
  populateMultiplierDropdown();
  populateWeightSelector();
  attachEventListeners();

  // Generate on load with defaults
  handleGenerateScale();
});

// ─── Cache Elements ───────────────────────────────────────────────────────────

function cacheElements() {
  els.baseSlider      = document.getElementById('base-slider');
  els.baseNumber      = document.getElementById('base-number');
  els.multiplierSel   = document.getElementById('multiplier-select');
  els.stepsAbove      = document.getElementById('steps-above');
  els.stepsBelow      = document.getElementById('steps-below');
  els.fontSearch      = document.getElementById('font-search');
  els.fontDropdown    = document.getElementById('font-dropdown');
  els.fontSelected    = document.getElementById('font-selected');
  els.weightSel       = document.getElementById('weight-select');
  els.pairedFontSel   = document.getElementById('paired-font-select');
  els.platformBtns    = document.querySelectorAll('.platform-btn');
  els.contextInput    = document.getElementById('context-input');
  els.generateBtn     = document.getElementById('generate-btn');
  els.aiBtn           = document.getElementById('ai-btn');
  els.previewGrid     = document.getElementById('preview-grid');
  els.aiCard          = document.getElementById('ai-reasoning-card');
  els.copyCss         = document.getElementById('copy-css');
  els.copyTailwind    = document.getElementById('copy-tailwind');
  els.copyFigma       = document.getElementById('copy-figma');
  els.exportSvg       = document.getElementById('export-svg');
  els.outputPreview   = document.getElementById('output-preview');
  els.fontSearchWrap  = document.getElementById('font-search-wrap');
}

// ─── Populate Dropdowns ───────────────────────────────────────────────────────

function populateFontSelectors() {
  const grouped = getFontsByCategory();

  // Build primary font dropdown HTML
  let html = '';
  for (const [category, fonts] of Object.entries(grouped)) {
    html += `<div class="font-group-label">${category}</div>`;
    fonts.forEach((f) => {
      html += `<div class="font-option" data-name="${f.name}" data-category="${f.category}">${f.name}</div>`;
    });
  }
  els.fontDropdown.innerHTML = html;

  // Set initial selected font display
  els.fontSelected.textContent = state.primaryFont.name;
  els.fontSelected.style.fontFamily = `'${state.primaryFont.name}', sans-serif`;

  // Pair font selector (with "None" first)
  els.pairedFontSel.innerHTML = '<option value="">— None —</option>';
  FONTS.forEach((f) => {
    const opt = document.createElement('option');
    opt.value = f.name;
    opt.textContent = `${f.name} (${f.category})`;
    els.pairedFontSel.appendChild(opt);
  });
}

function populateMultiplierDropdown() {
  els.multiplierSel.innerHTML = '';
  MULTIPLIERS.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m.value;
    opt.textContent = `${m.value} — ${m.name}`;
    if (m.value === state.multiplier) opt.selected = true;
    els.multiplierSel.appendChild(opt);
  });
}

function populateWeightSelector() {
  const weights = state.primaryFont.weights;
  els.weightSel.innerHTML = '';
  weights.forEach((w) => {
    const opt = document.createElement('option');
    opt.value = w;
    opt.textContent = weightLabel(w);
    if (w === 400) opt.selected = true;
    els.weightSel.appendChild(opt);
  });
  state.weight = weights.includes(400) ? 400 : weights[0];
}

function weightLabel(w) {
  const labels = { 100: '100 Thin', 200: '200 ExtraLight', 300: '300 Light',
    400: '400 Regular', 500: '500 Medium', 600: '600 SemiBold',
    700: '700 Bold', 800: '800 ExtraBold', 900: '900 Black' };
  return labels[w] || `${w}`;
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

function attachEventListeners() {
  // Base size sync
  els.baseSlider.addEventListener('input', () => {
    state.base = parseInt(els.baseSlider.value, 10);
    els.baseNumber.value = state.base;
  });
  els.baseNumber.addEventListener('input', () => {
    const v = Math.min(24, Math.max(8, parseInt(els.baseNumber.value, 10) || 16));
    state.base = v;
    els.baseSlider.value = v;
  });

  // Multiplier
  els.multiplierSel.addEventListener('change', () => {
    state.multiplier = parseFloat(els.multiplierSel.value);
    const match = MULTIPLIERS.find((m) => m.value === state.multiplier);
    state.multiplierName = match ? match.name : `${state.multiplier}`;
  });

  // Steps
  els.stepsAbove.addEventListener('input', () => {
    state.stepsAbove = parseInt(els.stepsAbove.value, 10);
  });
  els.stepsBelow.addEventListener('input', () => {
    state.stepsBelow = parseInt(els.stepsBelow.value, 10);
  });

  // Font search + dropdown
  els.fontSelected.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFontDropdown();
  });
  els.fontSearch.addEventListener('input', () => {
    filterFontDropdown(els.fontSearch.value);
  });
  els.fontDropdown.addEventListener('click', (e) => {
    const option = e.target.closest('.font-option');
    if (!option) return;
    selectFont(option.dataset.name);
  });
  document.addEventListener('click', (e) => {
    if (!els.fontSearchWrap.contains(e.target)) {
      closeFontDropdown();
    }
  });

  // Weight
  els.weightSel.addEventListener('change', () => {
    state.weight = parseInt(els.weightSel.value, 10);
  });

  // Paired font
  els.pairedFontSel.addEventListener('change', () => {
    const name = els.pairedFontSel.value;
    state.pairedFont = name ? getFontByName(name) : null;
  });

  // Platform buttons
  els.platformBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      els.platformBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.platform = btn.dataset.platform;
    });
  });

  // Context
  els.contextInput.addEventListener('input', () => {
    state.context = els.contextInput.value;
  });

  // Generate
  els.generateBtn.addEventListener('click', handleGenerateScale);

  // AI Reasoning
  els.aiBtn.addEventListener('click', handleAIReasoning);

  // Copy buttons
  els.copyCss.addEventListener('click', () => copyOutput('css'));
  els.copyTailwind.addEventListener('click', () => copyOutput('tailwind'));
  els.copyFigma.addEventListener('click', () => copyOutput('figma'));

  // SVG export
  els.exportSvg.addEventListener('click', handleExportSVG);
}

// ─── Font Dropdown Logic ──────────────────────────────────────────────────────

function toggleFontDropdown() {
  const isOpen = els.fontSearchWrap.classList.contains('open');
  isOpen ? closeFontDropdown() : openFontDropdown();
}

function openFontDropdown() {
  els.fontSearchWrap.classList.add('open');
  els.fontSearch.value = '';
  filterFontDropdown('');
  els.fontSearch.focus();
}

function closeFontDropdown() {
  els.fontSearchWrap.classList.remove('open');
}

function filterFontDropdown(query) {
  const q = query.toLowerCase();
  const options = els.fontDropdown.querySelectorAll('.font-option');
  const groups = els.fontDropdown.querySelectorAll('.font-group-label');

  options.forEach((opt) => {
    const match = opt.dataset.name.toLowerCase().includes(q) ||
                  opt.dataset.category.toLowerCase().includes(q);
    opt.style.display = match ? '' : 'none';
  });

  // Hide group labels if all fonts in category are hidden
  groups.forEach((label) => {
    let sibling = label.nextElementSibling;
    let visible = false;
    while (sibling && !sibling.classList.contains('font-group-label')) {
      if (sibling.style.display !== 'none') visible = true;
      sibling = sibling.nextElementSibling;
    }
    label.style.display = visible ? '' : 'none';
  });
}

function selectFont(name) {
  const font = getFontByName(name);
  if (!font) return;
  state.primaryFont = font;
  els.fontSelected.textContent = name;
  els.fontSelected.style.fontFamily = `'${name}', sans-serif`;
  closeFontDropdown();
  populateWeightSelector();
}

// ─── Generate Scale ───────────────────────────────────────────────────────────

function handleGenerateScale() {
  state.scale = generateScale({
    base: state.base,
    multiplier: state.multiplier,
    stepsAbove: state.stepsAbove,
    stepsBelow: state.stepsBelow,
  });

  renderPreviewCards();
  updateOutputPreview();

  // Clear stale AI card
  els.aiCard.classList.remove('visible');
  els.aiCard.innerHTML = '';
}

// ─── Render Preview Cards ─────────────────────────────────────────────────────

function renderPreviewCards() {
  els.previewGrid.innerHTML = '';

  state.scale.forEach((step) => {
    const card = document.createElement('div');
    card.className = `scale-card${step.isBase ? ' scale-card--base' : ''}`;

    const pairedFontFamily = state.pairedFont && ['Caption', 'Label', 'Overline'].includes(step.tag)
      ? `'${state.pairedFont.name}', sans-serif`
      : `'${state.primaryFont.name}', sans-serif`;

    card.innerHTML = `
      <div class="scale-card__meta">
        <span class="scale-card__tag">${step.tag}</span>
        ${step.isBase ? '<span class="scale-card__base-badge">Base</span>' : ''}
        ${step.tag === 'Body' ? `<span class="scale-card__xheight-badge" title="X-height: ${state.primaryFont.xHeight}">x-height: ${state.primaryFont.xHeight}</span>` : ''}
      </div>
      <p class="scale-card__sample" style="font-size:${Math.min(step.size, 72)}px; font-family:${pairedFontFamily}; line-height:${step.lineHeight}; letter-spacing:${step.letterSpacing}; font-weight:${step.weight};">${step.sampleText}</p>
      <div class="scale-card__values">
        <span class="scale-card__value" title="Size in pixels — absolute unit, good for design tools">
          ${step.size}px
        </span>
        <span class="scale-card__value" title="Size in rem — scales with user's browser font size. 1rem = 16px by default">
          ${step.rem}
        </span>
        <span class="scale-card__value" title="Line Height — multiplier for vertical space between lines. 1.6 = relaxed, 1.1 = tight headlines">
          Line Height&nbsp;${step.lineHeight}
        </span>
        <span class="scale-card__value" title="Letter Spacing — space between characters. Negative pulls letters closer (good for large headings); positive pushes apart (good for small caps/labels)">
          Letter Spacing&nbsp;${step.letterSpacing}
        </span>
        <span class="scale-card__value" title="Font Weight — 400 = Regular, 500 = Medium, 600 = SemiBold, 700 = Bold">
          Weight&nbsp;${step.weight}
        </span>
      </div>
    `;

    els.previewGrid.appendChild(card);
  });
}

// ─── AI Reasoning ─────────────────────────────────────────────────────────────

async function handleAIReasoning() {
  if (!state.scale.length) {
    showToast('Generate a scale first!');
    return;
  }

  els.aiBtn.disabled = true;
  els.aiBtn.textContent = 'Thinking…';
  els.aiCard.classList.remove('visible');
  els.aiCard.innerHTML = `
    <div class="ai-loading">
      <div class="ai-loading__spinner"></div>
      <p>Analyzing your type scale…</p>
    </div>
  `;
  els.aiCard.classList.add('visible');

  try {
    const result = await getAIReasoning({
      scale: state.scale,
      font: {
        name: state.primaryFont.name,
        xHeight: state.primaryFont.xHeight,
        category: state.primaryFont.category,
      },
      pairedFont: state.pairedFont ? { name: state.pairedFont.name } : null,
      multiplierName: state.multiplierName,
      platform: state.platform,
      context: state.context,
    });

    renderAICard(result);
  } catch (err) {
    els.aiCard.innerHTML = `
      <div class="ai-error">
        <span class="ai-error__icon">⚠️</span>
        <p>${err.message}</p>
        <small>Make sure your GROQ_API_KEY is set in your .env file and you're running via Vercel dev or deployed.</small>
      </div>
    `;
  } finally {
    els.aiBtn.disabled = false;
    els.aiBtn.textContent = 'Get AI Reasoning';
  }
}

function renderAICard(result) {
  els.aiCard.innerHTML = `
    <div class="ai-card__header">
      <span class="ai-card__icon">✦</span>
      <h3 class="ai-card__title">AI Type Reasoning</h3>
      <span class="ai-card__model">llama-3.3-70b · Groq</span>
    </div>
    <div class="ai-card__sections">
      <div class="ai-section">
        <div class="ai-section__label">X-Height Note</div>
        <p class="ai-section__text">${result.xHeightNote}</p>
      </div>
      <div class="ai-section">
        <div class="ai-section__label">Why This Scale Works</div>
        <p class="ai-section__text">${result.whyThisWorks}</p>
      </div>
      <div class="ai-section ai-section--warning">
        <div class="ai-section__label">Watch Out For</div>
        <p class="ai-section__text">${result.watchOutFor}</p>
      </div>
      <div class="ai-section">
        <div class="ai-section__label">Pairing Note</div>
        <p class="ai-section__text">${result.pairingNote}</p>
      </div>
    </div>
  `;
  els.aiCard.classList.add('visible');
}

// ─── Copy Outputs ─────────────────────────────────────────────────────────────

function updateOutputPreview() {
  // Default: show CSS on load
  showOutputTab('css');
}

function copyOutput(type) {
  if (!state.scale.length) {
    showToast('Generate a scale first!');
    return;
  }

  let text = '';
  const btnMap = { css: els.copyCss, tailwind: els.copyTailwind, figma: els.copyFigma };

  switch (type) {
    case 'css':
      text = generateCSSVariables(state.scale);
      break;
    case 'tailwind':
      text = generateTailwindConfig(state.scale);
      break;
    case 'figma':
      text = generateFigmaTokens(state.scale, {
        primary: state.primaryFont.name,
        paired: state.pairedFont ? state.pairedFont.name : null,
      });
      showFigmaGuide();
      break;
  }

  showOutputTab(type, text);
  navigator.clipboard.writeText(text).then(() => {
    const btn = btnMap[type];
    const original = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.classList.add('btn--copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('btn--copied');
    }, 2000);
  });
}

function showOutputTab(type, text) {
  if (!text) {
    if (!state.scale.length) return;
    switch (type) {
      case 'css': text = generateCSSVariables(state.scale); break;
      case 'tailwind': text = generateTailwindConfig(state.scale); break;
      case 'figma':
        text = generateFigmaTokens(state.scale, {
          primary: state.primaryFont.name,
          paired: state.pairedFont ? state.pairedFont.name : null,
        });
        break;
    }
  }
  // Hide Figma guide when switching away from figma tab
  if (type !== 'figma') hideFigmaGuide();
  els.outputPreview.textContent = text;
}

// ─── Figma Guide ──────────────────────────────────────────────────────────────

function showFigmaGuide() {
  const existing = document.getElementById('figma-guide');
  if (existing) return; // already shown

  const guide = document.createElement('div');
  guide.id = 'figma-guide';
  guide.className = 'figma-guide';
  guide.innerHTML = `
    <div class="figma-guide__header">
      <svg class="figma-guide__logo" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M19 28.5C19 25.634 21.3431 23.3 24.25 23.3C27.1569 23.3 29.5 25.634 29.5 28.5C29.5 31.366 27.1569 33.7 24.25 33.7C21.3431 33.7 19 31.366 19 28.5Z" fill="#1ABCFE"/>
        <path d="M8.5 47.5C8.5 44.634 10.8431 42.3 13.75 42.3H19V47.5C19 50.366 16.6569 52.7 13.75 52.7C10.8431 52.7 8.5 50.366 8.5 47.5Z" fill="#0ACF83"/>
        <path d="M19 4.3H24.25C27.1569 4.3 29.5 6.634 29.5 9.5C29.5 12.366 27.1569 14.7 24.25 14.7H19V4.3Z" fill="#FF7262"/>
        <path d="M8.5 9.5C8.5 6.634 10.8431 4.3 13.75 4.3H19V14.7H13.75C10.8431 14.7 8.5 12.366 8.5 9.5Z" fill="#F24E1E"/>
        <path d="M8.5 28.5C8.5 25.634 10.8431 23.3 13.75 23.3H19V33.7H13.75C10.8431 33.7 8.5 31.366 8.5 28.5Z" fill="#A259FF"/>
      </svg>
      <div>
        <div class="figma-guide__title">How to use this in Figma</div>
        <div class="figma-guide__subtitle">Takes about 2 minutes</div>
      </div>
      <button class="figma-guide__close" onclick="document.getElementById('figma-guide').remove()" aria-label="Close guide">✕</button>
    </div>
    <ol class="figma-guide__steps">
      <li class="figma-guide__step">
        <span class="figma-guide__step-num">1</span>
        <div>
          <strong>Install the free plugin</strong>
          <p>In Figma, go to <em>Plugins → Browse plugins</em> and search for <strong>"Tokens Studio for Figma"</strong>. Install it (it's free).</p>
        </div>
      </li>
      <li class="figma-guide__step">
        <span class="figma-guide__step-num">2</span>
        <div>
          <strong>Open the plugin</strong>
          <p>In your Figma file: <em>Plugins → Tokens Studio for Figma → Open</em>.</p>
        </div>
      </li>
      <li class="figma-guide__step">
        <span class="figma-guide__step-num">3</span>
        <div>
          <strong>Create a new token set</strong>
          <p>Click <em>"New file"</em> or <em>"+ Add"</em> on the left. Name it something like <strong>type-scale</strong>.</p>
        </div>
      </li>
      <li class="figma-guide__step">
        <span class="figma-guide__step-num">4</span>
        <div>
          <strong>Paste your JSON</strong>
          <p>Switch to the <em>JSON</em> tab inside the plugin. Delete the placeholder content, then paste the JSON you just copied.</p>
        </div>
      </li>
      <li class="figma-guide__step">
        <span class="figma-guide__step-num">5</span>
        <div>
          <strong>Apply as Text Styles</strong>
          <p>Click <em>Styles & Variables → Create Styles</em>. Tokens Studio will generate Figma Text Styles for <strong>Display, Title, Heading…</strong> all at once — with the correct font, weight, size, line height, and letter spacing.</p>
        </div>
      </li>
      <li class="figma-guide__step">
        <span class="figma-guide__step-num">6</span>
        <div>
          <strong>Use them in design</strong>
          <p>Select any text layer → open the Text Style panel (right sidebar) → pick <strong>typography/Display</strong>, <strong>typography/Body</strong>, etc. Your scale is now a living system inside Figma.</p>
        </div>
      </li>
    </ol>
    <div class="figma-guide__footer">
      <a class="figma-guide__link" href="https://tokens.studio" target="_blank" rel="noopener">tokens.studio ↗</a>
      <a class="figma-guide__link" href="https://www.figma.com/community/plugin/843461159747178978" target="_blank" rel="noopener">Plugin page ↗</a>
    </div>
  `;

  // Insert guide above output panel
  const outputPanel = document.getElementById('output-panel');
  outputPanel.parentNode.insertBefore(guide, outputPanel);

  // Smooth scroll into view
  setTimeout(() => guide.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

function hideFigmaGuide() {
  const guide = document.getElementById('figma-guide');
  if (guide) guide.remove();
}

// ─── SVG Export ───────────────────────────────────────────────────────────────

function handleExportSVG() {
  if (!state.scale.length) {
    showToast('Generate a scale first!');
    return;
  }

  const svgString = generateSVG(state.scale, {
    primaryFont:    state.primaryFont.name,
    pairedFont:     state.pairedFont ? state.pairedFont.name : null,
    multiplierName: state.multiplierName,
    base:           state.base,
  });

  // Create a downloadable blob and trigger save
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const slug = `${state.primaryFont.name.toLowerCase().replace(/\s+/g, '-')}-${state.multiplierName.toLowerCase().replace(/\s+/g, '-')}`;
  a.href     = url;
  a.download = `type-scale-${slug}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Confirm to user
  const btn = els.exportSvg;
  const original = btn.textContent;
  btn.textContent = '✓ Downloaded!';
  btn.classList.add('btn--copied');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('btn--copied');
  }, 2500);

  showToast('SVG saved — drag it into Figma!');
}

// ─── Toast ────────────────────────────────────────────────────────────────────


function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
