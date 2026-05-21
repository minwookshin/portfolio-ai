"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from "@/components/ChatInput";
import FolderCard from "@/components/FolderCard";
import ProjectDetailView from "@/components/ProjectDetailView";
import TypewriterText from "@/components/TypewriterText";
import RecruiterBriefing from "@/components/RecruiterBriefing";
import ProfileCard from "@/components/ProfileCard";
import { Project } from "@/components/ProjectCard";
import { FolderOpen, User, Mail, Send, Linkedin, Github, Zap, FileText } from "lucide-react";
import { useThemeStore } from "@/lib/theme-store";
import { Eyebrow } from "@/components/material/Eyebrow";
import { Chip } from "@/components/material/Chip";
import { springs } from "@/lib/material/motion";

// Apple-style easing curves
const appleEasing = [0.16, 1, 0.3, 1]; // Smooth ease-out
const appleSpring = {
  type: "spring",
  damping: 30,
  stiffness: 300,
};

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
    icon: "/projects/sentinel-icon.png",
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
      { type: 'text', content: "Static portfolios create an information bottleneck. Recruiters need specific answers—\"How did you handle state management?\" or \"Why Next.js?\"—but they're stuck reading 15-page case studies. This AI agent solves that: natural language queries return precise, contextualized answers about my projects and design rationale in real-time." },
      { type: 'text', content: "Technical Stack Optimized for Conversational UX" },
      { type: 'text', content: "• **Next.js 16 (App Router):** Moved data fetching to the server, reducing client-side hydration time by 40%.\n• **Streaming via SSE:** Implemented Server-Sent Events to stream Gemini responses token-by-token, creating a natural conversational rhythm without loading spinners.\n• **Edge Runtime:** API routes run on global Edge Network, ensuring <200ms response times regardless of user geography." },
      { type: 'gallery', images: [{ image: "/projects/portfolio-ai/architecture.png", caption: "System Architecture" }] },
      { type: 'text', content: "Key Features" },
      { type: 'text', content: "**Streaming Responses + Structured Data Rendering**\n\n• **Fluidity:** Server-Sent Events deliver responses token-by-token, mimicking human typing. No \"loading...\" states—just natural flow.\n• **Structured Output:** Responses render as Markdown with syntax-highlighted code and formatted tables. Complex technical answers become scannable, visual information, reducing cognitive load." },
      { type: 'text', content: "**Enterprise-Ready Security Architecture**\n\n• **Server-Side API Key Protection:** Keys never touch the browser; all requests route via Next.js API Routes.\n• **Rate Limiting:** Implemented request throttling (10 req/min) to prevent abuse and DDoS attacks.\n• **Environment Isolation:** Sensitive credentials stored in secure server-only environments, mirroring production standards." },
      { type: 'text', content: "**Impact: Bridging Design, Engineering, and Product Strategy**\n\n• **LLM Integration at Scale:** Delivered a streaming AI chat interface with enterprise-grade security and sub-100ms latency.\n• **Cost-Efficient Architecture:** Reduced token usage by 35% through prompt optimization, cutting API costs without sacrificing UX.\n• **Design + Engineering Fusion:** Unified visual polish (Framer Motion) with technical rigor (RSC)—proving full-stack ownership." }
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

  // Use Vercel AI SDK's useChat hook for Gemini integration
  const { messages, setMessages, status, error } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error);
      // Show user-friendly error message
      const errorMessage = error.message.includes('quota')
        ? 'AI chat is temporarily unavailable due to rate limits. Please try again in a moment.'
        : 'Unable to connect to AI chat. Please check your connection and try again.';

      // Add error message to chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMessage
      }]);
    },
    onFinish: (message) => {
      console.log('Message finished:', message);
    },
    onToolCall: ({ toolCall }) => {
      console.log('Tool call:', toolCall);
      // Handle tool calls from Gemini
      if (toolCall.toolName === 'showProjects') {
        setContentType('projects');
        setProjects(MAIN_PROJECTS);
        setCurrentContext('Projects');
        setFollowUpChips(['Tell me about FLUX', 'Show me Telfair Museum', 'What technologies do you use?']);
      } else if (toolCall.toolName === 'openProject') {
        const projectId = toolCall.args.projectId;
        const project = MAIN_PROJECTS.find(p => p.id === projectId);
        if (project) {
          setSelectedProject(project);
          setCurrentContext(`Project: ${project.title}`);
        }
      } else if (toolCall.toolName === 'navigateTo') {
        const section = toolCall.args.section;
        setContentType(section as any);
        setCurrentContext(section.charAt(0).toUpperCase() + section.slice(1));
        if (section === 'about') {
          setFollowUpChips(['See my projects', 'What technologies do you use?', 'Contact me']);
        } else if (section === 'contact') {
          setFollowUpChips(['View my work', 'Learn about me', 'See my skills']);
        }
      } else if (toolCall.toolName === 'showRecruiterInfo') {
        setContentType('recruiter');
        setCurrentContext('Recruiter');
        setFollowUpChips([]);
      }
    },
    onFinish: () => {
      if (!hasStarted) {
        setHasStarted(true);
      }
    }
  });

  // Debug: Log messages whenever they change
  useEffect(() => {
    console.log('Messages updated:', messages);
    messages.forEach((msg, i) => {
      console.log(`Message ${i}:`, {
        id: msg.id,
        role: msg.role,
        content: msg.content,
        contentLength: msg.content?.length
      });
    });
    console.log('Status:', status);
    console.log('Error:', error);
  }, [messages, status, error]);

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
    console.log('Sending message:', message);

    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMsg]);

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
    }, 300);
  };

  // Update theme when viewing a project detail
  useEffect(() => {
    if (selectedProject && selectedProject.themeColor) {
      setActiveThemeColor(selectedProject.themeColor);
    } else if (!selectedProject && contentType !== "projects") {
      setActiveThemeColor(null);
    }
  }, [selectedProject, contentType, setActiveThemeColor]);

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

      {/* Header - moves to top when chat starts */}
      <motion.div
        animate={{
          flex: hasStarted ? "0 0 auto" : "0 0 auto",
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={`px-4 flex items-center justify-center relative z-50 ${hasStarted ? 'pt-4 pb-2' : 'pt-8 pb-0'}`}
        style={{ background: 'transparent' }}
      >
        {hasStarted ? (
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={appleSpring}
            className="text-2xl font-light text-on-surface hover:text-on-surface-variant transition-colors lowercase"
          >
            minwook
          </motion.button>
        ) : (
          <div className="text-center space-y-3 mb-6">
            <h1 className="text-4xl sm:text-5xl font-light text-on-surface tracking-tight">hi, i&apos;m minwook</h1>
            <Eyebrow>meet minwook junior</Eyebrow>
          </div>
        )}
      </motion.div>

      {/* Chat Messages - only visible when started */}
      <AnimatePresence mode="wait">
        {hasStarted && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-y-auto scroll-smooth"
          >
            <div className="max-w-3xl mx-auto px-4 pt-0 pb-40">
              {/* Chat Messages and Content interwoven */}
              <div className="space-y-4 mb-8">
                {messages.map((msg, index) => (
                  <div key={msg.id}>
                    {/* Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ ...springs.spatialDefault, delay: index * 0.05 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={springs.spatialFast}
                        className={`max-w-[85%] sm:max-w-[80%] rounded-shape-lg px-4 sm:px-5 py-3 transition-all duration-300 ${
                          msg.role === "user"
                            ? "bg-on-surface text-surface"
                            : "bg-surface-container text-on-surface"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-headings:font-semibold prose-headings:text-on-surface prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-p:my-2 prose-p:text-on-surface prose-p:text-sm prose-p:leading-[1.6] prose-strong:text-on-surface prose-strong:font-semibold prose-code:text-on-surface prose-code:bg-surface-container-high prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-surface-container-high prose-pre:border prose-pre:border-outline-variant prose-pre:rounded-lg prose-pre:p-3 prose-pre:my-3 prose-pre:overflow-x-auto prose-ul:my-2 prose-ul:text-sm prose-ol:my-2 prose-ol:text-sm prose-li:my-1 prose-li:text-on-surface prose-li:leading-[1.6] prose-a:text-on-surface prose-a:underline prose-a:font-medium prose-img:rounded-xl prose-img:shadow-md prose-img:my-4 prose-img:border prose-img:border-outline-variant">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                img: ({node, ...props}) => (
                                  <img
                                    {...props}
                                    className="rounded-xl shadow-md border border-outline-variant my-4 w-full max-w-2xl"
                                    loading="lazy"
                                  />
                                )
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </motion.div>
                    </motion.div>

                    {/* Show content from history if it exists for this message */}
                    {msg.role === "assistant" && (() => {
                      const snapshot = contentHistory.find(c => c.messageId === msg.id);
                      if (!snapshot) return null;

                      return (
                        <AnimatePresence mode="wait">
                          {selectedProject && selectedProjectMessageId === msg.id ? (
                            <ProjectDetailView
                              project={selectedProject}
                              onBack={() => {
                                setSelectedProject(null);
                                setSelectedProjectMessageId(null);
                              }}
                            />
                          ) : snapshot.contentType === "projects" && snapshot.projects && snapshot.projects.length > 0 ? (
                            <motion.div
                              key="projects"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              {snapshot.projects.map((project, index) => (
                                <FolderCard
                                  key={project.id}
                                  project={project}
                                  index={index}
                                  onViewDetails={(proj) => {
                                    setSelectedProject(proj);
                                    setSelectedProjectMessageId(msg.id);
                                  }}
                                />
                              ))}
                            </motion.div>
                          ) : (snapshot.contentType === "about" || snapshot.contentType === "contact") ? (
                            <div key="about-contact" className="space-y-4">
                              {/* Profile Card with Photo */}
                              <ProfileCard
                                name={PERSONAL_INFO.name}
                                title={PERSONAL_INFO.title}
                                bio={PERSONAL_INFO.bio}
                                email={PERSONAL_INFO.email}
                                linkedin={PERSONAL_INFO.linkedin}
                              />

                              {/* Resume Section */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="bg-surface-container rounded-shape-lg p-6 transition-all duration-300"
                              >
                                {/* Resume Buttons */}
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    <motion.button
                                      onClick={() => setShowResume(!showResume)}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-on-surface hover:opacity-90 text-surface rounded-xl font-medium transition-all duration-200"
                                    >
                                      <FileText className="w-4 h-4" />
                                      {showResume ? 'Hide Resume' : 'View Resume'}
                                    </motion.button>
                                    <motion.a
                                      href="/resume.2025dec.pdf"
                                      download="Minwook_Shin_Resume.pdf"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high hover:opacity-90 text-on-surface rounded-shape-md font-medium transition-all duration-200"
                                    >
                                      <FileText className="w-4 h-4" />
                                      Download PDF
                                    </motion.a>
                                  </div>

                                  {/* Resume Display */}
                                  <AnimatePresence>
                                    {showResume && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
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
                              </motion.div>
                            </div>
                          ) : snapshot.contentType === "recruiter" ? (
                            <RecruiterBriefing key="recruiter" />
                          ) : null}
                        </AnimatePresence>
                      );
                    })()}
                  </div>
                ))}

                {/* Loading indicator */}
                {status === 'loading' && (
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: appleEasing }}
                    className="flex justify-start"
                  >
                    <div className="bg-surface-container rounded-shape-lg px-5 py-3">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 bg-on-surface rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-on-surface rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-on-surface rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
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

          {/* Shortcut Buttons */}
          <div className={`flex flex-wrap gap-2 justify-center ${hasStarted ? 'mb-0.5 sm:mb-3' : 'mb-3'}`}>
            <Chip leadingIcon={<FolderOpen className="w-3.5 h-3.5" />} onClick={() => handleMessage("projects")}>
              projects
            </Chip>
            <Chip leadingIcon={<User className="w-3.5 h-3.5" />} onClick={() => handleMessage("about minwook")}>
              about me
            </Chip>
          </div>
        </div>
      </motion.div>

      {/* Floating Input (rendered by ChatInput component itself) */}
      <ChatInput onSend={handleMessage} hasStarted={hasStarted} />
    </main>
  );
}
