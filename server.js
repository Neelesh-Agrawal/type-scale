/**
 * server.js — Whyframe Module 02: Local Development Server
 *
 * Runs purely on Node.js built-ins (no npm install needed).
 * - Reads GROQ_API_KEY from .env automatically
 * - Serves all static files (index.html, style.css, *.js, etc.)
 * - Handles POST /api/analyze exactly like the Vercel serverless function
 *
 * Usage:
 *   node server.js
 *   → Open http://localhost:3000
 *
 * The GROQ_API_KEY stays in .env which is gitignored.
 * Nothing is ever exposed to the browser or committed to git.
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

// ─── Load .env manually (no dotenv dependency needed) ─────────────────────────

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠  No .env file found. Copy .env.example to .env and add your GROQ_API_KEY.');
    return;
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, ''); // strip quotes
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

loadEnv();

// ─── MIME types for static file serving ──────────────────────────────────────

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
};

// ─── API handler (mirrors api/analyze.js logic) ───────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

async function handleAnalyze(body, res) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonResponse(res, 500, {
      error: 'GROQ_API_KEY not found. Check your .env file.',
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return jsonResponse(res, 400, { error: 'Invalid JSON body' });
  }

  const { scale, font, pairedFont, multiplierName, platform, context } = parsed;
  if (!scale || !font || !multiplierName || !platform) {
    return jsonResponse(res, 400, { error: 'Missing required fields' });
  }

  const scaleSummary = scale
    .map((s) => `${s.tag}: ${s.size}px (${s.rem}), lh:${s.lineHeight}, ls:${s.letterSpacing}, w:${s.weight}`)
    .join('\n');

  const systemPrompt = `You are a senior typography expert and design educator. 
You give specific, opinionated, practical reasoning — not generic advice.
Always reference the actual font name, ratio name, and project context in your response.
Return JSON only. No markdown, no preamble.`;

  const userPrompt = `Font: ${font.name}, x-height: ${font.xHeight}, category: ${font.category}
Scale ratio: ${multiplierName}
Generated steps:
${scaleSummary}
Platform: ${platform}
Project context: ${context || 'Not specified'}
Paired font: ${pairedFont ? pairedFont.name : 'none'}

Return this JSON:
{
  "xHeightNote": "...",
  "whyThisWorks": "...",
  "watchOutFor": "...",
  "pairingNote": "..."
}`;

  let groqRes;
  try {
    groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    });
  } catch (err) {
    return jsonResponse(res, 502, { error: `Failed to reach Groq: ${err.message}` });
  }

  if (!groqRes.ok) {
    const errBody = await groqRes.text();
    return jsonResponse(res, 502, { error: `Groq error ${groqRes.status}: ${errBody}` });
  }

  const groqData = await groqRes.json();
  const content  = groqData?.choices?.[0]?.message?.content;
  if (!content) return jsonResponse(res, 502, { error: 'Empty response from Groq' });

  try {
    return jsonResponse(res, 200, JSON.parse(content));
  } catch {
    return jsonResponse(res, 502, { error: 'Groq did not return valid JSON' });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function jsonResponse(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // ── API route ────────────────────────────────────────────────────────────────
  if (req.url === '/api/analyze' && req.method === 'POST') {
    const body = await readBody(req);
    return handleAnalyze(body, res);
  }

  // ── Static files ─────────────────────────────────────────────────────────────
  let urlPath = req.url.split('?')[0]; // strip querystring
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(__dirname, 'public', urlPath);

  // Security: don't serve files outside public/ dir
  const publicDir = path.join(__dirname, 'public');
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end(`Not found: ${urlPath}`);
    }
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ✦ Whyframe Type Scale\n`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  API key: ${process.env.GROQ_API_KEY ? '✓ loaded from .env' : '✗ NOT FOUND — add GROQ_API_KEY to .env'}`);
  console.log(`\n  Press Ctrl+C to stop.\n`);
});
