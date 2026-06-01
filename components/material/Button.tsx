"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { springs } from "@/lib/material/motion";

export type ButtonVariant = "elevated" | "filled" | "tonal" | "outlined" | "text";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  elevated: "bg-surface-container-high text-on-surface shadow-md hover:shadow-lg",
  filled: "bg-surface-container-high text-on-surface",
  tonal: "bg-surface-container-high text-on-surface",
  outlined: "bg-surface-container-high text-on-surface",
  text: "bg-surface-container-high text-on-surface",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-7 px-3 text-xs gap-2",
  sm: "h-9 px-4 text-sm gap-2",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-3",
  xl: "h-16 px-8 text-lg gap-3",
};

export function Button({
  variant = "filled",
  size = "md",
  leadingIcon,
  trailingIcon,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      onClick={onClick}
      aria-label={rest["aria-label"]}
      initial={false}
      animate={{ borderRadius: 0 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      transition={springs.pressMorph}
      className={[
        "relative inline-flex items-center justify-center font-normal select-none",
        "transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:opacity-40 disabled:pointer-events-none",
        "before:absolute before:inset-0 before:bg-current before:opacity-0 hover:before:opacity-[0.08] active:before:opacity-[0.10] before:transition-opacity",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {leadingIcon && <span className="relative z-10 inline-flex">{leadingIcon}</span>}
      <span className="relative z-10">{children}</span>
      {trailingIcon && <span className="relative z-10 inline-flex">{trailingIcon}</span>}
    </motion.button>
  );
}
