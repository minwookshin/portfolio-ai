"use client";

import { ReactNode, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/material/motion";

export interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  trailing?: ReactNode;
  leading?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function TextField({
  value,
  onChange,
  placeholder,
  onSubmit,
  trailing,
  leading,
  className = "",
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { scale: focused ? 1.01 : 1 }}
      transition={springs.spatialFast}
      className={[
        "flex items-center gap-2 w-full bg-surface-container rounded-shape-full px-4 h-14",
        "border transition-colors",
        focused ? "border-primary" : "border-transparent",
        className,
      ].join(" ")}
    >
      {leading && <span className="inline-flex shrink-0">{leading}</span>}
      <input
        aria-label={rest["aria-label"] ?? placeholder}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant text-base"
      />
      {trailing && <span className="inline-flex shrink-0 items-center gap-1">{trailing}</span>}
    </motion.div>
  );
}
