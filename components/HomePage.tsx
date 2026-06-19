"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from "@/components/ChatInput";
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
  type PortfolioProject,
} from "@/data/projects";
import { PERSONAL_INFO } from "@/data/personal";

type HomeTab = "work" | "studies";

type HomePageProps = {
  activeSection?: HomeTab;
  writingPosts: WritingPostMeta[];
};

const HOME_SECTION_LINKS: Array<{ href: string; id: HomeTab; label: string }> = [
  { href: "/work", id: "work", label: "work" },
  { href: "/studies", id: "studies", label: "studies" },
];

const CONTACT_LINKS = [
  { href: `mailto:${PERSONAL_INFO.email}`, label: "email", external: false },
  { href: PERSONAL_INFO.github, label: "github", external: true },
  { href: PERSONAL_INFO.linkedin, label: "linkedin", external: true },
  { href: PERSONAL_INFO.resume, label: "resume", external: true },
] as const;

const LANDING_EASE = [0.22, 1, 0.36, 1] as const;
const LANDING_EXPLORE_DELAY = 0.3;
const LANDING_ROW_BASE_DELAY = 0.4;
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
      project: PortfolioProject;
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

function PortfolioTextHeader({ activeSection }: { activeSection: HomeTab }) {
  return (
    <motion.header
      id="profile"
      variants={landingIntroVariants}
      className="portfolio-text-header"
    >
      <motion.div variants={landingRevealItem} className="portfolio-text-header__identity">
        <p className="portfolio-text-header__kicker">
          {PERSONAL_INFO.name} / {PERSONAL_INFO.title}
        </p>
        <div className="portfolio-text-header__intro">
          <p>{PERSONAL_INFO.bio}</p>
          <p>Currently shaping interaction systems for AI-native products.</p>
        </div>
      </motion.div>

      <motion.nav
        aria-label="sections"
        variants={landingRevealItem}
        className="portfolio-text-header__nav"
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
              >
                {link.label}
              </Link>
              {index < HOME_SECTION_LINKS.length - 1 && (
                <span aria-hidden="true" className="portfolio-text-header__comma" role="presentation">
                  ,
                </span>
              )}
            </Fragment>
          );
        })}
      </motion.nav>

      <motion.div variants={landingRevealItem} className="portfolio-text-header__links">
        {CONTACT_LINKS.map((item, index) => (
          <Fragment key={item.href}>
            <IntroLink href={item.href} external={item.external}>
              {item.label}
            </IntroLink>
            {index < CONTACT_LINKS.length - 1 && (
              <span aria-hidden="true" className="portfolio-text-header__comma" role="presentation">
                ,
              </span>
            )}
          </Fragment>
        ))}
      </motion.div>
    </motion.header>
  );
}

function WorkTextRow({
  index,
  project,
}: {
  index: number;
  project: PortfolioProject;
}) {
  const reduceMotion = useReducedMotion();
  const descriptor = project.builder?.oneLiner ?? getProjectDescriptor(project);
  const meta = [
    project.studioLabel ?? project.role,
    project.date,
  ].filter(Boolean).join(" / ");
  const status = project.builder?.status?.label ?? project.timeline ?? "case study";
  const rowInner = (
    <span className="portfolio-index-row__inner">
      <span className="portfolio-index-row__number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="portfolio-index-row__body">
        <span className="project-row-copy portfolio-index-row__copy">
          <span className="project-row-title-line--lateral portfolio-index-row__title">
            {project.title}
          </span>
          <span className="portfolio-index-row__description">
            {descriptor}
          </span>
        </span>
      </span>
      <span className="portfolio-index-row__meta">
        <span>{meta}</span>
        <span>{status}</span>
      </span>
    </span>
  );

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, filter: "blur(3px)", y: 8 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={reduceMotion ? tweens.none : landingRowTransition(index)}
      data-project-row="work"
      className="portfolio-index-list__item group"
    >
      {project.comingSoon ? (
        <button
          type="button"
          aria-disabled="true"
          className="portfolio-index-row portfolio-index-row--disabled micro-focus micro-focus-tight"
        >
          {rowInner}
        </button>
      ) : (
        <Link
          href={getProjectPath(project)}
          className="portfolio-index-row micro-focus micro-focus-tight micro-pressable"
        >
          {rowInner}
        </Link>
      )}
    </motion.li>
  );
}

function WorkSection({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  return (
    <div className="portfolio-index-block">
      <div className="portfolio-index-block__label" aria-hidden="true">
        <span>selected work</span>
        <span>{String(projects.length).padStart(2, "0")}</span>
      </div>
      <ul className="portfolio-index-list">
        {projects.map((project, index) => (
          <WorkTextRow
            key={project.id}
            index={index}
            project={project}
          />
        ))}
      </ul>
    </div>
  );
}

function buildStudyItems(posts: WritingPostMeta[]): StudyItem[] {
  const labProjects = orderProjects(MAIN_PROJECTS, LAB_PROJECT_IDS);
  const labStudyProjects = labProjects.filter(isLabStudyProject);
  const archivedLabProjects = labProjects.filter((project) => !isLabStudyProject(project));
  const writingItems: StudyItem[] = posts.map((post) => ({
    date: post.date,
    description: post.description,
    href: `/studies/${post.slug}`,
    id: `writing-${post.slug}`,
    kind: "writing",
    label: "writing",
    meta: formatWritingDate(post.date),
    title: post.title,
  }));

  return [
    ...labStudyProjects.map((project): StudyItem => ({
      href: getLabProjectPath(project),
      id: `lab-${project.id}`,
      kind: "lab",
      label: "study",
      meta: project.studioLabel ?? project.builder.oneLiner,
      project,
      title: project.title,
    })),
    ...writingItems,
    ...archivedLabProjects.map((project): StudyItem => ({
      href: getLabProjectPath(project),
      id: `lab-${project.id}`,
      kind: "lab",
      label: "prototype",
      meta: project.studioLabel ?? getProjectDescriptor(project),
      project,
      title: project.title,
    })),
  ];
}

function StudyTextRow({
  index,
  item,
}: {
  index: number;
  item: StudyItem;
}) {
  const reduceMotion = useReducedMotion();
  const description = item.kind === "writing"
    ? item.description
    : item.project.builder.oneLiner ?? item.project.description;

  return (
    <motion.li
      key={item.id}
      initial={reduceMotion ? false : { opacity: 0, filter: "blur(3px)", y: 8 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={reduceMotion ? tweens.none : landingRowTransition(index)}
      data-project-row="studies"
      className="portfolio-index-list__item group"
    >
      <Link
        href={item.href}
        className="portfolio-index-row portfolio-index-row--study micro-focus micro-focus-tight micro-pressable"
      >
        <span className="portfolio-index-row__inner">
          <span className="portfolio-index-row__number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="portfolio-index-row__body">
            <span className="project-row-copy portfolio-index-row__copy">
              <span className="project-row-title-line--lateral portfolio-index-row__title">
                {item.title}
              </span>
              <span className="portfolio-index-row__description">
                {description}
              </span>
            </span>
          </span>
          <span className="portfolio-index-row__meta">
            <StudyMetaLine
              label={item.label}
              meta={item.meta}
              className="project-row-meta"
            />
          </span>
        </span>
      </Link>
    </motion.li>
  );
}

function StudiesSection({ items }: { items: StudyItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
        studies are coming soon.
      </p>
    );
  }

  return (
    <div className="portfolio-index-block">
      <div className="portfolio-index-block__label" aria-hidden="true">
        <span>studies</span>
        <span>{String(items.length).padStart(2, "0")}</span>
      </div>
      <ul className="portfolio-index-list">
        {items.map((item, index) => (
          <StudyTextRow
            key={item.id}
            index={index}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
}

function HomeExploreSection({
  activeSection,
  projects,
  studyItems,
}: {
  activeSection: HomeTab;
  projects: PortfolioProject[];
  studyItems: StudyItem[];
}) {
  return (
    <motion.section
      id={activeSection}
      variants={landingExploreVariants}
      className="portfolio-text-section"
    >
      <div className="portfolio-text-shell">
        <PortfolioTextHeader activeSection={activeSection} />
        <div className="portfolio-text-content">
          {activeSection === "work" && <WorkSection projects={projects} />}
          {activeSection === "studies" && <StudiesSection items={studyItems} />}
        </div>
      </div>
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
  const studyItems = buildStudyItems(writingPosts);

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
    <main className="site-lowercase flex min-h-dvh flex-col overflow-x-hidden bg-[#090909] pb-[calc(var(--space-8)*1.5)] text-[length:var(--type-0)] text-[var(--text-primary)]">

      {/* Crawlable substance for search engines and non-chatting visitors. Visually
          hidden, but real content so the page isn't an empty chat shell to bots. */}
      <section className="sr-only">
        <h2>{PERSONAL_INFO.name}, {PERSONAL_INFO.title}</h2>
        <p>{PERSONAL_INFO.bio}</p>
        <h3>Studies</h3>
        <ul>
          {studyItems.map((item) => (
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
        <div className="portfolio-text-theme">
          <HomeExploreSection
            activeSection={currentSection}
            projects={featuredProjects}
            studyItems={studyItems}
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
