"use client";

import { motion, useReducedMotion } from "framer-motion";
import DetailBreadcrumb from "@/components/DetailBreadcrumb";
import LabProjectDetailView from "@/components/LabProjectDetailView";
import ProjectDetailView from "@/components/ProjectDetailView";
import type { PortfolioProject } from "@/data/projects";
import { tweens } from "@/lib/material/motion";

export default function ProjectCaseStudyShell({
  project,
  baseHref = "/work",
  variant = "work",
  className = "",
}: {
  project: PortfolioProject;
  baseHref?: string;
  variant?: "work" | "lab";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const sectionLabel = variant === "lab" ? "studies" : "work";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      className={`project-readable studio-detail w-full ${className}`}
    >
      <DetailBreadcrumb
        currentLabel={project.title}
        sectionHref={baseHref}
        sectionLabel={sectionLabel}
      />
      {variant === "lab" ? (
        <LabProjectDetailView project={project} />
      ) : (
        <ProjectDetailView project={project} hideBack onAsk={undefined} />
      )}
    </motion.div>
  );
}
