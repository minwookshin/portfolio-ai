"use client";

import { motion, useReducedMotion } from "framer-motion";
import DetailBreadcrumb from "@/components/DetailBreadcrumb";
import LabProjectDetailView from "@/components/LabProjectDetailView";
import ProjectDetailView from "@/components/ProjectDetailView";
import ProjectVideoOnlyView from "@/components/ProjectVideoOnlyView";
import type { PortfolioProject } from "@/data/projects";
import { tweens } from "@/lib/material/motion";

export default function ProjectCaseStudyShell({
  project,
  baseHref = "/work",
  variant = "work",
  mode = "case-study",
  className = "",
}: {
  project: PortfolioProject;
  baseHref?: string;
  variant?: "work" | "lab";
  mode?: "case-study" | "video-only";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const sectionLabel = variant === "lab" ? "studies" : "work";
  const content = mode === "video-only" ? (
    <ProjectVideoOnlyView project={project} />
  ) : variant === "lab" ? (
    <LabProjectDetailView project={project} />
  ) : (
    <ProjectDetailView project={project} hideBack onAsk={undefined} />
  );

  return (
    <div className={`project-readable studio-detail w-full ${className}`}>
      <DetailBreadcrumb
        currentLabel={project.title}
        sectionHref={baseHref}
        sectionLabel={sectionLabel}
      />
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -2 }}
        transition={reduceMotion ? tweens.none : tweens.fast}
        className="detail-document-content"
      >
        {content}
      </motion.div>
    </div>
  );
}
