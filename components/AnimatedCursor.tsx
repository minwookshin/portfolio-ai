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
type TargetHaloState = { tone: CursorTone; visible: boolean };

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
const targetHaloPadding = 6;

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

function getInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>(interactiveSelector);
}

function readTargetRadius(target: HTMLElement, height: number) {
  const styles = window.getComputedStyle(target);
  const radius = Number.parseFloat(styles.borderTopLeftRadius);
  const pillRadius = Math.min(height / 2, 18);
  return Math.max(Number.isFinite(radius) ? radius + targetHaloPadding : 0, pillRadius);
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
  const targetX = useMotionValue(-100);
  const targetY = useMotionValue(-100);
  const targetWidth = useMotionValue(0);
  const targetHeight = useMotionValue(0);
  const targetRadius = useMotionValue(18);
  const targetXSpring = useSpring(targetX, { stiffness: 430, damping: 30, mass: 0.26 });
  const targetYSpring = useSpring(targetY, { stiffness: 430, damping: 30, mass: 0.26 });
  const targetWidthSpring = useSpring(targetWidth, { stiffness: 420, damping: 28, mass: 0.28 });
  const targetHeightSpring = useSpring(targetHeight, { stiffness: 420, damping: 28, mass: 0.28 });
  const targetRadiusSpring = useSpring(targetRadius, { stiffness: 420, damping: 30, mass: 0.24 });
  const targetHaloTransform = useMotionTemplate`translate3d(${targetXSpring}px, ${targetYSpring}px, 0)`;
  const [cursorState, setCursorState] = useState<CursorState>({ mode: "idle", tone: "dark" });
  const [targetHaloState, setTargetHaloState] = useState<TargetHaloState>({
    tone: "dark",
    visible: false,
  });
  const [visible, setVisible] = useState(false);
  const cursorStateRef = useRef(cursorState);
  const targetHaloStateRef = useRef(targetHaloState);
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const visibleRef = useRef(false);
  const canUseCursor = hasFinePointer && !reduceMotion;

  useEffect(() => {
    if (!canUseCursor) return;

    document.documentElement.classList.add("animated-cursor-active");

    const setTargetHalo = (next: TargetHaloState) => {
      if (
        next.visible !== targetHaloStateRef.current.visible ||
        next.tone !== targetHaloStateRef.current.tone
      ) {
        targetHaloStateRef.current = next;
        setTargetHaloState(next);
      }
    };

    const syncTargetHalo = (target: HTMLElement, tone: CursorTone) => {
      const rect = target.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        activeTargetRef.current = null;
        setTargetHalo({ tone, visible: false });
        return;
      }

      const width = rect.width + targetHaloPadding * 2;
      const height = rect.height + targetHaloPadding * 2;
      targetX.set(rect.left - targetHaloPadding);
      targetY.set(rect.top - targetHaloPadding);
      targetWidth.set(width);
      targetHeight.set(height);
      targetRadius.set(readTargetRadius(target, height));
      activeTargetRef.current = target;
      setTargetHalo({ tone, visible: true });
    };

    const hideTargetHalo = () => {
      activeTargetRef.current = null;
      setTargetHalo({ tone: targetHaloStateRef.current.tone, visible: false });
    };

    const refreshTargetHalo = () => {
      const target = activeTargetRef.current;
      if (!target || !target.isConnected || cursorStateRef.current.mode !== "interactive") {
        hideTargetHalo();
        return;
      }

      syncTargetHalo(target, cursorStateRef.current.tone);
    };

    const update = (event: PointerEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      const next = getCursorState(event.target);
      const target = next.mode === "interactive" ? getInteractiveTarget(event.target) : null;
      if (
        next.mode !== cursorStateRef.current.mode ||
        next.tone !== cursorStateRef.current.tone
      ) {
        cursorStateRef.current = next;
        setCursorState(next);
      }
      if (target) {
        syncTargetHalo(target, next.tone);
      } else {
        hideTargetHalo();
      }
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const hide = () => {
      visibleRef.current = false;
      setVisible(false);
      hideTargetHalo();
    };

    window.addEventListener("pointermove", update, { passive: true });
    window.addEventListener("pointerenter", update, { passive: true });
    window.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", refreshTargetHalo, { capture: true, passive: true });
    window.addEventListener("resize", refreshTargetHalo, { passive: true });

    return () => {
      document.documentElement.classList.remove("animated-cursor-active");
      window.removeEventListener("pointermove", update);
      window.removeEventListener("pointerenter", update);
      window.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", refreshTargetHalo, true);
      window.removeEventListener("resize", refreshTargetHalo);
    };
  }, [canUseCursor, rawX, rawY, targetHeight, targetRadius, targetWidth, targetX, targetY]);

  if (!canUseCursor) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className={`animated-cursor-target animated-cursor-target--${targetHaloState.tone} ${
          targetHaloState.visible ? "is-visible" : ""
        }`}
        style={{
          borderRadius: targetRadiusSpring,
          height: targetHeightSpring,
          transform: targetHaloTransform,
          width: targetWidthSpring,
        }}
      >
        <span className="animated-cursor-target__halo" />
      </motion.div>
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
        <span className="animated-cursor__arrow" />
      </motion.div>
    </>
  );
}
