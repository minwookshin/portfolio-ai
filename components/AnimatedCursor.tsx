"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

type CursorMode = "dot" | "interactive" | "close";
type CursorTone = "dark" | "light";

const interactiveSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[role='button']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getCursorState(target: EventTarget | null): { mode: CursorMode; tone: CursorTone } {
  if (!(target instanceof Element)) return { mode: "dot", tone: "dark" };

  const closeZone = target.closest(".project-lightbox-close-zone");
  const closeContent = target.closest(".project-lightbox-content");
  if (closeZone && !closeContent) {
    return {
      mode: "close",
      tone: closeZone.classList.contains("bg-surface") ? "dark" : "light",
    };
  }

  const tone: CursorTone = target.closest(".dark-embed") ? "light" : "dark";
  const interactive = target.closest(interactiveSelector);
  return { mode: interactive ? "interactive" : "dot", tone };
}

export default function AnimatedCursor() {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const transform = useMotionTemplate`translate3d(${rawX}px, ${rawY}px, 0) translate(-50%, -50%)`;
  const [mode, setMode] = useState<CursorMode>("dot");
  const [tone, setTone] = useState<CursorTone>("dark");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("animated-cursor-active");

    const update = (event: PointerEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      const next = getCursorState(event.target);
      setMode(next.mode);
      setTone(next.tone);
      setVisible(true);
    };

    const hide = () => setVisible(false);

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
  }, [rawX, rawY, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className={`animated-cursor animated-cursor--${mode} animated-cursor--${tone} ${
        visible ? "is-visible" : ""
      }`}
      style={{ transform }}
    >
      <span className="animated-cursor__frame" />
      <span className="animated-cursor__core" />
      <span className="animated-cursor__x animated-cursor__x--a" />
      <span className="animated-cursor__x animated-cursor__x--b" />
    </motion.div>
  );
}
