"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCopyFeedback } from "@/components/CopyFeedback";
import type { CommandItem } from "@/components/commandPaletteItems";
import {
  buildCommandItems,
  getCommandSearchPlaceholder,
  getCurrentContext,
  getCurrentProject,
  normalizeCommandText,
} from "@/components/commandPaletteItems";
import { springs, tweens } from "@/lib/material/motion";
import type { WritingPostMeta } from "@/lib/writingTypes";

const OPEN_COMMAND_EVENT = "portfolio-command:open";
const ASK_PORTFOLIO_EVENT = "portfolio-command:ask";
const ASK_PORTFOLIO_STORAGE_KEY = "portfolio-command-ask";

type GlobalCommandPaletteProps = {
  writingPosts: WritingPostMeta[];
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
  if (item.id === "show-shortcuts") return "show";
  return "open";
}

export default function GlobalCommandPalette({ writingPosts }: GlobalCommandPaletteProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lensRect, setLensRect] = useState<{ height: number; left: number; top: number; width: number } | null>(null);
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

  const askAboutPortfolio = useCallback(() => {
    if (pathname === "/") {
      window.dispatchEvent(new Event(ASK_PORTFOLIO_EVENT));
      return;
    }

    window.sessionStorage.setItem(ASK_PORTFOLIO_STORAGE_KEY, "true");
    router.push("/");
  }, [pathname, router]);

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
    writingPosts,
  }), [askAboutPortfolio, contextLabel, copyText, currentProject, jumpToId, openShortcuts, pathname, push, writingPosts]);

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
  const clampedActiveIndex = visibleItems.length > 0 ? Math.min(activeIndex, visibleItems.length - 1) : 0;
  const activeItem = visibleItems[clampedActiveIndex];

  const closePalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setIsOpen(false);
  }, []);

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
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
        return;
      }

      if (event.key === "?" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setIsShortcutsOpen(true);
      }
    };
    const onOpenCommand = () => setIsOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpenCommand);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpenCommand);
    };
  }, []);

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

  const runCommand = (item: CommandItem) => {
    item.action();
    if (item.group !== "copy") {
      closePalette();
    }
  };

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
                  placeholder={commandPlaceholder}
                  aria-label="search commands"
                />
                {toast ? (
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
              </motion.div>

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
                    transition={reduceMotion ? tweens.none : springs.commandLens}
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
                <div><dt>cmd+k</dt><dd>command palette</dd></div>
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

export { ASK_PORTFOLIO_EVENT, ASK_PORTFOLIO_STORAGE_KEY };
