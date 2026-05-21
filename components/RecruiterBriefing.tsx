"use client";

import { motion } from "framer-motion";
import { Download, CheckCircle2, Globe, Zap } from "lucide-react";

export default function RecruiterBriefing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-surface-container rounded-shape-lg p-10 transition-all duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-on-surface rounded-shape-md flex items-center justify-center">
            <Zap className="w-6 h-6 text-surface" />
          </div>
          <div>
            <h2 className="text-3xl font-light text-on-surface">Quick Candidate Summary</h2>
            <p className="text-sm text-on-surface-variant mt-1">Essential information at a glance</p>
          </div>
        </div>

        {/* Visa Status - Highlighted */}
        <div className="bg-surface-container-high rounded-shape-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-on-surface-variant" />
            <div>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-[0.2em]">Visa Status</p>
              <p className="text-xl font-semibold text-on-surface mt-1">F-1 Visa (OPT Eligible)</p>
            </div>
          </div>
        </div>

        {/* Core Value Proposition */}
        <div className="mb-8">
          <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4">Core Value</h3>
          <p className="text-2xl font-semibold text-on-surface leading-relaxed">
            0 to 1 Builder
          </p>
          <p className="text-lg text-on-surface-variant mt-2">
            Design + Engineering + Business Strategy
          </p>
        </div>

        {/* Top 3 Skills */}
        <div className="mb-8">
          <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4">Top 3 Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Next.js", icon: "⚛️" },
              { name: "Figma", icon: "🎨" },
              { name: "AI Integration", icon: "🤖" }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="bg-surface-container-high rounded-shape-md p-5 text-center transition-colors duration-200"
              >
                <span className="text-3xl mb-2 block">{skill.icon}</span>
                <p className="text-on-surface font-semibold">{skill.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Highlights */}
        <div className="mb-8">
          <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4">Key Highlights</h3>
          <div className="space-y-3">
            {[
              "Full-stack designer with engineering background",
              "Proven track record in 0-1 product development",
              "Strong in user research, prototyping, and implementation",
              "Experience bridging design and technical teams"
            ].map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-on-surface-variant flex-shrink-0 mt-0.5" />
                <p className="text-on-surface-variant leading-relaxed">{highlight}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.a
          href="/resume.pdf"
          download
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary hover:opacity-90 text-on-primary rounded-shape-full font-bold text-lg transition-all duration-300"
        >
          <Download className="w-6 h-6" />
          Download Resume (PDF)
        </motion.a>

        {/* Footer Note */}
        <p className="text-center text-sm text-on-surface-variant mt-6">
          Available for immediate start • Open to full-time opportunities
        </p>
      </div>
    </motion.div>
  );
}
