"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { springs } from "@/lib/material/motion";
import { ArrowLeft as ArrowBackIcon } from "lucide-react";
import { Project } from "./ProjectCard";
import { CaseStudy } from "./detail/CaseStudy";
import { getCaseStudy } from "@/data/caseStudies";

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  hideBack?: boolean;
  focusQuery?: string | null;
  onAsk?: (q: string) => void;
}

const FOCUS_STOPWORDS = new Set([
  "what", "how", "why", "tell", "about", "your", "this", "that", "the", "and", "for",
  "with", "did", "does", "was", "were", "you", "project", "can", "show", "of", "to",
  "is", "it", "are", "have", "more", "give", "into", "from", "they", "their", "the",
]);

export default function ProjectDetailView({ project, onBack, hideBack = false, focusQuery, onAsk }: ProjectDetailViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Deep-link: scroll to and highlight the section that answers the user's question
  useEffect(() => {
    if (!focusQuery || !rootRef.current) return;
    const titleWords = new Set(project.title.toLowerCase().match(/[a-z]+/g) ?? []);
    const words = (focusQuery.toLowerCase().match(/[a-z]+/g) ?? []).filter(
      (w) => w.length >= 4 && !FOCUS_STOPWORDS.has(w) && !titleWords.has(w)
    );
    if (!words.length) return;
    const timer = setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      const headings = Array.from(root.querySelectorAll<HTMLElement>("h1, h2, h3, h4"));
      const paras = Array.from(root.querySelectorAll<HTMLElement>("p"));
      const matches = (el: HTMLElement) => {
        const txt = (el.textContent ?? "").toLowerCase();
        return words.some((w) => txt.includes(w));
      };
      const target = headings.find(matches) ?? paras.find(matches);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("section-flash");
        setTimeout(() => target.classList.remove("section-flash"), 2400);
      }
    }, 480);
    return () => clearTimeout(timer);
  }, [focusQuery, project.title]);

  // Every project renders through the case-study system — authored studies for
  // the deep ones, auto-synthesized snapshots for the rest.
  const caseStudy = getCaseStudy(project);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-12"
    >
      {!hideBack && (
        <motion.button
          onClick={onBack}
          whileHover={{ x: -4 }}
          transition={springs.spatialFast}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-8 transition-colors"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Back to projects</span>
        </motion.button>
      )}
      <CaseStudy data={caseStudy} onAsk={onAsk} />
    </motion.div>
  );
}
