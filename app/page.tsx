"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from "@/components/ChatInput";
import FolderCard from "@/components/FolderCard";
import ProjectDetailView from "@/components/ProjectDetailView";
import TypewriterText from "@/components/TypewriterText";
import RecruiterBriefing from "@/components/RecruiterBriefing";
import ProfileCard from "@/components/ProfileCard";
import { Project } from "@/components/ProjectCard";
import { FolderOpen, User, Mail, Send, Linkedin, Github, Zap, FileText, ArrowUpRight } from "lucide-react";
import { useThemeStore } from "@/lib/theme-store";
import { Chip } from "@/components/material/Chip";
import { ProjectField } from "@/components/material/ProjectField";
import { springs } from "@/lib/material/motion";

// Apple-style easing curves
const appleEasing = [0.16, 1, 0.3, 1] as const; // Smooth ease-out
const appleSpring = {
  type: "spring",
  damping: 30,
  stiffness: 300,
} as const;

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
    github: "https://github.com/YeYen1721/sentinel",
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
    date: "2025",
    image: "/projects/nameme/nmmainfin.jpg",
    icon: "/projects/nameme/nmmainfin.jpg",
    overview: "From ideation to a high-fidelity concept.",
    gallery: ["/projects/nameme/nmmainfin.jpg", "/projects/nameme/nmhificoncept.png", "/projects/nameme/nmmidfi.png", "/projects/nameme/nmlowfi.png"]
  },
];

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

// Detect what an AI message refers to, so we can offer a redirect button
function detectTarget(text: string): Project | "profile" | null {
  const lower = text.toLowerCase();
  const proj = MAIN_PROJECTS.find((p) => lower.includes(p.title.toLowerCase()));
  if (proj) return proj;
  if (/\b(profile|resume|hire me|contact me|reach me|email me)\b/.test(lower)) return "profile";
  return null;
}

// Interface to store content snapshot for each message
interface ContentSnapshot {
  messageId: string;
  contentType: "projects" | "about" | "contact" | "recruiter" | null;
  projects?: Project[];
  selectedProject?: Project | null;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [contentType, setContentType] = useState<"projects" | "about" | "contact" | "recruiter" | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectMessageId, setSelectedProjectMessageId] = useState<string | null>(null);
  const [heroProject, setHeroProject] = useState<Project | null>(null);
  const [showGlobe, setShowGlobe] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [detailFocus, setDetailFocus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);
  const [currentContext, setCurrentContext] = useState<string>("Home");
  const [followUpChips, setFollowUpChips] = useState<string[]>([]);
  const [contentHistory, setContentHistory] = useState<ContentSnapshot[]>([]);
  const [showResume, setShowResume] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { activeThemeColor, setActiveThemeColor } = useThemeStore();

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
  }, [messages, contentHistory]);

  const handleMessage = async (message: string) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    // Sending a message returns to the conversation view (close any open overlay)
    setShowGlobe(false);
    setShowProfile(false);
    setHeroProject(null);
    setShowResume(false);
    console.log('Sending message:', message);

    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
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

      // Check if we should show project cards or profile
      setTimeout(() => {
        const userMessageLower = message.toLowerCase();
        const responseLower = fullText.toLowerCase();

        // Show projects when:
        // 1. User explicitly asks about projects/work/portfolio/design
        // 2. OR AI's response lists multiple projects
        const userAsksProjects = /\b(projects?|my work|portfolio|what.*built|show.*work|design work|what.*design|your work|examples?)\b/i.test(message);

        const projectIndicators = [
          'sentinel',
          'portfolio ai',
          'mindline',
          'flux website',
          'which one are you interested in',
          'which project',
          'here are my projects',
          'project card below',
          'click on the',
          'check out the'
        ];

        const aiListsProjects = projectIndicators.filter(indicator =>
          responseLower.includes(indicator)
        ).length >= 2;

        if (userAsksProjects || aiListsProjects) {
          setProjects(MAIN_PROJECTS);
          setContentType('projects');

          setContentHistory(prev => [
            ...prev,
            {
              messageId: assistantId,
              contentType: 'projects',
              projects: MAIN_PROJECTS,
              selectedProject: null
            }
          ]);
        }

        // Show profile only when AI explicitly says to see profile below
        // This prevents showing profile when asking "about the interface" etc.
        const profileIndicators = [
          'you can see my full profile below',
          'see my full profile',
          'profile below'
        ];

        const shouldShowProfile = profileIndicators.some(indicator =>
          responseLower.includes(indicator)
        );

        if (shouldShowProfile) {
          setContentType('about');

          setContentHistory(prev => [
            ...prev,
            {
              messageId: assistantId,
              contentType: 'about',
              projects: [],
              selectedProject: null
            }
          ]);
        }
      }, 500);

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

  const handleRecruiterMode = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setContentType("recruiter");
    setCurrentContext("Recruiter");
    setFollowUpChips([]);
    setActiveThemeColor(null); // Reset to default theme
  };

  const handleReset = () => {
    // First trigger animations by clearing messages
    setMessages([]);
    setContentHistory([]);

    // Then after a delay, reset everything else
    setTimeout(() => {
      setHasStarted(false);
      setProjects([]);
      setContentType(null);
      setSelectedProject(null);
      setSelectedProjectMessageId(null);
      setActiveThemeColor(null);
      setFollowUpChips([]);
      setShowGlobe(false);
    }, 300);
  };

  // Leave the chat view but KEEP the conversation history (reload clears it)
  const leaveChat = () => {
    setHasStarted(false);
    setShowGlobe(false);
    setShowProfile(false);
    setHeroProject(null);
    setShowResume(false);
  };

  // Re-open the chat (with history) when the user re-engages the composer
  const reopenChat = () => {
    if (messages.length > 0) setHasStarted(true);
  };

  // Update theme when viewing a project detail
  useEffect(() => {
    const active = selectedProject ?? heroProject;
    if (active && active.themeColor) {
      setActiveThemeColor(active.themeColor);
    } else if (!active && contentType !== "projects") {
      setActiveThemeColor(null);
    }
  }, [selectedProject, heroProject, contentType, setActiveThemeColor]);

  // Get background color with opacity based on active theme
  const getBackgroundStyle = () => {
    if (!activeThemeColor) {
      return "bg-surface-container";
    }

    // Convert hex to RGB and apply low opacity
    const hex = activeThemeColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.05)`,
    };
  };

  return (
    <main className="h-screen flex flex-col bg-surface overflow-hidden justify-center">

      {/* Landing splash - a clean monochrome mark springs in (sticky), then launches away */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-surface"
          >
            <motion.div
              initial={{ scale: 0, rotate: -18, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 11, mass: 0.9 }}
              className="relative w-20 h-20 rounded-[22px] bg-on-surface flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
            >
              {/* breathing ring */}
              <motion.span
                animate={{ scale: [0.7, 1.05, 0.7], opacity: [0.9, 0.2, 0.9] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-9 h-9 rounded-full border-2 border-surface"
              />
              {/* core dot */}
              <motion.span
                animate={{ scale: [1, 0.6, 1] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                className="w-2.5 h-2.5 rounded-full bg-surface"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Globe-mode captions (the grid<->globe morph itself lives in the hero) */}
      <AnimatePresence>
        {showGlobe && !hasStarted && (
          <motion.div
            key="globe-captions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none"
          >
            <p className="fixed top-10 left-1/2 -translate-x-1/2 z-[56] font-sf-mono uppercase tracking-normal text-[11px] text-on-surface-variant">
              {MAIN_PROJECTS.length} projects &amp; counting
            </p>
            <p className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[56] font-sf-mono uppercase tracking-normal text-[10px] text-on-surface-variant/70">
              drag to spin · tap to open
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project detail opened from the home screen - full-screen overlay */}
      <AnimatePresence>
        {heroProject && (
          <motion.div
            key="hero-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-surface"
          >
            <div className="max-w-3xl mx-auto px-4 pt-16 pb-28">
              <ProjectDetailView
                project={heroProject}
                onBack={() => setHeroProject(null)}
                hideBack
                focusQuery={detailFocus}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile - full-screen overlay */}
      <AnimatePresence>
        {showProfile && (() => {
          const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
          const vh = typeof window !== "undefined" ? window.innerHeight : 900;
          return (
          <motion.div
            key="profile"
            className="fixed z-[70] left-1/2 bottom-0 bg-surface overflow-hidden"
            style={{ x: "-50%" }}
            initial={{ width: 56, height: 56, borderRadius: 28 }}
            animate={{ width: [56, vw, vw], height: [56, 56, vh], borderRadius: [28, 28, 0] }}
            exit={{ width: [vw, vw, 56], height: [vh, 56, 56], borderRadius: [0, 28, 28], opacity: [1, 1, 0] }}
            transition={{ duration: 0.62, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 overflow-y-auto"
            >
            <div className="max-w-2xl mx-auto px-4 pt-16 pb-28">

              <ProfileCard
                name={PERSONAL_INFO.name}
                title={PERSONAL_INFO.title}
                bio={PERSONAL_INFO.bio}
                email={PERSONAL_INFO.email}
                linkedin={PERSONAL_INFO.linkedin}
              />

              <div className="mt-4 bg-surface-container rounded-shape-lg p-6">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setShowResume(!showResume)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface rounded-shape-md font-medium transition-all"
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
                      <div className="border border-outline-variant rounded-shape-md overflow-hidden bg-surface-container-high">
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
          </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Header - moves to top when chat starts */}
      <motion.div
        animate={{
          flex: hasStarted ? "0 0 auto" : "0 0 auto",
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={`px-4 flex items-center justify-center relative z-50 ${hasStarted ? 'pt-4 pb-2' : 'pt-8 pb-0'}`}
        style={{ background: 'transparent' }}
      >
      </motion.div>

      {/* Project field - always dead-center; stays visible behind the chat */}
      <motion.div
        animate={{ opacity: hasStarted ? 0.5 : 1, scale: hasStarted ? 0.96 : 1 }}
        transition={springs.spatialDefault}
        className="fixed inset-0 z-[10] flex items-center justify-center pointer-events-none"
      >
        <div className="pointer-events-auto">
          <ProjectField
            projects={MAIN_PROJECTS}
            mode={showGlobe ? "globe" : "grid"}
            onSelectProject={(project) => {
              setShowProfile(false);
              setDetailFocus(null);
              setHeroProject(project);
              setCurrentContext(`Project: ${project.title}`);
            }}
          />
        </div>
      </motion.div>

      {/* Click-outside catcher - leaving the chat keeps history (only reload clears it) */}
      {hasStarted && (messages.length > 0 || isStreaming) && (
        <div className="fixed inset-0 z-[34]" onClick={leaveChat} aria-hidden />
      )}

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
            className="fixed left-1/2 -translate-x-1/2 z-[35] w-full max-w-2xl px-4 overflow-y-auto scroll-smooth"
            style={{
              bottom: 116,
              maxHeight: "calc(100dvh - 220px)",
              WebkitMaskImage: "linear-gradient(to top, #000 82%, transparent 100%)",
              maskImage: "linear-gradient(to top, #000 82%, transparent 100%)",
            }}
          >
            <div className="flex min-h-full flex-col justify-end gap-3 pb-7">
              {messages.map((msg, mi) => {
                const isUser = msg.role === "user";
                const target = !isUser ? detectTarget(msg.content) : null;
                const question = mi > 0 ? messages[mi - 1]?.content ?? "" : "";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, filter: isUser ? "blur(0px)" : "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-shape-lg px-4 py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] ${
                        isUser
                          ? "bg-on-surface text-surface"
                          : "bg-surface-container text-on-surface border border-outline-variant"
                      }`}
                    >
                      {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <>
                          <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-semibold prose-headings:text-on-surface prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-p:my-1.5 prose-p:text-on-surface prose-p:text-sm prose-p:leading-[1.55] prose-strong:text-on-surface prose-strong:font-semibold prose-code:text-on-surface prose-code:bg-surface-container-high prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-surface-container-high prose-pre:border prose-pre:border-outline-variant prose-pre:rounded-lg prose-pre:p-3 prose-pre:my-2 prose-pre:overflow-x-auto prose-ul:my-1.5 prose-ul:text-sm prose-ol:my-1.5 prose-ol:text-sm prose-li:my-0.5 prose-li:text-on-surface prose-li:leading-[1.55] prose-a:text-on-surface prose-a:underline prose-a:font-medium">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                          {target && (
                            <motion.button
                              type="button"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15, duration: 0.3 }}
                              onClick={() => {
                                if (target === "profile") {
                                  setShowProfile(true);
                                } else {
                                  setShowProfile(false);
                                  setDetailFocus(question);
                                  setHeroProject(target);
                                  setCurrentContext(`Project: ${target.title}`);
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
                  <div className="rounded-shape-lg px-4 py-3 bg-surface-container border border-outline-variant shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
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

      {/* Fixed Bottom Section - Buttons and Input */}
      <motion.div
        className="pointer-events-none z-30"
        animate={{
          position: hasStarted ? "fixed" : "relative",
          bottom: hasStarted ? 0 : "auto",
          left: hasStarted ? 0 : "auto",
          right: hasStarted ? 0 : "auto",
        }}
        style={{
          paddingBottom: hasStarted ? (isMobile ? "5.5rem" : "6.75rem") : "0.75rem",
          paddingTop: hasStarted ? "0" : "0",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 pointer-events-auto">
          {/* Follow-up Suggestion Chips */}
          <AnimatePresence>
            {followUpChips.length > 0 && hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-2 justify-center mb-6"
              >
                {followUpChips.map((chip) => (
                  <Chip key={chip} onClick={() => handleMessage(chip)}>
                    {chip}
                  </Chip>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* Floating Input (rendered by ChatInput component itself) */}
      <ChatInput
        onSend={handleMessage}
        hasStarted={hasStarted}
        connectorKind={heroProject ? "project" : showProfile ? "profile" : showGlobe ? "globe" : hasStarted ? "chat" : null}
        connectorSrc={heroProject ? (heroProject.icon ?? heroProject.image) : undefined}
        onConnector={
          heroProject
            ? () => setHeroProject(null)
            : showProfile
            ? () => { setShowProfile(false); setShowResume(false); }
            : showGlobe
            ? () => setShowGlobe(false)
            : hasStarted
            ? leaveChat
            : undefined
        }
        onToggleAll={!hasStarted && !showProfile && !showGlobe && !heroProject ? () => setShowGlobe(true) : undefined}
        onProfile={!showProfile && !showGlobe && !heroProject ? () => setShowProfile(true) : undefined}
        onFocusInput={reopenChat}
      />
    </main>
  );
}
