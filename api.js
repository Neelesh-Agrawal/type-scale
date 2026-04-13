/**
 * api.js — Whyframe Module 02: Type Scale Builder
 *
 * Frontend-only API layer. Knows nothing about the Groq API URL or key.
 * All AI calls are proxied through our own serverless endpoint at /api/analyze.
 *
 * This file is the only place where fetch('/api/analyze') is called.
 * Keep it that way.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const ANALYZE_ENDPOINT = '/api/analyze';

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * getAIReasoning
 * Sends the current scale + context to the serverless backend for AI analysis.
 *
 * @param {Object} payload
 * @param {Array}  payload.scale          - Generated scale steps from scale.js
 * @param {Object} payload.font           - Selected primary font object
 * @param {Object|null} payload.pairedFont - Optional secondary font object
 * @param {string} payload.multiplierName - Human name of the ratio (e.g. "Perfect Fourth")
 * @param {string} payload.platform       - "Web" | "Mobile" | "Print"
 * @param {string} payload.context        - User's project description
 *
 * @returns {Promise<{xHeightNote, whyThisWorks, watchOutFor, pairingNote}>}
 * @throws  {Error} on network failure or non-200 response
 */
export async function getAIReasoning(payload) {
  const response = await fetch(ANALYZE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI analysis failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Validate expected shape
  const required = ['xHeightNote', 'whyThisWorks', 'watchOutFor', 'pairingNote'];
  for (const key of required) {
    if (!(key in data)) {
      throw new Error(`Unexpected AI response: missing "${key}" field`);
    }
  }

  return data;
}
