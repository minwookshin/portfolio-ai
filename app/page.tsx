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
import { LandingWireframe } from "@/components/LandingWireframe";
import { springs } from "@/lib/material/motion";

// One reveal shared by every full-screen overlay (profile, project detail) so
// they all enter/leave with the same spring instead of bespoke morphs.
// Main Projects Data - From GitHub Portfolio
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
    description: "A self-operating AI (me!!), built using Next.js, React, and the Gemini API.",
    fullDescription:
      "A 24/7 autonomous AI agent that simulates a real-time technical interview, answering questions about my stack, philosophy, and experience securely and instantly.",
    role: "UX Engineer / Full-Stack Developer",
    timeline: "2 weeks",
    team: "Solo Project",
    tags: ["Next.js", "React", "Gemini API", "TypeScript", "Framer Motion"],
    categories: ["Engineering", "AI"],
    github: "https://github.com/YeYen1721/portfolio",
    date: "2025",
    image: "/projects/2.png",
    icon: "/icon.png",
    themeColor: "#8B5CF6",
    overview: "A self-operating digital twin that turns a static resume into a live technical interview.",
    features: [
      "Zero-latency streaming using Server-Sent Events (SSE)",
      "3-Layer Defense (Identity Protection, Secret Guard, Injection Firewall)",
      "Rich content rendering with Markdown, Code Blocks, and Project Cards"
    ],
    challenges: "Bridging high-end Product Design with complex LLM Engineering while maintaining military-grade security.",
    outcome: "Bridged the gap between high-end Product Design and complex LLM Engineering. Proves the ability to build secure, production-ready AI applications with elite UX.",
    contentSections: [
      { type: 'text', content: "Breaking the Static Portfolio Barrier" },
      { type: 'text', content: "Static portfolios create an information bottleneck. Recruiters need specific answers-\"How did you handle state management?\" or \"Why Next.js?\"-but they're stuck reading 15-page case studies. This AI agent solves that: natural language queries return precise, contextualized answers about my projects and design rationale in real-time." },
      { type: 'text', content: "Technical Stack Optimized for Conversational UX" },
      { type: 'text', content: "• **Next.js 16 (App Router):** Moved data fetching to the server, reducing client-side hydration time by 40%.\n• **Streaming via SSE:** Implemented Server-Sent Events to stream Gemini responses token-by-token, creating a natural conversational rhythm without loading spinners.\n• **Edge Runtime:** API routes run on global Edge Network, ensuring <200ms response times regardless of user geography." },
      { type: 'gallery', images: [{ image: "/projects/portfolio-ai/architecture.png", caption: "System Architecture" }] },
      { type: 'text', content: "Key Features" },
      { type: 'text', content: "**Streaming Responses + Structured Data Rendering**\n\n• **Fluidity:** Server-Sent Events deliver responses token-by-token, mimicking human typing. No \"loading...\" states-just natural flow.\n• **Structured Output:** Responses render as Markdown with syntax-highlighted code and formatted tables. Complex technical answers become scannable, visual information, reducing cognitive load." },
      { type: 'text', content: "**Enterprise-Ready Security Architecture**\n\n• **Server-Side API Key Protection:** Keys never touch the browser; all requests route via Next.js API Routes.\n• **Rate Limiting:** Implemented request throttling (10 req/min) to prevent abuse and DDoS attacks.\n• **Environment Isolation:** Sensitive credentials stored in secure server-only environments, mirroring production standards." },
      { type: 'text', content: "**Impact: Bridging Design, Engineering, and Product Strategy**\n\n• **LLM Integration at Scale:** Delivered a streaming AI chat interface with enterprise-grade security and sub-100ms latency.\n• **Cost-Efficient Architecture:** Reduced token usage by 35% through prompt optimization, cutting API costs without sacrificing UX.\n• **Design + Engineering Fusion:** Unified visual polish (Framer Motion) with technical rigor (RSC)-proving full-stack ownership." }
    ]
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
    themeColor: "#8B5CF6",
    overview: "FLUX is a creative web project that showcases innovative UI/UX design through an interactive grid-based layout. The project emphasizes smooth user interactions, dynamic animations, and a unique circular navigation system that creates an engaging browsing experience."
  },
  {
    id: "5",
    title: "Telfair Museum",
    description: "Exhibition & digital experience design",
    fullDescription:
      "A digital experience design project for the Telfair Museum, reimagining how visitors discover and engage with exhibitions.",
    tags: ["UX Design", "Digital Experience"],
    categories: ["Design"],
    date: "2025",
    image: "/projects/telfair/4.png",
    icon: "/projects/telfair/4.png",
    overview: "Reimagining the museum visit through a thoughtful digital experience.",
    gallery: ["/projects/telfair/4.png", "/projects/telfair/8.png", "/projects/telfair/12.png", "/projects/telfair/16.png"]
  },
  {
    id: "6",
    title: "Nest",
    description: "Product design & branding",
    fullDescription:
      "Nest is a product design and branding project exploring a cohesive device and brand system.",
    tags: ["Product Design", "Branding"],
    categories: ["Design"],
    date: "2025",
    image: "/projects/nest/devicefin.png",
    icon: "/projects/nest/branding1.png",
    overview: "A product and brand system, from low-fi exploration to a polished device concept.",
    gallery: ["/projects/nest/devicefin.png", "/projects/nest/branding1.png", "/projects/nest/fin1.png", "/projects/nest/hifi1.png"]
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
    icon: "/projects/nameme/nmmainfin.jpg",
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
    linkedin: "https://www.linkedin.com/posts/minwookshin_nobody-quits-out-of-nowhere-they-burn-out-ugcPost-7432114646523740160-YWsz/",
  },
];

// Discipline filters for the project field. "All" clears the filter.
const PROJECT_FILTERS = ["All", "Engineering", "AI", "Design"] as const;

// Personal Information
const PERSONAL_INFO = {
  name: "Minwook Shin",
  title: "UX Engineer",
  bio: "I am a UX Engineer who doesn't just design interfaces but builds living products. My diverse journey studying Medicine, playing competitive Volleyball, writing lines of codes, and majoring in UX Design has shaped my unique approach to problem-solving.\n\n• Medicine taught me empathy and scientific rigor in user research.\n• Volleyball instilled the discipline of teamwork and rapid decision-making.\n• Engineering gave me the power to turn those insights into functional code (React, Next.js, Unity).",
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
function showToTarget(show: string | null): Project | "profile" | null {
  if (!show) return null;
  if (show === "profile") return "profile";
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  // When true, the chat floats ON TOP of whatever view the user was in
  // (project detail / profile / globe) instead of snapping back home. The
  // backing view stays mounted, dimmed behind a scrim. Opening a view
  // explicitly (tapping an icon, "Open X", profile/globe) drops the chat back
  // behind it so that view is in focus again.
  const [chatOnTop, setChatOnTop] = useState(false);
  const [detailFocus, setDetailFocus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(t);
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

  const handleMessage = async (message: string) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    // Bring the chat forward over whatever the user is currently looking at,
    // keeping that view as a dimmed backdrop rather than resetting to home.
    setChatOnTop(true);
    console.log('Sending message:', message);

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
    setFilterOpen(false);
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
      leaveChat();
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
      style={{ backgroundColor: "#FFFFFF" }}
    >

      {/* Crawlable substance for search engines and non-chatting visitors. Visually
          hidden, but real content so the page isn't an empty chat shell to bots. */}
      <section className="sr-only">
        <h2>{PERSONAL_INFO.name}, UX Engineer & 0→1 Builder</h2>
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

      {/* Landing intro - a geometric wireframe draws the 2x2 icon + title outlines
          in their exact positions, then dissolves to reveal the real content. */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[100]"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <LandingWireframe />
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
            onClick={leaveChat}
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
            transition={springs.genOvershoot}
            style={{ transformOrigin: "center center" }}
            onClick={(e) => { if (e.target === e.currentTarget) leaveChat(); }}
            className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain"
          >
            <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 pt-12 pb-20">
              <ProjectDetailView
                project={heroProject}
                onBack={leaveChat}
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
            onClick={leaveChat}
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
            transition={springs.genOvershoot}
            style={{ transformOrigin: "center center" }}
            onClick={(e) => { if (e.target === e.currentTarget) leaveChat(); }}
            className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain"
          >
            <div className="w-full max-w-2xl mx-auto px-5 sm:px-6 pt-12 pb-24">

              <ProfileCard
                name={PERSONAL_INFO.name}
                title={PERSONAL_INFO.title}
                bio={PERSONAL_INFO.bio}
                email={PERSONAL_INFO.email}
                linkedin={PERSONAL_INFO.linkedin}
              />

              <div className="glass-stroke bg-surface-container mt-4 rounded-shape-lg p-6">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setShowResume(!showResume)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springs.pressMorph}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-on-surface text-surface rounded-shape-md font-medium transition-all"
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
                    className="glass-stroke-sm bg-surface-container-high flex items-center justify-center gap-2 px-4 py-2.5 text-on-surface rounded-shape-md font-medium transition-all"
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
                      <div className="glass-stroke-sm bg-surface-container-high rounded-shape-md overflow-hidden">
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
          {!hasStarted && !showProfile && !heroProject && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={springs.spatialDefault}
              className="text-center"
            >
              <h1 className="text-sm sm:text-base font-medium tracking-tight text-on-surface lowercase">
                {PERSONAL_INFO.name}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Project field - always dead-center; stays visible behind the chat */}
      <motion.div
        animate={{ opacity: hasStarted ? 0.5 : 1, scale: hasStarted ? 0.96 : 1 }}
        transition={springs.spatialDefault}
        className="fixed inset-0 z-[10] flex items-center justify-center pointer-events-none"
      >
        <div className="pointer-events-auto">
          <ProjectField
            projects={MAIN_PROJECTS}
            activeCategory={activeCategory}
            onSelectProject={(project, origin) => {
              setChatOnTop(false);
              setShowProfile(false);
              setFilterOpen(false);
              setDetailFocus(null);
              setHeroOrigin(origin ?? null);
              setHeroProject(project);
            }}
          />
        </div>
      </motion.div>

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
              bottom: 116,
              maxHeight: "calc(100dvh - 220px)",
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
                    initial={{ opacity: 0, y: 8, filter: isUser ? "blur(0px)" : "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={springs.spatialFast}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-shape-lg px-4 py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] ${
                        isUser
                          ? "bg-on-surface text-surface"
                          : "glass-stroke bg-surface-container text-on-surface"
                      }`}
                    >
                      {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{body}</p>
                      ) : (
                        <>
                          <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-semibold prose-headings:text-on-surface prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-p:my-1.5 prose-p:text-on-surface prose-p:text-sm prose-p:leading-[1.55] prose-strong:text-on-surface prose-strong:font-semibold prose-code:text-on-surface prose-code:bg-surface-container-high prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-surface-container-high prose-pre:border prose-pre:border-outline-variant prose-pre:rounded-lg prose-pre:p-3 prose-pre:my-2 prose-pre:overflow-x-auto prose-ul:my-1.5 prose-ul:text-sm prose-ol:my-1.5 prose-ol:text-sm prose-li:my-0.5 prose-li:text-on-surface prose-li:leading-[1.55] prose-a:text-on-surface prose-a:underline prose-a:font-medium">
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
                                } else {
                                  setShowProfile(false);
                                  setDetailFocus(question);
                                  setHeroProject(target);
                                }
                              }}
                              className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-on-surface text-surface text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              {target === "profile" ? "View profile" : `Open ${target.title}`}
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </motion.button>
                          )}
                        </>
                      )}
                    </div>
                    {showFollowups && (
                      <div className="flex flex-wrap gap-1.5">
                        {followups.map((f, fi) => (
                          <motion.button
                            key={f}
                            type="button"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...springs.spatialFast, delay: 0.1 + fi * 0.06 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleMessage(f)}
                            className="glass-stroke-sm bg-surface-container inline-flex items-center px-3 py-1.5 rounded-full text-on-surface text-xs font-medium transition-colors"
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
                  <div className="glass-stroke bg-surface-container rounded-shape-lg px-4 py-3">
                    <div className="flex items-center space-x-1.5">
                      {[0, 0.2, 0.4].map((d) => (
                        <motion.div
                          key={d}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: d }}
                          className="w-1.5 h-1.5 bg-on-surface rounded-full"
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
        onClose={heroProject || showProfile ? leaveChat : undefined}
        onFilter={!hasStarted && !showProfile && !heroProject ? () => setFilterOpen((o) => !o) : undefined}
        filterOpen={filterOpen}
        filters={PROJECT_FILTERS}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onProfile={!showProfile && !heroProject ? (origin) => { setChatOnTop(false); setFilterOpen(false); setProfileOrigin(origin ?? null); setShowProfile(true); } : undefined}
        onFocusInput={reopenChat}
      />
    </main>
  );
}
