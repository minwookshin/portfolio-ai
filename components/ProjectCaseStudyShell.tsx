"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ProjectDetailView from "@/components/ProjectDetailView";
import type { PortfolioProject } from "@/data/projects";
import { tweens } from "@/lib/material/motion";

export default function ProjectCaseStudyShell({
  project,
  actionLabel,
  actionHref,
  onAction,
  baseHref = "/work",
  className = "",
}: {
  project: PortfolioProject;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  baseHref?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const action = onAction ? (
    <button
      type="button"
      onClick={onAction}
      className="intro-contact-link micro-focus micro-pressable shrink-0 text-[length:var(--type-0)]"
    >
      {actionLabel ?? "back"}
    </button>
  ) : actionHref ? (
    <Link
      href={actionHref}
      className="intro-contact-link micro-focus micro-pressable shrink-0 text-[length:var(--type-0)]"
    >
      {actionLabel ?? "back"}
    </Link>
  ) : null;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      className={`project-readable studio-detail w-full ${className}`}
    >
      <nav className="studio-detail-nav mb-[var(--space-5)] flex w-full items-center justify-between gap-[var(--space-2)] text-left text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">
        <span className="flex min-w-0 items-center gap-[var(--space-1)]">
          <Link
            href={baseHref}
            className="intro-contact-link micro-focus micro-pressable shrink-0 text-[length:var(--type-0)]"
          >
            minwook shin
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="truncate text-[var(--text-primary)]">{project.title}</span>
        </span>
        {action}
      </nav>
      <ProjectDetailView project={project} hideBack onAsk={undefined} />
    </motion.div>
  );
}
