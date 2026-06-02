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

export type PortfolioProject = Project & {
  slug: string;
  builder: BuilderProof;
};

export const MAIN_PROJECTS: PortfolioProject[] = [
  {
    id: "1",
    slug: "sentinel",
    title: "Sentinel",
    description: "Predictive Home Maintenance iOS App",
    fullDescription:
      "A native iOS app built in 48 hours that transforms home maintenance from reactive crisis management to proactive risk mitigation. Winner of Google x SCAD FLUX Hackathon 2025.",
    role: "UX Engineer (Design + Native iOS Development)",
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
      role: "Designed & Built with a hackathon team",
      stack: ["Figma", "Swift", "SwiftUI", "weather data"],
      status: { label: "Shipped in 48h" },
      oneLiner: "Predictive iOS maintenance app that turns weather risk into prioritized homeowner actions.",
      pipeline: "Designed in Figma → Shipped in Swift + SwiftUI.",
      demo: { label: "Watch demo", video: "/projects/sentinel/demo.mp4" },
      scope: [
        { label: "Build time", value: "48h" },
        { label: "Screens", value: "{{FILL: screen count}}" },
        { label: "API integrations", value: "{{FILL: weather/data APIs}}" },
        { label: "Performance", value: "{{FILL: load time / app performance}}" },
      ],
      results: [
        { label: "Actual", value: "Winner · Google × SCAD FLUX Hackathon 2025" },
        { label: "Target", value: "{{FILL: homeowner validation metric}}" },
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
    role: "UX Engineer / Full-Stack Developer",
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
      role: "Designed & Built solo",
      stack: ["Next.js", "React", "TypeScript", "Gemini API", "Framer Motion"],
      status: { label: "🟢 Live", href: "https://www.minwookshin.com" },
      oneLiner: "AI-native portfolio that answers questions, qualifies intent, and opens relevant proof.",
      pipeline: "Designed in Figma → Shipped in Next.js + React.",
      demo: { label: "Try live site", href: "https://www.minwookshin.com" },
      scope: [
        { label: "Build time", value: "2 weeks" },
        { label: "Screens", value: "{{FILL: page / state count}}" },
        { label: "API integrations", value: "Gemini API, Vercel server routes" },
        { label: "Performance", value: "{{FILL: Lighthouse score / load time}}" },
      ],
      results: [
        { label: "Actual", value: "Live production site" },
        { label: "Target", value: "{{FILL: recruiter/client conversion metric}}" },
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
    description: "Coming soon.",
    fullDescription: "Atlas is still being prepared.",
    tags: ["AI", "Product Design"],
    categories: ["AI", "Design"],
    date: "Coming soon",
    image: "/projects/atlas/logo.png",
    icon: "/projects/atlas/logo.png",
    studioLabel: "Coming soon",
    comingSoon: true,
    unavailableMessage: "Atlas is not ready yet.",
    builder: {
      role: "Designed & Built",
      stack: ["{{FILL: stack}}"],
      status: { label: "Coming soon" },
      oneLiner: "Atlas is still being prepared.",
      pipeline: "Designed in Figma → Shipped in {{FILL: stack}}.",
      scope: [
        { label: "Build time", value: "{{FILL: build time}}" },
        { label: "Screens", value: "{{FILL: screen count}}" },
        { label: "API integrations", value: "{{FILL: integrations}}" },
        { label: "Performance", value: "{{FILL: load time}}" },
      ],
      results: [{ label: "Target", value: "{{FILL: target result}}" }],
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
      scope: [
        { label: "Build time", value: "{{FILL: build time}}" },
        { label: "Screens", value: "{{FILL: screen count}}" },
        { label: "API integrations", value: "{{FILL: integrations or none}}" },
        { label: "Performance", value: "{{FILL: Lighthouse score / load time}}" },
      ],
      results: [{ label: "Target", value: "{{FILL: event traffic / usability result}}" }],
    },
  },
  {
    id: "3",
    slug: "mindline",
    title: "Mindline",
    description: "AI-Powered Gambling Addiction Recovery Tool",
    fullDescription:
      "An AI-powered support system designed to help young adults overcome betting addiction through real-time intervention, smart journaling, and behavioral pattern recognition.",
    role: "AI UX Designer / UX Researcher",
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
    builder: {
      role: "Designed & Built with a product team",
      stack: ["Figma", "AI UX flows", "{{FILL: prototype/build stack}}"],
      status: { label: "Prototype" },
      oneLiner: "Behavioral AI product that turns emotional triggers into real-time intervention.",
      pipeline: "Designed in Figma → Shipped as {{FILL: prototype/build format}}.",
      demo: { label: "Demo placeholder", note: "{{FILL: live demo or video link}}" },
      scope: [
        { label: "Build time", value: "10 weeks" },
        { label: "Screens", value: "{{FILL: screen count}}" },
        { label: "API integrations", value: "{{FILL: AI/model integrations}}" },
        { label: "Performance", value: "{{FILL: prototype performance metric}}" },
      ],
      results: [
        { label: "Actual", value: "6 research interviews" },
        { label: "Target", value: "{{FILL: behavior-change validation metric}}" },
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
      role: "Designed & Built",
      stack: ["Figma", "{{FILL: prototype/build stack}}"],
      status: { label: "Prototype" },
      oneLiner: "Concept-to-hi-fi product exploration around identity and naming.",
      pipeline: "Designed in Figma → Shipped as {{FILL: prototype/build format}}.",
      demo: { label: "Demo placeholder", note: "{{FILL: prototype link or video}}" },
      scope: [
        { label: "Build time", value: "{{FILL: build time}}" },
        { label: "Screens", value: "{{FILL: screen count}}" },
        { label: "API integrations", value: "{{FILL: integrations or none}}" },
        { label: "Performance", value: "{{FILL: load time}}" },
      ],
      results: [{ label: "Target", value: "{{FILL: concept validation metric}}" }],
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
      stack: ["{{FILL: stack}}"],
      status: { label: "Live demo" },
      oneLiner: "Interactive product demo for exploring caps.",
      pipeline: "Designed in Figma → Shipped in {{FILL: stack}}.",
      demo: { label: "Watch demo", video: "/projects/capexplorer/demo.mp4" },
      scope: [
        { label: "Build time", value: "{{FILL: build time}}" },
        { label: "Screens", value: "{{FILL: screen count}}" },
        { label: "API integrations", value: "{{FILL: integrations}}" },
        { label: "Performance", value: "{{FILL: load time}}" },
      ],
      results: [{ label: "Target", value: "{{FILL: target result}}" }],
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
      stack: ["{{FILL: stack}}"],
      status: { label: "Live demo" },
      oneLiner: "Interactive product demo exploration.",
      pipeline: "Designed in Figma → Shipped in {{FILL: stack}}.",
      demo: { label: "Watch demo", video: "/projects/tomo/demo.mp4" },
      scope: [
        { label: "Build time", value: "{{FILL: build time}}" },
        { label: "Screens", value: "{{FILL: screen count}}" },
        { label: "API integrations", value: "{{FILL: integrations}}" },
        { label: "Performance", value: "{{FILL: load time}}" },
      ],
      results: [{ label: "Target", value: "{{FILL: target result}}" }],
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
    linkedin: "https://www.linkedin.com/posts/minwookshin_nobody-quits-out-of-nowhere-they-burn-out-ugcPost-7432114646523740160-YWsz/",
    builder: {
      role: "Designed & Built solo",
      stack: ["SwiftUI", "{{FILL: supporting stack}}"],
      status: { label: "Prototype" },
      oneLiner: "iOS UX prototype focused on burnout and quitting signals.",
      pipeline: "Designed in Figma → Shipped in SwiftUI.",
      demo: { label: "Watch demo", video: "/projects/caret/demo.mp4" },
      scope: [
        { label: "Build time", value: "{{FILL: build time}}" },
        { label: "Screens", value: "{{FILL: screen count}}" },
        { label: "API integrations", value: "{{FILL: integrations}}" },
        { label: "Performance", value: "{{FILL: app performance}}" },
      ],
      results: [{ label: "Target", value: "{{FILL: target result}}" }],
    },
  },
];

export const FEATURED_PROJECT_IDS = ["11", "3", "1", "2"] as const;

export const PROJECT_PREVIEW_VIDEOS: Record<string, string> = {
  Sentinel: "/projects/sentinel/demo.mp4",
  CapExplorer: "/projects/capexplorer/demo.mp4",
  Tomo: "/projects/tomo/demo.mp4",
  Caret: "/projects/caret/demo.mp4",
};

export const LIVE_DEMO_TILE_TITLES = new Set(["CapExplorer", "Caret"]);

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

export function getProjectPath(project: Project) {
  const slug = "slug" in project && typeof project.slug === "string" ? project.slug : slugifyProjectTitle(project.title);
  return `/work/${slug}`;
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
