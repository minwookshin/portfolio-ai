"use client";

import { Fragment, useCallback, useState, useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BlurImage from "@/components/BlurImage";
import BuildMeta from "@/components/BuildMeta";
import ChatInput from "@/components/ChatInput";
import HoverVideoPreview from "@/components/HoverVideoPreview";
import LabArchiveGrid from "@/components/LabArchiveGrid";
import type { Project } from "@/components/ProjectCard";
import { ArrowUpRight } from "lucide-react";
import { motionDurations, springs, tweens } from "@/lib/material/motion";
import { saveProjectOpenScroll } from "@/lib/projectScrollRestoration";
import { formatWritingDate } from "@/lib/writingDisplay";
import type { WritingPostMeta } from "@/lib/writingTypes";
import {
  FEATURED_PROJECT_IDS,
  MAIN_PROJECTS,
  PROJECT_PREVIEW_VIDEOS,
  getLabProjectPath,
  getProjectPath,
  isLabProject,
  orderProjects,
} from "@/data/projects";
import { PERSONAL_INFO } from "@/data/personal";

type HomeTab = "work" | "writing" | "lab";

type HomePageProps = {
  activeSection?: HomeTab;
  writingPosts: WritingPostMeta[];
};

const HOME_SECTION_LINKS: Array<{ href: string; id: HomeTab; label: string }> = [
  { href: "/work", id: "work", label: "work" },
  { href: "/writing", id: "writing", label: "writing" },
  { href: "/lab", id: "lab", label: "lab" },
];

function getHomeSectionFromPath(pathname: string): HomeTab | null {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
  if (!segment || segment === "work") return "work";
  if (segment === "writing" || segment === "lab") return segment;
  return null;
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

function ProjectMedia({
  previewLayer,
  project,
  tone = "light",
  reduceMotion = false,
}: {
  previewLayer?: ReactNode;
  project: Project;
  tone?: "light" | "dark";
  reduceMotion?: boolean;
}) {
  const src = project.image ?? project.icon;
  const mediaBg =
    tone === "dark"
      ? "border border-[var(--dark-border)] bg-[var(--dark-bg-surface)]"
      : "border border-[var(--dark-border)] bg-[var(--dark-bg-base)]";

  if (src) {
    return (
      <div className="work-preview-soft-edge relative aspect-[1.5] w-full overflow-hidden rounded-[var(--md-shape-lg)]">
        <BlurImage
          src={src}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 74vw, 680px"
          draggable={false}
          className={`object-cover ${
            reduceMotion ? "" : "transition duration-[var(--motion-duration-extended)] ease-[var(--motion-ease-standard)] group-hover:scale-[1.035]"
          }`}
        />
        {previewLayer}
      </div>
    );
  }

  return (
    <div className={`work-preview-soft-edge relative flex aspect-[1.5] w-full items-center justify-center overflow-hidden rounded-[var(--md-shape-lg)] ${mediaBg} text-4xl text-[var(--dark-text-primary)]`}>
      {project.glyph ?? project.title.charAt(0)}
      {previewLayer}
    </div>
  );
}

function IntroLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="intro-contact-link micro-focus micro-pressable text-[length:var(--type-0)]"
    >
      {children}
    </a>
  );
}

function getProjectDescriptor(project: Project) {
  return project.comingSoon
    ? project.unavailableMessage ?? "Coming soon."
    : project.studioLabel ?? project.description;
}

function ProjectTextRow({
  onActivate,
  onDeactivate,
  project,
  index,
  list,
}: {
  onActivate?: () => void;
  onDeactivate?: () => void;
  project: Project;
  index: number;
  list: "work" | "lab";
}) {
  const reduceMotion = useReducedMotion();
  const descriptor = getProjectDescriptor(project);
  const isWorkRow = list === "work" && !project.comingSoon;
  const rowClass =
    "micro-focus micro-pressable relative z-10 inline-flex min-h-12 max-w-full flex-col items-start justify-center gap-0.5 rounded-[var(--md-shape-lg)] px-2 py-1 text-left";
  const titleClass = [
    "font-normal leading-[var(--leading-tight)]",
    isWorkRow ? "project-row-title-line--lateral" : "text-[var(--text-primary)]",
    project.comingSoon ? "" : isWorkRow ? "" : "project-row-title-line",
  ]
    .filter(Boolean)
    .join(" ");
  const rowText = (
    <>
      <span className="project-row-copy flex min-w-0 flex-col items-start gap-2">
        <span className={titleClass}>
          {project.title}
        </span>
        <span className="project-row-meta min-w-0 text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">
          {descriptor}
        </span>
      </span>
    </>
  );

  return (
    <motion.li
      onBlur={onDeactivate}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onPointerEnter={onActivate}
      onPointerLeave={onDeactivate}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
      viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
      transition={reduceMotion ? tweens.none : { ...springs.spatialDefault, delay: Math.min(index * 0.035, motionDurations.fast) }}
      data-project-row={list}
      className="-mx-2 group relative z-0 w-fit max-w-full list-none text-[length:var(--type-0)] hover:z-30 focus-within:z-30"
    >
      {project.comingSoon ? (
        <div aria-disabled="true" className={rowClass}>
          {rowText}
        </div>
      ) : (
        <Link
          href={getProjectPath(project)}
          scroll={false}
          onClick={saveProjectOpenScroll}
          className={rowClass}
        >
          {rowText}
        </Link>
      )}
    </motion.li>
  );
}

function WorkFixedPreview({
  project,
  reduceMotion,
}: {
  project: Project;
  reduceMotion: boolean;
}) {
  const previewVideo = PROJECT_PREVIEW_VIDEOS[project.title];
  const previewFrameClass = [
    "work-preview-soft-edge relative aspect-[1.5] w-full overflow-hidden rounded-[var(--md-shape-lg)] bg-[var(--dark-bg-base)]",
    project.slug === "sentinel" ? "work-preview-sentinel-video" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (previewVideo && !reduceMotion) {
    return (
      <div className={previewFrameClass}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={previewVideo}
          className="block h-full w-full object-cover"
        />
      </div>
    );
  }

  return <ProjectMedia project={project} reduceMotion={reduceMotion} />;
}

function EditorialIntro() {
  return (
    <section id="top" className="mx-auto flex w-full max-w-[1180px] justify-center bg-[var(--bg-base)] px-[var(--space-3)] pb-[var(--space-4)] pt-[92px] sm:px-[var(--space-5)] md:pt-[122px]">
      <div id="profile" className="w-full max-w-[620px] scroll-mt-28 text-left">
        <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">Minwook Shin</p>
        <p className="mt-[var(--space-1)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">Design engineer</p>
        <h1 className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
          I design and build interfaces for AI-native products, from early idea to working software.
        </h1>
        <p className="mt-[var(--space-1)] max-w-[var(--measure)] leading-[var(--leading-body)] text-[var(--text-muted)]">
          <IntroLink href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</IntroLink>
          {", "}
          <IntroLink href={PERSONAL_INFO.linkedin} external>LinkedIn</IntroLink>
          {", "}
          <IntroLink href={PERSONAL_INFO.github} external>GitHub</IntroLink>
          {", "}
          <span className="text-[var(--text-primary)]">and</span>
          {" "}
          <IntroLink href={PERSONAL_INFO.resume} external>Resume</IntroLink>
          {"."}
        </p>
      </div>
    </section>
  );
}

function WorkSection({
  projects,
}: {
  projects: Project[];
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const canShowFixedPreview = useCanShowWorkPreview();
  const hidePreviewTimer = useRef<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const clearHideTimer = useCallback(() => {
    if (!hidePreviewTimer.current) return;
    window.clearTimeout(hidePreviewTimer.current);
    hidePreviewTimer.current = null;
  }, []);

  const activateRow = useCallback((index: number) => {
    clearHideTimer();
    setPreviewIndex(index);
  }, [clearHideTimer]);

  const deactivateRow = useCallback(() => {
    clearHideTimer();
    hidePreviewTimer.current = window.setTimeout(() => {
      setPreviewIndex(null);
    }, 120);
  }, [clearHideTimer]);

  useEffect(() => {
    return () => clearHideTimer();
  }, [clearHideTimer]);

  const previewProject = previewIndex === null ? null : projects[previewIndex];

  return (
    <div className="relative">
      <div>
        <ul className="space-y-[var(--space-2)]">
          {projects.map((project, index) => (
            <ProjectTextRow
              key={project.id}
              onActivate={() => activateRow(index)}
              onDeactivate={deactivateRow}
              project={project}
              index={index}
              list="work"
            />
          ))}
        </ul>
      </div>
      {canShowFixedPreview && (
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-20 hidden aspect-[1.5] w-[min(34vw,360px)] md:block">
          <AnimatePresence initial={false}>
            {previewProject && (
              <motion.div
                key={previewProject.id}
                className="absolute inset-0 transform-gpu"
                initial={reduceMotion ? { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 } : { opacity: 0, filter: "blur(12px)", scale: 0.985, y: 7 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0, filter: "blur(0px)", scale: 1, y: 0 } : { opacity: 0, filter: "blur(8px)", scale: 0.992, y: -4 }}
                transition={
                  reduceMotion
                    ? tweens.instant
                    : {
                        opacity: { type: "tween", duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                        filter: { type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                        scale: { type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                        y: { type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                      }
                }
                style={{ willChange: "opacity, filter, transform" }}
              >
                <WorkFixedPreview project={previewProject} reduceMotion={reduceMotion} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function WritingSection({ posts }: { posts: WritingPostMeta[] }) {
  const reduceMotion = useReducedMotion();

  if (posts.length === 0) {
    return (
      <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
        writing is coming soon.
      </p>
    );
  }

  return (
    <ul className="space-y-[var(--space-2)]">
      {posts.map((post, index) => (
        <motion.li
          key={post.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
          viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
          transition={reduceMotion ? tweens.none : { ...springs.spatialDefault, delay: Math.min(index * 0.035, motionDurations.fast) }}
          data-project-row="writing"
          className="-mx-2 group list-none text-[length:var(--type-0)]"
        >
          <Link
            href={`/writing/${post.slug}`}
            className="micro-focus micro-pressable relative z-10 inline-flex min-h-12 max-w-full flex-col items-start justify-center rounded-[var(--md-shape-lg)] px-2 py-1 text-left"
          >
            <span className="project-row-copy flex max-w-full flex-col items-start gap-2">
              <span className="project-row-title-line--lateral max-w-full font-normal leading-[var(--leading-tight)]">
                {post.title}
              </span>
              <span className="project-row-meta text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">
                {formatWritingDate(post.date)}
              </span>
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}

function HomeExploreSection({
  activeSection,
  onSectionNavigate,
  projects,
  writingPosts,
}: {
  activeSection: HomeTab;
  onSectionNavigate?: (section: HomeTab, href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  projects: Project[];
  writingPosts: WritingPostMeta[];
}) {
  const isLab = activeSection === "lab";

  return (
    <section id={activeSection} className="mx-auto w-full max-w-[1180px] px-[var(--space-3)] pb-[var(--space-6)] pt-[var(--space-4)] sm:px-[var(--space-5)]">
      <div className="mx-auto w-full max-w-[620px] text-left">
        <nav
          aria-label="sections"
          className="flex flex-wrap items-baseline gap-x-0 gap-y-1 text-[length:var(--type-1)] leading-[var(--leading-heading)]"
        >
          {HOME_SECTION_LINKS.map((link, index) => {
            const selected = link.id === activeSection;

            return (
              <Fragment key={link.id}>
                <Link
                  aria-current={selected ? "page" : undefined}
                  className="home-tab-button micro-focus micro-focus-tight"
                  data-active={selected ? "true" : "false"}
                  href={link.href}
                  onClick={(event) => onSectionNavigate?.(link.id, link.href, event)}
                >
                  {link.label}
                </Link>
                {index < HOME_SECTION_LINKS.length - 1 && (
                  <span aria-hidden="true" className="mr-1.5 text-[var(--text-muted)]" role="presentation">
                    ,
                  </span>
                )}
              </Fragment>
            );
          })}
        </nav>
      </div>

      <div className={`mx-auto mt-[var(--space-2)] w-full ${isLab ? "max-w-[980px]" : "max-w-[620px] text-left"}`}>
        {activeSection === "work" && <WorkSection projects={projects} />}
        {activeSection === "writing" && <WritingSection posts={writingPosts} />}
        {activeSection === "lab" && <LabArchiveGrid className="w-full" />}
      </div>
    </section>
  );
}

// Interface to store content snapshot for each message
export default function HomePage({ activeSection = "work", writingPosts }: HomePageProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [localSection, setLocalSection] = useState<HomeTab | null>(null);
  const currentSection = localSection ?? activeSection;
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

  useEffect(() => {
    const handlePopState = () => {
      const nextSection = getHomeSectionFromPath(window.location.pathname);
      if (nextSection) setLocalSection(nextSection);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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
    saveProjectOpenScroll();
    const projectPath =
      activeSection === "lab" && isLabProject(project)
        ? getLabProjectPath(project)
        : getProjectPath(project);
    router.push(projectPath, { scroll: false });
  };

  const handleSectionNavigate = useCallback((section: HomeTab, href: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    setLocalSection(section);
    setChatOnTop(false);

    if (window.location.pathname !== href) {
      window.history.pushState(null, "", href);
    }
  }, []);

  return (
    <main
      className="site-lowercase flex min-h-dvh flex-col overflow-x-hidden bg-[var(--bg-base)] text-[length:var(--type-0)] text-[var(--text-primary)]"
    >

      {/* Crawlable substance for search engines and non-chatting visitors. Visually
          hidden, but real content so the page isn't an empty chat shell to bots. */}
      <section className="sr-only">
        <h2>{PERSONAL_INFO.name}, {PERSONAL_INFO.title}</h2>
        <p>{PERSONAL_INFO.bio}</p>
        <h3>Writing</h3>
        <ul>
          {writingPosts.map((post) => (
            <li key={post.slug}>
              <strong>{post.title}</strong>, {post.date}, {post.description}
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
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: introReady ? 1 : 0, y: reduceMotion ? 0 : introReady ? 0 : 8 }}
        transition={reduceMotion ? tweens.none : tweens.slower}
        className="flex-1"
      >
        <div className="light-cursor-dark bg-[var(--bg-base)] text-[var(--text-primary)]">
          <EditorialIntro />
          <HomeExploreSection
            activeSection={currentSection}
            onSectionNavigate={handleSectionNavigate}
            projects={featuredProjects}
            writingPosts={writingPosts}
          />
        </div>
      </motion.div>
      <BuildMeta className="mx-auto mt-auto w-[calc(100%_-_(var(--space-3)*2))] max-w-[620px] pb-[var(--space-4)] pt-[var(--space-4)] text-[length:var(--type-0)] sm:w-[calc(100%_-_(var(--space-5)*2))]" />

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
                                document.getElementById("work")?.scrollIntoView({
                                  behavior: reduceMotion ? "auto" : "smooth",
                                  block: "center",
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
