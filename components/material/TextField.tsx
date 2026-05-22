"use client";

import { ReactNode, Ref, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/material/motion";

export interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  trailing?: ReactNode;
  leading?: ReactNode;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
  "aria-label"?: string;
}

export function TextField({
  value,
  onChange,
  placeholder,
  onSubmit,
  onFocus,
  onBlur,
  trailing,
  leading,
  className = "",
  inputRef,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { scale: focused ? 1.01 : 1 }}
      transition={springs.spatialFast}
      className={[
        "relative flex items-center gap-2 w-full bg-surface-container rounded-shape-full pl-7 pr-4 h-14",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-on-surface before:pointer-events-none before:transition-opacity",
        focused ? "before:opacity-[0.06]" : "before:opacity-0",
        className,
      ].join(" ")}
    >
      {leading && <span className="relative z-10 inline-flex shrink-0">{leading}</span>}
      <input
        ref={inputRef}
        aria-label={rest["aria-label"] ?? placeholder}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { setFocused(true); onFocus?.(); }}
        onBlur={() => { setFocused(false); onBlur?.(); }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        className="relative z-10 flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant text-base"
      />
      {trailing && <span className="relative z-10 inline-flex shrink-0 items-center gap-1">{trailing}</span>}
    </motion.div>
  );
}
