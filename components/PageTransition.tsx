"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { tweens } from "@/lib/material/motion";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduceMotion ? false : { opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : { ...tweens.fast, duration: 0.14 }}
      className="page-transition-shell"
    >
      {children}
    </motion.div>
  );
}
