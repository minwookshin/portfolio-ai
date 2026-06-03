"use client";

import { useState, useEffect, useRef } from "react";
import type { FormEvent, KeyboardEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BlurImage from "@/components/BlurImage";
import ChatInput from "@/components/ChatInput";
import HoverVideoPreview, { useHoverVideoPreview } from "@/components/HoverVideoPreview";
import type { Project } from "@/components/ProjectCard";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import { motionDurations, springs, tweens } from "@/lib/material/motion";
import { BUILD_UPDATED_AT, BUILD_VERSION } from "@/lib/buildMeta";
import { saveProjectOpenScroll } from "@/lib/projectScrollRestoration";
import {
  FEATURED_PROJECT_IDS,
  LIVE_DEMO_TILE_TITLES,
  MAIN_PROJECTS,
  PROJECT_PREVIEW_VIDEOS,
  getProjectPath,
  orderProjects,
} from "@/data/projects";

type BuildMetaState = {
  updatedAt: string;
  version: string;
};
const LAB_TILE_HEIGHTS = [
  "h-[420px] sm:h-[460px]",
  "h-[300px] sm:h-[340px]",
  "h-[380px] sm:h-[460px]",
  "h-[300px] sm:h-[340px]",
  "h-[420px] sm:h-[500px]",
  "h-[300px] sm:h-[360px]",
] as const;
const LAB_TILE_HEIGHT_VALUES = [460, 340, 460, 340, 500, 360] as const;
const WORK_CARD_WIDTH = "min(74vw, 680px)";
const WORK_CARD_GUTTER = `calc((100vw - ${WORK_CARD_WIDTH}) / 2)`;
// Personal Information
const PERSONAL_INFO = {
  name: "Minwook Shin",
  title: "Design Engineer",
  bio: "I work as a hands-on design engineer and a compact studio for AI-native products, websites, and prototypes. I shape the product, design the interface, and build the working experience in code.\n\n• Product strategy, UX systems, and polished interaction design.\n• Frontend builds with React, Next.js, SwiftUI, and production-ready motion.\n• AI websites, agents, and launchable demos for founders, teams, and agencies.",
  email: "mwshin0703@gmail.com",
  linkedin: "https://www.linkedin.com/in/minwookshin",
  github: "https://github.com/YeYen1721",
  resume: "https://drive.google.com/file/d/1DpEUz-h7ZgHIkNNdbAr6VIUho4m33v3-/view?usp=sharing",
};

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

function formatElapsedBefore(from: string, now: number) {
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(from).getTime()) / 1000));
  const days = Math.floor(elapsedSeconds / 86400);
  const hours = Math.floor((elapsedSeconds % 86400) / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s before`;
}

function BuildMeta() {
  const [meta, setMeta] = useState<BuildMetaState>({
    updatedAt: BUILD_UPDATED_AT,
    version: BUILD_VERSION,
  });
  const [now, setNow] = useState(() => new Date(BUILD_UPDATED_AT).getTime());

  useEffect(() => {
    let cancelled = false;

    const loadMeta = () => {
      fetch("/api/build-meta", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((nextMeta: Partial<BuildMetaState> | null) => {
          if (cancelled || !nextMeta?.updatedAt || !nextMeta?.version) return;
          setMeta({ updatedAt: nextMeta.updatedAt, version: nextMeta.version });
        })
        .catch(() => {});
    };

    loadMeta();
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const metaTimer = window.setInterval(loadMeta, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.clearInterval(metaTimer);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-muted)]">
      <span>{meta.version}</span>
      <span aria-hidden>·</span>
      <span>updated {formatElapsedBefore(meta.updatedAt, now)}</span>
    </div>
  );
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
  const isLogo = project.title === "Atlas" || project.title === "Portfolio AI";
  const mediaBg =
    tone === "dark"
      ? "border border-[var(--dark-border)] bg-[var(--dark-bg-surface)]"
      : "border border-[var(--dark-border)] bg-[var(--dark-bg-base)]";

  if (src) {
    return (
      <div className={`relative aspect-[1.5] w-full overflow-hidden rounded-[var(--md-shape-lg)] ${mediaBg}`}>
        <BlurImage
          src={src}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 74vw, 680px"
          draggable={false}
          className={`object-contain ${
            reduceMotion ? "" : "transition duration-[var(--motion-duration-extended)] ease-[var(--motion-ease-standard)] group-hover:scale-[1.035]"
          } ${
            isLogo ? "p-12 sm:p-20" : "p-8 sm:p-12"
          }`}
          style={{ filter: "grayscale(1) contrast(1.02)" }}
        />
        {previewLayer}
      </div>
    );
  }

  return (
    <div className={`relative flex aspect-[1.5] w-full items-center justify-center overflow-hidden rounded-[var(--md-shape-lg)] ${mediaBg} text-4xl text-[var(--dark-text-primary)]`}>
      {project.glyph ?? project.title.charAt(0)}
      {previewLayer}
    </div>
  );
}

function ProjectMark({ project, compact = false }: { project: Project; compact?: boolean }) {
  const src = project.icon ?? project.image;
  const isLogo = project.title === "Atlas" || project.title === "Portfolio AI" || Boolean(project.icon);

  if (src) {
    return (
      <span className="relative block h-full w-full">
        <BlurImage
          src={src}
          alt=""
          fill
          sizes={compact ? "40px" : "320px"}
          draggable={false}
          className={`${isLogo ? "object-contain" : "object-cover"} ${compact ? "p-2" : "p-4"}`}
          style={{ filter: "grayscale(1) contrast(1.04)" }}
        />
      </span>
    );
  }

  return (
    <span className={`${compact ? "text-[12px]" : "text-[28px]"} font-normal text-current`}>
      {project.glyph ?? project.title.charAt(0)}
    </span>
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
      className="micro-link micro-focus text-[length:var(--type-0)] text-[var(--text-muted)] hover:text-[var(--accent-indigo)] focus-visible:text-[var(--accent-indigo)]"
    >
      {children}
    </a>
  );
}

function SelectedProjectCard({
  project,
  isActive,
}: {
  project: Project;
  isActive: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const previewVideo = PROJECT_PREVIEW_VIDEOS[project.title];
  const videoPoster = project.image ?? project.icon ?? makeVideoPosterDataUrl(project.title);
  const previewState = useHoverVideoPreview({ videoSrc: previewVideo });
  const videoLayer = (
    <HoverVideoPreview
      canPlayVideo={previewState.canPlayVideo}
      isAlwaysOn={previewState.isAlwaysOn}
      videoSrc={previewVideo}
      poster={videoPoster}
      preload="none"
      reduceMotion={previewState.reduceMotion}
      videoRef={previewState.videoRef}
    />
  );
  const cardContent = (
    <>
      <ProjectMedia project={project} reduceMotion={Boolean(reduceMotion)} previewLayer={videoLayer} />
      <span className="mt-3 flex items-start justify-between gap-4">
        <span className="min-w-0">
          <span className="block text-[length:var(--type-0)] font-normal leading-[var(--leading-tight)] text-[var(--text-primary)]">{project.title}</span>
          <span className="mt-[var(--space-1)] block text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
            {project.comingSoon ? project.unavailableMessage ?? "Coming soon." : project.studioLabel ?? project.description}
          </span>
        </span>
        {!project.comingSoon && (
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-indigo)] opacity-0 transition-opacity duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] group-hover:opacity-100 group-focus-within:opacity-100" />
        )}
      </span>
    </>
  );

  return (
    <motion.div
      {...previewState.previewHandlers}
      animate={{ scale: reduceMotion ? 1 : isActive ? 1 : 0.8 }}
      whileHover={reduceMotion || isActive ? undefined : { scale: 0.84 }}
      transition={reduceMotion ? tweens.none : tweens.slower}
      data-work-card="true"
      className={`micro-card group w-[min(74vw,680px)] shrink-0 snap-center origin-center text-left ${
        isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
      }`}
    >
      {project.comingSoon ? (
        <div aria-disabled="true">{cardContent}</div>
      ) : (
        <Link href={getProjectPath(project)} scroll={false} onClick={saveProjectOpenScroll} className="micro-focus micro-pressable block rounded-[var(--md-shape-lg)]">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}

function EditorialIntro() {
  return (
    <section id="top" className="mx-auto flex w-full max-w-[1180px] justify-center bg-[#F7F8F8] px-[var(--space-3)] pb-[var(--space-8)] pt-[92px] sm:px-[var(--space-5)] md:pb-[calc(var(--space-8)+var(--space-2))] md:pt-[122px]">
      <div id="profile" className="w-full max-w-[620px] scroll-mt-28 text-left">
        <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">minwook shin</p>
        <p className="mt-[var(--space-1)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">Design engineer</p>
        <h1 className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
          Interfaces for AI products, websites, and prototypes that move from early idea to working software.
        </h1>
        <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">
          I work as a hands-on design engineer and compact studio for AI-native products, websites, and prototypes. I shape the product, design the interface, and build the working experience in code.
        </p>
        <p className="mt-[var(--space-4)] max-w-full whitespace-nowrap leading-[var(--leading-body)] text-[var(--text-muted)]">
          <IntroLink href={`mailto:${PERSONAL_INFO.email}`}>Email</IntroLink>
          {", "}
          <IntroLink href={PERSONAL_INFO.linkedin} external>LinkedIn</IntroLink>
          {", "}
          <IntroLink href={PERSONAL_INFO.github} external>GitHub</IntroLink>
          {", and "}
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
  const reduceMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);
  const programmaticScrollRef = useRef<number | null>(null);
  const scrollSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorMotion = reduceMotion
    ? tweens.none
    : tweens.slowInOut;

  useEffect(() => {
    return () => {
      if (scrollSettleTimerRef.current) clearTimeout(scrollSettleTimerRef.current);
    };
  }, []);

  const getClosestProjectIndex = () => {
    const scroller = carouselRef.current;
    if (!scroller) return null;
    const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-work-card]"));
    if (!cards.length) return null;
    const scrollerRect = scroller.getBoundingClientRect();
    const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
    return cards.reduce((bestIndex, card, index) => {
      const bestRect = cards[bestIndex].getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const bestDistance = Math.abs(bestRect.left + bestRect.width / 2 - scrollerCenter);
      const distance = Math.abs(cardRect.left + cardRect.width / 2 - scrollerCenter);
      return distance < bestDistance ? index : bestIndex;
    }, 0);
  };

  const updateActiveProject = () => {
    if (programmaticScrollRef.current !== null) {
      if (scrollSettleTimerRef.current) clearTimeout(scrollSettleTimerRef.current);
      scrollSettleTimerRef.current = setTimeout(() => {
        const lockedIndex = programmaticScrollRef.current;
        programmaticScrollRef.current = null;
        scrollSettleTimerRef.current = null;
        setActiveIndex(getClosestProjectIndex() ?? lockedIndex ?? 0);
      }, motionDurations.fast * 1000);
      return;
    }

    const closestIndex = getClosestProjectIndex();
    if (closestIndex === null) return;
    setActiveIndex((current) => (current === closestIndex ? current : closestIndex));
  };

  const scrollToProject = (index: number) => {
    const scroller = carouselRef.current;
    const cards = Array.from(scroller?.querySelectorAll<HTMLElement>("[data-work-card]") ?? []);
    const card = cards[index];
    if (!scroller || !card) return;
    if (scrollSettleTimerRef.current) clearTimeout(scrollSettleTimerRef.current);
    programmaticScrollRef.current = index;
    setActiveIndex(index);
    const scrollerRect = scroller.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta = cardRect.left + cardRect.width / 2 - (scrollerRect.left + scrollerRect.width / 2);
    const target = scroller.scrollLeft + delta;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollTo({
      left: Math.min(Math.max(target, 0), maxScroll),
      behavior: reduceMotion ? "auto" : "smooth",
    });
    scrollSettleTimerRef.current = setTimeout(() => {
      programmaticScrollRef.current = null;
      scrollSettleTimerRef.current = null;
      setActiveIndex(getClosestProjectIndex() ?? index);
    }, motionDurations.extended * 1000);
  };

  return (
    <section id="work" className="mx-auto w-full max-w-[1180px] px-[var(--space-3)] py-[var(--space-7)] sm:px-[var(--space-5)] md:py-[calc(var(--space-8)+var(--space-2))]">
      <div className="mb-[var(--space-3)] flex justify-center">
        <div className="w-full max-w-[620px] text-left">
          <h2 className="text-[length:var(--type-1)] font-normal leading-[var(--leading-heading)] text-[var(--text-primary)]">Work</h2>
        </div>
      </div>
      <div
        ref={carouselRef}
        onScroll={updateActiveProject}
        className="relative left-1/2 w-screen -translate-x-1/2 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 [scrollbar-width:none]"
      >
        <div
          className="flex w-max gap-[clamp(1.5rem,4vw,3.5rem)]"
          style={{ paddingInline: WORK_CARD_GUTTER }}
        >
          {projects.map((project, index) => (
            <SelectedProjectCard
              key={project.id}
              project={project}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      </div>
      <div className="mx-auto mt-4 flex w-full max-w-[620px] justify-center" aria-label="Work carousel">
        <div className="flex items-center gap-2">
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.button
                key={project.id}
                type="button"
                onClick={() => scrollToProject(index)}
                aria-label={`Show ${project.title}`}
                aria-current={isActive ? "true" : undefined}
                animate={{ width: isActive ? 40 : 24 }}
                transition={indicatorMotion}
                className={`micro-focus micro-focus-tight micro-pressable group relative flex h-6 items-center justify-center rounded-full bg-transparent ${
                  isActive ? "" : "hover:bg-[var(--bg-element)] focus-visible:bg-[var(--bg-element)]"
                }`}
              >
                <motion.span
                  aria-hidden="true"
                  className="h-[3px] shrink-0 rounded-full bg-[var(--text-primary)]"
                  animate={{ width: isActive ? 36 : 3, opacity: isActive ? 1 : 0.38, scale: 1 }}
                  whileHover={isActive ? undefined : reduceMotion ? { opacity: 0.72 } : { opacity: 0.72, scale: 1.08 }}
                  transition={indicatorMotion}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type LabChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "error";
};

function LabMessageSkeleton() {
  return (
    <div className="w-[min(88%,260px)] rounded-[var(--md-shape-sm)] border border-[var(--border-light)] bg-[var(--bg-element)] px-3 py-3" aria-label="loading response">
      <span className="micro-skeleton-line w-11/12" />
      <span className="micro-skeleton-line mt-2 w-8/12" />
      <span className="micro-skeleton-line mt-2 w-5/12" />
    </div>
  );
}

function LabChatTile() {
  const reduceMotion = useReducedMotion();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<LabChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyRef.current?.scrollTo({
      top: historyRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, reduceMotion]);

  const sendDraft = async () => {
    const message = draft.trim();
    if (!message || isStreaming) return;
    const userMessage: LabChatMessage = { id: `${Date.now()}-user`, role: "user", content: message };
    const nextMessages = [...messages, userMessage];
    const assistantId = `${Date.now()}-assistant`;

    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
    setDraft("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          context: "The user is using the Ask me live demo inside the Lab / archive bento tile. Keep the answer concise so it fits inside the card.",
        }),
      });

      if (!res.ok) throw new Error("API error");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          const tail = decoder.decode();
          if (tail) {
            fullText += tail;
            setMessages((prev) =>
              prev.map((msg) => (msg.id === assistantId ? { ...msg, content: fullText } : msg))
            );
          }
          break;
        }
        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, content: fullText } : msg))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "i could not reach the ai demo. try again in a moment.", status: "error" }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendDraft();
  };

  const submitFromKeyboard = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    sendDraft();
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      className={`w-full overflow-hidden rounded-[var(--md-shape-lg)] border border-[var(--border-light)] bg-[var(--bg-surface)] p-0 text-[var(--text-primary)] ${
        hasMessages ? "h-[520px]" : LAB_TILE_HEIGHTS[0]
      }`}
    >
      <form
        onSubmit={submit}
        className={`flex h-full min-h-0 w-full flex-col rounded-[var(--md-shape-lg)] bg-[var(--bg-surface)] p-4 text-[var(--text-primary)] ${
          reduceMotion ? "" : "transition-[height] duration-[var(--motion-duration-slower)] ease-[var(--motion-ease-standard)]"
        }`}
      >
        <div
          ref={historyRef}
          className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1"
        >
          {!hasMessages && (
            <div className="flex h-full flex-col justify-end pb-2 text-[length:var(--type--1)] leading-[var(--leading-body)] text-[var(--text-muted)]">
              <p>ask about a project, stack, or how i build.</p>
            </div>
          )}
          {messages.map((msg) => {
            const body = msg.role === "assistant" ? parseAssistant(msg.content).body : msg.content;
            const isUser = msg.role === "user";
            const isLoadingAssistant = msg.role === "assistant" && !body && isStreaming;
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                {isLoadingAssistant ? (
                  <LabMessageSkeleton />
                ) : (
                  <div
                    className={`max-w-[88%] rounded-[var(--md-shape-sm)] border px-3 py-2 leading-snug ${
                      isUser
                        ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-surface)]"
                        : msg.status === "error"
                        ? "border-[var(--border-light)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
                        : "border-[var(--border-light)] bg-[var(--bg-element)] text-[var(--text-primary)]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{body}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          className="micro-field mt-3 flex h-16 w-full min-w-0 rounded-[var(--md-shape-sm)] border border-[var(--border-light)] bg-[var(--bg-element)]"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={submitFromKeyboard}
            placeholder="ask me"
            aria-label="Ask from lab"
            className="min-w-0 flex-1 bg-transparent px-5 font-light text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim() || isStreaming}
            className="micro-focus micro-focus-tight micro-pressable flex h-full w-16 shrink-0 items-center justify-center border-l border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] disabled:opacity-30"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </form>
    </div>
  );
}

function LabProjectTile({
  project,
  index,
  className = "",
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const previewVideo = PROJECT_PREVIEW_VIDEOS[project.title];
  const showsLiveDemo = Boolean(previewVideo && LIVE_DEMO_TILE_TITLES.has(project.title));
  const src = project.image ?? project.icon;
  const videoPoster = project.image ?? project.icon ?? makeVideoPosterDataUrl(project.title);
  const previewState = useHoverVideoPreview({ videoSrc: previewVideo, alwaysOn: showsLiveDemo });
  const videoLayer = (
    <HoverVideoPreview
      canPlayVideo={previewState.canPlayVideo}
      isAlwaysOn={previewState.isAlwaysOn}
      videoSrc={previewVideo}
      poster={videoPoster}
      preload="metadata"
      reduceMotion={previewState.reduceMotion}
      videoRef={previewState.videoRef}
    />
  );
  const tileContent = (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {src && (
          <BlurImage
            src={src}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 360px"
            draggable={false}
            className={`object-cover grayscale ${
              reduceMotion ? "" : "transition duration-[var(--motion-duration-extended)] ease-[var(--motion-ease-standard)] group-hover:scale-[1.035]"
            }`}
          />
        )}
        {videoLayer}
        {!src && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-[var(--bg-element)] text-[var(--text-primary)] transition duration-[var(--motion-duration-slower)] ease-[var(--motion-ease-standard)] ${
              previewState.isAlwaysOn
                ? "opacity-0"
                : previewState.canPlayVideo
                ? `opacity-100 group-hover:opacity-0 group-focus-within:opacity-0 ${reduceMotion ? "" : "group-hover:scale-[1.04]"}`
                : reduceMotion ? "" : "group-hover:scale-[1.04]"
            }`}
          >
            <ProjectMark project={project} />
          </div>
        )}
      </div>
      <span className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(247,248,248,0.92)] via-[rgba(247,248,248,0.72)] to-transparent p-[var(--space-2)] opacity-0 transition-opacity duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)] group-hover:opacity-100 group-focus-within:opacity-100 ${
        reduceMotion ? "" : "translate-y-2 transition duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)] group-hover:translate-y-0 group-focus-within:translate-y-0"
      }`}>
        <span className="flex items-end justify-between gap-[var(--space-2)]">
          <span className="min-w-0">
            <span className="block font-normal leading-[var(--leading-tight)] text-[var(--text-primary)]">{project.title}</span>
            <span className="mt-[var(--space-1)] block leading-[var(--leading-body)] text-[var(--text-muted)]">
              {project.studioLabel ?? project.description}
            </span>
          </span>
          {!project.comingSoon && <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--accent-indigo)]" />}
        </span>
      </span>
    </>
  );

  return (
    <motion.div
      {...previewState.previewHandlers}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
      viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
      transition={reduceMotion ? tweens.none : { ...springs.spatialDefault, delay: Math.min(index * 0.035, motionDurations.fast) }}
      className={`micro-card group relative w-full overflow-hidden rounded-[var(--md-shape-lg)] border border-[var(--border-light)] bg-[var(--bg-surface)] text-left hover:bg-[var(--bg-element)] ${className}`}
    >
      {project.comingSoon ? (
        <div aria-disabled="true">{tileContent}</div>
      ) : (
        <Link href={getProjectPath(project)} scroll={false} onClick={saveProjectOpenScroll} className="micro-focus micro-pressable absolute inset-0 block rounded-[var(--md-shape-lg)]">
          {tileContent}
        </Link>
      )}
    </motion.div>
  );
}

function LabArchive({
  projects,
}: {
  projects: Project[];
}) {
  const labColumns: Array<Array<{ project: Project; index: number }>> = [[], [], []];
  const labColumnHeights = [LAB_TILE_HEIGHT_VALUES[0], 0, 0];
  projects.forEach((project, index) => {
    const preferredColumns = [1, 2, 0];
    const columnIndex = preferredColumns.reduce((shortest, candidate) =>
      labColumnHeights[candidate] < labColumnHeights[shortest] ? candidate : shortest
    );
    labColumns[columnIndex].push({ project, index });
    labColumnHeights[columnIndex] += LAB_TILE_HEIGHT_VALUES[(index + 1) % LAB_TILE_HEIGHT_VALUES.length] + 12;
  });

  return (
    <section className="bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2.75)] pt-[calc(var(--space-8)+var(--space-2))] text-[var(--text-primary)] sm:px-[var(--space-5)]">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-[var(--space-4)] flex justify-center">
          <div className="w-full max-w-[620px] text-left">
            <h2 className="text-[length:var(--type-1)] font-normal leading-[var(--leading-heading)] text-[var(--text-primary)]">Lab / archive</h2>
            <p className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
              Projects, demos, experiments, and product sketches live here so the main page stays simple while the body of work stays accessible.
            </p>
          </div>
        </div>
        <div className="mx-auto w-full" style={{ maxWidth: WORK_CARD_WIDTH }}>
          <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {labColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex min-w-0 flex-col gap-3">
                {columnIndex === 0 && <LabChatTile />}
                {column.map(({ project, index }) => (
                  <LabProjectTile
                    key={project.id}
                    project={project}
                    index={index}
                    className={LAB_TILE_HEIGHTS[(index + 1) % LAB_TILE_HEIGHTS.length]}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-[620px]">
          <BuildMeta />
        </div>
      </div>
    </section>
  );
}

// Interface to store content snapshot for each message
export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
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
    const viewContext = '';

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
  const archiveProjects = MAIN_PROJECTS.filter((project) => !FEATURED_PROJECT_IDS.includes(project.id as typeof FEATURED_PROJECT_IDS[number]));

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
    router.push(getProjectPath(project), { scroll: false });
  };

  return (
    <main
      className="site-lowercase min-h-screen overflow-x-hidden bg-[var(--bg-base)] text-[length:var(--type-0)] text-[var(--text-primary)]"
    >

      {/* Crawlable substance for search engines and non-chatting visitors. Visually
          hidden, but real content so the page isn't an empty chat shell to bots. */}
      <section className="sr-only">
        <h2>{PERSONAL_INFO.name}, {PERSONAL_INFO.title}</h2>
        <p>{PERSONAL_INFO.bio}</p>
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
      >
        <div className="light-cursor-dark bg-[var(--bg-base)] text-[var(--text-primary)]">
          <EditorialIntro />
          <WorkSection projects={featuredProjects} />
        </div>
        <LabArchive
          projects={archiveProjects}
        />
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
