"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "[role='button']",
  "summary",
  "label",
  ".cursor-pointer",
  ".home-row",
  ".archive-row",
  ".archive-year",
  ".micro-link",
  ".micro-pressable",
  ".studio-lateral-link",
  ".related-work-link",
  ".portfolio-siri__chip",
  ".lab-study-control",
  ".lab-cursor-target",
  ".lab-hold-action",
  ".lab-hold-action__reset",
  ".lab-hover-row",
  ".lab-loop-panel__control",
].join(",");

const CHIP_SELECTOR = ".home-mention";

const NATIVE_CURSOR_SELECTOR = [
  "input:not([type='button']):not([type='submit']):not([type='reset'])",
  "textarea",
  "[contenteditable='true']",
  "select",
  "option",
  "video",
  "video *",
  "iframe",
  ".dom-cursor-native",
].join(",");

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;

    let frameId = 0;
    let enabled = false;
    let visible = false;
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    const draw = () => {
      if (!enabled) return;

      if (reducedMotionQuery.matches) {
        cursorX = mouseX;
        cursorY = mouseY;
      } else {
        cursorX += (mouseX - cursorX) * 0.35;
        cursorY += (mouseY - cursorY) * 0.35;
      }

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      frameId = window.requestAnimationFrame(draw);
    };

    const setNativeMode = (isNative: boolean) => {
      cursor.classList.toggle("is-native", isNative);
      if (isNative) cursor.classList.remove("is-interactive", "is-chip", "is-pressed");
    };

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!visible) {
        visible = true;
        cursor.classList.add("is-visible");
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        setNativeMode(false);
        cursor.classList.remove("is-interactive", "is-chip");
        return;
      }

      const isNative = Boolean(target.closest(NATIVE_CURSOR_SELECTOR));
      setNativeMode(isNative);

      if (!isNative) {
        cursor.classList.toggle("is-interactive", Boolean(target.closest(INTERACTIVE_SELECTOR)));
        cursor.classList.toggle("is-chip", Boolean(target.closest(CHIP_SELECTOR)));
      }
    };

    const hide = () => {
      visible = false;
      cursor.classList.remove("is-visible", "is-interactive", "is-chip", "is-pressed", "is-native");
    };

    const press = () => {
      if (!cursor.classList.contains("is-native")) cursor.classList.add("is-pressed");
    };

    const release = () => {
      cursor.classList.remove("is-pressed");
    };

    const start = () => {
      if (enabled) return;
      enabled = true;
      root.classList.add("dom-cursor-enabled");
      document.addEventListener("mousemove", handleMove, { passive: true });
      document.addEventListener("mousedown", press);
      document.addEventListener("mouseup", release);
      document.addEventListener("mouseleave", hide);
      window.addEventListener("blur", hide);
      frameId = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      if (!enabled) return;
      enabled = false;
      visible = false;
      root.classList.remove("dom-cursor-enabled");
      cursor.classList.remove("is-visible", "is-interactive", "is-chip", "is-pressed", "is-native");
      cursor.style.transform = "translate3d(-100px, -100px, 0)";
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mousedown", press);
      document.removeEventListener("mouseup", release);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      window.cancelAnimationFrame(frameId);
    };

    const syncPointerMode = () => {
      if (finePointerQuery.matches) {
        start();
      } else {
        stop();
      }
    };

    syncPointerMode();
    finePointerQuery.addEventListener("change", syncPointerMode);

    return () => {
      finePointerQuery.removeEventListener("change", syncPointerMode);
      stop();
    };
  }, []);

  return <div ref={cursorRef} className="dom-cursor" aria-hidden="true" />;
}
