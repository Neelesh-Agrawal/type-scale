/**
 * api/analyze.js — Whyframe Module 02: Type Scale Builder
 *
 * Vercel Serverless Function.
 * Proxies requests from the frontend to the Groq API.
 * The GROQ_API_KEY is read from environment variables — never from the client.
 *
 * Route: POST /api/analyze
 *
 * Expected request body:
 * {
 *   scale: [...],           // generated scale steps
 *   font: { name, xHeight, category },
 *   pairedFont: { name } | null,
 *   multiplierName: string, // e.g. "Perfect Fourth"
 *   platform: string,       // "Web" | "Mobile" | "Print"
 *   context: string         // user's project description
 * }
 *
 * Returns:
 * {
 *   xHeightNote: string,
 *   whyThisWorks: string,
 *   watchOutFor: string,
 *   pairingNote: string
 * }
 */

// ─── Config ───────────────────────────────────────────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildSystemPrompt() {
  return `You are a senior typography expert and design educator. 
You give specific, opinionated, practical reasoning — not generic advice.
Always reference the actual font name, ratio name, and project context in your response.
Return JSON only. No markdown, no preamble.`;
}

function buildUserPrompt({ scale, font, pairedFont, multiplierName, platform, context }) {
  const scaleSummary = scale
    .map(
      (s) =>
        `${s.tag}: ${s.size}px (${s.rem}), lh:${s.lineHeight}, ls:${s.letterSpacing}, w:${s.weight}`,
    )
    .join('\n');

  return `Font: ${font.name}, x-height: ${font.xHeight}, category: ${font.category}
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
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS + method guard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read API key from environment (set in Vercel dashboard, never in client code)
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not configured. Add it to your Vercel environment variables.',
    });
  }

  // Parse request body
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { scale, font, pairedFont, multiplierName, platform, context } = body;

  if (!scale || !font || !multiplierName || !platform) {
    return res.status(400).json({ error: 'Missing required fields: scale, font, multiplierName, platform' });
  }

  // Build prompts
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt({ scale, font, pairedFont, multiplierName, platform, context });

  // Call Groq
  let groqResponse;
  try {
    groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    });
  } catch (networkError) {
    return res.status(502).json({ error: `Failed to reach Groq: ${networkError.message}` });
  }

  if (!groqResponse.ok) {
    const errorBody = await groqResponse.text();
    return res.status(502).json({ error: `Groq error ${groqResponse.status}: ${errorBody}` });
  }

  const groqData = await groqResponse.json();
  const rawContent = groqData?.choices?.[0]?.message?.content;

  if (!rawContent) {
    return res.status(502).json({ error: 'Empty response from Groq' });
  }

  // Parse and validate JSON from model
  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    return res.status(502).json({ error: 'Groq did not return valid JSON' });
  }

  return res.status(200).json(parsed);
}
