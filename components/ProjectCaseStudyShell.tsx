"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import LabProjectDetailView from "@/components/LabProjectDetailView";
import ProjectDetailView from "@/components/ProjectDetailView";
import type { PortfolioProject } from "@/data/projects";
import { tweens } from "@/lib/material/motion";

export default function ProjectCaseStudyShell({
  project,
  onAction,
  baseHref = "/work",
  variant = "work",
  className = "",
}: {
  project: PortfolioProject;
  onAction?: () => void;
  baseHref?: string;
  variant?: "work" | "lab";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const sectionLabel = variant === "lab" ? "studies" : "work";
  const sectionControl = onAction ? (
    <button
      type="button"
      onClick={onAction}
      className="intro-contact-link micro-focus micro-pressable min-w-0 shrink-0 text-[length:var(--type-0)]"
    >
      {sectionLabel}
    </button>
  ) : (
    <Link
      href={baseHref}
      className="intro-contact-link micro-focus micro-pressable min-w-0 shrink-0 text-[length:var(--type-0)]"
    >
      {sectionLabel}
    </Link>
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      className={`project-readable studio-detail w-full ${className}`}
    >
      <nav className="studio-detail-nav mb-[var(--space-5)] text-left text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">
        <span className="flex min-w-0 flex-wrap items-center gap-x-[var(--space-1)] gap-y-1">
          <Link
            href="/work"
            className="intro-contact-link micro-focus micro-pressable shrink-0 text-[length:var(--type-0)]"
          >
            minwook shin
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          {sectionControl}
          <span className="text-[var(--text-muted)]">/</span>
          <span className="min-w-0 text-[var(--text-primary)]">{project.title}</span>
        </span>
      </nav>
      {variant === "lab" ? (
        <LabProjectDetailView project={project} />
      ) : (
        <ProjectDetailView project={project} hideBack onAsk={undefined} />
      )}
    </motion.div>
  );
}
