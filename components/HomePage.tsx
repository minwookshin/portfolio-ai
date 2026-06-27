"use client";

import { useCallback, useMemo, useState, useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimationControls, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from "@/components/ChatInput";
import MaterialArrowForwardIcon from "@/components/MaterialArrowForwardIcon";
import type { Project } from "@/components/ProjectCard";
import { ArrowUpRight, Briefcase, Command, FileText, Mail, MessageCircle, NotebookText, Search } from "lucide-react";
import { motionDurations, springs, tweens } from "@/lib/material/motion";
import { formatWritingDate } from "@/lib/writingDisplay";
import type { WritingPostMeta } from "@/lib/writingTypes";
import {
  FEATURED_PROJECT_IDS,
  MAIN_PROJECTS,
  getLabProjectPath,
  getProjectPath,
  isLabProject,
  orderProjects,
} from "@/data/projects";
import type { PortfolioProject } from "@/data/projects";
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
      label?: string;
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

type HomeCommandItem = {
  action: () => void;
  group: string;
  icon: ReactNode;
  id: string;
  keywords: string[];
  meta: string;
  title: string;
};

function normalizeCommandText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function HomeCommandPalette({
  isOpen,
  items,
  onClose,
}: {
  isOpen: boolean;
  items: HomeCommandItem[];
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [lensRect, setLensRect] = useState<{ height: number; left: number; top: number; width: number } | null>(null);
  const visibleItems = useMemo(() => {
    const normalizedQuery = normalizeCommandText(query);
    if (!normalizedQuery) return items;

    return items.filter((item) =>
      [item.title, item.meta, item.group, ...item.keywords]
        .map(normalizeCommandText)
        .some((value) => value.includes(normalizedQuery)),
    );
  }, [items, query]);
  const clampedActiveIndex = visibleItems.length > 0 ? Math.min(activeIndex, visibleItems.length - 1) : 0;
  const activeItem = visibleItems[clampedActiveIndex];

  const updateLensRect = useCallback(() => {
    const row = rowRefs.current[clampedActiveIndex];
    const list = listRef.current;

    if (!isOpen || !row || !list || visibleItems.length === 0) {
      setLensRect(null);
      return;
    }

    const rowRect = row.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();

    setLensRect({
      height: rowRect.height,
      left: rowRect.left - listRect.left + list.scrollLeft,
      top: rowRect.top - listRect.top + list.scrollTop,
      width: rowRect.width,
    });
  }, [clampedActiveIndex, isOpen, visibleItems.length]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, visibleItems.length);
  }, [visibleItems.length]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const row = rowRefs.current[clampedActiveIndex];
    row?.scrollIntoView({ block: "nearest" });
    const frame = window.requestAnimationFrame(updateLensRect);
    return () => window.cancelAnimationFrame(frame);
  }, [clampedActiveIndex, isOpen, query, updateLensRect, visibleItems.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => updateLensRect();
    window.addEventListener("resize", handleResize);

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(handleResize);
    if (observer && listRef.current) {
      observer.observe(listRef.current);
      rowRefs.current.forEach((row) => {
        if (row) observer.observe(row);
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
    };
  }, [isOpen, updateLensRect, visibleItems.length]);

  const closePalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePalette();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("command-palette-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("command-palette-open");
    };
  }, [closePalette, isOpen]);

  const runCommand = (item: HomeCommandItem) => {
    item.action();
    closePalette();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="command-layer"
          className="command-layer"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? tweens.none : tweens.base}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePalette();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="site command palette"
            className="command-panel"
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
            transition={reduceMotion ? tweens.none : springs.spatialFast}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="command-search">
              <Search className="command-search__icon" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((index) => Math.min(index + 1, Math.max(visibleItems.length - 1, 0)));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((index) => Math.max(index - 1, 0));
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    if (activeItem) runCommand(activeItem);
                  }
                }}
                placeholder="search or run a command"
                aria-label="search commands"
              />
              <kbd aria-hidden="true">esc</kbd>
            </div>

            <div ref={listRef} className="command-list" role="listbox" aria-label="site commands">
              {visibleItems.length > 0 && (
                <motion.div
                  aria-hidden="true"
                  className="command-list__lens"
                  initial={false}
                  animate={
                    lensRect
                      ? {
                          height: lensRect.height,
                          opacity: 1,
                          width: lensRect.width,
                          x: lensRect.left,
                          y: lensRect.top,
                        }
                      : { opacity: 0 }
                  }
                  transition={reduceMotion ? tweens.none : springs.spatialFast}
                />
              )}
              {visibleItems.length > 0 ? (
                visibleItems.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(element) => {
                      rowRefs.current[index] = element;
                    }}
                    type="button"
                    className="command-row micro-focus micro-focus-tight"
                    data-active={index === clampedActiveIndex ? "true" : "false"}
                    onClick={() => runCommand(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <span className="command-row__icon" aria-hidden="true">{item.icon}</span>
                    <span className="command-row__copy">
                      <span className="command-row__title">{item.title}</span>
                      <span className="command-row__meta">{item.meta}</span>
                    </span>
                    <span className="command-row__group">{item.group}</span>
                  </button>
                ))
              ) : (
                <p className="command-empty">no command found</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StudyMetaLine({
  className = "",
  label,
  meta,
}: {
  className?: string;
  label?: string;
  meta: string;
}) {
  if (!label) {
    return <span className={`study-meta-row ${className}`.trim()}>{meta}</span>;
  }

  return (
    <span className={`study-meta-row ${className}`.trim()}>
      <span className="study-meta-label">{label}</span>
      <span aria-hidden="true" className="study-meta-separator">/</span>
      <span className="study-meta-detail">{meta}</span>
    </span>
  );
}

type HomeBulletVariant = "leaf" | "note" | "section" | "system" | "work";

function HomeBulletCell({
  section = false,
  signal = false,
  variant = "leaf",
}: {
  section?: boolean;
  signal?: boolean;
  variant?: HomeBulletVariant;
}) {
  const bulletVariant = section ? "section" : variant;

  return (
    <span className="home-bullet-cell" aria-hidden="true">
      <span className={`home-bullet home-bullet--${bulletVariant}`} />
      {section && (
        <span className="home-caret" aria-hidden="true">
          <MaterialArrowForwardIcon className="site-signal-icon site-signal-icon--section" />
        </span>
      )}
      {signal && !section && (
        <span className="home-signal" aria-hidden="true">
          <MaterialArrowForwardIcon className="site-signal-icon" />
        </span>
      )}
    </span>
  );
}

function HomeLeafRow({ children, signal = false }: { children: ReactNode; signal?: boolean }) {
  return (
    <div className="home-node">
      <div className={`home-row${signal ? " home-row--signal" : ""}`}>
        <HomeBulletCell signal={signal} />
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
          {!isOpen && typeof count === "number" && <span className="home-count">{count}</span>}
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
  const descriptor = project.comingSoon
    ? project.unavailableMessage ?? "Coming soon."
    : project.studioLabel ?? project.description;

  return [project.date, descriptor].filter(Boolean).join(" / ");
}

function ProjectTextRow({
  project,
  index,
  list,
}: {
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
      <HomeBulletCell signal={!project.comingSoon} variant="work" />
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
    if (reduceMotion) return;

    unavailableControls.stop();
    void unavailableControls.start(unavailableFeedbackAnimation());
  }, [reduceMotion, unavailableControls]);

  return (
    <motion.li
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

function WorkSection({ projects }: { projects: PortfolioProject[] }) {
  return (
    <div className="relative">
      <ul className="home-list">
        {projects.map((project, index) => (
          <ProjectTextRow
            key={project.id}
            project={project}
            index={index}
            list="work"
          />
        ))}
      </ul>
    </div>
  );
}

function buildNoteItems(posts: WritingPostMeta[]): StudyItem[] {
  return posts.map((post) => ({
    date: post.date,
    description: post.description,
    href: `/notes/${post.slug}`,
    id: `writing-${post.slug}`,
    kind: "writing",
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
      data-project-row={item.kind === "writing" ? "writing" : "studies"}
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
          className="home-row home-row--link home-row--quiet-link micro-focus micro-focus-tight micro-pressable"
        >
          <HomeBulletCell variant={item.kind === "lab" ? "system" : "note"} />
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
  noteItems,
  onOpenCommand,
  projects,
}: {
  activeSection: HomeTab;
  noteItems: StudyItem[];
  onOpenCommand: () => void;
  projects: PortfolioProject[];
}) {
  return (
    <motion.section
      id="top"
      variants={landingExploreVariants}
      className="home-doc-shell"
    >
      <motion.div id="profile" variants={landingIntroVariants} className="home-doc scroll-mt-28">
        <motion.div variants={landingRevealItem} className="home-doc-title-row">
          <h1 className="home-doc-title">
            Minwook Shin
            <span> / design engineer</span>
          </h1>
          <button
            type="button"
            className="command-trigger micro-focus micro-focus-tight micro-pressable"
            aria-label="Open command palette"
            onClick={onOpenCommand}
          >
            <Command aria-hidden="true" />
          </button>
        </motion.div>

        <motion.div variants={landingRevealItem}>
          <HomeLeafRow>
            I make interfaces, prototypes, and small systems for AI-native products.
          </HomeLeafRow>
        </motion.div>

        <HomeOutlineSection count={3} defaultOpen title="today">
          <HomeLeafRow>still editing this website</HomeLeafRow>
          <HomeLeafRow>building product interfaces that work as proof, not just presentation</HomeLeafRow>
          <HomeLeafRow>keeping motion, code, and AI behavior in the same design system</HomeLeafRow>
        </HomeOutlineSection>

        <HomeOutlineSection
          active={activeSection === "work" || activeSection === "studies"}
          count={projects.length}
          defaultOpen={activeSection === "work"}
          sectionId="work"
          title="work"
        >
          <WorkSection projects={projects} />
          <HomeLeafRow signal>
            <HomeMetaLink href="/work">all work</HomeMetaLink>
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
          <HomeLeafRow signal>
            <HomeMetaLink href="/notes">all notes</HomeMetaLink>
          </HomeLeafRow>
        </HomeOutlineSection>

        <HomeOutlineSection count={5} defaultOpen sectionId="contact" title="contact">
          <HomeLeafRow>
            <HomeMetaLink href={PERSONAL_INFO.linkedin} external>linkedin.com/in/minwookshin</HomeMetaLink>
          </HomeLeafRow>
          <HomeLeafRow>
            <HomeMetaLink href={PERSONAL_INFO.github} external>github.com/minwookshin</HomeMetaLink>
          </HomeLeafRow>
          <HomeLeafRow>
            <HomeMetaLink href={PERSONAL_INFO.x} external>x.com/FakeMinwook</HomeMetaLink>
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
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroReady(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsCommandOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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

  const handleMessage = useCallback(async (message: string) => {
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
  }, [currentSection, hasStarted, messages]);

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

  const openProjectFromCommand = useCallback((project: Project) => {
    if (project.comingSoon) {
      setProjectNotice(project.unavailableMessage ?? `${project.title} is not ready yet.`);
      return;
    }

    setHasStarted(false);
    setChatOnTop(false);
    router.push(isLabProject(project) ? getLabProjectPath(project) : getProjectPath(project));
  }, [router]);

  const copyEmail = useCallback(() => {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard
        .writeText(PERSONAL_INFO.email)
        .then(() => setProjectNotice("email copied"))
        .catch(() => {
          window.location.href = `mailto:${PERSONAL_INFO.email}`;
        });
      return;
    }

    window.location.href = `mailto:${PERSONAL_INFO.email}`;
  }, []);

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

  const commandItems = useMemo<HomeCommandItem[]>(() => {
    const openProjects = MAIN_PROJECTS.filter((project) => !project.comingSoon);
    const orderedProjects = [
      ...featuredProjects,
      ...openProjects.filter((project) => !featuredProjects.some((featured) => featured.id === project.id)),
    ].filter((project) => !project.comingSoon);

    return [
      {
        id: "view-work",
        title: "view work",
        meta: "proof log",
        group: "navigate",
        keywords: ["projects", "archive", "work"],
        icon: <Briefcase />,
        action: () => {
          setHasStarted(false);
          setChatOnTop(false);
          router.push("/work");
        },
      },
      {
        id: "view-notes",
        title: "view notes",
        meta: "thinking log",
        group: "navigate",
        keywords: ["writing", "notes", "thinking"],
        icon: <NotebookText />,
        action: () => {
          setHasStarted(false);
          setChatOnTop(false);
          router.push("/notes");
        },
      },
      {
        id: "view-contact",
        title: "view contact",
        meta: "links and email",
        group: "navigate",
        keywords: ["profile", "email", "linkedin", "github"],
        icon: <Mail />,
        action: () => {
          setHasStarted(false);
          setChatOnTop(false);
          requestAnimationFrame(() => {
            document.getElementById("contact")?.scrollIntoView({
              behavior: reduceMotion ? "auto" : "smooth",
              block: "center",
            });
          });
        },
      },
      ...orderedProjects.map((project) => ({
        id: `project-${project.slug ?? project.id}`,
        title: `open ${project.title.toLowerCase()}`,
        meta: getProjectDescriptor(project),
        group: "work",
        keywords: [project.title, project.description, project.studioLabel ?? "", project.date ?? ""],
        icon: <FileText />,
        action: () => openProjectFromCommand(project),
      })),
      ...(noteItems[0]
        ? [
            {
              id: `note-${noteItems[0].id}`,
              title: `open ${noteItems[0].title}`,
              meta: noteItems[0].meta,
              group: "notes",
              keywords: [
                noteItems[0].title,
                "description" in noteItems[0] ? noteItems[0].description : "",
                "writing",
              ],
              icon: <NotebookText />,
              action: () => {
                setHasStarted(false);
                setChatOnTop(false);
                router.push(noteItems[0].href);
              },
            },
          ]
        : []),
      {
        id: "copy-email",
        title: "copy email",
        meta: PERSONAL_INFO.email,
        group: "contact",
        keywords: ["contact", "mail", "reach"],
        icon: <Mail />,
        action: copyEmail,
      },
      {
        id: "open-resume",
        title: "open resume",
        meta: "pdf",
        group: "contact",
        keywords: ["cv", "profile"],
        icon: <FileText />,
        action: () => {
          setHasStarted(false);
          setChatOnTop(false);
          router.push(PERSONAL_INFO.resume);
        },
      },
      {
        id: "ask-portfolio",
        title: "ask about this portfolio",
        meta: "ai utility",
        group: "ask",
        keywords: ["ai", "assistant", "question", "portfolio"],
        icon: <MessageCircle />,
        action: () => void handleMessage("ask about this portfolio"),
      },
    ];
  }, [copyEmail, featuredProjects, handleMessage, noteItems, openProjectFromCommand, reduceMotion, router]);

  return (
    <main
      className="site-lowercase flex min-h-dvh flex-col overflow-x-hidden bg-[var(--bg-base)] pb-[calc(var(--space-8)*1.5)] text-[length:var(--type-0)] text-[var(--text-primary)]"
    >
      {/* Crawlable substance for search engines and non-chatting visitors. Visually
          hidden, but real content so the page isn't an empty chat shell to bots. */}
      <section className="sr-only">
        <h2>{PERSONAL_INFO.name}, {PERSONAL_INFO.title}</h2>
        <p>{PERSONAL_INFO.bio}</p>
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
          <a href={PERSONAL_INFO.linkedin} tabIndex={-1}>LinkedIn</a>,{" "}
          <a href={PERSONAL_INFO.github} tabIndex={-1}>GitHub</a>,{" "}
          <a href={PERSONAL_INFO.x} tabIndex={-1}>X</a>.
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
            noteItems={noteItems}
            onOpenCommand={() => setIsCommandOpen(true)}
            projects={featuredProjects}
          />
        </div>
      </motion.div>
      <HomeCommandPalette
        isOpen={isCommandOpen}
        items={commandItems}
        onClose={() => setIsCommandOpen(false)}
      />
      <AnimatePresence>
        {projectNotice && (
          <motion.div
            key="project-notice"
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={reduceMotion ? tweens.none : springs.spatialFast}
            className="fixed left-1/2 bottom-32 z-[76] -translate-x-1/2 rounded-[var(--md-shape-sm)] border border-on-surface/10 bg-surface/90 px-4 py-2 text-[length:var(--type-micro)] text-on-surface shadow-sm backdrop-blur-md"
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
                        <p className="text-[length:var(--type-row)] leading-relaxed whitespace-pre-wrap">{body}</p>
                      ) : (
                        <>
                          <div className="micro-richtext prose prose-sm max-w-none text-[length:var(--type-row)] prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-normal prose-headings:text-on-surface prose-h1:text-[length:var(--type-row)] prose-h2:text-[length:var(--type-row)] prose-h3:text-[length:var(--type-row)] prose-p:my-2 prose-p:text-on-surface prose-p:text-[length:var(--type-row)] prose-p:leading-[1.55] prose-strong:text-on-surface prose-strong:font-normal prose-code:rounded-[var(--md-shape-sm)] prose-code:bg-surface-container-high prose-code:px-2 prose-code:py-1 prose-code:font-mono prose-code:text-[length:var(--type-micro)] prose-code:text-on-surface prose-code:before:content-none prose-code:after:content-none prose-pre:my-2 prose-pre:overflow-x-auto prose-pre:rounded-[var(--md-shape-sm)] prose-pre:border prose-pre:border-outline-variant prose-pre:bg-surface-container-high prose-pre:p-3 prose-ul:my-2 prose-ul:text-[length:var(--type-row)] prose-ol:my-2 prose-li:my-1 prose-li:text-on-surface prose-li:leading-[1.55] prose-a:text-on-surface prose-a:font-normal prose-a:no-underline">
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
                            className="micro-focus micro-focus-tight micro-pressable mt-3 inline-flex items-center gap-2 rounded-[var(--md-shape-sm)] bg-surface-container-high px-4 py-2 text-[length:var(--type-micro)] font-normal text-on-surface hover:bg-outline-variant"
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
                            className="micro-focus micro-focus-tight micro-pressable inline-flex items-center rounded-[var(--md-shape-sm)] bg-surface-container-high px-3 py-2 text-[length:var(--type-micro)] font-normal text-on-surface hover:bg-outline-variant"
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
