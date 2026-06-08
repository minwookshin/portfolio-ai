"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BlurImage from "@/components/BlurImage";
import HoverVideoPreview, { useHoverVideoPreview } from "@/components/HoverVideoPreview";
import { LabStudyTileVisual } from "@/components/LabStudyDetailView";
import type { Project } from "@/components/ProjectCard";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import { motionDurations, springs, tweens } from "@/lib/material/motion";
import { saveProjectOpenScroll } from "@/lib/projectScrollRestoration";
import {
  LAB_PROJECT_IDS,
  MAIN_PROJECTS,
  PROJECT_PREVIEW_VIDEOS,
  getLabProjectPath,
  isLabStudyProject,
  orderProjects,
} from "@/data/projects";

type LabChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "error";
};

const LAB_CHAT_EMPTY_HEIGHT = "h-[420px] sm:h-[460px]";
const LAB_ARCHIVE_TILE_HEIGHTS = [
  "h-[320px] sm:h-[360px] lg:h-[380px]",
  "h-[320px] sm:h-[360px] lg:h-[380px]",
  "h-[320px] sm:h-[360px] lg:h-[380px]",
] as const;
const FULL_FRAME_LAB_PREVIEWS = new Set(["capexplorer", "caret"]);

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

function LabChatTile({
  activeHeightClassName = "h-[520px]",
  emptyHeightClassName = LAB_CHAT_EMPTY_HEIGHT,
}: {
  activeHeightClassName?: string;
  emptyHeightClassName?: string;
}) {
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
        hasMessages ? activeHeightClassName : emptyHeightClassName
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
  featured = false,
  index,
  project,
}: {
  className?: string;
  featured?: boolean;
  index: number;
  project: Project;
}) {
  const reduceMotion = useReducedMotion();
  const isStudy = isLabStudyProject(project);
  const previewVideo = PROJECT_PREVIEW_VIDEOS[project.title];
  const showsLiveDemo = Boolean(previewVideo) && !isStudy;
  const previewState = useHoverVideoPreview({ alwaysOn: showsLiveDemo, videoSrc: previewVideo });
  const src = project.image ?? project.icon;
  const poster = project.image ?? project.icon ?? makeVideoPosterDataUrl(project.title);
  const imageSizes = featured
    ? "(max-width: 768px) 92vw, (max-width: 1280px) 62vw, 620px"
    : "(max-width: 768px) 92vw, (max-width: 1280px) 44vw, 320px";
  const overlayPaddingClassName = featured ? "p-5 sm:p-6" : "p-4";
  const titleSizeClassName = featured ? "text-[length:var(--type-3)] sm:text-[length:var(--type-4)]" : "";
  const shouldContainPreview = project.slug ? FULL_FRAME_LAB_PREVIEWS.has(project.slug) : false;
  const mediaFitClassName = shouldContainPreview ? "object-contain bg-white" : "object-cover";
  const overlayClassName = isStudy
    ? "border-t border-[var(--border-light)] bg-[var(--bg-surface)]"
    : "bg-gradient-to-t from-black/70 via-black/24 to-transparent opacity-90 group-hover:opacity-100 group-focus-within:opacity-100";
  const titleColorClassName = isStudy ? "text-[var(--text-primary)]" : "text-white";
  const metaColorClassName = isStudy ? "text-[var(--text-muted)]" : "text-white/70";

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
        href={getLabProjectPath(project)}
        scroll={false}
        onClick={saveProjectOpenScroll}
        className="micro-focus micro-pressable group relative block h-full w-full overflow-hidden rounded-[var(--md-shape-lg)] border border-[var(--border-light)] bg-[var(--bg-surface)] text-left"
      >
        <span className={`absolute inset-0 overflow-hidden ${shouldContainPreview || isStudy ? "bg-white" : ""}`}>
          {isStudy ? (
            <LabStudyTileVisual kind={project.labStudy.kind} />
          ) : src ? (
            <BlurImage
              src={src}
              alt=""
              fill
              sizes={imageSizes}
              draggable={false}
              className={`${mediaFitClassName} grayscale`}
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center bg-[var(--bg-element)]"
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
            className={mediaFitClassName}
          />
        </span>
        <span className={`pointer-events-none absolute inset-x-0 bottom-0 ${overlayClassName} ${
          overlayPaddingClassName
        } ${
          reduceMotion ? "" : "translate-y-1 transition duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)] group-hover:translate-y-0 group-focus-within:translate-y-0"
        }`}>
          <span className="flex items-end">
            <span className="min-w-0">
              <span className={`block font-normal leading-[var(--leading-heading)] ${titleColorClassName} ${titleSizeClassName}`}>
                {project.title}
              </span>
              <span className={`mt-1 block leading-[var(--leading-body)] ${metaColorClassName}`}>
                {project.studioLabel ?? project.description}
              </span>
            </span>
          </span>
        </span>
      </Link>
    </motion.li>
  );
}

export default function LabArchiveGrid({ className = "" }: { className?: string }) {
  const projects = orderProjects(MAIN_PROJECTS, LAB_PROJECT_IDS);
  const studyProjects = projects.filter(isLabStudyProject);
  const archiveProjects = projects.filter((project) => !isLabStudyProject(project));

  if (projects.length === 0) return null;

  return (
    <div className={`grid gap-[var(--space-3)] ${className}`}>
      {studyProjects.length > 0 && (
        <ul className="grid gap-[var(--space-2)] lg:auto-rows-[220px] lg:grid-cols-4">
          {studyProjects.map((project, index) => (
            <LabProjectTile
              key={project.id}
              project={project}
              index={index}
              featured={index === 0}
              className={
                index === 0
                  ? "h-[360px] sm:h-[420px] lg:col-span-2 lg:row-span-2 lg:h-full"
                  : "h-[260px] sm:h-[300px] lg:h-full"
              }
            />
          ))}
        </ul>
      )}

      <div className="grid gap-[var(--space-2)] lg:grid-cols-[minmax(240px,0.42fr)_minmax(0,1fr)]">
        <ul className="min-w-0">
          <li className="list-none">
            <LabChatTile
              activeHeightClassName="h-[360px] sm:h-[380px] lg:h-[380px]"
              emptyHeightClassName="h-[300px] sm:h-[320px] lg:h-[380px]"
            />
          </li>
        </ul>

        {archiveProjects.length > 0 && (
          <ul className="grid min-w-0 gap-[var(--space-2)] sm:grid-cols-2 xl:grid-cols-3">
            {archiveProjects.map((project, index) => (
              <LabProjectTile
                key={project.id}
                project={project}
                index={studyProjects.length + index}
                className={LAB_ARCHIVE_TILE_HEIGHTS[index % LAB_ARCHIVE_TILE_HEIGHTS.length]}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
