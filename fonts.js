/**
 * fonts.js — Whyframe Module 02: Type Scale Builder
 *
 * Curated library of 80+ Google Fonts grouped by category.
 * All marked googleFont: true are available in Figma's font picker by default.
 *
 * Metadata fields:
 *   xHeight: 'high' | 'medium' | 'low'  — affects legibility at small sizes
 *   personality: short descriptor used in AI prompts
 *   useCase: typical design context
 */

// ─── Font Library ─────────────────────────────────────────────────────────────

export const FONTS = [

  // ── Sans-serif ──────────────────────────────────────────────────────────────
  { name: 'Inter',              category: 'Sans-serif', useCase: 'UI, dashboards, apps',                     personality: 'Neutral, highly legible, workhorse',            xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Roboto',             category: 'Sans-serif', useCase: 'Android apps, Material Design',            personality: 'Friendly geometric, ubiquitous, versatile',     xHeight: 'high',   googleFont: true,  weights: [300,400,500,700,900] },
  { name: 'Open Sans',          category: 'Sans-serif', useCase: 'Body text, long-form reading',             personality: 'Humanist, open, highly readable',               xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800] },
  { name: 'Lato',               category: 'Sans-serif', useCase: 'Corporate, editorial, UI',                 personality: 'Semi-rounded, warm, professional',              xHeight: 'high',   googleFont: true,  weights: [300,400,700,900] },
  { name: 'Poppins',            category: 'Sans-serif', useCase: 'Startups, presentations, marketing',       personality: 'Geometric, clean, modern friendly',             xHeight: 'medium', googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Montserrat',         category: 'Sans-serif', useCase: 'Headlines, branding, editorial',           personality: 'Geometric, bold, assertive',                    xHeight: 'medium', googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Raleway',            category: 'Sans-serif', useCase: 'Fashion, luxury, editorial headers',       personality: 'Elegant, thin-featured, distinctive W',         xHeight: 'medium', googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Nunito',             category: 'Sans-serif', useCase: 'Consumer apps, education, wellness',       personality: 'Rounded, warm, inviting',                       xHeight: 'medium', googleFont: true,  weights: [300,400,500,600,700,800] },
  { name: 'DM Sans',            category: 'Sans-serif', useCase: 'Modern products, editorial',               personality: 'Friendly, geometric, approachable',             xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Outfit',             category: 'Sans-serif', useCase: 'Startups, landing pages, SaaS',            personality: 'Clean, contemporary, slightly playful',         xHeight: 'medium', googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Plus Jakarta Sans',  category: 'Sans-serif', useCase: 'Professional apps, fintech',               personality: 'Sharp, confident, modern professional',         xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800] },
  { name: 'Rubik',              category: 'Sans-serif', useCase: 'Apps, playful products, gaming',           personality: 'Slightly rounded, relaxed, modern',             xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Work Sans',          category: 'Sans-serif', useCase: 'Editorial, UI, reading-heavy products',    personality: 'Optimised for screen, humanist, neutral',       xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'IBM Plex Sans',      category: 'Sans-serif', useCase: 'Enterprise, developer tools, fintech',     personality: 'Technical, precise, authoritative',             xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Manrope',            category: 'Sans-serif', useCase: 'SaaS, dashboards, modern UI',              personality: 'Geometric, wide, very legible at small sizes', xHeight: 'high',   googleFont: true,  weights: [200,300,400,500,600,700,800] },
  { name: 'Figtree',            category: 'Sans-serif', useCase: 'SaaS, clean UI, modern web',               personality: 'Geometric, friendly, balanced',                 xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Be Vietnam Pro',     category: 'Sans-serif', useCase: 'Tech startups, multilingual products',     personality: 'Optimised legibility, neutral, versatile',      xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800] },
  { name: 'Mulish',             category: 'Sans-serif', useCase: 'Body text, minimal UI',                    personality: 'Clean humanist, slightly condensed',            xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Nunito Sans',        category: 'Sans-serif', useCase: 'App UI, friendly interfaces',              personality: 'Balanced, very readable, slightly rounded',     xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Source Sans 3',      category: 'Sans-serif', useCase: 'Long-form reading, documentation',         personality: 'Humanist, workhorse, Adobe classic',           xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,900] },
  { name: 'Karla',              category: 'Sans-serif', useCase: 'Editorial, branding, startup',             personality: 'Quirky humanist, warm, distinctive',            xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800] },
  { name: 'Jost',               category: 'Sans-serif', useCase: 'Modern branding, UI, editorial',           personality: 'Geometric, elegant at thin weights',            xHeight: 'medium', googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Barlow',             category: 'Sans-serif', useCase: 'Wide display, UI, tech branding',          personality: 'Condensed-friendly, technical, versatile',      xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Geist',              category: 'Sans-serif', useCase: 'Developer tools, code-adjacent UI',        personality: 'Crisp, minimal, Vercel-origin',                 xHeight: 'high',   googleFont: false, weights: [300,400,500,600,700] },

  // ── Serif ────────────────────────────────────────────────────────────────────
  { name: 'Playfair Display',   category: 'Serif',      useCase: 'Editorial, luxury, fashion',               personality: 'Elegant, high-contrast, editorial authority',  xHeight: 'low',    googleFont: true,  weights: [400,500,600,700,800,900] },
  { name: 'Lora',               category: 'Serif',      useCase: 'Long-form reading, blogs, books',          personality: 'Warm, readable, balanced classical',            xHeight: 'medium', googleFont: true,  weights: [400,500,600,700] },
  { name: 'Merriweather',       category: 'Serif',      useCase: 'Journalism, reading-heavy content',        personality: 'Sturdy, trustworthy, newspaper authority',      xHeight: 'medium', googleFont: true,  weights: [300,400,700,900] },
  { name: 'EB Garamond',        category: 'Serif',      useCase: 'Academia, publishing, classical editorial', personality: 'Historic, refined, scholarly',                 xHeight: 'low',    googleFont: true,  weights: [400,500,600,700,800] },
  { name: 'DM Serif Display',   category: 'Serif',      useCase: 'Display headlines, luxury branding',       personality: 'Sophisticated, high-impact, editorial',         xHeight: 'low',    googleFont: true,  weights: [400] },
  { name: 'Cormorant Garamond', category: 'Serif',      useCase: 'Luxury, fashion, fine editorial',          personality: 'Ultra-refined, high contrast, delicate',        xHeight: 'low',    googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Libre Baskerville',  category: 'Serif',      useCase: 'Books, academic, bodycopy',                personality: 'Robust, comfortable, screen-optimised classic', xHeight: 'medium', googleFont: true,  weights: [400,700] },
  { name: 'PT Serif',           category: 'Serif',      useCase: 'News, editorial, multilingual',            personality: 'Sturdy, humanist, practical',                   xHeight: 'medium', googleFont: true,  weights: [400,700] },
  { name: 'Crimson Text',       category: 'Serif',      useCase: 'Books, academic, elegant body',            personality: 'Renaissance-style, authoritative, warm',        xHeight: 'low',    googleFont: true,  weights: [400,600,700] },
  { name: 'Spectral',           category: 'Serif',      useCase: 'Long reading, editorial, legal',           personality: 'Screen-first, thoughtful, polished',            xHeight: 'medium', googleFont: true,  weights: [300,400,500,600,700,800] },
  { name: 'Bitter',             category: 'Serif',      useCase: 'Blogs, news, reading-focused',             personality: 'Robust optical size, great on screen',          xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Noto Serif',         category: 'Serif',      useCase: 'Multilingual, global publishing',          personality: 'Universal clarity, no flash, very functional',  xHeight: 'medium', googleFont: true,  weights: [400,700] },
  { name: 'Domine',             category: 'Serif',      useCase: 'Editorial, long reading',                  personality: 'Sturdy, contemporary slab-adjacent',            xHeight: 'high',   googleFont: true,  weights: [400,500,600,700] },
  { name: 'Zilla Slab',         category: 'Serif',      useCase: 'Branding, editorial, Firefox-origin',      personality: 'Slab serif, strong, distinctive',               xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700] },

  // ── Monospace ────────────────────────────────────────────────────────────────
  { name: 'JetBrains Mono',     category: 'Monospace',  useCase: 'Developer tools, code editors, docs',      personality: 'Precise, technical, highly legible at small',   xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800] },
  { name: 'Fira Code',          category: 'Monospace',  useCase: 'Code display, developer-facing UI',        personality: 'Friendly, ligature-rich, functional',           xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Space Mono',         category: 'Monospace',  useCase: 'Design tools, futuristic UI, metrics',     personality: 'Retro-futuristic, distinctive, loud',           xHeight: 'high',   googleFont: true,  weights: [400,700] },
  { name: 'Inconsolata',        category: 'Monospace',  useCase: 'Terminal-style UI, technical readouts',    personality: 'Humanist mono, warm, compact',                  xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Source Code Pro',    category: 'Monospace',  useCase: 'Code documentation, developer products',   personality: 'Clean, neutral, workhorse monospace',           xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Roboto Mono',        category: 'Monospace',  useCase: 'Material Design code, data tables',        personality: 'Neutral, highly legible, companion to Roboto',  xHeight: 'high',   googleFont: true,  weights: [300,400,500,700] },
  { name: 'IBM Plex Mono',      category: 'Monospace',  useCase: 'Enterprise, code, IBM ecosystem',          personality: 'Technical, authoritative, precise',             xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Anonymous Pro',      category: 'Monospace',  useCase: 'Coding, minimal developer UIs',            personality: 'Old-school terminal, classic hacker aesthetic', xHeight: 'high',   googleFont: true,  weights: [400,700] },
  { name: 'Overpass Mono',      category: 'Monospace',  useCase: 'Technical UI, highway-sign-inspired',      personality: 'Open, wide, very legible',                      xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Courier Prime',      category: 'Monospace',  useCase: 'Screenplays, editorial retro, typewriter', personality: 'Typewriter aesthetic, warm, literary',           xHeight: 'high',   googleFont: true,  weights: [400,700] },

  // ── Display ──────────────────────────────────────────────────────────────────
  { name: 'Syne',               category: 'Display',    useCase: 'Creative agencies, portfolios',             personality: 'Experimental, bold, avant-garde',               xHeight: 'medium', googleFont: true,  weights: [400,500,600,700,800] },
  { name: 'Fraunces',           category: 'Display',    useCase: 'Editorial, storytelling, book covers',      personality: 'Optical, romanticist, deeply charismatic',      xHeight: 'low',    googleFont: true,  weights: [100,200,300,400,500,600,700,800,900] },
  { name: 'Bebas Neue',         category: 'Display',    useCase: 'Headlines, posters, sports branding',       personality: 'Condensed, bold, high-impact',                  xHeight: 'high',   googleFont: true,  weights: [400] },
  { name: 'Oswald',             category: 'Display',    useCase: 'Headlines, posters, strong UI labels',      personality: 'Condensed, assertive, widely used',             xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700] },
  { name: 'Anton',              category: 'Display',    useCase: 'Bold headlines, attention-grabbing banners', personality: 'Heavy, condensed, very loud',                  xHeight: 'high',   googleFont: true,  weights: [400] },
  { name: 'Righteous',          category: 'Display',    useCase: 'Retro branding, games, funky headlines',    personality: 'Retro rounded, playful, high personality',      xHeight: 'high',   googleFont: true,  weights: [400] },
  { name: 'Paytone One',        category: 'Display',    useCase: 'Bold headings, marketing, kids apps',       personality: 'Rounded, friendly, very bold',                  xHeight: 'high',   googleFont: true,  weights: [400] },
  { name: 'Unbounded',          category: 'Display',    useCase: 'Web3, crypto, futuristic branding',         personality: 'Wide, geometric, very modern',                  xHeight: 'medium', googleFont: true,  weights: [300,400,500,600,700,800,900] },
  { name: 'Big Shoulders Display', category: 'Display', useCase: 'Industrial, sports, bold statements',      personality: 'Ultra-condensed, muscular, impactful',          xHeight: 'high',   googleFont: true,  weights: [100,300,400,500,600,700,800,900] },
  { name: 'Archivo Black',      category: 'Display',    useCase: 'Strong UI headings, branding',              personality: 'Grotesque, heavy, confident',                   xHeight: 'high',   googleFont: true,  weights: [400] },
  { name: 'Alfa Slab One',      category: 'Display',    useCase: 'Vintage posters, bold editorial',           personality: 'Slab serif display, heavy, retro',              xHeight: 'high',   googleFont: true,  weights: [400] },
  { name: 'Lilita One',         category: 'Display',    useCase: 'Fun headings, kids, playful branding',      personality: 'Bold rounded, joyful, high energy',             xHeight: 'high',   googleFont: true,  weights: [400] },
  { name: 'Russo One',          category: 'Display',    useCase: 'Sports, sci-fi, tech headlines',            personality: 'Heavy, futuristic, no-nonsense',                xHeight: 'high',   googleFont: true,  weights: [400] },
  { name: 'Exo 2',              category: 'Display',    useCase: 'Sci-fi, tech, gaming',                      personality: 'Geometric, futuristic, versatile weights',      xHeight: 'high',   googleFont: true,  weights: [300,400,500,600,700,800,900] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * getFontsByCategory — groups fonts for the picker dropdown
 */
export function getFontsByCategory() {
  return FONTS.reduce((acc, font) => {
    if (!acc[font.category]) acc[font.category] = [];
    acc[font.category].push(font);
    return acc;
  }, {});
}

/**
 * getFontByName
 */
export function getFontByName(name) {
  return FONTS.find((f) => f.name === name);
}

/**
 * getGoogleFontsUrl — builds a single Google Fonts API URL for all googleFont: true entries
 */
export function getGoogleFontsUrl() {
  const googleFonts = FONTS.filter((f) => f.googleFont);
  const families = googleFonts.map((f) => {
    const weightStr = f.weights.join(';');
    return `family=${f.name.replace(/ /g, '+')}:wght@${weightStr}`;
  });
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}
