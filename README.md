# Whyframe — Module 02: Type Scale Builder

A modular typographic scale generator with AI-powered design reasoning. Part of the **Whyframe** design reasoning engine.

---

## What it does

- Generates a modular type scale from base size + ratio with one click
- Auto-assigns semantic tags (Display → Overline) with correct line-height, letter-spacing, and suggested weight
- Previews each scale step rendered live in your chosen font
- Exports CSS variables, Tailwind config, and Figma Design Tokens JSON
- Calls Groq (Llama 3.3 70B) via a secure serverless function to explain:
  - What the font's x-height means at these sizes
  - Why the chosen ratio works for your project
  - What to watch out for
  - How the font pairing logic plays out

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/whyframe-type-scale.git
cd whyframe-type-scale
```

### 2. Add your API key

```bash
cp .env.example .env
```

Edit `.env`:
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

Get a free key at: https://console.groq.com

> ⚠️ **Never commit `.env`** — it's in `.gitignore`.

### 3. Run locally

No npm install needed. Uses only Node.js built-ins (requires Node 18+).

```bash
node server.js
```

Then open **http://localhost:3000** — scale math + AI reasoning both work.

The terminal will confirm whether your API key was loaded:
```
✦ Whyframe Type Scale

  Local:   http://localhost:3000
  API key: ✓ loaded from .env
```

Alternatively, if you prefer Vercel CLI:
```bash
npm install -g vercel
vercel dev
```


---

## Deployment to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Add `GROQ_API_KEY` under **Settings → Environment Variables**
4. Deploy

That's it. The API key never touches the frontend or git history.

---

## Project structure

```
whyframe-type-scale/
├── index.html          ← App shell, semantic HTML, no inline styles
├── style.css           ← All styles, grouped by section
├── app.js              ← UI orchestration, events, render logic
├── scale.js            ← Pure math: generates scale steps (no DOM, no fetch)
├── fonts.js            ← 20-font curated library with metadata
├── api.js              ← Frontend API layer (calls /api/analyze only)
├── api/
│   └── analyze.js      ← Vercel serverless function, reads GROQ_API_KEY from env
├── vercel.json         ← API route rewrites
├── .env.example        ← Template — copy to .env and fill in key
├── .gitignore          ← Excludes .env and node_modules
└── README.md
```

---

## Security design

| Concern | Approach |
|---|---|
| API key exposure | Key lives in `.env` / Vercel env vars only |
| Frontend leakage | `api.js` only calls `/api/analyze`, never Groq directly |
| Git history | `.env` is gitignored from day 1 |
| Key in code | Zero references to Groq URL or key in any frontend file |

---

## Whyframe series

| Module | Topic | Status |
|---|---|---|
| 01 | Color Analyzer | ✅ Done |
| 02 | Type Scale Builder | ✅ This repo |
| 03 | Spacing System | Coming soon |
