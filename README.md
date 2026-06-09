# Portfolio AI

AI-native portfolio and recruiter intake site for Minwook Shin. The site combines selected work, case studies, interaction studies, a Gemini-powered assistant, and public machine-readable proof routes.

Live: https://www.minwookshin.com  
Case study: https://www.minwookshin.com/work/portfolio-ai

## What This Proves

- Design engineering ownership: Figma-to-code product thinking, frontend implementation, motion, and case-study craft.
- AI product interface thinking: conversational intake, project routing, and hallucination-aware proof links.
- System thinking: design tokens, component primitives, interaction rules, accessibility rules, and AI-readable docs.
- Recruiter readability: PDF resume, JSON resume, markdown portfolio, and `llms.txt` are exposed as public routes.

## Main Surfaces

- `/` - selected work, studies, contact, and AI intake
- `/work` - selected work index
- `/work/[slug]` - project case studies
- `/studies` - interaction studies, prototypes, and writing
- `/api/chat` - streaming Gemini assistant endpoint
- `/portfolio.md` - AI-readable portfolio summary
- `/llms.txt` - concise guide for LLMs and recruiter tools
- `/resume.json` - structured machine-readable resume
- `/resume.pdf` - public resume PDF
- `/design-system` - compact AI-native design-system proof
- `/design-system.md` - design-system proof in markdown
- `/design-system/tokens.json` - token roles for UI generation

## Selected Proof

- Portfolio AI - Next.js, React, TypeScript, Gemini API, Framer Motion
- Sentinel - hackathon-winning SwiftUI app for predictive home maintenance
- Caret - iOS-style team wellbeing app concept with public web prototype source

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS with CSS variable design tokens
- Framer Motion
- Gemini API
- Vitest and Testing Library
- Vercel

## Verification

Verified from a public clone:

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

Current public proof:

- Tests: 20 passing
- Build: 59 generated static pages
- Audit: 0 npm vulnerabilities after `npm ci`
- Routes: `/portfolio.md`, `/llms.txt`, `/resume.json`, `/design-system.md`, `/design-system/tokens.json`

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Environment

The AI assistant needs a Gemini key in local or deployment env:

```bash
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash-lite
```

`GEMINI_MODEL` is optional. The API route falls back to configured Gemini models.
