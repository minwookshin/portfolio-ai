# Material 3 Expressive Redesign — Plan 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Material 3 Expressive design-system foundation — token layer plus the button family and supporting primitives — verifiable on a `/preview` page, on the `material-redesign` branch.

**Architecture:** Hand-built token layer (CSS custom properties in `globals.css` + Tailwind theme extensions + a Framer Motion spring module), then isolated primitives in `components/material/`. Components expose a testable contract via `data-variant`/`data-size`/role attributes; Tailwind classes are chosen from lookup maps keyed by those props. Shape-morph and state layers use Framer Motion springs.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3, Framer Motion, Vitest + React Testing Library (added in Phase 0).

This is Plan 1 of 2. Plan 2 (applying primitives to pages, Phases 4–7) is written after Plan 1 is executed and visually verified. Reference spec: `docs/superpowers/specs/2026-05-20-material-3-expressive-portfolio-redesign-design.md`.

---

## File Structure

**Phase 0 — Setup**
- Move: worktree `/tmp/portfolio_live` → `~/portfolio_material`
- Create: `vitest.config.ts` — test runner config
- Create: `vitest.setup.ts` — RTL/jest-dom setup
- Modify: `package.json` — devDeps + `test` script

**Phase 1 — Tokens**
- Modify: `app/globals.css` — color/shape/state CSS variables
- Modify: `tailwind.config.ts` — map variables to utilities
- Create: `lib/material/motion.ts` — spring transition tokens

**Phase 2 — Button family**
- Create: `components/material/Button.tsx`, `IconButton.tsx`, `SplitButton.tsx`, `Chip.tsx`
- Create: tests alongside in `components/material/__tests__/`
- Create: `app/preview/page.tsx` — visual gallery

**Phase 3 — Supporting primitives**
- Create: `components/material/Card.tsx`, `TextField.tsx`, `Eyebrow.tsx`
- Create: tests in `components/material/__tests__/`
- Modify: `app/preview/page.tsx` — add new primitives

---

## Phase 0 — Setup

### Task 0.1: Move worktree out of /tmp

**Files:** none (git/filesystem operation)

- [ ] **Step 1: Move the worktree**

Run:
```bash
git -C /Users/minwook/portfolio_ai worktree move /tmp/portfolio_live /Users/minwook/portfolio_material
```
Expected: no output, exit 0.

- [ ] **Step 2: Verify**

Run:
```bash
git -C /Users/minwook/portfolio_ai worktree list
```
Expected: a line showing `/Users/minwook/portfolio_material  <sha> [material-redesign]`.

- [ ] **Step 3: Reinstall node_modules in the new path**

The previous `node_modules` was an APFS clone tied to the old path; reinstall to be safe.
Run:
```bash
cd /Users/minwook/portfolio_material && npm install
```
Expected: completes with no errors. From here, all paths in this plan are relative to `/Users/minwook/portfolio_material`.

- [ ] **Step 4: Confirm dev server boots**

Run:
```bash
cd /Users/minwook/portfolio_material && (npx next dev -p 3001 &) && sleep 6 && curl -s http://localhost:3001 | grep -o 'meet minwook junior' && pkill -f "next dev -p 3001"
```
Expected: prints `meet minwook junior`.

### Task 0.2: Add Vitest + React Testing Library

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
cd /Users/minwook/portfolio_material && npm install -D vitest@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14 jsdom@^25 @vitejs/plugin-react@^4
```
Expected: installs without error.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

// Framer Motion + jsdom: stub matchMedia (used by useReducedMotion)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

- [ ] **Step 4: Add the `test` script to `package.json`**

In the `"scripts"` block, add:
```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 5: Create a smoke test to confirm the runner works**

Create `vitest.smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("vitest", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run it**

Run:
```bash
cd /Users/minwook/portfolio_material && npm test
```
Expected: 1 passing test.

- [ ] **Step 7: Delete the smoke test and commit**

```bash
cd /Users/minwook/portfolio_material && rm vitest.smoke.test.ts
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "chore: add Vitest + React Testing Library"
```

---

## Phase 1 — Tokens

### Task 1.1: Add color, shape, and state CSS variables

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append token variables to `app/globals.css`**

Add at the end of the file:
```css
/* Material 3 Expressive tokens — monochrome + Nothing-red accent (light) */
:root {
  --md-surface: #f2f2f2;
  --md-surface-container: #eaeaea;
  --md-surface-container-high: #e2e2e2;
  --md-on-surface: #292a2e;
  --md-on-surface-variant: #5c5c5e;
  --md-outline: #c4c4c4;
  --md-outline-variant: #dcdcdc;
  --md-primary: #d71921;
  --md-on-primary: #ffffff;
  --md-primary-container: #fce4e4;
  --md-on-primary-container: #3f0709;

  /* shape scale (px) */
  --md-shape-xs: 4px;
  --md-shape-sm: 8px;
  --md-shape-md: 12px;
  --md-shape-lg: 16px;
  --md-shape-xl: 28px;
  --md-shape-full: 9999px;

  /* state layer opacities */
  --md-state-hover: 0.08;
  --md-state-focus: 0.10;
  --md-state-press: 0.10;
}
```

- [ ] **Step 2: Verify the file still parses (dev server compiles)**

Run:
```bash
cd /Users/minwook/portfolio_material && (npx next dev -p 3001 &) && sleep 6 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001 && pkill -f "next dev -p 3001"
```
Expected: `200`.

### Task 1.2: Map tokens to Tailwind utilities

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Read the current config to find the `theme.extend` block**

Run:
```bash
cd /Users/minwook/portfolio_material && cat tailwind.config.ts
```
Expected: shows the config with a `theme: { extend: { ... } }` object.

- [ ] **Step 2: Add token mappings inside `theme.extend`**

Merge these keys into the existing `extend` object (keep any existing keys):
```ts
      colors: {
        surface: "var(--md-surface)",
        "surface-container": "var(--md-surface-container)",
        "surface-container-high": "var(--md-surface-container-high)",
        "on-surface": "var(--md-on-surface)",
        "on-surface-variant": "var(--md-on-surface-variant)",
        outline: "var(--md-outline)",
        "outline-variant": "var(--md-outline-variant)",
        primary: "var(--md-primary)",
        "on-primary": "var(--md-on-primary)",
        "primary-container": "var(--md-primary-container)",
        "on-primary-container": "var(--md-on-primary-container)",
      },
      borderRadius: {
        "shape-xs": "var(--md-shape-xs)",
        "shape-sm": "var(--md-shape-sm)",
        "shape-md": "var(--md-shape-md)",
        "shape-lg": "var(--md-shape-lg)",
        "shape-xl": "var(--md-shape-xl)",
        "shape-full": "var(--md-shape-full)",
      },
```

- [ ] **Step 3: Verify Tailwind compiles a token utility**

Run:
```bash
cd /Users/minwook/portfolio_material && (npx next dev -p 3001 &) && sleep 6 && curl -s "http://localhost:3001" -o /dev/null -w "%{http_code}\n" && pkill -f "next dev -p 3001"
```
Expected: `200` (no Tailwind config error in startup).

- [ ] **Step 4: Commit**

```bash
cd /Users/minwook/portfolio_material && git add app/globals.css tailwind.config.ts
git commit -m "feat: add Material 3 Expressive color/shape/state tokens"
```

### Task 1.3: Add Framer Motion spring tokens

**Files:**
- Create: `lib/material/motion.ts`
- Test: `lib/material/__tests__/motion.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/material/__tests__/motion.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { springs } from "@/lib/material/motion";

describe("springs", () => {
  it("exposes the three expressive spring tokens with type spring", () => {
    expect(springs.spatialDefault).toEqual({ type: "spring", stiffness: 380, damping: 32, mass: 1 });
    expect(springs.spatialFast).toEqual({ type: "spring", stiffness: 520, damping: 30 });
    expect(springs.pressMorph).toEqual({ type: "spring", stiffness: 600, damping: 24 });
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run lib/material/__tests__/motion.test.ts
```
Expected: FAIL — cannot resolve `@/lib/material/motion`.

- [ ] **Step 3: Create `lib/material/motion.ts`**

```ts
import type { Transition } from "framer-motion";

export const springs = {
  spatialDefault: { type: "spring", stiffness: 380, damping: 32, mass: 1 },
  spatialFast: { type: "spring", stiffness: 520, damping: 30 },
  pressMorph: { type: "spring", stiffness: 600, damping: 24 },
} satisfies Record<string, Transition>;
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run lib/material/__tests__/motion.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add lib/material/motion.ts lib/material/__tests__/motion.test.ts
git commit -m "feat: add Material expressive spring motion tokens"
```

---

## Phase 2 — Button family

### Task 2.1: Button

**Files:**
- Create: `components/material/Button.tsx`
- Test: `components/material/__tests__/Button.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/material/__tests__/Button.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/material/Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("defaults to filled variant and md size via data attributes", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveAttribute("data-variant", "filled");
    expect(btn).toHaveAttribute("data-size", "md");
  });

  it("reflects variant and size props", () => {
    render(<Button variant="outlined" size="xl">Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveAttribute("data-variant", "outlined");
    expect(btn).toHaveAttribute("data-size", "xl");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/Button.test.tsx
```
Expected: FAIL — cannot resolve `@/components/material/Button`.

- [ ] **Step 3: Create `components/material/Button.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { springs } from "@/lib/material/motion";

export type ButtonVariant = "elevated" | "filled" | "tonal" | "outlined" | "text";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  elevated: "bg-surface-container-high text-on-surface shadow-md hover:shadow-lg",
  filled: "bg-primary text-on-primary",
  tonal: "bg-primary-container text-on-primary-container",
  outlined: "bg-transparent text-on-surface border border-outline",
  text: "bg-transparent text-on-surface",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-7 px-3 text-xs gap-1.5",
  sm: "h-9 px-4 text-sm gap-2",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  xl: "h-16 px-8 text-lg gap-3",
};

export function Button({
  variant = "filled",
  size = "md",
  leadingIcon,
  trailingIcon,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      onClick={onClick}
      aria-label={rest["aria-label"]}
      initial={false}
      animate={{ borderRadius: 9999 }}
      whileTap={reduce || disabled ? undefined : { borderRadius: 12, scale: 0.97 }}
      transition={springs.pressMorph}
      className={[
        "relative inline-flex items-center justify-center font-medium select-none",
        "transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:opacity-40 disabled:pointer-events-none",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0 hover:before:opacity-[0.08] active:before:opacity-[0.10] before:transition-opacity",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {leadingIcon && <span className="relative z-10 inline-flex">{leadingIcon}</span>}
      <span className="relative z-10">{children}</span>
      {trailingIcon && <span className="relative z-10 inline-flex">{trailingIcon}</span>}
    </motion.button>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/Button.test.tsx
```
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add components/material/Button.tsx components/material/__tests__/Button.test.tsx
git commit -m "feat: add Material Button primitive with shape-morph"
```

### Task 2.2: IconButton

**Files:**
- Create: `components/material/IconButton.tsx`
- Test: `components/material/__tests__/IconButton.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/material/__tests__/IconButton.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "@/components/material/IconButton";

describe("IconButton", () => {
  it("requires and exposes an accessible label", () => {
    render(<IconButton aria-label="Send"><span>icon</span></IconButton>);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("reflects size and selected state", () => {
    render(<IconButton aria-label="Mic" size="lg" selected><span>icon</span></IconButton>);
    const btn = screen.getByRole("button", { name: "Mic" });
    expect(btn).toHaveAttribute("data-size", "lg");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onClick when enabled", async () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="Send" onClick={onClick}><span>icon</span></IconButton>);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/IconButton.test.tsx
```
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Create `components/material/IconButton.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { springs } from "@/lib/material/motion";
import type { ButtonSize } from "@/components/material/Button";

export interface IconButtonProps {
  "aria-label": string;
  size?: ButtonSize;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-7 w-7",
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
};

export function IconButton({
  size = "md",
  selected = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  children,
  ...rest
}: IconButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      aria-label={rest["aria-label"]}
      aria-pressed={selected}
      data-size={size}
      disabled={disabled}
      onClick={onClick}
      initial={false}
      animate={{ borderRadius: selected ? 12 : 9999 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.92 }}
      transition={springs.pressMorph}
      className={[
        "relative inline-flex items-center justify-center outline-none",
        "transition-colors",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:opacity-40 disabled:pointer-events-none",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0 hover:before:opacity-[0.08] active:before:opacity-[0.10] before:transition-opacity",
        selected ? "bg-primary text-on-primary" : "bg-transparent text-on-surface",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      <span className="relative z-10 inline-flex">{children}</span>
    </motion.button>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/IconButton.test.tsx
```
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add components/material/IconButton.tsx components/material/__tests__/IconButton.test.tsx
git commit -m "feat: add Material IconButton primitive"
```

### Task 2.3: Chip

**Files:**
- Create: `components/material/Chip.tsx`
- Test: `components/material/__tests__/Chip.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/material/__tests__/Chip.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chip } from "@/components/material/Chip";

describe("Chip", () => {
  it("renders label and is a button", () => {
    render(<Chip>Projects</Chip>);
    expect(screen.getByRole("button", { name: "Projects" })).toBeInTheDocument();
  });

  it("reflects selected state via aria-pressed", () => {
    render(<Chip selected>Projects</Chip>);
    expect(screen.getByRole("button", { name: "Projects" })).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Projects</Chip>);
    await userEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/Chip.test.tsx
```
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Create `components/material/Chip.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { springs } from "@/lib/material/motion";

export interface ChipProps {
  selected?: boolean;
  leadingIcon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

export function Chip({
  selected = false,
  leadingIcon,
  disabled = false,
  onClick,
  className = "",
  children,
}: ChipProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      data-selected={selected}
      disabled={disabled}
      onClick={onClick}
      initial={false}
      whileTap={reduce || disabled ? undefined : { scale: 0.95 }}
      transition={springs.spatialFast}
      className={[
        "relative inline-flex items-center gap-2 h-9 px-4 rounded-shape-sm text-sm font-medium outline-none",
        "transition-colors",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:opacity-40 disabled:pointer-events-none",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0 hover:before:opacity-[0.08] active:before:opacity-[0.10] before:transition-opacity",
        selected
          ? "bg-primary-container text-on-primary-container border border-transparent"
          : "bg-transparent text-on-surface border border-outline",
        className,
      ].join(" ")}
    >
      {leadingIcon && <span className="relative z-10 inline-flex">{leadingIcon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/Chip.test.tsx
```
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add components/material/Chip.tsx components/material/__tests__/Chip.test.tsx
git commit -m "feat: add Material Chip primitive"
```

### Task 2.4: SplitButton

**Files:**
- Create: `components/material/SplitButton.tsx`
- Test: `components/material/__tests__/SplitButton.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/material/__tests__/SplitButton.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SplitButton } from "@/components/material/SplitButton";

describe("SplitButton", () => {
  const menu = [
    { label: "Option A", onSelect: vi.fn() },
    { label: "Option B", onSelect: vi.fn() },
  ];

  it("renders the primary action and a menu trigger", () => {
    render(<SplitButton label="Save" onClick={vi.fn()} menuItems={menu} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More options" })).toBeInTheDocument();
  });

  it("fires the primary onClick", async () => {
    const onClick = vi.fn();
    render(<SplitButton label="Save" onClick={onClick} menuItems={menu} />);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles the menu and selects an item", async () => {
    const items = [{ label: "Option A", onSelect: vi.fn() }];
    render(<SplitButton label="Save" onClick={vi.fn()} menuItems={items} />);
    await userEvent.click(screen.getByRole("button", { name: "More options" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Option A" }));
    expect(items[0].onSelect).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/SplitButton.test.tsx
```
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Create `components/material/SplitButton.tsx`**

```tsx
"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { springs } from "@/lib/material/motion";

export interface SplitButtonMenuItem {
  label: string;
  onSelect: () => void;
}

export interface SplitButtonProps {
  label: string;
  onClick: () => void;
  menuItems: SplitButtonMenuItem[];
  className?: string;
}

export function SplitButton({ label, onClick, menuItems, className = "" }: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className={["relative inline-flex items-stretch gap-px", className].join(" ")}>
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={springs.pressMorph}
        className="relative inline-flex items-center h-10 px-5 text-sm font-medium bg-primary text-on-primary rounded-l-shape-full rounded-r-shape-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {label}
      </motion.button>
      <motion.button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        animate={reduce ? undefined : { rotate: open ? 180 : 0, borderRadius: open ? 12 : undefined }}
        transition={springs.pressMorph}
        className="inline-flex items-center justify-center h-10 w-10 bg-primary text-on-primary rounded-r-shape-full rounded-l-shape-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={springs.spatialFast}
            className="absolute top-full right-0 mt-2 min-w-[10rem] bg-surface-container-high text-on-surface rounded-shape-md shadow-lg overflow-hidden z-20"
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onSelect();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container outline-none focus-visible:bg-surface-container"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/SplitButton.test.tsx
```
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add components/material/SplitButton.tsx components/material/__tests__/SplitButton.test.tsx
git commit -m "feat: add Material SplitButton primitive (I/O 2026 component)"
```

### Task 2.5: Preview page for buttons

**Files:**
- Create: `app/preview/page.tsx`

- [ ] **Step 1: Create `app/preview/page.tsx`**

```tsx
"use client";

import { Button, ButtonVariant, ButtonSize } from "@/components/material/Button";
import { IconButton } from "@/components/material/IconButton";
import { Chip } from "@/components/material/Chip";
import { SplitButton } from "@/components/material/SplitButton";
import { Mic } from "lucide-react";

const variants: ButtonVariant[] = ["elevated", "filled", "tonal", "outlined", "text"];
const sizes: ButtonSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-surface text-on-surface p-12 space-y-12">
      <section className="space-y-4">
        <h2 className="text-2xl font-light">Buttons — variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          {variants.map((v) => (
            <Button key={v} variant={v}>{v}</Button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-light">Buttons — sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          {sizes.map((s) => (
            <Button key={s} size={s}>{s}</Button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-light">Icon buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <IconButton aria-label="Mic"><Mic className="w-5 h-5" /></IconButton>
          <IconButton aria-label="Mic selected" selected><Mic className="w-5 h-5" /></IconButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-light">Chips</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Chip>Projects</Chip>
          <Chip selected>About me</Chip>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-light">Split button</h2>
        <SplitButton
          label="Save"
          onClick={() => {}}
          menuItems={[
            { label: "Save as draft", onSelect: () => {} },
            { label: "Save and publish", onSelect: () => {} },
          ]}
        />
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify the preview renders in the browser**

Run:
```bash
cd /Users/minwook/portfolio_material && (npx next dev -p 3001 &) && sleep 6 && curl -s "http://localhost:3001/preview" | grep -o 'Buttons — variants' && pkill -f "next dev -p 3001"
```
Expected: prints `Buttons — variants`. Then open http://localhost:3001/preview in a browser and confirm: press a filled button and watch the pill morph to a rounded-rectangle with a spring bounce; chips and icon buttons show hover state layers; the split-button menu opens with a spring.

- [ ] **Step 3: Commit**

```bash
cd /Users/minwook/portfolio_material && git add app/preview/page.tsx
git commit -m "feat: add /preview gallery for Material button family"
```

---

## Phase 3 — Supporting primitives

### Task 3.1: Eyebrow

**Files:**
- Create: `components/material/Eyebrow.tsx`
- Test: `components/material/__tests__/Eyebrow.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/material/__tests__/Eyebrow.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "@/components/material/Eyebrow";

describe("Eyebrow", () => {
  it("renders uppercased label text content", () => {
    render(<Eyebrow>meet minwook junior</Eyebrow>);
    // text is uppercased via CSS; the DOM text stays as provided
    expect(screen.getByText("meet minwook junior")).toBeInTheDocument();
  });

  it("applies the space-mono font family class", () => {
    render(<Eyebrow>label</Eyebrow>);
    expect(screen.getByText("label").className).toContain("font-mono");
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/Eyebrow.test.tsx
```
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Create `components/material/Eyebrow.tsx`**

```tsx
import { ReactNode } from "react";

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={[
        "font-mono uppercase tracking-[0.2em] text-xs text-on-surface-variant",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
```

Note: `font-mono` resolves to Space Mono once Plan 2 wires `--font-space-mono` into the Tailwind `fontFamily.mono`; until then it falls back to the system monospace, which is fine for the preview.

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/Eyebrow.test.tsx
```
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add components/material/Eyebrow.tsx components/material/__tests__/Eyebrow.test.tsx
git commit -m "feat: add Material Eyebrow label primitive"
```

### Task 3.2: Card

**Files:**
- Create: `components/material/Card.tsx`
- Test: `components/material/__tests__/Card.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/material/__tests__/Card.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "@/components/material/Card";

describe("Card", () => {
  it("renders children as a non-interactive region by default", () => {
    render(<Card>Body</Card>);
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("becomes a button and fires onClick when interactive", async () => {
    const onClick = vi.fn();
    render(<Card interactive onClick={onClick}>Body</Card>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/Card.test.tsx
```
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Create `components/material/Card.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { springs } from "@/lib/material/motion";

export interface CardProps {
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

export function Card({ interactive = false, onClick, className = "", children, ...rest }: CardProps) {
  const reduce = useReducedMotion();
  const base = "bg-surface-container text-on-surface rounded-shape-lg p-6";

  if (!interactive) {
    return <div className={[base, className].join(" ")}>{children}</div>;
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={rest["aria-label"]}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={springs.spatialDefault}
      className={[
        base,
        "relative w-full text-left outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-on-surface before:opacity-0 hover:before:opacity-[0.04] active:before:opacity-[0.08] before:transition-opacity",
        className,
      ].join(" ")}
    >
      <span className="relative z-10 block">{children}</span>
    </motion.button>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/Card.test.tsx
```
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add components/material/Card.tsx components/material/__tests__/Card.test.tsx
git commit -m "feat: add Material Card primitive"
```

### Task 3.3: TextField

**Files:**
- Create: `components/material/TextField.tsx`
- Test: `components/material/__tests__/TextField.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/material/__tests__/TextField.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "@/components/material/TextField";

describe("TextField", () => {
  it("renders an input with the given placeholder and value", () => {
    render(<TextField value="hello" onChange={() => {}} placeholder="Ask me" />);
    const input = screen.getByPlaceholderText("Ask me") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("hello");
  });

  it("calls onChange with typed text", async () => {
    const onChange = vi.fn();
    render(<TextField value="" onChange={onChange} placeholder="Ask me" />);
    await userEvent.type(screen.getByPlaceholderText("Ask me"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("renders trailing slot content", () => {
    render(
      <TextField value="" onChange={() => {}} placeholder="Ask me" trailing={<span>send</span>} />
    );
    expect(screen.getByText("send")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/TextField.test.tsx
```
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Create `components/material/TextField.tsx`**

```tsx
"use client";

import { ReactNode, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/material/motion";

export interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  trailing?: ReactNode;
  leading?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function TextField({
  value,
  onChange,
  placeholder,
  onSubmit,
  trailing,
  leading,
  className = "",
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { scale: focused ? 1.01 : 1 }}
      transition={springs.spatialFast}
      className={[
        "flex items-center gap-2 w-full bg-surface-container rounded-shape-full px-4 h-14",
        "border transition-colors",
        focused ? "border-primary" : "border-transparent",
        className,
      ].join(" ")}
    >
      {leading && <span className="inline-flex shrink-0">{leading}</span>}
      <input
        aria-label={rest["aria-label"] ?? placeholder}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant text-base"
      />
      {trailing && <span className="inline-flex shrink-0 items-center gap-1">{trailing}</span>}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
cd /Users/minwook/portfolio_material && npx vitest run components/material/__tests__/TextField.test.tsx
```
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add components/material/TextField.tsx components/material/__tests__/TextField.test.tsx
git commit -m "feat: add Material TextField primitive"
```

### Task 3.4: Add supporting primitives to the preview page

**Files:**
- Modify: `app/preview/page.tsx`

- [ ] **Step 1: Add imports at the top of `app/preview/page.tsx`**

Add to the existing import block (note: `IconButton` is already imported from Task 2.5 — do not duplicate it):
```tsx
import { Card } from "@/components/material/Card";
import { TextField } from "@/components/material/TextField";
import { Eyebrow } from "@/components/material/Eyebrow";
import { useState } from "react";
import { Send } from "lucide-react";
```

- [ ] **Step 2: Convert the component to hold input state**

Change the function signature line `export default function PreviewPage() {` to:
```tsx
export default function PreviewPage() {
  const [q, setQ] = useState("");
```

- [ ] **Step 3: Add new sections before the closing `</main>`**

Insert before `</main>`:
```tsx
      <section className="space-y-4">
        <Eyebrow>meet minwook junior</Eyebrow>
        <h2 className="text-2xl font-light">Cards</h2>
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          <Card>Static card</Card>
          <Card interactive onClick={() => {}} aria-label="Interactive card">Interactive card</Card>
        </div>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="text-2xl font-light">Text field</h2>
        <TextField
          value={q}
          onChange={setQ}
          placeholder="What projects have you built?"
          trailing={
            <IconButton aria-label="Send" size="sm">
              <Send className="w-4 h-4" />
            </IconButton>
          }
        />
      </section>
```

- [ ] **Step 4: Verify the preview renders all primitives**

Run:
```bash
cd /Users/minwook/portfolio_material && (npx next dev -p 3001 &) && sleep 6 && curl -s "http://localhost:3001/preview" | grep -o 'Text field' && pkill -f "next dev -p 3001"
```
Expected: prints `Text field`. Open http://localhost:3001/preview and confirm cards lift on hover, the interactive card shows a state layer, and the text field springs slightly and shows a red border on focus.

- [ ] **Step 5: Commit**

```bash
cd /Users/minwook/portfolio_material && git add app/preview/page.tsx
git commit -m "feat: add cards, text field, and eyebrow to /preview"
```

### Task 3.5: Full test + lint pass

**Files:** none

- [ ] **Step 1: Run the whole test suite**

Run:
```bash
cd /Users/minwook/portfolio_material && npm test
```
Expected: all tests pass (Button 5, IconButton 3, Chip 3, SplitButton 3, Card 2, TextField 3, Eyebrow 2, motion 1 = 22).

- [ ] **Step 2: Type-check the build compiles**

Run:
```bash
cd /Users/minwook/portfolio_material && npx tsc --noEmit
```
Expected: no errors. (If `tsconfig.json` lacks strict-null edge cases, fix any reported type error in the relevant primitive before continuing.)

---

## Self-Review notes

- **Spec coverage:** token system (Task 1.1–1.3), button family incl. SplitButton (Task 2.1–2.4), supporting primitives Card/TextField/Eyebrow (Task 3.1–3.3), preview verification (Task 2.5, 3.4). Page application (spec §"Page-by-page") and Phase 7 polish are intentionally deferred to Plan 2. Retiring MUI happens in Plan 2 (Project detail).
- **Accent rule** (red ≤ once per view) is a page-level concern enforced in Plan 2; primitives only make red available via `filled`/selected states.
- **Type consistency:** `ButtonVariant`/`ButtonSize` are defined in `Button.tsx` and imported by `IconButton.tsx` and the preview. `springs` keys (`spatialDefault`, `spatialFast`, `pressMorph`) are used consistently. `SplitButtonMenuItem.onSelect` matches the test.
- **Reduced motion:** every animated primitive guards with `useReducedMotion()`.
