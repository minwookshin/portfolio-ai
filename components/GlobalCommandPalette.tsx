"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Command, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCopyFeedback } from "@/components/CopyFeedback";
import type { CommandItem } from "@/components/commandPaletteItems";
import {
  buildCommandItems,
  getCommandSearchPlaceholder,
  getCurrentContext,
  getCurrentNote,
  getCurrentProject,
  normalizeCommandText,
} from "@/components/commandPaletteItems";
import type { RecentCommandItem } from "@/components/commandPaletteItems";
import { glassLensTransition, springs, tweens } from "@/lib/material/motion";
import type { WritingPostMeta } from "@/lib/writingTypes";

const OPEN_COMMAND_EVENT = "portfolio-command:open";
const FOLLOWUP_SENTINEL = "<<<FOLLOWUPS>>>";
const SHOW_SENTINEL = "<<<SHOW>>>";
const RECENT_COMMAND_STORAGE_KEY = "portfolio:recent-command";

type GlobalCommandPaletteProps = {
  writingPosts: WritingPostMeta[];
};

type CommandMode = "commands" | "ask";

type CommandChatMessage = {
  content: string;
  id: string;
  role: "user" | "assistant";
  status?: "error";
};

type CommandChatTurn = {
  assistants: CommandChatMessage[];
  id: string;
  user?: CommandChatMessage;
};

export function openGlobalCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COMMAND_EVENT));
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || target.isContentEditable;
}

function getCommandActionHint(item: CommandItem) {
  if (item.group === "copy") return "copy";
  if (item.id.startsWith("jump-") || item.group === "atlas") return "jump";
  if (item.id === "ask-portfolio") return "ask";
  if (item.id === "show-shortcuts") return "?";
  return "enter";
}

function readRecentCommand(pathname: string): RecentCommandItem | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(RECENT_COMMAND_STORAGE_KEY);
    if (!raw) return null;
    const item = JSON.parse(raw) as RecentCommandItem;
    if (!item.href || !item.title || item.href === pathname) return null;
    return item;
  } catch {
    return null;
  }
}

function writeRecentCommand(item: RecentCommandItem | null) {
  if (typeof window === "undefined" || !item) return;

  try {
    window.localStorage.setItem(RECENT_COMMAND_STORAGE_KEY, JSON.stringify(item));
  } catch {
    // localStorage can be unavailable in private contexts; the command surface still works without recents.
  }
}

function formatCommandAssistantMessage(content: string) {
  let cut = content.length;
  for (const sentinel of [SHOW_SENTINEL, FOLLOWUP_SENTINEL]) {
    const index = content.indexOf(sentinel);
    if (index !== -1) cut = Math.min(cut, index);
  }

  let body = content.slice(0, cut).trimEnd();
  for (const sentinel of [SHOW_SENTINEL, FOLLOWUP_SENTINEL]) {
    for (let length = sentinel.length - 1; length > 0; length--) {
      if (body.endsWith(sentinel.slice(0, length))) {
        body = body.slice(0, -length).trimEnd();
        break;
      }
    }
  }

  return body;
}

function getCommandChatTurns(messages: CommandChatMessage[]) {
  const turns: CommandChatTurn[] = [];

  for (const message of messages) {
    if (message.role === "user") {
      turns.push({ assistants: [], id: message.id, user: message });
      continue;
    }

    const latestTurn = turns[turns.length - 1];
    if (latestTurn) {
      latestTurn.assistants.push(message);
    } else {
      turns.push({ assistants: [message], id: message.id });
    }
  }

  return turns.reverse();
}

export default function GlobalCommandPalette({ writingPosts }: GlobalCommandPaletteProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const askThreadRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [mode, setMode] = useState<CommandMode>("commands");
  const [query, setQuery] = useState("");
  const [askInput, setAskInput] = useState("");
  const [askMessages, setAskMessages] = useState<CommandChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [lensRect, setLensRect] = useState<{ height: number; left: number; top: number; width: number } | null>(null);
  const [recentItem, setRecentItem] = useState<RecentCommandItem | null>(null);
  const { copyText, toast } = useCopyFeedback();

  const currentProject = useMemo(() => getCurrentProject(pathname), [pathname]);
  const contextLabel = useMemo(
    () => getCurrentContext(pathname, currentProject, writingPosts),
    [currentProject, pathname, writingPosts],
  );
  const commandPlaceholder = useMemo(
    () => getCommandSearchPlaceholder(pathname, currentProject, writingPosts),
    [currentProject, pathname, writingPosts],
  );
  const currentNote = useMemo(() => getCurrentNote(pathname, writingPosts), [pathname, writingPosts]);

  const push = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const jumpToId = useCallback((id: string, href: string) => {
    if (pathname === href.split("#")[0]) {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      return;
    }

    router.push(href);
  }, [pathname, reduceMotion, router]);

  const openAskMode = useCallback(() => {
    setIsOpen(true);
    setMode("ask");
    setQuery("");
    setActiveIndex(0);
    setLensRect(null);
    setAskInput("");
  }, []);

  const askAboutPortfolio = useCallback(() => {
    openAskMode();
  }, [openAskMode]);

  const openShortcuts = useCallback(() => setIsShortcutsOpen(true), []);

  const items = useMemo<CommandItem[]>(() => buildCommandItems({
    askAboutPortfolio,
    contextLabel,
    copyText,
    currentProject,
    jumpToId,
    openShortcuts,
    pathname,
    push,
    recentItem,
    writingPosts,
  }), [askAboutPortfolio, contextLabel, copyText, currentProject, jumpToId, openShortcuts, pathname, push, recentItem, writingPosts]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = normalizeCommandText(query);
    if (!normalizedQuery) {
      const contextualItems = items.filter((item) => item.defaultVisible);
      return contextualItems.length > 0 ? contextualItems : items.slice(0, 7);
    }

    return items.filter((item) =>
      [item.title, item.meta, item.group, ...item.keywords]
        .map(normalizeCommandText)
        .some((value) => value.includes(normalizedQuery)),
    );
  }, [items, query]);
  const askTurns = useMemo(() => getCommandChatTurns(askMessages), [askMessages]);
  const clampedActiveIndex = visibleItems.length > 0 ? Math.min(activeIndex, visibleItems.length - 1) : 0;
  const activeItem = visibleItems[clampedActiveIndex];

  const closePalette = useCallback(() => {
    setQuery("");
    setAskInput("");
    setActiveIndex(0);
    setMode("commands");
    setIsOpen(false);
  }, []);

  const updateLensRect = useCallback(() => {
    const row = rowRefs.current[clampedActiveIndex];
    const list = listRef.current;

    if (!isOpen || mode !== "commands" || !row || !list || visibleItems.length === 0) {
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
  }, [clampedActiveIndex, isOpen, mode, visibleItems.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setRecentItem(readRecentCommand(pathname));
        setIsOpen(true);
        setMode("commands");
        return;
      }

      if (event.key === "?" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setIsShortcutsOpen(true);
      }
    };
    const onOpenCommand = () => {
      setRecentItem(readRecentCommand(pathname));
      setIsOpen(true);
      setMode("commands");
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpenCommand);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpenCommand);
    };
  }, [pathname]);

  useEffect(() => {
    const currentRecentItem = currentProject
      ? {
          href: pathname,
          meta: "project",
          title: currentProject.title.toLowerCase(),
        }
      : currentNote
        ? {
            href: pathname,
            meta: "note",
            title: currentNote.title.toLowerCase(),
          }
        : pathname === "/work"
          ? {
              href: pathname,
              meta: "archive",
              title: "work",
            }
          : pathname === "/notes"
            ? {
                href: pathname,
                meta: "archive",
                title: "notes",
              }
            : null;

    writeRecentCommand(currentRecentItem);
  }, [currentNote, currentProject, pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, mode]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, visibleItems.length);
  }, [visibleItems.length]);

  useLayoutEffect(() => {
    if (!isOpen || mode !== "commands") return;

    const row = rowRefs.current[clampedActiveIndex];
    row?.scrollIntoView({ block: "nearest" });
    const frame = window.requestAnimationFrame(updateLensRect);
    return () => window.cancelAnimationFrame(frame);
  }, [clampedActiveIndex, isOpen, mode, query, updateLensRect, visibleItems.length]);

  useEffect(() => {
    if (!isOpen || mode !== "commands") return;

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
  }, [isOpen, mode, updateLensRect, visibleItems.length]);

  useEffect(() => {
    if (mode !== "ask" || !askThreadRef.current) return;
    askThreadRef.current.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [askMessages, isAsking, mode, reduceMotion]);

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

  useEffect(() => {
    if (!isShortcutsOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsShortcutsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isShortcutsOpen]);

  const submitAsk = useCallback(async (message = askInput) => {
    const trimmed = message.trim();
    if (!trimmed || isAsking) return;

    const messageIdSeed = `${Date.now()}-${trimmed.length}`;
    const userMsg: CommandChatMessage = { id: `ask-user-${messageIdSeed}`, role: "user", content: trimmed };
    const assistantId = `ask-assistant-${messageIdSeed}`;
    const nextMessages = [...askMessages, userMsg];

    setAskInput("");
    setAskMessages(nextMessages);
    setIsAsking(true);

    const updateAssistantMessage = (content: string) => {
      setAskMessages((prev) =>
        prev.map((msg) => (msg.id === assistantId ? { ...msg, content } : msg)),
      );
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context: contextLabel }),
      });

      if (!res.ok) throw new Error("API error");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setAskMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      const readStream = async (currentText: string): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) {
          const tail = decoder.decode();
          if (tail) updateAssistantMessage(`${currentText}${tail}`);
          return;
        }

        const nextText = `${currentText}${decoder.decode(value, { stream: true })}`;
        updateAssistantMessage(nextText);
        return readStream(nextText);
      };

      await readStream("");
    } catch (error) {
      console.error("Command ask error:", error);
      const errorMessage: CommandChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "i could not reach the ai demo. try again in a moment.",
        status: "error",
      };
      setAskMessages((prev) =>
        prev.some((msg) => msg.id === assistantId)
          ? prev.map((msg) => (msg.id === assistantId ? errorMessage : msg))
          : [...prev, errorMessage],
      );
    } finally {
      setIsAsking(false);
    }
  }, [askInput, askMessages, contextLabel, isAsking]);

  const runCommand = (item: CommandItem) => {
    item.action();
    if (item.id === "ask-portfolio") {
      return;
    }
    if (item.group !== "copy") {
      closePalette();
    }
  };

  const showCommandList = mode === "commands";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="command-layer"
            className="command-layer"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? tweens.none : tweens.fast}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closePalette();
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="site command palette"
              className="command-panel"
              initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.992 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.994 }}
              transition={reduceMotion ? tweens.none : tweens.fast}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <motion.div
                className="command-search"
                initial={reduceMotion ? false : { opacity: 0, y: -2 }}
                animate={
                  reduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: 0, transition: { ...tweens.fast, delay: 0.02 } }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -1, transition: { ...tweens.instant, delay: 0.04 } }
                }
              >
                {mode === "ask" ? (
                  <button
                    type="button"
                    className="command-search__back micro-focus micro-focus-tight micro-pressable"
                    aria-label="back to commands"
                    onClick={() => {
                      setMode("commands");
                      setAskInput("");
                    }}
                  >
                    <ArrowLeft aria-hidden="true" />
                  </button>
                ) : (
                  <Search className="command-search__icon" aria-hidden="true" />
                )}
                <input
                  ref={inputRef}
                  value={mode === "ask" ? askInput : query}
                  onChange={(event) => {
                    if (mode === "ask") {
                      setAskInput(event.target.value);
                    } else {
                      setQuery(event.target.value);
                      setActiveIndex(0);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (mode === "ask") {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void submitAsk();
                      }
                      return;
                    }

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
                  placeholder={mode === "ask" ? "ask about this portfolio" : commandPlaceholder}
                  aria-label={mode === "ask" ? "ask about this portfolio" : "search commands"}
                />
                <span className="command-search__controls">
                  {mode === "ask" && (
                    <button
                      type="button"
                      className="command-search__send micro-focus micro-focus-tight micro-pressable"
                      aria-label="send portfolio question"
                      disabled={!askInput.trim() || isAsking}
                      onClick={() => void submitAsk()}
                    >
                      <ArrowRight aria-hidden="true" />
                    </button>
                  )}
                  {toast && mode === "commands" ? (
                    <span className="command-search__status" role="status" aria-live="polite" aria-atomic="true">
                      {toast}
                    </span>
                  ) : (
                  <button
                    type="button"
                    className="command-search__escape micro-focus micro-focus-tight micro-pressable"
                    aria-label="close command palette"
                    aria-keyshortcuts="Escape"
                    onClick={closePalette}
                  >
                    esc
                  </button>
                  )}
                </span>
              </motion.div>

              {showCommandList ? (
                <motion.div
                ref={listRef}
                className="command-list"
                role="listbox"
                aria-label="site commands"
                initial={reduceMotion ? false : { opacity: 0, y: 3 }}
                animate={
                  reduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: 0, transition: { ...tweens.fast, delay: 0.08 } }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -2, transition: tweens.instant }
                }
              >
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
                    transition={reduceMotion ? tweens.none : glassLensTransition}
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
                      aria-selected={index === clampedActiveIndex}
                    >
                      <span className="command-row__icon" aria-hidden="true">{item.icon}</span>
                      <span className="command-row__copy">
                        <span className="command-row__title">{item.title}</span>
                        <span className="command-row__meta">{item.meta}</span>
                      </span>
                      <span className="command-row__hint" aria-hidden="true">
                        {getCommandActionHint(item)}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="command-empty">no command</p>
                )}
              </motion.div>
              ) : (
                <motion.div
                  ref={askThreadRef}
                  className="command-ask"
                  initial={reduceMotion ? false : { opacity: 0, y: 3 }}
                  animate={
                    reduceMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 1, y: 0, transition: { ...tweens.fast, delay: 0.06 } }
                  }
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -2, transition: tweens.instant }}
                >
                  {askTurns.map((turn, turnIndex) => (
                    <div className="command-ask__turn" key={turn.id}>
                      {turn.user && (
                        <div className="command-ask__message command-ask__message--user">
                          {turn.user.content}
                        </div>
                      )}
                      {turn.assistants.map((message) => {
                        const body = formatCommandAssistantMessage(message.content);
                        if (!body && message.status !== "error") return null;

                        return (
                          <div
                            key={message.id}
                            className={`command-ask__message command-ask__message--assistant${
                              message.status === "error" ? " command-ask__message--error" : ""
                            }`}
                          >
                            {body || message.content || " "}
                          </div>
                        );
                      })}
                      {isAsking && turnIndex === 0 && (
                        <div className="command-ask__typing" aria-label="portfolio answer loading">
                          <span />
                          <span />
                          <span />
                        </div>
                      )}
                    </div>
                  ))}
                  {isAsking && askTurns.length === 0 && (
                    <div className="command-ask__typing" aria-label="portfolio answer loading">
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </motion.div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShortcutsOpen && (
          <motion.div
            className="shortcuts-layer"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? tweens.none : tweens.fast}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsShortcutsOpen(false);
            }}
          >
            <motion.div
              className="shortcuts-panel"
              role="dialog"
              aria-modal="true"
              aria-label="keyboard shortcuts"
              initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.99 }}
              transition={reduceMotion ? tweens.none : springs.spatialFast}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="shortcuts-panel__head">
                <Command aria-hidden="true" />
                <span>shortcuts</span>
              </div>
              <dl className="shortcuts-list">
                <div><dt>cmd+K</dt><dd>command palette</dd></div>
                <div><dt>?</dt><dd>shortcuts</dd></div>
                <div><dt>up/down</dt><dd>move selection</dd></div>
                <div><dt>enter</dt><dd>run command</dd></div>
                <div><dt>esc</dt><dd>close overlay</dd></div>
              </dl>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
