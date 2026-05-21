# Material 3 Expressive Redesign — Plan 2: Page Application Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Plan 1 Material primitives to every page/view of the portfolio, retire the lone MUI usage, and do a final motion/accessibility polish — so the live app shows the Material 3 Expressive redesign end to end.

**Architecture:** In-place restyle of the existing single-page app (`app/page.tsx` orchestrates views) and its view components, swapping bespoke markup for the `components/material/` primitives (`Button`, `IconButton`, `Chip`, `Card`, `TextField`, `Eyebrow`, `SplitButton`) and Section-1 tokens. The chat backend logic is untouched; only presentation changes.

**Tech Stack:** Next.js 16, React 19, Tailwind 3 (Material tokens), Framer Motion (springs), Material primitives from Plan 1.

This is Plan 2 of 2. Prereq: Plan 1 foundation merged on branch `material-redesign` (tokens + primitives + `/preview`). Reference spec: `docs/superpowers/specs/2026-05-20-material-3-expressive-portfolio-redesign-design.md`.

Verification gate after each phase: `npm test` green, `npx tsc --noEmit` shows no new errors beyond the documented baseline (22 at Plan 1 end; this plan should only reduce it as MUI/legacy code is cleaned), and a browser screenshot of the affected view on `localhost:3001` with `$B console --errors` clean.

---

## Phase 4 — Hero + chat (homepage)

Targets in `app/page.tsx`: hero text (lines ~449-452), follow-up chips (~689-702), shortcut buttons (~708-727). Plus `components/ChatInput.tsx` (the floating input).

### Task 4.1: Wire Space Mono into the Tailwind mono font

**Files:**
- Modify: `tailwind.config.ts`

The `Eyebrow` uses `font-mono`; layout already loads Space Mono as `--font-space-mono`. Point Tailwind's mono stack at it.

- [ ] **Step 1:** In `tailwind.config.ts`, change the `fontFamily.mono` line to:
```ts
        mono: ["var(--font-space-mono)", "var(--font-jetbrains-mono)", "monospace"],
```
- [ ] **Step 2:** Verify dev server compiles (HTTP 200 on `/`).
- [ ] **Step 3:** Commit: `git commit -am "feat: point Tailwind mono font at Space Mono for Material eyebrow"`

### Task 4.2: Restyle the hero to Material type scale + Eyebrow

**Files:**
- Modify: `app/page.tsx` (hero block ~449-452, imports)

- [ ] **Step 1:** Add import: `import { Eyebrow } from "@/components/material/Eyebrow";`
- [ ] **Step 2:** Replace the non-started hero block (the `<div className="text-center space-y-1 mb-6">…</div>`) with:
```tsx
          <div className="text-center space-y-3 mb-6">
            <h1 className="text-4xl sm:text-5xl font-light text-on-surface tracking-tight">hi, i&apos;m minwook</h1>
            <Eyebrow>meet minwook junior</Eyebrow>
          </div>
```
- [ ] **Step 3:** Replace the started-state reset button `className` (the `text-2xl font-light text-gray-900 …`) with token colors: `text-2xl font-light text-on-surface hover:text-on-surface-variant transition-colors lowercase`.
- [ ] **Step 4:** Browser-verify the hero renders with the mono eyebrow; screenshot; console clean.
- [ ] **Step 5:** Commit: `git commit -am "feat: restyle homepage hero with Material type scale + eyebrow"`

### Task 4.3: Replace shortcut + follow-up buttons with Chip

**Files:**
- Modify: `app/page.tsx` (shortcut buttons ~708-727, follow-up chips ~689-702, imports)

- [ ] **Step 1:** Add import: `import { Chip } from "@/components/material/Chip";`
- [ ] **Step 2:** Replace the two shortcut `motion.button`s (projects / about me) with:
```tsx
            <Chip leadingIcon={<FolderOpen className="w-3.5 h-3.5" />} onClick={() => handleMessage("projects")}>
              projects
            </Chip>
            <Chip leadingIcon={<User className="w-3.5 h-3.5" />} onClick={() => handleMessage("about minwook")}>
              about me
            </Chip>
```
- [ ] **Step 3:** Replace the follow-up `motion.button` (inside the `followUpChips.map`) with `<Chip key={chip} onClick={() => handleMessage(chip)}>{chip}</Chip>`.
- [ ] **Step 4:** Browser-verify chips render and clicking "projects" still triggers the projects flow; screenshot; console clean.
- [ ] **Step 5:** Commit: `git commit -am "feat: replace homepage shortcut and follow-up buttons with Material Chips"`

### Task 4.4: Rebuild ChatInput on the Material TextField + IconButtons

**Files:**
- Modify: `components/ChatInput.tsx`

Keep all behavior (speech recognition, submit, theme store usage may be dropped if it only affected border color). Replace the input island + right-side buttons with `TextField` + `IconButton`s.

- [ ] **Step 1:** Add imports: `import { TextField } from "@/components/material/TextField";` and `import { IconButton } from "@/components/material/IconButton";` (keep `Mic`; replace `ArrowRight` with `Send` from lucide if preferred — keep `ArrowRight` is fine).
- [ ] **Step 2:** Replace the `<div className="relative bg-white …rounded-3xl">…</div>` input island and the absolute right-side buttons with:
```tsx
            <TextField
              value={input}
              onChange={setInput}
              onSubmit={() => handleSubmit()}
              placeholder="What projects have you built?"
              trailing={
                <>
                  <IconButton
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                    selected={isListening}
                    size="sm"
                    onClick={toggleListening}
                  >
                    <Mic className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    aria-label="Send"
                    size="sm"
                    selected={!!input.trim()}
                    disabled={!input.trim()}
                    onClick={() => handleSubmit()}
                  >
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </IconButton>
                </>
              }
            />
```
- [ ] **Step 3:** Change `handleSubmit` to tolerate no-arg calls: signature `const handleSubmit = (e?: React.FormEvent) => { e?.preventDefault(); … }`. Remove the now-unused `<form>`/`handleKeyDown` wrapper if `TextField`'s `onSubmit` (Enter) covers it; keep the outer `motion.div` positioning wrapper.
- [ ] **Step 4:** Remove now-dead theme-store border helpers (`getBorderStyle`, `getInlineBorderStyle`, `activeThemeColor`) if unused after the swap.
- [ ] **Step 5:** Browser-verify: typing enables the red send button, Enter submits, mic toggles selected state; screenshot; console clean.
- [ ] **Step 6:** Commit: `git commit -am "feat: rebuild ChatInput on Material TextField + IconButtons"`

---

## Phase 5 — Conversation view + project/folder cards

### Task 5.1: Restyle chat message bubbles with tokens

**Files:**
- Modify: `app/page.tsx` (message bubble block ~483-511)

- [ ] **Step 1:** Replace bubble color classes: user `bg-[#292A2E] text-white` → `bg-on-surface text-surface`; assistant `bg-white text-[#292A2E] border border-gray-200` → `bg-surface-container text-on-surface`. Change `rounded-2xl` → `rounded-shape-lg`.
- [ ] **Step 2:** Update the message entrance transition to the shared spring: replace the inline `transition={{ duration: 0.5, ease: appleEasing, delay: index * 0.05 }}` with `transition={{ ...springs.spatialDefault, delay: index * 0.05 }}` (add `import { springs } from "@/lib/material/motion";`).
- [ ] **Step 3:** Browser-verify a sent message shows token-colored bubbles with spring entrance; screenshot; console clean.
- [ ] **Step 4:** Commit: `git commit -am "feat: restyle chat bubbles with Material tokens + spring entrance"`

### Task 5.2: Restyle FolderCard as a Material Card

**Files:**
- Modify: `components/FolderCard.tsx`

- [ ] **Step 1:** Read the file to find the card container markup and click handler.
- [ ] **Step 2:** Wrap each folder item in the `Card` primitive (`interactive`, `onClick`), or replace its outer container classes with the Card token set (`bg-surface-container text-on-surface rounded-shape-lg`, state-layer hover). Keep the 2x2 grid layout. Use accent red only on the active/selected indicator.
- [ ] **Step 3:** Browser-verify the projects folder view renders as Material cards that lift on hover; screenshot; console clean.
- [ ] **Step 4:** Commit: `git commit -am "feat: restyle FolderCard with Material Card tokens"`

---

## Phase 6 — Project detail (retire MUI) + profile + recruiter briefing

### Task 6.1: Retire MUI from ProjectDetailView

**Files:**
- Modify: `components/ProjectDetailView.tsx`

- [ ] **Step 1:** Read the file; locate the `@mui`/`@emotion` imports and usages.
- [ ] **Step 2:** Replace MUI components with Tailwind/token equivalents (e.g., MUI `Button`/`Box`/`Typography` → Material `Button`/`Card` primitives or plain token-styled elements). Keep layout and content identical.
- [ ] **Step 3:** Verify no `@mui`/`@emotion` import remains: `grep -rn "@mui\|@emotion" components/ProjectDetailView.tsx` returns nothing.
- [ ] **Step 4:** Browser-verify a project detail view renders correctly; screenshot; console clean.
- [ ] **Step 5:** Commit: `git commit -am "refactor: retire MUI from ProjectDetailView, use Material tokens"`

### Task 6.2: Restyle ProfileCard + RecruiterBriefing

**Files:**
- Modify: `components/ProfileCard.tsx`, `components/RecruiterBriefing.tsx`

- [ ] **Step 1:** Read both files.
- [ ] **Step 2:** Wrap their main surfaces in `Card`; convert action links to `Button` (`outlined`/`text`) and social links to `IconButton`; section labels to `Eyebrow`. RecruiterBriefing's primary CTA = the single red `filled` `Button`.
- [ ] **Step 3:** Browser-verify the about/profile view and recruiter briefing; screenshots; console clean.
- [ ] **Step 4:** Commit: `git commit -am "feat: restyle ProfileCard and RecruiterBriefing with Material primitives"`

### Task 6.3: Remove the lingering MUI dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1:** Confirm no source imports `@mui` or `@emotion`: `grep -rn "@mui\|@emotion" app components lib | grep -v node_modules` returns nothing.
- [ ] **Step 2:** Remove `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` from `package.json` dependencies; run `npm install`.
- [ ] **Step 3:** Verify build still compiles (dev server HTTP 200; `npm test` green).
- [ ] **Step 4:** Commit: `git commit -am "chore: drop unused MUI/emotion dependencies"`

---

## Phase 7 — Polish

### Task 7.1: Motion + token consistency sweep

**Files:**
- Modify: `app/page.tsx` and any remaining view components using ad-hoc easings/hex colors.

- [ ] **Step 1:** Grep for leftover legacy values: `grep -rn "#292A2E\|#F2F2F2\|appleEasing\|appleSpring\|bg-gray-\|text-gray-" app/page.tsx components --include="*.tsx" | grep -v node_modules`.
- [ ] **Step 2:** Replace remaining hardcoded hexes with tokens and ad-hoc easings with `springs.*` where they belong to redesigned surfaces. Leave chat-logic code untouched.
- [ ] **Step 3:** Browser-verify the whole flow (home → ask → projects → detail → about); screenshots; console clean.
- [ ] **Step 4:** Commit: `git commit -am "refactor: token + motion consistency sweep"`

### Task 7.2: Accessibility pass

**Files:**
- Modify: as needed across redesigned views.

- [ ] **Step 1:** Verify focus-visible rings appear on all interactive primitives (already built in; confirm not overridden).
- [ ] **Step 2:** Confirm `prefers-reduced-motion` disables spring/morph: temporarily emulate via `$B js "matchMedia('(prefers-reduced-motion: reduce)').matches"` after setting the CDP emulation, or review that every animated primitive guards with `useReducedMotion()` (Plan 1 ensured this; verify page-level motion.divs degrade acceptably).
- [ ] **Step 3:** Check contrast: `on-surface` (#292a2e) on `surface` (#f2f2f2) and `on-primary` (#fff) on `primary` (#d71921) — both meet WCAG AA (document the ratios in the commit body).
- [ ] **Step 4:** Commit: `git commit -am "a11y: verify focus, reduced-motion, and contrast across redesign"`

### Task 7.3: Remove the /preview page

**Files:**
- Delete: `app/preview/page.tsx`

- [ ] **Step 1:** `git rm app/preview/page.tsx`.
- [ ] **Step 2:** Confirm `npm test` still green (primitive tests live in `components/material/__tests__`, not the preview).
- [ ] **Step 3:** Commit: `git commit -m "chore: remove temporary /preview gallery"`

### Task 7.4: Final full verification

- [ ] **Step 1:** `npm test` — all primitive tests pass.
- [ ] **Step 2:** `npx tsc --noEmit` — no new errors beyond baseline (ideally fewer after MUI removal).
- [ ] **Step 3:** `npx next build` — production build succeeds.
- [ ] **Step 4:** Full browser walkthrough with screenshots of every view; `$B console --errors` clean on each.

---

## Self-Review notes

- **Spec coverage:** hero/chat (4.1-4.4), conversation + folder cards (5.1-5.2), project detail/MUI retire + profile + recruiter (6.1-6.3), polish/a11y/cleanup (7.1-7.4). Maps to spec §"Page-by-page application" and §"Build sequence" Phases 4-7.
- **Accent rule** (red ≤ once per view): enforced in 5.1 (send/active only), 5.2 (active card indicator), 6.2 (recruiter CTA). Audited in 7.1.
- **In-place edits:** several tasks ("Read the file, locate markup") require reading the current component before editing because exact line numbers will have shifted; this is intentional for the larger view components rather than pre-pasting hundreds of lines.
- **Behavior preservation:** chat logic, speech recognition, and projects/about routing must keep working — verified live after 4.3, 4.4, 5.1.
