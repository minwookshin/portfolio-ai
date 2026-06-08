"use client";

import type { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

export default function ModalSlot({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode="sync" initial={false}>
      {children}
    </AnimatePresence>
  );
}
