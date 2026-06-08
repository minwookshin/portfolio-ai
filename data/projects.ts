import type { CSSProperties } from "react";
import type { Project } from "@/components/ProjectCard";

export type BuilderMetric = {
  label: string;
  value: string;
  note?: string;
};

export type BuilderDemo = {
  label: string;
  href?: string;
  video?: string;
  note?: string;
};

export type BuilderProof = {
  role: string;
  stack: string[];
  status: {
    label: string;
    href?: string;
  };
  oneLiner: string;
  pipeline: string;
  demo?: BuilderDemo;
  scope: BuilderMetric[];
  results: BuilderMetric[];
};

export type LabStudyKind =
  | "motion-taste"
  | "hover-row"
  | "route-transition"
  | "cursor-study"
  | "motion-curve";

export type LabStudy = {
  kind: LabStudyKind;
  thesis: string;
  points: string[];
  rules: BuilderMetric[];
  code: string;
};

export type PortfolioProject = Project & {
  slug: string;
  metadataDescription?: string;
  builder: BuilderProof;
  labStudy?: LabStudy;
};

export function hasFillPlaceholder(value: string) {
  return /\{\{FILL(?::[^}]*)?\}\}/.test(value);
}

export function isVisibleBuilderValue(value?: string | null): value is string {
  if (!value?.trim()) return false;
  return !hasFillPlaceholder(value);
}

export function getProjectMetadataDescription(project: PortfolioProject) {
  if (isVisibleBuilderValue(project.metadataDescription)) {
    return project.metadataDescription;
  }

  return [project.builder.oneLiner, project.builder.pipeline]
    .filter(isVisibleBuilderValue)
    .join(" ");
}

export const MAIN_PROJECTS: PortfolioProject[] = [
  {
    id: "1",
    slug: "sentinel",
    title: "Sentinel",
    description: "Predictive Home Maintenance iOS App",
    fullDescription:
      "A native iOS app built in 48 hours that transforms home maintenance from reactive crisis management to proactive risk mitigation. Winner of Google x SCAD FLUX Hackathon 2025.",
    role: "Design Engineer — designed & built",
    timeline: "2 days (48-hour hackathon)",
    team: "Hyunsoo, Madelyn",
    tags: ["Swift", "SwiftUI", "Figma", "Predictive Data"],
    categories: ["Engineering", "Design"],
    github: "https://github.com/YeYen1721/sentinel",
    linkedin: "https://www.linkedin.com/posts/minwookshin_hackathon-scadflux-vibecoding-ugcPost-7389656630055018498-BOpk/",
    date: "2025",
    image: "/projects/sentinel/hero.png",
    icon: "/projects/sentinellogo.png",
    studioLabel: "48-hour native iOS MVP",
    themeColor: "#F59E0B",
    overview: "From Idea to Native iOS App in 48 Hours. Sentinel is a predictive home maintenance app that helps homeowners move from gut feeling to data-driven decision making, preventing invisible risks before they become $200,000 disasters.",
    builder: {
      role: "Design Engineer — designed & built",
      stack: ["Figma", "Swift", "SwiftUI", "weather data"],
      status: { label: "Shipped in 48h" },
      oneLiner: "Predictive iOS maintenance app that turns weather risk into prioritized homeowner actions.",
      pipeline: "Designed in Figma → Shipped in Swift + SwiftUI.",
      demo: { label: "Watch demo", video: "/projects/sentinel/demo.mp4" },
      scope: [
        { label: "Build time", value: "48h" },
      ],
      results: [
        { label: "Actual", value: "Winner · Google × SCAD FLUX Hackathon 2025" },
      ],
    },
    contentSections: [
      { type: "text", content: "Hero" },
      { type: "text", content: "Context" },
      { type: "text", content: "Builder Process" },
      { type: "text", content: "Key Features" },
      { type: "text", content: "Demo Video" },
      { type: "text", content: "Outcome" },
    ],
  },
  {
    id: "2",
    slug: "portfolio-ai",
    title: "Portfolio AI",
    description: "An AI-native studio website that explains work, qualifies intent, and routes visitors to the right proof.",
    fullDescription:
      "A conversational product-studio site built with Next.js, React, and Gemini. It answers questions, runs lightweight project intake, and opens relevant case studies in real time.",
    role: "Design Engineer — designed & built solo",
    timeline: "2 weeks",
    team: "Solo Project",
    tags: ["Next.js", "React", "Gemini API", "TypeScript", "Framer Motion"],
    categories: ["Engineering", "AI"],
    github: "https://github.com/YeYen1721/portfolio",
    link: "https://www.minwookshin.com",
    date: "2025",
    image: "/projects/2.png",
    icon: "/icon.png",
    studioLabel: "AI intake website",
    themeColor: "#8B5CF6",
    overview: "An AI-native studio site that turns passive browsing into a live project briefing.",
    builder: {
      role: "Design Engineer — designed & built solo",
      stack: ["Next.js", "React", "TypeScript", "Gemini API", "Framer Motion"],
      status: { label: "🟢 Live", href: "https://www.minwookshin.com" },
      oneLiner: "AI-native portfolio that answers questions, qualifies intent, and opens relevant proof.",
      pipeline: "Designed in Figma → Shipped in Next.js + React.",
      demo: { label: "Try live site", href: "https://www.minwookshin.com" },
      scope: [
        { label: "Build time", value: "2 weeks" },
        { label: "API integrations", value: "Gemini API, Vercel server routes" },
      ],
      results: [
        { label: "Actual", value: "Live production site" },
      ],
    },
    features: [
      "Zero-latency streaming using Server-Sent Events (SSE)",
      "3-Layer Defense (Identity Protection, Secret Guard, Injection Firewall)",
      "Rich content rendering with Markdown, Code Blocks, and Project Cards",
    ],
    challenges: "Bridging high-end Product Design with complex LLM Engineering while maintaining military-grade security.",
    outcome: "Bridged the gap between high-end Product Design and complex LLM Engineering. Proves the ability to build secure, production-ready AI applications with elite UX.",
  },
  {
    id: "11",
    slug: "atlas",
    title: "Atlas",
    description: "Capstone project in progress.",
    fullDescription: "A high-fidelity capstone project currently being prepared for publication.",
    tags: ["AI", "Product Design", "Capstone"],
    categories: ["AI", "Design"],
    date: "Coming soon",
    image: "/projects/atlas/logo.png",
    icon: "/projects/atlas/logo.png",
    studioLabel: "Capstone project in progress",
    comingSoon: true,
    unavailableMessage: "Capstone project in progress.",
    builder: {
      role: "Design Engineer — in preparation",
      stack: [],
      status: { label: "Coming soon" },
      oneLiner: "High-fidelity capstone project currently being prepared for publication.",
      pipeline: "Case study and product media are being prepared.",
      scope: [],
      results: [],
    },
  },
  {
    id: "4",
    slug: "flux",
    title: "FLUX Website",
    description: "Interactive design project with unique UI interactions",
    fullDescription:
      "A creative web project featuring an innovative grid-based layout with circular elements and dynamic interactions. Built with modern web technologies to create an engaging user experience with smooth animations and responsive design.",
    role: "Website Officer",
    timeline: "2025",
    tags: ["HTML", "CSS", "JavaScript", "UI/UX Design"],
    categories: ["Engineering", "Design"],
    link: "https://www.scadflux.com/fluxathon",
    github: "https://github.com/YeYen1721/portfolio-",
    date: "2025",
    image: "/projects/1.png",
    icon: "/projects/flux/icon-white.png",
    studioLabel: "Interactive web system",
    themeColor: "#8B5CF6",
    overview: "FLUX is a creative web project that showcases innovative UI/UX design through an interactive grid-based layout. The project emphasizes smooth user interactions, dynamic animations, and a unique circular navigation system that creates an engaging browsing experience.",
    builder: {
      role: "Designed & Built as website officer",
      stack: ["HTML", "CSS", "JavaScript"],
      status: { label: "🟢 Live", href: "https://www.scadflux.com/fluxathon" },
      oneLiner: "Interactive event website with grid-based navigation and bespoke motion.",
      pipeline: "Designed in Figma → Shipped in HTML, CSS, and JavaScript.",
      demo: { label: "Open live site", href: "https://www.scadflux.com/fluxathon" },
      scope: [],
      results: [],
    },
  },
  {
    id: "3",
    slug: "mindline",
    title: "Mindline",
    description: "AI-Powered Gambling Addiction Recovery Tool",
    fullDescription:
      "An AI-powered support system designed to help young adults overcome betting addiction through real-time intervention, smart journaling, and behavioral pattern recognition.",
    role: "Product Designer & UX Researcher",
    timeline: "10 weeks",
    team: "Brynn, Giuseppe, Max, Zhenghao, Leo",
    tags: ["AI Chatbot", "UX Research"],
    categories: ["AI", "Design"],
    github: "https://github.com/YeYen1721/mindline",
    date: "2025",
    image: "/projects/mindline/hero.png",
    icon: "/projects/mindline/icon.png",
    studioLabel: "Behavioral AI product",
    themeColor: "#3B82F6",
    overview: "Mindline shifts the focus from 'restriction' to 'awareness'. An AI-powered tool that helps young adults (18-26) combat betting addiction through real-time emotional analysis, smart journaling, and behavioral interventions.",
    metadataDescription:
      "Behavioral AI product that turns emotional triggers into real-time intervention — a 10-week research and design sprint targeting young adults.",
    builder: {
      role: "Product Designer & UX Researcher",
      stack: ["Figma", "AI UX flows"],
      status: { label: "Prototype" },
      oneLiner: "Behavioral AI product that turns emotional triggers into real-time intervention.",
      pipeline: "Designed in Figma → prototyped as a research-backed AI UX concept.",
      scope: [
        { label: "Build time", value: "10 weeks" },
      ],
      results: [
        { label: "Actual", value: "6 research interviews" },
      ],
    },
    contentSections: [
      { type: "text", content: "Hero" },
      { type: "text", content: "Research Deep Dive" },
      { type: "text", content: "The Solution" },
      { type: "text", content: "The Logic" },
      { type: "text", content: "Outcome" },
    ],
  },
  {
    id: "12",
    slug: "motion-taste-system",
    title: "Motion Taste System",
    description: "A small rulebook for quiet interface motion.",
    fullDescription:
      "A lab study that turns motion taste into reusable rules, durations, easing, and code.",
    tags: ["Motion", "Interaction", "Design Engineering"],
    categories: ["Lab", "Motion"],
    date: "2026",
    glyph: "mt",
    studioLabel: "motion rules and code",
    metadataDescription:
      "A small motion taste system with interactive examples, timing rules, and implementation notes.",
    builder: {
      role: "Interaction study",
      stack: ["Framer Motion", "CSS", "React"],
      status: { label: "Study" },
      oneLiner: "A small rulebook for quiet interface motion.",
      pipeline: "Taste decision -> interactive proof -> reusable code rule.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "motion-taste",
      thesis: "Good motion should explain state change without making the interface feel busy.",
      points: [
        "Start visible, not from nothing, so elements feel physically present.",
        "Keep micro-interactions short enough to disappear into the workflow.",
        "Use blur only as a bridge into clarity, not as a permanent visual effect.",
      ],
      rules: [
        { label: "micro", value: "120-180ms", note: "hover, press, small text movement" },
        { label: "standard", value: "180-260ms", note: "tooltips, previews, small panels" },
        { label: "layout", value: "240-320ms", note: "route content, larger spatial changes" },
      ],
      code: `const quietMotion = {
  initial: { opacity: 0, y: 8, scale: 0.96, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};`,
    },
  },
  {
    id: "13",
    slug: "hover-row-study",
    title: "Hover Row Study",
    description: "A study for moving project rows without making them loud.",
    fullDescription:
      "A lab study comparing underline, lateral text shift, and preview handoff for project rows.",
    tags: ["Hover", "Interaction", "Portfolio UI"],
    categories: ["Lab", "Interaction"],
    date: "2026",
    glyph: "hr",
    studioLabel: "project-row interaction",
    metadataDescription:
      "A compact hover row interaction study for quiet project browsing.",
    builder: {
      role: "Interaction study",
      stack: ["React", "CSS", "Framer Motion"],
      status: { label: "Study" },
      oneLiner: "A study for moving project rows without making them loud.",
      pipeline: "Compare underline -> lateral copy -> preview handoff.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "hover-row",
      thesis: "The row should respond quickly, but the work should remain the hero.",
      points: [
        "Move copy only a few pixels so the row feels awake, not restless.",
        "Let the preview change faster than the text so the image feels connected.",
        "Use muted metadata until hover to keep scanning calm.",
      ],
      rules: [
        { label: "copy move", value: "4-6px", note: "enough to feel intentional" },
        { label: "hover fade", value: "120-180ms", note: "fast handoff between projects" },
        { label: "meta color", value: "muted -> mid gray", note: "secondary copy stays secondary" },
      ],
      code: `.project-row-copy {
  transform: translateX(0);
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

[data-project-row]:hover .project-row-copy {
  transform: translateX(6px);
}`,
    },
  },
  {
    id: "14",
    slug: "route-transition-study",
    title: "Route Transition Study",
    description: "Changing pages without losing the reader's place.",
    fullDescription:
      "A study for routing between work and studies while preserving spatial context.",
    tags: ["Routing", "Motion", "UX"],
    categories: ["Lab", "Interaction"],
    date: "2026",
    glyph: "rt",
    studioLabel: "spatial page transition",
    metadataDescription:
      "A route transition study for changing content below stable identity and navigation.",
    builder: {
      role: "Interaction study",
      stack: ["Next.js", "Framer Motion", "React"],
      status: { label: "Study" },
      oneLiner: "Changing pages without losing the reader's place.",
      pipeline: "Stable identity -> URL change -> content-only transition.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "route-transition",
      thesis: "Navigation feels calmer when identity stays still and only the lower content changes.",
      points: [
        "Keep the intro and contact surface stable so the user does not re-orient.",
        "Update the URL for shareability without making the whole page feel replaced.",
        "Use a short vertical reveal for content, not a full page animation.",
      ],
      rules: [
        { label: "stable zone", value: "identity + nav", note: "does not animate between sections" },
        { label: "moving zone", value: "content panel", note: "small opacity and y movement" },
        { label: "duration", value: "220-280ms", note: "noticeable, but not theatrical" },
      ],
      code: `<AnimatePresence mode="wait">
  <motion.section
    key={pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
  />
</AnimatePresence>`,
    },
  },
  {
    id: "15",
    slug: "cursor-study",
    title: "Cursor Study",
    description: "A quiet custom cursor that stays behind the work.",
    fullDescription:
      "A lab study for cursor shape, shadow, scale, and when the system cursor should win.",
    tags: ["Cursor", "Interaction", "Micro-detail"],
    categories: ["Lab", "Interaction"],
    date: "2026",
    glyph: "cs",
    studioLabel: "pointer shape study",
    metadataDescription:
      "A cursor interaction study about shape, scale, shadow, and restraint.",
    builder: {
      role: "Interaction study",
      stack: ["SVG", "CSS", "React"],
      status: { label: "Study" },
      oneLiner: "A quiet custom cursor that stays behind the work.",
      pipeline: "Codex-like pointer reference -> reduced shape -> site-specific cursor.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "cursor-study",
      thesis: "A custom cursor should add authorship without stealing attention from the interface.",
      points: [
        "Make the shape slightly rounded so it feels designed, not novelty.",
        "Keep the shadow subtle enough to separate on white without becoming a sticker.",
        "Disable special cursor behavior where precision or native affordance matters.",
      ],
      rules: [
        { label: "size", value: "13x15px", note: "smaller than a decorative badge" },
        { label: "rotation", value: "-8deg", note: "lying down slightly, still readable" },
        { label: "outline", value: "outside white", note: "drawn behind the fill so it stays outside the black shape" },
        { label: "shadow", value: "two soft drops", note: "separation without glow" },
      ],
      code: `.animated-cursor__arrow {
  width: 13px;
  height: 15px;
  transform: rotate(-8deg);
  filter:
    drop-shadow(0 1px 1px rgba(0, 0, 0, 0.28))
    drop-shadow(0 3px 5px rgba(0, 0, 0, 0.12));
}

.animated-cursor__outline {
  stroke: rgb(255 255 255);
  stroke-width: 1.6px;
}`,
    },
  },
  {
    id: "16",
    slug: "motion-curve-tester",
    title: "Motion Curve Tester",
    description: "A tiny tool for checking distance, duration, and easing.",
    fullDescription:
      "A lab tool that previews how timing and distance change the perceived weight of an interface.",
    tags: ["Tool", "Motion", "Design System"],
    categories: ["Lab", "Tool"],
    date: "2026",
    glyph: "mc",
    studioLabel: "interactive motion tool",
    metadataDescription:
      "A tiny motion curve tester for duration, distance, easing, and perceived weight.",
    builder: {
      role: "Tiny tool",
      stack: ["React", "Framer Motion"],
      status: { label: "Prototype" },
      oneLiner: "A tiny tool for checking distance, duration, and easing.",
      pipeline: "Adjust motion values -> replay UI movement -> keep the best rule.",
      scope: [],
      results: [],
    },
    labStudy: {
      kind: "motion-curve",
      thesis: "Motion values should be judged in context, not copied from a token list blindly.",
      points: [
        "The same duration feels different when distance changes.",
        "Ease-out works for entering; ease-in-out works better for movement already on screen.",
        "A tester makes motion critique concrete instead of taste theater.",
      ],
      rules: [
        { label: "distance", value: "4-32px", note: "small UI movement range" },
        { label: "duration", value: "120-320ms", note: "micro to layout transition range" },
        { label: "easing", value: "standard / in-out", note: "picked by interaction type" },
      ],
      code: `<motion.div
  animate={{ x: distance }}
  transition={{
    duration: duration / 1000,
    ease: easing === "standard" ? [0.22, 1, 0.36, 1] : [0.45, 0, 0.55, 1],
  }}
/>`,
    },
  },
  {
    id: "7",
    slug: "nameme",
    title: "NameMe",
    description: "Concept design project",
    fullDescription:
      "NameMe is a concept design project spanning ideation, low-fi flows, and a high-fidelity concept.",
    tags: ["UX Design", "Concept"],
    categories: ["Design"],
    date: "2025",
    image: "/projects/nameme/nmmainfin.jpg",
    icon: "/projects/nameme/icon.png",
    studioLabel: "Concept-to-hi-fi UX",
    overview: "From ideation to a high-fidelity concept.",
    gallery: ["/projects/nameme/nmmainfin.jpg", "/projects/nameme/nmhificoncept.png", "/projects/nameme/nmmidfi.png", "/projects/nameme/nmlowfi.png"],
    builder: {
      role: "Product Designer",
      stack: ["Figma"],
      status: { label: "Prototype" },
      oneLiner: "Concept-to-hi-fi product exploration around identity and naming.",
      pipeline: "Designed in Figma → prototyped as a high-fidelity UX concept.",
      scope: [],
      results: [],
    },
  },
  {
    id: "8",
    slug: "capexplorer",
    title: "CapExplorer",
    description: "A website for exploring caps.",
    fullDescription: "CapExplorer, a website for exploring caps.",
    tags: ["Web", "UI/UX Design"],
    categories: ["Engineering", "Design", "AI"],
    date: "2025",
    glyph: "CEr",
    studioLabel: "AI-assisted product demo",
    linkedin: "https://www.linkedin.com/posts/minwookshin_buildinpublic-hat-ugcPost-7432477739208777729-sZlv/",
    builder: {
      role: "Designed & Built solo",
      stack: [],
      status: { label: "Live demo" },
      oneLiner: "Interactive product demo for exploring caps.",
      pipeline: "Designed in Figma → prepared as an interactive product demo.",
      demo: { label: "Watch demo", video: "/projects/capexplorer/demo.mp4" },
      scope: [],
      results: [],
    },
  },
  {
    id: "9",
    slug: "tomo",
    title: "Tomo",
    description: "Tomo, interactive demo.",
    fullDescription: "Tomo, interactive demo.",
    tags: ["Product Design"],
    categories: ["Design", "AI"],
    date: "2025",
    glyph: "🫠",
    studioLabel: "Interactive product demo",
    linkedin: "https://www.linkedin.com/posts/minwookshin_technology-innovation-ugcPost-7432812004098084865-AGvW/",
    builder: {
      role: "Designed & Built solo",
      stack: [],
      status: { label: "Live demo" },
      oneLiner: "Interactive product demo exploration.",
      pipeline: "Designed in Figma → prepared as an interactive product demo.",
      demo: { label: "Watch demo", video: "/projects/tomo/demo.mp4" },
      scope: [],
      results: [],
    },
  },
  {
    id: "10",
    slug: "caret",
    title: "Caret",
    description: "Caret, an iOS app and UX design project.",
    fullDescription: "Caret, an iOS app and UX design project.",
    tags: ["iOS", "UX Design"],
    categories: ["Engineering", "Design"],
    date: "2025",
    icon: "/projects/caret/Caret_icon.png",
    image: "/projects/caret/icon.png",
    studioLabel: "iOS UX prototype",
    github: "https://github.com/YeYen1721/Caret",
    linkedin: "https://www.linkedin.com/posts/minwookshin_nobody-quits-out-of-nowhere-they-burn-out-ugcPost-7432114646523740160-YWsz/",
    builder: {
      role: "Design Engineer",
      stack: ["SwiftUI"],
      status: { label: "Prototype" },
      oneLiner: "iOS UX prototype focused on burnout and quitting signals.",
      pipeline: "Designed in Figma → Shipped in SwiftUI.",
      demo: { label: "Watch demo", video: "/projects/caret/demo.mp4" },
      scope: [],
      results: [],
    },
  },
];

export const FEATURED_PROJECT_IDS = ["11", "1", "2", "3"] as const;
export const LAB_PROJECT_IDS = ["12", "13", "14", "15", "16", "10", "4", "9", "7", "8"] as const;

export const PROJECT_PREVIEW_VIDEOS: Record<string, string> = {
  Sentinel: "/projects/previews/sentinel.mp4",
  "Portfolio AI": "/projects/previews/portfolio-ai.mp4",
  Mindline: "/projects/previews/mindline.mp4",
  "FLUX Website": "/projects/previews/flux.mp4",
  Tomo: "/projects/previews/tomo.mp4",
  NameMe: "/projects/previews/nameme.mp4",
  CapExplorer: "/projects/previews/capexplorer.mp4",
  Caret: "/projects/previews/caret.mp4",
};

export const LIGHT_PROJECT_TOKENS = {
  "--md-surface": "var(--bg-base)",
  "--md-surface-container": "var(--bg-surface)",
  "--md-surface-container-high": "var(--bg-element)",
  "--md-on-surface": "var(--text-primary)",
  "--md-on-surface-variant": "var(--text-muted)",
  "--md-outline": "var(--border-light)",
  "--md-outline-variant": "var(--border-light)",
  "--md-primary": "var(--accent-indigo)",
  "--md-on-primary": "var(--dark-text-primary)",
  "--md-primary-container": "var(--bg-element)",
  "--md-on-primary-container": "var(--text-primary)",
  "--md-hairline": "var(--border-light)",
} as CSSProperties;

export function orderProjects(projects: PortfolioProject[], ids: readonly string[]) {
  return ids
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is PortfolioProject => Boolean(project));
}

export function isFeaturedProject(project: Project) {
  return FEATURED_PROJECT_IDS.includes(project.id as typeof FEATURED_PROJECT_IDS[number]);
}

export function isLabProject(project: Project) {
  return LAB_PROJECT_IDS.includes(project.id as typeof LAB_PROJECT_IDS[number]);
}

export function isLabStudyProject(project: Project | PortfolioProject): project is PortfolioProject & { labStudy: LabStudy } {
  return "labStudy" in project && Boolean(project.labStudy);
}

export function getLabProjects() {
  return orderProjects(MAIN_PROJECTS, LAB_PROJECT_IDS).filter((project) => !project.comingSoon);
}

export function getProjectPath(project: Project) {
  return `/work/${getProjectSlug(project)}`;
}

export function getLabProjectPath(project: Project) {
  return `/studies/${getProjectSlug(project)}`;
}

export function getProjectBySlug(slug: string) {
  return MAIN_PROJECTS.find((project) => project.slug === slug);
}

export function getOpenableProjects() {
  return MAIN_PROJECTS.filter((project) => !project.comingSoon);
}

function slugifyProjectTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getProjectSlug(project: Project) {
  return "slug" in project && typeof project.slug === "string" ? project.slug : slugifyProjectTitle(project.title);
}
