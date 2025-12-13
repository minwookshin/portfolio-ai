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
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[18px] flex items-center justify-center shadow-[0_4px_16px_rgb(0,0,0,0.1)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Quick Candidate Summary</h2>
            <p className="text-sm text-gray-500 mt-1">Essential information at a glance</p>
          </div>
        </div>

        {/* Visa Status - Highlighted */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-[24px] p-6 mb-6">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">Visa Status</p>
              <p className="text-xl font-bold text-blue-900 mt-1">F-1 Visa (OPT Eligible)</p>
            </div>
          </div>
        </div>

        {/* Core Value Proposition */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Core Value</h3>
          <p className="text-2xl font-bold text-gray-900 leading-relaxed">
            0 to 1 Builder
          </p>
          <p className="text-lg text-gray-700 mt-2">
            Design + Engineering + Business Strategy
          </p>
        </div>

        {/* Top 3 Skills */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Top 3 Skills</h3>
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
                className="bg-gray-50 border border-gray-200/80 rounded-[20px] p-5 text-center hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="text-3xl mb-2 block">{skill.icon}</span>
                <p className="text-gray-900 font-semibold">{skill.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Highlights */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Key Highlights</h3>
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
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed">{highlight}</p>
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
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-br from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-[24px] font-bold text-lg shadow-[0_8px_24px_rgb(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgb(0,0,0,0.25)] transition-all duration-300"
        >
          <Download className="w-6 h-6" />
          Download Resume (PDF)
        </motion.a>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Available for immediate start • Open to full-time opportunities
        </p>
      </div>
    </motion.div>
  );
}
