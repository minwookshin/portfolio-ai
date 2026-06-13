"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Command,
  Eye,
  type LucideIcon,
  Mail,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import type { Project } from "@/components/ProjectCard";
import { springs, tweens } from "@/lib/material/motion";
import { PERSONAL_INFO } from "@/data/personal";

type GuideSection = "work" | "studies";

type GuideCommand = {
  description: string;
  icon: LucideIcon;
  id: string;
  label: string;
  onSelect: () => void;
};

type QuietGlassGuideProps = {
  activeProject: Project | null;
  activeSection: GuideSection;
  onAsk: (message: string) => void;
  onOpenProject: (project: Project) => void;
  onOpenProfile: () => void;
  onOpenStudies: () => void;
  onOpenWork: () => void;
  projectCount: number;
  studyCount: number;
};

function projectSummary(project: Project) {
  if (project.comingSoon) return project.unavailableMessage ?? "case study is being shaped.";
  if (project.studioLabel) return project.studioLabel;
  if (project.role) return project.role;
  return project.description;
}

function ProjectLens({
  activeProject,
  onAsk,
  onOpenProject,
  reduceMotion,
}: {
  activeProject: Project | null;
  onAsk: (message: string) => void;
  onOpenProject: (project: Project) => void;
  reduceMotion: boolean;
}) {
  return (
    <AnimatePresence mode="popLayout">
      {activeProject && (
        <motion.aside
          key={activeProject.id}
          initial={reduceMotion ? false : { opacity: 0, filter: "blur(10px)", scale: 0.98, y: -4 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(8px)", scale: 0.985, y: -4 }}
          transition={reduceMotion ? tweens.none : springs.spatialDefault}
          className="quiet-guide-lens"
          aria-live="polite"
        >
          <div className="quiet-guide-lens__header">
            <span className="quiet-guide-lens__eyebrow">looking at</span>
            <button
              type="button"
              className="quiet-guide-lens__title micro-focus micro-focus-tight"
              onClick={() => onOpenProject(activeProject)}
            >
              {activeProject.title}
              <ArrowUpRight aria-hidden="true" className="quiet-guide-lens__title-icon" />
            </button>
          </div>
          <p className="quiet-guide-lens__body">{projectSummary(activeProject)}</p>
          <div className="quiet-guide-lens__actions" aria-label="project guide actions">
            <button
              type="button"
              className="quiet-guide-action micro-focus micro-focus-tight micro-pressable"
              onClick={() => onOpenProject(activeProject)}
            >
              <Eye aria-hidden="true" />
              open
            </button>
            <button
              type="button"
              className="quiet-guide-action micro-focus micro-focus-tight micro-pressable"
              onClick={() => onAsk(`give me the craft notes for ${activeProject.title}`)}
            >
              <Sparkles aria-hidden="true" />
              craft notes
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default function QuietGlassGuide({
  activeProject,
  activeSection,
  onAsk,
  onOpenProject,
  onOpenProfile,
  onOpenStudies,
  onOpenWork,
  projectCount,
  studyCount,
}: QuietGlassGuideProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) return;
      event.preventDefault();
      setOpen((current) => !current);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const commands = useMemo<GuideCommand[]>(() => {
    const items: GuideCommand[] = [
      {
        id: "work",
        icon: Briefcase,
        label: "focus work",
        description: `${projectCount} selected proof points`,
        onSelect: onOpenWork,
      },
      {
        id: "studies",
        icon: BookOpen,
        label: "read studies",
        description: `${studyCount} notes and prototypes`,
        onSelect: onOpenStudies,
      },
      {
        id: "profile",
        icon: UserRound,
        label: "profile",
        description: "role, links, resume",
        onSelect: onOpenProfile,
      },
      {
        id: "proof",
        icon: Sparkles,
        label: "strongest proof",
        description: "curated ai read",
        onSelect: () => onAsk("show me the strongest proof in this portfolio"),
      },
      {
        id: "contact",
        icon: Mail,
        label: "contact",
        description: PERSONAL_INFO.email,
        onSelect: () => {
          window.location.href = `mailto:${PERSONAL_INFO.email}`;
        },
      },
    ];

    if (!activeProject) return items;
    return [
      {
        id: `project-${activeProject.id}`,
        icon: Eye,
        label: `open ${activeProject.title}`,
        description: projectSummary(activeProject),
        onSelect: () => onOpenProject(activeProject),
      },
      ...items,
    ];
  }, [activeProject, onAsk, onOpenProfile, onOpenProject, onOpenStudies, onOpenWork, projectCount, studyCount]);

  const closeThen = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div className="quiet-guide" data-open={open ? "true" : "false"}>
      <div className="quiet-guide-trace" aria-hidden="true" />
      <ProjectLens
        activeProject={open ? null : activeProject}
        onAsk={onAsk}
        onOpenProject={onOpenProject}
        reduceMotion={reduceMotion}
      />

      <motion.button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close guide" : "Open guide"}
        className="quiet-guide-orb micro-focus micro-focus-tight micro-pressable"
        onClick={() => setOpen((current) => !current)}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={reduceMotion ? tweens.none : springs.pressMorph}
      >
        <span className="quiet-guide-orb__core" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="quiet-guide-orb__label">{activeSection === "work" ? "guide" : "notes"}</span>
        <Command aria-hidden="true" className="quiet-guide-orb__icon" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="guide-palette"
            role="dialog"
            aria-label="portfolio guide"
            initial={reduceMotion ? false : { opacity: 0, filter: "blur(12px)", scale: 0.975, y: -8 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)", scale: 0.985, y: -6 }}
            transition={reduceMotion ? tweens.none : springs.island}
            className="quiet-guide-palette"
          >
            <div className="quiet-guide-palette__top">
              <div>
                <p className="quiet-guide-palette__eyebrow">quiet glass guide</p>
                <p className="quiet-guide-palette__title">follow the proof without asking first.</p>
              </div>
              <button
                type="button"
                aria-label="Close guide"
                className="quiet-guide-close micro-focus micro-focus-tight micro-pressable"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="quiet-guide-command-list">
              {commands.map((command) => {
                const Icon = command.icon;

                return (
                  <button
                    key={command.id}
                    type="button"
                    className="quiet-guide-command micro-focus micro-focus-tight micro-pressable"
                    onClick={() => closeThen(command.onSelect)}
                  >
                    <span className="quiet-guide-command__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="quiet-guide-command__copy">
                      <span>{command.label}</span>
                      <span>{command.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
