# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-01
- Primary product surfaces: portfolio homepage, selected-work browsing, project detail sheets, profile/contact sheet, AI assistant input.
- Evidence reviewed: `app/page.tsx`, `app/globals.css`, `components/ChatInput.tsx`, `components/ProjectDetailView.tsx`, `components/material/ProjectField.tsx`, `components/detail/CaseStudy.tsx`, `public/projects/**`, Marvin Schwaibold reference site.

## Brand
- Personality: quiet, editorial, precise, technical, image-led, confident without marketing noise.
- Trust signals: shipped prototypes, hackathon winner, AI-native interfaces, design engineering ownership from product thinking to production code.
- Avoid: busy badges, loud gradients, oversized marketing heroes, icon-only project browsing as the primary experience, decorative UI that competes with work.

## Product goals
- Goals: show Minwook as both design engineer and compact AI/product studio; make selected work immediately understandable; keep the AI assistant as a signature interaction.
- Non-goals: copying the reference site one-to-one; turning the page into a generic agency landing page; hiding projects behind chat only.
- Success signals: visitors understand the offer within one screen, can browse selected work visually, can open detailed proof, and can ask the assistant without losing context.

## Personas and jobs
- Primary personas: founders, design/product leads, tech teams, agencies needing a hands-on design engineer.
- User jobs: judge taste and craft quickly; inspect project proof; understand services; contact or ask project-specific questions.
- Key contexts of use: desktop portfolio review, mobile link click, recruiter/client scan, live conversation during outreach.

## Information architecture
- Primary navigation: minimal header identity plus scrollable content; fixed assistant controls at the bottom.
- Core routes/screens: home, project sheet, profile sheet, chat overlay.
- Content hierarchy: identity statement, selected work, studio/profile pitch, lab/archive, footer/contact.

## Design principles
- Principle 1: Let project media carry the page before labels explain it.
- Principle 2: Use motion for spatial continuity, not spectacle.
- Tradeoffs: preserve the existing assistant and case-study system while replacing the icon-field homepage with an editorial browsing model.

## Visual language
- Color: white canvas, near-black text, soft gray surfaces, dark footer/lab.
- Typography: system/Google Sans style, small editorial sizes, readable paragraph rhythm, no negative letter spacing.
- Spacing/layout rhythm: generous top/bottom whitespace, constrained text columns, wider project media rows.
- Shape/radius/elevation: cards use modest 8-12px radius; sheets use large top radius; avoid nested cards.
- Motion: slow Apple-like easing, bottom-sheet travel, subtle carousel/card hover.
- Imagery/iconography: large project screenshots/videos first; icons are supporting identity marks.

## Components
- Existing components to reuse: `ChatInput`, `ProjectDetailView`, `ProfileCard`, material buttons/icons, project data in `app/page.tsx`.
- New/changed components: editorial project cards, selected-work carousel/grid, lab/archive section, sheet-style overlays.
- Variants and states: selected work, archived/lab work, coming-soon project notice, profile/contact state, chat-on-top state.
- Token/component ownership: keep global CSS tokens in `app/globals.css`; avoid introducing a separate design-system layer.

## Accessibility
- Target standard: keyboard reachable project cards, profile controls, assistant input, and sheet dismissal.
- Keyboard/focus behavior: project cards open on click/keyboard, Escape closes sheets, visible focus rings remain.
- Contrast/readability: near-black text on white; muted text only for secondary copy.
- Screen-reader semantics: real headings, button labels, image alt text, hidden crawlable content retained.
- Reduced motion and sensory considerations: no essential interaction should depend on animation.

## Responsive behavior
- Supported breakpoints/devices: mobile, tablet, desktop.
- Layout adaptations: selected work stacks on mobile, carousel/large cards on desktop, lab archive becomes denser on wide screens.
- Touch/hover differences: hover polish is additive; tap/click remains direct.

## Interaction states
- Loading: existing intro and chat streaming states stay subtle.
- Empty: home still shows selected work without chat.
- Error: chat retains existing error message.
- Success: project/profile sheets open with clear context and dismiss controls.
- Disabled: coming-soon Atlas announces unavailable state.
- Offline/slow network, if applicable: image/video loading should degrade to static project text.

## Content voice
- Tone: concise, editorial, concrete.
- Terminology: design engineer, AI-native products, websites, prototypes, compact studio.
- Microcopy rules: short labels; avoid explaining the UI inside the UI.

## Implementation constraints
- Framework/styling system: Next.js App Router, React, Tailwind, CSS variables, Framer Motion.
- Design-token constraints: continue using existing near-black, soft-gray, and white tokens.
- Performance constraints: avoid heavy canvas/WebGL; lazy-load media; use CSS transforms for motion.
- Compatibility constraints: keep existing chat API, project data, and case-study renderer.
- Test/screenshot expectations: run unit tests, production build, and browser checks on localhost after major changes.

## Open questions
- [ ] Should the final live version keep the current intro animation, or move directly into the editorial page? / Minwook / affects first impression.
- [ ] Which four projects should be permanently treated as selected work? / Minwook / affects homepage hierarchy.
