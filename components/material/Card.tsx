"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { springs } from "@/lib/material/motion";

export interface CardProps {
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

export function Card({ interactive = false, onClick, className = "", children, ...rest }: CardProps) {
  const reduce = useReducedMotion();
  const base = "bg-surface-container text-on-surface rounded-shape-lg p-6";

  if (!interactive) {
    return <div className={[base, className].join(" ")}>{children}</div>;
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={rest["aria-label"]}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={springs.spatialDefault}
      className={[
        base,
        "relative w-full text-left outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-on-surface before:opacity-0 hover:before:opacity-[0.04] active:before:opacity-[0.08] before:transition-opacity",
        className,
      ].join(" ")}
    >
      <span className="relative z-10 block">{children}</span>
    </motion.button>
  );
}
