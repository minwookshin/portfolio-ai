"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimationControls, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BlurImage from "@/components/BlurImage";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";
import type { Project } from "@/components/ProjectCard";
import { ArrowUpRight } from "lucide-react";
import { motionDurations, springs, tweens } from "@/lib/material/motion";
import { formatWritingDate } from "@/lib/writingDisplay";
import type { WritingPostMeta } from "@/lib/writingTypes";
import {
  FEATURED_PROJECT_IDS,
  LAB_PROJECT_IDS,
  MAIN_PROJECTS,
  getLabProjectPath,
  getProjectPath,
  isLabProject,
  isLabStudyProject,
  orderProjects,
} from "@/data/projects";
import { PERSONAL_INFO } from "@/data/personal";

type HomeTab = "work" | "studies";

type HomePageProps = {
  activeSection?: HomeTab;
  writingPosts: WritingPostMeta[];
};

const LANDING_EASE = [0.22, 1, 0.36, 1] as const;
const LANDING_EXPLORE_DELAY = 0.3;
const LANDING_ROW_BASE_DELAY = 0.4;
const STUDY_ROW_SCROLL_OFFSETS: Array<"start 92%" | "start 68%" | "end 32%" | "end 8%"> = [
  "start 92%",
  "start 68%",
  "end 32%",
  "end 8%",
];

function unavailableFeedbackAnimation() {
  return {
    rotateX: [0, -7, 3, 0],
    rotateY: [0, 6, -2, 0],
    scale: [1, 0.985, 1.002, 1],
    x: [0, 1, -1, 0],
    y: [0, -1, 0],
    transition: {
      duration: 0.34,
      ease: LANDING_EASE,
    },
  };
}

const landingPageVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.02,
      staggerChildren: 0.06,
    },
  },
};

const landingIntroVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.02,
      staggerChildren: 0.055,
    },
  },
};

const landingExploreVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: LANDING_EXPLORE_DELAY,
      staggerChildren: 0.045,
    },
  },
};

const landingRevealItem: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(3px)",
    y: 8,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      opacity: { type: "tween", duration: 0.42, ease: LANDING_EASE },
      filter: { type: "tween", duration: 0.42, ease: LANDING_EASE },
      y: { type: "spring", stiffness: 260, damping: 32, mass: 1.2 },
    },
  },
};

function landingRowTransition(index: number): Transition {
  const delay = LANDING_ROW_BASE_DELAY + Math.min(index * 0.035, 0.18);

  return {
    opacity: { type: "tween", duration: 0.34, ease: LANDING_EASE, delay },
    filter: { type: "tween", duration: 0.38, ease: LANDING_EASE, delay },
    y: { ...springs.spatialDefault, delay },
  };
}

type StudyItem =
  | {
      date: string;
      description: string;
      href: string;
      id: string;
      kind: "writing";
      label: string;
      meta: string;
      title: string;
    }
  | {
      href: string;
      id: string;
      kind: "lab";
      label: string;
      meta: string;
      project: Project;
      title: string;
    };

function StudyMetaLine({
  className = "",
  label,
  meta,
}: {
  className?: string;
  label: string;
  meta: string;
}) {
  return (
    <span className={`study-meta-row ${className}`.trim()}>
      <span className="study-meta-label">{label}</span>
      <span aria-hidden="true" className="study-meta-separator">/</span>
      <span className="study-meta-detail">{meta}</span>
    </span>
  );
}

function useCanShowWorkPreview() {
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const update = () => setCanShow(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return canShow;
}

function HomeBulletCell({ section = false }: { section?: boolean }) {
  return (
    <span className="home-bullet-cell" aria-hidden="true">
      <span className={section ? "home-bullet home-bullet--section" : "home-bullet"} />
      {section && (
        <span className="home-caret" aria-hidden="true">
          <span />
        </span>
      )}
    </span>
  );
}

function HomeLeafRow({ children }: { children: ReactNode }) {
  return (
    <div className="home-node">
      <div className="home-row">
        <HomeBulletCell />
        <span className="home-label">{children}</span>
      </div>
    </div>
  );
}

function HomeMetaLink({
  children,
  external = false,
  href,
}: {
  children: string;
  external?: boolean;
  href: string;
}) {
  const className = "home-mention micro-focus micro-focus-tight micro-pressable";

  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {children}
    </Link>
  );
}

function HomeOutlineSection({
  active = false,
  children,
  count,
  defaultOpen,
  sectionId,
  title,
}: {
  active?: boolean;
  children: ReactNode;
  count?: number;
  defaultOpen: boolean;
  sectionId?: string;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(() => defaultOpen);

  return (
    <motion.details
      className="home-node home-node--section"
      data-active={active ? "true" : "false"}
      id={sectionId}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      open={isOpen}
      variants={landingRevealItem}
    >
      <summary className="home-row home-row--summary micro-focus micro-focus-tight">
        <HomeBulletCell section />
        <span className="home-label">
          {title}
          {typeof count === "number" && <span className="home-count">{count}</span>}
        </span>
      </summary>
      <div className="home-children">{children}</div>
    </motion.details>
  );
}

// The model appends hidden directive lines at the end of each reply:
//   <<<SHOW>>>project:Sentinel | projects | profile   (what the UI should open)
//   <<<FOLLOWUPS>>>q1|q2|q3                            (tappable next questions)
// We split these off so the prose renders clean, drive the cards from SHOW
// (deterministic, instead of keyword-guessing), and surface the follow-ups as
// capsules. Trailing partial sentinels are hidden so nothing flashes mid-stream.
const FOLLOWUP_SENTINEL = "<<<FOLLOWUPS>>>";
const SHOW_SENTINEL = "<<<SHOW>>>";

function parseAssistant(content: string): { body: string; followups: string[]; show: string | null } {
  const showMatch = content.match(/<<<SHOW>>>\s*([^\n|]+)/);
  const show = showMatch ? showMatch[1].trim() : null;

  let followups: string[] = [];
  const fIdx = content.indexOf(FOLLOWUP_SENTINEL);
  if (fIdx !== -1) {
    followups = content
      .slice(fIdx + FOLLOWUP_SENTINEL.length)
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  // Body is everything before the first directive sentinel.
  let cut = content.length;
  for (const s of [SHOW_SENTINEL, FOLLOWUP_SENTINEL]) {
    const i = content.indexOf(s);
    if (i !== -1) cut = Math.min(cut, i);
  }
  let body = content.slice(0, cut).trimEnd();
  // Hide a trailing partial sentinel while it's still streaming in.
  for (const s of [SHOW_SENTINEL, FOLLOWUP_SENTINEL]) {
    for (let n = s.length - 1; n > 0; n--) {
      if (body.endsWith(s.slice(0, n))) {
        body = body.slice(0, -n).trimEnd();
        break;
      }
    }
  }
  return { body, followups, show };
}

// Map a SHOW directive to a redirect-button target (a project or the profile).
function showToTarget(show: string | null): Project | "profile" | "projects" | null {
  if (!show) return null;
  if (show === "profile") return "profile";
  if (show === "projects") return "projects";
  if (show.startsWith("project:")) {
    const name = show.slice("project:".length).trim().toLowerCase();
    return MAIN_PROJECTS.find((p) => p.title.toLowerCase() === name) ?? null;
  }
  return null;
}

function getProjectDescriptor(project: Project) {
  return project.comingSoon
    ? project.unavailableMessage ?? "Coming soon."
    : project.studioLabel ?? project.description;
}

function ProjectTextRow({
  onActivate,
  onDeactivate,
  onUnavailableActivate,
  project,
  index,
  list,
}: {
  onActivate?: () => void;
  onDeactivate?: () => void;
  onUnavailableActivate?: () => void;
  project: Project;
  index: number;
  list: "work";
}) {
  const reduceMotion = useReducedMotion();
  const unavailableControls = useAnimationControls();
  const descriptor = getProjectDescriptor(project);
  const rowClass =
    "home-row home-row--link micro-focus micro-focus-tight micro-pressable";
  const titleClass = [
    "font-normal",
    "project-row-title-line--lateral",
  ]
    .filter(Boolean)
    .join(" ");
  const rowText = (
    <>
      <HomeBulletCell />
      <span className="home-label project-row-copy">
        <span className={titleClass}>
          {project.title}
        </span>
        <span className="home-meta project-row-meta">
          {descriptor}
        </span>
      </span>
    </>
  );
  const playUnavailableFeedback = useCallback(() => {
    onUnavailableActivate?.();
    if (reduceMotion) return;

    unavailableControls.stop();
    void unavailableControls.start(unavailableFeedbackAnimation());
  }, [onUnavailableActivate, reduceMotion, unavailableControls]);

  return (
    <motion.li
      onBlur={onDeactivate}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onPointerEnter={onActivate}
      onPointerLeave={onDeactivate}
      initial={reduceMotion ? false : { opacity: 0, filter: "blur(3px)", y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, filter: "blur(0px)", y: 0 }}
      animate={reduceMotion ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
      viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
      transition={reduceMotion ? tweens.none : landingRowTransition(index)}
      data-project-row={list}
      className="home-node group relative z-0 list-none hover:z-30 focus-within:z-30"
    >
      {project.comingSoon ? (
        <motion.button
          type="button"
          aria-disabled="true"
          aria-label={`${project.title} is not ready yet`}
          animate={unavailableControls}
          className={`${rowClass} cursor-pointer`}
          onClick={playUnavailableFeedback}
          style={{
            transformOrigin: "50% 60%",
            transformPerspective: 900,
            transformStyle: "preserve-3d",
          }}
        >
          {rowText}
        </motion.button>
      ) : (
        <Link
          href={getProjectPath(project)}
          className={rowClass}
        >
          {rowText}
        </Link>
      )}
    </motion.li>
  );
}

function WorkPreviewContent({
  project,
}: {
  project: Project;
}) {
  const isStaticLogoPreview = project.slug === "atlas";
  const isSentinelPreview = project.slug === "sentinel";

  const src = isStaticLogoPreview ? project.icon ?? project.image : project.image ?? project.icon;

  if (src) {
    if (isSentinelPreview) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--bg-base)]">
          <div className="relative h-[88%] w-[88%]">
            <BlurImage
              src={src}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 64vw, 560px"
              draggable={false}
              className="object-contain"
            />
          </div>
        </div>
      );
    }

    if (isStaticLogoPreview) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--bg-base)]">
          <BlurImage
            src={src}
            alt={project.title}
            width={342}
            height={299}
            sizes="320px"
            draggable={false}
            className="h-auto w-[260px] max-w-[58%] object-contain"
          />
        </div>
      );
    }

    return (
      <BlurImage
        src={src}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 74vw, 680px"
        draggable={false}
        className="object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent text-4xl text-[var(--text-primary)]">
      {project.glyph ?? project.title.charAt(0)}
    </div>
  );
}

function WorkFixedPreview({
  feedbackKey = 0,
  project,
  reduceMotion,
}: {
  feedbackKey?: number;
  project: Project;
  reduceMotion: boolean;
}) {
  const unavailableControls = useAnimationControls();
  const lastFeedbackKey = useRef(0);
  const canPlayUnavailableFeedback = Boolean(project.comingSoon);
  const previewFrameClass = [
    "work-preview-stage work-preview-soft-edge relative aspect-[1.5] w-full overflow-hidden rounded-[var(--md-shape-lg)] bg-transparent",
    canPlayUnavailableFeedback ? "work-preview-unavailable micro-focus cursor-pointer" : "",
    project.slug === "sentinel" ? "work-preview-sentinel-video" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const playUnavailableFeedback = useCallback(() => {
    if (!canPlayUnavailableFeedback) return;

    unavailableControls.stop();
    if (!reduceMotion) {
      void unavailableControls.start(unavailableFeedbackAnimation());
    }
  }, [canPlayUnavailableFeedback, reduceMotion, unavailableControls]);

  useEffect(() => {
    if (!canPlayUnavailableFeedback || feedbackKey <= 0 || feedbackKey === lastFeedbackKey.current) return;

    lastFeedbackKey.current = feedbackKey;
    unavailableControls.stop();
    if (!reduceMotion) {
      void unavailableControls.start(unavailableFeedbackAnimation());
    }
  }, [canPlayUnavailableFeedback, feedbackKey, reduceMotion, unavailableControls]);
  const handlePreviewKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (!canPlayUnavailableFeedback) return;
    if (event.key !== " " && event.key !== "Enter") return;

    event.preventDefault();
    playUnavailableFeedback();
  }, [canPlayUnavailableFeedback, playUnavailableFeedback]);

  return (
    <motion.div
      aria-label={canPlayUnavailableFeedback ? `${project.title} is not ready yet` : undefined}
      className={previewFrameClass}
      onClick={canPlayUnavailableFeedback ? playUnavailableFeedback : undefined}
      onKeyDown={canPlayUnavailableFeedback ? handlePreviewKeyDown : undefined}
      role={canPlayUnavailableFeedback ? "button" : undefined}
      tabIndex={canPlayUnavailableFeedback ? 0 : undefined}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={project.id}
          className="absolute inset-0 transform-gpu"
          initial={reduceMotion ? { opacity: 1, filter: "blur(0px)", scale: 1, x: 0 } : { opacity: 0, filter: "blur(6px)", scale: 0.992, x: 3 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0, filter: "blur(0px)", scale: 1, x: 0 } : { opacity: 0, filter: "blur(4px)", scale: 1.002, x: -3 }}
          transition={
            reduceMotion
              ? tweens.instant
              : {
                  opacity: { type: "tween", duration: 0.1, ease: [0.22, 1, 0.36, 1] },
                  filter: { type: "tween", duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                  scale: { type: "tween", duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                  x: { type: "tween", duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                }
          }
          style={{ willChange: "opacity, filter, transform" }}
        >
          {canPlayUnavailableFeedback ? (
            <motion.div
              animate={unavailableControls}
              className="h-full w-full transform-gpu"
              style={{
                transformOrigin: "50% 60%",
                transformPerspective: 900,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <WorkPreviewContent project={project} />
            </motion.div>
          ) : (
            <WorkPreviewContent project={project} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function WorkSection({
  onActiveProjectChange,
  projects,
}: {
  onActiveProjectChange?: (project: Project | null) => void;
  projects: Project[];
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const canShowFixedPreview = useCanShowWorkPreview();
  const hidePreviewTimer = useRef<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewFeedbackKey, setPreviewFeedbackKey] = useState(0);

  const clearHideTimer = useCallback(() => {
    if (!hidePreviewTimer.current) return;
    window.clearTimeout(hidePreviewTimer.current);
    hidePreviewTimer.current = null;
  }, []);

  const activateRow = useCallback((index: number) => {
    clearHideTimer();
    setPreviewIndex(index);
    onActiveProjectChange?.(projects[index] ?? null);
  }, [clearHideTimer, onActiveProjectChange, projects]);

  const activateUnavailablePreview = useCallback((index: number) => {
    clearHideTimer();
    setPreviewIndex(index);
    setPreviewFeedbackKey((key) => key + 1);
    onActiveProjectChange?.(projects[index] ?? null);
  }, [clearHideTimer, onActiveProjectChange, projects]);

  const deactivateRow = useCallback((delay = 70) => {
    clearHideTimer();
    hidePreviewTimer.current = window.setTimeout(() => {
      setPreviewIndex(null);
      onActiveProjectChange?.(null);
    }, delay);
  }, [clearHideTimer, onActiveProjectChange]);

  useEffect(() => {
    return () => clearHideTimer();
  }, [clearHideTimer]);

  const previewProject = previewIndex === null ? null : projects[previewIndex];
  const canInteractWithPreview = Boolean(previewProject?.comingSoon);
  const previewShellClass = [
    "absolute right-0 top-0 z-20 hidden aspect-[1.5] w-[min(34vw,360px)] md:block",
    canInteractWithPreview ? "pointer-events-auto" : "pointer-events-none",
  ].join(" ");

  return (
    <div className="relative">
      <ul className="home-list">
        {projects.map((project, index) => (
          <ProjectTextRow
            key={project.id}
            onActivate={() => activateRow(index)}
            onDeactivate={() => deactivateRow(project.comingSoon ? 180 : 70)}
            onUnavailableActivate={project.comingSoon ? () => activateUnavailablePreview(index) : undefined}
            project={project}
            index={index}
            list="work"
          />
        ))}
      </ul>
      {canShowFixedPreview && (
        <div
          aria-hidden={canInteractWithPreview ? undefined : "true"}
          className={previewShellClass}
          onBlur={canInteractWithPreview ? () => deactivateRow() : undefined}
          onFocus={canInteractWithPreview ? clearHideTimer : undefined}
          onMouseEnter={canInteractWithPreview ? clearHideTimer : undefined}
          onMouseLeave={canInteractWithPreview ? () => deactivateRow() : undefined}
          onPointerEnter={canInteractWithPreview ? clearHideTimer : undefined}
          onPointerLeave={canInteractWithPreview ? () => deactivateRow() : undefined}
        >
          <AnimatePresence initial={false}>
            {previewProject && (
              <motion.div
                key="work-preview-stage"
                className="absolute inset-0 transform-gpu"
                initial={reduceMotion ? { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 } : { opacity: 0, filter: "blur(5px)", scale: 0.996, y: 3 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0, filter: "blur(0px)", scale: 1, y: 0 } : { opacity: 0, filter: "blur(4px)", scale: 0.996, y: 3 }}
                transition={
                  reduceMotion
                    ? tweens.instant
                    : {
                        opacity: { type: "tween", duration: 0.1, ease: [0.22, 1, 0.36, 1] },
                        filter: { type: "tween", duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                        scale: { type: "tween", duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                        y: { type: "tween", duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                      }
                }
                style={{ willChange: "opacity, filter, transform" }}
              >
                <WorkFixedPreview feedbackKey={previewFeedbackKey} project={previewProject} reduceMotion={reduceMotion} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function buildInteractionItems(): StudyItem[] {
  const labProjects = orderProjects(MAIN_PROJECTS, LAB_PROJECT_IDS);
  const labStudyProjects = labProjects.filter(isLabStudyProject);

  return labStudyProjects.map((project): StudyItem => ({
    href: getLabProjectPath(project),
    id: `lab-${project.id}`,
    kind: "lab",
    label: "system",
    meta: project.builder.oneLiner,
    project,
    title: project.title,
  }));
}

function buildNoteItems(posts: WritingPostMeta[]): StudyItem[] {
  return posts.map((post) => ({
    date: post.date,
    description: post.description,
    href: `/studies/${post.slug}`,
    id: `writing-${post.slug}`,
    kind: "writing",
    label: "note",
    meta: formatWritingDate(post.date),
    title: post.title,
  }));
}

function StudyTextRow({
  index,
  isLast = false,
  item,
}: {
  index: number;
  isLast?: boolean;
  item: StudyItem;
}) {
  const reduceMotion = useReducedMotion();
  const rowRef = useRef<HTMLLIElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: STUDY_ROW_SCROLL_OFFSETS,
  });
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], isLast ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  const scrollY = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], isLast ? [0, 0, 0, 0] : [10, 0, 0, -8]);
  const scrollBlur = useTransform(scrollYProgress, (value) => {
    if (isLast) return "blur(0px)";

    const entryBlur = value < 0.22 ? 1 - value / 0.22 : 0;
    const blur = entryBlur * 3;

    return `blur(${blur.toFixed(2)}px)`;
  });

  return (
    <motion.li
      ref={rowRef}
      key={item.id}
      initial={reduceMotion ? false : { opacity: 0, filter: "blur(3px)", y: 8 }}
      animate={reduceMotion ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={reduceMotion ? tweens.none : landingRowTransition(index)}
      data-project-row="studies"
      className="home-node group relative z-0 list-none hover:z-30 focus-within:z-30"
    >
      <motion.div
        className="block max-w-full transform-gpu"
        style={
          reduceMotion
            ? undefined
            : {
                opacity: scrollOpacity,
                filter: scrollBlur,
                y: scrollY,
                willChange: "opacity, filter, transform",
              }
        }
      >
        <Link
          href={item.href}
          className="home-row home-row--link micro-focus micro-focus-tight micro-pressable"
        >
          <HomeBulletCell />
          <span className="home-label project-row-copy">
            <span className="project-row-title-line--lateral font-normal">
              {item.title}
            </span>
            <StudyMetaLine
              label={item.label}
              meta={item.meta}
              className="home-meta project-row-meta"
            />
          </span>
        </Link>
      </motion.div>
    </motion.li>
  );
}

function OutlineListSection({ emptyLabel, items }: { emptyLabel: string; items: StudyItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="relative">
      <ul className="home-list">
        {items.map((item, index) => (
          <StudyTextRow
            key={item.id}
            index={index}
            isLast={index === items.length - 1}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
}

function HomeDocument({
  activeSection,
  interactionItems,
  noteItems,
  projects,
}: {
  activeSection: HomeTab;
  interactionItems: StudyItem[];
  noteItems: StudyItem[];
  projects: Project[];
}) {
  return (
    <motion.section
      id="top"
      variants={landingExploreVariants}
      className="home-doc-shell"
    >
      <motion.div id="profile" variants={landingIntroVariants} className="home-doc scroll-mt-28">
        <motion.h1 variants={landingRevealItem} className="home-doc-title">
          Minwook Shin
          <span> / design engineer</span>
        </motion.h1>

        <motion.div variants={landingRevealItem}>
          <HomeLeafRow>
            I design and build interfaces for AI-native products, from early idea to working software.
          </HomeLeafRow>
        </motion.div>

        <HomeOutlineSection defaultOpen title="now">
          <HomeLeafRow>still editing this website</HomeLeafRow>
          <HomeLeafRow>building product interfaces that work as proof, not just presentation</HomeLeafRow>
          <HomeLeafRow>keeping motion, code, and AI behavior in the same design system</HomeLeafRow>
        </HomeOutlineSection>

        <HomeOutlineSection
          active={activeSection === "work"}
          count={projects.length}
          defaultOpen={activeSection === "work"}
          sectionId="work"
          title="selected work"
        >
          <WorkSection projects={projects} />
          <HomeLeafRow>
            <HomeMetaLink href="/work">all work</HomeMetaLink>
          </HomeLeafRow>
        </HomeOutlineSection>

        <HomeOutlineSection
          active={activeSection === "studies"}
          count={interactionItems.length}
          defaultOpen
          sectionId="interaction-systems"
          title="interaction systems"
        >
          <OutlineListSection emptyLabel="interaction systems are coming soon." items={interactionItems} />
          <HomeLeafRow>
            <HomeMetaLink href="/studies">all systems</HomeMetaLink>
          </HomeLeafRow>
        </HomeOutlineSection>

        <HomeOutlineSection
          active={activeSection === "studies"}
          count={noteItems.length}
          defaultOpen
          sectionId="studies"
          title="notes"
        >
          <OutlineListSection emptyLabel="notes are coming soon." items={noteItems} />
          <HomeLeafRow>
            <HomeMetaLink href="/studies">all notes</HomeMetaLink>
          </HomeLeafRow>
        </HomeOutlineSection>

        <HomeOutlineSection count={4} defaultOpen title="contact">
          <HomeLeafRow>
            <HomeMetaLink href={PERSONAL_INFO.linkedin} external>linkedin.com/in/minwookshin</HomeMetaLink>
          </HomeLeafRow>
          <HomeLeafRow>
            <HomeMetaLink href={PERSONAL_INFO.github} external>github.com/minwookshin</HomeMetaLink>
          </HomeLeafRow>
          <HomeLeafRow>
            <HomeMetaLink href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</HomeMetaLink>
          </HomeLeafRow>
          <HomeLeafRow>
            <HomeMetaLink href={PERSONAL_INFO.resume}>resume</HomeMetaLink>
          </HomeLeafRow>
        </HomeOutlineSection>
      </motion.div>
    </motion.section>
  );
}

// Interface to store content snapshot for each message
export default function HomePage({ activeSection = "work", writingPosts }: HomePageProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const currentSection = activeSection;
  const [hasStarted, setHasStarted] = useState(false);
  // When true, the chat floats ON TOP of whatever view the user was in
  // (for example, a page section) instead of snapping back home. The
  // backing view stays mounted behind the chat. Opening a view
  // explicitly (for example, "Open X" or profile) drops the chat back
  // behind it so that view is in focus again.
  const [chatOnTop, setChatOnTop] = useState(false);
  const [projectNotice, setProjectNotice] = useState<string | null>(null);
  // Keep the landing motion quiet: the page simply settles in, with no separate
  // logo trace or position handoff.
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroReady(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Chat state. The /api/chat route streams plain text, so we manage messages
  // directly (see handleMessage) rather than via the AI SDK's useChat, whose v5
  // message/transport shape doesn't match this plain-text endpoint.
  type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; status?: "error" };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    }
  }, [messages, reduceMotion]);

  useEffect(() => {
    if (!projectNotice) return;
    const t = setTimeout(() => setProjectNotice(null), 2200);
    return () => clearTimeout(t);
  }, [projectNotice]);

  const handleMessage = async (message: string) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    // Bring the chat forward over whatever the user is currently looking at
    // rather than resetting to home.
    setChatOnTop(true);

    // Tell the backend what the user is currently looking at, so the AI can
    // resolve "this"/"it" and ground its answer in that screen.
    const viewContext = currentSection;

    const messageIdSeed = `${messages.length}-${message.length}`;
    const userMsg = { id: `user-${messageIdSeed}`, role: 'user' as const, content: message };
    const assistantId = `assistant-${messageIdSeed}`;

    const updateAssistantMessage = (content: string) => {
      setMessages(prev => prev.map(msg =>
        msg.id === assistantId ? { ...msg, content } : msg
      ));
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], context: viewContext }),
      });

      if (!res.ok) throw new Error('API error');
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setMessages(prev => [...prev, { id: assistantId, role: 'assistant' as const, content: '' }]);

      const readStream = async (currentText: string): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) {
          const tail = decoder.decode();
          const finalText = tail ? `${currentText}${tail}` : currentText;
          if (tail) updateAssistantMessage(finalText);
          return;
        }

        const nextText = `${currentText}${decoder.decode(value, { stream: true })}`;
        updateAssistantMessage(nextText);
        return readStream(nextText);
      };

      await readStream('');

      setIsStreaming(false);

    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => {
        const errorMessage: ChatMessage = {
          id: `assistant-error-${messageIdSeed}`,
          role: 'assistant' as const,
          content: 'i could not reach the ai demo. try again in a moment.',
          status: "error"
        };

        return prev.some((msg) => msg.id === assistantId)
          ? prev.map((msg) => (msg.id === assistantId ? { ...errorMessage, id: assistantId } : msg))
          : [...prev, errorMessage];
      });
    } finally {
      setIsStreaming(false);
    }
  };

  // Leave the chat view but KEEP the conversation history (reload clears it)
  const leaveChat = () => {
    setHasStarted(false);
    setChatOnTop(false);
  };

  // Re-open the chat (with history) when the user re-engages the composer
  const reopenChat = () => {
    if (messages.length > 0) setHasStarted(true);
  };

  const featuredProjects = orderProjects(MAIN_PROJECTS, FEATURED_PROJECT_IDS);
  const interactionItems = buildInteractionItems();
  const noteItems = buildNoteItems(writingPosts);

  const openProfile = () => {
    setChatOnTop(false);
    setHasStarted(false);
    requestAnimationFrame(() => {
      document.getElementById("profile")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
    });
  };

  const openProjectFromChat = (project: Project) => {
    if (project.comingSoon) {
      setProjectNotice(project.unavailableMessage ?? `${project.title} is not ready yet.`);
      return;
    }
    setHasStarted(false);
    setChatOnTop(false);
    const projectPath =
      currentSection === "studies" && isLabProject(project)
        ? getLabProjectPath(project)
        : getProjectPath(project);
    router.push(projectPath);
  };

  return (
    <main
      className="site-lowercase flex min-h-dvh flex-col overflow-x-hidden bg-[var(--bg-base)] pb-[calc(var(--space-8)*1.5)] text-[length:var(--type-0)] text-[var(--text-primary)]"
    >
      <ThemeToggle />

      {/* Crawlable substance for search engines and non-chatting visitors. Visually
          hidden, but real content so the page isn't an empty chat shell to bots. */}
      <section className="sr-only">
        <h2>{PERSONAL_INFO.name}, {PERSONAL_INFO.title}</h2>
        <p>{PERSONAL_INFO.bio}</p>
        <h3>Interaction systems</h3>
        <ul>
          {interactionItems.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>, {item.meta}
            </li>
          ))}
        </ul>
        <h3>Notes</h3>
        <ul>
          {noteItems.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>, {item.meta}
            </li>
          ))}
        </ul>
        <h3>Work</h3>
        <ul>
          {MAIN_PROJECTS.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>, {p.description}
              {p.tags?.length ? ` (${p.tags.join(", ")})` : ""}
            </li>
          ))}
        </ul>
        <h3>Contact</h3>
        <p>
          Email <a href={`mailto:${PERSONAL_INFO.email}`} tabIndex={-1}>{PERSONAL_INFO.email}</a>,{" "}
          <a href={PERSONAL_INFO.linkedin} tabIndex={-1}>LinkedIn</a>, <a href={PERSONAL_INFO.github} tabIndex={-1}>GitHub</a>.
        </p>
      </section>

      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate={introReady || reduceMotion ? "visible" : "hidden"}
        variants={reduceMotion ? undefined : landingPageVariants}
        className="flex-1"
      >
        <div className="light-cursor-dark bg-[var(--bg-base)] text-[var(--text-primary)]">
          <HomeDocument
            activeSection={currentSection}
            interactionItems={interactionItems}
            noteItems={noteItems}
            projects={featuredProjects}
          />
        </div>
      </motion.div>
      <AnimatePresence>
        {projectNotice && (
          <motion.div
            key="project-notice"
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={reduceMotion ? tweens.none : springs.spatialFast}
            className="fixed left-1/2 bottom-32 z-[76] -translate-x-1/2 rounded-[var(--md-shape-sm)] border border-on-surface/10 bg-surface/90 px-4 py-2 text-xs text-on-surface shadow-sm backdrop-blur-md"
          >
            {projectNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-outside catcher - leaving the chat keeps history (only reload clears it) */}
      {hasStarted && (messages.length > 0 || isStreaming) && (
        <div className="fixed inset-0 z-[34]" onClick={leaveChat} aria-hidden />
      )}

      {/* Chat - floating capsules rising from the bottom over the page, gradient-faded at top */}
      <AnimatePresence>
        {hasStarted && (messages.length > 0 || isStreaming) && (
          <motion.div
            ref={chatContainerRef}
            key="chat"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? tweens.none : tweens.base}
            className={`fixed left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 overflow-y-auto ${reduceMotion ? "" : "scroll-smooth"} ${chatOnTop ? "z-[72]" : "z-[35]"}`}
            style={{
              bottom: 96,
              maxHeight: "calc(100dvh - 180px)",
            }}
          >
            <div className="flex min-h-full flex-col justify-end gap-3 pb-7">
              {messages.map((msg, mi) => {
                const isUser = msg.role === "user";
                const isError = msg.status === "error";
                const { body, followups, show } = isUser
                  ? { body: msg.content, followups: [] as string[], show: null }
                  : parseAssistant(msg.content);
                const target = !isUser ? showToTarget(show) : null;
                const question = mi > 0 ? messages[mi - 1]?.content ?? "" : "";
                const isLast = mi === messages.length - 1;
                const showFollowups = !isUser && isLast && !isStreaming && followups.length > 0;
                return (
                  <motion.div
                    key={msg.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduceMotion ? tweens.none : springs.spatialFast}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-[var(--md-shape-sm)] px-4 py-3 ${
                        isUser
                          ? "bg-on-surface text-surface"
                          : isError
                          ? "border border-outline-variant bg-surface-container text-on-surface-variant"
                          : "bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{body}</p>
                      ) : (
                        <>
                          <div className="micro-richtext prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-normal prose-headings:text-on-surface prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-p:my-2 prose-p:text-on-surface prose-p:text-sm prose-p:leading-[1.55] prose-strong:text-on-surface prose-strong:font-normal prose-code:rounded-[var(--md-shape-sm)] prose-code:bg-surface-container-high prose-code:px-2 prose-code:py-1 prose-code:font-mono prose-code:text-xs prose-code:text-on-surface prose-code:before:content-none prose-code:after:content-none prose-pre:my-2 prose-pre:overflow-x-auto prose-pre:rounded-[var(--md-shape-sm)] prose-pre:border prose-pre:border-outline-variant prose-pre:bg-surface-container-high prose-pre:p-3 prose-ul:my-2 prose-ul:text-sm prose-ol:my-2 prose-li:my-1 prose-li:text-on-surface prose-li:leading-[1.55] prose-a:text-on-surface prose-a:font-normal prose-a:no-underline">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {body}
                            </ReactMarkdown>
                          </div>
                          {target && (
                            <motion.button
                              type="button"
                              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={reduceMotion ? tweens.none : { ...springs.spatialFast, delay: 0.15 }}
                            onClick={() => {
                              setChatOnTop(false);
                              if (target === "profile") {
                                openProfile();
                              } else if (target === "projects") {
                                router.push("/work", { scroll: false });
                                requestAnimationFrame(() => {
                                  document.getElementById("work")?.scrollIntoView({
                                    behavior: reduceMotion ? "auto" : "smooth",
                                    block: "center",
                                  });
                                });
                              } else if (target.comingSoon) {
                                setProjectNotice(target.unavailableMessage ?? `${target.title} is not ready yet.`);
                              } else {
                                openProjectFromChat(target);
                              }
                            }}
                            className="micro-focus micro-focus-tight micro-pressable mt-3 inline-flex items-center gap-2 rounded-[var(--md-shape-sm)] bg-surface-container-high px-4 py-2 text-xs font-normal text-on-surface hover:bg-outline-variant"
                          >
                              {target === "profile" ? "View profile" : target === "projects" ? "View work" : target.comingSoon ? `${target.title} is not ready yet` : `Open ${target.title}`}
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </motion.button>
                          )}
                        </>
                      )}
                    </div>
                    {showFollowups && (
                      <div className="flex flex-wrap gap-2">
                        {followups.map((f, fi) => (
                          <motion.button
                            key={f}
                            type="button"
                            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduceMotion ? tweens.none : { ...springs.spatialFast, delay: 0.1 + fi * 0.06 }}
                            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                            onClick={() => handleMessage(f)}
                            className="micro-focus micro-focus-tight micro-pressable inline-flex items-center rounded-[var(--md-shape-sm)] bg-surface-container-high px-3 py-2 text-xs font-normal text-on-surface hover:bg-outline-variant"
                          >
                            {f}
                          </motion.button>
                        ))}
                      </div>
                    )}
                    </div>
                  </motion.div>
                );
              })}

              {isStreaming && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={reduceMotion ? tweens.none : springs.spatialFast}
                  className="flex justify-start"
                >
                  <div className="rounded-[var(--md-shape-sm)] bg-surface-container-high px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {[0, 0.2, 0.4].map((d) => (
                        <motion.div
                          key={d}
                          animate={reduceMotion ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
                          transition={reduceMotion ? tweens.none : { duration: motionDurations.ambient, repeat: Infinity, delay: d }}
                          className="h-1.5 w-1.5 rounded-full bg-on-surface"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Input appears only when chat is active. Project detail uses a LinkedIn-only action. */}
      {hasStarted && (
        <ChatInput
          onSend={handleMessage}
          hasStarted={hasStarted}
          connectorKind="chat"
          onFocusInput={reopenChat}
          introReady={introReady}
        />
      )}
    </main>
  );
}
