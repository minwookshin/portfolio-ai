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
  className = "",
}: {
  project: PortfolioProject;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const action = onAction ? (
    <button
      type="button"
      onClick={onAction}
      className="shrink-0 text-on-surface-variant underline decoration-on-surface-variant/55 underline-offset-2 transition-colors hover:text-on-surface hover:decoration-on-surface"
    >
      {actionLabel ?? "back"}
    </button>
  ) : actionHref ? (
    <Link
      href={actionHref}
      className="shrink-0 text-on-surface-variant underline decoration-on-surface-variant/55 underline-offset-2 transition-colors hover:text-on-surface hover:decoration-on-surface"
    >
      {actionLabel ?? "back"}
    </Link>
  ) : null;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
      transition={reduceMotion ? tweens.none : tweens.slow}
      className={`project-readable w-full ${className}`}
    >
      <nav className="mb-[var(--space-5)] flex w-full items-center justify-between gap-[var(--space-2)] text-left leading-[var(--leading-body)] text-on-surface">
        <span className="flex min-w-0 items-center gap-[var(--space-1)]">
          <Link
            href="/"
            className="shrink-0 text-on-surface-variant underline decoration-on-surface-variant/55 underline-offset-2 transition-colors hover:text-on-surface hover:decoration-on-surface"
          >
            minwook shin
          </Link>
          <span className="text-on-surface-variant">/</span>
          <span className="truncate text-on-surface">{project.title}</span>
        </span>
        {action}
      </nav>
      <ProjectDetailView project={project} hideBack onAsk={undefined} />
    </motion.div>
  );
}
