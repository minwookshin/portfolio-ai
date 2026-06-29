"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimationControls, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from "@/components/ChatInput";
import { useCopyFeedback } from "@/components/CopyFeedback";
import { ASK_PORTFOLIO_EVENT, ASK_PORTFOLIO_STORAGE_KEY, openGlobalCommandPalette } from "@/components/GlobalCommandPalette";
import MaterialArrowForwardIcon from "@/components/MaterialArrowForwardIcon";
import type { Project } from "@/components/ProjectCard";
import { ArrowUpRight, Check, Command, Copy } from "lucide-react";
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

const DOCUMENT_BOOT_EASE = [0.22, 1, 0.36, 1] as const;
const DOCUMENT_BOOT_DELAY = 0.04;
const DOCUMENT_BOOT_STAGGER = 0.018;
const DOCUMENT_BOOT_Y = 2;
const DOCUMENT_BOOT_OPACITY_DURATION = 0.18;
const DOCUMENT_BOOT_Y_DURATION = 0.2;

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

const landingPageVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
};

const landingIntroVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: DOCUMENT_BOOT_DELAY,
      staggerChildren: DOCUMENT_BOOT_STAGGER,
    },
  },
};

const landingExploreVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
};

const landingRevealItem: Variants = {
  hidden: {
    opacity: 0,
    y: DOCUMENT_BOOT_Y,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { type: "tween", duration: DOCUMENT_BOOT_OPACITY_DURATION, ease: DOCUMENT_BOOT_EASE },
      y: { type: "tween", duration: DOCUMENT_BOOT_Y_DURATION, ease: DOCUMENT_BOOT_EASE },
    },
  },
};

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
}: {
  children: string;
  copyLabel?: string;
  copyValue?: string;
  external?: boolean;
  href: string;
  onCopy?: (value: string, label: string, options?: { notify?: boolean }) => boolean | void | Promise<boolean | void>;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pointerActivatedRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const className = "home-mention micro-focus micro-focus-tight micro-pressable";

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
  onOpenCommand,
  projects,
}: {
  activeSection: HomeTab;
  onCopy: (value: string, label: string, options?: { notify?: boolean }) => boolean | void | Promise<boolean | void>;
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
            minwook shin
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
          <HomeLeafRow intro>
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
            <HomeMetaLink
              copyLabel="email"
              copyValue={PERSONAL_INFO.email}
              href={`mailto:${PERSONAL_INFO.email}`}
              onCopy={onCopy}
            >
              {PERSONAL_INFO.email}
            </HomeMetaLink>
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
  const { copyText } = useCopyFeedback();
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

  useEffect(() => {
    const onAskFromCommand = () => {
      void handleMessage("ask about this portfolio");
    };

    window.addEventListener(ASK_PORTFOLIO_EVENT, onAskFromCommand);

    if (window.sessionStorage.getItem(ASK_PORTFOLIO_STORAGE_KEY) === "true") {
      window.sessionStorage.removeItem(ASK_PORTFOLIO_STORAGE_KEY);
      onAskFromCommand();
    }

    return () => window.removeEventListener(ASK_PORTFOLIO_EVENT, onAskFromCommand);
  }, [handleMessage]);

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
            onCopy={copyText}
            onOpenCommand={openGlobalCommandPalette}
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
            className="chat-notice fixed left-1/2 bottom-32 z-[76] -translate-x-1/2"
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
            transition={reduceMotion ? tweens.none : tweens.fast}
            className={`chat-thread fixed left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 overflow-y-auto ${reduceMotion ? "" : "scroll-smooth"} ${chatOnTop ? "z-[72]" : "z-[35]"}`}
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
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduceMotion ? tweens.none : tweens.fast}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`chat-bubble px-4 py-3 ${
                        isUser
                          ? "chat-bubble--user"
                          : isError
                          ? "chat-bubble--error"
                          : "chat-bubble--assistant"
                      }`}
                    >
                      {isUser ? (
                        <p className="text-[length:var(--type-row)] leading-relaxed whitespace-pre-wrap">{body}</p>
                      ) : (
                        <>
                          <div className="chat-richtext micro-richtext prose prose-sm max-w-none text-[length:var(--type-row)] prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-normal prose-headings:text-on-surface prose-h1:text-[length:var(--type-row)] prose-h2:text-[length:var(--type-row)] prose-h3:text-[length:var(--type-row)] prose-p:my-2 prose-p:text-on-surface prose-p:text-[length:var(--type-row)] prose-p:leading-[1.55] prose-strong:text-on-surface prose-strong:font-normal prose-code:rounded-[var(--md-shape-sm)] prose-code:bg-surface-container-high prose-code:px-2 prose-code:py-1 prose-code:font-mono prose-code:text-[length:var(--type-micro)] prose-code:text-on-surface prose-code:before:content-none prose-code:after:content-none prose-pre:my-2 prose-pre:overflow-x-auto prose-pre:rounded-[var(--md-shape-sm)] prose-pre:border prose-pre:border-outline-variant prose-pre:bg-surface-container-high prose-pre:p-3 prose-ul:my-2 prose-ul:text-[length:var(--type-row)] prose-ol:my-2 prose-li:my-1 prose-li:text-on-surface prose-li:leading-[1.55] prose-a:text-on-surface prose-a:font-normal prose-a:no-underline">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {body}
                            </ReactMarkdown>
                          </div>
                          {target && (
                            <motion.button
                              type="button"
                              initial={reduceMotion ? false : { opacity: 0, y: 2 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={reduceMotion ? tweens.none : { ...tweens.fast, delay: 0.08 }}
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
                            className="chat-inline-action micro-focus micro-focus-tight micro-pressable mt-3"
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
                            initial={reduceMotion ? false : { opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduceMotion ? tweens.none : { ...tweens.fast, delay: 0.05 + fi * 0.025 }}
                            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                            onClick={() => handleMessage(f)}
                            className="chat-inline-action micro-focus micro-focus-tight micro-pressable"
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
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reduceMotion ? tweens.none : tweens.fast}
                  className="flex justify-start"
                >
                  <div className="chat-bubble chat-bubble--assistant px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {[0, 0.2, 0.4].map((d) => (
                        <motion.div
                          key={d}
                          animate={reduceMotion ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
                          transition={reduceMotion ? tweens.none : { duration: motionDurations.ambient, repeat: Infinity, delay: d }}
                          className="chat-stream-dot h-1.5 w-1.5 rounded-full"
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
