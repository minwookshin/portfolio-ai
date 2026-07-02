"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import MaterialArrowForwardIcon from "@/components/MaterialArrowForwardIcon";
import { tweens } from "@/lib/material/motion";

type ProjectCaseStudyEntryProps = {
  children: ReactNode;
  id?: string;
  label?: string;
};

export default function ProjectCaseStudyEntry({
  children,
  id = "case-study",
  label = "case study",
}: ProjectCaseStudyEntryProps) {
  const reduceMotion = useReducedMotion();

  return (
    <details className="project-case-study-details" id={id}>
      <summary className="home-mention project-case-study-summary micro-focus micro-focus-tight micro-pressable">
        <span className="project-case-study-summary-label">{label}</span>
        <span className="project-case-study-summary-icon" aria-hidden="true">
          <MaterialArrowForwardIcon className="project-case-study-summary-arrow" />
        </span>
      </summary>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? tweens.none : tweens.fast}
        className="project-case-study-content"
      >
        {children}
      </motion.div>
    </details>
  );
}
