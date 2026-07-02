"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCopyFeedback } from "@/components/CopyFeedback";
import MaterialArrowForwardIcon from "@/components/MaterialArrowForwardIcon";
import type { Project } from "@/components/ProjectCard";
import SiteMasthead from "@/components/SiteMasthead";
import { Check, Copy } from "lucide-react";
import { glassLensTransition } from "@/lib/material/motion";
import { formatWritingDate } from "@/lib/writingDisplay";
import type { WritingPostMeta } from "@/lib/writingTypes";
import {
  FEATURED_PROJECT_IDS,
  MAIN_PROJECTS,
  getProjectPath,
  orderProjects,
} from "@/data/projects";
import type { PortfolioProject } from "@/data/projects";
import { PERSONAL_INFO } from "@/data/personal";

type HomeTab = "work" | "studies";

type HomePageProps = {
  activeSection?: HomeTab;
  writingPosts: WritingPostMeta[];
};

const DOCUMENT_BOOT_EASE = [0.22, 1, 0.36, 1] as const;

function unavailableFeedbackAnimation() {
  return {
    rotateX: [0, -7, 3, 0],
    rotateY: [0, 6, -2, 0],
    scale: [1, 0.985, 1.002, 1],
    x: [0, 1, -1, 0],
    y: [0, -1, 0],
    transition: {
      duration: 0.34,
      ease: DOCUMENT_BOOT_EASE,
    },
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

function HomeLeafRow({
  children,
  intro = false,
  signal = false,
}: {
  children: ReactNode;
  intro?: boolean;
  signal?: boolean;
}) {
  const rowClassName = [
    "home-row",
    intro ? "home-row--intro" : "",
    signal ? "home-row--signal" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="home-node">
      <div className={rowClassName}>
        <HomeBulletCell signal={signal} />
        <span className="home-label">{children}</span>
      </div>
    </div>
  );
}

function HomeMetaLink({
  children,
  copyLabel,
  copyValue,
  external = false,
  href,
  onCopy,
  sharedGlass = false,
}: {
  children: string;
  copyLabel?: string;
  copyValue?: string;
  external?: boolean;
  href: string;
  onCopy?: (value: string, label: string, options?: { notify?: boolean }) => boolean | void | Promise<boolean | void>;
  sharedGlass?: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pointerActivatedRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const className = [
    "home-mention",
    sharedGlass ? "home-mention--shared-glass" : "",
    "micro-focus",
    "micro-focus-tight",
    "micro-pressable",
  ].filter(Boolean).join(" ");
  const sharedGlassProps = sharedGlass ? { "data-contact-lens-target": "" } : {};

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (copyValue) {
    return (
      <button
        type="button"
        ref={buttonRef}
        className={`${className} home-mention--copy`}
        {...sharedGlassProps}
        aria-label={`copy ${copyLabel ?? children}`}
        onPointerDown={() => {
          pointerActivatedRef.current = true;
        }}
        onClick={async () => {
          const didCopy = await onCopy?.(copyValue, copyLabel ?? children, { notify: false });
          if (didCopy) {
            setCopied(false);
            setLiveMessage("");
            window.setTimeout(() => {
              setCopied(true);
              setLiveMessage(`${copyLabel ?? children} copied`);
            }, 0);
            if (pointerActivatedRef.current) {
              window.setTimeout(() => {
                buttonRef.current?.blur();
                pointerActivatedRef.current = false;
              }, 650);
            }
          } else if (href.startsWith("mailto:")) {
            window.location.href = href;
          }
        }}
      >
        <span className="home-mention-copy-icon" aria-hidden="true">
          {copied ? <Check /> : <Copy />}
        </span>
        <span>{children}</span>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </span>
      </button>
    );
  }

  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
        {...sharedGlassProps}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      {...sharedGlassProps}
    >
      {children}
    </Link>
  );
}

const CONTACT_LENS_HEIGHT = 36;
const CONTACT_LENS_PADDING_X = 12;

type ContactLensState = {
  height: number;
  opacity: number;
  width: number;
  x: number;
  y: number;
};

function ContactLensList({
  onCopy,
}: {
  onCopy: (value: string, label: string, options?: { notify?: boolean }) => boolean | void | Promise<boolean | void>;
}) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [lens, setLens] = useState<ContactLensState>({
    height: CONTACT_LENS_HEIGHT,
    opacity: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current === null) return;
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setLens((current) => ({ ...current, opacity: 0 }));
      hideTimerRef.current = null;
    }, 220);
  }, [clearHideTimer]);

  const activateLens = useCallback((target: EventTarget | null) => {
    const container = containerRef.current;
    if (!container || !(target instanceof Element)) return;

    const item = target.closest<HTMLElement>("[data-contact-lens-target]");
    if (!item || !container.contains(item)) return;

    clearHideTimer();

    const itemRect = item.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const width = Math.max(itemRect.width + CONTACT_LENS_PADDING_X * 2, CONTACT_LENS_HEIGHT);
    const height = CONTACT_LENS_HEIGHT;

    setLens({
      height,
      opacity: 1,
      width,
      x: itemRect.left - containerRect.left - CONTACT_LENS_PADDING_X,
      y: itemRect.top - containerRect.top + (itemRect.height - height) / 2,
    });
  }, [clearHideTimer]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  return (
    <div
      ref={containerRef}
      className="home-contact-lens-list"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleHide();
      }}
      onFocusCapture={(event) => activateLens(event.target)}
      onPointerLeave={scheduleHide}
      onPointerOver={(event) => activateLens(event.target)}
    >
      <motion.span
        aria-hidden="true"
        className="home-contact-lens"
        initial={false}
        animate={lens}
        transition={reduceMotion ? { duration: 0 } : glassLensTransition}
      />
      <HomeLeafRow signal>
        <HomeMetaLink href={PERSONAL_INFO.linkedin} external sharedGlass>linkedin.com/in/minwookshin</HomeMetaLink>
      </HomeLeafRow>
      <HomeLeafRow signal>
        <HomeMetaLink href={PERSONAL_INFO.github} external sharedGlass>github.com/minwookshin</HomeMetaLink>
      </HomeLeafRow>
      <HomeLeafRow signal>
        <HomeMetaLink href={PERSONAL_INFO.x} external sharedGlass>x.com/FakeMinwook</HomeMetaLink>
      </HomeLeafRow>
      <HomeLeafRow signal>
        <HomeMetaLink
          copyLabel="email"
          copyValue={PERSONAL_INFO.email}
          href={`mailto:${PERSONAL_INFO.email}`}
          onCopy={onCopy}
          sharedGlass
        >
          {PERSONAL_INFO.email}
        </HomeMetaLink>
      </HomeLeafRow>
      <HomeLeafRow signal>
        <HomeMetaLink href={PERSONAL_INFO.resume} sharedGlass>resume</HomeMetaLink>
      </HomeLeafRow>
    </div>
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
    <details
      className="home-node home-node--section"
      data-active={active ? "true" : "false"}
      id={sectionId}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      open={isOpen}
    >
      <summary className="home-row home-row--summary micro-focus micro-focus-tight">
        <HomeBulletCell section />
        <span className="home-label">
          {title}
          {!isOpen && typeof count === "number" && <span className="home-count">{count}</span>}
        </span>
      </summary>
      <div className="home-children">{children}</div>
    </details>
  );
}

function getProjectDescriptor(project: Project) {
  return project.comingSoon
    ? [project.date, project.unavailableMessage ?? "Coming soon."].filter(Boolean).join(" · ")
    : project.date ?? "";
}

function ProjectTextRow({
  project,
  list,
}: {
  project: Project;
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
        {projects.map((project) => (
          <ProjectTextRow
            key={project.id}
            project={project}
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
  item,
}: {
  item: StudyItem;
}) {
  return (
    <motion.li
      key={item.id}
      data-project-row={item.kind === "writing" ? "writing" : "studies"}
      className="home-node group relative z-0 list-none hover:z-30 focus-within:z-30"
    >
      <div className="block max-w-full transform-gpu">
        <Link
          href={item.href}
          className="home-row home-row--link micro-focus micro-focus-tight micro-pressable"
        >
          <HomeBulletCell signal variant={item.kind === "lab" ? "system" : "note"} />
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
      </div>
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
        {items.map((item) => (
          <StudyTextRow
            key={item.id}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
}

function HomeDocument({
  activeSection,
  onCopy,
  noteItems,
  projects,
}: {
  activeSection: HomeTab;
  onCopy: (value: string, label: string, options?: { notify?: boolean }) => boolean | void | Promise<boolean | void>;
  noteItems: StudyItem[];
  projects: PortfolioProject[];
}) {
  return (
    <section id="top" className="home-doc-shell">
      <div id="profile" className="home-doc scroll-mt-28">
        <SiteMasthead heading home className="home-doc-title-row" />

        <div className="home-document-content document-content-boot">
          <HomeLeafRow intro>
            I make things.
          </HomeLeafRow>

          <HomeOutlineSection count={3} defaultOpen title="today">
            <HomeLeafRow>editing this website</HomeLeafRow>
            <HomeLeafRow>building proof-led product interfaces</HomeLeafRow>
            <HomeLeafRow>keeping motion, code, and AI behavior in one system</HomeLeafRow>
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
            <ContactLensList onCopy={onCopy} />
          </HomeOutlineSection>
        </div>

      </div>
    </section>
  );
}

export default function HomePage({ activeSection = "work", writingPosts }: HomePageProps) {
  const currentSection = activeSection;
  const { copyText } = useCopyFeedback();
  const featuredProjects = orderProjects(MAIN_PROJECTS, FEATURED_PROJECT_IDS);
  const noteItems = buildNoteItems(writingPosts);

  return (
    <main
      className="site-lowercase flex min-h-dvh flex-col overflow-x-hidden bg-[var(--bg-base)] pb-[calc(var(--space-8)*1.5)] text-[length:var(--type-0)] text-[var(--text-primary)]"
    >
      {/* Crawlable substance for search engines and non-visual readers. */}
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

      <div className="flex-1">
        <div className="light-cursor-dark bg-[var(--bg-base)] text-[var(--text-primary)]">
          <HomeDocument
            activeSection={currentSection}
            noteItems={noteItems}
            onCopy={copyText}
            projects={featuredProjects}
          />
        </div>
      </div>
    </main>
  );
}
