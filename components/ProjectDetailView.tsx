"use client";

import { motion } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShieldIcon from '@mui/icons-material/Shield';
import PaletteIcon from '@mui/icons-material/Palette';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Project } from "./ProjectCard";

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12"
    >
      {/* Back Button - at the top */}
      <motion.button
        onClick={onBack}
        whileHover={{ x: -4 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 text-gray-600 hover:text-[#292A2E] mb-6 transition-colors"
      >
        <ArrowBackIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Back to projects</span>
      </motion.button>

      {/* Project Overview Section */}
      <div className="bg-white border border-gray-200 rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 md:p-12 mb-6 shadow-sm">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Left: Project Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl relative overflow-hidden flex items-center justify-center">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="max-w-full max-h-[70%] object-contain"
                />
              ) : (
                <>
                  {/* Subtle pattern for placeholder */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-8 left-8 w-32 h-32 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-8 right-8 w-40 h-40 bg-gray-300 rounded-full blur-3xl" />
                  </div>

                  {/* Project title overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-4xl font-bold text-gray-400/50">{project.title}</h2>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Project Overview */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-bold text-[#292A2E] mb-4">
              Project Overview
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              {project.overview || project.fullDescription || project.description}
            </p>

            {/* Meta Info */}
            <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">role</p>
                <p className="text-sm text-[#292A2E] font-medium">{project.role || "Designer & Developer"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">timeline</p>
                <p className="text-sm text-[#292A2E] font-medium">{project.timeline || project.date}</p>
              </div>
              {project.team && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">team</p>
                  <p className="text-sm text-[#292A2E] font-medium">{project.team}</p>
                </div>
              )}
            </div>

            {/* Technologies */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">technologies</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-700 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            {project.link && (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#292A2E] hover:bg-[#3C3C3C] text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 mt-8 self-start"
              >
                <OpenInNewIcon className="w-4 h-4" />
                View Live Project
              </motion.a>
            )}
          </div>
        </div>
      </div>


      {/* Content Sections */}
      {project.contentSections && project.contentSections.length > 0 && (
        <div className="space-y-12 sm:space-y-16 md:space-y-24">
          {project.contentSections.map((section, index) => {
            if (section.type === 'text') {
              const isHeading = section.content && section.content.length < 50 && /^[A-Z]/.test(section.content);

              // Special handling for Portfolio AI project - PREMIUM REDESIGN
              if (project.id === "2") {
                // Hero Section - Immersive Full-Width Split Layout
                if (section.content === "Hero") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-16"
                    >
                      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-12 sm:py-20 md:py-32">
                        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
                          {/* Left: Large Typography */}
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                              className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-black/5 rounded-full mb-4 sm:mb-6"
                            >
                              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Full-Stack Engineering Case Study
                              </span>
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#0a0a0a] mb-4 sm:mb-6 leading-[1.1]">
                              Portfolio AI
                            </h1>

                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 font-light mb-6 sm:mb-8 leading-relaxed">
                              A self-operating AI (me!!), built with Next.js, React, and Gemini API
                            </p>

                            <div className="space-y-4 mb-8">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full" />
                                <p className="text-base text-gray-600">Full-Stack Developer & Designer</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full" />
                                <p className="text-base text-gray-600">Zero-latency streaming • Real-time AI responses</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full" />
                                <p className="text-base text-gray-600">Military-grade security architecture</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {["Next.js 16", "React 19", "Gemini 2.0 Flash", "TypeScript"].map((tag, i) => (
                                <motion.span
                                  key={tag}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                                  className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>

                          {/* Right: Floating Browser Mockup */}
                          <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                          >
                            {/* Floating effect background blur */}
                            <div className="absolute inset-0 bg-[#D71921]/10 rounded-3xl blur-3xl transform scale-110" />

                            {/* Browser mockup */}
                            <div className="relative">
                              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                                {/* Browser chrome */}
                                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                                  <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#D71921]" />
                                    <div className="w-3 h-3 rounded-full bg-[#F5C542]" />
                                    <div className="w-3 h-3 rounded-full bg-[#2D5C3F]" />
                                  </div>
                                  <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-xs text-gray-500 mx-4">
                                    minwook.dev
                                  </div>
                                </div>

                                {/* Chat interface mockup */}
                                <div className="p-6 bg-[#F5F5F0] h-96 flex flex-col">
                                  <div className="flex-1 space-y-4">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-full bg-[#D71921] flex items-center justify-center flex-shrink-0">
                                        <FlashOnIcon className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[75%]">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                          Hey! I'm Minwook's AI. Ask me anything about his work, skills, or projects!
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-end gap-3 justify-end">
                                      <div className="bg-[#292A2E] rounded-2xl rounded-br-sm px-4 py-3 shadow-sm max-w-[75%]">
                                        <p className="text-sm text-white leading-relaxed">
                                          Tell me about the Sentinel project
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-full bg-[#D71921] flex items-center justify-center flex-shrink-0 animate-pulse">
                                        <FlashOnIcon className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Problem & Solution - Premium Bento Grid
                if (section.content === "Breaking the Static Portfolio Barrier") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24"
                    >
                      {/* Section Header */}
                      <div className="mb-12">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          Breaking the Static Portfolio Barrier
                        </h2>
                        <p className="text-lg text-gray-600">
                          From passive documents to active intelligence
                        </p>
                      </div>

                      {/* Content Card */}
                      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200">
                        <p className="text-lg text-gray-700 leading-relaxed">
                          Static portfolios create an information bottleneck. Recruiters need specific answers—"How did you handle state management?" or "Why Next.js?"—but they're stuck reading 15-page case studies. This AI agent solves that: natural language queries return precise, contextualized answers about my projects and design rationale in real-time.
                        </p>
                      </div>
                    </motion.div>
                  );
                }

                // Skip next section (the paragraph text) - it's displayed in the card above
                if (index > 0 && project.contentSections[index - 1]?.content === "Breaking the Static Portfolio Barrier") return null;

                // Technical Stack - Premium Architecture Cards
                if (section.content === "Technical Stack Optimized for Conversational UX") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24"
                    >
                      {/* Section Header */}
                      <div className="mb-6">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          Technical Stack Optimized for Conversational UX
                        </h2>
                        <p className="text-lg text-gray-600">
                          Engineering decisions that enable sub-200ms global response times
                        </p>
                      </div>

                      {/* Architecture Grid */}
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Next.js 16 Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200"
                        >
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">Stack Layer 01</p>
                          <h3 className="text-xl font-bold text-[#0a0a0a] mb-4">Next.js 16 (App Router)</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Moved data fetching to the server, reducing client-side hydration time by <span className="font-bold text-gray-800">40%</span>.
                          </p>
                        </motion.div>

                        {/* SSE Streaming Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200"
                        >
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">Stack Layer 02</p>
                          <h3 className="text-xl font-bold text-[#0a0a0a] mb-4">Streaming via SSE</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Implemented Server-Sent Events to stream Gemini responses token-by-token, creating a natural conversational rhythm <span className="font-bold text-gray-800">without loading spinners</span>.
                          </p>
                        </motion.div>

                        {/* Edge Runtime Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200"
                        >
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">Stack Layer 03</p>
                          <h3 className="text-xl font-bold text-[#0a0a0a] mb-4">Edge Runtime</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            API routes run on global Edge Network, ensuring <span className="font-bold text-gray-800">&lt;200ms response times</span> regardless of user geography.
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                }

                // Skip next 2 sections (bullet points and gallery) as they're handled above
                if (index > 0 && project.contentSections[index - 1]?.content === "Technical Stack Optimized for Conversational UX") return null;
                if (index > 0 && project.contentSections[index - 2]?.content === "Technical Stack Optimized for Conversational UX") return null;

                // Key Features - Alternating Showcase
                if (section.content === "Key Features") {
                  const features = [
                    {
                      icon: FlashOnIcon,
                      title: "Streaming Responses + Structured Data Rendering",
                      description: "Server-Sent Events deliver responses token-by-token, mimicking human typing. No \"loading...\" states—just natural flow. Responses render as Markdown with syntax-highlighted code and formatted tables, reducing cognitive load.",
                      color: "from-yellow-500 to-orange-500",
                      mockup: (
                        <div className="p-6 space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <FlashOnIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex-1">
                              <div className="space-y-2">
                                <div className="h-2 bg-gray-200 rounded-full w-full" />
                                <div className="h-2 bg-gray-200 rounded-full w-5/6" />
                                <div className="h-2 bg-gradient-to-r from-gray-400 to-transparent rounded-full w-2/3 animate-pulse" />
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-800 font-semibold mb-1">Performance Metrics</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-700">Time to First Token</span>
                                <span className="font-bold text-gray-900">&lt;100ms</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-700">Streaming Rate</span>
                                <span className="font-bold text-gray-900">~50 tokens/sec</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    },
                    {
                      icon: ShieldIcon,
                      title: "Enterprise-Ready Security Architecture",
                      description: "Keys never touch the browser; all requests route via Next.js API Routes. Implemented request throttling (10 req/min) to prevent abuse and DDoS attacks. Sensitive credentials stored in secure server-only environments, mirroring production standards.",
                      color: "from-red-500 to-pink-500",
                      mockup: (
                        <div className="p-6 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-green-900">API Key Protected</p>
                                <p className="text-xs text-green-700">Server-side only</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-green-900">Rate Limiting</p>
                                <p className="text-xs text-green-700">Prevents abuse</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-green-900">Environment Variables</p>
                                <p className="text-xs text-green-700">.env protection</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  ];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24 mt-32"
                    >
                      {/* Section Header */}
                      <div className="mb-16">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          Key Features
                        </h2>
                        <p className="text-lg text-gray-600">
                          Fluidity meets enterprise-grade security
                        </p>
                      </div>

                      {/* Feature Showcase */}
                      <div className="space-y-32">
                        {features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid md:grid-cols-2 gap-16 items-center"
                          >
                            {/* Text Content */}
                            <div className={featureIndex % 2 === 1 ? "md:order-2" : ""}>
                              <motion.div
                                initial={{ opacity: 0, x: featureIndex % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                              >
                                <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-[#2C3E50]">
                                  <span className="text-sm font-bold text-white uppercase tracking-wide">
                                    Feature {featureIndex + 1}
                                  </span>
                                </div>

                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0a0a0a] mb-6">
                                  {feature.title}
                                </h3>

                                <p className="text-lg text-gray-600 leading-relaxed">
                                  {feature.description}
                                </p>
                              </motion.div>
                            </div>

                            {/* Card Mockup */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 80 }}
                              className={`relative ${featureIndex % 2 === 1 ? "md:order-1" : ""}`}
                            >
                              {/* Card */}
                              <div className="relative">
                                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                                  {feature.mockup}
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                // Skip next 2 feature sections as they're handled above
                if (index > 0 && project.contentSections[index - 1]?.content === "Key Features") return null;
                if (index > 0 && project.contentSections[index - 2]?.content === "Key Features") return null;

                // Impact Section
                if (section.content && section.content.includes("**Impact: Bridging Design, Engineering, and Product Strategy**")) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24"
                    >
                      {/* Section Header */}
                      <div className="mb-12">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          Impact
                        </h2>
                        <p className="text-lg text-gray-600">
                          Bridging Design, Engineering, and Product Strategy
                        </p>
                      </div>

                      {/* Impact Cards Grid */}
                      <div className="grid md:grid-cols-3 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200"
                        >
                          <div className="mb-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <PsychologyIcon className="w-6 h-6 text-gray-700" />
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-[#0a0a0a] mb-3">LLM Integration at Scale</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Delivered a streaming AI chat interface with enterprise-grade security and sub-100ms latency.
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200"
                        >
                          <div className="mb-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <TrendingUpIcon className="w-6 h-6 text-gray-700" />
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-[#0a0a0a] mb-3">Cost-Efficient Architecture</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Reduced token usage by 35% through prompt optimization, cutting API costs without sacrificing UX.
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200"
                        >
                          <div className="mb-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <PaletteIcon className="w-6 h-6 text-gray-700" />
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-[#0a0a0a] mb-3">Design + Engineering Fusion</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Unified visual polish (Framer Motion) with technical rigor (RSC)—proving full-stack ownership.
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                }
              }

              // Special handling for Sentinel project - PREMIUM REDESIGN
              if (project.id === "1") {
                // Hero Section - Immersive Full-Width Split Layout
                if (section.content === "Hero") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-16"
                    >
                      <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 md:py-32">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                          {/* Left: Large Typography */}
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            {/* Winner Badge */}
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                              className="inline-flex items-center gap-3 px-6 py-3 bg-[#D71921] rounded-full mb-6 shadow-lg"
                            >
                              <EmojiEventsIcon className="w-5 h-5 text-white" />
                              <span className="text-sm font-bold text-white uppercase tracking-wide">
                                Winner • Google x SCAD FLUX 2025
                              </span>
                            </motion.div>

                            <h1 className="text-6xl md:text-7xl font-bold text-[#0a0a0a] mb-8 leading-[1.1]">
                              Sentinel
                            </h1>

                            <p className="text-2xl md:text-3xl text-gray-700 font-light mb-10 leading-relaxed">
                              Predictive home maintenance powered by climate risk AI
                            </p>

                            <div className="space-y-4 mb-10">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full" />
                                <p className="text-base text-gray-600">UX Engineer (Design → Code)</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full" />
                                <p className="text-base text-gray-600">48-hour hackathon sprint</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full" />
                                <p className="text-base text-gray-600">Native iOS app (Swift + SwiftUI)</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {["Swift", "SwiftUI", "Climate Data", "Predictive ML"].map((tag, i) => (
                                <motion.span
                                  key={tag}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                                  className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>

                          {/* Right: Floating Phone Mockup */}
                          <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                          >
                            {/* Floating effect background blur */}

                            {/* Phone mockup */}
                            <div className="max-w-sm mx-auto">
                              <img
                                src="/projects/sentinel/main.png"
                                alt="Sentinel Main Screen"
                                className="w-full h-auto"
                              />
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Problem Deep Dive - Bento Grid
                if (section.content === "Context") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24"
                    >
                      {/* Section Header */}
                      <div className="mb-12">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          The Problem
                        </h2>
                        <p className="text-lg text-gray-600">
                          Climate volatility meets reactive maintenance
                        </p>
                      </div>

                      {/* Bento Grid Layout */}
                      <div className="grid md:grid-cols-12 gap-6">
                        {/* Large Problem Statement - 8 columns */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="md:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200"
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 bg-[#D71921] rounded-2xl flex items-center justify-center flex-shrink-0">
                              <WarningIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-1">Core Issue</p>
                              <h3 className="text-2xl font-bold text-[#0a0a0a]">Reactive Crisis Management</h3>
                            </div>
                          </div>

                          <p className="text-xl font-light text-gray-700 leading-relaxed mb-8">
                            Homeowners manage their biggest asset based on <span className="font-bold text-gray-700">gut feeling</span>, not data.
                          </p>

                          <p className="text-base text-gray-700 leading-relaxed mb-6">
                            Climate volatility is the new normal. Invisible risks are ignored until they become $200,000 disasters.
                            A simple $100 inspection ignored today leads to catastrophic failure tomorrow.
                          </p>

                          {/* Stats Row */}
                          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                            <div>
                              <p className="text-sm text-gray-700 font-semibold mb-1 uppercase tracking-wide">Average Cost</p>
                              <p className="text-3xl font-black text-[#0a0a0a]">$200K+</p>
                              <p className="text-xs text-gray-600 mt-1">Storm damage ignored</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-700 font-semibold mb-1 uppercase tracking-wide">Prevention Cost</p>
                              <p className="text-3xl font-black text-gray-900">$100</p>
                              <p className="text-xs text-gray-600 mt-1">Basic inspection</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Persona Card - 4 columns */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="md:col-span-4 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200"
                        >
                          <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-4">Target PersonIcon</p>

                          <div className="mb-6">
                            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4 mx-auto">
                              <PersonIcon className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-[#0a0a0a] text-center mb-1">Alex, 35</h4>
                            <p className="text-sm text-gray-700 font-semibold text-center mb-4">Doctor • New Homeowner</p>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-gray-200">
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-700 leading-relaxed">
                                Moved into 2010 home
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-700 leading-relaxed">
                                Worries about hidden storm damage
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#D71921] rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                                Needs to stop guessing and start preventing
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                }

                // The Solution - Split Layout Showcase
                if (section.content === "Builder Process") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24 mt-32"
                    >
                      {/* Section Header */}
                      <div className="mb-16">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          The Builder Process
                        </h2>
                        <p className="text-lg text-gray-600">
                          Design → Code: Proving I'm a UX Engineer
                        </p>
                      </div>

                      {/* Split Layout */}
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Design in Figma */}
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="space-y-6"
                        >
                          <div className="inline-flex items-center px-5 py-3 bg-[#2C3E50] rounded-full">
                            <span className="text-sm font-bold text-white uppercase tracking-wide">
                              Designed in Figma
                            </span>
                          </div>

                          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
                            <div className="space-y-3">
                              <h4 className="text-lg font-bold text-[#0a0a0a]">Rapid Visual Prototyping</h4>
                              <p className="text-base text-gray-700 leading-relaxed">
                                Designed intuitive risk visualization interfaces under extreme time constraints.
                                Focus on clarity and emotional impact for high-stakes decision-making.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Right: Engineering in Swift */}
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="inline-flex items-center px-5 py-3 bg-[#2C3E50] rounded-full">
                            <span className="text-sm font-bold text-white uppercase tracking-wide">
                              Engineered in Swift
                            </span>
                          </div>

                          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
                            <div className="space-y-3">
                              <h4 className="text-lg font-bold text-[#0a0a0a]">Native iOS Implementation</h4>
                              <p className="text-base text-gray-700 leading-relaxed">
                                Built vulnerability scoring engine using Swift + SwiftUI. Integrated historical weather datasets
                                to calculate predictive risk scores in real-time.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                }

                // Key Features - Horizontal Scroll Showcase
                if (section.content === "Key Features") {
                  const features = [
                    {
                      title: "Historical Risk Timeline",
                      description: "Visualize past weather events and their financial impact on your property",
                      icon: TrendingUpIcon,
                      color: "from-red-500 to-orange-500",
                      mockup: (
                        <div className="max-w-sm mx-auto">
                          <img
                            src="/projects/sentinel/historical-timeline.png"
                            alt="Historical Risk Timeline"
                            className="w-full h-auto"
                          />
                        </div>
                      )
                    },
                    {
                      title: "Weather Alerts & Forecasting",
                      description: "Real-time weather alerts and climate forecasting to prepare for incoming storms and extreme weather events",
                      icon: ShieldIcon,
                      color: "from-blue-500 to-indigo-500",
                      mockup: (
                        <div className="max-w-sm mx-auto">
                          <img
                            src="/projects/sentinel/weather-alerts.png"
                            alt="Weather Alerts"
                            className="w-full h-auto"
                          />
                        </div>
                      )
                    },
                    {
                      title: "Actionable Maintenance Tasks",
                      description: "Prioritized checklist of preventive actions based on risk severity and urgency",
                      icon: CheckCircleIcon,
                      color: "from-emerald-500 to-teal-500",
                      mockup: (
                        <div className="max-w-sm mx-auto">
                          <img
                            src="/projects/sentinel/recommended-actions.png"
                            alt="Recommended Actions"
                            className="w-full h-auto"
                          />
                        </div>
                      )
                    }
                  ];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24 mt-32"
                    >
                      {/* Section Header */}
                      <div className="mb-16">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          Key Features
                        </h2>
                        <p className="text-lg text-gray-600">
                          Three pillars of predictive maintenance
                        </p>
                      </div>

                      {/* Feature Showcase */}
                      <div className="space-y-32">
                        {features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid md:grid-cols-2 gap-16 items-center"
                          >
                            {/* Text Content */}
                            <div className={featureIndex % 2 === 1 ? "md:order-2" : ""}>
                              <motion.div
                                initial={{ opacity: 0, x: featureIndex % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                              >
                                <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-[#2C3E50]">
                                  <span className="text-sm font-bold text-white uppercase tracking-wide">
                                    Feature {featureIndex + 1}
                                  </span>
                                </div>

                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0a0a0a] mb-6">
                                  {feature.title}
                                </h3>

                                <p className="text-lg text-gray-600 leading-relaxed">
                                  {feature.description}
                                </p>
                              </motion.div>
                            </div>

                            {/* Phone/Card Mockup */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 80 }}
                              className={featureIndex % 2 === 1 ? "md:order-1" : ""}
                            >
                              {feature.mockup}
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                // Demo Video Section
                if (section.content === "Demo Video") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24"
                    >
                      {/* Section Header */}
                      <div className="mb-12">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          Product Demo
                        </h2>
                        <p className="text-lg text-gray-600">
                          See Sentinel in action
                        </p>
                      </div>

                      {/* Video Player */}
                      <div className="aspect-video bg-black rounded-2xl overflow-hidden">
                        <video
                          controls
                          className="w-full h-full"
                          poster="/projects/sentinel/main.png"
                        >
                          <source src="/projects/sentinel/demo.mov" type="video/quicktime" />
                          <source src="/projects/sentinel/demo.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </motion.div>
                  );
                }

                // Outcome Section - FINAL IMPACT
                if (section.content === "Outcome") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-20"
                    >
                      <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-gray-200">
                        <div className="max-w-4xl">
                          {/* Icon + Badge */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                            className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-[#D71921] rounded-full shadow-lg"
                          >
                            <EmojiEventsIcon className="w-6 h-6 text-white" />
                            <span className="text-white font-bold uppercase tracking-wide">Winner • 1st Place</span>
                          </motion.div>

                          {/* Title */}
                          <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-6">
                            Outcome & Impact
                          </h2>

                          {/* Content */}
                          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                            <p>
                              <span className="font-bold text-[#0a0a0a]">Successfully shipped a fully functional iOS MVP</span> in a 48-hour hackathon sprint.
                              Validated the concept of <span className="italic">'Predictive Maintenance'</span> through real climate data integration and user testing.
                            </p>

                            <p>
                              Won <span className="font-semibold text-gray-700">1st Place at Google x SCAD FLUX Hackathon 2025</span>,
                              demonstrating the viability of combining climate risk analytics with homeowner protection strategies.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              }

              // Special handling for Mindline project - PREMIUM REDESIGN
              if (project.id === "3") {
                // Hero Section - Immersive Full-Width Split Layout
                if (section.content === "Hero") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-16"
                    >
                      <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 md:py-32">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                          {/* Left: Large Typography */}
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                              className="inline-block px-4 py-2 bg-black/5 rounded-full mb-6"
                            >
                              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Product Design Case Study
                              </span>
                            </motion.div>

                            <h1 className="text-6xl md:text-7xl font-bold text-[#0a0a0a] mb-6 leading-[1.1]">
                              Mindline
                            </h1>

                            <p className="text-2xl md:text-3xl text-gray-700 font-light mb-8 leading-relaxed">
                              Breaking the cycle: AI-powered intervention for betting addiction
                            </p>

                            <div className="space-y-4 mb-8">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
                                <p className="text-base text-gray-600">AI UX Designer & UX Researcher</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
                                <p className="text-base text-gray-600">10-week research & design sprint</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
                                <p className="text-base text-gray-600">Target: Young adults (18-26)</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {["AI Chatbot", "Behavioral Psychology", "Real-time Intervention"].map((tag, i) => (
                                <motion.span
                                  key={tag}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                                  className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>

                          {/* Right: Floating Phone Mockup */}
                          <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                          >
                            {/* Floating effect background blur */}

                            {/* Phone mockup */}
                            <div className="max-w-sm mx-auto">
                              <img
                                src="/projects/mindline/log.png"
                                alt="Emotional Logging"
                                className="w-full h-auto"
                              />
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Research Deep Dive - DATA VISUALIZATION BENTO GRID
                if (section.content === "Research Deep Dive") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-24"
                    >
                      {/* Section Header */}
                      <div className="mb-12">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          Research Deep Dive
                        </h2>
                        <p className="text-lg text-gray-600">
                          Double Diamond: <span className="font-semibold">Discover & Define</span>
                        </p>
                      </div>

                      {/* Bento Grid Layout */}
                      <div className="grid md:grid-cols-12 gap-6">
                        {/* Large Text Block - "The Silent Epidemic" */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="md:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200"
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 bg-[#D71921] rounded-2xl flex items-center justify-center flex-shrink-0">
                              <WarningIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-1">The Scope</p>
                              <h3 className="text-2xl font-bold text-[#0a0a0a]">The Silent Epidemic</h3>
                            </div>
                          </div>

                          <p className="text-base text-gray-700 leading-relaxed mb-8">
                            Young adults (18-26) face betting addiction fueled by mobile accessibility and aggressive marketing.
                            Current blocking tools are ineffective — users bypass them within minutes.
                          </p>

                          {/* Stats Row */}
                          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                            <div>
                              <p className="text-sm text-gray-700 font-semibold mb-1 uppercase tracking-wide">Primary Target</p>
                              <p className="text-3xl font-bold text-[#0a0a0a]">Males 18-26</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-700 font-semibold mb-1 uppercase tracking-wide">Access Point</p>
                              <p className="text-3xl font-bold text-[#0a0a0a]">Mobile Apps</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Big Bold Number - Interviews */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="md:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200 flex flex-col justify-between"
                        >
                          <div>
                            <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-2">Primary Research</p>
                            <h3 className="text-lg font-bold text-[#0a0a0a] mb-4">In-Depth PersonIcon Interviews</h3>
                          </div>

                          <div className="text-center my-8">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                              className="inline-block"
                            >
                              <p className="text-8xl font-black text-[#0a0a0a] leading-none mb-2">6</p>
                              <p className="text-lg text-gray-700 font-semibold">Participants</p>
                            </motion.div>
                          </div>

                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600 leading-relaxed italic">
                              "I tell myself it's just extra money, so losing doesn't feel real."
                            </p>
                          </div>
                        </motion.div>

                        {/* Age Range Data */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="md:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200 flex flex-col justify-between"
                        >
                          <div>
                            <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-2">Demographics</p>
                            <h3 className="text-lg font-bold text-[#0a0a0a] mb-4">Target Age Range</h3>
                          </div>

                          <div className="text-center my-8">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                            >
                              <p className="text-7xl font-black text-[#0a0a0a] leading-none mb-2">18–26</p>
                              <p className="text-lg text-gray-700 font-semibold">Years Old</p>
                            </motion.div>
                          </div>

                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              Peak vulnerability period for addiction formation
                            </p>
                          </div>
                        </motion.div>

                        {/* Expert Validation */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="md:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200"
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 bg-[#D71921] rounded-2xl flex items-center justify-center flex-shrink-0">
                              <PsychologyIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-1">Expert Validation</p>
                              <h3 className="text-2xl font-bold text-[#0a0a0a]">Psychological Insight</h3>
                            </div>
                          </div>

                          <div className="mb-6">
                            <p className="text-sm text-gray-700 font-bold mb-2">Dr. Kristen Adams, Clinical Psychologist</p>
                            <blockquote className="text-xl text-gray-700 leading-relaxed font-light italic border-l-4 border-gray-400 pl-6">
                              "Social environments and peer pressure are the primary triggers for relapse.
                              We need real-time intervention, not reactive restriction."
                            </blockquote>
                          </div>

                          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <p className="text-sm text-gray-600">SME Interview conducted March 2025</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                }

                // The Solution - STICKY SCROLL SHOWCASE (2-Column Layout)
                if (section.content === "The Solution") {
                  const features = [
                    {
                      title: "Personalized AI Suggestions",
                      description: "When high-risk triggers are detected, the AI provides personalized intervention strategies. Users receive contextual recommendations like setting pause timers, muting bet triggers during social events, or reflecting on past betting patterns—tailored to their specific emotional state and situation.",
                      icon: ChatIcon,
                      color: "from-blue-500 to-indigo-500",
                      mockup: (
                        <div className="max-w-sm mx-auto">
                          <img
                            src="/projects/mindline/suggestion.png"
                            alt="AI Suggestions"
                            className="w-full h-auto"
                          />
                        </div>
                      )
                    },
                    {
                      title: "Emotional Reflection Journaling",
                      description: "After experiencing a betting urge or relapse, users document their emotional journey through guided reflection. The app captures feelings, contexts, and outcomes, building a comprehensive emotional history that feeds into the AI's pattern recognition system.",
                      icon: CalendarTodayIcon,
                      color: "from-emerald-500 to-teal-500",
                      mockup: (
                        <div className="max-w-sm mx-auto">
                          <img
                            src="/projects/mindline/emotionalreflection.png"
                            alt="Emotional Reflection"
                            className="w-full h-auto"
                          />
                        </div>
                      )
                    },
                    {
                      title: "AI-Powered Pattern Insights",
                      description: "Machine learning analyzes your emotional logs to identify recurring triggers and behavioral patterns. The insights dashboard reveals connections like 'High-energy social settings' or 'Post-work stress' as relapse catalysts, enabling you to recognize warning signs before they escalate.",
                      icon: TimerIcon,
                      color: "from-amber-500 to-orange-500",
                      mockup: (
                        <div className="max-w-sm mx-auto">
                          <img
                            src="/projects/mindline/insight.png"
                            alt="Insights"
                            className="w-full h-auto"
                          />
                        </div>
                      )
                    }
                  ];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24 mt-32"
                    >
                      {/* Section Header */}
                      <div className="mb-16">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          The Solution
                        </h2>
                        <p className="text-lg text-gray-600">
                          Three pillars of intervention
                        </p>
                      </div>

                      {/* Feature Showcase - Scroll through each */}
                      <div className="space-y-32">
                        {features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid md:grid-cols-2 gap-16 items-center"
                          >
                            {/* Left Column: Text Content */}
                            <div className={featureIndex % 2 === 1 ? "md:order-2" : ""}>
                              <motion.div
                                initial={{ opacity: 0, x: featureIndex % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                              >
                                <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-[#2C3E50]">
                                  <span className="text-sm font-bold text-white uppercase tracking-wide">
                                    Feature {featureIndex + 1}
                                  </span>
                                </div>

                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0a0a0a] mb-6">
                                  {feature.title}
                                </h3>

                                <p className="text-lg text-gray-600 leading-relaxed">
                                  {feature.description}
                                </p>
                              </motion.div>
                            </div>

                            {/* Right Column: Phone Mockup */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 80 }}
                              className={featureIndex % 2 === 1 ? "md:order-1" : ""}
                            >
                              {feature.mockup}
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                // The Logic - INTERACTIVE HORIZONTAL FLOW DIAGRAM
                if (section.content === "The Logic") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-24"
                    >
                      {/* Section Header */}
                      <div className="mb-12">
                        <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
                          The Logic Flow
                        </h2>
                        <p className="text-lg text-gray-600">
                          From Emotion Detection → AI Analysis → Real-Time Action
                        </p>
                      </div>

                      {/* Horizontal Flow Diagram */}
                      <div className="relative">
                        {/* Connection Lines (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
                          {/* Arrow 1->2 */}
                          <motion.path
                            d="M 33% 50% L 40% 50%"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="8 4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.6 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                          />
                          {/* Arrow 2->3 */}
                          <motion.path
                            d="M 60% 50% L 67% 50%"
                            stroke="#10B981"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="8 4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.6 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                          />
                        </svg>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                          {/* Step 1: Emotion Input */}
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group"
                          >
                            <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-gray-400 transition-all duration-300 hover:shadow-xl">
                              {/* Step Number Badge */}
                              <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                                className="absolute -top-4 -left-4 w-12 h-12 bg-gray-700 rounded-2xl shadow-lg flex items-center justify-center"
                              >
                                <span className="text-white font-black text-xl">1</span>
                              </motion.div>

                              <div className="mb-4">
                                <div className="w-16 h-16 bg-[#D71921] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                  <PersonIcon className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-[#0a0a0a] mb-3">Emotion Input</h4>
                                <p className="text-base text-gray-700 leading-relaxed">
                                  PersonIcon logs emotional state: <span className="font-semibold text-gray-700">"Anxious"</span> or <span className="font-semibold text-gray-700">"Excited"</span>
                                </p>
                              </div>

                              <div className="pt-4 border-t border-gray-200 mt-4">
                                <p className="text-sm text-gray-700 font-semibold">PersonIcon Action</p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Step 2: AI Analysis */}
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="group"
                          >
                            <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-gray-400 transition-all duration-300 hover:shadow-xl">
                              {/* Step Number Badge */}
                              <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                                className="absolute -top-4 -left-4 w-12 h-12 bg-gray-700 rounded-2xl shadow-lg flex items-center justify-center"
                              >
                                <span className="text-white font-black text-xl">2</span>
                              </motion.div>

                              <div className="mb-4">
                                <div className="w-16 h-16 bg-[#D71921] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                  <PsychologyIcon className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-[#0a0a0a] mb-3">AI Analysis</h4>
                                <p className="text-base text-gray-700 leading-relaxed">
                                  System cross-references with past patterns → Detects <span className="font-semibold text-gray-700">"Social Betting Trigger"</span>
                                </p>
                              </div>

                              <div className="pt-4 border-t border-gray-200 mt-4">
                                <p className="text-sm text-gray-700 font-semibold">Pattern Recognition</p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Step 3: Real-Time Output */}
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="group"
                          >
                            <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-gray-400 transition-all duration-300 hover:shadow-xl">
                              {/* Step Number Badge */}
                              <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.7, type: "spring" }}
                                className="absolute -top-4 -left-4 w-12 h-12 bg-gray-700 rounded-2xl shadow-lg flex items-center justify-center"
                              >
                                <span className="text-white font-black text-xl">3</span>
                              </motion.div>

                              <div className="mb-4">
                                <div className="w-16 h-16 bg-[#D71921] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                  <GppMaybeIcon className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-[#0a0a0a] mb-3">Intervention</h4>
                                <p className="text-base text-gray-700 leading-relaxed">
                                  Suggests: <span className="font-semibold text-gray-700">"Activate Pause Timer"</span> or <span className="font-semibold text-gray-700">"Call Support Hotline"</span>
                                </p>
                              </div>

                              <div className="pt-4 border-t border-gray-200 mt-4">
                                <p className="text-sm text-gray-700 font-semibold">Real-Time Action</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Bottom Summary */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-200"
                      >
                        <div>
                          <h4 className="text-xl font-bold text-[#0a0a0a] mb-2">Why This Matters</h4>
                          <p className="text-base text-gray-700 leading-relaxed">
                            Unlike traditional blocking apps that are easily bypassed, Mindline leverages <span className="font-semibold">behavioral psychology</span> and <span className="font-semibold">real-time ML pattern recognition</span> to interrupt the dopamine loop <span className="font-semibold italic">before</span> impulsive action occurs.
                          </p>
                        </div>
                      </motion.div>

                      {/* Additional Feature Showcase */}
                      <div className="mt-32">
                        <div className="mb-16">
                          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0a0a0a] mb-3">
                            Additional Features
                          </h3>
                          <p className="text-lg text-gray-600">
                            Supporting tools for comprehensive intervention
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-16">
                          {/* AI Chat Interface */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                          >
                            <div className="max-w-sm mx-auto">
                              <img
                                src="/projects/mindline/ai.png"
                                alt="AI Chat Interface"
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="text-center">
                              <h4 className="text-xl font-bold text-[#0a0a0a] mb-2">AI Conversational Support</h4>
                              <p className="text-base text-gray-600">Real-time emotional support through intelligent dialogue</p>
                            </div>
                          </motion.div>

                          {/* CalendarTodayIcon Tracking */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="space-y-4"
                          >
                            <div className="max-w-sm mx-auto">
                              <img
                                src="/projects/mindline/calendar.png"
                                alt="CalendarTodayIcon Tracking"
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="text-center">
                              <h4 className="text-xl font-bold text-[#0a0a0a] mb-2">Progress CalendarTodayIcon</h4>
                              <p className="text-base text-gray-600">Visual timeline of emotional states and betting patterns</p>
                            </div>
                          </motion.div>

                          {/* Social Reflection */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4"
                          >
                            <div className="max-w-sm mx-auto">
                              <img
                                src="/projects/mindline/shorts.png"
                                alt="Social Reflection"
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="text-center">
                              <h4 className="text-xl font-bold text-[#0a0a0a] mb-2">Social Context Awareness</h4>
                              <p className="text-base text-gray-600">Identify triggers in social situations with photo logging</p>
                            </div>
                          </motion.div>

                          {/* Onboarding */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-4"
                          >
                            <div className="max-w-sm mx-auto">
                              <img
                                src="/projects/mindline/main.png"
                                alt="Welcome Screen"
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="text-center">
                              <h4 className="text-xl font-bold text-[#0a0a0a] mb-2">Supportive Onboarding</h4>
                              <p className="text-base text-gray-600">Welcoming experience with "Bet on yourself" messaging</p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Outcome Section - FINAL IMPACT
                if (section.content === "Outcome") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="mb-20"
                    >
                      <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-gray-200">
                        <div className="max-w-4xl">
                          {/* Icon + Badge */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                            className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-[#D71921] rounded-full shadow-lg"
                          >
                            <CheckCircleIcon className="w-6 h-6 text-white" />
                            <span className="text-white font-bold uppercase tracking-wide">Project Impact</span>
                          </motion.div>

                          {/* Title */}
                          <h2 className="text-2xl sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-6">
                            Outcome & Reflection
                          </h2>

                          {/* Content */}
                          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                            <p>
                              <span className="font-bold text-[#0a0a0a]">Mindline shifts the paradigm</span> from <span className="italic">'restriction'</span> to <span className="italic">'awareness'</span>. Through user testing with 6 participants, the tool successfully reduced impulsive betting triggers by interrupting the dopamine loop before action occurs.
                            </p>

                            <p>
                              Rather than simply blocking access (which users bypass within minutes), Mindline empowers users with <span className="font-semibold text-gray-700">self-awareness</span>, <span className="font-semibold text-gray-700">real-time emotional analysis</span>, and <span className="font-semibold text-gray-700">proactive intervention</span> — creating sustainable behavioral change.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              }

              // Default rendering for other projects and sections
              if (isHeading) {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.02, ease: [0.16, 1, 0.3, 1] }}
                    className="pt-4"
                  >
                    <h3 className="text-lg font-bold text-[#292A2E]">{section.content}</h3>
                  </motion.div>
                );
              } else {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.02, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm"
                  >
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
                  </motion.div>
                );
              }
            } else if (section.type === 'gallery' && section.images) {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.02, ease: [0.16, 1, 0.3, 1] }}
                  className={`grid gap-4 ${section.images.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2'}`}
                >
                  {section.images.map((img, imgIndex) => {
                    const spanFull = img.span === 'full' || img.span === 2;
                    return (
                      <div
                        key={imgIndex}
                        className={`bg-white border border-gray-200 rounded-[24px] p-4 shadow-sm ${spanFull ? 'md:col-span-2' : ''}`}
                      >
                        <div className="rounded-xl bg-[#E8E8E8] overflow-hidden mb-3">
                          <img
                            src={img.image}
                            alt={img.caption}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                        {img.caption && (
                          <p className="text-xs text-gray-500 font-medium">{img.caption}</p>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              );
            } else if (section.type === 'video' && section.url) {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.02, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white border border-gray-200 rounded-[24px] p-4 shadow-sm"
                >
                  <div
                    className="rounded-xl bg-[#E8E8E8] overflow-hidden mb-3"
                    style={{ aspectRatio: section.aspectRatio || '16/9' }}
                  >
                    <video
                      src={section.url}
                      controls
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  {section.caption && (
                    <p className="text-xs text-gray-500 font-medium">{section.caption}</p>
                  )}
                </motion.div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Back Button - at the bottom */}
      <motion.button
        onClick={onBack}
        whileHover={{ x: -4 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 text-gray-600 hover:text-[#292A2E] mt-8 transition-colors"
      >
        <ArrowBackIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Back to projects</span>
      </motion.button>
    </motion.div>
  );
}
