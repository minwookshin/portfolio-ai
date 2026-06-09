# minwook shin

AI-native portfolio and studio site for Minwook Shin. The site combines selected work, writing, Lab prototypes, hover/demo motion, project case studies, and a Gemini-powered assistant that can route visitors to relevant proof.

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS with CSS variable design tokens
- Framer Motion
- Gemini API for the assistant
- ffmpeg-driven local hover preview rendering

## Main Surfaces

- `/work` — selected work with hover preview motion
- `/writing` — notes and essays
- `/lab` — prototype archive with autoplay demo tiles
- `/work/[slug]` and `/lab/[slug]` — project detail pages
- `/api/chat` — streaming Gemini assistant endpoint

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Preview Video Pipeline

Hover and Lab preview clips are generated locally and committed as static assets.

```bash
npm run render:hover-previews
```

The render manifest lives in `scripts/hover-preview-manifest.mjs`; generated MP4s live in `public/projects/previews/`.

## Environment

The AI assistant needs a Gemini key in local or deployment env:

```bash
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash-lite
```

`GEMINI_MODEL` is optional; the API route falls back to the configured low-cost Gemini models.
