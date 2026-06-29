"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Copy } from "lucide-react";
import { CopyFeedbackToast, useCopyFeedback } from "@/components/CopyFeedback";
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
  const { copyText, toast } = useCopyFeedback();

  const copyCurrentPageLink = () => {
    if (typeof window === "undefined") return;
    void copyText(window.location.href, "page link");
  };

  return (
    <>
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
          trailing={(
            <button
              type="button"
              className="detail-copy-action detail-copy-action--breadcrumb micro-focus micro-focus-tight micro-pressable"
              aria-label={`copy ${project.title} page link`}
              onClick={copyCurrentPageLink}
            >
              <Copy aria-hidden="true" />
              <span>copy link</span>
            </button>
          )}
        />
        {mode === "video-only" ? (
          <ProjectVideoOnlyView project={project} />
        ) : variant === "lab" ? (
          <LabProjectDetailView project={project} />
        ) : (
          <ProjectDetailView project={project} hideBack onAsk={undefined} />
        )}
      </motion.div>
      <CopyFeedbackToast message={toast} />
    </>
  );
}
