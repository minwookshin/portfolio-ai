"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { springs } from "@/lib/material/motion";

export interface SplitButtonMenuItem {
  label: string;
  onSelect: () => void;
}

export interface SplitButtonProps {
  label: string;
  onClick: () => void;
  menuItems: SplitButtonMenuItem[];
  className?: string;
}

export function SplitButton({ label, onClick, menuItems, className = "" }: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className={["relative inline-flex items-stretch gap-px", className].join(" ")}>
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={springs.pressMorph}
        className="relative inline-flex items-center h-10 px-5 text-sm font-normal bg-primary text-on-primary rounded-l-shape-full rounded-r-shape-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {label}
      </motion.button>
      <motion.button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        animate={reduce ? undefined : { rotate: open ? 180 : 0, borderRadius: open ? 12 : undefined }}
        transition={springs.pressMorph}
        className="inline-flex items-center justify-center h-10 w-10 bg-primary text-on-primary rounded-r-shape-full rounded-l-shape-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={springs.spatialFast}
            className="absolute top-full right-0 mt-2 min-w-[10rem] bg-surface-container-high text-on-surface rounded-shape-md shadow-lg overflow-hidden z-20"
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onSelect();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container outline-none focus-visible:bg-surface-container"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
