"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, FocusEvent, PointerEvent, ReactNode } from "react";
import { useCallback, useRef, useState } from "react";

type GlassRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type GlassMotion = {
  originX: number;
  originY: number;
  rotateX: number;
  rotateY: number;
  shiftX: number;
  shiftY: number;
};

type LiquidGlassHoverScopeProps = {
  children: ReactNode;
  className?: string;
  rowSelector?: string;
};

const DEFAULT_ROW_SELECTOR = '[data-liquid-glass-row="true"]';
const GLASS_INSET_X = 16;
const GLASS_INSET_Y = 8;
const HIDE_DELAY_MS = 500;
const TEXT_SHIFT_SCALE = 0.18;

const BASE_SPRING = { type: "spring", duration: 0.72, bounce: 0.22 } as const;
const RADIUS_SPRING = { type: "spring", duration: 0.6, bounce: 0 } as const;
const TILT_SPRING = { type: "spring", duration: 0.45, bounce: 0.06 } as const;
const SHIFT_SPRING = { type: "spring", duration: 0.6, bounce: 0.15 } as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function softenSigned(value: number, power: number) {
  const clamped = clamp(value, -1, 1);
  return Math.sign(clamped) * (1 - Math.pow(1 - Math.abs(clamped), 1 / Math.max(1, power)));
}

function initialMotion(): GlassMotion {
  return {
    originX: 50,
    originY: 50,
    rotateX: 0,
    rotateY: 0,
    shiftX: 0,
    shiftY: 0,
  };
}

function getVisibleContentRect(row: HTMLElement) {
  const childRects = Array.from(row.children)
    .map((child) => child.getBoundingClientRect())
    .filter((rect) => rect.width > 0 && rect.height > 0);

  if (childRects.length === 0) {
    return row.getBoundingClientRect();
  }

  return {
    bottom: Math.max(...childRects.map((rect) => rect.bottom)),
    height: 0,
    left: Math.min(...childRects.map((rect) => rect.left)),
    right: Math.max(...childRects.map((rect) => rect.right)),
    top: Math.min(...childRects.map((rect) => rect.top)),
    width: 0,
  };
}

export default function LiquidGlassHoverScope({
  children,
  className = "",
  rowSelector = DEFAULT_ROW_SELECTOR,
}: LiquidGlassHoverScopeProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const activeRowRef = useRef<HTMLElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [rect, setRect] = useState<GlassRect>({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  });
  const [motionState, setMotionState] = useState<GlassMotion>(() => initialMotion());
  const [visible, setVisible] = useState(false);

  const clearHideTimer = useCallback(() => {
    if (!hideTimerRef.current) return;
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  }, []);

  const clearActiveRow = useCallback(() => {
    if (!activeRowRef.current) return;

    activeRowRef.current.removeAttribute("data-liquid-glass-active");
    activeRowRef.current.style.removeProperty("--liquid-row-shift-x");
    activeRowRef.current.style.removeProperty("--liquid-row-shift-y");
  }, []);

  const applyTextShift = useCallback((row: HTMLElement, motion: GlassMotion) => {
    row.dataset.liquidGlassActive = "true";
    row.style.setProperty("--liquid-row-shift-x", `${motion.shiftX * TEXT_SHIFT_SCALE}px`);
    row.style.setProperty("--liquid-row-shift-y", `${motion.shiftY * TEXT_SHIFT_SCALE}px`);
  }, []);

  const getRowFromTarget = useCallback(
    (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return null;

      const scope = scopeRef.current;
      const row = target.closest<HTMLElement>(rowSelector);

      if (!scope || !row || !scope.contains(row)) return null;
      return row;
    },
    [rowSelector],
  );

  const measureRow = useCallback((row: HTMLElement) => {
    const scope = scopeRef.current;
    if (!scope) return;

    const scopeRect = scope.getBoundingClientRect();
    const contentRect = getVisibleContentRect(row);

    setRect({
      height: contentRect.bottom - contentRect.top + GLASS_INSET_Y * 2,
      left: contentRect.left - scopeRect.left - GLASS_INSET_X,
      top: contentRect.top - scopeRect.top - GLASS_INSET_Y,
      width: contentRect.right - contentRect.left + GLASS_INSET_X * 2,
    });
  }, []);

  const updatePointerMotion = useCallback((event: PointerEvent<HTMLElement>, row: HTMLElement) => {
    if (reduceMotion) return;

    const contentRect = getVisibleContentRect(row);
    const width = Math.max(1, contentRect.right - contentRect.left);
    const height = Math.max(1, contentRect.bottom - contentRect.top);
    const relativeX = clamp((event.clientX - contentRect.left) / width, 0, 1);
    const relativeY = clamp((event.clientY - contentRect.top) / height, 0, 1);
    const normalizedX = relativeX * 2 - 1;
    const normalizedY = relativeY * 2 - 1;
    const aspect = Math.max(1, width / height);
    const nextMotion = {
      originX: 30 + relativeX * 40,
      originY: 30 + relativeY * 40,
      rotateX: -normalizedY * Math.min(1.6, 0.7 + 0.18 * aspect),
      rotateY: normalizedX * 0.8,
      shiftX: 12 * softenSigned(normalizedX, 2),
      shiftY: 8 * softenSigned(normalizedY, 2),
    };

    setMotionState(nextMotion);
    applyTextShift(row, nextMotion);
  }, [applyTextShift, reduceMotion]);

  const activateRow = useCallback(
    (row: HTMLElement) => {
      clearHideTimer();
      if (activeRowRef.current !== row) clearActiveRow();
      activeRowRef.current = row;
      row.dataset.liquidGlassActive = "true";
      measureRow(row);
      setVisible(true);
    },
    [clearActiveRow, clearHideTimer, measureRow],
  );

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setMotionState(initialMotion());
      clearActiveRow();
      activeRowRef.current = null;
    }, HIDE_DELAY_MS);
  }, [clearActiveRow, clearHideTimer]);

  const handlePointerOver = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const row = getRowFromTarget(event.target);
      if (!row || row === activeRowRef.current) return;
      activateRow(row);
      updatePointerMotion(event, row);
    },
    [activateRow, getRowFromTarget, updatePointerMotion],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const row = getRowFromTarget(event.target) ?? activeRowRef.current;
      if (!row) return;
      if (row !== activeRowRef.current) activateRow(row);
      measureRow(row);
      updatePointerMotion(event, row);
    },
    [activateRow, getRowFromTarget, measureRow, updatePointerMotion],
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const row = getRowFromTarget(event.target);
      if (row) activateRow(row);
    },
    [activateRow, getRowFromTarget],
  );

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    scheduleHide();
  }, [scheduleHide]);

  const glassStyle = {
    "--liquid-glass-highlight-y": `${motionState.originY}%`,
    "--liquid-glass-highlight-opacity": visible ? "1" : "0",
    transformOrigin: `${motionState.originX}% ${motionState.originY}%`,
  } as CSSProperties;

  return (
    <div
      ref={scopeRef}
      className={`liquid-glass-hover-scope ${className}`.trim()}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPointerLeave={scheduleHide}
      onPointerMove={handlePointerMove}
      onPointerOver={handlePointerOver}
    >
      <motion.span
        aria-hidden="true"
        className="liquid-glass-hover"
        initial={false}
        animate={{
          height: rect.height,
          left: rect.left,
          opacity: visible ? 1 : 0,
          borderRadius: 16,
          rotateX: reduceMotion ? 0 : motionState.rotateX,
          rotateY: reduceMotion ? 0 : motionState.rotateY,
          top: rect.top,
          width: rect.width,
          x: reduceMotion ? 0 : motionState.shiftX,
          y: reduceMotion ? 0 : motionState.shiftY,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                height: BASE_SPRING,
                left: BASE_SPRING,
                opacity: { duration: 0.8 },
                borderRadius: RADIUS_SPRING,
                rotateX: TILT_SPRING,
                rotateY: TILT_SPRING,
                top: BASE_SPRING,
                width: BASE_SPRING,
                x: SHIFT_SPRING,
                y: SHIFT_SPRING,
              }
        }
        style={glassStyle}
      >
        <span className="liquid-glass-hover__highlight" />
      </motion.span>
      {children}
    </div>
  );
}
