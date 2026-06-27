import { absoluteUrl } from "@/lib/seo";

export const DESIGN_SYSTEM_PATHS = {
  page: "/design-system",
  markdown: "/design-system.md",
  tokens: "/design-system/tokens.json",
  portfolioAi: "/work/portfolio-ai",
} as const;

export const DESIGN_SYSTEM_PROOF = {
  name: "Portfolio AI design system proof",
  description:
    "A compact AI-readable interface contract for Portfolio AI: tokens, components, interaction rules, accessibility rules, and machine-readable docs.",
  audience: "Design Engineer and UX Engineer recruiting",
  sourceFiles: [
    "app/globals.css",
    "lib/material/motion.ts",
    "components/HomePage.tsx",
    "components/ArchiveIndexPage.tsx",
    "components/CustomCursor.tsx",
    "components/MaterialArrowForwardIcon.tsx",
    "components/MaterialChevronRightIcon.tsx",
    "components/ProjectDetailView.tsx",
    "components/LabStudyDetailView.tsx",
    "components/detail/CaseStudy.tsx",
    "components/StudioVideoPlayer.tsx",
    "lib/aiPortfolio.ts",
  ],
} as const;

export const DESIGN_SYSTEM_TOKENS = {
  schemaVersion: "2026-06-26",
  name: DESIGN_SYSTEM_PROOF.name,
  sourceFiles: DESIGN_SYSTEM_PROOF.sourceFiles,
  colors: [
    { role: "theme.light.background", cssVariable: "--theme-light-bg", value: "#FAFAFA", usage: "cretu.dev light canvas" },
    { role: "theme.light.surface", cssVariable: "--theme-light-surface", value: "#FFFFFF", usage: "quiet light panels and inputs" },
    { role: "theme.light.element", cssVariable: "--theme-light-element", value: "#F5F5F7", usage: "subtle light fills and code surfaces" },
    { role: "theme.light.ink", cssVariable: "--theme-light-ink", value: "#18181B", usage: "light mode primary text" },
    { role: "theme.light.muted", cssVariable: "--theme-light-muted", value: "#4A4A52", usage: "light mode secondary text" },
    { role: "theme.light.faint", cssVariable: "--theme-light-faint", value: "#67676D", usage: "light mode metadata and subdued controls" },
    { role: "theme.light.dim", cssVariable: "--theme-light-dim", value: "#C8C8CD", usage: "light mode resting underlines and quiet dividers" },
    { role: "background.base", cssVariable: "--bg-base", value: "light-only", usage: "page canvas" },
    { role: "background.surface", cssVariable: "--bg-surface", value: "light-only", usage: "quiet panels and inputs" },
    { role: "background.element", cssVariable: "--bg-element", value: "light-only", usage: "resting underline, subtle UI fill, skeleton states" },
    { role: "border.light", cssVariable: "--border-light", value: "light-only", usage: "hairline structure only where needed" },
    { role: "text.primary", cssVariable: "--text-primary", value: "light-only", usage: "primary text and active links" },
    { role: "text.secondary", cssVariable: "--text-secondary", value: "light-only", usage: "secondary explanatory copy" },
    { role: "text.muted", cssVariable: "--text-muted", value: "light-only", usage: "metadata, tertiary copy, timestamps" },
    { role: "text.dim", cssVariable: "--text-dim", value: "light-only", usage: "resting underlines and low-emphasis strokes" },
  ],
  typography: {
    families: [
      { role: "sans", cssVariable: "--font-sans", value: "Switzer, Helvetica Neue, Arial, sans-serif" },
      { role: "mono", cssVariable: "--font-mono", value: "Geist Mono, SF Mono, monospace" },
    ],
    scale: [
      { role: "caption", cssVariable: "--type--2", value: "0.64rem" },
      { role: "small", cssVariable: "--type--1", value: "0.8rem" },
      { role: "body", cssVariable: "--type-0", value: "1rem" },
      { role: "bodyLarge", cssVariable: "--type-3", value: "1.125rem" },
      { role: "displaySmall", cssVariable: "--type-4", value: "1.25rem" },
    ],
    lineHeight: [
      { role: "body", cssVariable: "--leading-body", value: "1.55" },
      { role: "heading", cssVariable: "--leading-heading", value: "1.16" },
      { role: "tight", cssVariable: "--leading-tight", value: "1.22" },
    ],
    measure: { cssVariable: "--measure", value: "65ch" },
  },
  spacing: [
    { role: "1", cssVariable: "--space-1", value: "0.5rem" },
    { role: "2", cssVariable: "--space-2", value: "1rem" },
    { role: "3", cssVariable: "--space-3", value: "1.5rem" },
    { role: "4", cssVariable: "--space-4", value: "2rem" },
    { role: "5", cssVariable: "--space-5", value: "2.5rem" },
    { role: "6", cssVariable: "--space-6", value: "3rem" },
    { role: "7", cssVariable: "--space-7", value: "3.5rem" },
    { role: "8", cssVariable: "--space-8", value: "4rem" },
  ],
  radius: [
    { role: "xs", cssVariable: "--md-shape-xs", value: "4px" },
    { role: "sm", cssVariable: "--md-shape-sm", value: "4px" },
    { role: "md", cssVariable: "--md-shape-md", value: "4px" },
    { role: "lg", cssVariable: "--md-shape-lg", value: "8px" },
    { role: "xl", cssVariable: "--md-shape-xl", value: "8px" },
    { role: "full", cssVariable: "--md-shape-full", value: "999px" },
  ],
  elevation: [
    { role: "default", value: "none", usage: "the product relies on spacing, type, and hairlines instead of decorative shadows" },
    {
      role: "cursor",
      value: "18px low-opacity multiply DOM circle; 14px darker chip-coupled state",
      usage: "fine-pointer cursor affordance, not layout surface decoration",
    },
  ],
  motion: {
    durations: [
      { role: "instant", cssVariable: "--motion-duration-instant", value: "120ms" },
      { role: "fast", cssVariable: "--motion-duration-fast", value: "180ms" },
      { role: "base", cssVariable: "--motion-duration-base", value: "250ms" },
      { role: "slow", cssVariable: "--motion-duration-slow", value: "350ms" },
      { role: "reveal", cssVariable: "--motion-duration-reveal", value: "800ms" },
    ],
    easing: [
      { role: "standard", cssVariable: "--motion-ease-standard", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
      { role: "inOut", cssVariable: "--motion-ease-in-out", value: "cubic-bezier(0.45, 0, 0.55, 1)" },
      { role: "emphasized", cssVariable: "--motion-ease-emphasized", value: "cubic-bezier(0.34, 1.28, 0.5, 1)" },
    ],
    springs: [
      { role: "spatialDefault", value: "stiffness 240, damping 30, mass 1.5" },
      { role: "spatialFast", value: "stiffness 320, damping 28, mass 1.3" },
      { role: "pressMorph", value: "stiffness 380, damping 26, mass 1.4" },
      { role: "island", value: "stiffness 190, damping 19, mass 1.3" },
    ],
  },
} as const;

export const DESIGN_SYSTEM_COMPONENTS = [
  {
    name: "document shell",
    description: "Centered 720px reading axis shared by home, archive pages, notes, work details, studies, and design-system proof.",
    primitives: ["home doc shell", "archive page shell", "detail page shell", "lowercase site scope"],
  },
  {
    name: "outline rows",
    description: "Notion-like document structure using small bullets, section circles, short metadata, and restrained 1-2px text nudges.",
    primitives: ["outline section", "outline row", "bullet cell", "metadata line", "section count"],
  },
  {
    name: "archive index",
    description: "Year-grouped work, notes, and studies lists using collapsible outline sections and short proof rows.",
    primitives: ["archive year", "archive row", "archive count", "back to index link"],
  },
  {
    name: "quiet outline signals",
    description: "Hover and focus feedback starts inside the bullet cell, then gives nearby text a restrained nudge: internal links draw a small Material arrow, sections swap the dot for a caret, and notes keep a quieter dot state.",
    primitives: ["drawn Material arrow signal", "section caret replacement", "quiet note dot", "bullet cell"],
  },
  {
    name: "detail outline",
    description: "Case studies and interaction-study details use the same outline sections for proof, story, rules, links, media, and code.",
    primitives: ["detail hero", "proof strip", "detail outline row", "media frame", "code block"],
  },
  {
    name: "ai chat and recruiter intake",
    description: "Streaming project-intake interface connected to deterministic project routing and public proof links.",
    primitives: ["chat input", "answer stream", "project action", "question prompt"],
  },
  {
    name: "buttons and links",
    description: "Plain text links for reading flow, lifted glass action chips for explicit click targets, focus-visible outlines, and quiet press feedback.",
    primitives: ["micro link", "lifted glass action chip", "lateral link", "focus ring", "pressable row"],
  },
  {
    name: "cards and surfaces",
    description: "Surfaces are reserved for media, code, native video playback, and functional controls; document structure relies on bullets and spacing.",
    primitives: ["media frame", "code block", "native video controls", "status block"],
  },
  {
    name: "machine-readable proof blocks",
    description: "Resume links, markdown routes, token routes, and public repository proof.",
    primitives: ["proof repository list", "markdown route", "tokens JSON"],
  },
] as const;

export const DESIGN_SYSTEM_INTERACTION_RULES = [
  "Keep hover movement tiny: signals move inside the bullet cell, and nearby text may nudge only 1-2px.",
  "Hide section counts once a section is open so the visible content is the proof.",
  "Use section carets only inside the bullet cell so caret and dot never overlap.",
  "Reserve glass treatment for explicit action chips and controls, not full outline rows.",
  "Use signal families consistently: internal links draw arrows, sections swap dots for carets, notes keep dot-only feedback, and contact chips use lift plus cursor coupling.",
  "Use 180ms to 300ms transitions for hover, focus, and press feedback; reserve longer reveal timing for page entry or scroll entry.",
  "Use blur only as a brief entry bridge, not as a permanent decorative layer.",
  "Provide static image or text fallbacks for media previews and reduced-motion users.",
  "Buttons, links, project rows, and native video controls must be reachable by keyboard and expose visible focus states.",
  "Loading states should preserve space so rows, inputs, and proof blocks do not jump.",
] as const;

export const DESIGN_SYSTEM_ACCESSIBILITY_RULES = [
  "Use semantic routes, headings, links, buttons, lists, and landmarks before visual wrappers.",
  "Keep contrast intent simple: black primary text on white, muted gray only for secondary copy and metadata.",
  "Never hide essential navigation behind hover-only behavior.",
  "Focus-visible outlines are required for interactive text, rows, buttons, and controls.",
  "Respect prefers-reduced-motion with static or non-transform fallbacks.",
  "Write descriptive link labels; avoid bare arrows as the only action label.",
] as const;

export const DESIGN_SYSTEM_AI_CONTRACT = {
  use: [
    "Compose new UI from existing route, row, section, link, proof, and media primitives.",
    "Use token roles instead of raw color values unless documenting a token.",
    "Keep copy concise, evidence-based, and recruiter-readable.",
    "Prefer spacing, typography, and small motion over decorative surfaces.",
    "Expose important proof through both visible UI and machine-readable routes.",
    "Treat interaction demos as contained exceptions; their surrounding story, rules, and code must still use the detail outline.",
    "Keep the public site in light mode; do not introduce theme toggles or OS-preference dark overrides.",
  ],
  avoid: [
    "Do not invent metrics, employers, awards, repository links, or project outcomes.",
    "Do not create a separate visual system, large landing page, or marketing-heavy hero for proof pages.",
    "Do not add new dependencies for primitives that already exist in the codebase.",
    "Do not use flashy gradients, decorative glass, or large motion that competes with the work; outline feedback should stay in dots, carets, and Material signals.",
    "Do not remove reduced-motion, keyboard, or focus-visible behavior.",
  ],
} as const;

export function generateDesignSystemMarkdown() {
  return lines([
    "# Portfolio AI design system proof",
    "",
    `> ${DESIGN_SYSTEM_PROOF.description}`,
    "",
    "## Canonical routes",
    `- Visual page: ${absoluteUrl(DESIGN_SYSTEM_PATHS.page)}`,
    `- Markdown: ${absoluteUrl(DESIGN_SYSTEM_PATHS.markdown)}`,
    `- Tokens JSON: ${absoluteUrl(DESIGN_SYSTEM_PATHS.tokens)}`,
    `- Portfolio AI case study: ${absoluteUrl(DESIGN_SYSTEM_PATHS.portfolioAi)}`,
    "",
    "## Source files",
    ...DESIGN_SYSTEM_PROOF.sourceFiles.map((file) => `- ${file}`),
    "",
    "## Design tokens",
    "### Color roles",
    ...DESIGN_SYSTEM_TOKENS.colors.map((token) => `- ${token.role}: ${token.value} (${token.cssVariable}) - ${token.usage}`),
    "",
    "### Typography",
    ...DESIGN_SYSTEM_TOKENS.typography.families.map((token) => `- ${token.role}: ${token.value} (${token.cssVariable})`),
    ...DESIGN_SYSTEM_TOKENS.typography.scale.map((token) => `- ${token.role}: ${token.value} (${token.cssVariable})`),
    ...DESIGN_SYSTEM_TOKENS.typography.lineHeight.map((token) => `- ${token.role} line-height: ${token.value} (${token.cssVariable})`),
    `- measure: ${DESIGN_SYSTEM_TOKENS.typography.measure.value} (${DESIGN_SYSTEM_TOKENS.typography.measure.cssVariable})`,
    "",
    "### Spacing",
    ...DESIGN_SYSTEM_TOKENS.spacing.map((token) => `- ${token.role}: ${token.value} (${token.cssVariable})`),
    "",
    "### Radius and elevation",
    ...DESIGN_SYSTEM_TOKENS.radius.map((token) => `- ${token.role}: ${token.value} (${token.cssVariable})`),
    ...DESIGN_SYSTEM_TOKENS.elevation.map((token) => `- ${token.role}: ${token.value} - ${token.usage}`),
    "",
    "### Motion",
    ...DESIGN_SYSTEM_TOKENS.motion.durations.map((token) => `- ${token.role}: ${token.value} (${token.cssVariable})`),
    ...DESIGN_SYSTEM_TOKENS.motion.easing.map((token) => `- ${token.role}: ${token.value} (${token.cssVariable})`),
    ...DESIGN_SYSTEM_TOKENS.motion.springs.map((token) => `- ${token.role}: ${token.value}`),
    "",
    "## Component primitives",
    ...DESIGN_SYSTEM_COMPONENTS.flatMap((component) => [
      `### ${component.name}`,
      `- Purpose: ${component.description}`,
      `- Primitives: ${component.primitives.join(", ")}`,
      "",
    ]),
    "## Interaction rules",
    ...DESIGN_SYSTEM_INTERACTION_RULES.map((rule) => `- ${rule}`),
    "",
    "## Accessibility rules",
    ...DESIGN_SYSTEM_ACCESSIBILITY_RULES.map((rule) => `- ${rule}`),
    "",
    "## AI-readable contract",
    "### Use",
    ...DESIGN_SYSTEM_AI_CONTRACT.use.map((rule) => `- ${rule}`),
    "",
    "### Avoid",
    ...DESIGN_SYSTEM_AI_CONTRACT.avoid.map((rule) => `- ${rule}`),
  ]);
}

function lines(values: string[]) {
  return `${values.join("\n")}\n`;
}
