# Material 3 Expressive Portfolio Redesign — Design

**Date:** 2026-05-20
**Branch:** `material-redesign` (based on commit `bb83df8`, the light/Urbanist version currently deployed at minwookshin.com)
**Scope:** Full front-end visual redesign. Backend (Gemini chat API, AI knowledge base) and content are out of scope.

## Goal

Redesign the entire portfolio front end using Google's **Material 3 Expressive** system (as updated for Google I/O 2026), translated to the project's React / Next.js / Tailwind / Framer Motion stack. The look stays monochrome to match the existing minimal aesthetic, with a single Nothing-style red accent used sparingly.

## Context

- The app is a single state-driven page (`app/page.tsx`, ~735 lines) that orchestrates several views: hero/landing, AI conversation, projects/folder grid, project detail, profile/about, recruiter briefing.
- Stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind 3, Framer Motion (used in 15 files), Urbanist as the body font. MUI is installed but used in only one component (`ProjectDetailView.tsx`).
- The base is the light version `bb83df8` — the last commit before the abandoned dark "Nothing OS" monospace redesign.

## Key decisions

| Decision | Choice |
|---|---|
| Base codebase | Light worktree version (`bb83df8`) → branch `material-redesign` |
| Scope (this effort) | Full front-end redesign |
| Design system | Material 3 Expressive (I/O 2026): components, shape scale, shape-morph, physics/spring motion, new split button |
| Aesthetic | Neutral monochrome base + a single expressive accent |
| Accent color | Nothing-style red ≈ `#D71921`, used at most once per view |
| Theme | Light only |
| Typeface | Urbanist for everything; Space Mono only for tiny uppercase eyebrow labels (Nothing nod) |
| Information architecture | Unchanged — restyle visuals only |
| Homepage chrome | Chrome-free (no top app bar); minimal Material back button inside detail views |

## Approach (chosen: A — hand-built token layer)

Build a Material token layer (CSS custom properties + Tailwind theme extensions) plus a small set of Material primitives on the existing Tailwind + Framer Motion stack. No new heavy dependencies.

Rejected alternatives:
- **`@material/web`** — incomplete Expressive coverage, awkward custom-elements/SSR integration with React/Next, no shape-morph/spring.
- **MUI** (already installed) — not M3 *Expressive* (no shape-morph/spring), heavy runtime, theming clashes with Tailwind. The single existing MUI usage will be retired.

## Token system

Defined as CSS custom properties in `app/globals.css`, mirrored into `tailwind.config.ts` as utilities (`bg-surface`, `text-primary`, `rounded-shape-lg`, etc.).

**Color roles (light, monochrome + red accent):**

| Role | Value | Use |
|---|---|---|
| `surface` | `#F2F2F2` | page background |
| `surface-container` | `#EAEAEA` | cards, raised areas |
| `surface-container-high` | `#E2E2E2` | hover/elevated surfaces |
| `on-surface` | `#292A2E` | primary text/icons |
| `on-surface-variant` | `#5C5C5E` | secondary text |
| `outline` | `#C4C4C4` | borders |
| `outline-variant` | `#DCDCDC` | dividers |
| `primary` | `#D71921` | key actions, accent only |
| `on-primary` | `#FFFFFF` | text/icons on red |
| `primary-container` | `#FCE4E4` | subtle red-tinted fills |
| `on-primary-container` | `#3F0709` | text on red-tint |

Accent rule: red appears at most once per view (the single primary action, or an active/error state). Everything else is monochrome.

**Shape scale:** `none 0 · xs 4 · sm 8 · md 12 · lg 16 · xl 28 · full 9999` (px, except full). Buttons default to `full` (pill) and morph toward `md` on press.

**Type scale (Urbanist, weights 300–600):** Material roles `display-lg/md`, `headline-lg/md`, `title-lg/md`, `body-lg/md`, `label-lg/md/sm`. Eyebrow micro-labels use Space Mono uppercase.

**Motion springs (Framer Motion):**
- `spatial-default`: `{ stiffness: 380, damping: 32, mass: 1 }`
- `spatial-fast`: `{ stiffness: 520, damping: 30 }`
- `press-morph`: `{ stiffness: 600, damping: 24 }` — drives shape-morph on tap

**State layers:** hover 8% / focus 10% / press 10% overlay of `on-surface` (or `primary` on accent components).

## Component primitives

New isolated directory `components/material/`. Each primitive is self-contained (props in, styled motion component out).

**Button family (core of the I/O 2026 ask):**
- `Button` — `variant` (`elevated · filled · tonal · outlined · text`), `size` (`xs–xl`), optional `leadingIcon`/`trailingIcon`. Pill by default, morphs toward `md` radius on press via `press-morph`; hover/focus/press state layers. Only `filled` uses red `primary`; others monochrome.
- `IconButton` — round, sizes `xs–xl`, optional toggle (selected) state.
- `SplitButton` — new I/O 2026 component: primary action + attached trailing menu button that morphs/rotates on open.
- `Chip` — assist/filter pill with selected state.

**Supporting primitives:**
- `Card` — `surface-container`, shape `lg`, optional interactive state layer + spring lift.
- `TextField` — Material filled/outlined input with spring focus; hosts docked `IconButton`s.
- `Eyebrow` — Space Mono uppercase micro-label.

**Existing → Material mapping:**

| Existing | Becomes |
|---|---|
| `ChatInput` | `TextField` + docked mic/send `IconButton`s (send = the red `filled` accent) |
| quick buttons | `Chip`s (or `Button` text variant) |
| `FolderCard` / `ProjectCard` | `Card` |
| `ProfileCard` / `RecruiterBriefing` | `Card`-based layouts |
| `ProjectDetailView` | Material layout — retire MUI usage |
| `Navigation` | minimal (no top app bar on home) |

## Page-by-page application

1. **Hero / landing** (chrome-free, centered): `display-md` headline; Space Mono `Eyebrow`; quick actions as `Chip`s; chat box as Material `TextField` with docked mic + red `filled` send `IconButton`.
2. **Conversation view**: messages in `surface-container` bubbles (shape `lg`), markdown styled to the type scale, spring entrance, spring thinking-dots.
3. **Projects / folder view**: cards as interactive `Card`s with state-layer hover + spring lift; red only on active/selected indicator.
4. **Project detail**: rebuilt on Material layout (drops MUI) — `Card` hero, `Eyebrow` section labels, type-scale body, image blocks shape `lg`, small Material back `IconButton`.
5. **About / Profile**: `ProfileCard` as Material `Card` — avatar, `headline` name, links as `outlined`/`text` `Button`s + social `IconButton`s.
6. **Recruiter briefing**: `Card`-based summary; key CTA as the single red `filled` `Button`.

## Build sequence

- **Phase 0 — Setup:** move the `/tmp` worktree to a stable location (e.g., `~/portfolio_material`); confirm dev server runs.
- **Phase 1 — Tokens:** add color/shape/type/motion/state tokens to `globals.css` + `tailwind.config.ts`; verify existing page renders unchanged.
- **Phase 2 — Button family:** build `Button`, `IconButton`, `SplitButton`, `Chip` with shape-morph + springs; add temporary `/preview` page showing every variant × size × state.
- **Phase 3 — Supporting primitives:** `Card`, `TextField`, `Eyebrow`.
- **Phase 4 — Hero + chat:** apply primitives to homepage.
- **Phase 5 — Conversation + project/folder cards.**
- **Phase 6 — Project detail (retire MUI) + profile + recruiter briefing.**
- **Phase 7 — Polish:** motion-consistency pass, accessibility (focus rings, contrast, `prefers-reduced-motion`), remove dead/unused components, delete `/preview`.

Each phase ends with a browser check (dev server). Accent-red usage is audited per view in Phase 7.

## Accessibility

- Visible focus rings on all interactive primitives (focus state layer + outline).
- Color contrast: `on-surface` on `surface` and `on-primary` on `primary` meet WCAG AA.
- `prefers-reduced-motion` disables spring/shape-morph, falling back to instant or minimal transitions.
- Buttons/icon buttons keyboard-operable with correct roles/labels.

## Out of scope

- Backend / Gemini chat API and AI knowledge base.
- Content changes (copy, projects data).
- Dark mode (light only this effort).
- New information architecture or navigation model.
