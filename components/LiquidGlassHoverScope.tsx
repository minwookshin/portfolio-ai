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
const GLASS_INSET_X = 8;
const GLASS_INSET_Y = 1;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
    const rowRect = row.getBoundingClientRect();

    setRect({
      height: rowRect.height + GLASS_INSET_Y * 2,
      left: rowRect.left - scopeRect.left - GLASS_INSET_X,
      top: rowRect.top - scopeRect.top - GLASS_INSET_Y,
      width: rowRect.width + GLASS_INSET_X * 2,
    });
  }, []);

  const updatePointerMotion = useCallback((event: PointerEvent<HTMLElement>, row: HTMLElement) => {
    if (reduceMotion) return;

    const rowRect = row.getBoundingClientRect();
    const relativeX = clamp((event.clientX - rowRect.left) / rowRect.width, 0, 1);
    const relativeY = clamp((event.clientY - rowRect.top) / rowRect.height, 0, 1);
    const centeredX = relativeX - 0.5;
    const centeredY = relativeY - 0.5;

    setMotionState({
      originX: clamp(42 + relativeX * 16, 42, 58),
      originY: clamp(38 + relativeY * 24, 38, 62),
      rotateX: -centeredY * 1.4,
      rotateY: centeredX * 1.1,
      shiftX: centeredX * 5,
      shiftY: centeredY * 3,
    });
  }, [reduceMotion]);

  const activateRow = useCallback(
    (row: HTMLElement) => {
      clearHideTimer();
      activeRowRef.current = row;
      measureRow(row);
      setVisible(true);
    },
    [clearHideTimer, measureRow],
  );

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setMotionState(initialMotion());
      activeRowRef.current = null;
    }, 180);
  }, [clearHideTimer]);

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
                height: { type: "spring", stiffness: 520, damping: 42, mass: 0.78 },
                left: { type: "spring", stiffness: 520, damping: 42, mass: 0.78 },
                opacity: { duration: 0.18 },
                rotateX: { type: "spring", stiffness: 420, damping: 36, mass: 0.7 },
                rotateY: { type: "spring", stiffness: 420, damping: 36, mass: 0.7 },
                top: { type: "spring", stiffness: 520, damping: 42, mass: 0.78 },
                width: { type: "spring", stiffness: 520, damping: 42, mass: 0.78 },
                x: { type: "spring", stiffness: 420, damping: 36, mass: 0.7 },
                y: { type: "spring", stiffness: 420, damping: 36, mass: 0.7 },
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
