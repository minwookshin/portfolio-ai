"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from "@/components/ChatInput";
import ProjectDetailView from "@/components/ProjectDetailView";
import ProfileCard from "@/components/ProfileCard";
import { Project } from "@/components/ProjectCard";
import { FileText, ArrowUpRight } from "lucide-react";
import { ProjectField } from "@/components/material/ProjectField";
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

// Interface to store content snapshot for each message
export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [heroProject, setHeroProject] = useState<Project | null>(null);
  // Screen rect of the icon a detail was opened from, so the modal can expand
  // out of (and collapse back into) that exact spot.
  const [heroOrigin, setHeroOrigin] = useState<{ cx: number; cy: number; w: number } | null>(null);
  // Same idea for the profile, so it expands out of the profile button.
  const [profileOrigin, setProfileOrigin] = useState<{ cx: number; cy: number; w: number } | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // When true, the chat floats ON TOP of whatever view the user was in
  // (project detail / profile / globe) instead of snapping back home. The
  // backing view stays mounted, dimmed behind a scrim. Opening a view
  // explicitly (tapping an icon, "Open X", profile/globe) drops the chat back
  // behind it so that view is in focus again.
  const [chatOnTop, setChatOnTop] = useState(false);
  const [detailFocus, setDetailFocus] = useState<string | null>(null);
  const [projectNotice, setProjectNotice] = useState<string | null>(null);
  // Landing intro: "minwook" appears center, then rises to the top header slot
  // and becomes "minwook shin" (introUp), after which the real header takes over
  // (introDone). The icon field fades in as the name lifts.
  const [introUp, setIntroUp] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introTopY, setIntroTopY] = useState(0);

  useEffect(() => {
    setIntroTopY(-(window.innerHeight / 2 - 48));
    const t1 = setTimeout(() => setIntroUp(true), 2050);
    const t2 = setTimeout(() => setIntroDone(true), 2950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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

    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: message };
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
      let fullText = '';

      // Add empty assistant message that we'll update
      const assistantId = Date.now().toString();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant' as const, content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        fullText += text;

        // Update the assistant message
        setMessages(prev => prev.map(msg =>
          msg.id === assistantId ? { ...msg, content: fullText } : msg
        ));
      }

      setIsStreaming(false);

    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
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
    setDetailFocus(null);
    setShowResume(false);
    setShowAllProjects(false);
  };

  // Close whichever overlay is open and return to the exact project grid state
  // the user came from, including all-projects mode.
  const closeOverlay = () => {
    setHasStarted(false);
    setChatOnTop(false);
    setShowProfile(false);
    setHeroProject(null);
    setDetailFocus(null);
    setShowResume(false);
    setHeroOrigin(null);
    setProfileOrigin(null);
  };

  // Re-open the chat (with history) when the user re-engages the composer
  const reopenChat = () => {
    if (messages.length > 0) setHasStarted(true);
  };

  // Esc closes whichever overlay is open (pairs with the on-screen ESC keycap).
  useEffect(() => {
    if (!heroProject && !showProfile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [heroProject, showProfile]);

  // Start the detail modal scaled down at the icon's screen position so it
  // expands out of (and collapses back into) the icon. Falls back to a gentle
  // rise if we don't have the origin rect.
  const heroExpand =
    heroOrigin && typeof window !== "undefined"
      ? {
          opacity: 0,
          scale: Math.max(heroOrigin.w / window.innerWidth, 0.04),
          x: heroOrigin.cx - window.innerWidth / 2,
          y: heroOrigin.cy - window.innerHeight / 2,
        }
      : { opacity: 0, scale: 0.94, x: 0, y: 24 };

  // Profile expands out of the profile button (bottom-right), mirroring how a
  // project detail expands out of its icon. Falls back to a gentle rise.
  const profileExpand =
    profileOrigin && typeof window !== "undefined"
      ? {
          opacity: 0,
          scale: Math.max(profileOrigin.w / window.innerWidth, 0.04),
          x: profileOrigin.cx - window.innerWidth / 2,
          y: profileOrigin.cy - window.innerHeight / 2,
        }
      : { opacity: 0, scale: 0.94, x: 0, y: 24 };

  return (
    <main
      className="h-screen flex flex-col overflow-hidden justify-center"
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

      {/* Landing intro - the name appears dead-center, then rises to the top
          header slot and grows from "minwook" into "minwook shin". The real
          header takes over once it lands. */}
      <AnimatePresence>
        {!introDone && !hasStarted && (
          <motion.div
            key="intro-name"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 0, scale: 2.4 }}
              animate={{ y: introUp ? introTopY : 0, scale: introUp ? 1 : 2.4 }}
              transition={springs.island}
            >
              <svg viewBox="0 0 110 24" width="110" height="24" className="overflow-visible" role="img" aria-label="minwook">
                <text
                  x="55"
                  y="12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="trace-text lowercase"
                  style={{ fontSize: "16px", fontFamily: "var(--font-google-sans), sans-serif", fontWeight: 300, letterSpacing: "-0.045em" }}
                >
                  minwook
                </text>
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project detail - a card that expands out of the icon and floats ON TOP
          of the (dimmed) home page, then collapses back into the icon. */}
      <AnimatePresence>
        {heroProject && (
          <motion.div
            key="hero-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeOverlay}
            className="fixed inset-0 z-[68] bg-surface/40 backdrop-blur-xl"
            aria-hidden
          />
        )}
        {heroProject && (
          <motion.div
            key="hero-detail"
            initial={heroExpand}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={heroExpand}
            transition={springs.island}
            style={{ transformOrigin: "center center" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
            className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain"
          >
            <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 pt-12 pb-20">
              <ProjectDetailView
                project={heroProject}
                onBack={closeOverlay}
                hideBack
                focusQuery={detailFocus}
                onAsk={handleMessage}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile - a UI that floats on top of the (blurred) home page; tap the
          area outside it to close, same as a project detail. */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            key="profile-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeOverlay}
            className="fixed inset-0 z-[68] bg-surface/40 backdrop-blur-xl"
            aria-hidden
          />
        )}
        {showProfile && (
          <motion.div
            key="profile"
            initial={profileExpand}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={profileExpand}
            transition={springs.island}
            style={{ transformOrigin: "center center" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
            className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain flex pb-28"
          >
            <div className="m-auto w-full max-w-2xl px-5 sm:px-6 py-8">

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
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#EEEEF0] text-on-surface rounded-none font-normal transition-all"
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
                    className="bg-[#EEEEF0] flex items-center justify-center gap-2 px-4 py-3 text-on-surface rounded-none font-normal transition-all"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / hero - the positioning statement; pinned to the top, clear of the
          centered project grid; fades out once chat starts */}
      <div className={`fixed top-0 inset-x-0 z-50 px-4 flex justify-center pointer-events-none ${hasStarted ? 'pt-4' : 'pt-10'}`}>
        <div className="pointer-events-auto">
        <AnimatePresence>
          {introDone && !hasStarted && !showProfile && !heroProject && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={springs.spatialDefault}
              className="flex items-center gap-3"
            >
              <h1
                aria-label="minwook lab"
                tabIndex={0}
                className="group relative text-sm sm:text-base font-light tracking-tight text-on-surface lowercase cursor-default whitespace-nowrap outline-none"
              >
                <span>minwook</span>
                <span
                  aria-hidden="true"
                  className="absolute left-full top-0 ml-1 inline-block max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-w-[2rem] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:max-w-[2rem] group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                >
                  lab
                </span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Project field - always dead-center; stays visible behind the chat */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: !introUp ? 0 : hasStarted ? 0.5 : 1, scale: hasStarted ? 0.96 : 1 }}
        transition={springs.spatialDefault}
        className="fixed inset-0 z-[10] flex items-center justify-center pointer-events-none"
      >
        <div className="pointer-events-auto">
          <ProjectField
            projects={MAIN_PROJECTS}
            featuredProjectIds={FEATURED_PROJECT_IDS}
            showAllProjects={showAllProjects}
            onSelectProject={(project, origin) => {
              if (project.comingSoon) {
                setProjectNotice(project.unavailableMessage ?? `${project.title} is not ready yet.`);
                return;
              }
              setChatOnTop(false);
              setShowProfile(false);
              setDetailFocus(null);
              setHeroOrigin(origin ?? null);
              setHeroProject(project);
            }}
          />
        </div>
      </motion.div>

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
                          : "bg-[#EEEEF0] text-on-surface"
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
                                setShowProfile(true);
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
                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-none bg-[#EEEEF0] text-on-surface text-xs font-normal hover:bg-[#e1e1e5] transition-colors"
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
                            className="hover:bg-[#e1e1e5] bg-[#EEEEF0] inline-flex items-center px-3 py-2 rounded-none text-on-surface text-xs font-normal transition-colors"
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
                  <div className="bg-[#EEEEF0] rounded-none px-4 py-3">
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

      {/* Floating Input (rendered by ChatInput component itself) */}
      <ChatInput
        onSend={handleMessage}
        hasStarted={hasStarted}
        connectorKind={heroProject ? "project" : showProfile ? "profile" : hasStarted ? "chat" : null}
        connectorSrc={heroProject ? (heroProject.icon ?? heroProject.image) : showProfile ? "/profile-photo.jpg" : undefined}
        linkedinUrl={heroProject?.linkedin}
        onClose={heroProject || showProfile ? closeOverlay : undefined}
        onToggleProjectView={!hasStarted && !showProfile && !heroProject ? () => setShowAllProjects((value) => !value) : undefined}
        showAllProjects={showAllProjects}
        onProfile={!showProfile && !heroProject ? (origin) => { setChatOnTop(false); setProfileOrigin(origin ?? null); setShowProfile(true); } : undefined}
        onFocusInput={reopenChat}
        introReady={introDone}
      />
    </main>
  );
}
