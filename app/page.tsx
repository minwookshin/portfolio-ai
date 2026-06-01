"use client";

import { useState, useEffect, useRef } from "react";
import type { CSSProperties, FormEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from "@/components/ChatInput";
import ProjectDetailView from "@/components/ProjectDetailView";
import ProfileCard from "@/components/ProfileCard";
import { Project } from "@/components/ProjectCard";
import { ArrowRight, FileText, ArrowUpRight, X } from "lucide-react";
import { springs } from "@/lib/material/motion";

// One reveal shared by every full-screen overlay (profile, project detail) so
// they all enter/leave with the same spring instead of bespoke morphs.
// Selected studio work
const MAIN_PROJECTS: Project[] = [
  {
    id: "1",
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
    contentSections: [
      { type: 'text', content: "Hero" },
      { type: 'text', content: "Context" },
      { type: 'text', content: "Builder Process" },
      { type: 'text', content: "Key Features" },
      { type: 'text', content: "Demo Video" },
      { type: 'text', content: "Outcome" }
    ]
  },
  {
    id: "2",
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
    date: "2025",
    image: "/projects/2.png",
    icon: "/icon.png",
    studioLabel: "AI intake website",
    themeColor: "#8B5CF6",
    overview: "An AI-native studio site that turns passive browsing into a live project briefing.",
    features: [
      "Zero-latency streaming using Server-Sent Events (SSE)",
      "3-Layer Defense (Identity Protection, Secret Guard, Injection Firewall)",
      "Rich content rendering with Markdown, Code Blocks, and Project Cards"
    ],
    challenges: "Bridging high-end Product Design with complex LLM Engineering while maintaining military-grade security.",
    outcome: "Bridged the gap between high-end Product Design and complex LLM Engineering. Proves the ability to build secure, production-ready AI applications with elite UX.",
    contentSections: [
      { type: 'text', content: "Turning a Portfolio into a Studio Interface" },
      { type: 'text', content: "Static sites make visitors hunt for relevance. This AI-native interface answers questions, qualifies project intent, and routes people to the right proof in real time." },
      { type: 'text', content: "Technical Stack Optimized for AI-Native UX" },
      { type: 'text', content: "• **Next.js 16 (App Router):** Moved data fetching to the server, reducing client-side hydration time by 40%.\n• **Streaming via SSE:** Implemented Server-Sent Events to stream Gemini responses token-by-token, creating a natural conversational rhythm without loading spinners.\n• **Edge Runtime:** API routes run on global Edge Network, ensuring <200ms response times regardless of user geography." },
      { type: 'gallery', images: [{ image: "/projects/portfolio-ai/architecture.png", caption: "System Architecture" }] },
      { type: 'text', content: "Key Features" },
      { type: 'text', content: "**Streaming Responses + Structured Data Rendering**\n\n• **Fluidity:** Server-Sent Events deliver responses token-by-token, mimicking human typing. No \"loading...\" states-just natural flow.\n• **Structured Output:** Responses render as Markdown with syntax-highlighted code and formatted tables. Complex technical answers become scannable, visual information, reducing cognitive load." },
      { type: 'text', content: "**Enterprise-Ready Security Architecture**\n\n• **Server-Side API Key Protection:** Keys never touch the browser; all requests route via Next.js API Routes.\n• **Rate Limiting:** Implemented request throttling (10 req/min) to prevent abuse and DDoS attacks.\n• **Environment Isolation:** Sensitive credentials stored in secure server-only environments, mirroring production standards." },
      { type: 'text', content: "**Impact: Bridging Design, Engineering, and Product Strategy**\n\n• **LLM Integration at Scale:** Delivered a streaming AI chat interface with enterprise-grade security and sub-100ms latency.\n• **Cost-Efficient Architecture:** Reduced token usage by 35% through prompt optimization, cutting API costs without sacrificing UX.\n• **Design + Engineering Fusion:** Unified visual polish (Framer Motion) with technical rigor (RSC)-proving full-stack ownership." }
    ]
  },
  {
    id: "11",
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
  },
  {
    id: "4",
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
    overview: "FLUX is a creative web project that showcases innovative UI/UX design through an interactive grid-based layout. The project emphasizes smooth user interactions, dynamic animations, and a unique circular navigation system that creates an engaging browsing experience."
  },
  {
    id: "3",
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
    contentSections: [
      { type: 'text', content: "Hero" },
      { type: 'text', content: "Research Deep Dive" },
      { type: 'text', content: "The Solution" },
      { type: 'text', content: "The Logic" },
      { type: 'text', content: "Outcome" }
    ]
  },
  {
    id: "7",
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
    gallery: ["/projects/nameme/nmmainfin.jpg", "/projects/nameme/nmhificoncept.png", "/projects/nameme/nmmidfi.png", "/projects/nameme/nmlowfi.png"]
  },
  {
    id: "8",
    title: "CapExplorer",
    description: "A website for exploring caps.",
    fullDescription: "CapExplorer, a website for exploring caps.",
    tags: ["Web", "UI/UX Design"],
    categories: ["Engineering", "Design", "AI"],
    date: "2025",
    glyph: "CEr",
    studioLabel: "AI-assisted product demo",
    linkedin: "https://www.linkedin.com/posts/minwookshin_buildinpublic-hat-ugcPost-7432477739208777729-sZlv/",
  },
  {
    id: "9",
    title: "Tomo",
    description: "Tomo, interactive demo.",
    fullDescription: "Tomo, interactive demo.",
    tags: ["Product Design"],
    categories: ["Design", "AI"],
    date: "2025",
    glyph: "🫠",
    studioLabel: "Interactive product demo",
    linkedin: "https://www.linkedin.com/posts/minwookshin_technology-innovation-ugcPost-7432812004098084865-AGvW/",
  },
  {
    id: "10",
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
  },
];

// The home view opens with these four projects in a centered 2x2 grid.
const FEATURED_PROJECT_IDS = ["11", "3", "1", "2"] as const;

const PROJECT_PREVIEW_VIDEOS: Record<string, string> = {
  Sentinel: "/projects/sentinel/demo.mp4",
  CapExplorer: "/projects/capexplorer/demo.mp4",
  Tomo: "/projects/tomo/demo.mp4",
  Caret: "/projects/caret/demo.mp4",
};

const BUILD_VERSION = "build a60937a";
const BUILD_UPDATED_AT = "2026-06-01T15:12:55Z";
type BuildMetaState = {
  updatedAt: string;
  version: string;
};
const LAB_TILE_HEIGHTS = [
  "h-[420px] sm:h-[460px]",
  "h-[300px] sm:h-[340px]",
  "h-[380px] sm:h-[460px]",
  "h-[300px] sm:h-[340px]",
  "h-[420px] sm:h-[500px]",
  "h-[300px] sm:h-[360px]",
] as const;
const LAB_TILE_HEIGHT_VALUES = [460, 340, 460, 340, 500, 360] as const;
const LIGHT_PROJECT_TOKENS = {
  "--md-surface": "#f7f7f8",
  "--md-surface-container": "#ffffff",
  "--md-surface-container-high": "#efeff1",
  "--md-on-surface": "#050505",
  "--md-on-surface-variant": "#6f6f75",
  "--md-outline": "#d8d8dd",
  "--md-outline-variant": "#e5e5e8",
  "--md-primary": "#050505",
  "--md-on-primary": "#ffffff",
  "--md-primary-container": "#eeeeef",
  "--md-on-primary-container": "#050505",
  "--md-hairline": "rgba(5, 5, 5, 0.10)",
} as CSSProperties;

// Personal Information
const PERSONAL_INFO = {
  name: "Minwook Shin",
  title: "Design Engineer",
  bio: "I work as a hands-on design engineer and a compact studio for AI-native products, websites, and prototypes. I shape the product, design the interface, and build the working experience in code.\n\n• Product strategy, UX systems, and polished interaction design.\n• Frontend builds with React, Next.js, SwiftUI, and production-ready motion.\n• AI websites, agents, and launchable demos for founders, teams, and agencies.",
  email: "mwshin0703@gmail.com",
  linkedin: "https://www.linkedin.com/in/minwookshin",
  github: "https://github.com/YeYen1721",
  resume: "https://drive.google.com/file/d/1DpEUz-h7ZgHIkNNdbAr6VIUho4m33v3-/view?usp=sharing",
};

// The model appends hidden directive lines at the end of each reply:
//   <<<SHOW>>>project:Sentinel | projects | profile   (what the UI should open)
//   <<<FOLLOWUPS>>>q1|q2|q3                            (tappable next questions)
// We split these off so the prose renders clean, drive the cards from SHOW
// (deterministic, instead of keyword-guessing), and surface the follow-ups as
// capsules. Trailing partial sentinels are hidden so nothing flashes mid-stream.
const FOLLOWUP_SENTINEL = "<<<FOLLOWUPS>>>";
const SHOW_SENTINEL = "<<<SHOW>>>";

function parseAssistant(content: string): { body: string; followups: string[]; show: string | null } {
  const showMatch = content.match(/<<<SHOW>>>\s*([^\n|]+)/);
  const show = showMatch ? showMatch[1].trim() : null;

  let followups: string[] = [];
  const fIdx = content.indexOf(FOLLOWUP_SENTINEL);
  if (fIdx !== -1) {
    followups = content
      .slice(fIdx + FOLLOWUP_SENTINEL.length)
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  // Body is everything before the first directive sentinel.
  let cut = content.length;
  for (const s of [SHOW_SENTINEL, FOLLOWUP_SENTINEL]) {
    const i = content.indexOf(s);
    if (i !== -1) cut = Math.min(cut, i);
  }
  let body = content.slice(0, cut).trimEnd();
  // Hide a trailing partial sentinel while it's still streaming in.
  for (const s of [SHOW_SENTINEL, FOLLOWUP_SENTINEL]) {
    for (let n = s.length - 1; n > 0; n--) {
      if (body.endsWith(s.slice(0, n))) {
        body = body.slice(0, -n).trimEnd();
        break;
      }
    }
  }
  return { body, followups, show };
}

// Map a SHOW directive to a redirect-button target (a project or the profile).
function showToTarget(show: string | null): Project | "profile" | "projects" | null {
  if (!show) return null;
  if (show === "profile") return "profile";
  if (show === "projects") return "projects";
  if (show.startsWith("project:")) {
    const name = show.slice("project:".length).trim().toLowerCase();
    return MAIN_PROJECTS.find((p) => p.title.toLowerCase() === name) ?? null;
  }
  return null;
}

function orderProjects(projects: Project[], ids: readonly string[]) {
  return ids
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project));
}

function formatElapsedBefore(from: string, now: number) {
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(from).getTime()) / 1000));
  const days = Math.floor(elapsedSeconds / 86400);
  const hours = Math.floor((elapsedSeconds % 86400) / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s before`;
}

function BuildMeta() {
  const [meta, setMeta] = useState<BuildMetaState>({
    updatedAt: BUILD_UPDATED_AT,
    version: BUILD_VERSION,
  });
  const [now, setNow] = useState(() => new Date(BUILD_UPDATED_AT).getTime());

  useEffect(() => {
    let cancelled = false;

    const loadMeta = () => {
      fetch("/api/build-meta", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((nextMeta: Partial<BuildMetaState> | null) => {
          if (cancelled || !nextMeta?.updatedAt || !nextMeta?.version) return;
          setMeta({ updatedAt: nextMeta.updatedAt, version: nextMeta.version });
        })
        .catch(() => {});
    };

    loadMeta();
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const metaTimer = window.setInterval(loadMeta, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.clearInterval(metaTimer);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#77777d]">
      <span>{meta.version}</span>
      <span aria-hidden>·</span>
      <span>updated {formatElapsedBefore(meta.updatedAt, now)}</span>
    </div>
  );
}

function ProjectMedia({ project, tone = "light" }: { project: Project; tone?: "light" | "dark" }) {
  const src = project.image ?? project.icon;
  const isLogo = project.title === "Atlas" || project.title === "Portfolio AI";
  const mediaBg = tone === "dark" ? "bg-[#101012]" : "bg-[#0b0b0d]";

  if (src) {
    return (
      <div className={`relative aspect-[1.5] w-full overflow-hidden rounded-[22px] ${mediaBg}`}>
        <img
          src={src}
          alt={project.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`h-full w-full object-contain transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035] ${
            isLogo ? "p-12 sm:p-20" : "p-8 sm:p-12"
          }`}
          style={{ filter: "grayscale(1) contrast(1.02)" }}
        />
      </div>
    );
  }

  return (
    <div className={`flex aspect-[1.5] w-full items-center justify-center rounded-[22px] ${mediaBg} text-4xl text-[#f4f4f5]`}>
      {project.glyph ?? project.title.charAt(0)}
    </div>
  );
}

function ProjectMark({ project, compact = false }: { project: Project; compact?: boolean }) {
  const src = project.icon ?? project.image;
  const isLogo = project.title === "Atlas" || project.title === "Portfolio AI" || Boolean(project.icon);

  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`h-full w-full ${isLogo ? "object-contain" : "object-cover"} ${compact ? "p-2" : "p-4"}`}
        style={{ filter: "grayscale(1) contrast(1.04)" }}
      />
    );
  }

  return (
    <span className={`${compact ? "text-[12px]" : "text-[28px]"} font-normal text-current`}>
      {project.glyph ?? project.title.charAt(0)}
    </span>
  );
}

function IntroLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-[13px] text-[rgba(255,255,255,0.68)] underline decoration-[rgba(255,255,255,0.68)] decoration-[1px] underline-offset-2 outline-none transition-colors duration-300 hover:text-[#f4f4f5] hover:decoration-[#f4f4f5] focus-visible:text-[#f4f4f5] focus-visible:decoration-[#f4f4f5]"
    >
      {children}
    </a>
  );
}

function SelectedProjectCard({
  project,
  index,
  isActive,
  onSelect,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  onSelect: (project: Project) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(project)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...springs.spatialDefault, delay: Math.min(index * 0.035, 0.18) }}
      data-work-card="true"
      className={`group w-[min(74vw,680px)] shrink-0 snap-center text-left outline-none transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505] ${
        isActive ? "scale-100 opacity-100" : "scale-[0.96] opacity-70 hover:opacity-100"
      }`}
    >
      <ProjectMedia project={project} />
      <span className="mt-3 flex items-start justify-between gap-4">
        <span className="min-w-0">
          <span className="block text-[15px] font-normal leading-tight text-[#f4f4f5]">{project.title}</span>
          <span className="mt-1 block text-[13px] leading-snug text-white/55">
            {project.comingSoon ? project.unavailableMessage ?? "Coming soon." : project.studioLabel ?? project.description}
          </span>
        </span>
        {!project.comingSoon && (
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#f4f4f5] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        )}
      </span>
    </motion.button>
  );
}

function EditorialIntro() {
  return (
    <section id="top" className="mx-auto flex w-full max-w-[1180px] justify-center px-6 pb-16 pt-[92px] sm:px-10 md:pb-20 md:pt-[122px]">
      <div id="profile" className="w-full max-w-[620px] scroll-mt-28 text-left">
        <p className="text-[13px] leading-relaxed text-[#f4f4f5]">minwook shin</p>
        <p className="mt-1 text-[14px] leading-relaxed text-white/55">Design engineer / AI product studio</p>
        <h1 className="mt-5 max-w-[620px] text-[28px] font-normal leading-[1.16] text-[#f4f4f5] md:text-[36px]">
          Interfaces for AI products, websites, and prototypes that move from early idea to working software.
        </h1>
        <p className="mt-3 max-w-[520px] text-[16px] leading-[1.5] text-white">
          I work as a hands-on design engineer and compact studio for AI-native products, websites, and prototypes. I shape the product, design the interface, and build the working experience in code.
        </p>
        <div className="mt-7 flex flex-wrap justify-start gap-x-5 gap-y-2">
          <IntroLink href={`mailto:${PERSONAL_INFO.email}`}>Email</IntroLink>
          <IntroLink href={PERSONAL_INFO.linkedin} external>LinkedIn</IntroLink>
          <IntroLink href={PERSONAL_INFO.github} external>GitHub</IntroLink>
          <IntroLink href={PERSONAL_INFO.resume} external>Resume</IntroLink>
        </div>
      </div>
    </section>
  );
}

function WorkSection({
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect: (project: Project) => void;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveProject = () => {
    const scroller = carouselRef.current;
    if (!scroller) return;
    const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-work-card]"));
    if (!cards.length) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
    const closestIndex = cards.reduce((bestIndex, card, index) => {
      const bestRect = cards[bestIndex].getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const bestDistance = Math.abs(bestRect.left + bestRect.width / 2 - scrollerCenter);
      const distance = Math.abs(cardRect.left + cardRect.width / 2 - scrollerCenter);
      return distance < bestDistance ? index : bestIndex;
    }, 0);
    setActiveIndex(closestIndex);
  };

  const scrollToProject = (index: number) => {
    const scroller = carouselRef.current;
    const cards = Array.from(scroller?.querySelectorAll<HTMLElement>("[data-work-card]") ?? []);
    const card = cards[index];
    if (!scroller || !card) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta = cardRect.left + cardRect.width / 2 - (scrollerRect.left + scrollerRect.width / 2);
    const target = scroller.scrollLeft + delta;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollTo({ left: Math.min(Math.max(target, 0), maxScroll), behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <section id="work" className="mx-auto w-full max-w-[1180px] px-6 py-14 sm:px-10 md:py-20">
      <div className="mb-12 flex justify-center">
        <div className="w-full max-w-[620px] text-left">
          <h2 className="text-[18px] font-normal text-[#f4f4f5]">Selected work</h2>
          <p className="mt-3 max-w-[500px] text-[15px] leading-[1.58] text-white/55">
            Product interfaces, AI-native websites, native prototypes, and fast-moving experiments. Open a project for the deeper case-study sheet.
          </p>
        </div>
      </div>
      <div
        ref={carouselRef}
        onScroll={updateActiveProject}
        className="relative left-1/2 w-screen -translate-x-1/2 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 [scrollbar-width:none]"
      >
        <div
          className="flex w-max gap-[clamp(1.5rem,4vw,3.5rem)]"
          style={{ paddingInline: "calc((100vw - min(74vw, 680px)) / 2)" }}
        >
          {projects.map((project, index) => (
            <SelectedProjectCard
              key={project.id}
              project={project}
              index={index}
              isActive={index === activeIndex}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
      <div className="mx-auto mt-4 flex w-full max-w-[620px] items-center justify-center gap-4" aria-label="Selected work carousel">
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => scrollToProject(index)}
              aria-label={`Show ${project.title}`}
              aria-current={isActive ? "true" : undefined}
              className="group flex h-6 min-w-6 items-center justify-center rounded-full bg-transparent outline-none transition-colors duration-300 hover:bg-white/[0.08] focus-visible:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              <span
                className={`rounded-full transition-all duration-300 ${
                  isActive ? "h-[3px] w-9 bg-[#f4f4f5]" : "h-[3px] w-[3px] bg-white/40 group-hover:bg-white/65"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LabChatTile() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyRef.current?.scrollTo({
      top: historyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendDraft = async () => {
    const message = draft.trim();
    if (!message || isStreaming) return;
    const userMessage = { id: `${Date.now()}-user`, role: "user" as const, content: message };
    const nextMessages = [...messages, userMessage];
    const assistantId = `${Date.now()}-assistant`;

    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
    setDraft("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          context: "The user is using the Ask me live demo inside the Lab / archive bento tile. Keep the answer concise so it fits inside the card.",
        }),
      });

      if (!res.ok) throw new Error("API error");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          const tail = decoder.decode();
          if (tail) {
            fullText += tail;
            setMessages((prev) =>
              prev.map((msg) => (msg.id === assistantId ? { ...msg, content: fullText } : msg))
            );
          }
          break;
        }
        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, content: fullText } : msg))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "I hit an error in this demo. Try again in a moment." }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendDraft();
  };

  const submitFromKeyboard = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    sendDraft();
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      className={`w-full overflow-hidden rounded-[10px] bg-white p-3 text-[#050505] ${
        hasMessages ? "h-[520px]" : LAB_TILE_HEIGHTS[0]
      }`}
    >
      <form
        onSubmit={submit}
        className="flex h-full min-h-0 w-full flex-col bg-[#f5f5f5] p-4 text-[#050505] transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <div ref={historyRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1">
          {messages.map((msg) => {
            const body = msg.role === "assistant" ? parseAssistant(msg.content).body : msg.content;
            const isUser = msg.role === "user";
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] px-3 py-2 leading-snug ${
                    isUser ? "bg-[#050505] text-white" : "bg-white text-[#050505]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{body || (isStreaming ? "..." : "")}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex h-16 w-full min-w-0 bg-white">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={submitFromKeyboard}
            placeholder="ask me"
            aria-label="Ask from lab"
            className="min-w-0 flex-1 bg-transparent px-5 font-light outline-none placeholder:text-[#77777d]"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim() || isStreaming}
            className="flex h-16 w-16 shrink-0 items-center justify-center transition-opacity disabled:opacity-30"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </form>
    </div>
  );
}

function LabProjectTile({
  project,
  index,
  onSelect,
  className = "",
}: {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideo = PROJECT_PREVIEW_VIDEOS[project.title];
  const src = project.image ?? project.icon;

  const playPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const stopPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(project)}
      onMouseEnter={playPreview}
      onMouseLeave={stopPreview}
      onFocus={playPreview}
      onBlur={stopPreview}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...springs.spatialDefault, delay: Math.min(index * 0.035, 0.18) }}
      className={`group relative w-full overflow-hidden rounded-[10px] bg-[#f5f5f5] text-left outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {src && (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover grayscale transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
        )}
        {previewVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster={project.image ?? project.icon}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <source src={previewVideo} type="video/mp4" />
          </video>
        )}
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#eeeeef] text-[#050505] transition duration-500 group-hover:scale-[1.04]">
            <ProjectMark project={project} />
          </div>
        )}
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/72 via-black/28 to-transparent p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <span className="flex items-end justify-between gap-4">
          <span className="min-w-0">
            <span className="block font-normal leading-tight text-white">{project.title}</span>
            <span className="mt-1 block leading-snug text-white/62">
              {project.studioLabel ?? project.description}
            </span>
          </span>
          {!project.comingSoon && <ArrowUpRight className="h-4 w-4 shrink-0 text-white" />}
        </span>
      </span>
    </motion.button>
  );
}

function LabArchive({
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect: (project: Project) => void;
}) {
  const labColumns: Array<Array<{ project: Project; index: number }>> = [[], [], [], []];
  const labColumnHeights = [LAB_TILE_HEIGHT_VALUES[0], 0, 0, 0];
  projects.forEach((project, index) => {
    const preferredColumns = [1, 2, 3, 0];
    const columnIndex = preferredColumns.reduce((shortest, candidate) =>
      labColumnHeights[candidate] < labColumnHeights[shortest] ? candidate : shortest
    );
    labColumns[columnIndex].push({ project, index });
    labColumnHeights[columnIndex] += LAB_TILE_HEIGHT_VALUES[(index + 1) % LAB_TILE_HEIGHT_VALUES.length] + 12;
  });

  return (
    <section className="lab-cursor-dark mt-20 rounded-t-[28px] bg-white px-6 pb-44 pt-20 text-[#050505] sm:px-10 md:pt-28">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-[620px] text-left">
            <h2 className="text-[18px] font-normal text-[#050505]">Lab / archive</h2>
            <p className="mt-2 max-w-[500px] text-[15px] leading-[1.52] text-[#77777d]">
              Projects, demos, experiments, and product sketches live here so the main page stays simple while the body of work stays accessible.
            </p>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-[1040px] gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {labColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex min-w-0 flex-col gap-3">
              {columnIndex === 0 && <LabChatTile />}
              {column.map(({ project, index }) => (
                <LabProjectTile
                  key={project.id}
                  project={project}
                  index={index}
                  onSelect={onSelect}
                  className={LAB_TILE_HEIGHTS[(index + 1) % LAB_TILE_HEIGHTS.length]}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 w-full max-w-[620px]">
          <BuildMeta />
        </div>
      </div>
    </section>
  );
}

// Interface to store content snapshot for each message
export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [heroProject, setHeroProject] = useState<Project | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [projectDetailSource, setProjectDetailSource] = useState<"work" | "archive" | null>(null);
  // When true, the chat floats ON TOP of whatever view the user was in
  // (project detail / profile / globe) instead of snapping back home. The
  // backing view stays mounted, dimmed behind a scrim. Opening a view
  // explicitly (tapping an icon, "Open X", profile/globe) drops the chat back
  // behind it so that view is in focus again.
  const [chatOnTop, setChatOnTop] = useState(false);
  const [detailFocus, setDetailFocus] = useState<string | null>(null);
  const [projectNotice, setProjectNotice] = useState<string | null>(null);
  // Keep the landing motion quiet: the page simply settles in, with no separate
  // logo trace or position handoff.
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroReady(true), 80);
    return () => clearTimeout(timer);
  }, []);
  const [showResume, setShowResume] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Chat state. The /api/chat route streams plain text, so we manage messages
  // directly (see handleMessage) rather than via the AI SDK's useChat, whose v5
  // message/transport shape doesn't match this plain-text endpoint.
  type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!projectNotice) return;
    const t = setTimeout(() => setProjectNotice(null), 2200);
    return () => clearTimeout(t);
  }, [projectNotice]);

  const handleMessage = async (message: string) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    // Bring the chat forward over whatever the user is currently looking at,
    // keeping that view as a dimmed backdrop rather than resetting to home.
    setChatOnTop(true);

    // Tell the backend what the user is currently looking at, so the AI can
    // resolve "this"/"it" and ground its answer in that screen.
    const viewContext = heroProject
      ? `The user is viewing the "${heroProject.title}" project detail page. If they say "this", "it", or "this project", they mean ${heroProject.title}.`
      : showProfile
      ? `The user is viewing my profile / resume / contact page.`
      : '';

    const messageIdSeed = `${messages.length}-${message.length}`;
    const userMsg = { id: `user-${messageIdSeed}`, role: 'user' as const, content: message };
    const assistantId = `assistant-${messageIdSeed}`;

    const updateAssistantMessage = (content: string) => {
      setMessages(prev => prev.map(msg =>
        msg.id === assistantId ? { ...msg, content } : msg
      ));
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], context: viewContext }),
      });

      if (!res.ok) throw new Error('API error');
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setMessages(prev => [...prev, { id: assistantId, role: 'assistant' as const, content: '' }]);

      const readStream = async (currentText: string): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) {
          const tail = decoder.decode();
          const finalText = tail ? `${currentText}${tail}` : currentText;
          if (tail) updateAssistantMessage(finalText);
          return;
        }

        const nextText = `${currentText}${decoder.decode(value, { stream: true })}`;
        updateAssistantMessage(nextText);
        return readStream(nextText);
      };

      await readStream('');

      setIsStreaming(false);

    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: `assistant-error-${messageIdSeed}`,
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  // Leave the chat view but KEEP the conversation history (reload clears it)
  const leaveChat = () => {
    setHasStarted(false);
    setChatOnTop(false);
    setShowProfile(false);
    setHeroProject(null);
    setProjectDetailSource(null);
    setDetailFocus(null);
    setShowResume(false);
  };

  // Close whichever overlay is open and return to the exact project grid state
  // the user came from, including all-projects mode.
  const closeOverlay = () => {
    setHasStarted(false);
    setChatOnTop(false);
    setShowProfile(false);
    setHeroProject(null);
    setProjectDetailSource(null);
    setDetailFocus(null);
    setShowResume(false);
  };

  // Re-open the chat (with history) when the user re-engages the composer
  const reopenChat = () => {
    if (messages.length > 0) setHasStarted(true);
  };

  const featuredProjects = orderProjects(MAIN_PROJECTS, FEATURED_PROJECT_IDS);
  const archiveProjects = MAIN_PROJECTS.filter((project) => !FEATURED_PROJECT_IDS.includes(project.id as typeof FEATURED_PROJECT_IDS[number]));

  const openProfile = () => {
    setChatOnTop(false);
    setHasStarted(false);
    setShowProfile(false);
    setHeroProject(null);
    setProjectDetailSource(null);
    requestAnimationFrame(() => {
      document.getElementById("profile")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const openProject = (project: Project, source: "work" | "archive" = "work") => {
    if (project.comingSoon) {
      return;
    }
    setChatOnTop(false);
    setShowProfile(false);
    setDetailFocus(null);
    setProjectDetailSource(source);
    setHeroProject(project);
  };

  // Esc closes whichever overlay is open (pairs with the on-screen ESC keycap).
  useEffect(() => {
    if (!heroProject && !showProfile) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [heroProject, showProfile]);

  const sheetMotion = {
    initial: { y: "100%", opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 1 },
    transition: { type: "tween", duration: 0.62, ease: [0.22, 1, 0.36, 1] as const },
  } as const;
  const isArchiveDetail = Boolean(heroProject && projectDetailSource === "archive");

  return (
    <main
      className="site-text-16 min-h-screen overflow-x-hidden bg-[#050505] text-[#f4f4f5]"
      style={{ backgroundColor: "var(--md-surface)" }}
    >

      {/* Crawlable substance for search engines and non-chatting visitors. Visually
          hidden, but real content so the page isn't an empty chat shell to bots. */}
      <section className="sr-only">
        <h2>{PERSONAL_INFO.name}, {PERSONAL_INFO.title}</h2>
        <p>{PERSONAL_INFO.bio}</p>
        <h3>Selected work</h3>
        <ul>
          {MAIN_PROJECTS.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>, {p.description}
              {p.tags?.length ? ` (${p.tags.join(", ")})` : ""}
            </li>
          ))}
        </ul>
        <h3>Contact</h3>
        <p>
          Email <a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a>,{" "}
          <a href={PERSONAL_INFO.linkedin}>LinkedIn</a>, <a href={PERSONAL_INFO.github}>GitHub</a>.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: introReady ? 1 : 0, y: introReady ? 0 : 8 }}
        transition={{ type: "tween", duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      >
        <EditorialIntro />
        <WorkSection projects={featuredProjects} onSelect={openProject} />
        <LabArchive
          projects={archiveProjects}
          onSelect={(project) => openProject(project, "archive")}
        />
      </motion.div>

      {/* Project detail - selected work stays a sheet; archive items open as centered lightboxes. */}
      <AnimatePresence>
        {heroProject && !isArchiveDetail && (
          <motion.div
            key="hero-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeOverlay}
            className="fixed inset-0 z-[68] bg-[#050505]/38 backdrop-blur-[18px]"
            aria-hidden
          />
        )}
        {heroProject && !isArchiveDetail && (
          <motion.div
            key="hero-detail"
            {...sheetMotion}
            onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
            className="fixed inset-x-0 bottom-0 z-[70] max-h-[calc(100dvh-22px)] overflow-hidden rounded-t-[28px] bg-[#050505] shadow-[0_-24px_80px_rgba(0,0,0,0.42)]"
          >
            <div className="sticky top-0 z-10 flex justify-center bg-[#050505]/85 pb-3 pt-4 backdrop-blur-xl">
              <button
                type="button"
                onClick={closeOverlay}
                aria-label="Close project"
                className="h-1.5 w-14 rounded-full bg-white/30"
              />
            </div>
            <div className="max-h-[calc(100dvh-62px)] overflow-y-auto overscroll-contain">
              <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 pt-8 pb-32">
              <ProjectDetailView
                project={heroProject}
                onBack={closeOverlay}
                hideBack
                focusQuery={detailFocus}
                onAsk={handleMessage}
              />
              </div>
            </div>
          </motion.div>
        )}
        {heroProject && isArchiveDetail && (
          <motion.div
            key="archive-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={closeOverlay}
            className="project-lightbox-close-zone fixed inset-0 z-[70] flex items-center justify-center bg-white/92 p-4 backdrop-blur-[18px] sm:p-10"
          >
            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close project"
              className="project-lightbox-close-button fixed left-4 top-4 z-[72] flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#050505] shadow-[0_14px_40px_rgba(5,5,5,0.12)] transition-transform duration-300 hover:scale-105 sm:left-8 sm:top-1/2 sm:-translate-y-1/2"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.985 }}
              transition={{ type: "tween", duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              style={LIGHT_PROJECT_TOKENS}
              className="project-lightbox-content relative max-h-[calc(100dvh-72px)] w-full max-w-[1120px] overflow-y-auto overscroll-contain rounded-[18px] bg-surface p-5 text-on-surface shadow-[0_24px_90px_rgba(5,5,5,0.16)] sm:max-h-[calc(100dvh-96px)] sm:p-8"
            >
              <ProjectDetailView
                project={heroProject}
                onBack={closeOverlay}
                hideBack
                focusQuery={detailFocus}
                onAsk={handleMessage}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile - same sheet language as project detail. */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            key="profile-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeOverlay}
            className="fixed inset-0 z-[68] bg-[#050505]/38 backdrop-blur-[18px]"
            aria-hidden
          />
        )}
        {showProfile && (
          <motion.div
            key="profile"
            {...sheetMotion}
            onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
            className="fixed inset-x-0 bottom-0 z-[70] max-h-[calc(100dvh-22px)] overflow-hidden rounded-t-[28px] bg-[#050505] shadow-[0_-24px_80px_rgba(0,0,0,0.42)]"
          >
            <div className="sticky top-0 z-10 flex justify-center bg-[#050505]/85 pb-3 pt-4 backdrop-blur-xl">
              <button
                type="button"
                onClick={closeOverlay}
                aria-label="Close profile"
                className="h-1.5 w-14 rounded-full bg-white/30"
              />
            </div>
            <div className="max-h-[calc(100dvh-62px)] overflow-y-auto overscroll-contain pb-28">
            <div className="mx-auto w-full max-w-2xl px-5 sm:px-6 py-8">

              <ProfileCard
                name={PERSONAL_INFO.name}
                title={PERSONAL_INFO.title}
                bio={PERSONAL_INFO.bio}
                email={PERSONAL_INFO.email}
                linkedin={PERSONAL_INFO.linkedin}
              />

              <div className="bg-surface-container mt-4 rounded-none p-6">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setShowResume(!showResume)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springs.pressMorph}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high text-on-surface rounded-none font-normal transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    {showResume ? 'Hide Resume' : 'View Resume'}
                  </motion.button>
                  <motion.a
                    href="/resume.2025dec.pdf"
                    download="Minwook_Shin_Resume.pdf"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springs.pressMorph}
                    className="bg-surface-container-high flex items-center justify-center gap-2 px-4 py-3 text-on-surface rounded-none font-normal transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    Download PDF
                  </motion.a>
                </div>
                <AnimatePresence>
                  {showResume && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4"
                    >
                      <div className="bg-surface-container-high rounded-none overflow-hidden">
                        <img
                          src="/resume.2025dec.jpg"
                          alt="Resume - Minwook Shin"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {projectNotice && (
          <motion.div
            key="project-notice"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={springs.spatialFast}
            className="fixed left-1/2 bottom-32 z-[76] -translate-x-1/2 rounded-none border border-on-surface/10 bg-surface/90 px-4 py-2 text-xs text-on-surface shadow-sm backdrop-blur-md"
          >
            {projectNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-outside catcher - leaving the chat keeps history (only reload clears it) */}
      {hasStarted && (messages.length > 0 || isStreaming) && (
        <div className="fixed inset-0 z-[34]" onClick={leaveChat} aria-hidden />
      )}

      {/* Scrim - dims the view the chat is floating over; tap it to drop back into that view */}
      <AnimatePresence>
        {hasStarted && (messages.length > 0 || isStreaming) && chatOnTop && (heroProject || showProfile) && (
          <motion.div
            key="chat-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setChatOnTop(false)}
            className="fixed inset-0 z-[71] bg-surface/70 backdrop-blur-[3px]"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Chat - floating capsules rising from the bottom over the page, gradient-faded at top */}
      <AnimatePresence>
        {hasStarted && (messages.length > 0 || isStreaming) && (
          <motion.div
            ref={chatContainerRef}
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 overflow-y-auto scroll-smooth ${chatOnTop ? "z-[72]" : "z-[35]"}`}
            style={{
              bottom: 96,
              maxHeight: "calc(100dvh - 180px)",
            }}
          >
            <div className="flex min-h-full flex-col justify-end gap-3 pb-7">
              {messages.map((msg, mi) => {
                const isUser = msg.role === "user";
                const { body, followups, show } = isUser
                  ? { body: msg.content, followups: [] as string[], show: null }
                  : parseAssistant(msg.content);
                const target = !isUser ? showToTarget(show) : null;
                const question = mi > 0 ? messages[mi - 1]?.content ?? "" : "";
                const isLast = mi === messages.length - 1;
                const showFollowups = !isUser && isLast && !isStreaming && followups.length > 0;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springs.spatialFast}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-none px-4 py-3 ${
                        isUser
                          ? "bg-on-surface text-surface"
                          : "bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{body}</p>
                      ) : (
                        <>
                          <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-normal prose-headings:text-on-surface prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-p:my-2 prose-p:text-on-surface prose-p:text-sm prose-p:leading-[1.55] prose-strong:text-on-surface prose-strong:font-normal prose-code:text-on-surface prose-code:bg-surface-container-high prose-code:px-2 prose-code:py-1 prose-code:rounded-none prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-surface-container-high prose-pre:border prose-pre:border-outline-variant prose-pre:rounded-none prose-pre:p-3 prose-pre:my-2 prose-pre:overflow-x-auto prose-ul:my-2 prose-ul:text-sm prose-ol:my-2 prose-li:my-1 prose-li:text-on-surface prose-li:leading-[1.55] prose-a:text-on-surface prose-a:underline prose-a:font-normal">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {body}
                            </ReactMarkdown>
                          </div>
                          {target && (
                            <motion.button
                              type="button"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ ...springs.spatialFast, delay: 0.15 }}
                            onClick={() => {
                              setChatOnTop(false);
                              if (target === "profile") {
                                openProfile();
                              } else if (target === "projects") {
                                setShowProfile(false);
                                setHeroProject(null);
                              } else if (target.comingSoon) {
                                setProjectNotice(target.unavailableMessage ?? `${target.title} is not ready yet.`);
                              } else {
                                setShowProfile(false);
                                setDetailFocus(question);
                                setHeroProject(target);
                              }
                            }}
                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-none bg-surface-container-high text-on-surface text-xs font-normal hover:bg-outline-variant transition-colors"
                          >
                              {target === "profile" ? "View profile" : target === "projects" ? "View selected work" : target.comingSoon ? `${target.title} is not ready yet` : `Open ${target.title}`}
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </motion.button>
                          )}
                        </>
                      )}
                    </div>
                    {showFollowups && (
                      <div className="flex flex-wrap gap-2">
                        {followups.map((f, fi) => (
                          <motion.button
                            key={f}
                            type="button"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...springs.spatialFast, delay: 0.1 + fi * 0.06 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleMessage(f)}
                            className="hover:bg-outline-variant bg-surface-container-high inline-flex items-center px-3 py-2 rounded-none text-on-surface text-xs font-normal transition-colors"
                          >
                            {f}
                          </motion.button>
                        ))}
                      </div>
                    )}
                    </div>
                  </motion.div>
                );
              })}

              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={springs.spatialFast}
                  className="flex justify-start"
                >
                  <div className="bg-surface-container-high rounded-none px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {[0, 0.2, 0.4].map((d) => (
                        <motion.div
                          key={d}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: d }}
                          className="w-1.5 h-1.5 bg-on-surface rounded-none"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Input appears only when chat or a detail view is active. */}
      {(hasStarted || heroProject || showProfile) && (
        <ChatInput
          onSend={handleMessage}
          hasStarted={hasStarted}
          connectorKind={heroProject ? "project" : showProfile ? "profile" : hasStarted ? "chat" : null}
          connectorSrc={heroProject ? (heroProject.icon ?? heroProject.image) : showProfile ? "/profile-photo.jpg" : undefined}
          linkedinUrl={heroProject?.linkedin}
          onClose={heroProject || showProfile ? closeOverlay : undefined}
          onFocusInput={reopenChat}
          introReady={introReady}
        />
      )}
    </main>
  );
}
