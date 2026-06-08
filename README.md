# Portfolio AI

AI-native portfolio and recruiter intake system for Minwook Shin.

The site combines selected work, writing, prototype studies, case studies, and a Gemini-powered assistant that can answer questions and route visitors to relevant proof.

## Role

Designed and built by Minwook Shin.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, Gemini API, Vitest

## What I Built

- Built a live portfolio system around recruiter and collaborator questions, not just static case-study browsing.
- Implemented a streaming AI assistant endpoint with request validation, rate limiting, model fallback, and project routing behavior.
- Designed project surfaces for selected work, lab studies, writing, modal detail views, hover previews, and LLM-readable portfolio routes.
- Added structured SEO surfaces including `llms.txt`, `portfolio.md`, sitemap, robots, and project metadata.
- Created local verification scripts and tests for UI behavior, project detail shells, material motion tokens, and build metadata.

## Demo

Live: https://www.minwookshin.com  
Case study: https://www.minwookshin.com/work/portfolio-ai

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

## Environment

The AI assistant needs a Gemini key in local or deployment env:

```bash
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash-lite
```

`GEMINI_MODEL` is optional. The API route falls back to the configured Gemini models.

## Notes

This public repo is a clean snapshot without private Git history, internal planning docs, or old resume artifacts.
