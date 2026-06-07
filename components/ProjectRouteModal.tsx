"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import ProjectCaseStudyShell from "@/components/ProjectCaseStudyShell";
import type { PortfolioProject } from "@/data/projects";
import { LIGHT_PROJECT_TOKENS, isFeaturedProject } from "@/data/projects";
import { tweens } from "@/lib/material/motion";
import { restoreProjectOpenScroll } from "@/lib/projectScrollRestoration";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function ProjectRouteModal({
  project,
  baseHref = "/work",
}: {
  project: PortfolioProject;
  baseHref?: string;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isFeatured = isFeaturedProject(project);
  const variant = baseHref === "/lab" || baseHref === "/studies" ? "lab" : "work";
  const goHome = () => router.push(baseHref);

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const dialog = dialogRef.current;
      const firstFocusable = dialog?.querySelector<HTMLElement>(focusableSelector);
      (firstFocusable ?? dialog)?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        router.back();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1
      );
      if (!focusables.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus({ preventScroll: true });
      restoreProjectOpenScroll();
    };
  }, [router]);

  if (isFeatured) {
    return (
      <motion.div
        style={LIGHT_PROJECT_TOKENS}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reduceMotion ? tweens.none : tweens.base}
        className="project-lightbox-stage fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-[var(--bg-base)] text-[length:var(--type-0)] text-[var(--text-primary)]"
      >
        <div className="mx-auto flex w-full max-w-[1180px] justify-center px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] sm:px-[var(--space-5)] md:pt-[122px]">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} project detail`}
            tabIndex={-1}
            className="project-lightbox-content w-full max-w-[620px] outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <ProjectCaseStudyShell
              project={project}
              actionLabel="back"
              onAction={() => router.back()}
              baseHref={baseHref}
              onHome={goHome}
              variant={variant}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      style={{ backgroundColor: "var(--dark-overlay-56)" }}
      className="project-lightbox-stage fixed inset-0 z-[70] flex items-center justify-center p-[var(--space-2)] text-[length:var(--type-0)] text-[var(--text-primary)] sm:p-[var(--space-3)]"
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} project detail`}
        tabIndex={-1}
        style={LIGHT_PROJECT_TOKENS}
        initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.985 }}
        transition={reduceMotion ? tweens.none : tweens.slow}
        onClick={(event) => event.stopPropagation()}
        className="project-lightbox-content max-h-[86dvh] w-[min(92vw,620px)] overflow-y-auto border border-[var(--border-light)] bg-[var(--bg-base)] px-[var(--space-3)] pb-[var(--space-6)] pt-[var(--space-3)] text-[var(--text-primary)] outline-none sm:px-[var(--space-4)] sm:pt-[var(--space-4)]"
      >
        <ProjectCaseStudyShell
          project={project}
          actionLabel="back"
          onAction={() => router.back()}
          baseHref={baseHref}
          onHome={goHome}
          variant={variant}
        />
      </motion.div>
    </motion.div>
  );
}
