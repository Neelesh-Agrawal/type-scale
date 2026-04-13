/**
 * scale.js — Whyframe Module 02: Type Scale Builder
 *
 * Pure math module. No DOM, no fetch, no side effects.
 * Generates a typographic scale from a base size + modular ratio.
 * Each step includes semantic tag assignment, line-height, letter-spacing,
 * suggested weight, and rem values.
 *
 * Export: generateScale({ base, multiplier, stepsAbove, stepsBelow })
 */

// ─── Tag Definitions ───────────────────────────────────────────────────────

const TAG_DEFINITIONS = [
  {
    name: 'Display',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    weight: 700,
    sampleText: 'The quick brown fox',
  },
  {
    name: 'Title',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    weight: 700,
    sampleText: 'The quick brown fox',
  },
  {
    name: 'Heading',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    weight: 600,
    sampleText: 'Designing with intent',
  },
  {
    name: 'Subheading',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    weight: 600,
    sampleText: 'Designing with intent',
  },
  {
    name: 'Body',
    lineHeight: 1.6,
    letterSpacing: '0em',
    weight: 400,
    sampleText:
      "Typography is not about collecting fonts. It's about learning restraint, contrast, and system-level thinking.",
  },
  {
    name: 'Caption',
    lineHeight: 1.4,
    letterSpacing: '+0.02em',
    weight: 400,
    sampleText: '12 min read · Published Apr 2025',
  },
  {
    name: 'Label',
    lineHeight: 1.4,
    letterSpacing: '+0.03em',
    weight: 500,
    sampleText: '12 min read · Published Apr 2025',
  },
  {
    name: 'Overline',
    lineHeight: 1.4,
    letterSpacing: '+0.04em',
    weight: 500,
    sampleText: '12 min read · Published Apr 2025',
  },
];

// ─── Core Generator ─────────────────────────────────────────────────────────

/**
 * generateScale
 * @param {Object} options
 * @param {number} options.base        - Base font size in px (default 16)
 * @param {number} options.multiplier  - Modular scale ratio (e.g. 1.333)
 * @param {number} options.stepsAbove  - Number of steps above base (1–6)
 * @param {number} options.stepsBelow  - Number of steps below base (1–3)
 * @returns {Array<ScaleStep>}
 */
export function generateScale({ base = 16, multiplier = 1.333, stepsAbove = 3, stepsBelow = 2 }) {
  const totalSteps = stepsAbove + 1 + stepsBelow; // +1 for base step

  // Build raw sizes from largest to smallest
  const sizes = [];
  for (let i = stepsAbove; i >= -stepsBelow; i--) {
    sizes.push(round2(base * Math.pow(multiplier, i)));
  }

  // Assign tags: we have 8 defined tags, pick last N of them if totalSteps < 8
  // Always ensure Body, Caption, Label are present (last 3)
  const availableTags = TAG_DEFINITIONS.slice(Math.max(0, TAG_DEFINITIONS.length - totalSteps));

  return sizes.map((size, index) => {
    const tag = availableTags[index] || TAG_DEFINITIONS[TAG_DEFINITIONS.length - 1];
    const rem = `${round2(size / 16)}rem`;

    return {
      tag: tag.name,
      size,
      rem,
      lineHeight: tag.lineHeight,
      letterSpacing: tag.letterSpacing,
      weight: tag.weight,
      sampleText: tag.sampleText,
      isBase: index === stepsAbove, // mark which step is the base
    };
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * generateCSSVariables
 * Converts a scale array into CSS custom properties
 * @param {Array} scale
 * @returns {string}
 */
export function generateCSSVariables(scale) {
  return scale
    .map((step) => {
      const varName = `--font-${step.tag.toLowerCase()}`;
      return `${varName}: ${step.rem};    /* ${step.size}px — ${step.tag} */`;
    })
    .join('\n');
}

/**
 * generateTailwindConfig
 * Converts a scale array into a Tailwind fontSize config snippet
 * @param {Array} scale
 * @returns {string}
 */
export function generateTailwindConfig(scale) {
  const entries = scale
    .map((step) => {
      const key = step.tag.toLowerCase();
      return `      '${key}': ['${step.rem}', { lineHeight: '${step.lineHeight}', letterSpacing: '${step.letterSpacing}', fontWeight: '${step.weight}' }],`;
    })
    .join('\n');

  return `// tailwind.config.js — fontSize section\nfontSize: {\n${entries}\n}`;
}

/**
 * generateFigmaTokens
 * Outputs Tokens Studio for Figma format.
 * Install the free "Tokens Studio for Figma" plugin, paste this JSON,
 * and it will create named Text Styles directly in your Figma file.
 *
 * @param {Array}  scale      - Generated scale steps
 * @param {Object} fontInfo   - { primary: 'Inter', paired: 'Lora' | null }
 * @returns {string}
 */
export function generateFigmaTokens(scale, fontInfo = {}) {
  const { primary = 'Inter', paired = null } = fontInfo;

  // Tokens Studio expects each token to have a "value" object and a "type"
  const tokens = {};

  scale.forEach((step) => {
    // Use paired font for body/caption/label/overline if provided
    const usePaired = paired && ['Caption', 'Label', 'Overline', 'Body'].includes(step.tag);
    const fontFamily = usePaired ? paired : primary;

    // Weight as a string label (Tokens Studio prefers string names)
    const weightLabels = {
      100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
      500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black',
    };

    tokens[step.tag] = {
      value: {
        fontFamily,
        fontWeight: weightLabels[step.weight] || String(step.weight),
        fontSize: `${step.size}px`,
        lineHeight: `${Math.round(step.lineHeight * 100)}%`,  // Figma uses % not decimal
        letterSpacing: step.letterSpacing,
      },
      type: 'typography',
      description: `${step.tag} — ${step.size}px / ${step.rem}`,
    };
  });

  return JSON.stringify({ typography: tokens }, null, 2);
}

/**
 * generateSVG
 * Renders the type scale as an SVG with live <text> elements.
 *
 * When dragged into Figma, each text layer arrives with the correct:
 *   font-family, font-size, font-weight, letter-spacing.
 * Figma will resolve the font if it is installed in your account
 * (Google Fonts are available in Figma by default).
 *
 * @param {Array}  scale
 * @param {Object} options
 * @param {string} options.primaryFont    - e.g. 'Inter'
 * @param {string} options.pairedFont     - e.g. 'Lora' or null
 * @param {string} options.multiplierName - e.g. 'Perfect Fourth'
 * @param {number} options.base           - base px size
 * @returns {string} SVG markup ready for download
 */
export function generateSVG(scale, options = {}) {
  const {
    primaryFont    = 'Inter',
    pairedFont     = null,
    multiplierName = 'Scale',
    base           = 16,
  } = options;

  const WIDTH = 900;
  const PAD   = 52;

  const WEIGHT_NAMES = {
    100:'Thin', 200:'ExtraLight', 300:'Light', 400:'Regular',
    500:'Medium', 600:'SemiBold', 700:'Bold', 800:'ExtraBold', 900:'Black',
  };

  // Convert em letter-spacing → px for SVG (SVG uses px, not em)
  function emToPx(emStr, fontSize) {
    const val = parseFloat(emStr);
    return isNaN(val) ? 0 : round2(val * fontSize);
  }

  // Escape XML special characters
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Max rendered font size (keeps SVG height sane for large Display steps)
  const CAP = 80;

  // ── Layout pass — calculate Y positions per step ──────────────────────────
  let cursor = 100; // start below header
  const rows = scale.map((step) => {
    const renderSize = Math.min(step.size, CAP);
    const tagY  = cursor + 18;
    const textY = tagY + 10 + renderSize;
    const metaY = textY + 16;

    // How many characters fit on one SVG line at this size
    const charsPerLine = Math.max(18, Math.floor((WIDTH - PAD * 2) / (renderSize * 0.52)));
    const truncated = step.sampleText.length > charsPerLine
      ? step.sampleText.slice(0, charsPerLine).trimEnd() + '…'
      : step.sampleText;

    const row = { step, renderSize, tagY, textY, metaY, truncated };
    cursor = metaY + 40; // gap between steps
    return row;
  });

  const TOTAL_H = cursor + PAD;

  // ── Badge: "BASE" pill ────────────────────────────────────────────────────
  function baseBadge(x, y) {
    return `<rect x="${x}" y="${y - 13}" width="38" height="16" rx="8" fill="#7c3aed"/>
    <text x="${x + 19}" y="${y - 1}" font-family="Space Mono,monospace" font-size="8" font-weight="700" fill="white" text-anchor="middle" letter-spacing="0.5">BASE</text>`;
  }

  // ── Build step rows ───────────────────────────────────────────────────────
  const elements = rows.map(({ step, renderSize, tagY, textY, metaY, truncated }, i) => {
    const usePaired = pairedFont && ['Body','Caption','Label','Overline'].includes(step.tag);
    const fontFamily = esc(usePaired ? pairedFont : primaryFont);
    const lsPx = emToPx(step.letterSpacing, renderSize);
    const weightName = WEIGHT_NAMES[step.weight] || step.weight;
    const meta = `${step.size}px  ·  ${step.rem}  ·  Line Height ${step.lineHeight}  ·  Letter Spacing ${step.letterSpacing}  ·  ${weightName} (${step.weight})`;
    const divider = i < rows.length - 1
      ? `<line x1="${PAD}" y1="${metaY + 20}" x2="${WIDTH - PAD}" y2="${metaY + 20}" stroke="#e8e0ff" stroke-width="1"/>`
      : '';
    const badgeX = PAD + step.tag.length * 7.8 + 10;

    return `
  <!-- ${step.tag} -->
  <text x="${PAD}" y="${tagY}" font-family="Space Mono,monospace" font-size="10" font-weight="700" letter-spacing="1.8" fill="#7c3aed">${step.tag.toUpperCase()}</text>
  ${step.isBase ? baseBadge(badgeX, tagY) : ''}
  <text x="${PAD}" y="${textY}" font-family="${fontFamily},sans-serif" font-size="${renderSize}" font-weight="${step.weight}" letter-spacing="${lsPx}" fill="#1a1037">${esc(truncated)}</text>
  <text x="${PAD}" y="${metaY}" font-family="Space Mono,monospace" font-size="10" fill="#9d92b8">${esc(meta)}</text>
  ${divider}`;
  }).join('');

  // ── Assemble SVG ──────────────────────────────────────────────────────────
  const pairedNote = pairedFont ? ` + ${pairedFont}` : '';
  const subtitle   = `${primaryFont}${pairedNote}  ·  ${multiplierName}  ·  ${base}px base  ·  ${scale.length} steps`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${TOTAL_H}" viewBox="0 0 ${WIDTH} ${TOTAL_H}">
  <rect width="${WIDTH}" height="${TOTAL_H}" fill="#ffffff"/>
  <text x="${PAD}" y="38" font-family="Space Mono,monospace" font-size="11" font-weight="700" letter-spacing="2.5" fill="#7c3aed">WHYFRAME / TYPE SCALE</text>
  <text x="${PAD}" y="58" font-family="Inter,sans-serif" font-size="12" fill="#9d92b8">${esc(subtitle)}</text>
  <line x1="${PAD}" y1="74" x2="${WIDTH - PAD}" y2="74" stroke="#e8e0ff" stroke-width="1.5"/>
  ${elements}
</svg>`;
}
