"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  type MotionStyle,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type CursorMode = "idle" | "interactive" | "close";
type CursorTone = "dark" | "light";
type CursorState = { mode: CursorMode; tone: CursorTone };
type TargetHaloKind = "default" | "text";
type TargetHaloState = { kind: TargetHaloKind; tone: CursorTone; visible: boolean };

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
const targetHaloPaddingByKind: Record<TargetHaloKind, { x: number; y: number }> = {
  default: { x: 6, y: 6 },
  text: { x: 12, y: 5 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutSigned(value: number, power = 2) {
  const clamped = clamp(value, -1, 1);
  return Math.sign(clamped) * (1 - Math.pow(1 - Math.abs(clamped), 1 / power));
}

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

function getTargetHaloKind(target: HTMLElement, rect: DOMRect): TargetHaloKind {
  if (
    target.matches(".home-tab-button, .intro-contact-link, .micro-link") ||
    (rect.height <= 34 && rect.width <= 180)
  ) {
    return "text";
  }

  return "default";
}

function readTargetRadius(
  target: HTMLElement,
  height: number,
  padding: { x: number; y: number },
) {
  const styles = window.getComputedStyle(target);
  const radius = Number.parseFloat(styles.borderTopLeftRadius);
  const pillRadius = Math.min(height / 2, 18);
  return Math.max(
    Number.isFinite(radius) ? radius + Math.max(padding.x, padding.y) : 0,
    pillRadius,
  );
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
  const targetRotateX = useMotionValue(0);
  const targetRotateY = useMotionValue(0);
  const targetShiftX = useMotionValue(0);
  const targetShiftY = useMotionValue(0);
  const targetOriginX = useMotionValue(50);
  const targetOriginY = useMotionValue(50);
  const targetShineX = useMotionValue(50);
  const targetShineY = useMotionValue(18);
  const targetScale = useMotionValue(0.86);
  const targetXSpring = useSpring(targetX, { stiffness: 500, damping: 26, mass: 0.3 });
  const targetYSpring = useSpring(targetY, { stiffness: 500, damping: 26, mass: 0.3 });
  const targetWidthSpring = useSpring(targetWidth, { stiffness: 380, damping: 22, mass: 0.34 });
  const targetHeightSpring = useSpring(targetHeight, { stiffness: 380, damping: 22, mass: 0.34 });
  const targetRadiusSpring = useSpring(targetRadius, { stiffness: 360, damping: 23, mass: 0.28 });
  const targetRotateXSpring = useSpring(targetRotateX, { stiffness: 330, damping: 20, mass: 0.28 });
  const targetRotateYSpring = useSpring(targetRotateY, { stiffness: 330, damping: 20, mass: 0.28 });
  const targetShiftXSpring = useSpring(targetShiftX, { stiffness: 330, damping: 21, mass: 0.32 });
  const targetShiftYSpring = useSpring(targetShiftY, { stiffness: 330, damping: 21, mass: 0.32 });
  const targetOriginXSpring = useSpring(targetOriginX, { stiffness: 620, damping: 36, mass: 0.16 });
  const targetOriginYSpring = useSpring(targetOriginY, { stiffness: 620, damping: 36, mass: 0.16 });
  const targetShineXSpring = useSpring(targetShineX, { stiffness: 520, damping: 34, mass: 0.18 });
  const targetShineYSpring = useSpring(targetShineY, { stiffness: 520, damping: 34, mass: 0.18 });
  const targetScaleSpring = useSpring(targetScale, { stiffness: 430, damping: 20, mass: 0.28 });
  const targetHaloTransform = useMotionTemplate`perspective(1400px) translate3d(${targetXSpring}px, ${targetYSpring}px, 0) translate3d(${targetShiftXSpring}px, ${targetShiftYSpring}px, 0) rotateX(${targetRotateXSpring}deg) rotateY(${targetRotateYSpring}deg) scale(${targetScaleSpring})`;
  const targetTransformOrigin = useMotionTemplate`${targetOriginXSpring}% ${targetOriginYSpring}%`;
  const targetShineXPosition = useMotionTemplate`${targetShineXSpring}%`;
  const targetShineYPosition = useMotionTemplate`${targetShineYSpring}%`;
  const [cursorState, setCursorState] = useState<CursorState>({ mode: "idle", tone: "dark" });
  const [targetHaloState, setTargetHaloState] = useState<TargetHaloState>({
    kind: "default",
    tone: "dark",
    visible: false,
  });
  const [visible, setVisible] = useState(false);
  const cursorStateRef = useRef(cursorState);
  const targetHaloStateRef = useRef(targetHaloState);
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const revealFrameRef = useRef<number | null>(null);
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

    const resetTargetTilt = () => {
      targetRotateX.set(0);
      targetRotateY.set(0);
      targetShiftX.set(0);
      targetShiftY.set(0);
      targetOriginX.set(50);
      targetOriginY.set(50);
      targetShineX.set(50);
      targetShineY.set(18);
      targetScale.set(0.86);
    };

    const syncTargetHalo = (
      target: HTMLElement,
      tone: CursorTone,
      pointer?: { x: number; y: number },
    ) => {
      const rect = target.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        activeTargetRef.current = null;
        setTargetHalo({ kind: targetHaloStateRef.current.kind, tone, visible: false });
        resetTargetTilt();
        return;
      }

      const isFreshTarget = activeTargetRef.current !== target || !targetHaloStateRef.current.visible;
      const kind = getTargetHaloKind(target, rect);
      const padding = targetHaloPaddingByKind[kind];
      const targetLeft = rect.left - padding.x;
      const targetTop = rect.top - padding.y;
      const width = rect.width + padding.x * 2;
      const height = rect.height + padding.y * 2;
      targetX.set(targetLeft);
      targetY.set(targetTop);
      targetWidth.set(width);
      targetHeight.set(height);
      targetRadius.set(readTargetRadius(target, height, padding));
      activeTargetRef.current = target;
      setTargetHalo({ kind, tone, visible: true });

      if (pointer) {
        const pointerX = clamp((pointer.x - targetLeft) / width, 0, 1);
        const pointerY = clamp((pointer.y - targetTop) / height, 0, 1);
        const normalizedX = pointerX * 2 - 1;
        const normalizedY = pointerY * 2 - 1;
        const aspect = Math.max(1, width / Math.max(1, height));

        targetRotateX.set(-normalizedY * Math.min(2.7, 0.95 + aspect * 0.2));
        targetRotateY.set(normalizedX * 1.28);
        targetShiftX.set(13 * easeOutSigned(normalizedX, 2));
        targetShiftY.set(9 * easeOutSigned(normalizedY, 2));
        targetOriginX.set(14 + pointerX * 72);
        targetOriginY.set(14 + pointerY * 72);
        targetShineX.set(18 + pointerX * 64);
        targetShineY.set(8 + pointerY * 54);
      }

      if (isFreshTarget) {
        if (revealFrameRef.current !== null) cancelAnimationFrame(revealFrameRef.current);
        targetScale.set(0.66);
        revealFrameRef.current = requestAnimationFrame(() => {
          revealFrameRef.current = null;
          targetScale.set(1);
        });
      } else {
        targetScale.set(1);
      }
    };

    const hideTargetHalo = () => {
      if (revealFrameRef.current !== null) {
        cancelAnimationFrame(revealFrameRef.current);
        revealFrameRef.current = null;
      }
      activeTargetRef.current = null;
      setTargetHalo({
        kind: targetHaloStateRef.current.kind,
        tone: targetHaloStateRef.current.tone,
        visible: false,
      });
      resetTargetTilt();
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
        syncTargetHalo(target, next.tone, { x: event.clientX, y: event.clientY });
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
      if (revealFrameRef.current !== null) cancelAnimationFrame(revealFrameRef.current);
    };
  }, [
    canUseCursor,
    rawX,
    rawY,
    targetHeight,
    targetOriginX,
    targetOriginY,
    targetRadius,
    targetRotateX,
    targetRotateY,
    targetScale,
    targetShineX,
    targetShineY,
    targetShiftX,
    targetShiftY,
    targetWidth,
    targetX,
    targetY,
  ]);

  if (!canUseCursor) return null;

  const targetHaloStyle = {
    "--cursor-glass-x": targetShineXPosition,
    "--cursor-glass-y": targetShineYPosition,
    borderRadius: targetRadiusSpring,
    height: targetHeightSpring,
    transform: targetHaloTransform,
    transformOrigin: targetTransformOrigin,
    width: targetWidthSpring,
  } as MotionStyle;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className={`animated-cursor-target animated-cursor-target--${targetHaloState.tone} animated-cursor-target--${targetHaloState.kind} ${
          targetHaloState.visible ? "is-visible" : ""
        }`}
        style={targetHaloStyle}
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
