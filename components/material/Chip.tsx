"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { springs } from "@/lib/material/motion";

export interface ChipProps {
  selected?: boolean;
  leadingIcon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

export function Chip({
  selected = false,
  leadingIcon,
  disabled = false,
  onClick,
  className = "",
  children,
}: ChipProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      data-selected={selected}
      disabled={disabled}
      onClick={onClick}
      initial={false}
      whileTap={reduce || disabled ? undefined : { scale: 0.95 }}
      transition={springs.spatialFast}
      className={[
        "relative inline-flex items-center gap-2 h-9 px-4 rounded-shape-sm text-sm font-normal outline-none",
        "transition-colors",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:opacity-40 disabled:pointer-events-none",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0 hover:before:opacity-[0.08] active:before:opacity-[0.10] before:transition-opacity",
        selected
          ? "bg-primary-container text-on-primary-container border border-transparent"
          : "bg-transparent text-on-surface border border-outline",
        className,
      ].join(" ")}
    >
      {leadingIcon && <span className="relative z-10 inline-flex">{leadingIcon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
