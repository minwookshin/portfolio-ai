"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { springs, tweens } from "@/lib/material/motion";

type CopyTextOptions = {
  notify?: boolean;
};

export function useCopyFeedback() {
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const copyText = useCallback(async (value: string, label: string, options: CopyTextOptions = {}) => {
    const shouldNotify = options.notify ?? true;

    if (!navigator.clipboard?.writeText) {
      if (shouldNotify) notify("copy unavailable");
      return false;
    }

    try {
      await navigator.clipboard.writeText(value);
      if (shouldNotify) notify(`${label} copied`);
      return true;
    } catch {
      if (shouldNotify) notify("copy failed");
      return false;
    }
  }, [notify]);

  return { copyText, notify, toast };
}

export function CopyFeedbackToast({ message }: { message: string | null }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="command-toast"
          initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
          transition={reduceMotion ? tweens.none : springs.spatialFast}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
