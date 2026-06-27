# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-27
- Primary product surfaces: portfolio homepage, command palette, selected-work browsing, notes browsing, studies/interactions browsing, project detail pages, main-page profile/contact block.
- Evidence reviewed: `app/page.tsx`, `app/studies/page.tsx`, `app/globals.css`, `components/HomePage.tsx`, `components/ChatInput.tsx`, `components/ProjectDetailView.tsx`, `components/LabStudyDetailView.tsx`, `components/detail/CaseStudy.tsx`, `data/projects.ts`, `public/projects/**`, Work & Co work/case-study references, Pentagram work/case-study references, Instrument homepage/work pattern, Fantasy homepage positioning, Metalab project-first work grid, Clay outcome/category work index, BASIC/DEPT case-study archive, Huge work index, NN/g UX portfolio and grid guidance, Awwwards project-page collection, Marvin Schwaibold reference site, Google UX portfolio guidance, Vercel design engineer role language.

## Brand
- Personality: quiet, editorial, precise, technical, text-led, confident without marketing noise.
- Trust signals: shipped prototypes, hackathon winner, AI-native interfaces, design engineering ownership from product thinking to production code.
- Avoid: busy badges, loud gradients, oversized marketing heroes, icon-only project browsing as the primary experience, decorative UI that competes with work.

## Product goals
- Goals: show Minwook as both design engineer and compact AI/product studio; make selected work immediately understandable; make interaction studies feel like live interface proof; make command palette the site's utility layer, with AI as one optional command rather than the main surface.
- Non-goals: copying the reference site one-to-one; turning the page into a generic agency landing page; hiding projects behind chat only.
- Success signals: visitors understand the offer within one screen, can scan selected work as text, can open detailed proof, and can use command palette actions without losing context.

## Personas and jobs
- Primary personas: founders, design/product leads, tech teams, agencies needing a hands-on design engineer.
- User jobs: judge taste and craft quickly; inspect project proof; understand services; contact or ask project-specific questions.
- Key contexts of use: desktop portfolio review, mobile link click, recruiter/client scan, live conversation during outreach.

## Information architecture
- Primary navigation: minimal header identity plus inline outline sections: `today`, `selected work`, `notes`, and `contact`; command palette acts as the OS-like utility/search layer. Archive routes (`/work`, `/notes`, `/studies`) extend the same outline language by year; future live interaction work should move toward `/interactions`.
- Core routes/screens: home, command palette, work archive, notes archive, studies/interactions archive, work detail, study detail, note detail, design-system proof.
- Content hierarchy: identity statement, expandable homepage outline, command palette utility actions, text-first selected content lists, contact chips, proof bento surfaces inside selected-work details.

## Design principles
- Principle 1: Let the main page read like an editorial index; proof visuals should support hover states and detail pages, not lead the homepage.
- Principle 2: Use motion for spatial continuity, not spectacle.
- Principle 3: Studies entries and proof-led case studies should make thinking tangible through small working interactions, short writing, and prototype proof, not long prose.
- Tradeoffs: preserve the existing chat route as a command-triggered utility while replacing the icon-field homepage with an editorial browsing model.

## Visual language
- Color: monochrome light canvas, near-black primary text, restrained gray secondary copy, and no blue accent on the homepage; highlights use the site black.
- Typography: system/Google Sans style, small editorial sizes, readable paragraph rhythm, no negative letter spacing.
- Spacing/layout rhythm: generous top/bottom whitespace, constrained text columns, and text-list rhythm on index pages; wider media belongs inside detail pages.
- Shape/radius/elevation: modest 8px radius; avoid nested cards and large glassmorphism on the homepage; contact chips may keep a small glass surface, but it should not become the page's main interaction.
- Motion: slow Apple-like easing, bottom-sheet travel, subtle carousel/card hover; Lottie is reserved for small studies proof assets, not hero or navigation motion.
- Imagery/iconography: project screenshots/videos are proof surfaces inside detail pages and hover previews; icons are supporting identity marks.
- Outline signal grammar: outline rows use an 18px signal cell, 6px filled dots, 6px hollow section circles with a 1px border, and 6px open-section dots across home, archive, detail, and nested rows; link intent becomes a short 8px x 2px stroke plus the 16px Material arrow; hover dot scale stays at 1.08 or lower.
- Interaction tokens: `--signal-*` CSS variables own dot sizes, section strokes, arrow opacity, 2px lateral nudge, and 140ms stroke draw timing. New outline surfaces should use these tokens instead of raw pixel/opacity values.

## Components
- Existing components to reuse: `ChatInput` only as an optional command-triggered AI utility, `ProjectDetailView`, material buttons/icons, project data in `data/projects.ts`.
- New/changed components: editorial project rows, command palette, selected-work preview system, Atlas proof bento case-study template, studies text index, small Lottie motion proof, lab study detail view, sheet-style overlays.
- Variants and states: selected work, studies entries, archived lab prototypes, coming-soon project notice, profile/contact anchor state, chat-on-top state.
- Token/component ownership: keep global CSS tokens in `app/globals.css`; avoid introducing a separate design-system layer.

## Accessibility
- Target standard: keyboard reachable project cards, profile controls, command palette, optional assistant input, and sheet dismissal.
- Keyboard/focus behavior: project cards open on click/keyboard, Escape closes sheets, visible focus rings remain.
- Contrast/readability: near-black text on the soft white canvas; muted gray text only for secondary copy.
- Screen-reader semantics: real headings, button labels, image alt text, hidden crawlable content retained.
- Reduced motion and sensory considerations: no essential interaction should depend on animation.

## Responsive behavior
- Supported breakpoints/devices: mobile, tablet, desktop.
- Layout adaptations: selected work and studies stack on mobile with additive hover previews on fine pointers only.
- Touch/hover differences: hover polish is additive; tap/click remains direct.

## Interaction states
- Loading: existing intro and chat streaming states stay subtle.
- Empty: home still shows selected work without chat.
- Error: chat retains existing error message.
- Success: project sheets open with clear context and dismiss controls; profile/contact details stay available on the main page.
- Disabled: coming-soon Atlas announces unavailable state.
- Offline/slow network, if applicable: image/video loading should degrade to static project text.
- Hover/focus grammar: internal links draw the side-facing Material arrow; expandable sections use the same arrow family rotated downward when open; quiet note rows keep dot-only feedback; action/contact chips use glass hover plus cursor coupling. Rich video/live interaction belongs in detail proof bento surfaces, not the homepage index.

## Content voice
- Tone: concise, editorial, concrete.
- Terminology: design engineer, AI-native products, interfaces, prototypes, small systems, compact studio.
- Microcopy rules: short labels; avoid explaining the UI inside the UI.

## Implementation constraints
- Framework/styling system: Next.js App Router, React, Tailwind, CSS variables, Framer Motion.
- Design-token constraints: keep the public site locked to the light monochrome tokens; do not reintroduce a theme toggle or OS-preference dark override. Dark variables may remain only for contained embeds such as code or project surfaces.
- Performance constraints: avoid heavy canvas/WebGL; lazy-load media; use CSS transforms for primary motion; keep Lottie decorative, SVG-rendered, and narrowly scoped.
- Compatibility constraints: keep existing chat API, project data, and case-study renderer.
- Test/screenshot expectations: run unit tests, production build, and browser checks on localhost after major changes.

## Open questions
- [ ] Should the final live version keep the current intro animation, or move directly into the editorial page? / Minwook / affects first impression.
- [ ] Which four projects should be permanently treated as selected work? / Minwook / affects homepage hierarchy.
