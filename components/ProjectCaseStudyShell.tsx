"use client";

import Link from "next/link";
import ProjectDetailView from "@/components/ProjectDetailView";
import type { PortfolioProject } from "@/data/projects";

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
    <div className={`project-readable w-full ${className}`}>
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
    </div>
  );
}
