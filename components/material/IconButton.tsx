"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { springs } from "@/lib/material/motion";
import type { ButtonSize } from "@/components/material/Button";

export interface IconButtonProps {
  "aria-label": string;
  size?: ButtonSize;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-7 w-7",
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
};

export function IconButton({
  size = "md",
  selected = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  children,
  ...rest
}: IconButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      aria-label={rest["aria-label"]}
      aria-pressed={selected}
      data-size={size}
      disabled={disabled}
      onClick={onClick}
      initial={false}
      animate={{ borderRadius: 0 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.92 }}
      transition={springs.pressMorph}
      className={[
        "relative inline-flex items-center justify-center outline-none",
        "transition-colors",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:opacity-40 disabled:pointer-events-none",
        "before:absolute before:inset-0 before:bg-current before:opacity-0 hover:before:opacity-[0.08] active:before:opacity-[0.10] before:transition-opacity",
        selected ? "bg-primary text-on-primary" : "bg-transparent text-on-surface",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      <span className="relative z-10 inline-flex">{children}</span>
    </motion.button>
  );
}
