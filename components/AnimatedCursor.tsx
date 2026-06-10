"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { cursorGlyphPath } from "@/lib/cursorGlyph";

type CursorMode = "idle" | "interactive" | "native";
type CursorTone = "dark" | "light";
type CursorState = { mode: CursorMode; tone: CursorTone };

const interactiveSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[role='button']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const explicitCursorModes: Record<string, CursorMode> = {
  idle: "idle",
  interactive: "interactive",
  native: "native",
  view: "interactive",
};

const finePointerQuery = "(hover: hover) and (pointer: fine)";

function subscribeFinePointer(onChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const pointerQuery = window.matchMedia(finePointerQuery);
  pointerQuery.addEventListener("change", onChange);
  return () => pointerQuery.removeEventListener("change", onChange);
}

function getFinePointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(finePointerQuery).matches;
}

function getCursorTone(target: Element): CursorTone {
  return target.closest(".dark-embed") ? "light" : "dark";
}

function getCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return { mode: "idle", tone: "dark" };

  const tone = getCursorTone(target);
  const explicitTarget = target.closest<HTMLElement>("[data-cursor]");
  const explicitMode = explicitTarget?.dataset.cursor;
  if (explicitMode && explicitCursorModes[explicitMode]) {
    return { mode: explicitCursorModes[explicitMode], tone };
  }

  const interactive = target.closest(interactiveSelector);
  return { mode: interactive ? "interactive" : "idle", tone };
}

export default function AnimatedCursor() {
  const reduceMotion = useReducedMotion();
  const hasFinePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    () => false,
  );
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const pointerTransform = useMotionTemplate`translate3d(${rawX}px, ${rawY}px, 0)`;
  const [cursorState, setCursorState] = useState<CursorState>({ mode: "idle", tone: "dark" });
  const [visible, setVisible] = useState(false);
  const cursorStateRef = useRef(cursorState);
  const visibleRef = useRef(false);
  const canUseCursor = hasFinePointer && !reduceMotion;

  useEffect(() => {
    if (!canUseCursor) return;

    document.documentElement.classList.add("animated-cursor-active");

    const update = (event: PointerEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      const next = getCursorState(event.target);
      if (
        next.mode !== cursorStateRef.current.mode ||
        next.tone !== cursorStateRef.current.tone
      ) {
        cursorStateRef.current = next;
        setCursorState(next);
      }
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const hide = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    window.addEventListener("pointermove", update, { passive: true });
    window.addEventListener("pointerenter", update, { passive: true });
    window.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      document.documentElement.classList.remove("animated-cursor-active");
      window.removeEventListener("pointermove", update);
      window.removeEventListener("pointerenter", update);
      window.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [canUseCursor, rawX, rawY]);

  if (!canUseCursor) return null;

  return (
    <motion.div
      aria-hidden="true"
      className={`animated-cursor-pointer animated-cursor-pointer--${cursorState.mode} animated-cursor-pointer--${cursorState.tone} ${
        visible ? "is-visible" : ""
      }`}
      style={{ transform: pointerTransform }}
    >
      <svg className="animated-cursor__arrow" viewBox="0 0 14 15">
        <path className="animated-cursor__outline" d={cursorGlyphPath} />
        <path className="animated-cursor__fill" d={cursorGlyphPath} />
      </svg>
    </motion.div>
  );
}
