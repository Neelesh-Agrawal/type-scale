/**
 * api/analyze.js — Whyframe Module 02: Type Scale Builder
 *
 * Vercel Serverless Function (CommonJS format — required by Vercel unless
 * "type":"module" is set in package.json, which would break server.js).
 *
 * Proxies requests from the frontend to the Groq API.
 * GROQ_API_KEY is read from Vercel environment variables — never from the client.
 *
 * Route: POST /api/analyze
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

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

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not configured. Add it in Vercel dashboard → Settings → Environment Variables.',
    });
  }

  // Parse body — Vercel auto-parses JSON when Content-Type is application/json,
  // but guard against edge cases (string body, null, undefined).
  let body;
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Empty request body' });
    }
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { scale, font, pairedFont, multiplierName, platform, context } = body || {};

  if (!scale || !font || !multiplierName || !platform) {
    return res.status(400).json({ error: 'Missing required fields: scale, font, multiplierName, platform' });
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt   = buildUserPrompt({ scale, font, pairedFont, multiplierName, platform, context });

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
          { role: 'user',   content: userPrompt   },
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

  const groqData   = await groqResponse.json();
  const rawContent = groqData?.choices?.[0]?.message?.content;

  if (!rawContent) {
    return res.status(502).json({ error: 'Empty response from Groq' });
  }

  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    return res.status(502).json({ error: 'Groq did not return valid JSON' });
  }

  return res.status(200).json(parsed);
};
