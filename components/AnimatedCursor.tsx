"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type CursorMode = "idle" | "interactive" | "close";
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
  interactive: "interactive",
  view: "interactive",
  close: "close",
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

  const closeZone = target.closest(".project-lightbox-close-zone");
  const closeContent = target.closest(".project-lightbox-content");
  if (closeZone && !closeContent) {
    return {
      mode: "close",
      tone: closeZone.classList.contains("bg-surface") ? "dark" : "light",
    };
  }

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
  const haloX = useSpring(rawX, { stiffness: 520, damping: 38, mass: 0.22 });
  const haloY = useSpring(rawY, { stiffness: 520, damping: 38, mass: 0.22 });
  const pointerTransform = useMotionTemplate`translate3d(${rawX}px, ${rawY}px, 0)`;
  const haloTransform = useMotionTemplate`translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%)`;
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
    <>
      <motion.div
        aria-hidden="true"
        className={`animated-cursor animated-cursor--${cursorState.mode} animated-cursor--${cursorState.tone} ${
          visible ? "is-visible" : ""
        }`}
        style={{ transform: haloTransform }}
      >
        <span className="animated-cursor__halo" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className={`animated-cursor-pointer animated-cursor-pointer--${cursorState.mode} animated-cursor-pointer--${cursorState.tone} ${
          visible ? "is-visible" : ""
        }`}
        style={{ transform: pointerTransform }}
      >
        <svg className="animated-cursor__arrow" viewBox="0 0 18 22">
          <path d="M2.45 1.18C1.62 0.61 0.55 1.21 0.55 2.24v15.49c0 1.06 1.28 1.6 2.04 0.85l3.92-3.86 2.52 5.73c0.31 0.71 1.14 1.03 1.85 0.72l2.19-0.96c0.71-0.31 1.03-1.14 0.72-1.85l-2.48-5.66h5.03c1.2 0 1.7-1.53 0.74-2.25L2.45 1.18Z" />
        </svg>
      </motion.div>
    </>
  );
}
