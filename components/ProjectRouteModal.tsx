"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import ProjectCaseStudyShell from "@/components/ProjectCaseStudyShell";
import type { PortfolioProject } from "@/data/projects";
import { LIGHT_PROJECT_TOKENS } from "@/data/projects";
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
  const variant = baseHref === "/lab" || baseHref === "/studies" ? "lab" : "work";
  const goToSection = useCallback(() => {
    router.push(baseHref);
  }, [baseHref, router]);

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
        goToSection();
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
  }, [goToSection]);

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
        >
          <ProjectCaseStudyShell
            project={project}
            onAction={goToSection}
            baseHref={baseHref}
            variant={variant}
          />
        </div>
      </div>
    </motion.div>
  );
}
