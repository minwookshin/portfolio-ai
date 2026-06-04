"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import BlurImage from "@/components/BlurImage";
import BuildMeta from "@/components/BuildMeta";
import HoverVideoPreview, { useHoverVideoPreview } from "@/components/HoverVideoPreview";
import type { Project } from "@/components/ProjectCard";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import { motionDurations, springs, tweens } from "@/lib/material/motion";
import { saveProjectOpenScroll } from "@/lib/projectScrollRestoration";
import {
  LIVE_DEMO_TILE_TITLES,
  MAIN_PROJECTS,
  PROJECT_PREVIEW_VIDEOS,
  getProjectPath,
  orderProjects,
} from "@/data/projects";

type LabChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "error";
};

const LAB_PROJECT_IDS = ["4", "9", "7", "8", "10"] as const;
const LAB_CHAT_EMPTY_HEIGHT = "h-[420px] sm:h-[460px]";
const LAB_TILE_HEIGHTS = [
  "h-[300px] sm:h-[340px]",
  "h-[380px] sm:h-[460px]",
  "h-[300px] sm:h-[340px]",
  "h-[420px] sm:h-[500px]",
  "h-[300px] sm:h-[360px]",
] as const;
const LAB_TILE_HEIGHT_VALUES = [340, 460, 340, 500, 360] as const;

function parseAssistantBody(content: string) {
  let cut = content.length;
  for (const sentinel of ["<<<SHOW>>>", "<<<FOLLOWUPS>>>"]) {
    const index = content.indexOf(sentinel);
    if (index !== -1) cut = Math.min(cut, index);
  }
  return content.slice(0, cut).trimEnd();
}

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
        hasMessages ? "h-[520px]" : LAB_CHAT_EMPTY_HEIGHT
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
            const body = msg.role === "assistant" ? parseAssistantBody(msg.content) : msg.content;
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

function LabProjectMark({ project }: { project: Project }) {
  return (
    <span className="text-[length:var(--type-2)] leading-[var(--leading-heading)] text-[var(--text-primary)]">
      {project.glyph ?? project.title.charAt(0)}
    </span>
  );
}

function LabProjectTile({
  className = "",
  index,
  project,
}: {
  className?: string;
  index: number;
  project: Project;
}) {
  const reduceMotion = useReducedMotion();
  const previewVideo = PROJECT_PREVIEW_VIDEOS[project.title];
  const showsLiveDemo = Boolean(previewVideo && LIVE_DEMO_TILE_TITLES.has(project.title));
  const previewState = useHoverVideoPreview({ alwaysOn: showsLiveDemo, videoSrc: previewVideo });
  const src = project.image ?? project.icon;
  const poster = project.image ?? project.icon ?? makeVideoPosterDataUrl(project.title);

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
      viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
      transition={reduceMotion ? tweens.none : { ...springs.spatialDefault, delay: Math.min(index * 0.035, motionDurations.fast) }}
      className={`list-none ${className}`}
    >
      <Link
        {...previewState.previewHandlers}
        href={getProjectPath(project)}
        scroll={false}
        onClick={saveProjectOpenScroll}
        data-cursor="view"
        className="micro-focus micro-pressable group relative block h-full w-full overflow-hidden rounded-[var(--md-shape-lg)] border border-[var(--border-light)] bg-[var(--bg-surface)] text-left"
      >
        <span className="absolute inset-0 overflow-hidden">
          {src ? (
            <BlurImage
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 44vw, 260px"
              draggable={false}
              className={`object-cover grayscale ${
                reduceMotion ? "" : "transition duration-[var(--motion-duration-extended)] ease-[var(--motion-ease-standard)] group-hover:scale-[1.035]"
              }`}
            />
          ) : (
            <span
              className={`absolute inset-0 flex items-center justify-center bg-[var(--bg-element)] ${
                reduceMotion ? "" : "transition-[opacity,transform] duration-[var(--motion-duration-slower)] ease-[var(--motion-ease-standard)] group-hover:scale-[1.035]"
              }`}
            >
              <LabProjectMark project={project} />
            </span>
          )}
          <HoverVideoPreview
            canPlayVideo={previewState.canPlayVideo}
            isAlwaysOn={previewState.isAlwaysOn}
            videoSrc={previewVideo}
            poster={poster}
            preload="none"
            reduceMotion={previewState.reduceMotion}
            videoRef={previewState.videoRef}
          />
        </span>
        <span className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 via-black/28 to-transparent p-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 ${
          reduceMotion ? "" : "translate-y-2 transition duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)] group-hover:translate-y-0 group-focus-within:translate-y-0"
        }`}>
          <span className="flex items-end justify-between gap-4">
            <span className="min-w-0">
              <span className="block font-normal leading-[var(--leading-heading)] text-white">
                {project.title}
              </span>
              <span className="mt-1 block leading-[var(--leading-body)] text-white/70">
                {project.studioLabel ?? project.description}
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-white" />
          </span>
        </span>
      </Link>
    </motion.li>
  );
}

export default function LabPage() {
  const projects = orderProjects(MAIN_PROJECTS, LAB_PROJECT_IDS);
  const labColumns: Array<Array<{ project: Project; index: number }>> = [[], [], []];
  const labColumnHeights = [LAB_TILE_HEIGHT_VALUES[0], 0, 0];

  projects.forEach((project, index) => {
    const preferredColumns = [1, 2, 0];
    const columnIndex = preferredColumns.reduce((shortest, candidate) =>
      labColumnHeights[candidate] < labColumnHeights[shortest] ? candidate : shortest
    );
    labColumns[columnIndex].push({ project, index });
    labColumnHeights[columnIndex] += LAB_TILE_HEIGHT_VALUES[index % LAB_TILE_HEIGHT_VALUES.length] + 12;
  });

  return (
    <main className="site-lowercase min-h-screen bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-[length:var(--type-0)] text-[var(--text-primary)] sm:px-[var(--space-5)] md:pt-[122px]">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mx-auto w-full max-w-[620px]">
          <nav className="mb-[var(--space-5)] flex items-center justify-between gap-[var(--space-2)] leading-[var(--leading-body)]">
            <Link href="/" className="micro-link micro-focus text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:text-[var(--text-primary)]">
              minwook shin
            </Link>
            <span className="text-[var(--text-muted)]">lab / archive</span>
          </nav>

          <header>
            <h1 className="text-[length:var(--type-1)] font-normal leading-[var(--leading-heading)] text-[var(--text-primary)]">
              Lab / archive
            </h1>
            <p className="mt-[var(--space-1)] max-w-[var(--measure)] leading-[var(--leading-body)] text-[var(--text-muted)]">
              Smaller demos, experiments, and product sketches. This page is intentionally more interactive than the homepage.
            </p>
            <BuildMeta className="mt-[var(--space-1)]" />
          </header>
        </div>

        <div className="mx-auto mt-[var(--space-5)] grid w-full max-w-[980px] gap-[var(--space-2)] sm:grid-cols-2 lg:grid-cols-3">
          {labColumns.map((column, columnIndex) => (
            <ul key={columnIndex} className="flex min-w-0 flex-col gap-[var(--space-2)]">
              {columnIndex === 0 && (
                <li className="list-none">
                  <LabChatTile />
                </li>
              )}
              {column.map(({ project, index }) => (
                <LabProjectTile
                  key={project.id}
                  project={project}
                  index={index}
                  className={LAB_TILE_HEIGHTS[index % LAB_TILE_HEIGHTS.length]}
                />
              ))}
            </ul>
          ))}
        </div>

      </div>
    </main>
  );
}
